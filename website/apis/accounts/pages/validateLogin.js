const accounts = require("../module.js")
module.exports.pageType = "get"
module.exports.documentation = {
    "documented": true,
    "explanation": `If the header <code>username</code> or <code>email</code> belongs to an account and the header <code>password</code> is the correct password for that account, the <code>error</code> key in the returned object will be null.
Otherwise, it will be set to a string explaining what failed.
If the account has IP lock on it, an email will be sent to the user to verify the login if the <code>emailVerify</code> header is set to true.`
}
module.exports.onPage = async (req, res, origin, isAnS4DUrl, bypassedS4DOriginCheck, originIncorrectFunction) => {
    const username = req.header("username")
    const email = req.header("email")
    const password = req.header("password")
    if (username == null && email == null) {
        res.status(400)
        res.json({ error: "No username or email specified" })
    }
    if (password == null) {
        res.status(400)
        res.json({ error: "No password specified" })
    }
    if (email && (!(accounts.isAnEmail(email)))) {
        res.status(400)
        res.json({ error: "Email is invalid" })
    }
    const id = (email == null ? accounts.usernameToID(username) : accounts.emailToID(email))
    if (id == 0 || id == null) {
        res.status(400)
        res.json({ error: "No account found with the username or email" })
    }
    const user = accounts.getUserByID(id)
    if (user == null) {
        res.status(500)
        const error = "A server error occurred (User with detail found but User does not exist?)"
        res.json({ error: error })
        console.error(error)
    }
    if (!accounts.passwordCheck(user, password)) {
        res.status(403)
        res.json({ error: "Incorrect password" })
    }
    if (!accounts.passwordHelper(email == null ? username : email, password)) {
        res.status(500)
        const error = "A server error occurred (Full validation passed but passwordHelper didn't?)"
        res.json({ error: error })
        console.error(error)
    }
    res.status(200)
    res.json({ error: null })
}