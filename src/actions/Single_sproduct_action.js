import fetch from 'isomorphic-fetch';
// import * as $ from 'jquery';
import * as types from '../constants/ActionTypes';

//选择action
export function selectSproductItem(selectedRowKeys) {
  return {
    type: types.SELECT_SPRODUCT_ITEM,
    selectedRowKeys:selectedRowKeys
  };
}
//废弃类型action
export function invalidateSproductList(sproduct) {
  return {
    type: types.INVALIDATE_SPRODUCT_LIST,
    sproduct
  };
}
//开始获取action
function requestSproductList(pagination) {
  return {
    type: types.REQUEST_SPRODUCT_LIST,
    pagination:pagination
  };
}
//获取成功的action
function receiveSproductList(pagination, params, json) {
  // console.log(json);
  pagination.total = json.total;
  return {
    type      : types.RECEIVE_SPRODUCT_LIST,
    pagination: pagination,
    total     : json.total,
    data      : json.rows,
    params    : params,
    receivedAt: Date.now(),
  };
}

//获取，先触发requestPosts开始获取action，完成后触发receivePosts获取成功的action
function fetchSproductList(pagination,params) {
  return dispatch => {
    dispatch(requestSproductList(pagination));
    params.limit= pagination.pageSize;
    params.start= (pagination.current - 1) * pagination.pageSize;
    $.ajax({
      url: `/elink_scm_web/sproductAction/query.do`,
      data: params,
      // async:false,
      dataType: "json",
      success: function(result) {
        dispatch(receiveSproductList(pagination, params, result))
      },
      error: function(e) {
        console.log("sproductAction 请求失败: ",e);
      }
    });
  };
}
//如果需要则开始获取
export function fetchPostsIfNeeded(pagination,params = {}) {
  return (dispatch) => {
    return dispatch(fetchSproductList(pagination,params));
  };
}
