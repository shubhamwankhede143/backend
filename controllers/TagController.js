const Tag = require("../models/Tag")


const createTag = async (req, res, next) => {
    let tag = new Tag({
        title : req.body.title,
        slug : req.body.slug,
        status : req.body.status,
        action : req.body.action
    })

    tag.save()
        .then(tag => {
            return res.json({
                tag: tag,
                status: true,
                message: 'Tag Added Successfully'
            })
        })
        .catch(error => {
            return res.json({
                status: false,
                message: 'Error occured while adding tag'
            })
        })
        }


const getAllTag = async (req, res, next) => {
    var { page, size } = req.body
    var { field, order } = req.body.sortBy
    page = page - 1
    Tag.find(req.body.condition)
        .select("title slug status action createdAt updatedAt")
        .sort({ field: order })
        .limit(size)
        .skip(size * page)
        .then((results) => {
            Tag.countDocuments({}, (err, count) => {
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
    createTag,getAllTag
}