import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { selectSproductItem, fetchPostsIfNeeded, invalidateReddit } from '../../../actions/Single_sproduct_action';
import {Table, Button} from 'antd';
import * as $ from 'jquery';
import Single_sproduct_Form from './Single_sproduct_Form'
import Single_sproduct_Modal from './Single_sproduct_Modal';

const columns = [
    {
      title: '品名',
      width: 150,
      sortable: true,
      dataIndex: 'Name',
      // fixed: 'left'
  }, {
      title: '商品编码',
      width: 100,
      sortable: true,
      dataIndex: 'S_Product_ID'
  }, {
      title: '搜索码',
      width: 100,
      sortable: true,
      dataIndex: 'Value'
  }, {
      title: '通用名',
      width: 150,
      sortable: true,
      dataIndex: 'MedicineName'
  }, {
      title: '商品名',
      width: 150,
      sortable: true,
      dataIndex: 'ProductName'
  }, {
      title: '规格',
      width: 120,
      sortable: true,
      dataIndex: 'ProductSpec'
  }, {
      title: '剂型',
      width: 80,
      sortable: true,
      dataIndex: 'ProductStyleName'
  }, {
      title: '生产厂家',
      width: 150,
      sortable: true,
      dataIndex: 'Manufacturer'
  }, {
      title: '单位',
      width: 50,
      sortable: true,
      dataIndex: 'UOMName'
  }, {
      title: '零售单位',
      width: 100,
      sortable: true,
      dataIndex: 'RetailUOMName'
  }, {
      title: '零售转批发单位系数',
      width: 120,
      sortable: true,
      dataIndex: 'UOMRatio'
  }, {
      title: 'ERP商品编码',
      width: 100,
      sortable: true,
      dataIndex: 'ProductCode'

  },
  // {
  //     title: '操作',
  //     key: 'operation',
  //     fixed: 'right',
  //     width: 100,
  //     render: () => <a href="#">操作</a>,
  // },
 ];

const Single_sproduct_mgr = React.createClass({
            handleTableChange(pagination, filters, sorter) {
                const { dispatch, params } = this.props;
                dispatch(fetchPostsIfNeeded(pagination, params));
            },
            fetch(params = {}) {
              const { dispatch, pagination } = this.props;
              let page = Object.assign({},pagination,{current:1});
              dispatch(fetchPostsIfNeeded(page,params));
            },
            componentDidMount() {
                const { dispatch, pagination, params } = this.props;
                dispatch(fetchPostsIfNeeded(pagination, params));
            },
            onSelectChange(selectedRowKeys) {
                const { dispatch } = this.props;
                dispatch(selectSproductItem(selectedRowKeys))
            },
            handleRowClick(record,index) {
              const { dispatch } = this.props;
              let keySet = new Set(this.props.selectedRowKeys);
              if(keySet.delete(record.S_Product_ID)){
                dispatch(selectSproductItem([...keySet]))
              }else{
                dispatch(selectSproductItem([...keySet.add(record.S_Product_ID)]))
              }
            },
            render() {
                // const { loading, selectedRowKeys } = this.props;
                const rowSelection = {selectedRowKeys:this.props.selectedRowKeys, onChange: this.onSelectChange,};
                // const hasSelected = selectedRowKeys.length > 0;
                return (
                    <div>
                        <Single_sproduct_Form query={this.fetch}/>
                        <Single_sproduct_Modal/>
                        < Table     rowSelection={rowSelection}
                                    onRowClick={this.handleRowClick}
                                    columns = {columns}
                                    dataSource = {this.props.data}
                                    // scroll={{ x: true, y: 300 }}
                                    pagination = {this.props.pagination}
                                    loading = {this.props.loading}
                                    onChange = {this.handleTableChange}
                                    rowKey = {record => record.S_Product_ID}
                                    bordered  />
                    </div>
                );
            },
});

function mapStateToProps(state) {
  const { Single_sproduct_reducer:{sproduct_list} } = state;
  const { loading, didInvalidate, selectedRowKeys, data, pagination, lastUpdated, params
  } = sproduct_list || { loading: true, data: [], pagination:{pageSize:8,current:1,total:0} }

  return { sproduct_list, loading, didInvalidate, selectedRowKeys, data, pagination, lastUpdated, params }
}

export default connect(mapStateToProps)(Single_sproduct_mgr)
