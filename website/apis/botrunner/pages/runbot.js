const botrunner = require("../module.js")
module.exports.pageType = "put"
module.exports.documentation = {
    "documented": false
}
module.exports.onPage = async (req, res, origin, isAnS4DUrl, bypassedS4DOriginCheck, originIncorrectFunction) => {
    /*
    if (!isAnS4DUrl) {
        if (bypassedS4DOriginCheck) {
            originIncorrectFunction("Origin bypass does not work on this endpoint.")
            return
        }
        originIncorrectFunction()
        return
    }
    */
    if (!(await botrunner.verifyToken(req.header("botToken")))) {
        res.status(400)
        res.json({
            "error": "This bot token is not a Discord Bot!",
            "serverError": false
        })
        return
    }
    res.status(200)
    res.json({ "error": null })
}