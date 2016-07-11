import React from 'react';
import { Button, Form, Input, Modal, Icon, Row, Col, Radio, DatePicker, message } from 'antd';
import SelectByRefId from '../../common/SelectByRefId';
import '../../common/Format';
const createForm = Form.create;
const FormItem   = Form.Item;
const RadioGroup = Radio.Group;

//初始参数
let rowData = {
  PromotionObject    : "CL", //促销对象
  PromotionName      : "", //促销名称
  BeginDate          : new Date(), //开始时间
  EndDate            : new Date().getDateOfNextMonth(), //结束时间
  PromotionRuleType  : "AMT", //促销规则
  SBuyAmt            : "", //购满金额
  SProductQty        : "", //购满件数
  PromotionReduceType: "AMT", //减免类型
  ReductionAmt       : "", //减免金额
  Discount           : "", //减免折扣
  IsRepeat           : "Y", //多买多送
  ReturnAbled        : "N", //可否退货
  Description        : "", //规则说明
  PromotionType      : "DISCOUNT"//促销类型
};

let Promotion_discount_modal = React.createClass({
  getInitialState() {
    return {
      visible: false,
      rowData: rowData
     };
  },

  handleSubmit() {
    let params           = this.props.form.getFieldsValue();
    params.PromotionType = "DISCOUNT";
    params.beginDate     = typeof params.beginDate =="string" ? params.beginDate:params.beginDate.format('yyyy-MM-dd');
    params.endDate       = typeof params.endDate =="string" ? params.endDate :params.endDate.format('yyyy-MM-dd');
    if (this.props.selectedRows) {
      params.PromotionID     = this.state.rowData.S_PROMOTION_ID;
      params.PromotionRuleID = this.state.rowData.S_PROMOTION_RULE_ID;
    }
    this.props.addEdit(params);
    this.hideModal();
  },
  handleReset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },
  componentDidMount() {
  },
  showModal() {
    if (!this.props.selectedRows) {//如果是添加
      this.setState({visible: true});
    } else if (this.props.selectedRows) {//如果是修改
      if (this.props.selectedRows) {
        let selectedRows = this.props.selectedRows;
        if (selectedRows.length == 1) {
          this.setState({visible: true, rowData: selectedRows[0]});
          this.props.form.resetFields();//加载数据后，form重置
        } else if (selectedRows.length > 1) {
          message.warn("只能选择一个活动项目！", 6);
        } else {
          message.warn("请选择一个活动项目！", 6);
        }
      }
    }
  },
  hideModal() {
    this.setState({ visible: false });
  },
  ruleTypeChange(value){
    this.state.rowData.PromotionRuleType=value;
  },
  reduceTypeChange(value){
    this.state.rowData.PromotionReduceType=value;
  },

  render() {
    const { getFieldProps } = this.props.form;
    const {rowData} = this.state;
    const formItemLayout    = {
      labelCol  : { span : 8 },
      wrapperCol: { span : 16 },
    };
    return (
      <div style={{display:'inline',marginLeft:5}} {...this.props.ss}>
        <Button type="ghost" onClick={this.showModal} size="small"><Icon type={this.props.selectedRows?"edit":"plus"} />{this.props.selectedRows?"修 改":"添 加"}</Button>
        <Modal title={this.props.selectedRows?"修 改":"添 加"} width="680" visible={this.state.visible} onOk={this.handleSubmit} onCancel={this.hideModal}
              footer={[
                <Button key="back" type="ghost" size="large" style={{width:85}} onClick={this.hideModal}>返 回</Button>,
                <Button key="reset" type="ghost" size="large" onClick={this.handleReset}><Icon type="reload" />重 置</Button>,
                <Button key="submit" type="primary" size="large"  onClick={this.handleSubmit}><Icon type="check" />提 交</Button>
              ]} >
          <Form horizontal form={this.props.form} style={{padding:"0px 20px"}}>
            <Row gutter={16} >
              <Col span="11" >
                <FormItem {...formItemLayout} label="促销名称:" style={{margin:"3px 0px"}}>
                  <Input {...getFieldProps('name', {initialValue:rowData.PromotionName})} type="text"  autoComplete="off"/>
                </FormItem>
                <FormItem {...formItemLayout} label="开始时间:" style={{margin:"3px 0px"}}>
                  <DatePicker style={{width:'100%'}} {...getFieldProps('beginDate', {initialValue:rowData.BeginDate})} />
                </FormItem>
                <FormItem {...formItemLayout} label="促销规则:" style={{margin:"3px 0px"}}>
                  <SelectByRefId
                    refId="1000451"
                    {...getFieldProps('promotionRuleType',{initialValue:rowData.PromotionRuleType,onChange:this.ruleTypeChange})}
                    style={{ width: '100%' }}/>
                </FormItem>

                <FormItem {...formItemLayout} label={rowData.PromotionRuleType=="AMT"?"购满金额:":"购满件数:"} style={{margin:"3px 0px"}}>
                  {rowData.PromotionRuleType=="AMT"
                    ? <Input {...getFieldProps('SBuyAmt', {initialValue:rowData.SBuyAmt})} type="text" autoComplete="off" addonAfter="元"/>
                    : <Input {...getFieldProps('SProductQty', {initialValue:rowData.SProductQty})} type="text" autoComplete="off" addonAfter="件"/>}
                </FormItem>

                <FormItem {...formItemLayout} label="多买多送:" style={{margin:"3px 0px"}}>
                  <RadioGroup style={{'paddingLeft':20}} {...getFieldProps('IsRepeat', {initialValue:rowData.IsRepeat})}>
                    <Radio value="Y">是</Radio> <Radio value="N">否</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem {...formItemLayout} label="促销范围:" style={{margin:"3px 0px"}}>
                  <SelectByRefId refId="1000450" {...getFieldProps('promotionObject',{initialValue:rowData.PromotionObject})} style={{ width: '100%' }}/>
                </FormItem>
                <FormItem {...formItemLayout} label="结束时间:" style={{margin:"3px 0px"}}>
                  <DatePicker style={{width:'100%'}} {...getFieldProps('endDate', {initialValue:rowData.EndDate})} />
                </FormItem>
                <FormItem {...formItemLayout} label="减免类型:" style={{margin:"3px 0px"}}>
                  <SelectByRefId
                    refId="1000452"
                    {...getFieldProps('reduceType',{initialValue:rowData.PromotionReduceType,onChange:this.reduceTypeChange})}
                    style={{ width: '100%' }}/>
                </FormItem>

                <FormItem {...formItemLayout} label={rowData.PromotionReduceType=="AMT"?"减免金额:":"减免折扣:"} style={{margin:"3px 0px"}}>
                  {rowData.PromotionReduceType=="AMT"
                    ? <Input {...getFieldProps('reductionAmt', {initialValue:rowData.ReductionAmt})} type="text" autoComplete="off" addonAfter="元"/>
                    : <div style={{width:80}}><Input {...getFieldProps('Discount', {initialValue:rowData.Discount})} type="text" autoComplete="off" addonAfter="%"/> </div>}
                </FormItem>

                <FormItem {...formItemLayout} label="可否退货:" style={{margin:"3px 0px"}}>
                  <RadioGroup style={{'paddingLeft':20}} {...getFieldProps('ReturnAbled', {initialValue:rowData.ReturnAbled})}>
                    <Radio value="Y">是</Radio> <Radio value="N">否</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16} >
              <Col span="22">
                <FormItem label="规则说明:" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  <Input type="textarea" rows={5} {...getFieldProps('descript', {initialValue:rowData.Description})} />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  },
});

Promotion_discount_modal = createForm()(Promotion_discount_modal);

export default Promotion_discount_modal;
