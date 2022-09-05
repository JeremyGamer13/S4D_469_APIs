const crypto = require("crypto-js");
const database = require("easy-json-database")
const storage = new database('./databases/storagehandler.json')
const key = process.env.encryptionKey
function encrypt(str) {
    if (!str) return ""
    return crypto.AES.encrypt(str, key).toString()
}
function decrypt(str) {
    if (!str) return ""
    return crypto.AES.decrypt(str, key).toString(crypto.enc.Utf8)
}
module.exports.save = (name, content) => {
    storage.set(String(name), encrypt(String(content)))
}
module.exports.load = (name) => {
    return decrypt(storage.get(String(name)))
}