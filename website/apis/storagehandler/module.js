const jszip = require("jszip")
const database = require("easy-json-database")
const storage = new database('./databases/storagehandler.json')
module.exports.save = (name, content) => {
    const zip = new jszip()
    zip.file("data", content)
    zip.generateAsync({ type: "binarystring" }).then(function (content) {
        storage.set(String(name), content)
    });
}