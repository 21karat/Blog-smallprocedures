
//获取应用实例
const app = getApp()
Page({

  data: {
    friend: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.getData();
  },
  getData: function () {
    var that = this;
    wx.request({
      url: 'http://localhost:8080/getFrends',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          friend: res.data,
        });
      }
    })
  }
})