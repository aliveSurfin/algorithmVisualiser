"use strict";

import React, { Component } from "react";
import { OffCanvas, OffCanvasMenu, OffCanvasBody } from "react-offcanvas";
import './SideOptions.scss'
export default class SideOptions extends Component {
  constructor(props) {
    super(props)
    this.solve = props.solve;
    this.speedCall = props.speed;
    this.speed = props.speedValue;
    this.speedMax = props.speedMax;
    this.label = props.label;

  }
  speedCallback(sp){
    this.setState({speed:sp},this.speedCall(sp))
  }
  componentWillMount() {
    // sets the initial state
    this.setState({
      isMenuOpened: false,
      speed:this.speed
      
    });
  }

  render() {
    let sideArrowClass = `button switch${this.state.isMenuOpened ? " rightArrow" : ""}`
    return (
      <OffCanvas
        transitionDuration={300}
        effect={"push"}
        isMenuOpened={this.state.isMenuOpened}
        position={"right"}
      >
        <OffCanvasBody

        >
          <div className="open-settings" onClick={this.handleClick.bind(this)}>
          
            <a className={sideArrowClass} >
              <div className="arrow"></div>
            </a>
            

          </div>
        </OffCanvasBody>
        <OffCanvasMenu
          className="settings" 
        >

          <div className="speed-slider">
            <div className="speed-label">
              Speed {Math.abs(this.state.speed-this.speedMax)}
            </div>
          <input defaultValue={this.state.speed} min={2} max={this.speedMax} type="range" onChange={(e)=>{this.speedCallback(e.target.value)}}/>
          </div>
          <div className="side-solve" onClick={this.solveClose.bind(this)} >
            {this.label}
              </div>

        </OffCanvasMenu>
      </OffCanvas>
    );
  }

  handleClick() {
    // toggles the menu opened state
    this.setState({ isMenuOpened: !this.state.isMenuOpened });
  }
  solveClose() {
    this.setState({ isMenuOpened: false }, this.solve);
  }
}