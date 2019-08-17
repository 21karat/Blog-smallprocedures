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
  /**
   * 下拉
   */
  lower: function () {
    let that = this;
    if (!that.data.lowerComplete) {
      return;
    }
    if (!that.data.nomore && !that.data.nodata) {
      that.setData({
        loading: true,
        lowerComplete: false
      });
      //请求数据
      that.getData();
      that.setData({
        lowerComplete: true
      });
    }
  },
  /**
  * 点击文章明细
  */
  bindItemTap: function (e) {
    let blogId = e.currentTarget.id;
    wx.navigateTo({
      url: '../detail/detail?blogId='+blogId
    })
  },
  /**
   * 获取列表信息
   */
  getData: function() {
    var that = this;
    let page = that.data.page;
    wx.request({
      url: app.Host +'getBlogList',
      data: {
        "limit": 10,
        "page": page + 1,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        // 'Content-Type': 'application/json'
      },
      success: function (res) {
        // success
        console.log(res);
        if (res.data.blogs == null) {
          that.setData({
            nomore: true
          });
        }
        that.setData({
          posts: res.data.blogs,
          page: res.data.page,
          loading: false
        });
      }
    })
  }
})
