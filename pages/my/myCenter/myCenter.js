// pages/my/myCenter/myCenter.js
var app = getApp();
var utils = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    _on: "1",  // 控制我的订单(1)  我的收藏(2) 
    score: true, // 收藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 获取设配信息
    var ios = wx.getStorageSync('ios');
    that.setData({ ios: ios });
    // 检测登录状态并获取数据信息
    // let isLogin = wx.getStorageSync('isLogin');
    // console.log(isLogin);
    var userInfo = wx.getStorageSync('userInfo');
    // if ( !isLogin ) {
    //   wx.navigateTo({
    //     url: '/pages/my/login/login'
    //   })
    // } else {
      if(userInfo)
      {
        that.setData({
          'userInfo': userInfo
        });
      that.getMyCourse();
      that.getMyCollection();
      }else{
        that.setData({
          'userInfo': {
            'uname':'点击登录或注册',
            'userface':'/images/my/unsignin.png'
          }
        });
      }
    // }
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
    var that      = this;
    var userInfo  = wx.getStorageSync('userInfo');
    let isLogin   = wx.getStorageSync('isLogin');
    if (isLogin) {
      // 检查 session_key 是否过期
      wx.checkSession({
        // session_key 有效(未过期)
        success: function () {
          that.setData({
            'needLogin': '/pages/my/modifyData/modifyData'
          });
        },
        // session_key 过期，重新登录
        fail: function () {
          that.setData({
            'needLogin': '/pages/my/login/login'
          });
        }
      });
    } else {
      // 无skey，作为首次登录
      that.setData({
        'needLogin': '/pages/my/login/login'
      });
    }
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
  navclick: function (event) {
    this.setData({
      _on: event.target.dataset.on
    })
  },
  // 删除订单
  delOrder: function () {
    wx.showModal({
      title: '确认删除订单?',
      content: '删除此订单之后不可以恢复，请您慎重删除',
      success: function (res) {
        if (res.confirm) {
          
        }
      },
    })
  },
  // 点击头像上传
  modifyHeadImg: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['从手机相册选择', '拍照'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              var tempFilePaths = res.tempFilePaths;
              that.setData({
                headUrl: tempFilePaths,
              });
              console.log(tempFilePaths);
            }
          })
        }
        if (res.tapIndex == 1) {
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
  // 收藏点击事件 event.target.dataset.on
  isScore: function (event) {
    console.log(event.target.dataset)
    console.log(event.target.dataset.isscore)
    if (event.target.dataset.isscore) {
      this.setData({
        score: false
      })
    } else {
      this.setData({
        score: true
      })
    }
  },

  // 获取订单
  getMyOrder: function () {
    var that = this;
    var data = {
      'order_type': 4,
      'pay_status': 3,
      'count'     : 10
    };
    that.getMyList('order.getCourseOrderList', data, 'myOrder');
  },
  // 获取收藏
  getMyCollection: function () {
    var that = this;
    var data = {
      'type': 1,
      'count': 10
    };
    that.getMyList('video.getCollectList', data, 'myCollection');
  },
  // 获取我的课程
  getMyCourse: function () {
    var that = this;
    var data = {};
    that.getMyList('video.getMyList', data, 'myCourse');
  },
  // 获取我的课程/订单/收藏
  getMyList: function (func, data, dataName) {
    var that = this;
    // 测试用 上线删除 start
    var userInfo = wx.getStorageSync('userInfo');
    app.globalData.header['oauth-token'] = userInfo.oauth_token + ':' + userInfo.oauth_token_secret;
    // 测试用 上线删除 end
    wx.request({
      url: app.globalData.serviceUrl + func,
      header: app.globalData.header,
      data: data,
      method: "POST",
      success: function (res) {
        // console.log(res);
        if (res.data.code == 1) {
          var data = res.data.data;
          if ( dataName == 'myCollection' ){
            for(var i in data){
              data[i].ctime = utils.formatTime(data[i].ctime, 'Y年M月D日');
            }
          }
          that.setData({
            [dataName]: data
          });
        }
      }
    });
  },
  // 设置按钮 清除缓存 退出登录
  setTable() {
    wx.showActionSheet({
      itemList: ['退出登录'],
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.clearStorage();
          wx.clearStorageSync();
          app.showSuccess('退出成功！');
          wx.switchTab({
            url: '/pages/home/home',
          });
        }
      }
    })
  },

})