import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUser, setUserSession, removeUserSession } from './Utils/Common';

import { MDBDataTableV5, MDBDataTable } from 'mdbreact';


class Admin extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      columns: [
        {
          label: 'Id',
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
          label: 'Approved',
          field: 'is_approved',
          sort: 'desc',
          width: 200
        },
        {
          label: 'Approve User',
          field: 'approve_user',
          sort: 'desc',
          width: 200
        }
      ],
      rows: []
    }
    this.handleLogout = () => {
      removeUserSession();
      props.history.push('/login');
    }
  }

  componentWillMount() {
    console.log("here")
    axios.get('http://127.0.0.1:5000/get_all_users').then(response => {
      this.setState({ rows: response.data })
      console.log(this.state)



    }).catch(err => {
      console.log('error')
    })

    console.log("here")

  }


  render() {
    return (
      <div >
        <section className="resultsSection">
        <div >

          Welcome {getUser()} ! <a href="#" onClick={this.handleLogout} value="Logout">Logout</a>
        </div>
        <br />
        <br />
        <div style={{ width: 800, textAlign: "center" }}>
          <MDBDataTableV5
            striped
            bordered
            small
            data={this.state}
            sorting={true}

          />
        </div>
        </section>
      </div>
    )
  }


}



export default Admin;