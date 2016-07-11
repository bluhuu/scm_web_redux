import React from 'react';
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;

const NavbarSide = React.createClass({
  getInitialState() {
    return {
      current: '1',
      openKeys: [],
    };
  },
  handleClick(e) {
    this.props.addTab(e);
    this.setState({
      current: e.key,
      openKeys: e.keyPath.slice(1),
    });
  },
  onToggle(info) {
    this.setState({
      openKeys: info.open ? info.keyPath : info.keyPath.slice(1),
    });
  },
  render() {
    return (
      <Menu onClick={this.handleClick}
        style={{ width: 240 }}
        openKeys={this.state.openKeys}
        onOpen={this.onToggle}
        onClose={this.onToggle}
        selectedKeys={[this.state.current]}
        theme = "dark"
        mode="inline"
      >
        <SubMenu key="sub10" title={<span><Icon type="appstore" /><span>商品管理</span></span>}>
          <Menu.Item key="101">单品管理</Menu.Item>
          <SubMenu key="sub11" title="商品价格管理">
            <Menu.Item key="111">群组价管理</Menu.Item>
            <Menu.Item key="112">协议价管理</Menu.Item>
            <Menu.Item key="113">会员等级价管理</Menu.Item>
          </SubMenu>
          <Menu.Item key="102">商品上下架设置</Menu.Item>
          <Menu.Item key="103">商品品牌设置</Menu.Item>
          <Menu.Item key="104">商品分类管理</Menu.Item>
          <Menu.Item key="105">商品库存管理</Menu.Item>
        </SubMenu>
        <SubMenu key="sub20" title={<span><Icon type="appstore" /><span>客商管理</span></span>}>
          <Menu.Item key="201">客商信息管理</Menu.Item>
        </SubMenu>
        <SubMenu key="sub30" title={<span><Icon type="appstore" /><span>交易管理</span></span>}>
          <SubMenu key="sub31" title="支付方式管理">
            <Menu.Item key="311">支付方式维护</Menu.Item>
          </SubMenu>
          <SubMenu key="sub32" title="订单管理">
            <Menu.Item key="321">订单查询</Menu.Item>
            <Menu.Item key="322">订单明细</Menu.Item>
            <Menu.Item key="323">退货申请</Menu.Item>
            <Menu.Item key="324">退货审核</Menu.Item>
          </SubMenu>
        </SubMenu>
        <SubMenu key="sub40" title={<span><Icon type="appstore" /><span>促销管理</span></span>}>
          <SubMenu key="sub41" title="折扣促销">
            <Menu.Item key="411">折扣管理</Menu.Item>
          </SubMenu>
          <SubMenu key="sub42" title="赠品促销">
            <Menu.Item key="421">赠品促销管理</Menu.Item>
          </SubMenu>
        </SubMenu>
        <SubMenu key="sub50" title={<span><Icon type="appstore" /><span>会员中心</span></span>}>
          <SubMenu key="sub51" title="留言管理">
            <Menu.Item key="511">用户留言</Menu.Item>
          </SubMenu>
          <SubMenu key="sub52" title="会员管理">
            <Menu.Item key="521">申请受理</Menu.Item>
            <Menu.Item key="522">会员开户</Menu.Item>
            <Menu.Item key="523">会员管理</Menu.Item>
            <Menu.Item key="524">会员等级设置</Menu.Item>
            <Menu.Item key="525">会员角色设置</Menu.Item>
            <Menu.Item key="526">微信绑定</Menu.Item>
          </SubMenu>
        </SubMenu>
        <SubMenu key="sub60" title={<span><Icon type="appstore" /><span>营销中心</span></span>}>
          <Menu.Item key="601">商城新品需求</Menu.Item>
          <Menu.Item key="602">缺货登记查询</Menu.Item>
          <SubMenu key="sub61" title="CMS管理PC">
            <Menu.Item key="611">文章管理</Menu.Item>
            <Menu.Item key="612">广告管理</Menu.Item>
            <Menu.Item key="613">商品评价</Menu.Item>
          </SubMenu>
          <SubMenu key="sub62" title="CMS管理微信">
            <Menu.Item key="621">文章管理</Menu.Item>
            <Menu.Item key="622">广告管理</Menu.Item>
            <Menu.Item key="623">商品评价</Menu.Item>
          </SubMenu>
          <Menu.Item key="603">推荐商品</Menu.Item>
          <Menu.Item key="604">频道商品</Menu.Item>
          <Menu.Item key="605">热销排行</Menu.Item>
        </SubMenu>
        <SubMenu key="sub70" title={<span><Icon type="appstore" /><span>监管中心</span></span>}>
          <Menu.Item key="701">投诉处理监管</Menu.Item>
          <Menu.Item key="702">信息发布监管</Menu.Item>
          <Menu.Item key="703">经营商品监管</Menu.Item>
          <Menu.Item key="704">客商资质监管</Menu.Item>
          <Menu.Item key="705">交易订单监管</Menu.Item>
        </SubMenu>
        <SubMenu key="sub80" title={<span><Icon type="appstore" /><span>统计分析</span></span>}>
          <Menu.Item key="801">浏览商品统计</Menu.Item>
        </SubMenu>
        <SubMenu key="sub90" title={<span><Icon type="appstore" /><span>系统管理</span></span>}>
          <Menu.Item key="901">缓存管理</Menu.Item>
          <Menu.Item key="902">用户管理</Menu.Item>
        </SubMenu>
      </Menu>
    );
  },
});
export default NavbarSide;