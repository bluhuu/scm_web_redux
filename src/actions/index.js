import fetch from 'isomorphic-fetch';

import * as types from '../constants/ActionTypes'

//选择action
export function selectSproductItem(sproduct) {
  return {
    type: types.SELECT_SPRODUCT_ITEM,
    sproduct
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
function requestSproductList(sproduct) {
  return {
    type: types.REQUEST_SPRODUCT_LIST,
    sproduct
  };
}
//获取成功的action
function receiveSproductList(sproduct, json) {
  return {
    type: RECEIVE_SPRODUCT_LIST,
    sproduct: sproduct,
    sproducts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  };
}

//获取，先触发requestPosts开始获取action，完成后触发receivePosts获取成功的action
function fetchSproductList(sproduct,pagination) {
  return dispatch => {
    dispatch(requestPosts(sproduct));
    return fetch(`/elink_scm_web/sproductAction/query.do`,{
      method: 'POST',
			headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
			// headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
			credentials: 'include',
			body:'limit=' + pagination.pageSize + '&start=' + (pagination.current - 1) * pagination.pageSize
    })
      .then(response => response.json())
      .then(json => dispatch(receiveSproductList(sproduct, json)));
  };
}

//如果需要则开始获取
export function fetchPostsIfNeeded(sproduct,pagination) {
  return (dispatch, getState) => {
    return dispatch(fetchSproductList(sproduct,pagination));
  };
}
