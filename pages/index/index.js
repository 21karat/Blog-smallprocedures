//index.js
//获取应用实例
const app = getApp()

Page({
  /**
   * 初始化数据
   */
  data: {
    posts: [],
    page: 0,
    loading: false,
    nodata: false,
    nomore: false,
    lowerComplete: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    this.getData();
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  /**
  * 点击文章明细
  */
  bindItemTap: function (e) {
    let blogId = e.currentTarget.id;
    wx.navigateTo({
      url: '../detail/detail?blogId=' + blogId
    })
  },
  getData: function() {
    var that = this;
    wx.request({
      url: 'http://localhost:8080/getBlogList',
      data: {

      },
      method: 'POST',
      success: function (res) {
        // success
        console.log(res);
        that.setData({
          posts: res.data.blogs
        });
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  }
})
