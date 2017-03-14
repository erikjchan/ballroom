import styles from "./Box.css"
import React from 'react'

export default class Box extends React.Component {
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
