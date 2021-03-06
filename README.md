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
  * Seed the admin credentials(`username: admin, password: password`) into the SQLite dB `python imdb_movie_quiz_api.py seed`
  * Serve the API `python imdb_movie_quiz_api.py runserver`
  * Add movie data into the SQLite dB `python imdb_scrapping.py`
* React Dependencies
  * Install required packages `npm i`
  * Start the project `npm start`

## API Documentaion

S.N. | API Endpoint | Method | In 
--- | --- | --- | --- 
1 | `create_user` | `POST` | `fullname`, `username`, `password` 
2 | `verify_user` | `POST` | `user_id`
3 | `get_all_users` | `GET` |  
4 | `login` | `POST` | `username`, `password` 
5 | `add_movie` | `POST` | `movie_name`, `movie_director` 
6 | `get_movies` | `GET` | `movie_id` 
7 | `save_score` | `POST` | `user_id`, `score`
8 | `get_all_score` | `GET` | 
9 | `get_score` | `GET` | `user_id` | 

## UserGuide

* To use the app you must sign up first.
* Once you've signed up, a admin must verify your account before you can log into the system. 
* To verify the user log in using the admins credentials(`username: admin, password: password`).
* Admin Credentials are seeded into the database during app initialization.
* If the `Approved` flag is `False` the user cannot access the system.
* Use the admin pannel to verify the desired user by entering their `User Id` into the text field and clicking on `Verify User`.
* The `Approved` flag will be set to `True`. (Referesh the page to see the changes)
