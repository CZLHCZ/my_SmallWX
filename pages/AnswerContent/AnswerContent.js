// pages/AnswerContent/AnswerContent.js
var app = getApp();
var url = 'https://api.dzbake.com/api.php/';

Page({
  data: {
    detailData: {},
    answers: [],
    addimg: [{id:0},],
    img: [],
    aloneimg: [],
    imgs: [],
    qid: null,
    input: [],
    datas: {},
    showView: false,
    showViewlist: false,
    swiperimg: [],
    addimg_id: 0,
  },

  //放大图片
  enlargeimg: function (e) {
    var that = this
      , index = e.currentTarget.dataset.index,
      pictures = that.data.detailData.imgs;
    wx.previewImage({
      current: pictures[index],
      urls: pictures
    })
  },
  enlargeimglist: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var idx = e.currentTarget.dataset.idx
    var pictures = that.data.answers[idx].imgs;
    wx.previewImage({
      current: pictures[index],
      urls: pictures
    })
  },
  // 点赞列表
  praise: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;     
    var like = e.currentTarget.dataset.like;
    var index = e.currentTarget.dataset.index;    
    var newArr = that.data.answers; 
    var oldNum = parseInt(newArr[index].like_num);
    var num = 0;
    if (like > 0) {
      newArr[index].setlike = 0;
      num = (parseInt(newArr[index].like_num) - 1);
    } else {
      newArr[index].setlike = 1;
      num = (parseInt(newArr[index].like_num) + 1);
    }
    newArr[index].like_num = num;
    that.setData({
      answers: newArr
    });
    app.ajaxReturn('/Userhandle/user_Handle' + '.html', 'get', { oid: id, type: 4 }, function (res) {
      if (res.status) {
        that.setData({
          answers: oldNum
        });
      }
    })
  },
  //添加图片

  addimgdata: function () {
    var that = this;
    that.data.addimg_id++;
    //要增加的数组
    var newaddimgarray = [{
      id: that.data.addimg_id,
    }];
    that.data.addimg = that.data.addimg.concat(newaddimgarray);
    that.setData({
      addimg: that.data.addimg
    });
  },
  removeimg: function (event) {
    var self = this;
    var id = parseInt(event.currentTarget.dataset.id);
    var data = self.data.addimg;
    var removeimg = self.data.img;
    self.data.addimg_id--;
    data.splice(id, 1)
    removeimg.splice(id, 1)
    self.data.imgs.splice(id , 1);
    self.setData({
      addimg: data,
      img: removeimg,
      imgs: self.data.imgs
    })
  },
  //alone one img
  aloneimg: function (event) {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseimg('album', event)
          } else if (res.tapIndex == 1) {
            _this.chooseimg('camera', event)
          }
        }
      }
    })
  },

  chooseimg: function (type, e) {
    let _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        var file = res.tempFilePaths['0'];
        upload(file, 'question', function (res) {
          var res = JSON.parse(res);
          // _this.data.imgs[0] = res.data;
          _this.data.imgs = _this.data.imgs.concat(res.data)

        });
        // _this.data.aloneimg = _this.data.aloneimg.concat(file)
        _this.setData({
          aloneimg: file,
        })
      }
    })
  },
  // 上传图片
  chooseImageTap: function (event) {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {

        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album', event)
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera', event)
          }
        }
      }
    })
  },

  chooseWxImage: function (type, e) {
    let _this = this;
    let it = e.currentTarget.dataset.it;

    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        var file = res.tempFilePaths['0'];

        upload(file, 'question', function (res) {
          var res = JSON.parse(res);
          _this.data.imgs[it] = res.data;
        });
        _this.data.img = _this.data.img.concat(file);
        _this.setData({
          img: _this.data.img,
        })
      }
    })
  },
  //获取input的值

  inputcomment: function (e) {
    this.data.input = e.detail.value
  },



  //提交
  EventHandle: function (e) {
    //请求服务器
    var that = this;

    if (this.data.input == '') {
      wx.showModal({
        title: '提示',
        content: '请输入内容!',
        showCancel: false,
      });
    } else {
      var para = { qid: this.data.qid, content: this.data.input, imgs: this.data.imgs }

      var lent = this.data.answers.length;
      var userInfo = wx.getStorageSync('userInfo');
      var time = CurentTime();
      app.ajaxReturn('Answers/add.html', 'post', para, function (res) {
        if (!res.status) {
          wx.showModal({
            title: '提示',
            content: res.msg,
            showCancel: false,
            success: function (ret) {
              var aloneimg = that.data.aloneimg

              if (aloneimg == "https://api.dzbake.com/Public/xcx/img/tans.png") {
                that.data.imgs = that.data.img
              } else {
                that.data.imgs = that.data.img.concat(that.data.aloneimg);
              }

              that.data.answers[lent] = { avatarurl: userInfo.avatarUrl, nickname: userInfo.nickName, create_time: time, content: that.data.input, like_num: 0, imgs: that.data.imgs, setlike: 0, id: res.data}
              that.setData({
                answers: that.data.answers,
                addimg: [{},],
                img: [],
                aloneimg: 'https://api.dzbake.com/Public/xcx/img/tans.png',
                imgs: [],
                input: [],
                datas: {},
                inputValue: '',
                addimg_id: 0,
              });
            }
          });

        }
      });
    }
  },
  //分享
  onShareAppMessage: function () {
    var that = this;
    var title = that.data.detailData.title;
    return {
      title: title,
      path: 'pages/AnswerContent/AnswerContent?id=' + that.data.qid,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      },
      complete: function () {
      },
    }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    showView: (options.showView == "true" ? true : false);
    showViewlist: (options.showViewlist == "true" ? true : false);
    that.data.qid = options.id;


    app.ajaxReturn('Question/detail/oid/' + that.data.qid + '.html', 'get', {}, function (res) {
      if (res.status == 0) {
        if (res.data.imgs) {
          var imgs = res.data.imgs;
          for (var i in imgs) {
            res.data.imgs[i] = app.getImgUrl(imgs[i]);
          }
        }

        that.setData({
          detailData: res.data
        });
      } else if (res.status == 1) {
        wx.showModal({
          title: '提示',
          content: '该提问不存在!',
          showCancel: false,
        });
      }
    })
    app.ajaxReturn('Answers/getanswers/qid/' + that.data.qid + '.html', 'get', {}, function (res) {
      if (res.status == 0) {
        for (var j in res.data) {
          var imgs = res.data[j].imgs;
          if (imgs) {
            for (var i in imgs) {
              res.data[j].imgs[i] = app.getImgUrl(imgs[i]);
            }
          }
        }

        that.setData({
          answers: res.data
        });
      }
    })
  },

  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})
function upload(file, path, callback) {
  wx.showToast({
    icon: "loading",
    title: "正在上传"
  }),
    wx.uploadFile({
      url: url + 'Public/upload/path/' + path + '.html',//接口
      filePath: file,
      name: 'file',
      header: { "Content-Type": "multipart/form-data" },
      formData: {
        //和服务器约定的token, 一般也可以放在header中
        'session_token': wx.getStorageSync('session_token')
      },
      success: function (res) {
        callback(res.data);

      },
      fail: function (e) {

        wx.showModal({
          title: '提示',
          content: '雨辰上传失败',
          showCancel: false
        })
      },
      complete: function () {
        wx.hideToast();  //隐藏Toast
      }
    })
}
function CurentTime(addtime) {
  var now = new Date();
  var year = now.getFullYear();       //年   
  var month = now.getMonth() + 1;     //月   
  var day = now.getDate();            //日
  var clock = year + "-";
  if (month < 10) {
    clock += "0";
    clock += month + "-";
  } else {
    clock += month + "-";
  }
  if (day < 10) {
    clock += "0";
    clock += day + " ";

  } else {
    clock += day + " ";
  }
  return (clock);
}   