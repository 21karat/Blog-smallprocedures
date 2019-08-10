const apiURL = '';
const clientId = '';
const clientSecret = '';

const downloadFileURL =''

const wxRequest = (params, url) => {
  wx.request({
    url,
    method: params.method || 'GET',
    data: params.data || {},
    header: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    success(res) {
      if (params.success) {
        params.success(res);
      }
    },
    fail(res) {
      if (params.fail) {
        params.fail(res);
      }
    },
    complete(res) {
      if (params.complete) {
        params.complete(res);
      }
    },
  });
};

/**
 * 分页获取文章列表url
 */
const getBlogList = (params) => {
  var url= ``;
  return url
};

/**
 * 根据文章Id获取文章信息
 */
const getBlogById = (params) => {
  var url = ``;
  return url;
};

/**
 * 根据标签获取文章信息
 */
const getBlogByTag = (params) => {
  wxRequest(params, ``);
};

/**
 * 下载头图文件
 */
const getdownloadFileURL = (name) => {
  var url = ``
  return url
};

module.exports = {
  getBlogList,
  getBlogById,
  getBlogByTag,
  getdownloadFileURL
};
