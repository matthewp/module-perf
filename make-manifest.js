const fs = require('fs');

fs.readdir('./src', (err, files) => {
  const manifest = files.reduce(function(m, fn){
    m[`/src/${fn}`] = {
      type: 'script',
      weight: 1
    };
    return m;
  }, {});

  console.log(JSON.stringify(manifest, null, ' '));
});
