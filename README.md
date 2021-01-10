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

S.N. | API Endpoint | Method | In 
--- | --- | --- | --- |---
1 | `create_user` | `POST` | `fullname`, `username`, `password` 
2 | `get_all_users` | `GET` |  
3 | `verify_user` | `POST` | `user_id` 
4 | `login` | `POST` | `username`, `password` 
5 | `save_score` | `POST` | `user_id`, `score`
6 | `get_score` | `GET` | `user_id` | 
7 | `get_all_score` | `GER` | 
8 | `get_movies` | `GET` | `movie_id` 
9 | `add_movie` | `POST` | `movie_name`, `movie_director` 

