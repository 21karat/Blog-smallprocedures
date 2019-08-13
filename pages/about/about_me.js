
Page({

  /**
   * 页面的初始数据
   */
  data: {
    email:'lijing13949080725@163.com',
    wechat:'21Karat',
    github:'https://github.com/21karat',
    cnblogs:'https://www.cnblogs.com/LJing21/'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  formSubmit: function (e) {
    let that = this;
    if (e.detail != undefined && e.detail.formId != undefined) {
      console.log(e.detail.formId)
    }
  },
  copyDataTap:function(e){
    var data = e.target.dataset.index
    wx.setClipboardData({
      data: data,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) 
          }
        })
      }
    })
  }
})