import React from 'react';

import axios from 'axios';

function Home() {

  axios.get('http://127.0.0.1:5000/get_top_score').then(response => {
    console.log(response);
  })


  return (

    <div style={{ fontSize: 30, width: 400 }}>

      <b>Who Directed it ??</b>
      <p> Are you a Movie Buff? Find out your movie cred by taking this quiz. You will be asked who directed the top rated IMDB movies. The quiz contains 10 questions.</p>

      <p>May the Force be with you !!!</p>

    </div>
  );
}

export default Home;
