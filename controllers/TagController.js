const Tag = require("../models/Tag")


const createTag = async (req, res, next) => {
    let tag = new Tag({
        title: req.body.title,
        slug: req.body.slug,
        status: req.body.status,
        action: req.body.action
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

const getTag = (req, res) => {
    const id = req.params.tagId;

    Tag.findById(id)
        .then(data => {
            if (!data)
                res.status(404).json({
                    status: false,
                    message: "Not found Tag with id " + id
                });
            else res.json({
                status: true,
                message: 'Tag data retrieved successfully',
                result: data
            });
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Tag with id=" + id });
        });
}

const updateTag = (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            message: "Data to update can not be empty!"
        });
    }


    const id = req.params.tagId;

    Tag.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).json({
                    status: false,
                    message: `Cannot update Tag with id=${id}. Maybe Tag was not found!`
                });
            } else res.json({
                status: true,
                message: "Tag updated successfully."
            });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Tag with id=" + id
            });
        });
}


const getAllTag = async (req, res, next) => {
    // var { page, size } = req.body
    // var { field, order } = req.body.sortBy
    // page = page - 1
    Tag.find({})
        .select("title slug status action createdAt updatedAt")
        // .sort({ field: order })
        // .limit(size)
        // .skip(size * page)
        .then((results) => {
            Tag.countDocuments({}, (err, count) => {
                const resultData = results.map(function(item){
                    var map1 = new Map();
                    // adding some elements to the map 
                    map1.set(item._id , item.title);
                    return strMapToObj(map1);
                })
            
                console.log(resultData)
                return res.json({
                    status:true,
                    message:'Data fetched successfully',
                    totalElements: count,
                    results: resultData
                })
            })
        })
        .catch((err) => {
            return res.status(500).send(err);
        });
}

const deleteTag = async (req, res) => {
    const id = req.params.tagId;
    Tag.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Tag with id=${id}. Maybe Tag was not found!`
          });
        } else {
          res.send({
            message: "Tag was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Tag with id=" + id
        });
      });
  };

function strMapToObj(strMap) {
    let obj = Object.create(null);
    for (let [k,v] of strMap) {
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
    createTag, getAllTag,getTag,updateTag,deleteTag
}