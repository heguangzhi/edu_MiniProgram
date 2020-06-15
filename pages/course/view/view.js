// pages/course/view/view.js
var app     = getApp();
var WxParse = require('../../../libs/wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    _on:"1", // 简介  目录  点评选择
    score: false, // 收藏
    firstChildId:0,
    _show:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that    = this;
    // 获取设配信息
    var ios = wx.getStorageSync('ios');
    that.setData({ ios: ios });
    // 获取课程/课时数据
    var id      = parseInt(options.id);
    let isLogin = wx.getStorageSync('isLogin');
    let uid     = wx.getStorageSync('userInfo').uid;
    that.setData({
      'id'      : id,
      'isLogin' : isLogin
    });
    that.getCourse('Course_' + id + '_' + uid, 'video.getInfo', id, 'course');
    that.getCourse('Course_section_' + id + '_' + uid, 'video.getCatalog', id, 'section');
    that.getReview('Course_review_' + id + '_' + uid, 'video.render', id, 'review');
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
    let that = this;
    let isLogin = wx.getStorageSync('isLogin');
    that.setData({
      'isLogin': isLogin
    });
    let id = that.data.id;
    let uid = wx.getStorageSync('userInfo').uid;
    that.getCourse('Course_' + id + '_' + uid, 'video.getInfo', id, 'course');
    that.getCourse('Course_section_' + id + '_' + uid, 'video.getCatalog', id, 'section');
    that.getReview('Course_review_' + id + '_' + uid, 'video.render', id, 'review');
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
  // 简介 目录 点评  选择
  navclick: function (event){  
    this.setData({
      _on: event.target.dataset.on
    })
  },
  //课时展开关闭
  showClassHour: function (event){
    var num = event.target.dataset.show;// 当前列表下标
    // console.log(num)
    var setuser = "section[" +num+"].ishide";  // 当前对象位置
    // 全部影藏 
    for (var i = 0; i < this.data.section.length;i++){
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
  /**
   * 获取课程
   */
  getCourse: function (key, func, id, dataName) {
    var that = this;
    // var Data = app.getStorageSync(key);
    let uid = wx.getStorageSync('userInfo').uid;
    wx.request({
      url   : app.globalData.serviceUrl + func,
      header: app.globalData.header,
      data: {
        'id': id,
        'uid': uid
      },
      method: "POST",
      success: function (res) {
        // console.log(res.data.data);
        if (res.data.code == 1) {
          // setData
          that.setCourseData(res.data.data, dataName);
          // wxParse解析video_intro
          if (dataName == 'course'){
            let intro = res.data.data.video_intro;
            var restr = '<img src="' + app.globalData.domain;
            intro = intro.replace(/<img src="/g, restr);
            that.wxParseIntro(intro);
          }
          // 缓存 支付需要使用
          app.setStorageSync(key, res.data.data);
        }
      },
      fail: function (res) {
        // console.log(res);
        app.showFailure('获取数据失败');
      }
    });
  },
  /**
   * 获取课程点评
   */
  getReview: function (key, func, id, dataName) {
    var that = this;
    wx.request({
      url: app.globalData.serviceUrl + func,
      header: app.globalData.header,
      data: {
        'kztype':1,
        'kzid': id,
        'type': 2
      },
      method: "POST",
      success: function (res) {
        // console.log(res.data);
        if (res.data.code == 1) {
          // setData
          that.setData({
            [dataName]: res.data.data
          });
          // 缓存
          app.setStorageSync(key, res.data.data);
        }
      },
      fail: function (res) {
        // console.log(res);
        app.showFailure('获取点评失败');
      }
    });
  },
  /**
   * 设置data值
   */
  setCourseData: function(data, dataName){
    if (dataName == 'section') {
      for (var index in data) {
        if(index==0){
          data[index].ishide = false;
        }else{
          data[index].ishide = true;
        }
        
        data[index].num     = parseInt(index)+1;
        for (var i in data[index].child) {
          var child = data[index].child[i];
          var vt = child.video_type;
          var typeObj = {
            '1': '视频',
            '2': '音频',
            '3': '文本',
            '4': '文档',
            '5': '视频',
            '6': '考试'
          }
          child.v_type = typeObj[vt];
          if(index == 0 && i == 0){
            this.setData({
              firstChildId: parseInt(child.id)
            });
          }
        }
      }
    } else {
      let score               = parseInt(data.video_score_rate) / 20;
      data.video_score_int    = parseInt(score);
      data.video_score_float  = parseFloat(score.toFixed(1));
      this.setData({
        score: parseInt(data.iscollect)
      });
    }
    this.setData({
      [dataName]: data
    });
  },
  // 解析HTML
  wxParseIntro: function (video_intro) {
    let that = this;
    /**
    * WxParse.wxParse(bindName , type, data, target,imagePadding)
    * 1.bindName绑定的数据名(必填)
    * 2.type可以为html或者md(必填)
    * 3.data为传入的具体数据(必填)
    * 4.target为Page对象,一般为this(必填)
    * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
    */
    WxParse.wxParse('video_intro', 'html', video_intro, that, 5);
  } ,
  //  收藏点击事件 event.target.dataset.on
  isScore:function(event){
    let that = this;
    // console.log(event.target.dataset)
    let iscol = event.target.dataset.isscore;
    let uid = wx.getStorageSync('userInfo').uid;
    if (uid) {
      that.setCollection(iscol, uid);
    } else {
      app.showNone('请先登录');
    } 
  },
  // 后台处理收藏操作
  setCollection: function (iscol, uid) {
    let that = this;
    let coltype = iscol?0:1;
    let vid = that.data.id;
    wx.request({
      url: app.globalData.serviceUrl + 'video.collect',
      header: app.globalData.header,
      data: {
        'type': coltype,
        'uid': uid,
        'sctype': 2,
        'source_id': vid,
      },
      method: "POST",
      success: function (res) {
        // console.log(res);
        if (res.data.code == 1) {
          // setData
          that.setData({
            score: iscol?false:true
          });
          // 刷新并清理缓存
          wx.removeStorageSync('Course_' + vid + '_' + uid);
        }
      },
      fail: function (res) {
        // console.log(res);
        app.showFailure('失败');
      }
    });
  },
  // 无课时时提醒
  noCourseHour: function () {
    app.showNone('该课程暂无课时');
  }
})