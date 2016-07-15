import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { selectReddit, fetchPostsIfNeeded, invalidateReddit } from '../../../actions/Single_sproduct_action';
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
            getInitialState() {
                return {
                    selectedRowKeys: [],  // 这里配置默认勾选列
                    data: [],
                    pagination: {pageSize:8,current:1},
                    loading: false,
                };
            },
            handleTableChange(pagination, filters, sorter) {
                // const pager = this.state.pagination;
                // pager.current = pagination.current;
                // this.setState({
                //     pagination: pager,
                // });
                // console.log(pagination);
                const { dispatch } = this.props;
                dispatch(fetchPostsIfNeeded(pagination));
            },
            fetch(params = {}) {
                // console.log('请求参数：', params);
                var _self = this;
                this.setState({
                    loading: true
                });
                $.ajax({
                    url: this.props.url,
                    data: params,
                    dataType: "json",
                    success: function(result) {
                        const pagination = _self.state.pagination;
                        pagination.total = result.total;
                        _self.setState({
                            loading: false,
                            data: result.rows,
                            pagination,
                        });
                    },
                });
            },
            //初始化渲染后触发
            // componentDidMount() {
            //   console.log('执行componentDidMount');
            //   const { dispatch, pagination } = this.props;
            //   dispatch(fetchPostsIfNeeded(pagination));
            // }
            componentDidMount() {
                // console.log('执行componentDidMount');
                const { dispatch, pagination } = this.props;
                dispatch(fetchPostsIfNeeded(pagination));

                // this.fetch({
                //     limit: this.state.pagination.pageSize,
                //     start: (this.state.pagination.current - 1) * this.state.pagination.pageSize
                // });
            },
            start() {
                this.setState({
                    loading: true
                });
                // 模拟 ajax 请求，完成后清空
                setTimeout(() => {
                    this.setState({
                        selectedRowKeys: [],
                        loading: false,
                    });
                }, 500);
            },
            onSelectChange(selectedRowKeys) {
                // console.log('selectedRowKeys changed: ', selectedRowKeys);
                this.setState({
                    selectedRowKeys
                });
            },
            render() {
                const { loading, selectedRowKeys } = this.state;
                const rowSelection = {selectedRowKeys,onChange: this.onSelectChange,};
                const hasSelected = selectedRowKeys.length > 0;
                return (
                    <div>
                        <Single_sproduct_Form query={this.fetch}/>
                        <Single_sproduct_Modal/>
                        < Table     rowSelection={rowSelection}
                                    columns = {columns}
                                    dataSource = {this.props.data}
                                    // scroll={{ x: true, y: 300 }}
                                    pagination = {this.props.pagination}
                                    loading = {this.props.isFetching}
                                    onChange = {this.handleTableChange}
                                    rowKey = {record => record.S_Product_ID}
                                    bordered  />
                    </div>
                );
            },
});

function mapStateToProps(state) {
  const { Single_sproduct_reducer:{sproduct_list} } = state;
  const { isFetching, didInvalidate, selected, data, pagination, lastUpdated
  } = sproduct_list || { isFetching: true, data: [], pagination:{pageSize:8,current:1} }

  return { sproduct_list, isFetching, didInvalidate, selected, data, pagination, lastUpdated }
}

export default connect(mapStateToProps)(Single_sproduct_mgr)
