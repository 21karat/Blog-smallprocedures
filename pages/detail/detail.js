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
    //1.默认值初始化
    let blogId = options.blogId;
    // 判断是否已经授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
              // 根据自己的需求有其他操作再补充
              // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
              console.log("获取用户信息成功1:", res);
              console.log("avatarUrl:", res.userInfo.avatarUrl);
              console.log("nickName:", res.userInfo.nickName);
              wx.login({
                success: res => {
                  console.log("获取用户信息成功2:", res)
                  // 获取到用户的 code 之后：res.code
                  console.log("用户的code:" + res.code);
                  // 可以传给后台，再经过解析获取用户的 openid
                  // 或者可以直接使用微信的提供的接口直接获取 openid ，方法如下：
                  wx.request({
                    // 自行补上自己的 APPID 和 SECRET
                    url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxd7c8e803703c3868&secret=bf286bf21e998d272f5319db1a2dd9b0&js_code=' + res.code + '&grant_type=authorization_code',
                    success: res => {
                      // 获取到用户的 openid
                      console.log("用户的openid:" + res.data.openid);
                      wx.request({
                        url: 'http://localhost:8080/getUserByOpenId?openId=' + res.data.openid,
                        success: res => {
                          console.log("openId:" + res.data.user.openId);
                          if (res.data.state) {
                            //查看博客详情
                            that.getData(blogId);
                            that.setData({
                              author: res.data.user.openId,
                            });
                          }
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        } else {
          // 用户没有授权
          // 改变 isHide 的值，显示授权页面
          wx.redirectTo({
            url: '../login/login',//授权页面
          })
        }
      }
    });
    //3.更新浏览量
    //wxApi.upsertPostsStatistics([blogId, 1, 0, 0]).then(res => { })
    //4.文章详情初始化
    //that.getData(blogId);
    //5.收藏状态初始化
    //that.getPostsCollected(blogId);
    //6.初始化喜欢状态
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
      url: 'http://localhost:8080/getCommentByBlog',
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
    //请求数据
    var content = e.detail.value.inputComment
    var blogId = that.data.post.id
    var openId = that.data.author
    wx.request({
      url: 'http://localhost:8080/addComment',
      data: {
        "blogId": blogId,
        "openId": openId,
        "content":content
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        //请求成功打印
        console.log(res);
        //定时器
        var timeOut = setTimeout(function () {
          console.log("延迟调用============")
          wx.hideLoading()
          wx.showToast({
            title: "评论已提交",
            icon: 'loading...',//图标，支持"success"、"loading" 
            duration: 2000,//提示的延迟时间，单位毫秒，默认：1500 
            mask: false,//是否显示透明蒙层，防止触摸穿透，默认：false
          })
          //刷新评论
          that.onReachBottom();
        }, 1000)
        that.setData({
          placeholder: "评论...",
          commentContent: ""
        })
      },
    })
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
