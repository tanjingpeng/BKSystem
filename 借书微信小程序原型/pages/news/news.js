//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hidden: false,
    page: 1,

    isRefresh: false,
    showLoadMore: false,
    imgArr: [],
    clientHeight: 0,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    var self = this;
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          clientHeight: res.windowHeight,
        });
      }
    })

    // 页面初始化 options为页面跳转所带来的参数
    //console.log(options)
    this.loadImgs();
  },
  loadImgs: function(){
    var self = this;
    wx.request({
      url: 'https://gank.io/api/data/福利/20/' + self.data.page,
      method: 'GET',
      data: {
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        //console.log("res", res.data)
        
        if(self.data.isRefresh){
          //wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新

          self.setData({
            imgArr: []
          })
        }
        let imgs = [];
        for (var i = 0; i < res.data.results.length; i++){
          //console.log("imgs", res.data.newslist[i].picUrl)
          imgs.push(res.data.results[i].url);
        }

        //console.log("imgs", imgs)
        self.setData({
          hidden: true,
          showLoadMore: false,
          imgArr: self.data.imgArr.concat(imgs)
        })
      },
      fail: function(){
        this.setData({
          hidden: true,
          showLoadMore: false
        })
        wx.showToast({
          title: '加载失败，请重试',
        })
      }
    })
  },
  onPullDownRefresh: function () {
    //wx.showNavigationBarLoading() //在标题栏中显示加载
    var self = this;
    self.setData({
      page: 1,
      isRefresh: true
    })
    self.loadImgs();
  },
  onReachBottom: function(){
    var self = this;
    self.setData({
      page: self.data.page + 1,
      isRefresh: false,
      showLoadMore: true
    })
    self.loadImgs();
  },
  imgShow: function (event){
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = this.data.imgArr;//event.currentTarget.dataset.list;//获取data-list

    //console.log("src", src);

    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  }
})
