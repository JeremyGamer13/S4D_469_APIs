const accounts = require("../module.js")
module.exports.pageType = "get"
module.exports.documentation = {
    "documented": true,
    "explanation": `Returns the user with the username specified in the <code>username</code> header.
A key named <code>error</code> will be sent back instead if a user wasn't found or the request was invalid.`
}
module.exports.onPage = async (req, res, origin, isAnS4DUrl, bypassedS4DOriginCheck, originIncorrectFunction) => {
    const username = req.header("username")
    if (username == null) {
        res.status(400)
        res.json({ error: "No username specified" })
        return
    }
    const id = (accounts.usernameToID(username))
    if (id == 0 || id == null) {
        res.status(400)
        res.json({ error: "No account found with the username" })
        return
    }
    const user = accounts.getUserByID(id)
    if (user == null) {
        res.status(500)
        const error = "A server error occurred (User with username found but User does not exist?)"
        res.json({ error: error })
        console.error(error)
        return
    }
    res.status(200)
    res.json(accounts.censorAccount(user))
}