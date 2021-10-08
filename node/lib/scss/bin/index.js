import sass from 'sass';
import fs from 'fs';
import functions, { save } from './functions.js';
process.argv.slice(2).forEach((file) => {
    const outFile = file.replace('./src/lib/scss/', './static/css/').replace('.sass', '.css');
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
//# sourceMappingURL=index.js.map