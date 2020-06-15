// pages/home/home.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiper:{
      indicatorDots: false,  // 小圆点
      autoplay: true, // 自动播放
      interval: 2000, // 自动播放时间
      duration: 500,  // 动画时间
      indicatorColor: "white", //小圆点 默认颜色
      indicatorActivColor: "red", //小圆点 选中颜色 
    },
    ios: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var ios = wx.getStorageSync('ios');
    that.setData({ios:ios});
    that.getAdvert();
    that.getCourse('NewestCourse', 'home.newVideo');
    that.getCourse('HotestCourse', 'home.hotVideo');
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
   * 获取轮播图
   */
  getAdvert: function () {
    var that = this;
    wx.request({
      url   : app.globalData.serviceUrl + 'home.advert',
      header: app.globalData.header,
      data  : {
        'place': 'xcx_home'
      },
      method: "POST",
      success: function (res) {
        if (res.data.code == 1) {
          let data = res.data.data;
          let imgUrl = [];
          for (var index in data) {
            imgUrl[index] = data[index].banner;
          }
          that.setData({
            imgUrl: imgUrl,
          });
        }
      },
    });
  },
  /**
   * 获取课程（最新、推荐）
   */
  getCourse: function (key, func) {
    var that = this;
    wx.request({
      url   : app.globalData.serviceUrl + func,
      header: app.globalData.header,
      data: {
        'type': 1
      },
      method: "POST",
      success: function (res) {
        // console.log(res);
        if (res.data.code == 1) {
          // console.log(res.data.data);
          that.setData({
            [key]: res.data.data,
          });
          app.setStorageSync(key, res.data.data);
        }
      },
      fail: function (res) {
        // console.log(res);
        app.showFailure('获取数据失败');
      }
    });
  },

  newCourse: function (event) {
    app.globalData.courseOrder = 'new'
  },
  bestCourse: function (event) {
    app.globalData.courseOrder = 'best'
  }
})