import React, {Component} from 'react';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import ToggleStar from 'material-ui/svg-icons/toggle/star';
import './../styles/Footer.css'

class Footer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  handleConfirmDialogOpen = () => {
    this.setState({open: true});
  };

  handleConfirmDialogCloseCancel = () => {
    this.setState({open: false});
  };

  handleConfirmDialogCloseSubmit = () => {
    this.setState({open: false});
    this.props.onSubmitClick();
  };

  render() {
    const actions = [
      <RaisedButton
        label="Cancel"
        onClick={this.handleConfirmDialogCloseCancel}
      />,
      <RaisedButton
        label="Submit"
        secondary={true}
        onClick={this.handleConfirmDialogCloseSubmit}
      />,
    ];

    return (
      <div>
        <Toolbar>
          <ToolbarGroup firstChild={true}>
          <span
            className={"main-footer-text"}>Dear <em>{this.props.user.name}</em>,
            you have {this.props.user.starsToGive} <ToggleStar/> left to give, choose wisely!</span>
          </ToolbarGroup>
          <ToolbarGroup>
            <RaisedButton
              onClick={() => this.handleConfirmDialogOpen()}
              label="Submit"
              primary={true}/>
          </ToolbarGroup>
        </Toolbar>
        <Dialog
          title="You are about to grant stars to x people!"
          actions={actions}
          modal={true}
          open={this.state.open}
        >
          <TextField
            floatingLabelText="Please describe the business value created (optional):"
            hintText="160 characters maximum"
            fullWidth={true}
            multiLine={true}
            rows={1}
            maxLength={160}
            onChange={(e, newValue) => this.props.onSubmitMsgChanged(newValue)}
          />
        </Dialog>
      </div>
    );
  }
}

export default Footer;
