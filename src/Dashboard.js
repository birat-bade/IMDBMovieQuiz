
import { getToken,getUser, removeUserSession } from './Utils/Common';

import React, { Component } from 'react';

import './dashboard.css';


import axios from 'axios';




class Dashboard extends React.Component {




    constructor(props) {
        super(props);

        

        
        this.state = {
            quiz: this.getData(),
            activeView: null,
            currentQuestionIndex: 0,
            answers: []
        };

        this.submitAnswer = this.submitAnswer.bind(this);
    }

    handleLogout = () => {
        removeUserSession();
        this.props.history.push('/login');
      }
    

    render() {
        return (
            <div className="App">
                {this.state.activeView === 'quizOverview' &&
                    <QuizDescription
                        quiz={this.state.quiz}
                        showQuizQuestion={this.showQuizQuestion.bind(this, 0)}
                    />
                }
                {this.state.activeView === 'quizQuestions' &&
                    <Quizinator
                        submitAnswer={this.submitAnswer}
                        quiz={this.state.quiz}
                        currentQuestionIndex={this.state.currentQuestionIndex}
                        buttonsDisabled={this.state.buttonsDisabled}
                        transitionDelay={this.state.transitionDelay}
                    />
                }
                {this.state.activeView === 'quizResults' &&
                    <QuizResults
                        results={this.getResults()}
                        thumbnail={this.state.quiz.thumbnail}
                    />
                }
            <br/>
             Welcome {getUser()} ! <a href="#" onClick={this.handleLogout} value="Logout" >Logout</a>
            </div>
        );
    };

    componentDidMount() {
        this.showQuizDescription();
    };

    getData() {

        var quiz = require('./quiz.json');

        axios.get('http://127.0.0.1:5000/get_movies').then(response => {
            quiz.questions = response.data;
            })


        return quiz;
    };

    showQuizDescription() {
        this.setState((prevState, props) => {
            return {
                activeView: 'quizOverview'
            };
        });
    }

    showQuizQuestion(index) {
        console.log(index);
        this.setState((prevState) => {
            return {
                currentQuestionIndex: index,
                activeView: 'quizQuestions',
                buttonsDisabled: false,
                transitionDelay: 1000
            };
        });
    };

    showResults() {
        this.setState((prevState) => {
            return {
                activeView: 'quizResults'
            };
        });
    }

    submitAnswer(answer) {
        var app = this;

        // save answer and disable button clicks
        this.setState((prevState) => {
            return {
                buttonsDisabled: true,
                answers: Object.assign({ [this.state.currentQuestionIndex]: answer }, prevState.answers)
            };
        });

        // pause for question result to show before callback
        window.setTimeout(function () {

            // determine if there are any other questions to show or show results
            let nextIndex = app.state.currentQuestionIndex + 1,
                hasMoreQuestions = (nextIndex < app.state.quiz.numOfQuestions);

            (hasMoreQuestions) ? app.showQuizQuestion(nextIndex) : app.showResults();

        }, this.state.transitionDelay);
    };

    getResults() {
        return this.state.quiz.questions.map((item, index) => {
            return Object.assign({}, item, this.state.answers[index]);
        });
    };

}

class QuizDescription extends React.Component {
    render() {
        let quiz = this.props.quiz;
        let image = quiz.image;
        let htmlDescription = function () { return { __html: quiz.introduction }; };

        return (
            <section className="overviewSection">
                <button onClick={this.props.showQuizQuestion}>Start Quiz</button>
            </section>
        );
    };
}

class Quizinator extends React.Component {
    render() {
        let quiz = this.props.quiz,
            question = this.props.quiz.questions[this.props.currentQuestionIndex],
            htmlQuestion = function () {
                return { __html: question.question };
            },
            answerButtons = question.answers.map((answer, i) =>
                <p key={i}><button className={answer.answer} onClick={this.handleClick.bind(this, i)} disabled={this.props.buttonsDisabled}>{answer}</button></p>
        );

        return (
            <section className={'quizSection' + (this.props.buttonsDisabled ? ' transitionOut' : '')}>
                <div className="questionNumber">Question {this.props.currentQuestionIndex + 1} / {quiz.questions.length}</div>
                <hr />
                <div className="question">
                    <div dangerouslySetInnerHTML={htmlQuestion()} />
                </div>
                <div className="answers">
                    {answerButtons}
                </div>
            </section>
        );
    }

    handleClick(index, event) {
        let question = this.props.quiz.questions[this.props.currentQuestionIndex],
            answer = { value: index + 1, isCorrect: (index + 1 === question.correct) },
            target = event.currentTarget;

        this.props.submitAnswer(answer);

        target.classList.add('clicked', answer.isCorrect ? 'correct' : 'incorrect');

        window.setTimeout(function () {
            target.classList.remove('clicked', 'correct', 'incorrect');
        }, this.props.transitionDelay);
    }
}

class QuizResults extends React.Component {
    render() {
        
        let numCorrect = 0;

        this.props.results.forEach((answer) => {
            if (!!answer.isCorrect) {
                numCorrect += 1;
                
            }
        });



        var token = getToken();
        

        axios.post('http://127.0.0.1:5000/save_score', { user_id: token, score: numCorrect}).then(response => {
            console.log(response);

        })


        return (
            <section className="resultsSection">
                <h2>Results</h2>
                <div className="scoring">
                    You answered <b>{numCorrect}</b> questions correctly.
                </div>
                {/* <ol>{results}</ol> */}
            </section>
        );
    }
}

export default Dashboard;
