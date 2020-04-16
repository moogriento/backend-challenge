const fs = require('fs');
const { parse } = require('@fast-csv/parse');

/**
 * Parses a csv file with the given config and returns
 * an array of chunks to be processed
 * @param {string} path The path of the file to parse
 * @param {Object} config The config to be used to determine the columns
 * @param {Number} chunkSize The size of the chunks to be generated
 */
const parseCsv = (path, config, chunkSize = 200) => {
  const arrayOfChunks = [];
  let aux = [];
  let i = 0;

  let totalRows = 0;
  const columns = Object.keys(config);

  return new Promise((resolve, reject) => {
    fs.createReadStream(path)
      .pipe(parse({ headers: false })) // Get an array
      .on('error', (error) => {
        console.error(error)
        reject(error);
      })
      .on('data', (row) => {
        const orderRow = {};
        i += 1;

        for (let column of columns) {
          if (column !== 'headers') {
            const position = config[column];
            const data = row[position];

            if (data !== undefined) {
              orderRow[column] = data;
            }
          }
        }

        aux.push(orderRow);
    
        if (i % chunkSize === 0) {
          arrayOfChunks.push(aux);
          aux = [];
        }
      })
      .on('end', (rowCount) => {
        totalRows = rowCount;

        if (aux.length > 0) {
          arrayOfChunks.push(aux);
        }

        resolve({
          total: totalRows,
          data: arrayOfChunks,
        });
      });
  });
}

exports.parseCsv = parseCsv;
