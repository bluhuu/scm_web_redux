import React from 'react';
import { Form, Input, Button, Checkbox, Select, DatePicker, Col } from 'antd';
import SelectByRefId from '../../common/SelectByRefId';
import '../../common/Format';
import ExceptExcel from '../../common/ExportExcel';
import Promotion_columns from './Promotion_columns';
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

var formStyle = {
  'padding': '2px 8px',
  'background': "#f8f8f8",
  // 'border': '1px solid #d9d9d9',
  'borderRadius': 6,
  'marginBottom': 4,
};

let Promotion_discount_form = React.createClass({
  getInitialState() {
    return {
      loading: false,
    };
  },
  getParas(){
    //调整参数格式
    let paras = this.props.form.getFieldsValue();
    if(paras.date){
      paras.beginDate = paras.date[0] && paras.date[0].format('yyyy-MM-dd');
      paras.endDate = paras.date[1] && paras.date[1].format('yyyy-MM-dd');
    }
    delete paras.date;
    paras.promotionID = paras.promotionID && paras.promotionID.trim();
    paras.name = paras.name && paras.name.trim();
    return paras;
  },
  handleSubmit(e) {
    e.preventDefault();
    let paras = this.getParas();
    this.props.query(paras);
  },
  exportExcel(e) {
    e.preventDefault();
    this.setState({ loading: true });
    let paras = this.getParas();
    ExceptExcel(paras,Promotion_columns,"/elink_scm_web/promotionAction/promotionListExport.do","折扣管理");
    this.setState({ loading: false });
  },

  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <Form inline={true} onSubmit={this.handleSubmit} style={formStyle} >
          <FormItem label="活动日期:" >
            <RangePicker format="yyyy-MM-dd" style={{ width: 184 }} {...getFieldProps('date')} />
          </FormItem>

          <FormItem label="促销范围:">
            <SelectByRefId refId="1000450" style={{ width: 90 }} {...getFieldProps('promotionObject')} />
          </FormItem>

          <FormItem label="活动编号:">
            <Input placeholder="" style={{ width: 90 }} {...getFieldProps('promotionID')} />
          </FormItem>

          <FormItem label="活动名称:">
            <Input placeholder="" style={{ width: 90 }} {...getFieldProps('name')} />
          </FormItem>

          <Button type="primary" htmlType="submit">查询</Button>&nbsp;
          <Button type="primary" htmlType="button" onClick={this.exportExcel} loading={this.state.loading}>导出</Button>
        </Form>
      </div>
    );
  },
});

Promotion_discount_form = Form.create()(Promotion_discount_form);
export default Promotion_discount_form;
