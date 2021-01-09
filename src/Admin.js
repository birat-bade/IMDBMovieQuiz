import React, { useState,useEffect} from 'react';
import axios from 'axios';
import { getUser, setUserSession,removeUserSession } from './Utils/Common';

function Admin(props) {
    


    const handleLogout = () => {
        removeUserSession();
        props.history.push('/login');
      }

    axios.get('http://127.0.0.1:5000/get_all_users').then(response => {
    console.log(response);
    })

  return (

    <div>

      Welcome {getUser()} ! <a href="#" onClick={handleLogout} value="Logout">Logout</a>
    </div>);
}


export default Admin;