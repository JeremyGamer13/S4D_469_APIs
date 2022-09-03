const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
let path = require('path');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

const apis = []

// some nice information
app.get('/', function (req, res) {
    res.status(200)
    res.json({
        "metadata": {
            "name": "BaseApi",
            "description": "Handles normal requests & allows other APIs to run",
            "date": 1662230525,
            "developer": "JeremyGamer13"
        },
        "info": {
            "apis": apis,
            "loaderVersion": 1
        }
    })
})

const originsAllowed = [
    "https://scratch-for-discord-469.vercel.app",
    "https://scratch-for-discord.com",
    "https://s4d-469.vercel.app",
    "https://s4d469.vercel.app"
]

fs.readdir('./website/apis', async (err, folders) => {
    if (err) throw err
    folders.forEach(async folder => {
        apis.push(folder) // add this api to the api list
        const metadata = JSON.parse(fs.readFileSync(`./website/apis/${folder}/metadata.json`))
        app.get(`/${folder}/`, function (req, res) { // handle this api's / page
            res.status(200)
            res.json(metadata)
        })
        console.log("Loaded package page for folder", folder)
        fs.readdir(`./website/apis/${folder}/pages`, async (err, files) => {
            if (err) throw err
            files.forEach(async file => {
                console.log("Creating page:", `[HOST]/${folder}/${file.replace(/\.\S+/gmi, "")}`)
                const pagePackage = require(`./website/apis/${folder}/pages/${file}`)
                app[pagePackage.pageType](`/${folder}/${file.replace(/\.\S+/gmi, "")}/`, function (req, res) {
                    let isAnS4DUrl = true
                    let bypassedS4DOriginCheck = false
                    const requestOrigin = req.get('origin')
                    const origin = requestOrigin == null || requestOrigin == "" ? String(req.headers.referer) : requestOrigin
                    if (!originsAllowed.includes(requestOrigin)) {
                        if (String(req.headers.referer) != "https://scratch-for-discord-469.vercel.app/") {
                            isAnS4DUrl = false
                        }
                    }
                    if (req.header("cors_bypass") == process.env.corsBypass) bypassedS4DOriginCheck = true
                    pagePackage.onPage(req, res, origin, isAnS4DUrl, bypassedS4DOriginCheck, function (message) {
                        res.status(403)
                        res.json({ "error": message == null ? "Only Scratch For Discord can run this operation." : message })
                    })
                })
                const documentationMeta = pagePackage.documentation || { "documented": false }
                app.get(`/apiDocumentation/${folder}/${file.replace(/\.\S+/gmi, "")}/`, function (req, res) {
                    if (documentationMeta.documented == false) {
                        res.status(404)
                        res.header("Content-Type", 'text/html')
                        res.send(`
<h1>This endpoint is not documented.</h1>
<p>The endpoint may be unfinished, unusable by others, or the documentation was just forgotten.</p>
`)
                        return
                    }
                    res.status(200)
                    res.header("Content-Type", 'text/html')
                    res.send(`
<h1>${folder + " - " + file.replace(/\.\S+/gmi, "")}</h1>
<p><small>This endpoint uses a <b>${pagePackage.pageType}</b> request</small></p>
<br>
${documentationMeta.html != null ? documentationMeta.html : `<p>${String(documentationMeta.explanation).replaceAll("\n", "<br>")}</p>`}
`)
                })
                console.log("Created documentation page:", `[HOST]/apiDocumentation/${folder}/${file.replace(/\.\S+/gmi, "")}`)
            });
            console.log("Loaded all pages for", folder)
        });
    });
});

app.listen(8080);