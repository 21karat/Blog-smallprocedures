
const { Tab, extend } = require('../../dist/index');
const util = require('../../utils/util.js');
const api = require('../../utils/api.js');

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
        id: 'net',
        title: '.Net'
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
    lowerComplete: true,
    defaultImageUrl: getApp().globalData.defaultImageUrl + getApp().globalData.imageStyle200To200
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
  //事件处理函数
  bindItemTap: function (e) {
    let blogId = e.currentTarget.id;
    wx.navigateTo({
      url: '../detail/detail?blogId=' + blogId
    })
  },
  //图片加载失败给到默认图片
  errorloadImage: function (e) {
    if (e.type == "error") {
      var index = e.target.dataset.index
      var posts = this.data.posts
      posts[index].slug = this.data.defaultImageUrl
      this.setData({
        posts: posts
      })
    }
  },

  getData: function (index) {
    let that = this;
    let page = that.data.page;
    let selectId = that.data.navTab.selectedId;
    let filter = '';
    switch (selectId) {
      case 'hot':
        filter = "featured:true";
        break;
      case 'java':
        filter = "tags:['java']";
        break;
      case 'net':
        filter = "tags:['c']";
        break;
      case 'python':
        filter = "tags:['python']";
        break;
      case 'python':
        filter = "tags:['python']";
        break;
      case 'other':
        filter = "page:false";
        break;
      default:
        filter = 'page:false';
    }

    api.getBlogByTag({
      
    });
  }
}));
