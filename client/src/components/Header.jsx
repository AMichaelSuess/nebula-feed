import React, {Component} from 'react';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import './../styles/Header.css'

class Header extends Component {

  render() {
    return (
      <AppBar className={'main-header-appbar'}
              title={"NebulaFeed"}
              iconElementRight={<FlatButton
                label="Log Out"
                href="/logout"
                primary={true}
              />}
      />
    );
  }
}

export default Header;
