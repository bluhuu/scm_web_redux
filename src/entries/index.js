import './index.html';
import './index.less';
import ReactDOM from 'react-dom';
import React from 'react';
//import { browserHistory } from 'react-router';
import App from '../component/App';
//import Routes from '../routes/index';


ReactDOM.render(
    <App width={window.innerWidth}
      height={window.innerHeight}/>
    , document.getElementById('react-content'));