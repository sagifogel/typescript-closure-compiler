# TypeScript Closure Compiler

This patches the TypeScript compiler to generate JSDoc annotations ready for Google Closure Compiler.<br/> A demo is available online at [http://sagifogel.github.io/typescript-closure-compiler/](http://sagifogel.github.io/typescript-closure-compiler/).<br/>
The current version is compatible with TypeScript 1.7.5.<br/>
For the purposes of clarity each npm package that will be released will match TypeScript\`s major and minor version.<br/>
For example each version of `typescript-closure-compiler` that is compatible with TypeScript 1.7.5 will be constructed as 
`1.7.x` and each version that is compatible with TypeScript 1.8.10 will be constructed as `1.8.x`.<br/><br/>
If you work with a specific version of TypeScript (for instance 1.7.5) and want to get the latest compatible version of <br/>`typescript-closure-compiler` then you need to set the version in the `package.json` to:<br/>
```js
"dependencies": {
    "typescript-closure-compiler": "^1.7.1-beta.0"
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
tscc app.ts
```

### Using the gulp task  

`tscc` is a command line compiler much like TypeScript\`s `tsc` file. <br/>You can also choose to compile your code using a [gulp plugin for typescript-closure-compiler](https://www.npmjs.com/package/gulp-typescript-closure-compiler) 

## Additional options

The patched compiler provides couple of additional options that help you to control the output of the closure compiler library.<br/>

### Export symbols to the global scope
Exporting types to the global scope is done using two additional options.<br/>
`--entry` and `--exportAs`. Both options should be explicitly set in order for this feature to work properly.

**entry** - main file that contains all exported types.<br/>
**exportAs** - the name of the main symbol that will be exported to the global scope.<br/>

```js
tscc app.ts --module commonjs --entry app.ts --exportAs App
```

### Declaring Extern symbols
If you use third party libraries in your code and you don't want Closure Compiler to rename its symbols, you need to declare some externs. Declaring externs is done using additional option `--externs`.<br/>
All you need to do is specify the list of extern files after the `externs` option.

```js
tscc app.ts --module commonjs --externs externs/app-extern.d.ts...
```

You can also specify the files in a `ts.config` file.<br/>
use the `project` option to locate the ts.config file:<br/> 
```js
tscc --project [project specific directory]
```
and declare the options in the `ts.config` file: 
```js
{
  "compilerOptions": {
    "module": "commonjs"
  },
  "files": [
    "app.ts"
  ],
  "externs": [
    "externs/app-externs.d.ts"
  ]
}
``` 

you can also use the `externsOutFile` option in order to emit all extern files to a single file.

```js
tscc app.ts --module commonjs --externs externs/app-extern.d.ts --externsOutFile externs.js
```
or declaring it in the `config.ts` file:
```js
{
  "compilerOptions": {
    "module": "commonjs",
    "externsOutFile": "externs.js"
  },
  "files": [
    "app.ts"
  ],
  "externs": [
    "externs/app-externs.d.ts"
  ]
}
``` 

### One side enums
By default `typescript-closure-compiler` emits bi-directional enums, which means that the key could also be resolved using the value.
```js
enum EventType {
    mouseup = 0,
    mousedown = 1
}
```
will be translated to:
```js
var EventType = {
    mouseup: 0,
    mousedown: 1,
    "0": "mouseup",
    "1": "mousedown"
};
```
In order to resolve the key from the value you can write:
```js
console.log(EventType[0]); 
```
"mouseup" will be printed

You can use the `emitOneSideEnums` property to override this behaviour and to just emit one side enums:
```js
tscc app.ts --module commonjs --emitOneSideEnums
```
Now for the same enum the emitted code will be:
```js
var EventType = {
    mouseup: 0,
    mousedown: 1
};
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