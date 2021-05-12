const express = require('express');
const router = express.Router();
const authPermissions = require('../controllers/middleware');
const QuizController = require('../controllers/QuizController')


router.post('/quiz',QuizController.createQuiz)
router.post('/quizs',QuizController.getAllQuiz)
router.put('/quiz/:quizId',QuizController.updateQuiz)
router.get('/quiz/:quizId',QuizController.getQuiz)
router.delete('/quiz/:quizId',QuizController.deleteQuiz)
module.exports = router