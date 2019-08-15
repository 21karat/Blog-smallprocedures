
const { Tab, extend } = require('../../dist/index');

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
  
  getData: function (index) {
    let that = this;
    let page = that.data.page;
    let selectId = that.data.navTab.selectedId;
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
      url: 'http://localhost:8080/getBlogListByTab',
      data: {
        "limit": 10,
        "page": page + 1,
        "filter": filter
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        // 'Content-Type': 'application/json'
      },
      success: function (res) {
        // success
        console.log(res);
        that.setData({
          posts: res.data.blogs,
          page: res.data.page,
          loading: false,
          nomore: false,
          nodata: true
        });
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  
  }
}));
