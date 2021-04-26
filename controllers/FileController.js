const File = require("../models/File")


const createFile = async (req, res, next) => {
    let file = new File({
        url : req.file.path
    })

    file.save()
        .then(file => {
            return res.json({
                picture: req.file.path,
                status: true,
                message: 'Image Added Successfully'
            })
        })
        .catch(error => {
            return res.json({
                status: false,
                message: 'Error occured while adding image file'
            })
        })
}

module.exports = {
    createFile
}
