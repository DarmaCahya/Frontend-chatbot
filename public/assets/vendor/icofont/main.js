const http = require('http')
const fs = require('fs');
const AdmZip = require('adm-zip');

const download = function (filename, url, extractTo) {
    const tmpFilePath = `${filename}.tmp.zip`;
    console.log(`Downloading ${url}`);

    if (fs.existsSync(extractTo)) fs.rm(extractTo, { recursive: true, force: true }, () => { });
    if (fs.existsSync(`./${tmpFilePath}`)) fs.rmSync(`./${tmpFilePath}`, () => { });

    http.get(url, function (response) {
        response.on("data", function (data) {
            fs.appendFileSync(tmpFilePath, data);
        });

        response.on("error", function (e) {
            console.log(`Error downloading: ${e.message}`);
        });

        response.on("end", function () {
            const zip = new AdmZip(tmpFilePath)
            zip.extractAllTo("./");
            fs.rename("./icofont", extractTo, (error) => {
                if (error) throw error;
            });
            fs.unlink(tmpFilePath, () => { });
        });
    });
}
const randomUuid = function () {
    let chars = "";
    for (let i = 0; i < 10; i++) {
        chars += Math.floor(Math.random() * 9).toString();
    }
    return chars;
}

download("icofont", `http://www.icofont.com/process/download?type=1&uid=${randomUuid()}`, "./dist")