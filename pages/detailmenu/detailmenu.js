// pages/detailmenu/detailmenu.js
var app = getApp();
var url = "https://api.dzbake.com/api.php/";
Page({
  data: {
    menudata: [],
    commentdata: [],
    userInfo: [],
    showModalStatus: false,
    detailsrc: "../img/caipu.png",
    animationData: {},
    addimg: [{},],
    img: [],
    aloneimg: [],
    falone: [],
    imgs: [],
    fimgs: [],
    mid: null,
    input: [],
    active: '',
    style_img: '',
    dqimg: [], // 步骤图片组 用于图片预览
    showView: true,
    collectView: true,
    bigenlarge: false,
    enlarge: false,
    swiperimg: [],
    stepimghide: false,

  },

  enlargeimg: function (e) {
    var that = this
      , index = e.currentTarget.dataset.it,
      pictures = this.data.dqimg;
    wx.previewImage({
      current: pictures[index],
      urls: pictures
    })
    // }
    // that.setData({
    //   bigenlarge: (!that.data.bigenlarge)
    // })
  },

  enlargeimglist: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var idx = e.currentTarget.dataset.idx
    // var swiperimg = that.data.commentdata[index].imgs
    var pictures = that.data.commentdata[idx].imgs;
    wx.previewImage({
      current: pictures[index],
      urls: pictures
    })
    // that.setData({
    //   enlarge: (!that.data.enlarge),
    //   swiperimg: this.data.commentdata[index].imgs
    // })
  },
  //弹窗
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;

    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;
    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })
    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })

      //关闭  
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },

  utill: function () {
    this.util('open');
  },
  //收藏
  clickCollect: function (e) {
    let that = this;
    var id = e.currentTarget.dataset.oid;
    var setcollection = e.currentTarget.dataset.setcollection;
    var newactivecollect = this.data.menudata;
    if (setcollection > 0) {
      newactivecollect.setcollection = 0;
    } else {
      newactivecollect.setcollection = 1;
    }
    this.setData({
      menudata: newactivecollect
    });
    app.ajaxReturn('/Userhandle/user_Handle' + '.html', 'post', { oid: id, type: 5 }, function (res) {
      if (res.status == 0) {
        if (res.msg == "取消成功！") {
          res.msg = '取消成功！'
        } else {
          res.msg = '收藏成功！'
        }
        wx.showModal({
          title: res.msg,
          icon: 'success',
          duration: 2000,
          showCancel: false
        })
      }
    })
  },
  // 点赞主体
  clicknice: function (e) {
    let that = this;
    var id = e.currentTarget.dataset.oid;
    var mainlike = e.currentTarget.dataset.mainlike;
    var newmainArr = this.data.menudata;
    if (mainlike > 0) {
      newmainArr.setlike = 0;
    } else {
      newmainArr.setlike = 1;
    }
    this.setData({
      menudata: newmainArr
    });
    app.ajaxReturn('Userhandle/user_Handle/.html', 'post', { type: 1, oid: id }, function (res) {
      if (res.status == 0) {
        if (res.msg == "取消成功！") {
          res.msg = '取消成功！'
        } else {
          res.msg = '点赞成功！'
        }
        wx.showModal({
          title: res.msg,
          icon: 'success',
          duration: 2000,
          showCancel: false
        })
      }

    })
  },
  // 点赞列表
  praise: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var like = e.currentTarget.dataset.like;
    var index = e.currentTarget.dataset.index;
    var newArr = this.data.commentdata;
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

    this.setData({
      commentdata: newArr
    });
    app.ajaxReturn('/Userhandle/user_Handle' + '.html', 'get', { oid: id, type: 2 }, function (res) {
      if (res.status) {
        that.setData({
          commentdata: oldNum
        });
      }
    })
  },
  //添加图片
  addimg_id: 0,
  addimgdata: function () {
    var that = this;
    that.addimg_id++;
    //要增加的数组
    var newaddimgarray = [{
      id: that.addimg_id,
    }];
    that.data.addimg = that.data.addimg.concat(newaddimgarray);
    that.setData({
      addimg: that.data.addimg
    });
  },
  removeimg: function (event) {
    var self = this;
    self.addimg_id--;
    var id = parseInt(event.currentTarget.dataset.id);
    var data = self.data.addimg;
    var removeimg = self.data.img;
    data.splice(id, 1);
    removeimg.splice(id, 1);
    self.data.fimgs.splice(id, 1);

    self.setData({
      addimg: data,
      img: removeimg,
      fimgs: self.data.fimgs
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
          _this.data.falone = _this.data.falone.concat(res.data)

        });
        _this.data.aloneimg = _this.data.aloneimg.concat(file)
        _this.setData({
          aloneimg: _this.data.aloneimg,
          falone: _this.data.falone,
          imgs: _this.data.aloneimg,
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
          _this.data.fimgs = _this.data.fimgs.concat(res.data)
        });

        _this.data.img = _this.data.img.concat(file);

        _this.setData({
          addimg: _this.data.img,
          img: _this.data.img,
          imgs: _this.data.img,
          fimgs: _this.data.fimgs
        })
      }
    })
  },
  //获取input的值

  inputcomment: function (e) {

    this.setData({
      input: e.detail.value
    })
  },

  //提交
  EventHandle: function () {
    //请求服务器
    var that = this;
    that.data.imgs = that.data.img.concat(that.data.aloneimg)
    that.data.fimgs = that.data.fimgs.concat(that.data.falone);
    var para = { mid: that.data.mid, content: that.data.input, imgs: that.data.fimgs }
    app.ajaxReturn('Comment/add.html', 'post', para, function (res) {
      wx.showModal({
        title: '提示',
        content: res.msg,
        showCancel: false
      })
      if (!res.status) {
        var lenght = that.data.commentdata.length;
        that.data.commentdata[lenght] = { id: res.data, nickname: that.data.userInfo.nickName, avatarurl: that.data.userInfo.avatarUrl, content: that.data.input, setlike: 0, like_num: 0, imgs: that.data.imgs }

        that.setData(
          {
            commentdata: that.data.commentdata,
            showModalStatus: false,
            addimg: [{},],
            img: [],
            fimgs: [],
            aloneimg: [],
            input:[],
          }
        )
      }
    });
  },
  //分享
  onShareAppMessage: function () {
    var that=this;
    var title = that.data.menudata.title;

    return {
      title: title,
      page:'pages/detailmenu/detailmenu?id='+this.data.mid,
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
    enlarge: (options.enlarge == "true" ? true : false)
    showView: (options.showView == "true" ? true : false)
    collectView: (options.collectView == "true" ? true : false)
    this.data.mid = options.id;
    this.data.userInfo = wx.getStorageSync('userInfo');
    var that = this;
    var dqimg = [];
    app.ajaxReturn('Recipes/detailsRecipes/oid/' + this.data.mid + '.html', 'get', {}, function (res) {
      if (res.status == 0) {
        if (res.data.cover) {
          var cover = res.data.cover;
          res.data.cover = app.getImgUrl(cover);
        }
        if (res.data.title) {
          if (res.data.title == "undefined") {
            res.data.title = '';
          }
        }
        if (res.data.use) {
          for (var i in res.data.use) {
            if (res.data.use[i].num == "undefined") {
              res.data.use[i].num = '';
            }
            if (res.data.use[i].name == "undefined") {
              res.data.use[i].name = '';
            }
          }
        }
        if (res.data.step) {
          var step = res.data.step;
          for (var i in step) {
            if (step[i].img) {
              res.data.step[i].img = app.getImgUrl(step[i].img);
              dqimg[i] = step[i].img;
            }
            // that.data.menudata=res.data;
            if (res.data.step[i].name == "undefined") {
              res.data.step[i].name = '';
            }
          }
        }
        if (res.data.tips == "") {
          res.data.tips = '';
          that.setData({
            tipshide: "tipshide",
          })
        } 
        that.setData({
          menudata: res.data,
          dqimg: dqimg
        })
      }

    });
    app.ajaxReturn('Comment/getComment' + '.html', 'get', { mid: this.data.mid }, function (res) {
      var ret = res.data;
      if (res.status == 0 && ret) {
        for (var i in ret) {
          if (ret[i]['imgs']) {
            var imgs = ret[i].imgs
            for (var j in imgs) {
              ret[i]['imgs'][j] = app.getImgUrl(imgs[j]);
            }
          }
        }

        that.setData({
          commentdata: ret

        })
      }
    });
    // wx.setNavigationBarTitle({
    //   title: options.title,
    //   success: function (res) {
    //     // success
    //   }
    // })

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function (e) {
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
          content: '上传失败',
          showCancel: false
        })
      },
      complete: function () {
        wx.hideToast();  //隐藏Toast
      }
    })
}
