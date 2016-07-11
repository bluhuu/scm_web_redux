import React from 'react';
import { Button, Tabs, Table, Form, Input, Modal, Icon, Row, Col, Radio, DatePicker, message } from 'antd';
import SProductAction_Modal from '../../common/sProductAction/SProductAction_Modal'
import classNames from 'classnames';
import SelectByRefId from '../../common/SelectByRefId';
import '../../common/Format';
const InputGroup = Input.Group;
const confirm = Modal.confirm;
const createForm = Form.create;
const FormItem   = Form.Item;
const RadioGroup = Radio.Group;

let formStyle = {
  'padding': '2px 4px',
  'background': '#ededed',
  'border': '1px solid #d9d9d9',
  'borderRadius': 6,
  'marginBottom': 0,
};
let columns = [
    {
      title: '商品编号',
      width: 80,
      sortable: true,
      dataIndex: 'S_Product_ID',
      key: 'S_Product_ID',
  }, {
      title: '商品名称',
      width: 200,
      sortable: true,
      dataIndex: 'ProductName',
      key: 'ProductName'
  }, {
      title: '所属分类',
      width: 100,
      sortable: true,
      dataIndex: 'ClassName',
      key: 'ClassName'
  }, {
      title: '品牌',
      width: 120,
      sortable: true,
      dataIndex: 'BrandName',
      key: 'BrandName'
  }, {
      title: '参与类型',
      width: 75,
      sortable: true,
      dataIndex: 'Isinclude',
      key: 'Isinclude'
  },
  // {
  //     title: '操作',
  //     key: 'operation',
  //     fixed: 'right',
  //     width: 150,
  //     render: () => <a href="#">操作</a>,
  // },
];

let Promotion_product_modal = React.createClass({
  getDefaultProps() {
      return {
          pageSize: 10,
          pageSize:"8",
          url:"/elink_scm_web/promotionRangeAction/queryProduct.do"
      };
  },
  getInitialState() {
      return {
          visible: false,
          selectedRowKeys: [],  //所选行key
          selectedRows:[],  //所选行数据
          data: [], //查询数据结果
          pagination: {pageSize:this.props.pageSize,current:1}, //分页数据
          loading: false, //加载中
          para: {},  //form表单查询参数
          searchValue: '',
          focus: false,
          // para: {}  //form表单查询参数
      };
  },
  handleInputChange(e) {//搜索框
    this.setState({
      searchValue: e.target.value,
    });
  },
  handleFocusBlur(e) {//搜索框
    this.setState({
      focus: e.target === document.activeElement,
    });
  },
  handleSearch() {//搜索框
    this.fetch();
  },
  handleTableChange(pagination, filters, sorter) {//分页
      this.state.pagination.current=pagination.current;
      this.fetch();
  },
  componentWillReceiveProps(nextProps){
    // this.props = nextProps;
    // this.fetch();
  },
  fetch(para) {//从服务器获取数据
      if(para){
        this.state.para=para;
        this.state.pagination.current=1;
      }
      let params = {
          limit: this.state.pagination.pageSize,
          start: (this.state.pagination.current - 1) * this.state.pagination.pageSize,
          PromotionRuleID:this.props.selectedRows.length>0 && this.props.selectedRows[0].S_PROMOTION_RULE_ID,
          productName:this.state.searchValue.toString().trim(),
          // ...this.state.para
      };
      let _self = this;
      this.setState({loading:true});
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
                this.setState({loading:false});
                _self.fetch();
              }
          },
          error: function(){
              this.setState({loading:false});
              console.log("出错：Promotion 获取表单数据失败！");
          }
      });
  },
  componentDidMount() {
      // this.fetch();
  },
  handleRowClick(record,index) {//表单行单击事件
    let key= record.S_Promotion_Range_ID;
    let { selectedRows, selectedRowKeys } = this.state;
    let flag = true;
    for(let i=0;i<selectedRows.length;i++){
      if(record.S_Product_ID === selectedRows[i].S_Product_ID){
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
  noSelect(){//取消表单选择
    this.setState({ 'selectedRowKeys':[], 'selectedRows':[] });
  },
  onSelectChange(selectedRowKeys,selectedRows) {//行首选择框
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      this.setState({ 'selectedRowKeys':selectedRowKeys, 'selectedRows':selectedRows });
  },
  //从服务器删除所选数据
  confirmDelete(){//删除
    var _self = this;
    let {selectedRowKeys,selectedRows} = this.state;
    let productList = selectedRows.map(item => item.ProductName).toString();
    if(selectedRowKeys.length > 0){
      confirm({
        title: '您是否确认要删除 ?',
        content: productList,
        onOk() {
          let params ={};
          params.deleteData=JSON.stringify({'removed':selectedRowKeys});
          $.ajax({
            url: "/elink_scm_web/promotionRangeAction/delete.do",
            data: params,
            dataType: "json",
            success: function(result) {
              if(result.success){
                message.success(productList + ' 已被成功删除！',3);
                _self.setState({selectedRowKeys: []});
                _self.fetch();
              }else{
                message.error(productList + ' 删除失败： '+ result.msg,6);
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
  handleSubmit() {
    this.hideModal();
  },
  hideModal() {
    this.setState({ visible: false });
  },
  showModal() {
    if (!this.props.selectedRows) {//如果是添加
      this.setState({visible: true});
      this.fetch();
    } else if (this.props.selectedRows) {//如果是修改
      if (this.props.selectedRows) {
        let selectedRows = this.props.selectedRows;
        if (selectedRows.length == 1) {
          this.setState({visible: true, rowData: selectedRows[0]});
          this.fetch();
        } else if (selectedRows.length > 1) {
          message.warn("只能选择一个活动项目！", 6);
        } else {
          message.warn("请选择一个活动项目！", 6);
        }
      }
    }
  },
  addProduct(products){//添加商品
    if(products.length==1){
      let product = products[0];
      console.log("product[0]: ",product);
      let params = {
          "ProductFullName":product.ProductName,
          "S_Product_ID": product.S_Product_ID,
          "productID": product.S_Product_ID,
          "PromotionRuleID": this.props.selectedRows[0].S_PROMOTION_RULE_ID,
          "promotionReferenceID": 0,
          "rangeType": "SP"
      };
      let _self = this;
      $.ajax({
          url: "/elink_scm_web/promotionRangeAction/save.do",
          data: params,
          dataType: "json",
          success: function(result) {
            _self.fetch();
            console.log(result);
          },
          error: function(){
              console.log("出错：Promotion 获取表单数据失败！");
          }
      });
    }
  },
  render(){
    const formItemLayout    = {
      labelCol  : { span : 8 },
      wrapperCol: { span : 16 },
    };
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {selectedRowKeys,onChange: this.onSelectChange,};
    const { style, size, ...restProps } = this.props;

    const btnCls = classNames({
      'ant-search-btn': true,
      'ant-search-btn-noempty': !!this.state.searchValue,
    });
    const searchCls = classNames({
      'ant-search-input': true,
      'ant-search-input-focus': this.state.focus,
    });
    return (
      <div style={{display:'inline',marginLeft:5}} {...this.props.ss}>
        <Button type="ghost" onClick={this.showModal} size="small"><Icon type="bars" />商品设置</Button>
        <Modal title="商品设置" width="680" visible={this.state.visible} onOk={this.handleSubmit} onCancel={this.hideModal}>
          <div style={formStyle}>
            <SProductAction_Modal action={this.addProduct}/>
            <Button type="ghost" onClick={this.confirmDelete} style={{marginLeft:5}} ><Icon type="delete" />删除</Button>
            {/* ---搜索组合框--- */}
            <div style={{display:'inline-block',marginBottom:-10,marginLeft:5,width: 180}} >
              <InputGroup className={searchCls} >
                <Input {...restProps} value={this.state.searchValue} onChange={this.handleInputChange}
                  onFocus={this.handleFocusBlur} onBlur={this.handleFocusBlur} onPressEnter={this.handleSearch} />
                <div className="ant-input-group-wrap">
                  <Button icon="search" className={btnCls} size={size} onClick={this.handleSearch} />
                </div>
              </InputGroup>
            </div> {/*-end-*/}
            <Button type="ghost" onClick={this.noSelect} style={{float:"right"}} ><Icon type="cross" />不选</Button>
          </div>
          <Table  rowSelection={rowSelection} onRowClick={this.handleRowClick} columns = {columns} dataSource = {this.state.data}
                  scroll={{ x: false, y: false }}
                  pagination = {this.state.pagination} loading = {loading} onChange = {this.handleTableChange} rowKey = {record => record.S_Promotion_Range_ID}
                  bordered  size='small'/>
        </Modal>
      </div>
    );
  },
});

export default Promotion_product_modal;
