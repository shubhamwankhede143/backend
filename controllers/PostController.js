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



module.exports = {
    createPost
}
