import fetch from 'isomorphic-fetch';

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
function receiveSproductList(pagination, json) {
  // console.log(json);
  pagination.total = json.total;
  return {
    type: types.RECEIVE_SPRODUCT_LIST,
    pagination: pagination,
    total: json.total,
    data: json.rows,
    receivedAt: Date.now()
  };
}

//获取，先触发requestPosts开始获取action，完成后触发receivePosts获取成功的action
function fetchSproductList(pagination) {
  // console.log("pagination_action:",pagination);
  return dispatch => {
    dispatch(requestSproductList(pagination));
    return fetch(`/elink_scm_web/sproductAction/query.do`,{
      method: 'POST',
			headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
			// headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
			credentials: 'include',
			body:'limit=' + pagination.pageSize + '&start=' + (pagination.current - 1) * pagination.pageSize
    })
      .then(response => response.json())
      .then(json => dispatch(receiveSproductList(pagination, json)));
  };
}

//如果需要则开始获取
export function fetchPostsIfNeeded(pagination) {
  return (dispatch) => {
    return dispatch(fetchSproductList(pagination));
  };
}
