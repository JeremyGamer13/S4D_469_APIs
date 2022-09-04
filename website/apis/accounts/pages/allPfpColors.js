const accounts = require("../module.js")
module.exports.pageType = "get"
module.exports.documentation = {
    "documented": true,
    "explanation": `Returns an array of all profile picture colors the server contains.`
}
module.exports.onPage = async (req, res, origin, isAnS4DUrl, bypassedS4DOriginCheck, originIncorrectFunction) => {
    res.status(200)
    res.json(accounts.allProfileColors)
}