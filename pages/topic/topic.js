
const { Tab, extend } = require('../../dist/index');
//获取应用实例
const app = getApp()

Page(extend({}, Tab, {
  data: {
    navTab: {
      list: [{
        id: 'hot',
        title: '热门'
      }, {
        id: 'java',
        title: 'Java'
      }, {
        id: 'web',
        title: 'web'
      }, {
        id: 'python',
        title: 'Python'
      }, {
        id: 'other',
        title: '其他'
      }],
      selectedId: 'hot',
      scroll: true,
      height: 45,
    },
    autoplay: true,
    interval: 5000,
    duration: 1000,
    posts: [],
    page: 0,
    loading: false,
    nodata: false,
    nomore: false,
    scrollTop: 0,
    lowerComplete: true
  },
  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;
    this.setData({
      page: 0,
      nomore: false,
      nodata: false,
      scrollTop: 0,
      [`${componentId}.selectedId`]: selectedId
    });
    this.getData(0);
  },
  onLoad: function () {
    //获取数据
    console.log('onLoad')
    this.getData(0);
  },
  lower: function () {
    let that = this;
    if (!that.data.lowerComplete) {
      return;
    }
    if (!that.data.nomore && !that.data.nodata) {
      that.setData({
        loading: true,
        lowerComplete: false
      });
      that.getData(1);
      that.setData({
        lowerComplete: true
      });
    }
    console.log("lower")
  },
  //详情
  bindItemTap: function (e) {
    let blogId = e.currentTarget.id;
    wx.navigateTo({
      url: '../detail/detail?blogId=' + blogId
    })
  },
  //获取对应标签的博客
  getData: function (index) {
    let that = this;
    let page = that.data.page;//页数
    let selectId = that.data.navTab.selectedId;//标签名称
    let filter = '';
    switch (selectId) {
      case 'hot':
        filter = "hot";
        break;
      case 'java':
        filter = "java";
        break;
      case 'web':
        filter = "web";
        break;
      case 'python':
        filter = "python";
        break;
      case 'other':
        filter = "other";
        break;
      default:
        filter = 'hot';
    }

    wx.request({
      url: app.Host +'getBlogListByTab',
      data: {
        "limit": 10,
        "page": page + 1,
        "filter": filter
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.log(res.data.blogs.length);
        if (res.data.blogs.length==0){
          that.setData({
            posts: [],
            page: 0,
            loading: false,
            nomore: true,
            nodata: true
          });
        }else{
          that.setData({
            posts: res.data.blogs,
            page: res.data.page,
            loading: false,
            nomore: true,
            nodata: false
          });
        }   
      }
    })
  
  }
}));
