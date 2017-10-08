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
import './../styles/ColleagueList.css'

class ColleagueList extends Component {

  render() {
    let charactersList = this.props.colleagues.map((colleague, index) => {
      return (
        <TableRow key={colleague.colleagueId}>
          <TableRowColumn>{colleague.name}</TableRowColumn>
          <TableRowColumn>{colleague.title}</TableRowColumn>
          <TableRowColumn>{colleague.team}</TableRowColumn>
          <TableRowColumn>
            <div style={{fontSize: 20}}>
              <StarRatingComponent
                name={`rate-${colleague.colleagueId}`}
                starCount={5}
                value={colleague.score}
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
            {charactersList}
          </TableBody>
        </Table>
    );
  }
}

export default ColleagueList;
