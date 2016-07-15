import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { selectReddit, fetchPostsIfNeeded, invalidateReddit } from '../actions';
import CTabs from './CTabs';
import MenuAccordion from './MenuAccordion';
// import NavbarSide from '../component/NavbarSide';

class App extends Component {
  constructor(props) {
    super(props);
    this.addTab = this.addTab.bind(this);
  }
  addTab(e) {
    this.refs.Rctabs.addTab(e);
  }
  //初始化渲染后触发
  componentDidMount() {
    console.log('执行componentDidMount');
    const { dispatch, pagination } = this.props;
    dispatch(fetchPostsIfNeeded(pagination));
  }
  render() {
    return (
      <div>
          <nav className="navbar-default navbar-side" role="navigation">
            {/*<NavbarSide addTab = {this.addTab}/>*/}
            <MenuAccordion addTab = {this.addTab} urlA="/elink_scm_web/menuTreeAction/loadAccordion.do" urlB="/elink_scm_web/menuTreeAction/tree.do"/>
          </nav>
          <div id="page-wrapper" className="border table-bordered">
              <div id="page-inner">
                <div className="row">
                  <div className="col-md-12 col-sm-12 col-xs-12">
                    <div className="board">
                      <div className="panel panel-primary">
                        <CTabs ref="Rctabs"/>
                      </div>
                    </div>
                  </div>
                </div>
                <footer><p>Copyright 2016版权所有@<a href='http://www.nyysfw.com' target='_blank'>南京医药药事服务有限公司</a> </p>
                </footer>
              </div>
          </div>
        </div>
    );
  }
}

// App.propTypes = {
//   selectedReddit: PropTypes.string.isRequired,
//   posts: PropTypes.array.isRequired,
//   isFetching: PropTypes.bool.isRequired,
//   lastUpdated: PropTypes.number,
//   dispatch: PropTypes.func.isRequired
// }

function mapStateToProps(state) {
  const { Single_sproduct_reducer:{sproduct_list} } = state;
  // const { sproduct_list } = Single_sproduct_reducer;
  console.log("state: ",state);
  console.log("sproduct_list: ",sproduct_list);
  const {
    isFetching,
    didInvalidate,
    selected,
    data,
    pagination,
    lastUpdated
  } = sproduct_list || {
    isFetching: true,
    data: [],
    pagination:{pageSize:8,current:1}
  }

  return {
    sproduct_list,
    isFetching,
    didInvalidate,
    selected,
    data,
    pagination,
    lastUpdated
  }
}

export default connect(mapStateToProps)(App)
