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
    post: {},//博客
    author: "",//用户信息
    iconContact: "",
    iconColock: "",
    collected: false,
    liked: false,//喜欢状态
    isShow: false,
    comments: [],//评论
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
    //默认值初始化
    let blogId = options.blogId;
    //判断是否已经授权
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
                        url: app.Host +'getUserByOpenId?openId=' + res.data.openid,
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
      url: app.Host +'getCommentByBlog',
      data: {
        "blogId": that.data.post.id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        // 'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        if (res.data.length==0){
          that.setData({
            comments:[],
            nomore: true,
            loading: false,
            nodata: true
          });
        }else{
          that.setData({
            comments: res.data,
            nomore: false,
            loading: false,
            nodata: false
          });
        }
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
      url: app.Host +'addComment',
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
      url: app.Host +'getBlogDetail',
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



  /**
   * 打赏
   */
  reward: function (e) {
    wx.showModal({
      //title: '您的关注是对我最大的打赏',
      content: '您的关注是对我最大的打赏',
      showCancel: false,
      confirmText: '确定',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击了“确定”')
        }
      }
    })
  },
  /**
   *  喜欢按钮操作
   */
  clickLike: function (e) {
    let that = this
    var postsLiked = true;
    that.setData({
      liked: postsLiked
    })
  },
  

  /**
   * 生成图片海报
   */
  bulidImage: function (e) {
    
    var that = this
    that.showHideMenu()

    var defaultImageUrl = that.data.post.url;
    var qrcodeUrl = ""

    if (that.data.showPosterImage === "") {

      wx.showLoading({
        title: "正在生成海报",
        mask: true,
      });
      that.setData({
        showPosterPopup: true
      })
      that.createPosterWithCanvas(defaultImageUrl, qrcodeUrl, that.data.post.title, that.data.post.author)
    } else {
      that.setData({
        showPosterPopup: true
      })
    }
  },

  /**
  * 利用画布生成海报
  */
  createPosterWithCanvas: function (postImageLocal, qrcodeLoal, title, custom_excerpt) {
    var that = this;

    var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle('#ffffff');
    context.fillRect(0, 0, 600, 970);
    context.drawImage(postImageLocal, 0, 0, 600, 300); //绘制首图
    context.drawImage(qrcodeLoal, 210, 650, 180, 180); //绘制二维码
    context.setFillStyle("#000000");
    context.setFontSize(20);
    context.setTextAlign('center');
    context.fillText("阅读文章,请长按识别二维码", 300, 895);
    context.setFillStyle("#000000");
    context.beginPath() //分割线
    context.moveTo(30, 620)
    context.lineTo(570, 620)
    context.stroke();
    context.setTextAlign('left');
    context.setFontSize(40);

    if (title.lengh <= 12) {
      context.fillText(title, 40, 360);
    } else {
      context.fillText(title.substring(0, 12), 40, 360);
      context.fillText(title.substring(12, 26), 40, 410);
    }

    context.setFontSize(20);
    if (custom_excerpt.lengh <= 26) {
      context.fillText(custom_excerpt, 40, 470);
    } else {
      context.fillText(custom_excerpt.substring(0, 26), 40, 470);
      context.fillText(custom_excerpt.substring(26, 50) + '...', 40, 510);
    }

    context.draw();

    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          wx.hideLoading();
          console.log("海报图片路径：" + res.tempFilePath);
          that.setData({
            showPosterPopup: true,
            showPosterImage: res.tempFilePath
          })
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 900);
  },
  /**
   * 取消保存海报图片
   */
  cacenlPosterImage: function () {
    this.setData({
      showPosterPopup: false
    })
  },
  /**
   * 保存海报图片
   */
  savePosterImage: function () {
    let that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.showPosterImage,
      success(result) {
        console.log(result)
        wx.showModal({
          title: '提示',
          content: '二维码海报已存入手机相册，赶快分享到朋友圈吧',
          showCancel: false,
          success: function (res) {
            that.setData({
              showPosterPopup: false
            })
          }
        })
      },
      fail: function (err) {
        console.log(err);
        if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
          console.log("再次发起授权");
          wx.showModal({
            title: '用户未授权',
            content: '如需保存海报图片到相册，需获取授权.是否在授权管理中选中“保存到相册”?',
            showCancel: true,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.openSetting({
                  success: function success(res) {
                    console.log('打开设置', res.authSetting);
                    wx.openSetting({
                      success(settingdata) {
                        console.log(settingdata)
                        if (settingdata.authSetting['scope.writePhotosAlbum']) {
                          console.log('获取保存到相册权限成功');
                        } else {
                          console.log('获取保存到相册权限失败');
                        }
                      }
                    })

                  }
                });
              }
            }
          })
        }
      }
    });
  }
})
