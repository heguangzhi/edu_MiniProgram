//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: [
      '1.0.1',
      '1.修复未关注公众号或登录APP的用户授权后无法获取unionid问题',
      '1.0.2',
      '1.修复价格为小于1的小数时，购买跳转至课程购买',
      '2.修复免费课程的列表显示',
      '3.修复课程简介图片解析失败',
      '4.修复本地缓存默认时间',
      '5.关闭虚拟支付（余额支付）',
      '1.0.3',
      '1.关闭所有IOS下的价格显示',
      '2.打开虚拟支付',
      '3.IOS购买课程直接跳转微信支付',
      '1.0.4',
      '1.用户绑定，修复绑定相同平台用户',
      '2.下拉刷新更改默认方式',
      '3.更改接口等域名配置，获取微信头像',
      '1.0.5',
      '1.修复不同机型样式问题',
      '2.文档URL转码，修复PDF不能打开问题',
      '3.修复音频退出后依然播放问题',
      '4.文本显示图片',
      '2.0.0',
      '2019-04-11 10:00',
      '1.添加顺序播放功能',
      '2.添加用户学习记录数据生成',
      '3.播放页目录功能',
      '4.课程页数据不足一页时的 加载中 显示优化',
      '5.登陆操作优化：用户解密unionid失败提示',
      '2.0.1',
      '2019.07.08',
      '1.首页轮播调整',
      '2.同步后台数据（新增视频链接，考试类型修改为6）',
    ]
  },
  onLoad: function () {
    // this.setData({
    //   logs: (wx.getStorageSync('logs') || []).map(log => {
    //     return util.formatTime(new Date(log))
    //   })
    // })
  }
})
