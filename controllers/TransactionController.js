const Transaction = require("../models/Transaction")


const createTransaction = async (req, res, next) => {
    let transaction = new Transaction({
       userid: req.body.userid,
       receivingAddress: req.body.receivingAddress,
       token: req.body.token,
       status: req.body.status,
       orderDateTime: req.body.orderDateTime,
       reason: req.body.reason,
    })

    transaction.save()
        .then(tag => {
            return res.json({
                tag: tag,
                status: true,
                message: 'Transaction Added Successfully'
            })
        })
        .catch(error => {
            return res.json({
                status: false,
                message: 'Error occured while adding transaction'
            })
        })
}

const getTransaction = (req, res) => {
    const id = req.params.transactionId;

    Transaction.findById(id)
        .then(data => {
            if (!data)
                res.status(404).json({
                    status: false,
                    message: "Not found Transaction with id " + id
                });
            else res.json({
                status: true,
                message: 'Transaction data retrieved successfully',
                result: data
            });
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Transaction with id=" + id });
        });
}

const updateTransaction = (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            message: "Data to update can not be empty!"
        });
    }


    const id = req.params.transactionId;

    Transaction.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).json({
                    status: false,
                    message: `Cannot update Transaction with id=${id}. Maybe Transaction was not found!`
                });
            } else res.json({
                status: true,
                message: "Transaction updated successfully."
            });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Transaction with id=" + id
            });
        });
}

const deleteTransaction = async (req, res) => {
    const id = req.params.transactionId;
    Transaction.findByIdAndRemove(id)
    .then(data =>{
        if(!data){
            return res.status(404).json({
                status:false,
                message:'Transaction data not found'
            })
        }else {
            return res.status(200).json({
                status:true,
                message:'Transaction data deleted successfully'
            })
        }
    }).catch(err => {
        res.status(500).send({
            message: "Could not delete Transaction with id=" + id,
            error : err
        }); 
    })
  };

  const getAllTransaction = async (req, res, next) => {
    var { page, size } = req.body
    var { field, order } = req.body.sortBy
    page = page - 1
    Transaction.find(req.body.condition)
        .select("userId receivingAddress token status orderDateTime reason createdAt updatedAt")
        .sort({ field: order })
        .limit(size)
        .skip(size * page)
        .then((results) => {
            Transaction.countDocuments({}, (err, count) => {
                return res.json({
                    page: page + 1,
                    size: size,
                    totalElements: count,
                    results: results
                })
            })
        })
        .catch((err) => {
            return res.status(500).json({
                status:false,
                message:'error while fetching all transaction'
            });
        });
}

module.exports = {
    createTransaction, getAllTransaction,getTransaction,updateTransaction,deleteTransaction
}