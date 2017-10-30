import React, {Component} from 'react';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import ToggleStar from 'material-ui/svg-icons/toggle/star';
import './../styles/Footer.css'

class Footer extends Component {
  render() {
    return (
      <Toolbar>
        <ToolbarGroup firstChild={true}>
          <span
            className={"main-footer-text"}>Dear <em>{this.props.user.name}</em>,
            you have {this.props.user.starsToGive} <ToggleStar/> left to give, choose wisely!</span>
        </ToolbarGroup>
        <ToolbarGroup>
          <RaisedButton
            onClick={(e) => this.props.onSubmitClicked()}
            label="Submit"
            disabled={this.props.submitDisabled}
            primary={true}/>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

export default Footer;
