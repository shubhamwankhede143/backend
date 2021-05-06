const authPermissions = (permissions) => {
    return (req,res,next) => {
        const userRole = req.body.role
        if(permissions.includes(userRole)){
            next()
        }else{
            return res.status(401).json({
                status:false,
                message:"You do not have permission to access this"
            })
        }
    }
}

module.exports = { authPermissions};