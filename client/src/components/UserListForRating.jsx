import React, {Component} from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import StarRatingComponent from 'react-star-rating-component';
import '../styles/UserListForRating.css'

class UserListForRating extends Component {

  render() {
    let usersList = this.props.users.map((user, index) => {
      return (
        <TableRow key={user.userId}>
          <TableRowColumn>{user.name}</TableRowColumn>
          <TableRowColumn>{user.title}</TableRowColumn>
          <TableRowColumn>{user.team}</TableRowColumn>
          <TableRowColumn>
            <div style={{fontSize: 20}}>
              <StarRatingComponent
                name={`rate-${user.userId}`}
                starCount={5}
                value={user.score}
                editing={this.props.ratingsEnabled}
                onStarClick={(nextValue, prevValue, name) => this.props.onStarClick(nextValue, index)}
              />
            </div>
          </TableRowColumn>
          <TableRowColumn>
            <FlatButton
              primary={true}
              onClick={() => this.props.onResetClick(index)}>Reset
            </FlatButton>
          </TableRowColumn>
        </TableRow>
      );
    });

    return (
      <Table
        fixedHeader={true}
        selectable={false}
      >
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
          enableSelectAll={false}
        >
          <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Title</TableHeaderColumn>
            <TableHeaderColumn>Team</TableHeaderColumn>
            <TableHeaderColumn>Rate!</TableHeaderColumn>
            <TableHeaderColumn>Reset!</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
          stripedRows={true}
        >
          {usersList}
        </TableBody>
      </Table>
    );
  }
}

export default UserListForRating;
