import React from 'react';
import { Form, Input, Button, Checkbox, Select, DatePicker, Col, Icon } from 'antd';
import SelectByRefId from '../../common/SelectByRefId';
import ExceptExcel from '../../common/ExportExcel';
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

let formStyle = {
  'padding': '2px 4px',
  'background': '#ededed',
  'border': '1px solid #d9d9d9',
  'borderRadius': 6,
  'marginBottom': 0,
};

let SProductAction_form = React.createClass({
  getInitialState() {
    return {
      loading: false,
    };
  },
  getParas(){
    //调整参数格式
    let paras = this.props.form.getFieldsValue();
    paras.value = paras.value && paras.value.trim();
    paras.S_Product_ID = paras.S_Product_ID && paras.S_Product_ID.trim();
    paras.S_erpProduct_ID = paras.S_erpProduct_ID && paras.S_erpProduct_ID.trim();
    paras.name = paras.name && paras.name.trim();
    return paras;
  },
  handleSubmit(e) {
    e.preventDefault();
    let paras = this.getParas();
    this.props.query(paras);
  },

  render() {
    const { getFieldProps } = this.props.form;
    return (

        <Form inline={true} onSubmit={this.handleSubmit} style={formStyle} >
          <FormItem label="搜索码:">
            <Input placeholder="" style={{ width: 120}} {...getFieldProps('value')} />
          </FormItem>
          <FormItem label="商品编码:">
            <Input placeholder="" style={{ width: 120 }} {...getFieldProps('S_Product_ID')} />
          </FormItem>
          <FormItem label="ERP编码:">
            <Input placeholder="" style={{ width: 120 }} {...getFieldProps('S_erpProduct_ID')} />
          </FormItem>
          <FormItem label="名称:">
            <Input placeholder="" style={{ width: 120 }} {...getFieldProps('name')} />
          </FormItem>
          <Button type="primary" htmlType="submit" style={{'marginLeft':25}} ><Icon type="search" />查询</Button>&nbsp;
        </Form>

    );
  },
});

SProductAction_form = Form.create()(SProductAction_form);
export default SProductAction_form;
