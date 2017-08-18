import React, {Component} from 'react';
import { Table, Button } from 'react-bootstrap';
import StarRatingComponent from 'react-star-rating-component';
import './../styles/ColleagueList.css'
import { pictureURLConfig } from './../config.json';

class ColleagueList extends Component {

  render() {
    let charactersList = this.props.colleagues.map((colleague, index) => {
      return (
        <tr key={colleague.userId}>
          <td>
            <img width={40} height={40} src={`${pictureURLConfig}&userId=${colleague.userId}`} alt=""/>
          </td>
          <td>{colleague.name}</td>
          <td>{colleague.title}</td>
          <td>{colleague.team}</td>
          <td>
            <div style={{fontSize: 20}}>
              <StarRatingComponent
                name={`rate-${colleague.userId}`}
                starCount={5}
                value={colleague.rating}
                onStarClick={(nextValue, prevValue, name) => this.props.onStarClick(nextValue, index)}
              />
            </div>
          </td>
          <td>
            <Button bsStyle="warning" bsSize="small" onClick={() => this.props.onResetClick(index)}>Reset</Button>
          </td>
        </tr>
      );
    });

    return (
      <div className='container'>
        <Table striped bordered responsive hover>
          <thead>
            <tr>
              <td>Image</td>
              <td>Name</td>
              <td>Title</td>
              <td>Team</td>
              <td>Rate!</td>
              <td>Reset!</td>
            </tr>
          </thead>
          <tbody>
            {charactersList}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default ColleagueList;
