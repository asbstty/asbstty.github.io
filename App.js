import React from 'react';
import ReactDOM from 'react-dom';
import MyRouter from '@/router';
import { HashRouter as Router } from 'react-router-dom';

function App() {
  return(
    <div>
      <MyRouter></MyRouter>
    </div>
  )
}

ReactDOM.render(
  <Router>
    <App></App>
  </Router>, 
document.getElementById('root'));