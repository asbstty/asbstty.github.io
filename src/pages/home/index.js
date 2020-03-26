import React from 'react';
import styles from './index.scss';

export default class Home extends React.Component{

  route(e) {
    const path = e.currentTarget.dataset.path;
    this.props.history.push(path);
  }

  render() {
    const router = [
      {
        title: '贪吃蛇',
        path: '/snake'
      },
      {
        title: '俄罗斯方块',
        path:'/els'
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