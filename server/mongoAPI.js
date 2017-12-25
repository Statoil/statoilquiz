"use strict";

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const logger = require('./logger');

const url = process.env.DB_URL || 'mongodb://localhost:27018/statoilquiz';
let db;

function connect() {
    return MongoClient.connect(url)
        .then(database => {
            logger.info("Connected to " + url);
            db = database;
        });
}

function saveQuizResponse(quizResponse) {
    db.collection('quizResponse').insertOne(quizResponse, (err, r) => {
        assert.notEqual(db, undefined);
        assert.equal(null, err);
        assert.equal(1, r.insertedCount);
        logger.debug("Document inserted successfully", quizResponse);
    });
}

function getQuizData() {
    return db.collection('quiz').find().toArray()
        .then(quizData => quizData.map(quiz => {
            let startTime = findQuizTimeExtent(quiz.quizItems, Math.min);
            let endTime = findQuizTimeExtent(quiz.quizItems, Math.max);
            return {
                name: quiz.name,
                startTime: startTime,
                endTime: endTime,
                numberOfItems: quiz.quizItems ? quiz.quizItems.length : 0,
                createdBy: quiz.createdBy
            }
        }));

}

function findQuizTimeExtent(quizData, minMax) {
    const initialValue = quizData.length > 0 ? new Date(quizData[0].startTime).getTime() : null;
    const timeValue = quizData
        .map(item => item.startTime)
        .reduce(
            (acc, curr) => minMax(acc, new Date(curr).getTime()),
            initialValue);
    return new Date(timeValue);
}


const mongoAPI = {
    connect: connect,
    saveQuizResponse: saveQuizResponse,
    getQuizData: getQuizData
};

module.exports = mongoAPI;

