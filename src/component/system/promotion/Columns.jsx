import React from 'react';
let columns = [{
    title: '活动编号',
    width: 120,
    sortable: true,
    dataIndex: 'S_PROMOTION_ID',
    key: 'S_PROMOTION_ID',
}, {
    title: '促销对象',
    width: 120,
    sortable: true,
    dataIndex: 'PromotionObjectName',
    key: 'PromotionObjectName'
}, {
    title: '促销名称',
    width: 200,
    sortable: true,
    dataIndex: 'PromotionName',
    key: 'PromotionName'
}, {
    title: '促销规则',
    width: 120,
    sortable: true,
    dataIndex: 'PromotionRuleTypeName',
    key: 'PromotionRuleTypeName'
}, {
    title: '可否退货',
    width: 120,
    sortable: true,
    dataIndex: 'ReturnAbled',
    key: 'ReturnAbled'
}, {
    title: '购满金额',
    width: 120,
    sortable: true,
    dataIndex: 'SBuyAmt',
    key: 'SBuyAmt'
}, {
    title: '购满件数',
    width: 120,
    sortable: true,
    dataIndex: 'SProductQty',
    key:'SProductQty'
}, {
    title: '减免类型',
    width: 150,
    sortable: true,
    dataIndex: 'PromotionReduceTypeName',
    key:'PromotionReduceTypeName'
}, {
    title: '减免金额',
    width: 120,
    sortable: true,
    dataIndex: 'ReductionAmt',
    key:'ReductionAmt'
}, {
    title: '减免折扣',
    width: 120,
    sortable: true,
    dataIndex: 'Discount',
    key:'Discount'
}, {
    title: '开始时间',
    width: 150,
    sortable: true,
    dataIndex: 'BeginDate',
    key:'BeginDate'
}, {
    title: '结束时间',
    width: 150,
    sortable: true,
    dataIndex: 'EndDate',
    key: 'EndDate'
},
// {
//     title: '操作',
//     key: 'operation',
//     fixed: 'right',
//     width: 150,
//     render: () => <a href="#">操作</a>,
// },
];
export default columns;
