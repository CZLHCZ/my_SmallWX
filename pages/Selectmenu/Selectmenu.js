// pages/Selectmenu/Selectmenu.js
var url = "https://api.dzbake.com/api.php/";
var app = getApp();
Page({
  data: {
    systemInfo: {},
    focus: false,
    mode: 'aspectFit',
    src: "../img/caiming.png",
    list: [],
    oldlist: [],
    newlist: [],
    page: 1, // 分页页数
    total: 0,
    inputValue: '',
    serach: [],
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    selected: true,
    selected1: false,
    hidden: true,
    nomore:true,
    keyword: '', //搜索关键字
  },

  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  //显示加载
  selected: function (e) {
    getData(this, { order: 0 });
    this.setData({
      page: 1,
      inputValue: '',
      keyword: '',
      nomore:true,
      selected: true,
      selected1: false,
    })
  },
  selected1: function (e) {
    getData(this, { order: 1 });
    this.setData({
      page:1,
      inputValue: '',
      keyword:'',
      nomore: true,
      selected: false,
      selected1: true,
    })
  },

  bclick: function (e) {
    this.setData({
      selectedinput: true,
      focus: true,
    })
  },
  clickcancel: function (e) {
    var that = this;
    getData(that);
    that.setData({
      selectedinput: false,
      inputValue: ''
    })
  },
  inputblur: function () {

    this.setData({
      selectedinput: false,
      inputValue: ''
    })
  },
  bindViewTap: function (event) {
    var idimg = event.currentTarget.dataset.img;
    wx.navigateTo({
      url: "../detailmenu/detailmenu?id=" + idimg,
    })
  },
  //搜索
  bindInput: function (e) {
    var value = JSON.stringify(e.detail.value);

    this.setData({
      inputValue: e.detail.value
    })

  },
  bindconfirm: function (e) {
    var that = this;
    var title = e.detail.value;
    that.setData({
      page: 1,
      nomore: true,
    })
    if (title == '') {
      getData(that);
    } else {
      app.ajaxReturn('Search/search', 'GET', { type: 1, keyword: title, page: this.data.page }, function (res) {
        var data = res.data.list;
        for (var i in data) {
          data[i].cover = app.getImgUrl(data[i].cover)
        }
        if (res.status) {
          data = [];
        }
        that.setData({
          list: data,
          keyword:title
        })
      });
    }
  },
  //上拉加载
  onReachBottom: function () {
    var page = ++this.data.page, tool = this.data.total+1;
    if (tool<= page) {
      this.setData({
        nomore: false,
      })
      return false;
    }
    if (this.data.iscon == page) {

      return false;
    }
    if (this.data.keyword.length > 0){
      app.ajaxReturn('Search/search', 'GET', { type: 1, keyword: title, page: this.data.page,order:1 }, function (res) {
        var data = res.data.list;
        for (var i in data) {
          data[i].cover = app.getImgUrl(data[i].cover)
        }
        if (res.status) {
          data = [];
        }
        that.setData({
          list: data,
          keyword: title
        })
      });
    }else{
      getData(this, { page: page,order:1}, 1);
    }
    // this.data.list += this.data.oldlist
    this.setData({
      list: this.data.list
    })
  },

  //分享

  onShareAppMessage: function () {
    return {
      title: '点指星球',
      page:'pages/Selectmenu/Selectmenu',
      success: function (res) {
        // 转发成功

      },
      fail: function (res) {
        // 转发失败
   
      },
      complete:function(){
       
      },
    }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    updateRefreshIcon.call(this);
    this.setData({
      title: options.title
    });

    var that = this;
    wx.getSystemInfo({
      success: function (res) {
       
        that.setData({
          scrollHeight: res.screenHeight
        })
      }
    })
    //显示广告
    app.ajaxReturn('Ad/index.html', 'get', {}, function (res) {
      var data = res.data;
      var newArray = [];
      if (res.status) {
        data = [];
      } else {
        for (var i in data) {
          newArray[i] = { id: data[i]['id'], img: app.getImgUrl(data[i]['img']) };
        }
      }
      that.setData({
        imgUrls: newArray
      })
    });
    getData(this);
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
function getData(obj, data, have) {
  app.ajaxReturn('Recipes/index.html', 'get', data, function (res) {
    var ret = [];
    var data = res.data.menuinfo;
    if (res.status == 0) {
      if (data) {
        for (var i in data) {
          if (data[i]['title'] == "undefined") {
            data[i]["title"] = '';
          }
        }

      }
      for (var i in data) {
        data[i]['cover'] = app.getImgUrl(data[i]['cover']);
        ret = data;
      }
      if (have) {
        // TODO 合并代码
        ret = obj.data.list.concat(ret)
      }
      obj.setData({
        list: ret,
        total: res.data.tool
      })
    }
  });
}