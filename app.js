const fs = require('fs');
const { program } = require('commander');
const http = require('http');

program
  .requiredOption('-h, --host <host>', 'Адреса сервера')
  .requiredOption('-p, --port <port>', 'Порт сервера')
  .requiredOption('-i, --input <input>', 'Шлях до файлу JSON')
  .parse(process.argv);

const options = program.opts();

if (!fs.existsSync(options.input)) {
  console.error('Cannot find input file');
  process.exit(1);  // Виходимо з помилкою
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`Сервер запущено на ${options.host}:${options.port}`);
});

server.listen(options.port, options.host, () => {
  console.log(`Сервер запущено на http://${options.host}:${options.port}`);
});

