// pages/my/modifyData/modifyData.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    customItem: "全部"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    let isLogin   = wx.getStorageSync('isLogin');
    if (isLogin) {
      // 检查 session_key 是否过期
      wx.checkSession({
        // session_key 有效(未过期)
        success: function () {
          that.setData({
            'userInfo': userInfo
          });
        },
        // session_key 过期，重新登录
        fail: function () {
          wx.navigateTo({
            url: '/pages/my/login/login'
          })
        }
      });
    } else {
      // 无skey，作为首次登录
      wx.navigateTo({
        url: '/pages/my/login/login'
      })
    }
    var that      = this;
    var userInfo  = wx.getStorageSync('userInfo');
    var location = ['全部','全部','全部'];
    var intro     = '';
    if( userInfo.location ){
      var location = userInfo.location.split(" ");
    }
    if (userInfo.intro) {
      intro = userInfo.intro;
    }
    that.setData({
      userInfo: userInfo,
      region  : location,
      uname   : userInfo.uname,
      sex     : userInfo.sex,
      intro   : intro,
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
    var that = this;
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
  // 昵称输入
  watchUname: function (e) {
    this.data.uname = e.detail.value;
  },
  // 性别选择
  radioChange: function (e) {
    this.data.sex   = e.detail.value;
  },
  // 简介输入
  watchIntro: function (e) {
    this.data.intro = e.detail.value;
  },
  // 地区选择
  bindRegionChange: function (e) {
    var that = this;
    // console.log('picker发送选择改变，携带值为', e.detail.value.join(' '));
    that.setData({ 
      region: e.detail.value
    });
    // PC 端存储location格式，如： 四川省 成都市 青羊区
    that.data.region = e.detail.value.join(' ');
  },
  // 用户头像
  useHeadImg:function(){
    wx.showActionSheet({
      itemList: ['从手机相册选择', '拍照'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex==0){
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              var tempFilePaths = res.tempFilePaths
            }
          })
        }
        if (res.tapIndex==1){
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              var tempFilePaths = res.tempFilePaths
            }
          })
        }
      },
      fail: function (res) {
        
      }
    })
  },
  // 提交用户信息
  submit: function () {
    var that = this;
    // 测试用 上线删除 start
    var userInfo = wx.getStorageSync('userInfo');
    app.globalData.header['oauth-token'] = userInfo.oauth_token + ':' + userInfo.oauth_token_secret;
    // 测试用 上线删除 end
    wx.request({
      url   : app.globalData.serviceUrl + 'user.setInfo',
      header: app.globalData.header,
      data  : {
        uname : that.data.uname,
        sex   : that.data.sex,
        region: that.data.region,
        intro : that.data.intro,
      },
      method  : 'POST',
      success : function (res) {
        // console.log(res);
        if( res.data.code == 1 ){
          var user = res.data.data;
          user.wxdata = userInfo.wxdata;
          wx.removeStorageSync('userInfo');
          wx.setStorageSync('userInfo', user);
          wx.navigateBack({ });
        }
      }
    });
  }

})