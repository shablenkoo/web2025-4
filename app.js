const { program } = require('commander');

program.version('1.0.0');

program
  .option('-n, --name <name>', 'Введіть ваше імʼя')
  .parse(process.argv); 

const options = program.opts();

if (options.name) {
  console.log(`Привіт, ${options.name}!`);
} else {
  console.log('Привіт, світе!');
}

