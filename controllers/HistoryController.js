const History = require("../models/History")


const createHistory = async (req, res, next) => {
    let history = new History({
       userId : req.body.userId,
       postId : req.body.postId,
       score: req.body.score,
       token: req.body.token,
       status: req.body.status
    })

    history.save()
        .then(history => {
            return res.json({
                history: history,
                status: true,
                message: 'History Added Successfully'
            })
        })
        .catch(error => {
            return res.json({
                status: false,
                message: 'Error occured while adding History'
            })
        })
}

const getHistory = (req, res) => {
    const id = req.params.historyId;
    History.findById(id)
        .then(data => {
            if (!data)
                res.status(404).json({
                    status: false,
                    message: "Not found History with id " + id
                });
            else res.json({
                status: true,
                message: 'History data retrieved successfully',
                result: data
            });
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving History with id=" + id });
        });
}

const updateHistory = (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            message: "Data to update can not be empty!"
        });
    }
    const id = req.params.historyId;

    History.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).json({
                    status: false,
                    message: `Cannot update History with id=${id}. Maybe Tag was not found!`
                });
            } else res.json({
                status: true,
                message: "History updated successfully."
            });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating History with id=" + id
            });
        });
}

const deleteHistory = async (req, res) => {
    const id = req.params.HistoryId;
    History.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete History with id=${id}. Maybe History was not found!`
          });
        } else {
          res.send({
            message: "History was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete History with id=" + id
        });
      });
  };

const getAllHistory = async (req, res, next) => {
    var { page, size } = req.body
    var { field, order } = req.body.sortBy
    page = page - 1
    History.find(req.body.condition)
        .select("userid postId score token status createdAt updatedAt")
        .sort({ field: order })
        .limit(size)
        .skip(size * page)
        .then((results) => {
            History.countDocuments({}, (err, count) => {
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
    createHistory, getAllHistory,getHistory,updateHistory,deleteHistory
}