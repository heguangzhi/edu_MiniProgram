// pages/my/my.js
var app   = getApp();
var regex = app.globalData.regex;
var pwdLen = app.globalData.pwdLen;

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },
    
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

   },
  
  /**
   * 监听输入
   */
  watchUname: function (event) {
    this.data.uname = event.detail.value;

  },
  watchUpwd: function (event) {
    this.data.upwd = event.detail.value;
  },
  //监听登录
  login: function () {
    var that = this;
    if (!that.data.uname || !that.data.upwd) {
      app.showNone('请输入用户名或密码');
      return;
    }
    if (!regex.test(that.data.uname) || !regex.test(that.data.upwd)) {
      app.showNone('用户名或密码格式错误');
      return;
    }
    wx.login({
      success: function (res) {
        if (res.code) {
          // 后台获取openid和session_key
          wx.request({
            url   : app.globalData.serviceUrl + 'passport.getWxInfo',
            header: app.globalData.header,
            data  : {
              code: res.code
            },
            method: "POST",
            success: function (res) {
              let resData = res.data.data;
              wx.setStorageSync('wxdata', resData);
            },
            fail: function(){
              console.log(res);
              app.showFailure('userInfo error!');
            }
          });

          wx.request({
            url     : app.globalData.serviceUrl + 'passport.login',
            header  : app.globalData.header,
            data    : {
              'uname' : that.data.uname,
              'upwd'  : that.data.upwd
            },
            method  : "POST",
            success : function (res) {
              // console.log(res);
              let resData = res.data.data;
              if (res.data.code == 1) {
                // 用户信息
                wx.setStorageSync('userInfo', resData);
                // 用户授权信息 刷新失效
                app.globalData.header['oauth-token'] = resData.oauth_token + ':' + resData.oauth_token_secret;
                // 授权登录成功字段
                wx.setStorageSync('isLogin', 1);
                // console.log(wx.getStorageSync('isLogin'))
                app.showSuccess('登录成功');
                wx.reLaunch({
                  url: '/pages/home/home'
                })
              } else {
                app.showFailure(res.data.msg);
              }
            },
            fail: function (res) {
              console.log(res);
              app.showFailure('登录失败!');
            }
          });
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },

  bindGetUserInfo: function (e) {
    // // 获得最新的用户信息
    // if (!e.detail.userInfo) {
    //   return;
    // }
    // wx.setStorageSync('wxUserInfo', e.detail);
    // this.getWxInfo(e.detail);
    this.getWxInfo();
  },
  // 获取微信相关信息
  getWxInfo: function () {  // wxUserInfo
    let that = this;
    wx.login({
      success: function (res) {
        // console.log(res.code);
        if (res.code) {
          // 后台获取openid和session_key
          wx.request({
            url   : app.globalData.serviceUrl + 'passport.getWxInfo',
            header: app.globalData.header,
            data  : {
              code: res.code
            },
            method: "POST",
            success: function (res) {
              let resData = res.data.data;
              // console.log(resData);
              wx.getUserInfo({
                success: function (userInfo) {
                  wx.setStorageSync('wxUserInfo', userInfo);
                  // console.log(userInfo)
                  // 微信相关信息存储
                  wx.setStorageSync('wxdata', resData);
                  // console.log(wx.getStorageSync('wxdata'));
                  if (resData.type_uid) { // 有unionid，直接登录，绑定或注册
                    var requestData = {
                      unionid : resData.type_uid,
                      src     : userInfo.userInfo.avatarUrl,
                      openid  : resData.openid,
                    }
                  } else {  // 没有unionid，解密用户信息，获取unionid
                    var requestData = {
                      sKey    : resData.sKey,
                      enc     : userInfo.encryptedData,
                      iv      : userInfo.iv,
                      src     : userInfo.userInfo.avatarUrl,
                      openid  : resData.openid,
                    }
                  }
                  that.loginAndSetStatus(requestData,resData);
                  // console.log(requestData);
                }
              });
            },
            fail: function(){

            }
          })
        } else { 
          console.log('登录失败！' + res.errMsg) 
        }
      }
    })
  },
  // 执行登录操作
  loginAndSetStatus: function (data, wxData) {
    // 后台获取openid和session_key
    wx.request({
      url   : app.globalData.serviceUrl + 'passport.loginMiniPro',
      header: app.globalData.header,
      data  : data,
      method: "POST",
      success: function (res) {
        let resData = res.data.data;
        // console.log(res.data, wxData); 
        if (res.data.code === 1) { // 已绑定账号
          // 用户信息
          wx.setStorageSync('userInfo', resData);
          // 用户授权信息 刷新失效
          app.globalData.header['oauth-token'] = resData.oauth_token + ':' + resData.oauth_token_secret;
          // 授权登录成功字段
          wx.setStorageSync('isLogin', 1);
          app.showSuccess('登录成功！');
          // wx.navigateBack({});
          wx.reLaunch({
            url: '/pages/home/home'
          })
        } else if (res.data.code === 0) {  // 未绑定账号
          // 微信相关信息存储
          wxData.type_uid = resData;
          wx.setStorageSync('wxdata', wxData);

          app.showSuccess('授权成功');
          wx.navigateTo({
            url: '/pages/my/bind/bind'
          })
        } else if (res.data.code === 404) {  // 授权失败
          app.showFailure('授权登录失败');
        } else if (res.data.code === 405) {  // 用户信息解析错误
          app.showNone('请重试');
          // app.showFailure('用户信息解析错误');
        }
      }
    })
  },

})
