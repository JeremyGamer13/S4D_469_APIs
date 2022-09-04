const accounts = require("../module.js")
module.exports.pageType = "post"
module.exports.documentation = {
    "documented": true,
    "explanation": `Put the account username and password in the POST request's body. If the account was created, an object will be returned containing the account's ID.
Otherwise, an object containing the error will be returned.`
}
module.exports.onPage = async (req, res, origin, isAnS4DUrl, bypassedS4DOriginCheck, originIncorrectFunction) => {
    const object = accounts.register(req.body.username, req.body.password)
    res.status(object.error ? object.errorCode : 200)
    res.json(object)
}