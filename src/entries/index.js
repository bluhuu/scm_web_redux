import './index.html';
import './index.less';
import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
//import { browserHistory } from 'react-router';
import App from '../component/App';
import configureStore from '../store/configureStore';
const store = configureStore();
//import Routes from '../routes/index';


ReactDOM.render(
    <Provider store={store}>
      <App width={window.innerWidth} height={window.innerHeight}/>
    </Provider>,
    document.getElementById('react-content'));
