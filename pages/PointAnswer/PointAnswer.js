// pages/PointAnswer/PointAnswer.js
var app = getApp();
Page({
  data: {
    systemInfo: {},
    user: '',
    inputContent: {},
    datas: [],
    page: 1, // 分页页数
    index: 0,
    tool: 0,
    iscon: 1,
    scrollTop: 0,
    scrollHeight: 0,
    refreshAnimation: {},
    show: true,
    selectedhot: true,
    keyword: '',//关键
  },

  bclick: function (e) {
    this.setData({
      selected: true,
      focus: true,
    })
  },

  //显示加载按钮
  selected_hot: function (e) {
    this.data.index = e.currentTarget.dataset.index;
    ajaxReturn(this, { order: this.data.index });
    this.setData({
      page: 1,
      show: true,
      selectedhot: true,
      selectednew: false,
    })
  },
  selected_new: function (e) {
    this.data.index = e.currentTarget.dataset.index;
    ajaxReturn(this, { order: this.data.index });
    this.setData({
      page: 1,
      show: true,
      selectedhot: false,
      selectednew: true,
    })
  },
  //搜索
  inputblur: function () {
    this.setData({
      selected: false,
      inputValue: ''
    })
  },
  clickcancel: function () {
    this.setData({
      show: true,
      selected: false,
      inputValue: '',
      page: 1,
      keyword: '',
    });
    ajaxReturn(this);
  },
  bindInput: function (e) {
    var value = JSON.stringify(e.detail.value);

    this.setData({
      inputValue: e.detail.value
    })

  },
  bindconfirm: function (e) {
    var that = this;
    var title = e.detail.value;
    wx.showToast({
      title: title,
      icon: 'loading',
      duration: 1000
    });
    that.setData({
      page: 1
    })
    if (title == '') {
      ajaxReturn(this);
      that.setData({
        keyword: '',
        show: true,
        selected: false,
        inputValue: '',
        page: 1,
      })
    } else {
      app.ajaxReturn('Search/search', 'get', { type: 2, keyword: title }, function (res) {
        var data = res.data.list;
        if (res.status) {
          data = [];
        }
        that.setData({
          datas: data,
          keyword: title,
          tool: res.data.tool
        })
      });
    }


  },
  //我要提问跳转
  myanswer: function () {
    wx.navigateTo({
      url: "../answerdetail/answerdetail",
    })

  },
  AnswerContent: function (e) {
    let id = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: "../AnswerContent/AnswerContent?id=" + id
    })

  },
  clickButton: function () {
    var user = wx.setStorageSync('user', this.data.user);

  },
  inputUser: function (e) {
    this.setData({
      user: e.detail.value
    })
  },
  bindChange: function (e) {
    inputContent[e.currentTarget.id] = e.detail.value
  },

  //下拉帅新
  onPullDownRefresh: function (e) {
    var that = this;
    that.setData({
      hidden: false,
      show: true,
      selected: false,
      inputValue: '',
      page: 1,
      keyword: '',
    });

    setTimeout(function () {
      ajaxReturn(that, { order: that.data.index });
      that.setData({
        hidden: true,
      });
      wx.stopPullDownRefresh()
    }, 1000)

  },
  //上拉加载
  onReachBottom: function () {
    var page = ++this.data.page;
    var that = this;
    var tool = that.data.tool + 1;
    if (tool < page) {
      this.setData({
        show: false,
      })
      return false;

    }
    if (this.data.iscon == page) {
      this.setData({
        show: false,
      })
      return false;
    }
    if (that.data.keyword.length > 0) {
      app.ajaxReturn('Search/search', 'get', { type: 2, keyword: that.data.keyword, page: page, order: that.data.index }, function (res) {
        var data = res.data;
        if (data.tool <that.data.page) {
          this.setData({
            show: false,
          })
          return false;
        }
        // if (res.status) {
        //   data = [];
        // };
        that.setData({
          datas: data,
          keyword: that.data.keyword,
          tool: res.data.tool
        });
      });
    } else {
      ajaxReturn(that, { page: page, order: that.data.index}, 1);
      this.setData({
        selected: false,
      });
    }
  },
  //分享
  onShareAppMessage: function () {
    return {
      title: '点指星球',
      path: 'pages/PointAnswer/PointAnswer',
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
    updateRefreshIcon.call(this);
    //获取屏幕高度 
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.screenHeight
        })
      }
    })

    ajaxReturn(this);

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    var that = this;

    that.setData({
      hidden: true
    });

    wx.getStorage({
      key: 'yu',
      success: function (res) {
        var datas = that.data.datas.concat(res.data)
        wx.removeStorage({
          key: 'yu',
          success: function (res) { },
        })
        that.setData({
          datas: datas
        })
      }
    })
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})

function ajaxReturn(that, data, hove) {

  app.ajaxReturn('Question/index.html', 'get', data, function (res) {
    var datas = [];
    if (res.status == 0) {
      datas = res.data.list;
    } else {
      that.setData({
        show: true,
      })
    }
    if (hove) {
      datas = that.data.datas.concat(datas);
    }

    that.setData({
      datas: datas,
      tool: res.data.tool,
      inputValue: '',
    });
  })
}
function updateRefreshIcon() {
  var deg = 0;
  var _this = this;
  var animation = wx.createAnimation({
    duration: 1000
  });
  var timer = setInterval(function () {
    animation.rotateZ(deg).step();//在Z轴旋转一个deg角度 
    deg += 360;
    _this.setData({
      refreshAnimation: animation.export()
    })
  }, 1000);
} 
