// pages/course/watch/watch.js
var app = getApp();
var WxParse = require('../../../libs/wxParse/wxParse.js');

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
    var that      = this;
    var id        = opt.id;
    var vid       = opt.vid;  
    let uid       = wx.getStorageSync('userInfo').uid;
    var course    = wx.getStorageSync('Course_' + vid + '_' + uid);
    var section   = wx.getStorageSync('Course_section_' + vid + '_' + uid);

    if ( parseInt(id) ){
      wx.request({
        url   : app.globalData.serviceUrl +  'course.getSectionHour',
        header: app.globalData.header,
        data  : { 'id': id, },
        method: "POST",
        async : false,
        success: function (res) {
          // console.log(res);
          let data = res.data.data;
          if( 'request:ok' == res.errMsg && res.data.code == 1 ){
            wx.setStorageSync('Section_'+ id, data);
            that.setData({ videoSrc: app.globalData.domain + '/watch_wx/' + vid + '_' + id + '_' + uid + '.html' });
            // console.log(that.data.videoSrc);
          }
        }
      })
    } else {
      wx.navigateBack({  });
    }

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
  //课时展开关闭
  showClassHour: function (event) {
    var num = event.target.dataset.show;// 当前列表下标
    // console.log(num)
    var setuser = "section[" + num + "].ishide";  // 当前对象位置
    // 全部影藏 
    for (var i = 0; i < this.data.section.length; i++) {
      var _setuser = "section[" + i + "].ishide";
      this.setData({
        [_setuser]: true,
      })
    }
    // 判断是否影藏
    if (event.target.dataset.hide) { //影藏
      this.setData({
        [setuser]: false,
        _show: event.target.dataset.show
      })
    } else {  //显示
      this.setData({
        [setuser]: true,
        _show: event.target.dataset.show
      })
    }
  },

})