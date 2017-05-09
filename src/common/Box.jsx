import styles from "./Box.css"
import React from 'react'

export default class Box extends React.Component {
  render() {
    const { title, children, content } = this.props
    const { Box, titleBar, contentBoard } = styles
    const style = {
      backgroundColor: this.props.admin ? '#365D82' :'#A60209'
    }

    return (
      <div className={Box}>
        <div className={titleBar} style={style}>
            {title}
        </div>
        <div className={contentBoard}>
            {content || children}
        </div>
      </div>
    );
  }
}
