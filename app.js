//app.js
App({
  globalData: {
    userInfo: null,
    token: null
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    var that = this;
    wx.getStorage({
      key: 'token', success: function (res) {
        that.globalData.token = res.data;
      }
    });

    wx.showToast({
      icon: "loading",
      title: "加载中..."
    })

    wx.login({
      success: function (res) {
        var ret = res;
        wx.getUserInfo({
          success: function (res) {
            var data = res.userInfo;
            wx.setStorage({ key: 'userInfo', data: data });//用户信息存储
            data['code'] = ret.code;
            data['source'] = '小程序';

            if (data['code']) {
              that.ajaxReturn('Public/onLogin.html', 'post', data, function (res) {
                if (res.status == 0) {
                  wx.setStorage({ key: 'token', data: res.data });
                }
              })
            } else {
             
            }
            that.globalData.userInfo = data;
            typeof cb == "function" && cb(that.globalData.userInfo)
          }
        })
      }
    })
  },
  ajaxReturn: function (url, method, bodyParam, callBack, dataType) {
    let that = this;
    wx.getStorage({
      key: 'token', success: function (res) {
        that.globalData.token = res.data;
      }
    });
    url = 'https://api.dzbake.com/api.php/' + url + '?token=' + that.globalData.token;
   
    dataType = dataType ? dataType : 'json';
    wx.showToast({
      icon: "loading",
      title: "加载中..."
    });
    wx.request({
      url: url,
      method: method,
      data: bodyParam,
      dataType: dataType,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        typeof callBack == "function" && callBack(res.data);
      },
      complete: function () {
        wx.hideToast();
      }
    })
  },
  ajaxpointanserReturn: function (url, method, bodyParam, callBack, dataType) {
    let that = this;
    wx.getStorage({
      key: 'token', success: function (res) {
        that.globalData.token = res.data;
      }
    });
    url = 'https://api.dzbake.com/api.php/' + url + '?token=' + that.globalData.token;
   
    dataType = dataType ? dataType : 'json';
   
    wx.request({
      url: url,
      method: method,
      data: bodyParam,
      dataType: dataType,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        typeof callBack == "function" && callBack(res.data);
      },
      complete: function () {
      }
    })
  },
  upload: function (file, path, callback) {
    wx.showToast({
      icon: "loading",
      title: "正在上传"
    }),
      wx.uploadFile({
        url: 'https://api.dzbake.com/api.php/Public/upload/path/' + path + '.html',//接口
        filePath: file,
        name: 'file',
        header: { "Content-Type": "multipart/form-data" },
        formData: {
          //和服务器约定的token, 一般也可以放在header中
          'session_token': wx.getStorageSync('session_token')
        },
        success: function (res) {
          
          typeof callBack === "function" && callBack(res);
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
  },
  getImgUrl: function (path) {
    return 'https://api.dzbake.com/Public/Uploads/' + path;
  },
  // praise: function (oid,num,callback) {
  //   let that = this;
  //   var url = 'https://api.dzbake.com/api.php/Userhandle/user_Handle'
  //   wx.request({
  //     url: url,
  //     method: 'GET',
  //     data: {
  //       oid: oid,
  //       type: num,
  //     },
  //     header: {
  //       'content-type': 'application/json'
  //     },
  //     success: function (res) {
  //       console.log(res)
  //       typeof callBack == "function" && callBack(res.data);


  //     }
  //   })
  // }
  // ,getUserInfo: function (cb) {
  //   var that = this
  //   if (this.globalData.userInfo) {
  //     typeof cb == "function" && cb(this.globalData.userInfo)
  //   } else {
  //     //调用登录接口
  //     wx.login({
  //       success: function (res) {
  //          console.log(res);
  //         wx.getUserInfo({
  //           success: function (res) {
  //             that.globalData.userInfo = res.userInfo
  //             typeof cb == "function" && cb(that.globalData.userInfo)
  //           }
  //         })
  //       }
  //     })
  //   }
  // }
})