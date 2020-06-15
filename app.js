//app.js
App({
  onLaunch: function() {
    var that = this;
    // 判断手机类型
    wx.getSystemInfo({
      success: function(res) {
        wx.setStorageSync('systemInfo', res);
        if (res.platform == "ios") {
          wx.setStorageSync('ios', true);
        } else {
          wx.setStorageSync('ios', false);
        }
      }
    });
    // 检查登录
    // let isLogin = wx.getStorageSync('isLogin');
    // if (isLogin) {
    //   // 检查 session_key 是否过期
    //   wx.checkSession({
    //     // session_key 有效(未过期)
    //     success: function() {
    //       console.log('session_key is exsit')
    //     },
    //     // session_key 过期，重新登录
    //     fail: function() {
    //       wx.reLaunch({
    //         url: '/pages/my/login/login'
    //       })
    //     }
    //   });
    // } else {
    //   // 无skey，作为首次登录
    //   console.log('no skey')
    //   wx.reLaunch({
    //     url: '/pages/my/login/login'
    //   })
    // }
  },
  globalData: {
    // 配置授权网站域名
    domain: 'https://v4.51eduline.com',
    // 配置授权接口调用入口,规则 域名/service/
    serviceUrl: 'https://v4.51eduline.com'+'/service/',
    // 接口header头
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'notencrypt': false, // 勿更改此参数
    },
    // 课程列表默认排序
    courseOrder: 'default',
    // 网站关键字,如显示 xx协议
    site_title: "Eduline",
    // 检测用户名、邮箱、手机号及密码正则(汉字、字母、数字和下划线)
    regex: new RegExp("^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_.@])+$"),
    pwdLen: new RegExp("^[a-zA-Z0-9_]{6,20}$"),
  },
  // 无图标提示
  showNone: function(info) {
    wx.showToast({
      title: info,
      icon: 'none',
      duration: 1500
    })
  },
  // 成功提示
  showSuccess: function(info) {
    wx.showToast({
      title: info,
      icon: 'success',
      duration: 1500
    })
  },
  // 失败提示
  showFailure: function(info) {
    wx.showToast({
      title: info,
      image: '/images/icon/failure.png',
      duration: 1500
    })
  },
  // 设置本地缓存   title: 缓存名称   data: 缓存数据  timestamp: 有效时间/分钟,默认2小时
  setStorageSync: function(title, data, timestamp) {
    if (!timestamp) {
      let timestamp = 60 * 2 * 60000;
    } else {
      let timestamp = timestamp * 60000;
    }
    var time = Date.now() + timestamp;
    wx.setStorageSync(title, data);
    wx.setStorageSync(title + '_time', time);
  },
  // 获取本地缓存   title: 缓存名称
  getStorageSync: function(title) {
    var time = wx.getStorageSync(title + '_time');
    if (time < Date.now()) {
      wx.removeStorageSync(title);
      return null;
    }
    return wx.getStorageSync(title);
  },
  // 移除本地缓存   keyArr: 缓存名数组 例：['userInfo','course']
  removeStorageSync: function(keyArr) {
    for (var index in keyArr) {
      wx.removeStorageSync(keyArr[index]);
    }
  },
})
