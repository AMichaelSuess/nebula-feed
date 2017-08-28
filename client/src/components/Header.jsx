import React, {Component} from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import './../styles/Header.css'

class Header extends Component {

  render() {
    return (
      <Navbar collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            NebulaFeed
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} href="#">Appreciate</NavItem>
          </Nav>
          <Nav>
            <NavItem eventKey={2} href="#">Add Colleague</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;
