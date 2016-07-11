import React from 'react';
import { Menu, Icon } from 'antd';
var SubMenu = Menu.SubMenu;

var MenuAccordion = React.createClass({
  getInitialState: function() {
    return {
      current: '1',
      openKeys: [],
      loading: false,
      data: [],
      openMenu:{},
    };
  },
  fetch: function(params = {}) {
    var _self = this;
    this.setState({
      loading: true
    });
    $.ajax({
      url: this.props.urlA,
      data: params,
      dataType: "json",
      async: false,
      success: function(result) {
        var resultList = result.rows || result;
        _self.setState({
          loading: false,
          data: resultList //根菜单树组
        });
        _self.fetchLeaf(resultList);
      },
    });
  },
  fetchLeaf: function(resultData) {
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
  componentDidMount: function() {
    this.fetch({
      node: this.props.id,
      nodeID: this.props.id
    });
  },
  handleClick(e) {
    this.props.addTab(e);
    this.setState({
      current: e.key,
      openKeys: e.keyPath.slice(1),
    });
  },
  onToggle(info) {
    //菜单图标动画
    this.state.openMenu = {};
    for (var i = 0; i < info.keyPath.length; i++) {
      this.state.openMenu[info.keyPath[i]] = info.keyPath[i];
    }
    if(!info.open){
      delete this.state.openMenu[info.key];
    }
    this.setState({openKeys: info.open ? info.keyPath : info.keyPath.slice(1)});
  },
  render: function() {
    //菜单图标
    var openIcon="minus-square",closeIcon="plus-square";
    //一级菜单数组
    var repos = this.state.data;
    //菜单结构
    var repoList = [];
    for (var i = 0; i < repos.length; i++) {
      // 一级菜单
      if (repos[i].leaf) {
        repoList.push(<Menu.Item key={repos[i].id}>{repos[i].text}</Menu.Item>);
      } else {
        var repoListJ = [];
        if (repos[i].tree) {
          for (var j = 0; j < repos[i].tree.length; j++) {
            //二级菜单
            if (repos[i].tree[j].leaf) {
              repoListJ.push(<Menu.Item key={repos[i].tree[j].id}>{repos[i].tree[j].text}</Menu.Item>);
            } else {
              var repoListK = [];
              if (repos[i].tree[j].tree) {
                for (var k = 0; k < repos[i].tree[j].tree.length; k++) {
                  //三级菜单
                  if (repos[i].tree[j].tree[k].leaf) {
                    repoListK.push(<Menu.Item key={repos[i].tree[j].tree[k].id}>{repos[i].tree[j].tree[k].text}</Menu.Item>);
                  } else {
                    repoListk.push(<SubMenu key={repos[i].tree[j].tree[k].id} title={<span><Icon type={(repos[i].tree[j].tree[k].id in this.state.openMenu)?openIcon:closeIcon} /><span>{repos[i].tree[j].tree[k].text}</span></span>}>{"..."}</SubMenu>);
                  }
                }
              }
              repoListJ.push(<SubMenu key={repos[i].tree[j].id} title={<span><Icon type={(repos[i].tree[j].id in this.state.openMenu)?openIcon:closeIcon} /><span>{repos[i].tree[j].text}</span></span>}>{repoListK}</SubMenu>);
            }
          }
        }
        // repoList.push(<SubMenu key={repos[i].id} title={<span><Icon type="appstore" /><span>{repos[i].text}</span></span>}>{repoListJ}</SubMenu>);
        repoList.push(<SubMenu
            key={repos[i].id}
            title={<span><Icon type={(repos[i].id in this.state.openMenu)?openIcon:closeIcon} /> < span > {repos[i].text } < /span></span > }
          >{repoListJ }
          < /SubMenu>);
      }
    }
    return (
        <Menu   onClick={this.handleClick}
                style={{ width: 240 }}
                openKeys={this.state.openKeys}
                onOpen={this.onToggle}
                onClose={this.onToggle}
                selectedKeys={[this.state.current]}
                theme = "dark"
                mode="inline"
                >
        {repoList}
        </Menu>
    );
  },
});
export default MenuAccordion;
