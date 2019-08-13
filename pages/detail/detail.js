//index.js
//获取应用实例
const Zan = require('../../dist/index');
const WxParse = require('../../wxParse/wxParse.js');

const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    post: {},
    author: "",
    iconContact: "",
    iconColock: "",
    collected: false,
    liked: false,
    isShow: false,
    comments: {},
    commentsPage: 1,
    commentContent: "",
    isLastCommentPage: false,
    placeholder: "评论...",
    focus: false,
    toName: "",
    toOpenId: "",
    commentId: "",
    menuBackgroup: false,
    loading: false,
    nodata: false,
    nomore: false,
    nodata_str: "暂无评论，赶紧抢沙发吧",
    showPopup: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showPosterPopup: false,
    showPosterImage: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this; 
    // 2.默认值初始化
    let blogId = options.blogId;
    console.log("页面监听开始");
    console.log(blogId);
    that.setData({
      author: "玄冰",
      iconContact: "contact",
      iconColock: "clock"
    })
    // 3.更新浏览量
    //wxApi.upsertPostsStatistics([blogId, 1, 0, 0]).then(res => { })
    // 4.文章详情初始化
    that.getData(blogId);
    // 5.收藏状态初始化
    //that.getPostsCollected(blogId);
    // 6.初始化喜欢状态
    //that.getPostsLiked(blogId);
  },
  /**
   * 底部触发加载评论
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.isLastCommentPage) {
      return;
    }
    that.setData({
      loading: true
    })
    wx.request({
      url: 'https://lj.luokaiii.cn/getCommentByBlog',
      data: {
        "blogId": that.data.post.id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        // 'Content-Type': 'application/json'
      },
      success: function (res) {
        // success
        console.log(res);
        that.setData({
          comments: res.data
        });
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  /**
   * 发送按钮提交
   */
  formSubmit: function (e) {
    wx.showLoading({
      title: '评论提交中',
    })
    var that = this
    
    var content = e.detail.value.inputComment
    var blogId = that.data.post.id

    wx.request({
      url: 'https://lj.luokaiii.cn/addComment',
      data: {
        "blogId": blogId,
        "userId": 1,
        "content":content
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        // 'Content-Type': 'application/json'
      },
      success: function (res) {
        // success
        console.log(res);
        var timeOut = setTimeout(function () {
          console.log("延迟调用============")
          wx.hideLoading()
          wx.showToast({
            title: "评论已提交",
            icon: 'loading...',//图标，支持"success"、"loading" 
            duration: 2000,//提示的延迟时间，单位毫秒，默认：1500 
            mask: false,//是否显示透明蒙层，防止触摸穿透，默认：false
          })
        }, 2000)
        that.setData({
          comments: [],
          commentsPage: 1,
          isLastCommentPage: false,
          toName: "",
          commentId: "",
          placeholder: "评论...",
          commentContent: "",
          loading: true,
          nodata: false,
          nomore: false
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  /**
   * 获取文章数据
   */
  getData: function (blogId) {
    let that = this;
    console.log("文章信息开始获取");
    wx.request({
      url: 'https://lj.luokaiii.cn/getBlogDetail',
      data: {
        "blogId": blogId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        // 'Content-Type': 'application/json'
      },
      success: function (res) {
        // success
        console.log(res);
        that.setData({
          post: res.data.blog
        });
        WxParse.wxParse('article', 'html', res.data.slug, that, 5);
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },

  /**
   * 返回
   */
  navigateBack: function (e) {
    wx.switchTab({
      url: '../index/index'
    })
  },
  /**
   * 是否显示功能菜单
   */
  showHideMenu: function () {
    this.setData({
      isShow: !this.data.isShow,
      isLoad: false,
      menuBackgroup: !this.data.false
    })
  },
  /**
   * 非评论区隐藏菜单
   */
  hiddenMenubox: function () {
    this.setData({
      isShow: false,
      menuBackgroup: false
    })
  },

})
