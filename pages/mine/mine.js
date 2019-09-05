//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    url:"",
    name:""
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  showRecent: function () {
    wx.navigateTo({
      url: '../friend/friend'
    })
  },
  showCollected: function () {
    wx.navigateTo({
      url: '../friend/friend'
    })
  },
  showAboutMe: function () {
    wx.navigateTo({
      url: '../about/about_me'
    })
  },
  showAboutWechat: function () {
    wx.navigateTo({
      url: '../about/about_wechat'
    })
  },

  onLoad: function () {
    var that = this;
    // 判断是否已经授权
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
              // 根据自己的需求有其他操作再补充
              // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
              console.log("获取用户信息成功", res);
              console.log("avatarUrl:", res.userInfo.avatarUrl);
              console.log("nickName:", res.userInfo.nickName);
              wx.login({
                success: res => {
                  console.log("获取用户信息成功", res)
                  // 获取到用户的 code 之后：res.code
                  console.log("用户的code:" + res.code);
                  // 可以传给后台，再经过解析获取用户的 openid
                  // 或者可以直接使用微信的提供的接口直接获取 openid ，方法如下：
                  wx.request({
                    url: app.Host + 'getOpenId',
                    data: {
                      "code": res.code
                    },
                    method: 'POST',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded',
                    },
                    success: function (res) {
                      // 获取到用户的 openid
                      console.log("用户的openid:" + res.data.openid);
                      wx.request({
                        url: app.Host + 'getUserByOpenId?openId=' + res.data.openid,
                        method: 'POST',
                        success: res => {
                          console.log("请求状态:" + res.data.state);
                          console.log("请求状态:" + res.data.user.url);
                          if (res.data.state) {
                            that.setData({
                              url: res.data.user.url,
                              name: res.data.user.name,
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
   * 返回
   */
  navigateBack: function (e) {
    wx.switchTab({
      url: '../index/index'
    })
  },

})