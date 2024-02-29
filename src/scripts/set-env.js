// => Command: "ts-node set-env.js --environment=dev --version=1.00"
const fs = require('fs');
const argv = require('yargs').argv;

let environment = argv.env;
const version = argv.v;

let envExt = "";
if (environment) envExt = '.' + environment;
else envExt = '';

const filePath = '../environments/environment' + envExt + '.ts';
const fileContent =
    'export const environment = {' +
    'url: "localhost:4200", ' +
    'env: "' + environment + '"' + ', ' +
    'version: "' + version + '"' +
    '};';

fs.writeFile(filePath, fileContent, function (err) {
    if (err) console.log(err);
    console.log('File: ' + filePath);
});
