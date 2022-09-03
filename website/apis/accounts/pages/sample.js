module.exports.pageType = "get"
module.exports.documentation = {
    "documented": false
}
module.exports.onPage = async (req, res, origin, isAnS4DUrl, bypassedS4DOriginCheck, originIncorrectFunction) => {
    res.status(200)
    res.json({
        "error": null
    })
}