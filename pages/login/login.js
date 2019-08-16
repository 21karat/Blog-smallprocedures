Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo){
      //允许授权
      console.log(e.detail.userInfo.nickName)
      console.log(e.detail.userInfo.avatarUrl)

      wx.login({
        success: function (res) {
          console.log(res)
          //获取登录的临时凭证
          var code = res.code;
          //调用后端，获取微信的session_key,secret
          wx.request({
            url: 'http://localhost:8080/addUser',
            data: {
              'code': res.code,
              'nickName': e.detail.userInfo.nickName,
              'avatarUrl': e.detail.userInfo.avatarUrl
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              // 'Content-Type': 'application/json'
            },
            method: "POST",
            success: function (result) {
              console.log(result);
              //授权成功跳转个人信息页
              wx.switchTab({
                url: '../mine/mine'
              })
            }
          })
        }
      })
    }else{
      //用户按了拒绝按钮
      wx.showModal({
        title: '友情提示',
        content: '此处操作需要您的基本信息，请点击授权',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  

})