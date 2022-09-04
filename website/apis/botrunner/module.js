const child_process = require('node:child_process');
const discord = require("discord.js")
module.exports.verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        const client = new discord.Client({ intents: [] })
        client.login(token).then(() => {
            resolve(true)
            client.destroy()
        }).catch(() => {
            resolve(false)
        })
    })
}