const Wallet = require("../models/Wallet")

const createWallet = async (req, res) => {
    let wallet = new Wallet({
       userId : req.body.userId,
       token : req.body.token
    })
    wallet.save()
        .then(wallet => {
            return res.json({
                wallet: wallet,
                status: true,
                message: 'Wallet Added Successfully'
            })
        })
        .catch(error => {
            return res.json({
                status: false,
                message: 'Error occured while adding wallet'
            })
        })
}

const getWallet = (req, res) => {
    const id = req.params.walletId;

    Wallet.findById(id)
        .then(data => {
            if (!data)
                res.status(404).json({
                    status: false,
                    message: "Not found Wallet with id " + id
                });
            else res.json({
                status: true,
                message: 'Wallet data retrieved successfully',
                result: data
            });
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Wallet with id=" + id });
        });
}

const updateWallet = (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            message: "Data to update can not be empty!"
        });
    }


    const id = req.params.walletId;

    Wallet.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).json({
                    status: false,
                    message: `Cannot update Wallet with id=${id}. Maybe Wallet was not found!`
                });
            } else res.json({
                status: true,
                message: "Wallet updated successfully."
            });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Wallet with id=" + id
            });
        });
}

const deleteWallet = async (req, res) => {
    const id = req.params.walletId;
    Wallet.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                return res.status(404).json({
                    status: false,
                    message: 'Wallet data not found'
                })
            } else {
                return res.status(200).json({
                    status: true,
                    message: 'Wallet data deleted successfully'
                })
            }
        }).catch(err => {
            res.status(500).send({
                message: "Could not delete Wallet with id=" + id,
                error: err
            });
        })
};

const getAllWallet = async (req, res, next) => {
    var { page, size } = req.body
    var { field, order } = req.body.sortBy
    page = page - 1
    Wallet.find(req.body.condition)
        .select("userId token createdAt updatedAt")
        .sort({ field: order })
        .limit(size)
        .skip(size * page)
        .then((results) => {
            Wallet.countDocuments({}, (err, count) => {
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
    createWallet, getWallet, updateWallet, deleteWallet, getAllWallet
}