import nodeResolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript'

export default {
  entry: 'src/main/client/index.ts',
  dest: 'dist/main/client/index.js',
  sourceMap: true,
  plugins: [
    typescript({
      typescript: require("typescript"),
      tsconfig: false,
      // compilerOptions of tsconfig.json
      experimentalDecorators: true,
      jsx: "preserve",
      module: "es6",
      moduleResolution: "node",
      noFallthroughCasesInSwitch: true,
      noImplicitAny: true,
      noImplicitReturns: true,
      noImplicitThis: true,
      outDir: "dist",
      preserveConstEnums: true,
      removeComments: true,
      sourceMap: true,
      target: "es5"
    }),
    nodeResolve({
      jsnext: true,
      main: true
    })
  ]
}
