const Post = require("../models/Post")
const authPermissions = require('../controllers/middleware');

const createPost = (req,res)=>{
    let post = new Post({
        user : req.body.userId,
    })

    post.save(post).
    then((post)=>{
        return res.json({
            status:false,
            message:'Post saved successfully'
        })
    }).
    catch(e=>{
        return res.json({
            status:false,
            message:'Error while saving post'
        })
    })
}


// const createPost = async (req, res, next) => {
//     let post = new Post({
//         userId: req.body.userId,
//         tagIds: req.body.tagIds,
//         picture: req.body.picture,
//         title: req.body.title,
//         slug: req.body.slug,
//         content: req.body.content,
//         sortDescription: req.body.sortDescription,
//         status: req.body.status,
//         verifiedBy: req.body.verifiedBy,
//     })

//     post.save()
//         .then(post => {
//             return res.json({
//                 post: post,
//                 status: true,
//                 message: 'Post Added Successfully'
//             })
//         })
//         .catch(error => {
//             return res.json({
//                 status: false,
//                 message: 'Error occured while adding post'
//             })
//         })

// }

const getPost = (req, res) => {
    const id = req.params.postId;

    Post.findById(id)
        .then(data => {
            if (!data)
                res.status(404).json({
                    status: false,
                    message: "Not found Post with id " + id
                });
            else res.json({
                status: true,
                message: 'Post data retrieved successfully',
                result: data
            });
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Post with id=" + id });
        });
}

const updatePost = (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            message: "Data to update can not be empty!"
        });
    }
    const id = req.params.postId;
    Post.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).json({
                    status: false,
                    message: `Cannot update Post with id=${id}. Maybe Post was not found!`
                });
            } else res.json({
                status: true,
                message: "Post updated successfully."
            });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Post with id=" + id
            });
        });
}

const getAllPost = async (req, res, next) => {
    var { page, size } = req.body
    var { field, order } = req.body.sortBy
    page = page - 1
    Post.find(req.body.condition)
        .select("postId userId tagIds picture title slug content sortDescription status createdAt verifiedBy")
        .sort({ field: order })
        .limit(size)
        .skip(size * page)
        .then((results) => {
            Post.countDocuments({}, (err, count) => {
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

const getAllPostByTagIds = async (req, res, next) => {
    var { page, size } = req.body
    var { field, order } = req.body.sortBy
    page = page - 1
    var count;
    Post.find({ "tagIds": { $in: req.body.tagIds } })
        .select("postId userId tagIds picture title slug content sortDescription status createdAt verifiedBy")
        .sort({ field: order })
        .limit(size)
        .skip(size * page)
        .then((results) => {
            Post.countDocuments({ "tagIds": { $in: req.body.tagIds } }, (err, count) => {
                return res.json({
                    page: page + 1,
                    size: size,
                    totalElements: count,
                    results: results
                })
            })
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).send(err);
        });
}

const getPostCount = async (req, res) => {
    var totalPostCount;
    var totalPublishedPost;
    var totalUnPublishedPost;
    await Post.countDocuments({}, (err, count) => {
        totalPostCount = count
    })
    await Post.countDocuments({ "status": "published" }, (err, count) => {
        totalPublishedPost = count
    })
    await Post.countDocuments({ "status": "unpublished" }, (err, count) => {
        totalUnPublishedPost = count
    })

    return res.json({
        status: true,
        message: 'posts count fetched successfully',
        totalPost: totalPostCount,
        totalPublishedPost: totalPublishedPost,
        totalUnPublishedPost: totalUnPublishedPost
    })
}

const deletePost = async (req, res) => {
    const id = req.params.postId;
    Post.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Post with id=${id}. Maybe Post was not found!`
                });
            } else {
                res.send({
                    message: "Post was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Post with id=" + id
            });
        });
};

// const getAllPost = async (req, res, next) => {

//     Post.find()
//     .select("_id userId tagId picture")
//     .exec()
//     .then(posts =>{
//          const response = {
//             count: posts.length,
//             posts : posts.map(post =>{
//                 return {
//                     postId : post._id,
//                     userId : post.userId,
//                     picture :'http://localhost:3001/'+ post.picture,
//                     request: {
//                         type : "GET",
//                         url : "http://localhost:3001/posts/" + post._id
//                     }
//                 }
//             })
//         }
//          res.json({
//             status : true,
//             result : response,
//             message : 'All post retrieved successfully'
//         })
//     })
// }


module.exports = {
    createPost, getAllPost, updatePost, getPost, getAllPostByTagIds, getPostCount, deletePost
}
//getPostCount