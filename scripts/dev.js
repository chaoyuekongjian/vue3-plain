const args = require('minimist')(process.argv.slice(2)); // node scripts/dev.js reactivity -f global 
const { resolve } = require('path') // node中的内置模块
const { build } = require('esbuild')

// minimist 用来解析命令行参数
const target = args._[0] || 'reactivity'
const formate = args.f || 'global'

// 开发环境只打包某一个
const pkg = require(resolve(__dirname, `../packages/${target}/package.json`))

// iife 立即执行函数
// cjs node中的模块
// esm 浏览器中的esModule模块
const outputFormat = formate.startsWith('global') ? 'iife' : formate === 'cjs' ? 'cjs' : 'esm'

const outfile = resolve(__dirname, `../packages/${target}/dist/${target}.${formate}.js`)
build({
  entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
  outfile,
  bundle: true, // 把所有的包打包全部打包到一起
  sourcemap: true,
  format: outputFormat, // 输出的格式
  globalName: pkg.buildOptions?.name, // 打包的全局的名字
  platform: formate === 'cjs' ? 'node' : 'browser',
  watch: { // 监控文件变化
    onRebuild(err) {
      if (!err) console.log('rebuilt')
    }
  }
}).then(() => {
  console.log('watching~~~~')
})
