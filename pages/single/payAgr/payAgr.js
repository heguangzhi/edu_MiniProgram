// pages/single/payAgr/payAgr.js
var app = getApp();
var WxParse = require('../../../libs/wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.request({
      url: app.globalData.serviceUrl + 'basic.single',
      header: app.globalData.header,
      data: {
        'key': 'buy',
      },
      method: "POST",
      success: function (res) {
        // console.log(res.data);
        if (res.statusCode == 200) {
          // 去掉不能解析的<!DOCTYPE html><head>..</head>
          var i = res.data.indexOf('</head>');
          var data = res.data.substr(i+7);
          // console.log(data);
          // 计入缓存
          wx.setStorageSync('payAgr', data);
          // 解析 HTML
          WxParse.wxParse('content', 'html', data, that, 5);
        }
      },
      fail: function (res) {
        console.log(res);
      }
    });
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
})