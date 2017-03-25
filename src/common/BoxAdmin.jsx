import styles from "./BoxAdmin.css"
import React from 'react'

export default class BoxAdmin extends React.Component {
  render() {
    return (
      <div className={styles.Box}>
        <div className={styles.titleBar}>
            {this.props.title}
        </div>
        <div className={styles.contentBoard}>
            {this.props.content}
        </div>
      </div>
    );
  }
}
