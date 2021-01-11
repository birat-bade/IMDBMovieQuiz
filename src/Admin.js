import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUser, setUserSession, removeUserSession, getToken } from './Utils/Common';

import { MDBDataTableV5, MDBDataTable } from 'mdbreact';
import { verify } from 'crypto';


class Admin extends React.Component {



  constructor(props) {

    super(props);
    this.state = {
      columns: [
        {
          label: 'User Id',
          field: 'id',
          sort: 'desc',
          width: 270
        },
        {
          label: 'Name',
          field: 'name',
          sort: 'desc',
          width: 150
        },
        {
          label: 'Date',
          field: 'date',
          sort: 'desc',
          width: 200
        },
        {
          label: 'Approved',
          field: 'is_approved',
          sort: 'desc',
          width: 200
        },
      ],
      rows: [],
      userID: null,
      error: null
    }


    this.handleLogout = () => {
      removeUserSession();
      props.history.push('/login');
    }

    this.verifyUser = this.verifyUser.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }

  handleChange({ target }) {
    this.setState({
      [target.name]: target.value
    });
  }


  componentWillMount() {
    axios.get('http://127.0.0.1:5000/get_all_users').then(response => {
      this.setState({ rows: response.data })

    }).catch(err => {
      console.log('error')
    })

  }

  verifyUser() {

    var url = 'http://127.0.0.1:5000/verify_user/' + this.state.userID

    console.log(url)

    axios.post(url).then(response => {
      console.log(response.data.message)

      this.setState({ error: response.data.message });

    }).catch(err => {
      this.setState({ error: "Something went wrong. Please try again later." });
    })

  }



  render() {

    if(getToken() !=1){
      this.props.history.push('/dashboard');
    }

    var columns = this.state.columns;
    var rows = this.state.rows;
    var data = { columns, rows };


    return (
      <div >
        <section className="resultsSection">
          <div >

            Welcome {getUser()} ! <a href="#" onClick={this.handleLogout} value="Logout">Logout</a>
          </div>
          <br />
          <br />
          <div style={{ width: 800 }}>
            <MDBDataTableV5
              striped
              bordered
              small
              data={data}
            />
          </div>
          <div style={{ marginTop: 10, textAlign: "right" }}>
            <small style={{ color: 'red' }}>{this.state.error}</small><br/><br/>
            <input name="userID" type="number" pattern="[0-9]*" style={{ marginLeft: 10, width: 300, height: 30, }} placeholder="User Id" value={this.state.userID}
              onChange={this.handleChange} /> <input type="button" value="Verify User" style={{ marginLeft: 5, height: 30, }} onClick={this.verifyUser} />
          </div>
        </section>     
      </div>
    )
  }


}



export default Admin;