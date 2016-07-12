import React from 'react';
import { Button, Tabs, Table, Form, Input, Modal, Icon, Row, Col, Radio, DatePicker, message, Cascader } from 'antd';
import SProductAction_Modal from '../../../common/sProductAction/SProductAction_Modal';
import classNames from 'classnames';
import SelectByRefId from '../../../common/SelectByRefId';
import '../../../common/Format';
const InputGroup = Input.Group;
const confirm = Modal.confirm;
const createForm = Form.create;
const FormItem   = Form.Item;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;

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
let classColumns = [
    {
      title: '促销名称',
      width: 80,
      sortable: true,
      dataIndex: 'PromotionName',
      key: 'PromotionName',
  }, {
      title: '分类名称',
      width: 200,
      sortable: true,
      dataIndex: 'CLASSNAME',
      key: 'CLASSNAME'
  }, {
      title: '开始时间',
      width: 100,
      sortable: true,
      dataIndex: 'BeginDate',
      key: 'BeginDate'
  }, {
      title: '结束时间',
      width: 120,
      sortable: true,
      dataIndex: 'EndDate',
      key: 'EndDate'
  }
];

let Promotion_class_iform = React.createClass({
  getDefaultProps() {
      return {
          pageSize: 10,
          pageSize:"8",
          url:"/elink_scm_web/promotionRangeAction/queryProduct.do"
      };
  },
  getInitialState() {
      this.newTabIndex = 0;
      const panes = [
          <TabPane tab="首 页" key="1">
          </TabPane>
      ];
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
          activeKey: panes[0].key,
          panes,
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
    this.props = nextProps;
    this.fetch();
  },
  fetch(para) {//从服务器获取数据
      if(para){
        this.state.para=para;
        this.state.pagination.current=1;
      }
      let params = {
          limit: this.state.pagination.pageSize,
          start: (this.state.pagination.current - 1) * this.state.pagination.pageSize,
          // PromotionRuleID:this.props.selectedRows.length>0 && this.props.selectedRows[0].S_PROMOTION_RULE_ID,
          productName:this.state.searchValue.toString().trim(),
          // ...this.state.para
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
    // let cascaderOptions = this.promotionClass('0');
    this.setState({
      cascaderOptions:this.promotionClass('0')
    });
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
      this.setState({
        'selectedRowKeys':selectedRowKeys,
        'selectedRows':selectedRows
      });
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
    } else if (this.props.selectedRows) {//如果是修改
      if (this.props.selectedRows) {
        let selectedRows = this.props.selectedRows;
        if (selectedRows.length == 1) {
          this.setState({visible: true, rowData: selectedRows[0]});
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
  onTabsChange(activeKey) {
      this.setState({
          activeKey
      });
  },
  onEdit(targetKey, action) {
      console.log("this",this);
      console.log(this[action]);
      this[action](targetKey);
  },
  add() {
      const panes = this.state.panes;
      const activeKey = `newTab${this.newTabIndex++}`;
      panes.push(<TabPane tab="新建页签" key={activeKey}>新页面</TabPane>);
      this.setState({
          panes,
          activeKey
      });
  },
  remove(targetKey) {
      let activeKey = this.state.activeKey;
      let lastIndex;
      this.state.panes.forEach((pane, i) => {
          if (pane.key === targetKey) {
              lastIndex = i - 1;
          }
      });
      const panes = this.state.panes.filter(pane => pane.key !== targetKey);
      if (lastIndex >= 0 && activeKey === targetKey) {
          activeKey = panes[lastIndex].key;
      }
      this.setState({
          panes,
          activeKey
      });
  },
  addTab(e) {
      const panes = this.state.panes;
      //const activeKey = `newTab${this.newTabIndex++}`;
      const activeKey = e.key;
      var tabTitle = e.domEvent.target.innerHTML;
      // 加一个是否有此tab的开关，没有就添加，有就路过
      var flag = false;
      for (var i = 0, len = panes.length; i < len; i++) {
          if (panes[i].key == activeKey) {
              flag = true;
          }
      }
      if (!flag) {
          console.log(e.key);
          if (e.key == 1003050) {
            panes.push(<TabPane tab="单品管理" key={activeKey}><Single_sproduct_Modal/><Single_sproduct_mgr url="/elink_scm_web/sproductAction/query.do"/></TabPane>);
          } else if (e.key == 1002972) {
            panes.push(<TabPane tab={tabTitle} key={activeKey}><Promotion_discount_main /></TabPane>);
          } else {
            panes.push(<TabPane tab={tabTitle} key={activeKey}>新页面</TabPane>);
          }
      }
      this.setState({
          panes,
          activeKey
      });
  },
  promotionClass: function(nodeID) {
    let _self = this;
    let data=null;
    $.ajax({
      url     : '/elink_scm_web/sClassAction/query.do',
      data    :{ id: nodeID, node: nodeID },
      dataType: "json",
      async   : false,
      success: function(result) {
        for(let i=0;i<result.length;i++){
          (function(i){
            if (!result[i].leaf) {
              result[i].children=_self.promotionClass(result[i].id);
            }
            result[i].value=result[i].id;
            result[i].label=result[i].text;
            delete result[i].id;
            delete result[i].text;
          })(i)
        }
        data=result;
      },
    });
    return data;
  },
  promotionClass02: function(resultData) {
    var _self = this;
    for (var i = 0, len = resultData.length; i < len; i++) {
      if (!resultData[i].leaf) {
        (function(i) {
          $.ajax({
            url: _self.props.urlB,
            data: {
              node: resultData[i].id,
              nodeID: resultData[i].id
            },
            dataType: "json",
            async: false,
            success: function(result) {
              resultData[i].tree = result.rows || result;
              // _self.forceUpdate();//强制刷新
              _self.fetchLeaf(resultData[i].tree);
            },
          });
        })(i);
      }
    }
    _self.setState({
      loading: false,
      data: resultData
    });
  },

  promotionClasstest(){
    let ss = this.promotionClass('0');
    console.log("ssss",ss);

  },
  onCascaderChange(value,selectedOptions) {
    console.log(value,selectedOptions);
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
      <div>
        <div style={formStyle}>
          <label>分类选择:</label>
          <Cascader options={this.state.cascaderOptions} expandTrigger="hover" onChange={this.onCascaderChange} placeholder="请选择分类" style={{ width: 230,backgroundColor: 'white' }} />
          <Button type="primary" onClick={this.promotionClasstest} style={{marginLeft:5}} ><Icon type="plus" />添 加</Button>
          <Button type="primary" onClick={this.promotionClasstest} style={{marginLeft:5}} ><Icon type="edit" />修 改</Button>
          <Button type="ghost" onClick={this.promotionClasstest} style={{marginLeft:5}} ><Icon type="delete" />删 除</Button>
          <Button type="ghost" onClick={this.noSelect} style={{float:"right"}} ><Icon type="cross" />不选</Button>
        </div>
        <Table  rowSelection={rowSelection}
                onRowClick={this.handleRowClick}
                columns = {classColumns}//classColumns
                dataSource = {this.state.data}
                scroll={{ x: false, y: false }}
                pagination = {this.state.pagination}
                loading = {loading}
                onChange = {this.handleTableChange}
                rowKey = {record => record.S_Promotion_Range_ID}
                size='small'
                bordered />
      </div>

    );
  },
});

export default Promotion_class_iform;
