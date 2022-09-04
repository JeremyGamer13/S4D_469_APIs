const accounts = require("../module.js")
module.exports.pageType = "get"
module.exports.documentation = {
    "documented": true,
    "explanation": `Turns a PFP color into a URL to an image on the server. Use the <code>color</code> query parameter to specify the profile color.`
}
module.exports.onPage = async (req, res, origin, isAnS4DUrl, bypassedS4DOriginCheck, originIncorrectFunction) => {
    res.status(200)
    res.json({ url: `https://s4d469apis.scratch4discord.repl.co/fileAssets/profiles/${req.query.color}.png` })
}