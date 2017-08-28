import React, {Component} from 'react';
import {Button, Navbar, Nav, NavItem, Glyphicon} from 'react-bootstrap';
import './../styles/Footer.css'

class Footer extends Component {

  render() {
    return (
      <Navbar fixedBottom>
        <Navbar.Text pullLeft>
          You have 4 <Glyphicon glyph="star"/> left to give, choose wisely!
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
