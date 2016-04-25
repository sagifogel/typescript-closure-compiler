# TypeScript Closure Compiler

This patches the TypeScript compiler to generate JSDoc annotations ready for Google Closure Compiler.<br/> A demo is available online at [http://sagifogel.github.io/typescript-closure-compiler/](http://sagifogel.github.io/typescript-closure-compiler/).<br/>
The current version is compatible with TypeScript 1.7.5.<br/>
For the purposes of clarity each npm package that will be released will match TypeScript\`s major and minor version.<br/>
For example each version of `typescript-closure-compiler` that is compatible with TypeScript 1.7.5 will be constructed as 
`1.7.x`<br/>and each version that is compatible with TypeScript 1.8.10 will be constructed as `1.8.x`.<br/><br/>
If you work with a specific version of TypeScript (for instance 1.7.5) and want to get the latest compatible version of <br/>`typescript-closure-compiler` then you need to set the version in the `package.json` to:<br/>
```js
"dependencies": {
    "typescript-closure-compiler": "^1.7.0-beta.0"
}
```

## Installing

For the latest stable version:

```js
npm install -g typescript-closure-compiler
```

## Usage

The patched version of the TypeScript compiler is available as `tscc` after installing globally with `npm install -g typescript-closure-compiler`. Substitute `tsc` with `tscc` in your build script. Note that the `--module` flag is supported only for the compilation phase (you can write your code using any preferred module system), it won't be present in the output files since the intent is to compile and optimize all code into one big bundle.<br/>
Also the output of the `tscc` will transpile into ECMAScript 5

```js
node tscc app.ts
```

The patched compiler provides two additional options that help export symbols to the global scope.<br/>
`--entry` and `--exportAs`. Both options should be explicitly set in order for this feature to work properly.

**entry** - main file that contains all exported types.<br/>
**exportAs** - the name of the main symbol that will be exported to the global scope.<br/>

```js
node tscc app.ts --module commonjs --entry app.ts --exportAs App
```

## Building

The build tool that was chosen for this project is [Jake](http://jakejs.com/), for compatibility reasons with TypeScript`s build system.<br/>

```
git clone https://github.com/sagifogel/typescript-closure-compiler.git
```

Install Jake tools and dev dependencies:

```
npm install -g jake
npm install
```

Execute the build

```
jake build
```
 
## License

Like the TypeScript compiler itself, this code is licensed under the [Apache License 2.0](http://typescript.codeplex.com/license).