import React from 'react';
import { Form, Input, Button, Checkbox, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

let Single_sproduct_Form = React.createClass({


    handleSubmit(e) {
        e.preventDefault();
        console.log('收到表单值：', this.props.form.getFieldsValue());
        this.props.query(this.props.form.getFieldsValue());
    },

  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
      <Form inline onSubmit={this.handleSubmit} style={{padding:"16px 8px", background:"#f8f8f8",  border:"1px solid #d9d9d9",  border:"6px"}}>

        <FormItem label="商品:">
          <Input placeholder="商品编码/名称" id="name" style={{ width: 90 }}
            {...getFieldProps('name')} />
        </FormItem>

        <FormItem label="ERP商品编码:">
          <Input placeholder="" style={{ width: 90 }}
            {...getFieldProps('productCode')} />
        </FormItem>

        <FormItem label="品牌名称:">
          <Input placeholder="" style={{ width: 90 }}
            {...getFieldProps('brandName')} />
        </FormItem>

        <FormItem id="select" label="是否活跃:">
          <Select id="select" size="large" defaultValue="yes" style={{ width: 60 }} {...getFieldProps('isActive')}>
            <Option value="A">全部</Option>
            <Option value="Y">是</Option>
            <Option value="N">否</Option>
          </Select>
        </FormItem>

        <FormItem
          id="select"
          label="是否已上架:">
          <Select id="select" size="large" defaultValue="yes" style={{ width: 60 }} {...getFieldProps('isShelved')}>
            <Option value="A">全部</Option>
            <Option value="Y">是</Option>
            <Option value="N">否</Option>
          </Select>
        </FormItem>

        <Button type="primary" htmlType="submit">查询</Button>&nbsp;
        <Button type="primary" htmlType="button">导出</Button>
      </Form>
      </div>
    );
  },
});

Single_sproduct_Form = Form.create()(Single_sproduct_Form);
export default Single_sproduct_Form;
