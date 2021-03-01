import React, { Component, createRef } from 'react'
import './node.scss'
export default class Node extends Component {
    constructor(props) {
        super(props)
        this.state = {
            x: props.x,
            y: props.y,
            id: +props.x + "|" + props.y,
            class: props.type,
            ref: props.refpass,
        }
        
    }
    render() {
        return (
            <div id={this.state.id} className={this.state.class}
                ref={this.state.ref}
                onMouseDown={() => this.props.onMouseDown(this.state.ref,this.state.x,this.state.y)}
                onMouseEnter={() => this.props.onMouseEnter(this.state.ref,this.state.x,this.state.y)}
                onMouseUp={() => this.props.onMouseUp(this.state.ref,this.state.x,this.state.y)}>
            </div>
        )
    }
}
