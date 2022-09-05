const crypto = require("crypto-js");
const fs = require("fs")
const database = require("easy-json-database")
const accounts = new database('./databases/accounts.json')
const key = process.env.encryptionKey
function generateID() {
    return Math.round((Math.random() * 99999999999999) + 10000000000000)
}
module.exports.generateID = generateID
function censorAccount(account) {
    return {
        "username": account.username,
        "thirdParty": account.thirdParty != null,
        "application": account.application,
        "email": account.email != null,
        "displayName": account.displayName,
        "profilePicture": account.profilePicture
    }
}
module.exports.censorAccount = censorAccount
const forbiddenUsernames = [
    "Malix",
    "JeremyGamer13",
    "AlexCdDg",
    "Noxy",
    "Androz",
    "RllyNotDev",
    "RllyNotFox",
    "XL83",
    "cat soup",
    "DarkMole",
    "DemiMole",
    "Freslin",
    "jose_trindade",
    "LimeNade",
    "MrRedo",
    "godslayerakp",
    "redman13",
    "blueman13",
    "Retro",
    "frostzzone",
    "TropicGalxy",
    "TropicGalaxy",
    "Eruption",
    "Parham",
    "S4D",
    "ScratchForDiscord",
    "Discord"
]
// const usableCharacters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_", "=", "+"]
module.exports.forbiddenUsername = (username) => {
    let forbidden = false
    forbiddenUsernames.forEach(name => {
        if (String(username).toLowerCase().replaceAll(" ", "").includes(name.replaceAll(" ", "").toLowerCase())) {
            forbidden = true
        }
    })
    return forbidden
}
module.exports.isAnEmail = (possibleEmail) => {
    return String(possibleEmail).match(/@\S+\.\S+/gmi) ? true : false
}
module.exports.usernameToID = (username) => {
    let r = 0
    accounts.all().forEach(id => {
        if (accounts.get(String(id)).username == username) r = id
    })
    return r
}
module.exports.emailToID = (email) => {
    let r = 0
    accounts.all().forEach(id => {
        if (accounts.get(id).email == email) r = id
    })
    return r
}
module.exports.getUserByID = (id) => {
    return accounts.get(id)
}
module.exports.passwordCheck = (user, password) => {
    return crypto.AES.decrypt(user.password, key).toString(crypto.enc.Utf8) == password
}
module.exports.passwordHelper = (detail, password) => {
    const id = (module.exports.isAnEmail(detail) ? module.exports.emailToID(detail) : module.exports.usernameToID(detail))
    if (!id) return false
    return module.exports.passwordCheck(module.exports.getUserByID(id), password)
}
module.exports.httpPasswordHelper = (req, res) => {
    if (!(module.exports.passwordHelper(req.header("email") != null ? req.header("email") : req.header("username"), req.header("password")))) {
        res.status(403)
        res.json({ "error": "Failed to validate account details (check /accounts/validateLogin for details)" })
        return false
    }
    return true
}
module.exports.accountExists = (id) => {
    return accounts.has(String(id))
}
const profileColorArray = []
fs.readdir("./website/assets/profiles", (err, files) => {
    files.forEach(file => {
        profileColorArray.push(file.replace(/\.\S*/gmi, ""))
    })
    module.exports.allProfileColors = profileColorArray
})
module.exports.register = (username, password, thirdParty, ip) => {
    if (username == null || username == "") return { error: "Missing username", errorCode: 400 }
    if (password == null || password == "") return { error: "Missing password", errorCode: 400 }
    if (String(username).length > 30) return { error: "Usernames cannot be longer than 30 characters", errorCode: 400 }
    if (String(username).length < 3) return { error: "Usernames cannot be shorter than 3 characters", errorCode: 400 }
    if (String(username).match(/[^A-Za-z0-9_ \-]/gmi)) return { error: "Usernames can only have letters A-Z (or a-z), numbers 0-9, underscores, spaces and dashes", errorCode: 400 }
    if (module.exports.accountExists(module.exports.usernameToID(username))) return { error: "That username is taken", errorCode: 403 }
    if (module.exports.forbiddenUsername(username)) return { error: "That username is owned by a developer or service", errorCode: 403 }
    let accountID = generateID()
    while (module.exports.accountExists(accountID)) {
        accountID = generateID()
    }
    accounts.set(String(accountID), {
        "username": username,
        "password": crypto.AES.encrypt(password, key).toString(),
        "thirdParty": thirdParty == null ? null : thirdParty, // for third party sign in like discord or github, this will show as the name of the service
        "application": false, // for bot accounts
        "email": null, // for password resets
        "displayName": username,
        "profilePicture": "https://s4d469apis.scratch4discord.repl.co/fileAssets/profiles/yellow.png",
        "ipLock": ip == null ? null : crypto.AES.encrypt(ip, process.env.masterKey).toString()
    })
    return { id: accountID }
}