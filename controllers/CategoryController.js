const Category = require("../models/Category")


const createCategory = async (req, res, next) => {
    let category = new Category({
        userId: req.body.userId,
        title: req.body.title,
        slug: req.body.slug,
       
    })

    category.save()
        .then(tag => {
            return res.json({
                tag: tag,
                status: true,
                message: 'Category Added Successfully'
            })
        })
        .catch(error => {
            return res.json({
                status: false,
                message: 'Error occured while adding category'
            })
        })
}

const getCategory = (req, res) => {
    const id = req.params.categoryId;

    Category.findById(id)
        .then(data => {
            if (!data)
                res.status(404).json({
                    status: false,
                    message: "Not found Category with id " + id
                });
            else res.json({
                status: true,
                message: 'Category data retrieved successfully',
                result: data
            });
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Category with id=" + id });
        });
}

const updateCategory = (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            message: "Data to update can not be empty!"
        });
    }


    const id = req.params.categoryId;

    Category.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).json({
                    status: false,
                    message: `Cannot update Category with id=${id}. Maybe Tag was not found!`
                });
            } else res.json({
                status: true,
                message: "Category updated successfully."
            });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Category with id=" + id
            });
        });
}

const deleteCategory = async (req, res) => {
    const id = req.params.categoryId;
    Category.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Category with id=${id}. Maybe Category was not found!`
          });
        } else {
          res.send({
            message: "Category was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Category with id=" + id
        });
      });
  };

const getAllCategory = async (req, res, next) => {
    var { page, size } = req.body
    var { field, order } = req.body.sortBy
    page = page - 1
    Category.find(req.body.condition)
        .select("userId title slug createdAt updatedAt")
        .sort({ field: order })
        .limit(size)
        .skip(size * page)
        .then((results) => {
            Category.countDocuments({}, (err, count) => {
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
    createCategory, getAllCategory,getCategory,updateCategory,deleteCategory
}