// pages/course/course.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    onload: "",             // 加载更多文字  加载中。。
    classShow : true,       // 控制分类打开关闭   分类默认关闭   true 关闭 ， false 开启
    page      : 1,          // 当前页
    serviceData: {          // 数据参数
      'type'  : 1,
      'count' : 10,
      'page'  : 1,
      'order' : 'default',
      'cate_id': ''
    },
    sortOrder: "new"  // 分类排序
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let that = this;
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
    // 获取设配信息
    var ios = wx.getStorageSync('ios');
    that.setData({ ios: ios });
    // 获取全局order(首页传参)，并设置data
    var order = app.globalData.courseOrder;
    // 初始化data
    that.setDefaultData();
    that.setData({
      'serviceData.order' : order,
    });
    // 获取课程列表数据
    that.getCourseList('courseList', 'home.search', 'CourseList');
    // console.log(that.data);
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
    let that = this;
    wx.showToast({
      title   : '加载中....',
      icon    : 'loading',
      duration: 1000
    })
    // 初始化data
    // that.setDefaultData();
    // 获取课程列表数据
    that.getCourseList('courseList', 'home.search', 'CourseList');
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    // 获取数据
    var page = parseInt(that.data.page) + 1;
    if (!page || page > that.data.totalpages) {
      that.setData({
        onload: "再拉也没有了"
      })
    } else {
      that.setData({
        'page': page,
        'serviceData.page': page,
      });
      // 获取课程列表数据
      that.getCourseList('courseList', 'home.search', 'CourseList', true);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 分类点击 展开关闭
   */
  classShow:function(e){
    if (this.data.classShow){// 影藏
      this.setData({
        classShow:false
      })
    }else{ // 显示
      this.setData({
        classShow: true
      })
    }
    if (e.target.dataset.cancel=="1"){
      this.setData({
        classShow: true
      })
    }
  },
  /**
   * 获取课程列表getCourseList: function (key, func, dataName, order)
    * 1.key缓存名称前缀，缓存时与order、page结合使用，如app.getStorageSync(key+order+page)(必填)
    * 2.func接口方法，如video.getInfo(必填)
    * 3.dataName与前端交互的数据名称(必填)
    * 4.order排序名称(必填)
   */
  getCourseList: function (key, func, dataName, reachBottom = false) {
    var that  = this;
    var page  = that.data.serviceData.page;
    var order = that.data.serviceData.order;
    wx.request({
      url   : app.globalData.serviceUrl + func,
      header: app.globalData.header,
      data  : that.data.serviceData,
      method: "POST",
      success: function (res) {
        // console.log('后台获取的数据', res.data);
        if (res.data.code == 1) {
          // setData
          if (reachBottom === true) { // 触底加载数据
            that.setData({
              CourseList: that.data.CourseList.concat(res.data.data[0].list),
            })
          }else{
            // 无数据操作
            // that.setData({
            //   [dataName]: [],
            //   totalpages: 0
            // });
            // 有数据操作
            that.setData({
              [dataName]: res.data.data[0].list,
              totalpages: res.data.data[0].totalPages
            });
          }
          // 缓存
          app.setStorageSync(key+order+page, res.data.data[0]);
        }
      },
      fail: function (res) {
        app.showFailure('获取数据失败');
      }
    });
  },
  /**
   * 设置请求参数(筛选使用)
   */
  setServiceData: function(page, order, cate_id = '') {
    this.setData({
      'serviceData.page': page,
      'serviceData.order': order,
      'serviceData.cate_id': cate_id
    });
  },
  /**
   * 初始化data
   */
  setDefaultData: function () {
    this.setData({
      'onload': "",//加载中。。
      'page': 1,
      'serviceData.page': 1,
      'serviceData.order': 'default',
      'serviceData.cate_id': '',
    });
  },
  // 排序方式选择
  clickClass:function(e){ 
    var stype =  e.target.dataset.type;
    this.setData({
      sortOrder: stype
    });
  },
  // 确认筛选
  submit:function(){
    let that = this;
    var order = that.data.sortOrder;
    that.setServiceData(1, order);
    that.setData({
      page:1
    });
    that.getCourseList('courseList', 'home.search', 'CourseList');
    that.setData({
      classShow:true
    });
  }
})
