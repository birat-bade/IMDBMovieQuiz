import React from 'react';

import axios from 'axios';

import { MDBDataTableV5,MDBDataTable } from 'mdbreact';


class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          label: 'Name',
          field: 'full_name',
          sort: 'asc',
          width: 150
        },
        {
          label: 'Score',
          field: 'score',
          sort: 'asc',
          width: 270
        },
        {
          label: 'Date',
          field: 'date',
          sort: 'asc',
          width: 200
        }
      ],
      rows: []
    }
  }

  componentWillMount() {
    
    axios.get('http://127.0.0.1:5000/get_all_score').then(response => {
      this.setState({ rows: response.data })
      console.log(this.state)

    }).catch(err => {
      console.log('error')
    })

    
    
  }
  

  render() {
    return (
      <div class="float-container" >

        <div style={{ fontSize: 25, width: 400 }} class="float-child">

          <b>Who Directed it ??</b>
          <p> Are you a Movie Buff? Find out your movie cred by taking this quiz. You will be asked who directed the top rated IMDB movies. The quiz contains 10 questions.</p>

          <p>May the odds be ever in your favour. . .</p>



        </div>
        <div class="float-child">
        <b style={{ fontSize: 25}}>Top Scores</b>
        <br/>
        <br/>
          <MDBDataTableV5
            striped
            bordered
            small
            data={this.state}
          />
        </div>

      </div>
    )
  }


}



export default Home;
