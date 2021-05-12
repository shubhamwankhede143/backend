const Quiz = require("../models/Quiz")

const createQuiz = async (req, res) => {
    let quiz = new Quiz({
        postId: req.body.postId,
        question: req.body.question,
        optionType: req.body.optionType,
        options: req.body.options,
        answer: req.body.answer,
        timing: req.body.timing
    })
    quiz.save()
        .then(quiz => {
            return res.json({
                quiz: quiz,
                status: true,
                message: 'Quiz Added Successfully'
            })
        })
        .catch(error => {
            return res.json({
                status: false,
                message: 'Error occured while adding quiz'
            })
        })
}

const getQuiz = (req, res) => {
    const id = req.params.quizId;

    Quiz.findById(id)
        .then(data => {
            if (!data)
                res.status(404).json({
                    status: false,
                    message: "Not found Quiz with id " + id
                });
            else res.json({
                status: true,
                message: 'Quiz data retrieved successfully',
                result: data
            });
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Quiz with id=" + id });
        });
}

const updateQuiz = (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            message: "Data to update can not be empty!"
        });
    }


    const id = req.params.quizId;

    Quiz.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).json({
                    status: false,
                    message: `Cannot update Quiz with id=${id}. Maybe Quiz was not found!`
                });
            } else res.json({
                status: true,
                message: "Quiz updated successfully."
            });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Quiz with id=" + id
            });
        });
}

const deleteQuiz = async (req, res) => {
    const id = req.params.quizId;
    Quiz.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                return res.status(404).json({
                    status: false,
                    message: 'Quiz data not found'
                })
            } else {
                return res.status(200).json({
                    status: true,
                    message: 'Quiz data deleted successfully'
                })
            }
        }).catch(err => {
            res.status(500).send({
                message: "Could not delete Quiz with id=" + id,
                error: err
            });
        })
};

const getAllQuiz = async (req, res, next) => {
    var { page, size } = req.body
    var { field, order } = req.body.sortBy
    page = page - 1
    Quiz.find(req.body.condition)
        .select("postId question optionType options answer timing createdAt updatedAt")
        .sort({ field: order })
        .limit(size)
        .skip(size * page)
        .then((results) => {
            Quiz.countDocuments({}, (err, count) => {
                return res.json({
                    page: page + 1,
                    size: size,
                    totalElements: count,
                    results: results
                })
            })
        })
        .catch((err) => {
            return res.status(500).send(err);
        });
}


module.exports = {
    createQuiz, getQuiz, updateQuiz, deleteQuiz, getAllQuiz
}