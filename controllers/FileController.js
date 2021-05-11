const File = require("../models/File")
const authPermissions = require('../controllers/middleware');


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

const deleteFile = async (req, res) => {
    const id = req.params.url;
    Tag.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete File with id=${id}. Maybe File was not found!`
          });
        } else {
          res.send({
            message: "File was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete File with id=" + id
        });
      });
  };

module.exports = {
    createFile,deleteFile
}
