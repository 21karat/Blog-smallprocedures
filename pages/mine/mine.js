//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showPopup: false,
    isAuthor: false
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  showRecent: function () {
    wx.navigateTo({
      url: '../friend/friend'
    })
  },
  showCollected: function () {
    wx.navigateTo({
      url: '../friend/friend'
    })
  },
  showAboutMe: function () {
    wx.navigateTo({
      url: '../about/about_me'
    })
  },
  showAboutWechat: function () {
    wx.navigateTo({
      url: '../about/about_wechat'
    })
  },
  showFormId: function () {
    wx.navigateTo({
      url: '../setting/setting'
    })
  },

  onLoad: function () {
    let that = this;
    

  },
  

  /**
   * 返回
   */
  navigateBack: function (e) {
    wx.switchTab({
      url: '../index/index'
    })
  },
  
})