import {
  REQUEST_SPRODUCT_LIST,
  RECEIVE_SPRODUCT_LIST,
  SELECT_SPRODUCT_ITEM,
  INVALIDATE_SPRODUCT_LIST
} from '../constants/ActionTypes';

const initialState = [ { text: 'Use Redux', completed: false, id: 0 } ];

function sproduct(state = {
  //是否正在获取最新
  isFetching: false,
  //是否废弃
  didInvalidate: false,
  //内容
  items: []
}, action) {
  switch (action.type) {
    case INVALIDATE_SPRODUCT_LIST:
      return Object.assign({}, state, {
        didInvalidate: true
      });
    case REQUEST_SPRODUCT_LIST:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      });
    case RECEIVE_SPRODUCT_LIST:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.sproducts,
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
}
//废弃、接收到、开始接受新闻后，将state.postsByReddit设为相关参数
export default function sproduct_list(state = { }, action) {
  switch (action.type) {
    case INVALIDATE_SPRODUCT_LIST:
    case REQUEST_SPRODUCT_LIST:
    case RECEIVE_SPRODUCT_LIST:
      return Object.assign({}, state, {
        [action.sproduct_list]: sproduct(state[action.reddit], action)
      });
    default:
      return state;
  }
}
