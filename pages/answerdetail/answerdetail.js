// pages/answerdetail/answerdetail.js
var app = getApp();
var url = 'https://api.dzbake.com/api.php/';

Page({
  data: {
    systemInfo: {},
    userInfo: [],
    addimg: [{},],
    img: [],
    aloneimg: [],
    input: [],
    textreat: [],
    imgs: []
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
    var id = parseInt(event.currentTarget.dataset.id);
    var data = self.data.addimg;
    var removeimg = self.data.img;
    self.addimg_id--;
    data.splice(id, 1)
    removeimg.splice(id, 1)
    self.data.imgs.splice(id,1)
    self.setData({
      addimg: data,
      img: removeimg
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
          // _this.data.imgs[it] = res.data;
          _this.data.imgs = _this.data.imgs.concat(res.data)
        });

        _this.data.img = _this.data.img.concat(file);
        _this.setData({
          img: _this.data.img,
        })
      }
    })
  },


  //获取input的值

  inputanser: function (e) {

    this.data.input = e.detail.value

  },
  inputtextaret: function (e) {
    this.data.textreat = e.detail.value

  },



  //提交
  EventHandle: function () {
    //请求服务器
    var that = this;
    var para = { title: this.data.input, desc_describe: this.data.textreat, imgs: this.data.imgs }
    app.ajaxReturn('Question/add.html', 'post', para, function (res) {
      var aid=res.data;
      wx.showModal({
        title: '提示',
        content: res.msg,
        success: function (ret) {
          if (ret.confirm && res.status == 0) {
            wx.redirectTo({
              url: "../AnswerContent/AnswerContent?id=" + res.data,
              success: function (res) {
             
                var userInfo = wx.getStorageSync('userInfo');
                var newPara = { title: that.data.input, desc_describe: that.data.textreat, imgs: that.data.imgs, avatarUrl: userInfo.avatarUrl, nickname: userInfo.nickName, id: aid};
                wx.setStorage({
                  key: "yu",
                  data: newPara,
                  success: function (res) {
                  }
                })
              },
              fail: function (res) {
              }
            })
          }

        },
        showCancel: false
      })
    });
    //数据存储

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          systemInfo: res
        })
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