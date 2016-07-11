import React from 'react';
import {Table, Button, message, Modal, Icon} from 'antd';
import * as $ from 'jquery';
import Columns from './Columns';
import "../../common/Format"

import Promotion_discount_form from './Promotion_discount_form';
import Promotion_discount_modal from './Promotion_discount_modal';
import Promotion_product_modal from './Promotion_product_modal';
import Promotion_class_modal from './Promotion_class_modal';
const confirm = Modal.confirm;

let formStyle = {
  'padding': '2px 4px',
  'background': '#ededed',
  'border': '1px solid #d9d9d9',
  'borderRadius': 6,
  'marginBottom': 0,
};


let promotion_discount_main = React.createClass({
    getDefaultProps() {
        return {
            url:"/elink_scm_web/promotionAction/query.do",
            pageSize:10,
            paras: null
        };
    },
    getInitialState() {
        return {
            selectedRowKeys: [],  //所选行key
            selectedRows:[],  //所选行数据
            data: [], //查询数据结果
            pagination: {pageSize:this.props.pageSize,current:1}, //分页数据
            loading: false, //加载中
            para: {}  //form表单查询参数
        };
    },
    query(paras){
      if (paras) { this.setState({paras:paras}); }
      this.fetch(paras);
    },
    //换页
    handleTableChange(pagination, filters, sorter) {
        this.state.pagination.current=pagination.current;
        this.fetch();
    },
    // componentWillReceiveProps(nextProps){
    //   this.setState({para: nextProps.paras});
    //   this.fetch(nextProps.paras);
    // },
    addEdit(params){
      let _self= this;
      $.ajax({
        url     : "/elink_scm_web/promotionAction/save.do",
        data    : params,
        dataType: "json",
        success : function(result) {
          if(result.success){
            _self.fetch();
            _self.props.edit?message.success(params.name + ' 修改成功！',3):message.success(params.name + ' 添加成功！',3);
          }else{
            _self.props.edit?message.error(params.name + ' 修改失败： '+ result.msg,6):message.error(params.name + ' 添加失败： '+ result.msg,6);
          }
        },
        error: function(){
          message.error('网络忙，请稍后再试！',6);
        },
      });
    },
    //从服务器删除所选数据
    confirmDelete(){
      var _self = this;
      let {selectedRowKeys,selectedRows} = this.state;
      let promotionList = selectedRows.map(item => item.PromotionName).toString();
      if(selectedRowKeys.length > 0){
        confirm({
          title: '您是否确认要删除:',
          content: promotionList,
          onOk() {
            let params ={};
            params.deleteData=JSON.stringify({'removed':selectedRowKeys});
            $.ajax({
              url: "/elink_scm_web/promotionAction/delete.do",
              data: params,
              dataType: "json",
              success: function(result) {
                if(result.success){
                  message.success(promotionList + ' 已被成功删除！',3);
                  _self.setState({selectedRowKeys: []});
                  _self.fetch();
                }else{
                  message.error(promotionList + ' 删除失败： '+ result.msg,6);
                }
              },
              error: function(){
                  message.error("删除出错：请稍后再试！",6);
              },
            });
          },
          onCancel() {
            message.info('已取消！',3);
          },
        });
      }else{
        message.warn("请选择要删除的促销活动！",6);
      }
    },
    //从服务器获取数据
    fetch(para) {
        if(para){
          this.state.para=para;
          this.state.pagination.current=1;
        }
        let params = {
            limit: this.state.pagination.pageSize,
            start: (this.state.pagination.current - 1) * this.state.pagination.pageSize,
            ...this.state.para
        };
        let _self = this;
        $.ajax({
            url: _self.props.url,
            data: params,
            dataType: "json",
            success: function(result) {
                let pagination = _self.state.pagination;
                pagination.total = result.total;
                //当前页为空返回到上一页
                if(result.rows && result.rows.length!='0' || _self.state.pagination.current==1){
                  _self.setState({
                    loading: false,
                    data: result.rows,
                    pagination,
                    selectedRowKeys: [],
                    selectedRows:[],
                  });
                }else{
                  _self.state.pagination.current--;
                  _self.fetch();
                }
            },
            error: function(){
                console.log("出错：Promotion 获取表单数据失败！");
            }
        });
    },
    componentDidMount() {
        this.fetch();
    },
    //行首选择框
    onSelectChange(selectedRowKeys,selectedRows) {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({
          'selectedRowKeys':selectedRowKeys,
          'selectedRows':selectedRows
        });
    },
    noSelect(){
      this.setState({ 'selectedRowKeys':[], 'selectedRows':[] });
    },
    handleRowClick(record,index) {
      let key= record.S_PROMOTION_ID;
      let { selectedRows, selectedRowKeys } = this.state;
      let flag = true;

      for(let i=0;i<selectedRows.length;i++){
        if(record.S_PROMOTION_ID === selectedRows[i].S_PROMOTION_ID){
          selectedRowKeys.deleteElementByValue(key);
          selectedRows.deleteElementByValue(selectedRows[i]);
          this.setState({
            'selectedRowKeys':selectedRowKeys,
            'selectedRows':selectedRows
          });
          flag= false;
          break;
        }
      }
      if(flag){
        selectedRows.push(record);
        selectedRowKeys.push(key);
        this.setState({
          'selectedRowKeys':selectedRowKeys,
          'selectedRows':selectedRows
        });
      }
    },
    render() {
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {selectedRowKeys,onChange: this.onSelectChange,};
        return (
          <div>
            <Promotion_discount_form query={this.query} />
              <div style={formStyle}>
                <Promotion_discount_modal addEdit={this.addEdit}/>
                <Promotion_discount_modal addEdit={this.addEdit} selectedRows={this.state.selectedRows}/>
                <Button type="ghost" onClick={this.confirmDelete} size="small" style={{marginLeft:5}} ><Icon type="delete" />删 除</Button>
                {/*<Promotion_product_modal selectedRows={this.state.selectedRows}/>*/}
                <Promotion_class_modal selectedRows={this.state.selectedRows}/>
                <Button type="ghost" onClick={this.noSelect} size="small" style={{float:"right"}} ><Icon type="cross" />不选</Button>
              </div>
                <Table  rowSelection={rowSelection} onRowClick={this.handleRowClick} columns = {Columns} dataSource = {this.state.data}
                        //scroll={{ x: true, y: 300 }}
                        pagination = {this.state.pagination} loading = {loading} onChange = {this.handleTableChange}//分页
                        rowKey = {record => record.S_PROMOTION_ID} size="small" bordered  />
          </div>
        );
    },
});

export default promotion_discount_main;
