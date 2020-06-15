// pages/course/pay/pay.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    paytype : 'lcnpay',
    sid     : '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    var that  = this;
    
    var id    = opt.id;
    var sid   = opt.sid;
    var price = parseFloat(opt.price);
    var user  = wx.getStorageSync('userInfo');
    var uid   = user.uid;
    // 测试用 上线删除 start
    app.globalData.header['oauth-token'] = user.oauth_token + ':' + user.oauth_token_secret;
    // 测试用 上线删除 end
    // 获取余额
      wx.request({
        url: app.globalData.serviceUrl + 'user.balanceConfig',
        header: app.globalData.header,
        method: "POST",
        success: function (res) {
          // console.log(res);
          if ( res.data.code == 1 ) {
            wx.setStorageSync('balanceConfig_' + uid, res.data.data);
            that.setData({
              balance: res.data.data.learncoin_info.balance
            });
          }
        },
        fail: function (res) {
          // console.log(res);
          app.showFailure('用户余额获取失败')
        }
      });
    // 设置课程/课时信息
      var course = app.getStorageSync('Course_' + id + '_' + uid);
      if( sid && price){
        wx.request({
          url: app.globalData.serviceUrl + 'course.getSectionHour',
          header: app.globalData.header,
          data: { 'id': sid, },
          method: "POST",
          async: false,
          success: function (res) {
            let data = res.data.data;
            if ('request:ok' == res.errMsg && res.data.code == 1) {
              that.setData({
                sid: sid,
                courseHour: data
              });
            }
          }
        });
      }
      that.setData({
        'course'    : course,
        'site_title': app.globalData.site_title,
      });

    // 获取设配信息
      var ios = wx.getStorageSync('ios');
      that.setData({ ios: ios });
    // 如果是ios设备，直接微信支付
      if(ios){
        let vids = that.data.course.id;
        var wxdata = wx.getStorageSync('wxdata');
    
        if (sid && price) { // 课时数据
          data = {
            'vid': vids,
            'sid': sid,
            'total_fee': price,
            'is_hour': true,
            'open_id': wxdata.openid
          };
        } else {  // 课程数据
          var data = {
            'vid': vids,
            'total_fee': course.price,
            'is_course': true,
            'open_id': wxdata.openid
          };
        }
        // console.log(data);
        // 签名请求及支付请求
        that.signAndPay(data);
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

  /**
   * 选择支付方式
   */
  checkRadio: function (e) {
    var that = this;
    var paytype = e.target.dataset.paytype;
    that.data.paytype = paytype;
    // console.log(that.data.paytype)
  },

  /**
   * 购买协议
   */
  checkbox: function (e) {
    var that = this;
    var checked = e.detail.value;
    that.data.checked = checked;
    // console.log(that.data.checked)
  },
  
  /**
   * 提交订单
   */
  submit: function () {
    let that    = this;
    let paytype = that.data.paytype;
    let vids    = that.data.course.id;
    let sid     = that.data.sid;
    var wxdata  = wx.getStorageSync('wxdata');

    if ( 'checked' != that.data.checked ) {
      app.showNone("请确认支付协议");
      return;
    }
    // console.log(that.data.paytype);
    if (paytype == 'lcnpay' && parseInt(that.data.balance) < parseInt(that.data.course.price) ) {
      app.showNone("余额不足");
    } else if ( paytype == 'lcnpay' ) {
      // 
      var func = 'course.buyVideo';
      var data = { 'vids': vids, 'pay_for': paytype};
      if(sid){
        func = "course.buyCourseHourById";
        data = { 'vid': vids, 'sid': sid, 'vtype':1, 'pay_for': paytype};
      }
      wx.request({
        url   : app.globalData.serviceUrl + func,
        header: app.globalData.header,
        data  : data,
        method: "POST",
        success: function (res) {
          // console.log(res);
          if (res.data.code == 1) {
            app.showSuccess('购买成功！');
            wx.navigateBack({});
          }
        },
      });
      
    } else if ( paytype == 'wxpay' ) {
      // 课程数据
      var data = { 
        'vid'       : vids,
        'total_fee' : that.data.course.price,
        'open_id'   : wxdata.openid
      };
      // 课时数据
      if (sid) {
        data = {
          'vid'       : vids,
          'sid'       : sid,
          'total_fee' : that.data.courseHour.course_hour_price,
          'open_id'   : wxdata.openid
        };
      }
      // 签名请求及支付请求
      that.signAndPay(data);
    }
  },
  // 签名请求及支付请求
  signAndPay: function (data) {
    wx.request({
      url: app.globalData.serviceUrl + 'course.wxOrder',
      header: app.globalData.header,
      data: data,
      method: 'POST',
      success: function (res) {
        // console.log(res.data);
        // console.log('调起支付');
        var data = res.data.data;
        if (res.data.code == 1) {
          wx.requestPayment({
            'timeStamp': data.timeStamp,
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': 'MD5',
            'paySign': data.paySign,
            'success': function (res) {
              console.log('success');
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 3000
              });
              wx.navigateBack({});
            },
          });
        } else {
          app.showNone(res.data.msg);
        }
      },
      fail: function (res) {
        console.log(res.data)
      }
    });
  }

})