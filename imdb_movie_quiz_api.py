import random

import json

from sqlalchemy import desc
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError

from flask_cors import CORS

from flask_script import Manager, Server

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///movie_quiz'

db = SQLAlchemy(app)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

manager = Manager(app)

host = '127.0.0.1'
port = 5000

manager.add_command("runserver", Server(host, port))


class Movies(db.Model):
    __tablename__ = 'movies'
    id = db.Column('id', db.Integer, primary_key=True)
    movie_name = db.Column('movie_name', db.String(100))
    movie_director = db.Column('movie_director', db.String(100))
    created_at = db.Column(db.DateTime, server_default=db.func.now())


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column('id', db.Integer, primary_key=True)
    full_name = db.Column('full_name', db.String(80), nullable=False)
    user_name = db.Column('user_name', db.String(80), unique=True, nullable=False)
    password = db.Column('password', db.String(120), nullable=False)
    is_approved = db.Column('is_approved', db.Boolean, nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())

    user_score = db.relationship('Score', backref='user', uselist=False)


class Score(db.Model):
    __tablename__ = 'scores'

    id = db.Column('id', db.Integer, primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('users.id'))
    score = db.Column('score', db.Integer, nullable=False)
    created_on = db.Column(db.DateTime, server_default=db.func.now())


@app.route('/')
def show_all():
    return 'Welcome'


@app.route('/create_user', methods=['POST'])
def create_user():
    json_data = json.loads(request.data)

    full_name = json_data['fullname']
    user_name = json_data['username']
    password = json_data['password']

    if full_name == '' or user_name == '' or password == '':
        return jsonify({'message': 'Invalid Signup'}), 401

    is_approved = False

    try:
        user = User(full_name=full_name, user_name=user_name, password=password, is_approved=is_approved)

        db.session.add(user)
        db.session.commit()

    except IntegrityError:

        return jsonify({'message': 'Duplicate Username'}), 401

    return jsonify({'message': 'User Created'}), 401


@app.route('/get_all_users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    json_data = list()

    for user in users:
        if user.full_name != 'admin':
            json_data.append({'id': user.id, 'name': user.full_name, 'is_approved': user.is_approved})

    return jsonify(json_data)


@app.route('/approve_user/<user_id>', methods=['POST'])
def approve_user(user_id):
    user = User.query.filter_by(id=user_id).first()

    if user is None:
        return {'message': 'No User'}

    user.is_approved = 1
    db.session.commit()

    return {'message': 'User Approved'}


@app.route('/login', methods=['POST'])
def login():
    json_data = json.loads(request.data)

    username = json_data['username']
    password = json_data['password']

    user = User.query.filter_by(user_name=username).first()

    if user is None:
        return {'message': 'Login Error'}, 401

    elif user.is_approved == 0:
        return {'message': 'User Not Approved'}, 401

    elif user.user_name == username and user.password == password:

        if user.id == 1:
            return {'token': user.id, 'user': user.user_name, 'admin': True}, 200

        return {'token': user.id, 'user': user.user_name, 'admin': False}, 200

    else:
        return {'message': 'Login Error'}, 401


@app.route('/save_score', methods=['POST'])
def save_score():
    json_data = json.loads(request.data)

    user_id = json_data['user_id']
    quiz_score = json_data['score']

    score = Score(user_id=user_id, score=quiz_score)
    db.session.add(score)
    db.session.commit()

    scores = Score.query.order_by(desc(Score.score)).filter_by(user_id=user_id).all()

    json_data = list()

    for score in scores:
        json_data.append({'name': score.user.full_name, 'score': score.score})

    return jsonify(json_data)


@app.route('/get_score/<user_id>', methods=['GET'])
def get_score(user_id):
    score = Score.query.filter_by(user_id=user_id).order_by(desc(Score.score)).first()

    if score is None:
        return {'message': 'No User'}

    return {'Score': score.score}


@app.route('/get_top_score', methods=['GET'])
def get_top_score():
    scores = Score.query.order_by(desc(Score.score)).all()
    json_data = [{score.user.full_name: score.score} for score in scores]

    return jsonify(json_data)


@app.route('/get_movies', methods=['GET'])
def get_movies():
    movies = Movies.query.order_by(func.random()).all()[:50]

    json_data = list()

    option_list = [movie.movie_director for movie in movies]

    i = 1

    for movie in movies:
        option_list.remove(movie.movie_director)
        random.shuffle(option_list)

        option = option_list[:2]
        option.append(movie.movie_director)
        random.shuffle(option)

        json_data.append(
            {'type': 'who_is', 'level': i, 'question': 'Who directed <em><b>{}</b></em> ?'.format(movie.movie_name),
             'answers': option,
             'correct': option.index(movie.movie_director) + 1, 'explanation': ''})

        i += 1

        option_list.append(movie.movie_director)

    return jsonify(json_data[:10])


@app.route('/get_movie/<movie_id>', methods=['GET'])
def get_movie(movie_id):
    movie = Movies.query.filter_by(id=movie_id).first()

    if movie is None:
        return {'message': 'No Movie'}

    return {'Movie': movie.movie_name}


@app.route('/add_movie', methods=['POST'])
def add_movie():
    movie_name = request.form['movie_name']
    movie_director = request.form['movie_director']

    movie = Movies.query.filter_by(movie_name=movie_name).first()

    if movie is None:
        movie = Movies(movie_name=movie_name, movie_director=movie_director)

        db.session.add(movie)
        db.session.commit()

        return jsonify({movie_name: movie_director})

    return jsonify({'message': 'Already Saved'})


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response


@manager.command
def seed():
    try:
        user = User(full_name='admin', user_name='admin', password='password', is_approved=True)
        db.session.add(user)
        db.session.commit()
    except IntegrityError:
        print('Database already seeded')


if __name__ == '__main__':
    db.create_all()

    app.run(debug=True, host=host, port=port)

    # manager.run()
