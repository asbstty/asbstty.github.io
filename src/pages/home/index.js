import React from 'react';
import styles from './index.scss';
import {withRouter} from 'react-router-dom';

class Home extends React.Component{

  route(e) {
    const path = e.currentTarget.dataset.path;
    this.props.history.push(path);
  }

  render() {
    const router = [
      {
        title: '11111',
        path: '/snake'
      },
      {
        title: '2222222',
        path:'/b'
      },
      {
        title: 'els',
        path: '/els'
      },
    ];
    return(
      <div className={styles.content}>
        {router.map((item,index) => 
          <div className={styles.item} key={index} data-path={item.path} onClick={this.route.bind(this)}>{item.title}</div>)
        }
      </div>
    )
  }
}

export default withRouter(Home)