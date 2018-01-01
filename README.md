# TypeScript Closure Compiler

This patches the TypeScript compiler to generate JSDoc annotations ready for Google Closure Compiler.<br/> A demo is available online at [http://sagifogel.github.io/typescript-closure-compiler/](http://sagifogel.github.io/typescript-closure-compiler/).<br/>
The current version is compatible with TypeScript 1.8.10.<br/>
For the purposes of clarity each npm package that will be released will match TypeScript\`s major and minor version.<br/>
For example each version of `typescript-closure-compiler` that is compatible with TypeScript 1.7.5 will be constructed as 
`1.7.x` and each version that is compatible with TypeScript 1.8.10 will be constructed as `1.8.x`.<br/><br/>

## Installing

For the latest stable version:

```js
npm install -g typescript-closure-compiler
```

If you work with a specific version of TypeScript (for instance 1.7.5), <br/>Then you need to install it globally using the @{version} after the `typescript-closure-compiler` name:<br/>
```js
npm install -g typescript-closure-compiler@1.7.x
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

You can also specify the files in a `tsconfig.json` file.<br/>
use the `project` option to locate the tsconfig.json file:<br/> 
```js
tscc --project [project specific directory]
```
and declare the options in the `tsconfig.json` file: 
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

### experimentalDecorators and ignoreDecoratorsWarning 
In case you annotate your class/methods/params with decorators without enabling the `experimentalDecorators` option, 
`TypeScript` will emit all the code that enables this feature, but will output a warning message to enable this option.
```js
function f() {
    console.log("f(): evaluated");
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("f(): called");
    } 
}

class C {
    @f()
    method() {}
}
```
The output will be:
>  Experimental support for decorators is a feature that is subject to change in a future release.<br/>
>  Set the 'experimentalDecorators' option to remove this warning.

`typescript-closure-compiler` changes this behaviour and omits all decorators relevant code when the `experimentalDecorators` is not  enabled, thus ensuring that the generated javascript will not include unnecessary code.<br/>
In addition `typescript-closure-compiler` enables you to use the `ignoreDecoratorsWarning` option in order to ignore the warning message.<br/>
These two options enables you to write your code once using decorations, but to omit the decorations related code using configuration, much like choosing the verbosity of a logger using configuration.<br/><br/> 
A reasonable scenario would be to decorate your class/methods/params with decorators for debug purposes but to omit this code in the final release.<br/>
All you have to do is create two tsconfig.json files one for debug and one for release.<br/>
The release file should include the `ignoreDecoratorsWarning`.
The debug file should include the `experimentalDecorators`.

#### release
```js
{
  "compilerOptions": {
    "ignoreDecoratorsWarning": true
  }
  "files": [
  ]
}
``` 
#### debug
```js
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
  "files": [
  ]
}
``` 

### Changing the global scope
`typescript-clousre-compiler` by default sets all exported symbols to the global scope using the `self` keyword, which is supproted on both node and modern browsers.<br/>
In case you need to change the default value of `self` to any other symbol you can just use the `globalEnvironment` option:
```js
tscc app.ts --globalEnvironment window
```
or declaring it in the `config.ts` file:
```js
{
  "compilerOptions": {
    "globalEnvironment": "window"
  }
}
``` 

### Usage Examples

See an example of `typescript-closure-compiler` using `gulp-typescript-closure-compiler` plugin in the [TSFunq](https://github.com/sagifogel/TSFunq) project.

## Building

The build tool that was chosen for this project is [Jake](http://jakejs.com/), for compatibility reasons with TypeScript`s build system.<br/>

```
git clone https://github.com/sagifogel/typescript-closure-compiler.git
```

Install Jake tools and the dev dependencies of `typescript-closure-compiler`

```
npm install -g jake
npm install
```

Clone the submodule 
```
cd .\TypeScript
git submodule update --init
```

Navigate to the `TypeScript` folder and install its dependencies

```
npm install
```

Return to the folder of `typescript-closure-compiler` and execute the build

```
jake build
```
 
## License

Like the TypeScript compiler itself, this code is licensed under the [Apache License 2.0](http://typescript.codeplex.com/license).
