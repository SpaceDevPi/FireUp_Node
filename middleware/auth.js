module.exports.isUserAuthenticated = (req, res, next) => {
    if (req.user) {
        next();
    }else{
        res.status(404).send("User not authenticated");
    }
}