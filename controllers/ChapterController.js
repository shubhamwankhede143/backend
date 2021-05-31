const Chapter = require('../models/Chapter')

const createChapter = async (req,res)=>{
    const chapter = new Chapter({
        chapter :req.body.chapter
    })

    chapter.save()
    .then((data)=>{
            return res.json({
                status:true,
                message:'Chapter saved successfully',
                chapter : data,

            
            })
    })
    .catch((err)=>{
        return res.json({
            status:false,
            message:'Error occured while saving chapter',
            error: err
        })
    })
}

const getChapter =  async (req,res) =>{
    const id = req.params.chapterId;
    Chapter.findById(id)
        .then(data => {
            if (!data)
                res.status(404).json({
                    status: false,
                    message: "Not found Chapter with id " + id
                });
            else res.json({
                status: true,
                message: 'Chapter data retrieved successfully',
                result: data
            });
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Chapter with id=" + id });
        });
}

const updateChapter = (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            message: "Data to update can not be empty!"
        });
    }


    const id = req.params.chapterId;

    Chapter.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).json({
                    status: false,
                    message: `Cannot update Chapter with id=${id}. Maybe Tag was not found!`
                });
            } else res.json({
                status: true,
                message: "Chapter updated successfully."
            });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Chapter with id=" + id
            });
        });
}

const deleteChapter = async (req, res) => {
    const id = req.params.chapterId;
    Chapter.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Chapter with id=${id}. Maybe Chapter was not found!`
          });
        } else {
          res.send({
            message: "Chapter was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Chapter with id=" + id
        });
      });
  };

const getAllChapter = async (req, res) => {
    var { page, size } = req.body
    var { field, order } = req.body.sortBy
    page = page - 1
    Chapter.find(req.body.condition)
        .select("chapter createdAt updatedAt")
        .sort({ field: order })
        .limit(size)
        .skip(size * page)
        .then((results) => {
            Chapter.countDocuments({}, (err, count) => {
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
    createChapter,getChapter,updateChapter,getAllChapter,deleteChapter
}
