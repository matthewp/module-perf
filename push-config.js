const fs = require('fs');

let str = '';
fs.readdir('./src', (err, files) => {
    str += files.map(addLink).join('\n');
    console.log(str);
});

function addLink(file){
    return `Header add Link "</perf/src/${file}>;rel=preload"`;
}