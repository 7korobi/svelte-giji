import sass from 'sass';
import glob from 'glob';
import fs from 'fs';
import functions, { save } from './functions.js';
glob('./src/scss/*.sass', (err, files) => {
  files.forEach((file) => {
    const outFile = file.replace('./src/scss/', './static/css/').replace('.sass', '.css');
    console.log(`${outFile} <== ${file}`);
    const { css } = sass.renderSync({
      file,
      outFile,
      functions,
      outputStyle: 'compressed',
      sourceMap: false
    });
    fs.writeFileSync(outFile, css);
  });
  save();
});
