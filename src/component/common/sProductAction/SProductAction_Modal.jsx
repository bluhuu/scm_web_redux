import React from 'react';
import { Button, Tabs, Table, Form, Input, Modal, Icon, Row, Col, Radio, DatePicker, message } from 'antd';
import SProductAction_form from './SProductAction_form';
import * as $ from 'jquery';
import '../../common/Format';
const createForm = Form.create;
const FormItem   = Form.Item;
let columns = [
  // {
  //   title: '赠品名称',
  //   width: 120,
  //   sortable: true,
  //   dataIndex: 'GiftName',
  //   key: 'GiftName',
  // },
  {
      title: '商品名称',
      width: 250,
      sortable: true,
      // fixed: 'left',
      dataIndex: 'ProductName',
      key: 'ProductName',
  }, {
      title: '商品编码',
      width: 150,
      sortable: true,
      dataIndex: 'S_Product_ID',
      key: 'S_Product_ID'
  }, {
      title: 'ERP编码',
      width: 150,
      sortable: true,
      dataIndex: 'ProductCode',
      key: 'ProductCode'
  }, {
      title: '搜索码',
      width: 150,
      sortable: true,
      dataIndex: 'Value',
      key: 'Value'
  }, {
      title: '批号',
      width: 150,
      sortable: true,
      dataIndex: 'Lot',
      key: 'Lot'
  }, {
      title: '品牌',
      width: 200,
      sortable: true,
      dataIndex: 'BrandName',
      key: 'BrandName'
  }, {
      title: '分类',
      width: 250,
      sortable: true,
      dataIndex: 'ClassName',
      key: 'ClassName'
  }, {
      title: '规格',
      width: 200,
      sortable: true,
      dataIndex: 'ProductSpec',
      key: 'ProductSpec'
  }, {
      title: '单位',
      width: 150,
      sortable: true,
      dataIndex: 'Uomname',
      key: 'Uomname'
  }, {
      title: '批准文号',
      width: 250,
      sortable: true,
      dataIndex: 'CertificateNo',
      key: 'CertificateNo'
  }, {
      title: '厂家',
      width: 250,
      sortable: true,
      dataIndex: 'Manufacturer',
      key: 'Manufacturer'
  }, {
      title: '产地',
      width: 150,
      sortable: true,
      dataIndex: 'Productarea',
      key: 'Productarea'
  },
  // {
  //     title: '操作',
  //     key: 'operation',
  //     fixed: 'right',
  //     width: 150,
  //     render: () => <a href="#">操作</a>,
  // },
];

let SProductAction_Modal = React.createClass({
  getDefaultProps() {
      return {
          pageSize: 8,
          url:"/elink_scm_web/sProductAction/query.do"
      };
  },
  getInitialState() {
      return {
          visible: false,
          data:[],
          selectedRowKeys: [],  //所选行key
          selectedRows:[],  //所选行数据
          pagination: {pageSize:this.props.pageSize,current:1}, //分页数据
          loading: false, //加载中
          para: {}  //form表单查询参数
      };
  },
  handleSubmit() {
    console.log("selectedRows--------------------",this.state.selectedRows[0]);
    this.props.action(this.state.selectedRows);
    this.hideModal();
  },
  hideModal() {
    this.setState({ visible: false });
  },
  showModal() {
    this.setState({visible: true});
  },
  onSelectChange(selectedRowKeys,selectedRows) {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      this.setState({
        'selectedRowKeys':selectedRowKeys,
        'selectedRows':selectedRows
      });
  },
  handleRowClick(record,index) {
    let id="S_Product_ID";
    let { selectedRows, selectedRowKeys } = this.state;
    let flag = true;
    for(let i=0;i<selectedRows.length;i++){
      if(record[id] === selectedRows[i][id]){
        selectedRowKeys.deleteElementByValue(record[id]);
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
      selectedRowKeys.push(record[id]);
      this.setState({
        'selectedRowKeys':selectedRowKeys,
        'selectedRows':selectedRows
      });
    }
  },
  handleTableChange(pagination, filters, sorter) {
    this.state.pagination=pagination;
    this.fetch();
  },
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
  componentWillReceiveProps(nextProps){
    this.props = nextProps;
    // this.fetch();
  },
  render() {
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {selectedRowKeys,onChange: this.onSelectChange,};
    return (
      <div style={{display:'inline',marginLeft:5}}>
        <Button type="ghost" onClick={this.showModal} size="default"><Icon type="plus" />添加</Button>
        <Modal title="商品选择" width="900" visible={this.state.visible} onOk={this.handleSubmit} onCancel={this.hideModal}>
          <SProductAction_form query={this.fetch}/>
          <Table  rowSelection={rowSelection}
                  onRowClick={this.handleRowClick}
                  columns = {columns}
                  dataSource = {this.state.data}
                  scroll={{ x: 1400, y: false }}
                  pagination = {this.state.pagination}
                  loading = {loading}
                  onChange = {this.handleTableChange}
                  rowKey = {record => record.S_Product_ID}
                  size='small'
                  bordered />
        </Modal>
      </div>
    );
  },
});

export default SProductAction_Modal;
