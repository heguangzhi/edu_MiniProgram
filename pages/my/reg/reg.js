// pages/my/reg/reg.js
var app = getApp();
var regex = app.globalData.regex;
var pwdLen = app.globalData.pwdLen;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:''
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

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
  watchPwd: function (event) {
    this.data.upwd = event.detail.value;
  },
  watchCpwd: function (event) {
    this.data.cpwd = event.detail.value;
  },
  /* 
  errMsg：用户点击取消或授权的信息回调。
  iv：加密算法的初始向量（如果用户没有同意授权则为undefined）
  encryptedData： 用户信息的加密数据（如果用户没有同意授权同样返回undefined）
*/
  getPhoneNumber: function (e) {
    var det = e.detail;
    var that = this;
    if (det.errMsg == 'getPhoneNumber:ok') {
      var sKey = wx.getStorageSync('wxdata').sKey;
      wx.request({
        url: app.globalData.serviceUrl + 'passport.decryptPhone',
        header: app.globalData.header,
        data: {
          enc: det.encryptedData,
          iv: det.iv,
          sKey: sKey
        },
        method: "POST",
        success: function (res) {
          // console.log(res);
          if (res.errMsg = 'request:ok' && res.data.code == 1) {
            that.setData({
              'phone': res.data.data.purePhoneNumber,
              'countryCode': res.data.data.countryCode
            });
            //注册操作
            that.reg();
          }
        }
      })
    } else {
      //注册操作
      that.reg();
    }
  },
  // 注册操作
  reg: function () {
    var that    = this;
    let phone   = that.data.phone;
    let uname   = that.data.uname;
    let cpwd    = that.data.cpwd;
    let upwd    = that.data.upwd;
    let sex     = wx.getStorageSync('wxUserInfo').gender;
    let type_uid = wx.getStorageSync('wxdata').type_uid;
    let src     = wx.getStorageSync('wxUserInfo').userInfo.avatarUrl;
    
    if (!uname || !upwd || !cpwd) {
      app.showNone('请输入用户名或密码');
      return;
    }
    if ( !pwdLen.test(cpwd) || !regex.test(uname) ) {
      app.showNone('用户名或密码格式错误');
      return;
    }
    if (upwd != cpwd){
      app.showNone('密码不一致');
      return;
    }
    var unionid = wx.getStorageSync('wxdata')['type_uid'];
    wx.request({
      url   : app.globalData.serviceUrl + 'passport.regWx',
      header: app.globalData.header,
      data  : {
        'uname' : uname,
        'upwd'  : cpwd,
        'type_uid': type_uid,
        'phone' : phone,
        'sex'   : sex,
        'unionid': unionid,
        'src'   : src,
      },
      method: "POST",
      success: function (res) {
        // console.log(res);
        let data = res.data;
        if (data.code == 1) {
          wx.setStorageSync('userInfo', data.data);
          wx.setStorageSync('isLogin', 1);
          app.showSuccess('注册成功');
          setTimeout(function(){
            wx.switchTab({
              url: '/pages/home/home'
            });
          },2000);
        } else {
          if ( data.data.error_code == 401 ) {
            app.showFailure('手机已被注册');
            setTimeout(function () {
              wx.navigateTo({
                url: '/pages/my/bind/bind'
              });
            }, 2000);
          } else if (data.data.error_code == 402) {
            app.showFailure('昵称已被注册');
          } else if (data.data.error_code == 403) {
            app.showFailure('此微信号已绑定用户');
            setTimeout(function () {
              wx.navigateTo({
                url: '/pages/my/bind/bind'
              });
            }, 2000);
          } else if (data.data.error_code == 400){
            app.showFailure('手机号格式错误');
          } else {
            app.showFailure('注册失败,请重试');
          }
        }
      },
      fail: function (res) {
        console.log(res);
        app.showFailure('请求失败，请重试');
      }
    });
  },

})