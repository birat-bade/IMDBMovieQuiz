# IMDBMovieQuiz
A simple quiz application made by scrapping movie information fom IMDB.

## Stack
* Database `SQLite`
* API `Flask`
* Frontend `ReactJS`

## Setup
Follow these steps to run the project

* Clone the repository 
* Python Dependencies
  * Install required packages `pip install -r requirements.txt`
  * Seed the SQLite dB `python imdb_movie_quiz_api.py seed`
  * Serve the API `python imdb_movie_quiz_api.py runserver`
  * Add movie data into the SQLite dB `python imdb_scrapping.py`
* React Dependencies
  * Install required packages `npm i`
  * Start the project `npm start`

## API Documentaion

s.n | API Endpoint | Method | Request | Response
--- | --- | --- | --- |---
1 | create_user | POST | Name, Username, Password |
