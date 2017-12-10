// pages/My/My.js
var app = getApp();
Page({
  data: {
    systemInfo: {},
    userInfo: [],
    datas: [],
    page: 1, // 分页页数
    showModalStatus: false,
    selected: true,
    selected1: false,
    selected2: false,
    selected3: false,
    hidden: true,
    showload: true,
    nomore: true,
  },
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  selected: function (e) {
    ajaxReturn(this, { act: 'recipes' });
    this.setData({
      page: 1,
      selected: true,
      selected1: false,
      selected2: false,
      selected3: false
    })
  },
  selected1: function (e) {
    ajaxReturn(this, { act: 'question' });
    this.setData({
      page: 1,
      selected: false,
      selected1: true,
      selected2: false,
      selected3: false
    })
  },
  selected2: function (e) {
    ajaxReturn(this, { act: 'answer' });
    this.setData({
      page: 1,
      selected: false,
      selected1: false,
      selected2: true,
      selected3: false
    })
  },
  selected3: function (e) {
    ajaxReturn(this, { act: 'collection' });
    this.setData({
      page: 1,
      selected: false,
      selected1: false,
      selected2: false,
      selected3: true,
    })
  },
  bindViewTap: function (event) {
    var idimg = event.currentTarget.dataset.img;
    wx.navigateTo({
      url: "../detailmenu/detailmenu?id=" + idimg,
    })
  },
  bindQuestion: function (event) {
    var idimg = event.currentTarget.dataset.img;

    wx.navigateTo({
      url: "../AnswerContent/AnswerContent?id=" + idimg,
    })
  },
  bindQuestion2: function (event) {
    var idimg = event.currentTarget.dataset.img;

    wx.navigateTo({
      url: "../AnswerContent/AnswerContent?id=" + idimg,
    })
  },
  bindanswer: function (event) {
    var idimg = event.currentTarget.dataset.img;
    wx.navigateTo({
      url: "../AnswerContent/AnswerContent?id=" + idimg,
    })
  },



  closeimg: function (event) {
    let that = this;
    var id = event.currentTarget.dataset.id;
    var index = event.currentTarget.dataset.remove;
    var data = that.data.datas;

    wx.showModal({
      title: "确定删除吗？",
      icon: 'success',
      duration: 2000,
      success: function (res) {
        if (res.confirm) {
          if (id) {

            app.ajaxReturn('Recipes/del.html', 'post', { id: id }, function (res) {

            })
          }
          data.splice(index, 1);
          that.setData({
            datas: data,
            showModalStatus: false
          })
        } else if (res.cancel) {

        }
      }

    })

  },
  closequesyion: function (event) {
    var that = this;
    var id = event.currentTarget.dataset.id;
    var index = event.currentTarget.dataset.remove;
    var data = this.data.datas;
    wx.showModal({
      title: "确定删除吗？",
      icon: 'success',
      duration: 2000,
      success: function (res) {
        if (res.confirm) {
          if (id) {
            app.ajaxReturn('Question/del.html', 'post', { id: id }, function (res) {

            })
          }

          data.splice(index, 1);
          that.setData({
            datas: data,
            showModalStatus: false
          })
        } else if (res.cancel) {

        }
      }

    })
  },
  closeAnswers: function (event) {
    var that = this;
    var id = event.currentTarget.dataset.id;
    var index = event.currentTarget.dataset.remove;
    var data = this.data.datas;

    if (id) {
      app.ajaxReturn('Answers/del.html', 'post', { id: id }, function (res) {
  
      })
    }
    wx.showModal({
      title: "确定删除吗？",
      icon: 'success',
      duration: 2000,
      success: function (res) {
        if (id) {
          app.ajaxReturn('Answers/del.html', 'post', { id: id }, function (res) {
            
          })
        }
        if (res.confirm) {
          data.splice(index, 1);
          that.setData({
            datas: data,
            showModalStatus: false
          })
        } else if (res.cancel) {

        }
      }

    })

  },
  closecloect: function (event) {
    var that = this;
    var id = event.currentTarget.dataset.id;
   
    var index = event.currentTarget.dataset.remove;
    var data = this.data.datas;


    wx.showModal({
      title: "确定删除吗？",
      icon: 'success',
      duration: 2000,
      success: function (res) {
        if (res.confirm) {
          if (id) {
            app.ajaxReturn('Userhandle/user_Handle.html', 'post', { oid: id, type: 5 }, function (res) {
             
            })
          }
          data.splice(index, 1);
            // for(var i in data){
            //   data[]
            // }
          data.splice(index, 1);
          that.setData({
            datas: data,
            showModalStatus: false
          })
        } else if (res.cancel) {

        }
      }

    })
  },

  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      page: 1,
      hidden: false,
      nomore: true
    });
    setTimeout(function () {
      if (that.data.selected) {
        ajaxReturn(that, { act: 'recipes' });
      } else if (that.data.selected1) {
        ajaxReturn(that, { act: 'question' });
      } else if (that.data.selected2) {
        ajaxReturn(that, { act: 'answer' });
      } else {
        ajaxReturn(that, { act: 'collection' });
      }
      that.setData({
        hidden: true
      })
      wx.stopPullDownRefresh()
    }, 1000)
    
  },

  //上拉加载
  onReachBottom: function () {
    var that = this;
    var tool = that.data.total+1;
    that.setData({
      showload: false,
    });
    var page = ++this.data.page;

    if (that.data.iscon == page) {
      return false;
    }
    if (tool< page) {
      that.setData({
        showload: true,
        nomore: false,
      });
      return false;
    }
    if (that.data.selected) {
      ajaxReturn(that, { act: 'recipes', page: page }, 1);
      that.setData({
        showload: true,
      });
    } else if (that.data.selected1) {
      that.setData({
        showload: true,
      });
      ajaxReturn(that, { act: 'question', page: page }, 1);
    } else if (that.data.selected2) {
      that.setData({
        showload: true,
      });
      ajaxReturn(that, { act: 'answer', page: page }, 1);
    } else {
      that.setData({
        showload: true,
      });
      ajaxReturn(that, { act: 'collection', page: page }, 1);
    }
  },
  //分享
  onShareAppMessage: function () {
    return {
      title: '点指星球',
      path: 'pages/My/My',
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
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          systemInfo: res
        })
      }
    })
    ajaxReturn(that, { act: 'recipes' });
    that.setData({
      title: options.title,
      userInfo: wx.getStorageSync('userInfo')
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
  }
})


function ajaxReturn(obj, data, have) {
  var that = this;
  // datas:[]不累加
  if (!have) {
    obj.setData({
      datas: [],
      total: 0
    })
  }

  app.ajaxReturn('my/showMyInfo', 'get', data, function (res) {
    var data = res.data.list;
    var ret = [];
    if (res.status == 0) {

      if (data) {
        for (var i in data) {
          if (data[i].cover) {
            data[i].cover = app.getImgUrl(data[i].cover);
            
          }
        }

        ret = data;
        if (have) {
          ret = obj.data.datas.concat(ret);
        }
       


        obj.setData({
          datas: ret,
          total: res.data.tool,
          nomore: true
        })
      }

    } else {
      obj.setData({
        nomore: false,
      });
    }

  });
}
