import { REQUEST_SPRODUCT_LIST, RECEIVE_SPRODUCT_LIST, SELECT_SPRODUCT_ITEM, INVALIDATE_SPRODUCT_LIST
} from '../constants/ActionTypes';

function sproduct(state, action) {
  // console.log("state: ",state);
  switch (action.type) {
    case SELECT_SPRODUCT_ITEM:
      return Object.assign({}, state, {
        selected: action.selected
      });
    case INVALIDATE_SPRODUCT_LIST:
      return Object.assign({}, state, {
        didInvalidate: true,
        selected     : []
      });
    case REQUEST_SPRODUCT_LIST:
      return Object.assign({}, state, {
        isFetching   : true,
        didInvalidate: false,
        selected     : [],
      });
    case RECEIVE_SPRODUCT_LIST:
      return Object.assign({}, state, {
        isFetching   : false,
        didInvalidate: false,
        total        : action.total,
        pagination   : action.pagination,
        selected     : [],
        data         : action.data,
        lastUpdated  : action.receivedAt
      });
    default:
      return state;
  }
}
//废弃、接收到、开始接受新闻后，将state.postsByReddit设为相关参数
export default function Single_sproduct_reducer(state = {sproduct_list: {
  //是否正在获取最新
  isFetching   : false,
  //是否废弃
  didInvalidate: false,
  //内容
  data         : [],
  //所选项
  selected     : [],
  //分页
  pagination   : {pageSize:8,current:1,total:0}
}}, action) {
  switch (action.type) {
    case SELECT_SPRODUCT_ITEM    :
    case INVALIDATE_SPRODUCT_LIST:
    case REQUEST_SPRODUCT_LIST   :
    case RECEIVE_SPRODUCT_LIST   :
      return Object.assign({}, state, {
        sproduct_list: sproduct(state.sproduct_list, action)
      });
    default:
      return state;
  }
}
