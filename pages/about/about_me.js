
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    author:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this; 
    wx.request({
      url: 'http://localhost:8080/selectAuthor',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          author: res.data,
        });
      }
    })
  }
})