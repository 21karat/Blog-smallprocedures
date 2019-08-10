//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showPopup: false,
    isAuthor:false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  showRecent: function() {
    wx.navigateTo({
      url: ''
    })
  },
  showCollected: function() {
    wx.navigateTo({
      url: ''
    })
  },
  showAboutMe: function() {
    wx.navigateTo({
      url: ''
    })
  },
  showAboutWechat: function() {
    wx.navigateTo({
      url: ''
    })
  },
  showFormId: function () {
    wx.navigateTo({
      url: ''
    })
  },

  onLoad: function() {
    let that = this;
    app.checkUserInfo(function(userInfo, isLogin) {
      if (!isLogin) {
        that.setData({
          showPopup: true
        })
      } else {
        that.setData({
          userInfo: userInfo
        });
      }
    });

    wxApi.check_author().then(res => { 
      console.info(res.result)
      that.setData({
        isAuthor: res.result
      });
    })

  },
  bindGetUserInfo: function(e) {
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        showPopup: !this.data.showPopup,
        userInfo: e.detail.userInfo
      });
    } else {
      wx.switchTab({
        url: '../index/index'
      })
    }
  },

  /**
   * 返回
   */
  navigateBack: function(e) {
    wx.switchTab({
      url: '../index/index'
    })
  }
})