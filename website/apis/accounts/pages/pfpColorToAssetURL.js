const accounts = require("../module.js")
module.exports.pageType = "get"
module.exports.documentation = {
    "documented": true,
    "explanation": `Turns a PFP color into a URL to an image on the server. Use the <code>color</code> query parameter to specify the profile color.
An object containing a key named <code>url</code> will be sent back. The value of this will be null if the color is invalid.`
}
module.exports.onPage = async (req, res, origin, isAnS4DUrl, bypassedS4DOriginCheck, originIncorrectFunction) => {
    res.status(accounts.allProfileColors.includes(req.query.color) ? 200 : 400)
    res.json({ url: (accounts.allProfileColors.includes(req.query.color) ? `https://s4d469apis.scratch4discord.repl.co/fileAssets/profiles/${req.query.color}.png` : null) })
}