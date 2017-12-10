var app = getApp();
var inputContent = {};
var url = 'https://api.dzbake.com/api.php/';
Page({
  data: {
    inputContent: {},
    texts: [],
    usekeylist: [
    ],
    steplist: {
      imgs: [],
      inputs: [{},]
    },
    userInfo: {},
    title: [],
    use: {},
    upuse: [],
    step: {},
    cover: [],
    tips:[],
  },
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //封面

  coverimage: function () {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
        
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.coverWxImage('album')
          } else if (res.tapIndex == 1) {
            _this.coverWxImage('camera')
          }
        }
      }
    })
  },
  coverWxImage: function (type) {
    let _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        // //上传
        var tempFilePaths = res.tempFilePaths['0'];
        upload(tempFilePaths, 'recipes', function (ret) {
          var res = JSON.parse(ret.data);
          _this.data.cover = res.data;
        });
        _this.setData({
          flag: 'hide',
          logo: tempFilePaths
        })
      }
    })
  },
  //步骤一
  steponeimage: function () {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
       
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.steponeWxImage('album')
          } else if (res.tapIndex == 1) {
            _this.steponeWxImage('camera')
          }
        }
      }
    })
  },
  steponeWxImage: function (type) {
    let _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        //上传
        var tempFilePaths = res.tempFilePaths['0'];
        upload(tempFilePaths, 'recipes', function (ret) {
          var res = JSON.parse(ret.data);
          _this.data.step = res.data;
        });
        _this.setData({
          flagstep: 'hide',
          stepone: res.tempFilePaths[0],

        })
      }
    })
  },
  // 上传多步骤图片
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
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        var index = parseInt(e.currentTarget.dataset.it);
        var stepnumber = 'step' + (index + 1);
        var file = res.tempFilePaths['0'];

        upload(file, 'stup', function (res) {
          var ret = JSON.parse(res.data);
          if (_this.data.step[stepnumber]) {
            _this.data.step[stepnumber].img = file;
            _this.data.step[stepnumber].simg = ret.data;
          } else {
            _this.data.step[stepnumber] = {
              img: file,
              simg: ret.data,
            };
          }
        });

        _this.data.steplist.imgs[index] = file;//_this.data.steplist.imgs.concat(file);


        _this.setData({
          steplist: _this.data.steplist,
        })
      }
    })
  },
  //添加列表

  //添加数组
  userkey_id: 0,
  usekey_addnewdata: function () {
    var self = this;
    self.userkey_id++;
    //要增加的数组
    var newarray = [{
      id: self.userkey_id,
      name: '食材',
      count: 2
    }];
    this.data.usekeylist = this.data.usekeylist.concat(newarray);
    this.setData({
      'usekeylist': this.data.usekeylist
    });

  },
  removelist: function (event) {
    var self = this;
    var id = event.currentTarget.dataset.remove;
    var data = self.data.usekeylist;
    self.userkey_id--;
    data.splice(id, 1)
    this.setData({
      num: event.currentTarget.dataset.id,
      'usekeylist': data,
    })
  },
  
  //添加步骤
  step_id: 0,
  addstepdata: function () {
    var that = this;
    that.step_id++;
    //要增加的数组
    var newsteparray = [{
      id: that.step_id,
      name: '步骤',
      
    }];
    this.data.steplist.inputs = that.data.steplist.inputs.concat(newsteparray);
    this.setData({
      'steplist.inputs': this.data.steplist.inputs
    });
  },
  //删除step
  removestep: function (event) {
    var self = this;
    var id = parseInt(event.currentTarget.dataset.remove)
    var data = self.data.steplist.inputs;
    var Img = self.data.steplist.imgs;
  
    self.step_id--;
    Img.splice(id, 1);
    data.splice(id, 1);
    this.setData({
      'steplist.inputs': data,
      'steplist.imgs': Img,

    })
  },
  //获取input的值
  inputtitle: function (e) {
    this.data.title = e.detail.value;
    // this.setData({
    //   'title': this.data.title
    // })
  },

  //食材
  inputname: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.num);
    var usenumber = 'use' + (index + 1);
    that.data.use[usenumber] = {
      name: e.detail.value
    };

  },
  //用量
  inputnum: function (e) {
    var num = e.detail.value
    var index = parseInt(e.currentTarget.dataset.num);
    var usenumber = 'use' + (index + 1);
    this.data.use[usenumber].num = e.detail.value;
  },
  //获取步骤input值
  stepinput: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.it);
    var stepnumber = 'step' + (index + 1);
    if (that.data.step[stepnumber]) {
      that.data.step[stepnumber].step = e.detail.value;
    } else {
      that.data.step[stepnumber] = { step: e.detail.value };
    }

  },
  inputtips: function (e) {
    var tips = e.detail.value
    this.setData({
      tips: e.detail.value
    })
  },
  clickButton: function () {
    var use = this.data.use;
    var step = this.data.step;
    var fuse = '',
      fstep = '',
      isstepnull = 0;
    for (var i in use) {
      fuse += use[i].name + ':' + use[i].num + ',';//{name:use[i].name, num:use[i].num});
    }
    for (var i in step) {
      if (!step[i].step) {
        isstepnull = 1;
      }
      if (!step[i].simg) {
        step[i].simg = '';
      }
      fstep += step[i].simg + ':' + step[i].step + ',';//{name:use[i].name, num:use[i].num});
    }

    if (isstepnull) {
      wx.showModal({
        title: '提示',
        content: '请输入步骤说明',
        showCancel: false,
        success: function (ret) {

        }
      });
    } else {
      var para = { title: this.data.title, cover: this.data.cover, use: fuse, step: fstep, tips: this.data.tips };
      var that = this

      app.ajaxReturn('Recipes/add.html', 'post', para, function (res) {

        wx.showModal({
          title: '提示',
          content: res.msg,
          showCancel: false,
          success: function (ret) {
            if (ret.confirm && res.status == 0) {
              that.setData({
                steplist: {
                  imgs: ['https://api.dzbake.com/Public/xcx/img/tans.png'],
                  inputs: [{},]
                },
              })
              that.setData({
                inputValue: '',
                inputContent: {},
                texts: [],
                usekeylist: [
                ],
                steplist: {
                  imgs: [],
                  inputs: [{},]
                },
                userInfo: {},
                title: [],
                use: {},
                upuse: [],
                step: {},
                cover: [],
                tips:[],
                logo: 'https://api.dzbake.com/Public/xcx/img/tans.png',
              });

              wx.navigateTo({
                url: "../detailmenu/detailmenu?id=" + res.data,
                success: function (res) {
                },
                fail: function (res) {
                }
              })
            }

          },

        })
      });
    }
  },
  //分享
  onShareAppMessage: function () {
    return {
      title: '点指星球',
      path: 'pages/UploadMenu/UploadMenu',
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


    this.setData({
      title: options.title,

    });
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
  },


})
// page
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
        callback(res);

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