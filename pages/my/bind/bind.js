// pages/my/bind/bind.js
var app = getApp();
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
  onLoad: function (opt) {

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
  // 绑定操作
  bind: function () {
    var that      = this;
    let uname     = that.data.uname;
    let upwd      = that.data.upwd;
    let wxdata    = wx.getStorageSync('wxdata');
    let type_uid  = wxdata.type_uid;
    let openid    = wxdata.openid;
    let src       = wx.getStorageSync('wxUserInfo').userInfo.avatarUrl;

    // console.log(type_uid);
    if (!uname || !upwd) {
      app.showNone('请输入用户名或密码');
      return;
    }
    if ( !regex.test(uname) || !pwdLen.test(upwd)) {
      app.showNone('用户名或密码格式错误');
      return;
    }
    wx.request({
      url: app.globalData.serviceUrl + 'passport.bindWx',
      header: app.globalData.header,
      data: {
        'uname'   : uname,
        'upwd'    : upwd,
        'type_uid': type_uid,
        'src'     : src,
        'openid'  : openid,
      },
      method: "POST",
      success: function (res) {
        // console.log(res);
        let data = res.data;
        if (data.code == 1) {
          wx.setStorageSync('userInfo', data.data);
          wx.setStorageSync('isLogin', 1);
          app.showSuccess('绑定成功');
          wx.switchTab({
            url: '/pages/home/home',
          });
        }else{
          app.showNone(data.msg);
        }
      },
      fail: function (res) {
        console.log(res);
        app.showFailure('绑定失败');
      }
    });
  },
})