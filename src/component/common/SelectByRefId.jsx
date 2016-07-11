import React from 'react';
import { Select, Input } from 'antd';
const Option = Select.Option;

let SelectByRefId = React.createClass({
  getInitialState() {
    return {
      data: [],
    };
  },
  getDefaultProps() {
    return {
      url: '/elink_scm_web/baseAction/refList.do'
    };
  },
  fetchRefList(params = {}) {
    var _self = this;
    $.ajax({
      url: this.props.url,
      data: params,
      dataType: "json",
      success: function(result) {
        console.log("refId: ",_self.props.refId,result.rows);
          _self.setState({
              data: result.rows,
          });
        },
      error: function(){
        console.log("出错：refID:",_self.props.refId," Select下拉数据请求失败！");
      },
    });
  },
  componentDidMount() {
    this.fetchRefList({
      id: this.props.refId
    });
  },

  render() {
    //key与 value 的值相同，可以省略 value 设置
    if(!this.state.data){
      return (<Input style={{ width: 90 }} {...this.props}/>);
    } else {
      const refOptions = this.state.data.map(dat => <Option key={dat.id}>{dat.name}</Option>);
      return (
          <Select  style={{ width: 90 }} {...this.props}>
            {refOptions}
          </Select>
      );
    }
  },
});

export default SelectByRefId;

