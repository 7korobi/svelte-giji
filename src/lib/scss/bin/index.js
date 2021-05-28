import sass from 'sass'
import functions from './functions.js'
process.argv.slice(2).forEach((file) => {
  const outFile = file.replace('./src/lib/scss/', './static/css/').replace('.sass', '.css')
  sass.renderSync({
    file,
    outFile,
    functions,
    outputStyle: 'compressed',
    sourceMap: true
  })
})
