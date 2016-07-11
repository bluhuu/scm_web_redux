import React from 'react';
import { Button, Form, Input, Modal, Icon, Row, Col } from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;

let Single_sproduct_Modal = React.createClass({
  getInitialState() {
    return { visible: false };
  },

  handleSubmit() {
    console.log(this.props.form.getFieldsValue());
    this.hideModal();
  },

  showModal() {
    this.setState({ visible: true });
  },

  hideModal() {
    this.setState({ visible: false });
  },

  render() {
    const { getFieldProps } = this.props.form;

    const formItemLayout = {
      labelCol: { span : 4 },
      wrapperCol: { span : 20 },
    };
    return (
      <div>
        <Button type="primary" onClick={this.showModal} size="small"><Icon type="plus" />添加</Button>
        <Modal title="添加商品" width="820" visible={this.state.visible} onOk={this.handleSubmit} onCancel={this.hideModal}>
          <Form horizontal  className="ant-advanced-search-form" form={this.props.form} style={{padding:20}}>
            <Row gutter={16} >
              <Col span="8" >
                <FormItem {...formItemLayout}
                  label="ERP商品："
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 15 }}
                  style={{margin:3}}>
                  <Input {...getFieldProps('username', {})} type="text"  autoComplete="off"/>
                </FormItem>
                <FormItem {...formItemLayout} label="品名："
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 15 }}
                  style={{margin:3}}>
                  <Input {...getFieldProps('password', {})} type="text" autoComplete="off"/>
                </FormItem>
                <FormItem {...formItemLayout} label="商品编码："
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 15 }}
                  style={{margin:3}}>
                  <Input {...getFieldProps('username', {})} type="text" autoComplete="off" size="small"/>
                </FormItem>
                <FormItem {...formItemLayout} label="ERP商品编码："
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 15 }}
                  style={{margin:3}}>
                  <Input {...getFieldProps('username', {})} type="text" autoComplete="off" size="small"/>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem {...formItemLayout} label="规格："
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 15 }}
                  style={{margin:3}}>
                  <Input {...getFieldProps('username', {})} type="text" autoComplete="off" size="default"/>
                </FormItem>
                <FormItem {...formItemLayout} label="单位："
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 15 }}
                  style={{margin:3}}>
                  <Input {...getFieldProps('username', {})} type="text" autoComplete="off" size="default"/>
                </FormItem>
                <FormItem {...formItemLayout} label="是否医保："
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 15 }}
                  style={{margin:3}}>
                  <Input {...getFieldProps('username', {})} type="text" autoComplete="off" size="default"/>
                </FormItem>
                <FormItem {...formItemLayout} label="是否基药："
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 15 }}
                  style={{margin:3}}>
                  <Input {...getFieldProps('username', {})} type="text" autoComplete="off" size="default"/>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem {...formItemLayout} label="大包装："
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 15 }}
                  style={{margin:3}}>
                  <Input {...getFieldProps('username', {})} type="text" autoComplete="off" size="default"/>
                </FormItem>
                <FormItem {...formItemLayout} label="小包装："
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 15 }}
                  style={{margin:3}}>
                  <Input {...getFieldProps('username', {})} type="text" autoComplete="off" size="default"/>
                </FormItem>
                <FormItem {...formItemLayout} label="检索码："
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 15 }}
                  style={{margin:3}}>
                  <Input {...getFieldProps('username', {})} type="text" autoComplete="off" size="default"/>
                </FormItem>
                <FormItem {...formItemLayout} label="采购价："
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 15 }}
                  style={{margin:3}}>
                  <Input {...getFieldProps('username', {})} type="text" autoComplete="off"/>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  },
});

Single_sproduct_Modal = createForm()(Single_sproduct_Modal);

export default Single_sproduct_Modal;
