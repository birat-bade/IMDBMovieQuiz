import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { setUserSession } from './Utils/Common';

import './dashboard.css';

function Login(props) {
  const [loading, setLoading] = useState(false);
  const username = useFormInput('');
  const password = useFormInput('');


  const username_signup = useFormInput('');
  const password_signup = useFormInput('');
  const fullname = useFormInput('');

  const [login_error, setError_login] = useState(null);
  const [signup_error, setError_signup] = useState(null);


  const handleLogin = () => {
    setError_login(null);
    setLoading(true);



    axios.post('http://127.0.0.1:5000/login', { username: username.value, password: password.value }).then(response => {
      setLoading(false);

      setUserSession(response.data.token, response.data.user);

      if (response.data.admin == true) props.history.push('/admin');
      else props.history.push('/dashboard');

    }).catch(error => {
      setLoading(false);
      if (error.response === undefined) {
        setError_login("Something went wrong. Please try again later.");
      }
      else if (error.response.status === 401) {
        setError_login(error.response.data.message);
      }
      else {
        setError_login("Something went wrong. Please try again later.");
      }
    });
  }

  const handleSignUp = () => {
    setError_signup(null);

    axios.post('http://127.0.0.1:5000/create_user', { username: username_signup.value, password: password_signup.value, fullname: fullname.value }).then(response => {
      setLoading(false);

    }).catch(error => {
      setLoading(false);
      if (error.response === undefined) {
        setError_signup("Something went wrong. Please try again later.");
      }
      else if (error.response.status === 401) {
        setError_signup(error.response.data.message);
      }
      else {
        setError_signup("Something went wrong. Please try again later.");
      }
    });
  }

  return (

    <div>
      <section className="overviewSection">
        <div style={{ marginTop: 10 }} >
          <div className="answers">
            <input type="text" {...username} style={{ marginLeft: 10, width: 300, height: 40, }} placeholder="Username" autoComplete="new-password" />
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <input type="password" {...password} style={{ marginLeft: 10, width: 300, height: 40 }} placeholder="Password" autoComplete="new-password" />
        </div>
        {login_error && <><small style={{ color: 'red' }}>{login_error}</small><br /></>}

        <button value={loading ? 'Loading...' : 'Login'} onClick={handleLogin} disabled={loading} >Login</button>

      </section>

      <section className="overviewSection">
        <div style={{ marginTop: 10 }}>
          <input style={{ marginLeft: 10, width: 300, height: 40 }} type="text" {...fullname} placeholder="Fullname" autoComplete="new-password" required />
        </div>
        <div style={{ marginTop: 10 }}>
          <input type="text" {...username_signup} style={{ marginLeft: 10, width: 300, height: 40 }} placeholder="Username" autoComplete="new-password" required />
        </div>
        <div style={{ marginTop: 10 }}>
          <input type="password" {...password_signup} style={{ marginLeft: 10, width: 300, height: 40 }} placeholder="Password" autoComplete="new-password" required />
        </div>
        {signup_error && <><small style={{ color: 'red' }}>{signup_error}</small><br /></>}
        <button value={loading ? 'Loading...' : 'Sign Up'} onClick={handleSignUp} disabled={loading} >Sign Up</button>
      </section>
    </div>
  );
}

const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}

export default Login;