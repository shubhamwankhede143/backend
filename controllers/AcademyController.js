const Academy = require("../models/Academy")


const createAcademy = async (req, res, next) => {
    let academy = new Academy({
        userId: req.body.userId,
        academyChapterId: req.body.academyChapterId,
        categoryId: req.body.categoryId,
        tagId: req.body.tagId,
        picture: req.body.picture,
        title: req.body.title,
        slug: req.body.slug,
        sortDescription: req.body.sortDescription,
        status: req.body.status,
        verifiedBy: req.body.verifiedBy
    })

    academy.save()
        .then(academy => {
            return res.json({
                academy: academy,
                status: true,
                message: 'Academy Added Successfully'
            })
        })
        .catch(error => {
            return res.json({
                status: false,
                message: 'Error occured while adding academy'
            })
        })
}

const getAcademy = (req, res) => {
    const id = req.params.academyId;

    Academy.findById(id)
        .then(data => {
            if (!data)
                res.status(404).json({
                    status: false,
                    message: "Not found Academy with id " + id
                });
            else res.json({
                status: true,
                message: 'Academy data retrieved successfully',
                result: data
            });
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Academy with id=" + id });
        });
}

const updateAcademy = (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            message: "Data to update can not be empty!"
        });
    }


    const id = req.params.academyId;

    Academy.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).json({
                    status: false,
                    message: `Cannot update Academy with id=${id}. Maybe Tag was not found!`
                });
            } else res.json({
                status: true,
                message: "Academy updated successfully."
            });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Academy with id=" + id
            });
        });
}


const deleteAcademy = async (req, res) => {
    const id = req.params.academyId;
    Academy.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                return res.status(404).json({
                    status: false,
                    message: 'Academy data not found'
                })
            } else {
                return res.status(200).json({
                    status: true,
                    message: 'Academy data deleted successfully'
                })
            }
        }).catch(err => {
            res.status(500).send({
                message: "Could not delete Academy with id=" + id,
                error: err
            });
        })
};

const getAllAcademy = async (req, res, next) => {
    var { page, size } = req.body
    var { field, order } = req.body.sortBy
    page = page - 1
    Academy.find(req.body.condition)
        .select("userId academyChapterId categoryId tagId picture title slug sortDescription status verifiedBy createdAt updatedAt")
        .sort({ field: order })
        .limit(size)
        .skip(size * page)
        .then((results) => {
            Academy.countDocuments({}, (err, count) => {
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

function strMapToObj(strMap) {
    let obj = Object.create(null);
    for (let [k, v] of strMap) {
        // We don’t escape the key '__proto__'
        // which can cause problems on older engines
        obj[k] = v;
    }
    return obj;
}

function strMapToJson(strMap) {
    return JSON.stringify(strMapToObj(strMap));
}

module.exports = {
    createAcademy, getAcademy, updateAcademy, deleteAcademy,getAllAcademy
}