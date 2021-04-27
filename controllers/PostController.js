const Post = require("../models/Post")



const createPost = async (req, res, next) => {
    console.log(req.file)

    let post = new Post({
        userId: req.body.userId,
        tagId: req.body.tagId,
        picture: req.file.path,
        title: req.body.title,
        slug: req.body.slug,
        content: req.body.content,
        commentStatus: req.body.commentStatus,
        isFeature: req.body.isFeature,
        status: req.body.status,
        verifiedBy: req.body.verifiedBy,
    })

    post.save()
        .then(post => {
            return res.json({
                post: post,
                picture: req.file.path,
                status: true,
                message: 'Post Added Successfully'
            })
        })
        .catch(error => {
            return res.json({
                status: false,
                message: 'Error occured while adding post'
            })
        })

}

const getAllPost = async (req, res, next) => {
    var { page , size } = req.body
    var { field , order } = req.body.sortBy
    page = page - 1
    Post.find(req.body.condition)
        .select("postId userId banner picture picture request")
        .sort({ field: order })
        .limit(size)
        .skip(size * page)
        .then((results) => {
            return res.json({
                page:page+1,
                size:size,
                results:results
            })
        })
        .catch((err) => {
            return res.status(500).send(err);
        });
}


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
    createPost,getAllPost
}
