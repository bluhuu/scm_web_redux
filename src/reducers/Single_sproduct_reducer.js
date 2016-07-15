import { REQUEST_SPRODUCT_LIST, RECEIVE_SPRODUCT_LIST, SELECT_SPRODUCT_ITEM, INVALIDATE_SPRODUCT_LIST
} from '../constants/ActionTypes';

function sproduct(state, action) {
  // console.log("state: ",state);
  switch (action.type) {
    case SELECT_SPRODUCT_ITEM:
      return Object.assign({}, state, {
        selectedRowKeys: action.selectedRowKeys
      });
    case INVALIDATE_SPRODUCT_LIST:
      return Object.assign({}, state, {
        didInvalidate: true,
        selectedRowKeys     : []
      });
    case REQUEST_SPRODUCT_LIST:
      return Object.assign({}, state, {
        loading   : true,
        didInvalidate: false,
        selectedRowKeys     : [],
      });
    case RECEIVE_SPRODUCT_LIST:
      return Object.assign({}, state, {
        loading         : false,
        didInvalidate   : false,
        total           : action.total,
        pagination      : action.pagination,
        selectedRowKeys : [],
        data            : action.data,
        lastUpdated     : action.receivedAt,
        params          : action.params
      });
    default:
      return state;
  }
}
//废弃、接收到、开始接受新闻后，将state.postsByReddit设为相关参数
export default function Single_sproduct_reducer(state = {sproduct_list: {
  loading         : false,                          //是否正在获取最新
  didInvalidate   : false,                          //是否废弃
  data            : [],                             //内容
  selectedRowKeys : [],                             //所选项
  pagination      : {pageSize:8,current:1,total:0}, //分页
  params          : {}                              //请求参数
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
