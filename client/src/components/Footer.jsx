import React, {Component} from 'react';
import {Button, Navbar, Nav, NavItem, Glyphicon} from 'react-bootstrap';
import './../styles/Footer.css'

class Footer extends Component {

  render() {
    return (
      <Navbar fixedBottom>
        <Navbar.Text pullLeft>
          Dear <em>{this.props.user.name}</em>, you have {this.props.user.starsToGive} <Glyphicon
          glyph="star"/> left to give, choose wisely!
        </Navbar.Text>
        <Nav pullRight>
          <NavItem>
            <Button
              bsStyle="success"
              bsSize="small"
              onClick={() => this.props.onSubmitClick()}>
              Submit
            </Button>
          </NavItem>
        </Nav>
      </Navbar>
    );
  }
}

export default Footer;
