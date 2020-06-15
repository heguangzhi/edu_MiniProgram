// pages/course/refund/refund.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    images:[], // 上传图片数组
    refundReason:[  // 退款原因
      "请选择",
      "讲师不专业",
      "课程不是想学习的",
      "7天无理由退款",
      "其他原因"
    ],
    select:"请选择", // 选中
    isShow: true,
    site_title: app.globalData.site_title,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    var that  = this;
    var id    = opt.id;
    let uid   = wx.getStorageSync('userInfo').uid;
    that.setData({ id : id });
    that.getCourse('video.getInfo', id, uid, 'refund');
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
  //  上传函数
  upload:function(){
    var _this = this 
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success(res) {
        const tempFilePaths = res.tempFilePaths
        const images = _this.data.images.concat(res.tempFilePaths)
        
        if (images.length<4){
          _this.setData({
            images: _this.data.images.concat(res.tempFilePaths)
          })
        }else{
          wx.showToast({
            title: '最多三张图片',
            icon: 'none',
          })
        }
      
        wx.uploadFile({
          url: '', // 上传接口
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            user: 'test'
          },
          success(res) {
            const data = res.data
            // do something
          }
        })
      }
    })
  },
  select:function(){
    var _this = this 
    wx.showActionSheet({
      itemList: _this.data.refundReason,
      success: function (res) {
        console.log(res.tapIndex)
        _this.setData({
          select:   _this.data.refundReason[res.tapIndex]
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  /**
 * 获取课程
 */
  getCourse: function (func, id, uid, dataName) {
    var that = this;
    wx.request({
      url: app.globalData.serviceUrl + func,
      header: app.globalData.header,
      data: {
        'id': id,
        'uid': uid
      },
      method: "POST",
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) {
          // setData
          that.setData({
            [dataName]: res.data.data
          });
        }
      },
    });
  },
})