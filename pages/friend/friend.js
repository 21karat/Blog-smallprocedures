
Page({

  /**
   * 页面的初始数据
   */
  data: {
    luokai:'https://koral.cf/'
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