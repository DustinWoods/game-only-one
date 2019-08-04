const csv = require('csv-parser')
const fs = require('fs')
const results = [];

fs.createReadStream(process.argv[2])
  .pipe(csv())
  .on('data', (data) => {
    const lookup = data.lookup;
    delete data.lookup;
    Object.keys(data).map((k) => {
      if(data[k]) {
        results.push([
          [k, lookup],
          data[k] === "*" ? [] : data[k].split(/,\s?/),
        ])
      }
    });
  })
  .on('end', () => {
    console.log(JSON.stringify(results, null, 2));

  });