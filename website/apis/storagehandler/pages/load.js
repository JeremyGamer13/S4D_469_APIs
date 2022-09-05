const storageHandler = require("../module.js")
const accounts = require("../../accounts/module.js")
module.exports.pageType = "get"
module.exports.documentation = {
    "documented": true,
    "explanation": `Returns the latest project savedata for this User.
Specify a username in the <code>username</code> header (or an email in the <code>email</code> header) and a password in the <code>password</code> header.`
}
module.exports.onPage = async (req, res, origin, isAnS4DUrl, bypassedS4DOriginCheck, originIncorrectFunction) => {
    if (!accounts.httpPasswordHelper(req, res)) return
    const username = req.header("email") == null ? req.header("username") : req.header("email")
    const id = accounts.isAnEmail(username) ? accounts.emailToID(username) : accounts.usernameToID(username)
    if (!id) {
        res.status(500)
        const error = "A server error occurred (ID attached to username or email not found but was found when checking password?)"
        res.json({ error: error })
        console.error(error)
        return
    }
    const user = accounts.getUserByID(id)
    if (user == null) {
        res.status(500)
        const error = "A server error occurred (User with detail found but User does not exist?)"
        res.json({ error: error })
        console.error(error)
        return
    }
    const saveName = "__" + String(user.username) + "__"
    res.status(200)
    res.json(storageHandler.load(saveName))
}