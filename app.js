const fs = require('fs');
const { program } = require('commander');
const http = require('http');
const xml2js = require('xml2js');

program
  .requiredOption('-h, --host <host>', 'Адреса сервера')
  .requiredOption('-p, --port <port>', 'Порт сервера')
  .requiredOption('-i, --input <input>', 'Шлях до файлу JSON')
  .parse(process.argv);

const options = program.opts();

if (!fs.existsSync(options.input)) {
  console.error('Cannot find input file');
  process.exit(1); 
}

async function readFileAsync(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

async function createXML(data) {
  try {
    const assets = JSON.parse(data);
    if (!assets || !Array.isArray(assets)) {
      throw new Error('Invalid data format');
    }

    const minAsset = assets.reduce((min, asset) => {
      if (min === null || asset.value < min.value) {
        return asset;
      }
      return min;
    }, null);

    const builder = new xml2js.Builder();
    const xml = builder.buildObject({ data: { min_value: minAsset ? minAsset.value : 0 } });

    return xml;
  } catch (err) {
    console.error('Error creating XML:', err);
    throw err;
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const data = await readFileAsync(options.input); 
    const xml = await createXML(data);  

    res.writeHead(200, { 'Content-Type': 'application/xml' });
    res.end(xml);  
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error processing request');
  }
});

server.listen(options.port, options.host, () => {
  console.log(`Сервер запущено на http://${options.host}:${options.port}`);
});

