//index.js
//获取应用实例
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
    comments: [],
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
    
  },
  /**
   * 发送按钮提交
   */
  formSubmit: function (e) {

    wx.showLoading({
      title: '评论提交中',
    })

    var that = this
    var comment = e.detail.value.inputComment;

    //优先保存formId
    console.info(e.detail.formId)
    if (e.detail != undefined && e.detail.formId != undefined) {
      var data = {
        formId: e.detail.formId,
        author: 0,
        timestamp: new Date().getTime()
      }
      wxApi.insertFormIds(data).then(res => {
        console.info(res)
      })
    }

    if (comment == undefined || comment.length == 0) {
      wx.hideLoading()
      return
    }

    var commentId = that.data.commentId
    var toName = that.data.toName
    var toOpenId = that.data.toOpenId
    if (commentId === "") {
      var data = {
        postId: that.data.post.id,
        cNickName: app.globalData.userInfo.nickName,
        cAvatarUrl: app.globalData.userInfo.avatarUrl,
        timestamp: new Date().getTime(),
        createDate: util.formatTime(new Date()),
        comment: comment,
        childComment: [],
        flag: 0
      }
      //调接口
      
    } else {
      var childData = [{
        cOpenId: app.globalData.openid,
        cNickName: app.globalData.userInfo.nickName,
        cAvatarUrl: app.globalData.userInfo.avatarUrl,
        timestamp: new Date().getTime(), //new Date(),
        createDate: util.formatTime(new Date()),
        comment: comment,
        tNickName: toName,
        tOpenId: toOpenId,
        flag: 0
      }]
      console.info(commentId)
      console.info(childData)
      //调接口
    }
  },
  /**
   * 获取文章数据
   */
  getData: function (blogId) {
    let that = this;
    console.log("文章信息开始获取");
    wx.request({
      url: 'http://localhost:8080/getBlogDetail',
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
