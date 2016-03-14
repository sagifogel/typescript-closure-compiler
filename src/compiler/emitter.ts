/// <reference path="checker.ts" />
/// <reference path="declarationEmitter.ts" />
 
/* @internal */
namespace ts {
    export function isExternalModuleOrDeclarationFile(sourceFile: SourceFile) {
        return isExternalModule(sourceFile) || isDeclarationFile(sourceFile);
    }

    type ModuleGeneration = { declarations: { [name: string]: boolean }, generated: boolean };
    type DependencyGroup = Array<ImportDeclaration | ImportEqualsDeclaration | ExportDeclaration>;

    let entities: Map<number> = {
        "quot": 0x0022,
        "amp": 0x0026,
        "apos": 0x0027,
        "lt": 0x003C,
        "gt": 0x003E,
        "nbsp": 0x00A0,
        "iexcl": 0x00A1,
        "cent": 0x00A2,
        "pound": 0x00A3,
        "curren": 0x00A4,
        "yen": 0x00A5,
        "brvbar": 0x00A6,
        "sect": 0x00A7,
        "uml": 0x00A8,
        "copy": 0x00A9,
        "ordf": 0x00AA,
        "laquo": 0x00AB,
        "not": 0x00AC,
        "shy": 0x00AD,
        "reg": 0x00AE,
        "macr": 0x00AF,
        "deg": 0x00B0,
        "plusmn": 0x00B1,
        "sup2": 0x00B2,
        "sup3": 0x00B3,
        "acute": 0x00B4,
        "micro": 0x00B5,
        "para": 0x00B6,
        "middot": 0x00B7,
        "cedil": 0x00B8,
        "sup1": 0x00B9,
        "ordm": 0x00BA,
        "raquo": 0x00BB,
        "frac14": 0x00BC,
        "frac12": 0x00BD,
        "frac34": 0x00BE,
        "iquest": 0x00BF,
        "Agrave": 0x00C0,
        "Aacute": 0x00C1,
        "Acirc": 0x00C2,
        "Atilde": 0x00C3,
        "Auml": 0x00C4,
        "Aring": 0x00C5,
        "AElig": 0x00C6,
        "Ccedil": 0x00C7,
        "Egrave": 0x00C8,
        "Eacute": 0x00C9,
        "Ecirc": 0x00CA,
        "Euml": 0x00CB,
        "Igrave": 0x00CC,
        "Iacute": 0x00CD,
        "Icirc": 0x00CE,
        "Iuml": 0x00CF,
        "ETH": 0x00D0,
        "Ntilde": 0x00D1,
        "Ograve": 0x00D2,
        "Oacute": 0x00D3,
        "Ocirc": 0x00D4,
        "Otilde": 0x00D5,
        "Ouml": 0x00D6,
        "times": 0x00D7,
        "Oslash": 0x00D8,
        "Ugrave": 0x00D9,
        "Uacute": 0x00DA,
        "Ucirc": 0x00DB,
        "Uuml": 0x00DC,
        "Yacute": 0x00DD,
        "THORN": 0x00DE,
        "szlig": 0x00DF,
        "agrave": 0x00E0,
        "aacute": 0x00E1,
        "acirc": 0x00E2,
        "atilde": 0x00E3,
        "auml": 0x00E4,
        "aring": 0x00E5,
        "aelig": 0x00E6,
        "ccedil": 0x00E7,
        "egrave": 0x00E8,
        "eacute": 0x00E9,
        "ecirc": 0x00EA,
        "euml": 0x00EB,
        "igrave": 0x00EC,
        "iacute": 0x00ED,
        "icirc": 0x00EE,
        "iuml": 0x00EF,
        "eth": 0x00F0,
        "ntilde": 0x00F1,
        "ograve": 0x00F2,
        "oacute": 0x00F3,
        "ocirc": 0x00F4,
        "otilde": 0x00F5,
        "ouml": 0x00F6,
        "divide": 0x00F7,
        "oslash": 0x00F8,
        "ugrave": 0x00F9,
        "uacute": 0x00FA,
        "ucirc": 0x00FB,
        "uuml": 0x00FC,
        "yacute": 0x00FD,
        "thorn": 0x00FE,
        "yuml": 0x00FF,
        "OElig": 0x0152,
        "oelig": 0x0153,
        "Scaron": 0x0160,
        "scaron": 0x0161,
        "Yuml": 0x0178,
        "fnof": 0x0192,
        "circ": 0x02C6,
        "tilde": 0x02DC,
        "Alpha": 0x0391,
        "Beta": 0x0392,
        "Gamma": 0x0393,
        "Delta": 0x0394,
        "Epsilon": 0x0395,
        "Zeta": 0x0396,
        "Eta": 0x0397,
        "Theta": 0x0398,
        "Iota": 0x0399,
        "Kappa": 0x039A,
        "Lambda": 0x039B,
        "Mu": 0x039C,
        "Nu": 0x039D,
        "Xi": 0x039E,
        "Omicron": 0x039F,
        "Pi": 0x03A0,
        "Rho": 0x03A1,
        "Sigma": 0x03A3,
        "Tau": 0x03A4,
        "Upsilon": 0x03A5,
        "Phi": 0x03A6,
        "Chi": 0x03A7,
        "Psi": 0x03A8,
        "Omega": 0x03A9,
        "alpha": 0x03B1,
        "beta": 0x03B2,
        "gamma": 0x03B3,
        "delta": 0x03B4,
        "epsilon": 0x03B5,
        "zeta": 0x03B6,
        "eta": 0x03B7,
        "theta": 0x03B8,
        "iota": 0x03B9,
        "kappa": 0x03BA,
        "lambda": 0x03BB,
        "mu": 0x03BC,
        "nu": 0x03BD,
        "xi": 0x03BE,
        "omicron": 0x03BF,
        "pi": 0x03C0,
        "rho": 0x03C1,
        "sigmaf": 0x03C2,
        "sigma": 0x03C3,
        "tau": 0x03C4,
        "upsilon": 0x03C5,
        "phi": 0x03C6,
        "chi": 0x03C7,
        "psi": 0x03C8,
        "omega": 0x03C9,
        "thetasym": 0x03D1,
        "upsih": 0x03D2,
        "piv": 0x03D6,
        "ensp": 0x2002,
        "emsp": 0x2003,
        "thinsp": 0x2009,
        "zwnj": 0x200C,
        "zwj": 0x200D,
        "lrm": 0x200E,
        "rlm": 0x200F,
        "ndash": 0x2013,
        "mdash": 0x2014,
        "lsquo": 0x2018,
        "rsquo": 0x2019,
        "sbquo": 0x201A,
        "ldquo": 0x201C,
        "rdquo": 0x201D,
        "bdquo": 0x201E,
        "dagger": 0x2020,
        "Dagger": 0x2021,
        "bull": 0x2022,
        "hellip": 0x2026,
        "permil": 0x2030,
        "prime": 0x2032,
        "Prime": 0x2033,
        "lsaquo": 0x2039,
        "rsaquo": 0x203A,
        "oline": 0x203E,
        "frasl": 0x2044,
        "euro": 0x20AC,
        "image": 0x2111,
        "weierp": 0x2118,
        "real": 0x211C,
        "trade": 0x2122,
        "alefsym": 0x2135,
        "larr": 0x2190,
        "uarr": 0x2191,
        "rarr": 0x2192,
        "darr": 0x2193,
        "harr": 0x2194,
        "crarr": 0x21B5,
        "lArr": 0x21D0,
        "uArr": 0x21D1,
        "rArr": 0x21D2,
        "dArr": 0x21D3,
        "hArr": 0x21D4,
        "forall": 0x2200,
        "part": 0x2202,
        "exist": 0x2203,
        "empty": 0x2205,
        "nabla": 0x2207,
        "isin": 0x2208,
        "notin": 0x2209,
        "ni": 0x220B,
        "prod": 0x220F,
        "sum": 0x2211,
        "minus": 0x2212,
        "lowast": 0x2217,
        "radic": 0x221A,
        "prop": 0x221D,
        "infin": 0x221E,
        "ang": 0x2220,
        "and": 0x2227,
        "or": 0x2228,
        "cap": 0x2229,
        "cup": 0x222A,
        "int": 0x222B,
        "there4": 0x2234,
        "sim": 0x223C,
        "cong": 0x2245,
        "asymp": 0x2248,
        "ne": 0x2260,
        "equiv": 0x2261,
        "le": 0x2264,
        "ge": 0x2265,
        "sub": 0x2282,
        "sup": 0x2283,
        "nsub": 0x2284,
        "sube": 0x2286,
        "supe": 0x2287,
        "oplus": 0x2295,
        "otimes": 0x2297,
        "perp": 0x22A5,
        "sdot": 0x22C5,
        "lceil": 0x2308,
        "rceil": 0x2309,
        "lfloor": 0x230A,
        "rfloor": 0x230B,
        "lang": 0x2329,
        "rang": 0x232A,
        "loz": 0x25CA,
        "spades": 0x2660,
        "clubs": 0x2663,
        "hearts": 0x2665,
        "diams": 0x2666
    };

    // Flags enum to track count of temp variables and a few dedicated names
    const enum TempFlags {
        Auto = 0x00000000,  // No preferred name
        CountMask = 0x0FFFFFFF,  // Temp variable counter
        _i = 0x10000000,  // Use/preference flag for '_i'
    }

    // targetSourceFile is when users only want one file in entire project to be emitted. This is used in compileOnSave feature
    export function emitFiles(typeChecker: TypeChecker, resolver: EmitResolver, host: EmitHost, targetSourceFile: SourceFile): EmitResult {
        // emit output for the __extends helper function
        const extendsHelper = `
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    /** @constructor */ function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};`;

        // emit output for the __decorate helper function
        const decorateHelper = `
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};`;

        // emit output for the __metadata helper function
        const metadataHelper = `
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};`;

        // emit output for the __param helper function
        const paramHelper = `
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};`;

        const awaiterHelper = `
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};`;

        let compilerOptions = host.getCompilerOptions();
        let languageVersion = compilerOptions.target || ScriptTarget.ES3;
        let modulekind = compilerOptions.module ? compilerOptions.module : languageVersion === ScriptTarget.ES6 ? ModuleKind.ES6 : ModuleKind.None;
        let sourceMapDataList: SourceMapData[] = compilerOptions.sourceMap || compilerOptions.inlineSourceMap ? [] : undefined;
        let diagnostics: Diagnostic[] = [];
        let newLine = host.getNewLine();
        let jsxDesugaring = host.getCompilerOptions().jsx !== JsxEmit.Preserve;
        let shouldEmitJsx = (s: SourceFile) => (s.languageVariant === LanguageVariant.JSX && !jsxDesugaring);

        if (targetSourceFile === undefined) {
            forEach(host.getSourceFiles(), sourceFile => {
                if (shouldEmitToOwnFile(sourceFile, compilerOptions)) {
                    let jsFilePath = getOwnEmitOutputFilePath(sourceFile, host, shouldEmitJsx(sourceFile) ? ".jsx" : ".js");
                    emitFile(jsFilePath, sourceFile);
                }
            });

            if (compilerOptions.outFile || compilerOptions.out) {
                emitFile(compilerOptions.outFile || compilerOptions.out);
            }
        }
        else {
            // targetSourceFile is specified (e.g calling emitter from language service or calling getSemanticDiagnostic from language service)
            if (shouldEmitToOwnFile(targetSourceFile, compilerOptions)) {
                let jsFilePath = getOwnEmitOutputFilePath(targetSourceFile, host, shouldEmitJsx(targetSourceFile) ? ".jsx" : ".js");
                emitFile(jsFilePath, targetSourceFile);
            }
            else if (!isDeclarationFile(targetSourceFile) && (compilerOptions.outFile || compilerOptions.out)) {
                emitFile(compilerOptions.outFile || compilerOptions.out);
            }
        }

        // Sort and make the unique list of diagnostics
        diagnostics = sortAndDeduplicateDiagnostics(diagnostics);

        return {
            emitSkipped: false,
            diagnostics,
            sourceMaps: sourceMapDataList
        };

        function isUniqueLocalName(name: string, container: Node): boolean {
            for (let node = container; isNodeDescendentOf(node, container); node = node.nextContainer) {
                if (node.locals && hasProperty(node.locals, name)) {
                    // We conservatively include alias symbols to cover cases where they're emitted as locals
                    if (node.locals[name].flags & (SymbolFlags.Value | SymbolFlags.ExportValue | SymbolFlags.Alias)) {
                        return false;
                    }
                }
            }
            return true;
        }

        function emitJavaScript(jsFilePath: string, root?: SourceFile) {
            let writer = createTextWriter(newLine);
            var rawWrite = writer.rawWrite, write = writer.write, writeTextOfNode = writer.writeTextOfNode, writeLine = writer.writeLine, increaseIndent = writer.increaseIndent, decreaseIndent = writer.decreaseIndent, getIndent = writer.getIndent, getColumn = writer.getColumn;
            var forceWriteLine = function (idnetation?: number) {
                rawWrite(newLine);
                rawWrite(ts.getIndentString(idnetation || getIndent()));
            };

            var writeValueAndNewLine = function (value: string): void {
                write(value);
                forceWriteLine();
            };

            let currentSourceFile: SourceFile;
            // name of an exporter function if file is a System external module
            // System.register([...], function (<exporter>) {...})
            // exporting in System modules looks like:
            // export var x; ... x = 1
            // =>
            // var x;... exporter("x", x = 1)
            let exportFunctionForFile: string;

            let generatedNameSet: Map<string> = {};
            let nodeToGeneratedName: string[] = [];
            let typeAliases: { [name: string]: boolean } = {};
            let modulesToGeneratedName: { [name: string]: ModuleGeneration } = {};
            let computedPropertyNamesToGeneratedNames: string[];

            let extendsEmitted = false;
            let decorateEmitted = false;
            let paramEmitted = false;
            let awaiterEmitted = false;
            let tempFlags = 0;
            let tempVariables: Identifier[];
            let tempParameters: Identifier[];
            let externalImports: (ImportDeclaration | ImportEqualsDeclaration | ExportDeclaration)[];
            let exportSpecifiers: Map<ExportSpecifier[]>;
            let exportEquals: ExportAssignment;
            let hasExportStars: boolean;

            /** Write emitted output to disk */
            let writeEmittedFiles = writeJavaScriptFile;

            let detachedCommentsInfo: { nodePos: number; detachedCommentEndPos: number }[];

            let writeComment = writeCommentRange;

            /** Emit a node */
            let emit = emitNodeWithCommentsAndWithoutSourcemap;

            /** Called just before starting emit of a node */
            let emitStart = function (node: Node) { };

            /** Called once the emit of the node is done */
            let emitEnd = function (node: Node) { };

            /** Emit the text for the given token that comes after startPos
              * This by default writes the text provided with the given tokenKind
              * but if optional emitFn callback is provided the text is emitted using the callback instead of default text
              * @param tokenKind the kind of the token to search and emit
              * @param startPos the position in the source to start searching for the token
              * @param emitFn if given will be invoked to emit the text instead of actual token emit */
            let emitToken = emitTokenText;

            /** Called to before starting the lexical scopes as in function/class in the emitted code because of node
              * @param scopeDeclaration node that starts the lexical scope
              * @param scopeName Optional name of this scope instead of deducing one from the declaration node */
            let scopeEmitStart = function (scopeDeclaration: Node, scopeName?: string) { };

            /** Called after coming out of the scope */
            let scopeEmitEnd = function () { };

            /** Sourcemap data that will get encoded */
            let sourceMapData: SourceMapData;

            /** If removeComments is true, no leading-comments needed to be emitted **/
            let emitLeadingCommentsOfPosition = compilerOptions.removeComments ? function (pos: number) { } : emitLeadingCommentsOfPositionWorker;

            let moduleEmitDelegates: Map<(node: SourceFile) => void> = {
                [ModuleKind.ES6]: emitES6Module,
                [ModuleKind.AMD]: emitAMDModule,
                [ModuleKind.System]: emitSystemModule,
                [ModuleKind.UMD]: emitUMDModule,
                [ModuleKind.CommonJS]: emitCommonJSModule,
            };

            if (compilerOptions.sourceMap || compilerOptions.inlineSourceMap) {
                initializeEmitterWithSourceMaps();
            }

            if (root) {
                // Do not call emit directly. It does not set the currentSourceFile.
                emitSourceFile(root);
            }
            else {
                forEach(host.getSourceFiles(), sourceFile => {
                    if (ts.getBaseFileName(sourceFile.fileName) !== "lib.d.ts") {
                        emitSourceFile(sourceFile);
                    }
                });
            }

            writeLine();
            writeEmittedFiles(writer.getText(), /*writeByteOrderMark*/ compilerOptions.emitBOM);
            return;

            function emitSourceFile(sourceFile: SourceFile): void {
                currentSourceFile = sourceFile;
                exportFunctionForFile = undefined;
                emit(sourceFile);
            }

            function isUniqueName(name: string): boolean {
                return !resolver.hasGlobalName(name) &&
                    !hasProperty(currentSourceFile.identifiers, name) &&
                    !hasProperty(generatedNameSet, name);
            }

            // Return the next available name in the pattern _a ... _z, _0, _1, ...
            // TempFlags._i or TempFlags._n may be used to express a preference for that dedicated name.
            // Note that names generated by makeTempVariableName and makeUniqueName will never conflict.
            function makeTempVariableName(flags: TempFlags): string {
                if (flags && !(tempFlags & flags)) {
                    let name = flags === TempFlags._i ? "_i" : "_n";
                    if (isUniqueName(name)) {
                        tempFlags |= flags;
                        return name;
                    }
                }
                while (true) {
                    let count = tempFlags & TempFlags.CountMask;
                    tempFlags++;
                    // Skip over 'i' and 'n'
                    if (count !== 8 && count !== 13) {
                        let name = count < 26 ? "_" + String.fromCharCode(CharacterCodes.a + count) : "_" + (count - 26);
                        if (isUniqueName(name)) {
                            return name;
                        }
                    }
                }
            }

            // Generate a name that is unique within the current file and doesn't conflict with any names
            // in global scope. The name is formed by adding an '_n' suffix to the specified base name,
            // where n is a positive integer. Note that names generated by makeTempVariableName and
            // makeUniqueName are guaranteed to never conflict.
            function makeUniqueName(baseName: string): string {
                // Find the first unique 'name_n', where n is a positive number
                if (baseName.charCodeAt(baseName.length - 1) !== CharacterCodes._) {
                    baseName += "_";
                }
                let i = 1;
                while (true) {
                    let generatedName = baseName + i;
                    if (isUniqueName(generatedName)) {
                        return generatedNameSet[generatedName] = generatedName;
                    }
                    i++;
                }
            }

            function generateNameForModuleOrEnum(node: ModuleDeclaration | EnumDeclaration) {
                let name = node.name.text;
                // Use module/enum name itself if it is unique, otherwise make a unique variation
                return isUniqueLocalName(name, node) ? name : makeUniqueName(name);
            }

            function generateNameForImportOrExportDeclaration(node: ImportDeclaration | ExportDeclaration) {
                let expr = getExternalModuleName(node);
                let baseName = expr.kind === SyntaxKind.StringLiteral ?
                    escapeIdentifier(makeIdentifierFromModuleName((<LiteralExpression>expr).text)) : "module";
                return makeUniqueName(baseName);
            }

            function generateNameForExportDefault() {
                return makeUniqueName("default");
            }

            function generateNameForClassExpression() {
                return makeUniqueName("class");
            }

            function generateNameForNode(node: Node) {
                switch (node.kind) {
                    case SyntaxKind.Identifier:
                        return makeUniqueName((<Identifier>node).text);
                    case SyntaxKind.ModuleDeclaration:
                    case SyntaxKind.EnumDeclaration:
                        return (<ModuleDeclaration | EnumDeclaration>node).name.text;
                    case SyntaxKind.ImportDeclaration:
                    case SyntaxKind.ExportDeclaration:
                        return generateNameForImportOrExportDeclaration(<ImportDeclaration | ExportDeclaration>node);
                    case SyntaxKind.FunctionDeclaration:
                    case SyntaxKind.ClassDeclaration:
                    case SyntaxKind.ExportAssignment:
                        return generateNameForExportDefault();
                    case SyntaxKind.ClassExpression:
                        return generateNameForClassExpression();
                }
            }

            function tryGenerateNameForNode(node: Node): string {
                if (node.kind === SyntaxKind.Identifier ||
                    node.kind === SyntaxKind.ModuleDeclaration ||
                    node.kind === SyntaxKind.EnumDeclaration ||
                    node.kind === SyntaxKind.ImportDeclaration ||
                    node.kind === SyntaxKind.ExportDeclaration ||
                    node.kind === SyntaxKind.FunctionDeclaration ||
                    node.kind === SyntaxKind.ClassDeclaration ||
                    node.kind === SyntaxKind.ExportAssignment ||
                    node.kind === SyntaxKind.ClassExpression) {
                    return generateNameForNode(node);
                }

                return "";
            }

            function isModuleAlreadyGenerated(node: ModuleDeclaration): boolean {
                return ensureModule(node).generated;
            }

            function getGeneratedPathForModule(node: Node): string {
                let name: string;
                let moduleFullPath = getNodeParentPath(node);

                if ((<Declaration>node).name) {
                    let decalration = <Declaration>node;
                    let identifier = <Identifier>decalration.name;
                    name = identifier.text;
                }
                else {
                    name = tryGenerateNameForNode(node);
                }

                if (moduleFullPath) {
                    return moduleFullPath += "." + name;
                }

                return name;
            }

            function trySetVariableDeclarationInModule(node: Declaration): boolean {
                let module = ensureModule(node);
                let declarations = module.declarations;
                let name = (<Identifier>node.name).text;

                if (name in declarations) {
                    return false;
                }

                declarations[name] = true;
                return true;
            }

            function ensureModule(node: Declaration): ModuleGeneration {
                let scope = getSymbolScope(node);
                let moduleFullPath = scope && scope.kind !== SyntaxKind.SourceFile ? getGeneratedPathForModule(scope) : "global";

                moduleFullPath += ":" + (<Identifier>node.name).text;

                return modulesToGeneratedName[moduleFullPath] || (modulesToGeneratedName[moduleFullPath] = {
                    generated: false,
                    declarations: {}
                });
            }

            function setModuleGenerated(node: Declaration): void {
                let module = ensureModule(node);

                module.generated = true;
            }

            function getNodeParentPath(node: Node): string {
                let path: Array<string> = [];

                while (node = getContainingModule(node)) {
                    path.push(getGeneratedNameForNode(node));
                }

                return path.reverse().join(".");
            }

            function getGeneratedNameForNode(node: Node) {
                let id = getNodeId(node);
                return nodeToGeneratedName[id] || (nodeToGeneratedName[id] = unescapeIdentifier(generateNameForNode(node)));
            }

            function initializeEmitterWithSourceMaps() {
                let sourceMapDir: string; // The directory in which sourcemap will be

                // Current source map file and its index in the sources list
                let sourceMapSourceIndex = -1;

                // Names and its index map
                let sourceMapNameIndexMap: Map<number> = {};
                let sourceMapNameIndices: number[] = [];
                function getSourceMapNameIndex() {
                    return sourceMapNameIndices.length ? lastOrUndefined(sourceMapNameIndices) : -1;
                }

                // Last recorded and encoded spans
                let lastRecordedSourceMapSpan: SourceMapSpan;
                let lastEncodedSourceMapSpan: SourceMapSpan = {
                    emittedLine: 1,
                    emittedColumn: 1,
                    sourceLine: 1,
                    sourceColumn: 1,
                    sourceIndex: 0
                };
                let lastEncodedNameIndex = 0;

                // Encoding for sourcemap span
                function encodeLastRecordedSourceMapSpan() {
                    if (!lastRecordedSourceMapSpan || lastRecordedSourceMapSpan === lastEncodedSourceMapSpan) {
                        return;
                    }

                    let prevEncodedEmittedColumn = lastEncodedSourceMapSpan.emittedColumn;
                    // Line/Comma delimiters
                    if (lastEncodedSourceMapSpan.emittedLine === lastRecordedSourceMapSpan.emittedLine) {
                        // Emit comma to separate the entry
                        if (sourceMapData.sourceMapMappings) {
                            sourceMapData.sourceMapMappings += ",";
                        }
                    }
                    else {
                        // Emit line delimiters
                        for (let encodedLine = lastEncodedSourceMapSpan.emittedLine; encodedLine < lastRecordedSourceMapSpan.emittedLine; encodedLine++) {
                            sourceMapData.sourceMapMappings += ";";
                        }
                        prevEncodedEmittedColumn = 1;
                    }

                    // 1. Relative Column 0 based
                    sourceMapData.sourceMapMappings += base64VLQFormatEncode(lastRecordedSourceMapSpan.emittedColumn - prevEncodedEmittedColumn);

                    // 2. Relative sourceIndex
                    sourceMapData.sourceMapMappings += base64VLQFormatEncode(lastRecordedSourceMapSpan.sourceIndex - lastEncodedSourceMapSpan.sourceIndex);

                    // 3. Relative sourceLine 0 based
                    sourceMapData.sourceMapMappings += base64VLQFormatEncode(lastRecordedSourceMapSpan.sourceLine - lastEncodedSourceMapSpan.sourceLine);

                    // 4. Relative sourceColumn 0 based
                    sourceMapData.sourceMapMappings += base64VLQFormatEncode(lastRecordedSourceMapSpan.sourceColumn - lastEncodedSourceMapSpan.sourceColumn);

                    // 5. Relative namePosition 0 based
                    if (lastRecordedSourceMapSpan.nameIndex >= 0) {
                        sourceMapData.sourceMapMappings += base64VLQFormatEncode(lastRecordedSourceMapSpan.nameIndex - lastEncodedNameIndex);
                        lastEncodedNameIndex = lastRecordedSourceMapSpan.nameIndex;
                    }

                    lastEncodedSourceMapSpan = lastRecordedSourceMapSpan;
                    sourceMapData.sourceMapDecodedMappings.push(lastEncodedSourceMapSpan);

                    function base64VLQFormatEncode(inValue: number) {
                        function base64FormatEncode(inValue: number) {
                            if (inValue < 64) {
                                return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(inValue);
                            }
                            throw TypeError(inValue + ": not a 64 based value");
                        }

                        // Add a new least significant bit that has the sign of the value.
                        // if negative number the least significant bit that gets added to the number has value 1
                        // else least significant bit value that gets added is 0
                        // eg. -1 changes to binary : 01 [1] => 3
                        //     +1 changes to binary : 01 [0] => 2
                        if (inValue < 0) {
                            inValue = ((-inValue) << 1) + 1;
                        }
                        else {
                            inValue = inValue << 1;
                        }

                        // Encode 5 bits at a time starting from least significant bits
                        let encodedStr = "";
                        do {
                            let currentDigit = inValue & 31; // 11111
                            inValue = inValue >> 5;
                            if (inValue > 0) {
                                // There are still more digits to decode, set the msb (6th bit)
                                currentDigit = currentDigit | 32;
                            }
                            encodedStr = encodedStr + base64FormatEncode(currentDigit);
                        } while (inValue > 0);

                        return encodedStr;
                    }
                }

                function recordSourceMapSpan(pos: number) {
                    let sourceLinePos = getLineAndCharacterOfPosition(currentSourceFile, pos);

                    // Convert the location to be one-based.
                    sourceLinePos.line++;
                    sourceLinePos.character++;

                    let emittedLine = writer.getLine();
                    let emittedColumn = writer.getColumn();

                    // If this location wasn't recorded or the location in source is going backwards, record the span
                    if (!lastRecordedSourceMapSpan ||
                        lastRecordedSourceMapSpan.emittedLine !== emittedLine ||
                        lastRecordedSourceMapSpan.emittedColumn !== emittedColumn ||
                        (lastRecordedSourceMapSpan.sourceIndex === sourceMapSourceIndex &&
                            (lastRecordedSourceMapSpan.sourceLine > sourceLinePos.line ||
                                (lastRecordedSourceMapSpan.sourceLine === sourceLinePos.line && lastRecordedSourceMapSpan.sourceColumn > sourceLinePos.character)))) {
                        // Encode the last recordedSpan before assigning new
                        encodeLastRecordedSourceMapSpan();

                        // New span
                        lastRecordedSourceMapSpan = {
                            emittedLine: emittedLine,
                            emittedColumn: emittedColumn,
                            sourceLine: sourceLinePos.line,
                            sourceColumn: sourceLinePos.character,
                            nameIndex: getSourceMapNameIndex(),
                            sourceIndex: sourceMapSourceIndex
                        };
                    }
                    else {
                        // Take the new pos instead since there is no change in emittedLine and column since last location
                        lastRecordedSourceMapSpan.sourceLine = sourceLinePos.line;
                        lastRecordedSourceMapSpan.sourceColumn = sourceLinePos.character;
                        lastRecordedSourceMapSpan.sourceIndex = sourceMapSourceIndex;
                    }
                }

                function recordEmitNodeStartSpan(node: Node) {
                    // Get the token pos after skipping to the token (ignoring the leading trivia)
                    recordSourceMapSpan(skipTrivia(currentSourceFile.text, node.pos));
                }

                function recordEmitNodeEndSpan(node: Node) {
                    recordSourceMapSpan(node.end);
                }

                function writeTextWithSpanRecord(tokenKind: SyntaxKind, startPos: number, emitFn?: () => void) {
                    let tokenStartPos = ts.skipTrivia(currentSourceFile.text, startPos);
                    recordSourceMapSpan(tokenStartPos);
                    let tokenEndPos = emitTokenText(tokenKind, tokenStartPos, emitFn);
                    recordSourceMapSpan(tokenEndPos);
                    return tokenEndPos;
                }

                function recordNewSourceFileStart(node: SourceFile) {
                    // Add the file to tsFilePaths
                    // If sourceroot option: Use the relative path corresponding to the common directory path
                    // otherwise source locations relative to map file location
                    let sourcesDirectoryPath = compilerOptions.sourceRoot ? host.getCommonSourceDirectory() : sourceMapDir;

                    sourceMapData.sourceMapSources.push(getRelativePathToDirectoryOrUrl(sourcesDirectoryPath,
                        node.fileName,
                        host.getCurrentDirectory(),
                        host.getCanonicalFileName,
                        /*isAbsolutePathAnUrl*/ true));
                    sourceMapSourceIndex = sourceMapData.sourceMapSources.length - 1;
                    
                    // The one that can be used from program to get the actual source file
                    sourceMapData.inputSourceFileNames.push(node.fileName);

                    if (compilerOptions.inlineSources) {
                        if (!sourceMapData.sourceMapSourcesContent) {
                            sourceMapData.sourceMapSourcesContent = [];
                        }
                        sourceMapData.sourceMapSourcesContent.push(node.text);
                    }
                }

                function recordScopeNameOfNode(node: Node, scopeName?: string) {
                    function recordScopeNameIndex(scopeNameIndex: number) {
                        sourceMapNameIndices.push(scopeNameIndex);
                    }

                    function recordScopeNameStart(scopeName: string) {
                        let scopeNameIndex = -1;
                        if (scopeName) {
                            let parentIndex = getSourceMapNameIndex();
                            if (parentIndex !== -1) {
                                // Child scopes are always shown with a dot (even if they have no name),
                                // unless it is a computed property. Then it is shown with brackets,
                                // but the brackets are included in the name.
                                let name = (<Declaration>node).name;
                                if (!name || name.kind !== SyntaxKind.ComputedPropertyName) {
                                    scopeName = "." + scopeName;
                                }
                                scopeName = sourceMapData.sourceMapNames[parentIndex] + scopeName;
                            }

                            scopeNameIndex = getProperty(sourceMapNameIndexMap, scopeName);
                            if (scopeNameIndex === undefined) {
                                scopeNameIndex = sourceMapData.sourceMapNames.length;
                                sourceMapData.sourceMapNames.push(scopeName);
                                sourceMapNameIndexMap[scopeName] = scopeNameIndex;
                            }
                        }
                        recordScopeNameIndex(scopeNameIndex);
                    }

                    if (scopeName) {
                        // The scope was already given a name  use it
                        recordScopeNameStart(scopeName);
                    }
                    else if (node.kind === SyntaxKind.FunctionDeclaration ||
                        node.kind === SyntaxKind.FunctionExpression ||
                        node.kind === SyntaxKind.MethodDeclaration ||
                        node.kind === SyntaxKind.MethodSignature ||
                        node.kind === SyntaxKind.GetAccessor ||
                        node.kind === SyntaxKind.SetAccessor ||
                        node.kind === SyntaxKind.ModuleDeclaration ||
                        node.kind === SyntaxKind.ClassDeclaration ||
                        node.kind === SyntaxKind.EnumDeclaration) {
                        // Declaration and has associated name use it
                        if ((<Declaration>node).name) {
                            let name = (<Declaration>node).name;
                            // For computed property names, the text will include the brackets
                            scopeName = name.kind === SyntaxKind.ComputedPropertyName
                                ? getTextOfNode(name)
                                : (<Identifier>(<Declaration>node).name).text;
                        }
                        recordScopeNameStart(scopeName);
                    }
                    else {
                        // Block just use the name from upper level scope
                        recordScopeNameIndex(getSourceMapNameIndex());
                    }
                }

                function recordScopeNameEnd() {
                    sourceMapNameIndices.pop();
                };

                function writeCommentRangeWithMap(curentSourceFile: SourceFile, writer: EmitTextWriter, comment: CommentRange, newLine: string) {
                    recordSourceMapSpan(comment.pos);
                    writeCommentRange(currentSourceFile, writer, comment, newLine);
                    recordSourceMapSpan(comment.end);
                }

                function serializeSourceMapContents(version: number, file: string, sourceRoot: string, sources: string[], names: string[], mappings: string, sourcesContent?: string[]) {
                    if (typeof JSON !== "undefined") {
                        let map: any = {
                            version,
                            file,
                            sourceRoot,
                            sources,
                            names,
                            mappings
                        };

                        if (sourcesContent !== undefined) {
                            map.sourcesContent = sourcesContent;
                        }

                        return JSON.stringify(map);
                    }

                    return "{\"version\":" + version + ",\"file\":\"" + escapeString(file) + "\",\"sourceRoot\":\"" + escapeString(sourceRoot) + "\",\"sources\":[" + serializeStringArray(sources) + "],\"names\":[" + serializeStringArray(names) + "],\"mappings\":\"" + escapeString(mappings) + "\" " + (sourcesContent !== undefined ? ",\"sourcesContent\":[" + serializeStringArray(sourcesContent) + "]" : "") + "}";

                    function serializeStringArray(list: string[]): string {
                        let output = "";
                        for (let i = 0, n = list.length; i < n; i++) {
                            if (i) {
                                output += ",";
                            }
                            output += "\"" + escapeString(list[i]) + "\"";
                        }
                        return output;
                    }
                }

                function writeJavaScriptAndSourceMapFile(emitOutput: string, writeByteOrderMark: boolean) {
                    encodeLastRecordedSourceMapSpan();

                    let sourceMapText = serializeSourceMapContents(
                        3,
                        sourceMapData.sourceMapFile,
                        sourceMapData.sourceMapSourceRoot,
                        sourceMapData.sourceMapSources,
                        sourceMapData.sourceMapNames,
                        sourceMapData.sourceMapMappings,
                        sourceMapData.sourceMapSourcesContent);

                    sourceMapDataList.push(sourceMapData);

                    let sourceMapUrl: string;
                    if (compilerOptions.inlineSourceMap) {
                        // Encode the sourceMap into the sourceMap url
                        let base64SourceMapText = convertToBase64(sourceMapText);
                        sourceMapUrl = `//# sourceMappingURL=data:application/json;base64,${base64SourceMapText}`;
                    }
                    else {
                        // Write source map file
                        writeFile(host, diagnostics, sourceMapData.sourceMapFilePath, sourceMapText, /*writeByteOrderMark*/ false);
                        sourceMapUrl = `//# sourceMappingURL=${sourceMapData.jsSourceMappingURL}`;
                    }

                    // Write sourcemap url to the js file and write the js file
                    writeJavaScriptFile(emitOutput + sourceMapUrl, writeByteOrderMark);
                }

                // Initialize source map data
                let sourceMapJsFile = getBaseFileName(normalizeSlashes(jsFilePath));
                sourceMapData = {
                    sourceMapFilePath: jsFilePath + ".map",
                    jsSourceMappingURL: sourceMapJsFile + ".map",
                    sourceMapFile: sourceMapJsFile,
                    sourceMapSourceRoot: compilerOptions.sourceRoot || "",
                    sourceMapSources: [],
                    inputSourceFileNames: [],
                    sourceMapNames: [],
                    sourceMapMappings: "",
                    sourceMapSourcesContent: undefined,
                    sourceMapDecodedMappings: []
                };

                // Normalize source root and make sure it has trailing "/" so that it can be used to combine paths with the
                // relative paths of the sources list in the sourcemap
                sourceMapData.sourceMapSourceRoot = ts.normalizeSlashes(sourceMapData.sourceMapSourceRoot);
                if (sourceMapData.sourceMapSourceRoot.length && sourceMapData.sourceMapSourceRoot.charCodeAt(sourceMapData.sourceMapSourceRoot.length - 1) !== CharacterCodes.slash) {
                    sourceMapData.sourceMapSourceRoot += directorySeparator;
                }

                if (compilerOptions.mapRoot) {
                    sourceMapDir = normalizeSlashes(compilerOptions.mapRoot);
                    if (root) { // emitting single module file
                        // For modules or multiple emit files the mapRoot will have directory structure like the sources
                        // So if src\a.ts and src\lib\b.ts are compiled together user would be moving the maps into mapRoot\a.js.map and mapRoot\lib\b.js.map
                        sourceMapDir = getDirectoryPath(getSourceFilePathInNewDir(root, host, sourceMapDir));
                    }

                    if (!isRootedDiskPath(sourceMapDir) && !isUrl(sourceMapDir)) {
                        // The relative paths are relative to the common directory
                        sourceMapDir = combinePaths(host.getCommonSourceDirectory(), sourceMapDir);
                        sourceMapData.jsSourceMappingURL = getRelativePathToDirectoryOrUrl(
                            getDirectoryPath(normalizePath(jsFilePath)), // get the relative sourceMapDir path based on jsFilePath
                            combinePaths(sourceMapDir, sourceMapData.jsSourceMappingURL), // this is where user expects to see sourceMap
                            host.getCurrentDirectory(),
                            host.getCanonicalFileName,
                            /*isAbsolutePathAnUrl*/ true);
                    }
                    else {
                        sourceMapData.jsSourceMappingURL = combinePaths(sourceMapDir, sourceMapData.jsSourceMappingURL);
                    }
                }
                else {
                    sourceMapDir = getDirectoryPath(normalizePath(jsFilePath));
                }

                function emitNodeWithSourceMap(node: Node) {
                    if (node) {
                        if (nodeIsSynthesized(node)) {
                            return emitNodeWithoutSourceMap(node);
                        }
                        if (node.kind !== SyntaxKind.SourceFile) {
                            recordEmitNodeStartSpan(node);
                            emitNodeWithoutSourceMap(node);
                            recordEmitNodeEndSpan(node);
                        }
                        else {
                            recordNewSourceFileStart(<SourceFile>node);
                            emitNodeWithoutSourceMap(node);
                        }
                    }
                }

                function emitNodeWithCommentsAndWithSourcemap(node: Node) {
                    emitNodeConsideringCommentsOption(node, emitNodeWithSourceMap);
                }

                writeEmittedFiles = writeJavaScriptAndSourceMapFile;
                emit = emitNodeWithCommentsAndWithSourcemap;
                emitStart = recordEmitNodeStartSpan;
                emitEnd = recordEmitNodeEndSpan;
                emitToken = writeTextWithSpanRecord;
                scopeEmitStart = recordScopeNameOfNode;
                scopeEmitEnd = recordScopeNameEnd;
                writeComment = writeCommentRangeWithMap;
            }

            function writeJavaScriptFile(emitOutput: string, writeByteOrderMark: boolean) {
                writeFile(host, diagnostics, jsFilePath, emitOutput, writeByteOrderMark);
            }

            // Create a temporary variable with a unique unused name.
            function createTempVariable(flags: TempFlags): Identifier {
                let result = <Identifier>createSynthesizedNode(SyntaxKind.Identifier);
                result.text = makeTempVariableName(flags);
                return result;
            }

            function recordTempDeclaration(name: Identifier): void {
                if (!tempVariables) {
                    tempVariables = [];
                }
                tempVariables.push(name);
            }

            function createAndRecordTempVariable(flags: TempFlags): Identifier {
                let temp = createTempVariable(flags);
                recordTempDeclaration(temp);

                return temp;
            }

            function emitTempDeclarations(newLine: boolean) {
                if (tempVariables) {
                    if (newLine) {
                        writeLine();
                    }
                    else {
                        write(" ");
                    }
                    write("var ");
                    emitCommaList(tempVariables);
                    write(";");
                }
            }

            function emitTokenText(tokenKind: SyntaxKind, startPos: number, emitFn?: () => void) {
                let tokenString = tokenToString(tokenKind);
                if (emitFn) {
                    emitFn();
                }
                else {
                    write(tokenString);
                }
                return startPos + tokenString.length;
            }

            function emitOptional(prefix: string, node: Node) {
                if (node) {
                    write(prefix);
                    emit(node);
                }
            }

            function emitParenthesizedIf(node: Node, parenthesized: boolean) {
                if (parenthesized) {
                    write("(");
                }
                emit(node);
                if (parenthesized) {
                    write(")");
                }
            }

            function emitTrailingCommaIfPresent(nodeList: NodeArray<Node>): void {
                if (nodeList.hasTrailingComma) {
                    write(",");
                }
            }

            function emitLinePreservingList(parent: Node, nodes: NodeArray<Node>, allowTrailingComma: boolean, spacesBetweenBraces: boolean) {
                Debug.assert(nodes.length > 0);

                increaseIndent();

                if (nodeStartPositionsAreOnSameLine(parent, nodes[0])) {
                    if (spacesBetweenBraces) {
                        write(" ");
                    }
                }
                else {
                    writeLine();
                }

                for (let i = 0, n = nodes.length; i < n; i++) {
                    if (i) {
                        if (nodeEndIsOnSameLineAsNodeStart(nodes[i - 1], nodes[i])) {
                            write(", ");
                        }
                        else {
                            write(",");
                            writeLine();
                        }
                    }

                    emit(nodes[i]);
                }

                if (nodes.hasTrailingComma && allowTrailingComma) {
                    write(",");
                }

                decreaseIndent();

                if (nodeEndPositionsAreOnSameLine(parent, lastOrUndefined(nodes))) {
                    if (spacesBetweenBraces) {
                        write(" ");
                    }
                }
                else {
                    writeLine();
                }
            }

            function emitList<TNode extends Node>(nodes: TNode[], start: number, count: number, multiLine: boolean, trailingComma: boolean, leadingComma?: boolean, noTrailingNewLine?: boolean, emitNode?: (node: TNode) => void): number {
                if (!emitNode) {
                    emitNode = emit;
                }

                for (let i = 0; i < count; i++) {
                    var node: Node = nodes[start + i];

                    if (i > 0 && node.kind === SyntaxKind.VariableDeclaration) {
                        write(";");
                        forceWriteLine();
                        if (node.kind !== SyntaxKind.Parameter) {
                            emitVariableTypeAnnotation(<VariableDeclaration>node);
                        }
                        write("var ");
                    }
                    else if (i || leadingComma) {
                        write(", ");
                    }
                    // This emitting is to make sure we emit following comment properly
                    //   ...(x, /*comment1*/ y)...
                    //         ^ => node.pos
                    // "comment1" is not considered leading comment for "y" but rather
                    // considered as trailing comment of the previous node.
                    emitTrailingCommentsOfPosition(node.pos);
                    if (node.kind !== SyntaxKind.PropertyAccessExpression) {
                        emitModuleIfNeeded(node);
                    }
                    emitNode(<TNode>node);
                    leadingComma = true;
                }
                if (trailingComma) {
                    write(",");
                }
                if (multiLine && !noTrailingNewLine) {
                    writeLine();
                }

                return count;
            }

            function emitCommaList(nodes: Node[]) {
                if (nodes) {
                    emitList(nodes, 0, nodes.length, /*multiline*/ false, /*trailingComma*/ false);
                }
            }

            function emitLines(nodes: Node[], postfix?: (Node: Node, index: number) => void) {
                emitLinesStartingAt(nodes, /*startIndex*/ 0, postfix);
            }

            function emitLinesStartingAt(nodes: Node[], startIndex: number, postfix?: (Node: Node, index: number) => void): void {
                for (let i = startIndex; i < nodes.length; i++) {
                    let node = nodes[i];

                    writeLine();
                    emit(node);

                    if (postfix) {
                        postfix(node, i);
                    }
                }
            }

            function isBinaryOrOctalIntegerLiteral(node: LiteralExpression, text: string): boolean {
                if (node.kind === SyntaxKind.NumericLiteral && text.length > 1) {
                    switch (text.charCodeAt(1)) {
                        case CharacterCodes.b:
                        case CharacterCodes.B:
                        case CharacterCodes.o:
                        case CharacterCodes.O:
                            return true;
                    }
                }

                return false;
            }

            function emitLiteral(node: LiteralExpression) {
                let text = getLiteralText(node);

                if ((compilerOptions.sourceMap || compilerOptions.inlineSourceMap) && (node.kind === SyntaxKind.StringLiteral || isTemplateLiteralKind(node.kind))) {
                    writer.writeLiteral(text);
                }
                // For versions below ES6, emit binary & octal literals in their canonical decimal form.
                else if (languageVersion < ScriptTarget.ES6 && isBinaryOrOctalIntegerLiteral(node, text)) {
                    write(node.text);
                }
                else {
                    write(text);
                }
            }

            function getLiteralText(node: LiteralExpression) {
                // Any template literal or string literal with an extended escape
                // (e.g. "\u{0067}") will need to be downleveled as a escaped string literal.
                if (languageVersion < ScriptTarget.ES6 && (isTemplateLiteralKind(node.kind) || node.hasExtendedUnicodeEscape)) {
                    return getQuotedEscapedLiteralText("\"", node.text, "\"");
                }

                // If we don't need to downlevel and we can reach the original source text using
                // the node's parent reference, then simply get the text as it was originally written.
                if (node.parent) {
                    return getSourceTextOfNodeFromSourceFile(currentSourceFile, node);
                }

                // If we can't reach the original source text, use the canonical form if it's a number,
                // or an escaped quoted form of the original text if it's string-like.
                switch (node.kind) {
                    case SyntaxKind.StringLiteral:
                        return getQuotedEscapedLiteralText("\"", node.text, "\"");
                    case SyntaxKind.NoSubstitutionTemplateLiteral:
                        return getQuotedEscapedLiteralText("`", node.text, "`");
                    case SyntaxKind.TemplateHead:
                        return getQuotedEscapedLiteralText("`", node.text, "${");
                    case SyntaxKind.TemplateMiddle:
                        return getQuotedEscapedLiteralText("}", node.text, "${");
                    case SyntaxKind.TemplateTail:
                        return getQuotedEscapedLiteralText("}", node.text, "`");
                    case SyntaxKind.NumericLiteral:
                        return node.text;
                }

                Debug.fail(`Literal kind '${node.kind}' not accounted for.`);
            }

            function getQuotedEscapedLiteralText(leftQuote: string, text: string, rightQuote: string) {
                return leftQuote + escapeNonAsciiCharacters(escapeString(text)) + rightQuote;
            }

            function emitDownlevelRawTemplateLiteral(node: LiteralExpression) {
                // Find original source text, since we need to emit the raw strings of the tagged template.
                // The raw strings contain the (escaped) strings of what the user wrote.
                // Examples: `\n` is converted to "\\n", a template string with a newline to "\n".
                let text = getSourceTextOfNodeFromSourceFile(currentSourceFile, node);

                // text contains the original source, it will also contain quotes ("`"), dolar signs and braces ("${" and "}"),
                // thus we need to remove those characters.
                // First template piece starts with "`", others with "}"
                // Last template piece ends with "`", others with "${"
                let isLast = node.kind === SyntaxKind.NoSubstitutionTemplateLiteral || node.kind === SyntaxKind.TemplateTail;
                text = text.substring(1, text.length - (isLast ? 1 : 2));

                // Newline normalization:
                // ES6 Spec 11.8.6.1 - Static Semantics of TV's and TRV's
                // <CR><LF> and <CR> LineTerminatorSequences are normalized to <LF> for both TV and TRV.
                text = text.replace(/\r\n?/g, "\n");
                text = escapeString(text);

                write(`"${text}"`);
            }

            function emitDownlevelTaggedTemplateArray(node: TaggedTemplateExpression, literalEmitter: (literal: LiteralExpression) => void) {
                write("[");
                if (node.template.kind === SyntaxKind.NoSubstitutionTemplateLiteral) {
                    literalEmitter(<LiteralExpression>node.template);
                }
                else {
                    literalEmitter((<TemplateExpression>node.template).head);
                    forEach((<TemplateExpression>node.template).templateSpans, (child) => {
                        write(", ");
                        literalEmitter(child.literal);
                    });
                }
                write("]");
            }

            function emitDownlevelTaggedTemplate(node: TaggedTemplateExpression) {
                let tempVariable = createAndRecordTempVariable(TempFlags.Auto);
                write("(");
                emit(tempVariable);
                write(" = ");
                emitDownlevelTaggedTemplateArray(node, emit);
                write(", ");

                emit(tempVariable);
                write(".raw = ");
                emitDownlevelTaggedTemplateArray(node, emitDownlevelRawTemplateLiteral);
                write(", ");

                emitParenthesizedIf(node.tag, needsParenthesisForPropertyAccessOrInvocation(node.tag));
                write("(");
                emit(tempVariable);

                // Now we emit the expressions
                if (node.template.kind === SyntaxKind.TemplateExpression) {
                    forEach((<TemplateExpression>node.template).templateSpans, templateSpan => {
                        write(", ");
                        let needsParens = templateSpan.expression.kind === SyntaxKind.BinaryExpression
                            && (<BinaryExpression>templateSpan.expression).operatorToken.kind === SyntaxKind.CommaToken;
                        emitParenthesizedIf(templateSpan.expression, needsParens);
                    });
                }
                write("))");
            }

            function emitTemplateExpression(node: TemplateExpression): void {
                // In ES6 mode and above, we can simply emit each portion of a template in order, but in
                // ES3 & ES5 we must convert the template expression into a series of string concatenations.
                if (languageVersion >= ScriptTarget.ES6) {
                    forEachChild(node, emit);
                    return;
                }

                let emitOuterParens = isExpression(node.parent)
                    && templateNeedsParens(node, <Expression>node.parent);

                if (emitOuterParens) {
                    write("(");
                }

                let headEmitted = false;
                if (shouldEmitTemplateHead()) {
                    emitLiteral(node.head);
                    headEmitted = true;
                }

                for (let i = 0, n = node.templateSpans.length; i < n; i++) {
                    let templateSpan = node.templateSpans[i];

                    // Check if the expression has operands and binds its operands less closely than binary '+'.
                    // If it does, we need to wrap the expression in parentheses. Otherwise, something like
                    //    `abc${ 1 << 2 }`
                    // becomes
                    //    "abc" + 1 << 2 + ""
                    // which is really
                    //    ("abc" + 1) << (2 + "")
                    // rather than
                    //    "abc" + (1 << 2) + ""
                    let needsParens = templateSpan.expression.kind !== SyntaxKind.ParenthesizedExpression
                        && comparePrecedenceToBinaryPlus(templateSpan.expression) !== Comparison.GreaterThan;

                    if (i > 0 || headEmitted) {
                        // If this is the first span and the head was not emitted, then this templateSpan's
                        // expression will be the first to be emitted. Don't emit the preceding ' + ' in that
                        // case.
                        write(" + ");
                    }

                    emitParenthesizedIf(templateSpan.expression, needsParens);

                    // Only emit if the literal is non-empty.
                    // The binary '+' operator is left-associative, so the first string concatenation
                    // with the head will force the result up to this point to be a string.
                    // Emitting a '+ ""' has no semantic effect for middles and tails.
                    if (templateSpan.literal.text.length !== 0) {
                        write(" + ");
                        emitLiteral(templateSpan.literal);
                    }
                }

                if (emitOuterParens) {
                    write(")");
                }

                function shouldEmitTemplateHead() {
                    // If this expression has an empty head literal and the first template span has a non-empty
                    // literal, then emitting the empty head literal is not necessary.
                    //     `${ foo } and ${ bar }`
                    // can be emitted as
                    //     foo + " and " + bar
                    // This is because it is only required that one of the first two operands in the emit
                    // output must be a string literal, so that the other operand and all following operands
                    // are forced into strings.
                    //
                    // If the first template span has an empty literal, then the head must still be emitted.
                    //     `${ foo }${ bar }`
                    // must still be emitted as
                    //     "" + foo + bar

                    // There is always atleast one templateSpan in this code path, since
                    // NoSubstitutionTemplateLiterals are directly emitted via emitLiteral()
                    Debug.assert(node.templateSpans.length !== 0);

                    return node.head.text.length !== 0 || node.templateSpans[0].literal.text.length === 0;
                }

                function templateNeedsParens(template: TemplateExpression, parent: Expression) {
                    switch (parent.kind) {
                        case SyntaxKind.CallExpression:
                        case SyntaxKind.NewExpression:
                            return (<CallExpression>parent).expression === template;
                        case SyntaxKind.TaggedTemplateExpression:
                        case SyntaxKind.ParenthesizedExpression:
                            return false;
                        default:
                            return comparePrecedenceToBinaryPlus(parent) !== Comparison.LessThan;
                    }
                }

                /**
                 * Returns whether the expression has lesser, greater,
                 * or equal precedence to the binary '+' operator
                 */
                function comparePrecedenceToBinaryPlus(expression: Expression): Comparison {
                    // All binary expressions have lower precedence than '+' apart from '*', '/', and '%'
                    // which have greater precedence and '-' which has equal precedence.
                    // All unary operators have a higher precedence apart from yield.
                    // Arrow functions and conditionals have a lower precedence,
                    // although we convert the former into regular function expressions in ES5 mode,
                    // and in ES6 mode this function won't get called anyway.
                    //
                    // TODO (drosen): Note that we need to account for the upcoming 'yield' and
                    //                spread ('...') unary operators that are anticipated for ES6.
                    switch (expression.kind) {
                        case SyntaxKind.BinaryExpression:
                            switch ((<BinaryExpression>expression).operatorToken.kind) {
                                case SyntaxKind.AsteriskToken:
                                case SyntaxKind.SlashToken:
                                case SyntaxKind.PercentToken:
                                    return Comparison.GreaterThan;
                                case SyntaxKind.PlusToken:
                                case SyntaxKind.MinusToken:
                                    return Comparison.EqualTo;
                                default:
                                    return Comparison.LessThan;
                            }
                        case SyntaxKind.YieldExpression:
                        case SyntaxKind.ConditionalExpression:
                            return Comparison.LessThan;
                        default:
                            return Comparison.GreaterThan;
                    }
                }
            }

            function emitTemplateSpan(span: TemplateSpan) {
                emit(span.expression);
                emit(span.literal);
            }

            function jsxEmitReact(node: JsxElement | JsxSelfClosingElement) {
                /// Emit a tag name, which is either '"div"' for lower-cased names, or
                /// 'Div' for upper-cased or dotted names
                function emitTagName(name: Identifier | QualifiedName) {
                    if (name.kind === SyntaxKind.Identifier && isIntrinsicJsxName((<Identifier>name).text)) {
                        write("\"");
                        emit(name);
                        write("\"");
                    }
                    else {
                        emit(name);
                    }
                }

                /// Emit an attribute name, which is quoted if it needs to be quoted. Because
                /// these emit into an object literal property name, we don't need to be worried
                /// about keywords, just non-identifier characters
                function emitAttributeName(name: Identifier) {
                    if (/[A-Za-z_]+[\w*]/.test(name.text)) {
                        write("\"");
                        emit(name);
                        write("\"");
                    }
                    else {
                        emit(name);
                    }
                }

                /// Emit an name/value pair for an attribute (e.g. "x: 3")
                function emitJsxAttribute(node: JsxAttribute) {
                    emitAttributeName(node.name);
                    write(": ");
                    if (node.initializer) {
                        emit(node.initializer);
                    }
                    else {
                        write("true");
                    }
                }

                function emitJsxElement(openingNode: JsxOpeningLikeElement, children?: JsxChild[]) {
                    let syntheticReactRef = <Identifier>createSynthesizedNode(SyntaxKind.Identifier);
                    syntheticReactRef.text = "React";
                    syntheticReactRef.parent = openingNode;

                    // Call React.createElement(tag, ...
                    emitLeadingComments(openingNode);
                    emitExpressionIdentifier(syntheticReactRef);
                    write(".createElement(");
                    emitTagName(openingNode.tagName);
                    write(", ");

                    // Attribute list
                    if (openingNode.attributes.length === 0) {
                        // When there are no attributes, React wants "null"
                        write("null");
                    }
                    else {
                        // Either emit one big object literal (no spread attribs), or
                        // a call to React.__spread
                        let attrs = openingNode.attributes;
                        if (forEach(attrs, attr => attr.kind === SyntaxKind.JsxSpreadAttribute)) {
                            emitExpressionIdentifier(syntheticReactRef);
                            write(".__spread(");

                            let haveOpenedObjectLiteral = false;
                            for (let i = 0; i < attrs.length; i++) {
                                if (attrs[i].kind === SyntaxKind.JsxSpreadAttribute) {
                                    // If this is the first argument, we need to emit a {} as the first argument
                                    if (i === 0) {
                                        write("{}, ");
                                    }

                                    if (haveOpenedObjectLiteral) {
                                        write("}");
                                        haveOpenedObjectLiteral = false;
                                    }
                                    if (i > 0) {
                                        write(", ");
                                    }
                                    emit((<JsxSpreadAttribute>attrs[i]).expression);
                                }
                                else {
                                    Debug.assert(attrs[i].kind === SyntaxKind.JsxAttribute);
                                    if (haveOpenedObjectLiteral) {
                                        write(", ");
                                    }
                                    else {
                                        haveOpenedObjectLiteral = true;
                                        if (i > 0) {
                                            write(", ");
                                        }
                                        write("{");
                                    }
                                    emitJsxAttribute(<JsxAttribute>attrs[i]);
                                }
                            }
                            if (haveOpenedObjectLiteral) write("}");

                            write(")"); // closing paren to React.__spread(
                        }
                        else {
                            // One object literal with all the attributes in them
                            write("{");
                            for (var i = 0; i < attrs.length; i++) {
                                if (i > 0) {
                                    write(", ");
                                }
                                emitJsxAttribute(<JsxAttribute>attrs[i]);
                            }
                            write("}");
                        }
                    }

                    // Children
                    if (children) {
                        for (var i = 0; i < children.length; i++) {
                            // Don't emit empty expressions
                            if (children[i].kind === SyntaxKind.JsxExpression && !((<JsxExpression>children[i]).expression)) {
                                continue;
                            }

                            // Don't emit empty strings
                            if (children[i].kind === SyntaxKind.JsxText) {
                                let text = getTextToEmit(<JsxText>children[i]);
                                if (text !== undefined) {
                                    write(", \"");
                                    write(text);
                                    write("\"");
                                }
                            }
                            else {
                                write(", ");
                                emit(children[i]);
                            }

                        }
                    }

                    // Closing paren
                    write(")"); // closes "React.createElement("
                    emitTrailingComments(openingNode);
                }

                if (node.kind === SyntaxKind.JsxElement) {
                    emitJsxElement((<JsxElement>node).openingElement, (<JsxElement>node).children);
                }
                else {
                    Debug.assert(node.kind === SyntaxKind.JsxSelfClosingElement);
                    emitJsxElement(<JsxSelfClosingElement>node);
                }
            }

            function jsxEmitPreserve(node: JsxElement | JsxSelfClosingElement) {
                function emitJsxAttribute(node: JsxAttribute) {
                    emit(node.name);
                    if (node.initializer) {
                        write("=");
                        emit(node.initializer);
                    }
                }

                function emitJsxSpreadAttribute(node: JsxSpreadAttribute) {
                    write("{...");
                    emit(node.expression);
                    write("}");
                }

                function emitAttributes(attribs: NodeArray<JsxAttribute | JsxSpreadAttribute>) {
                    for (let i = 0, n = attribs.length; i < n; i++) {
                        if (i > 0) {
                            write(" ");
                        }

                        if (attribs[i].kind === SyntaxKind.JsxSpreadAttribute) {
                            emitJsxSpreadAttribute(<JsxSpreadAttribute>attribs[i]);
                        }
                        else {
                            Debug.assert(attribs[i].kind === SyntaxKind.JsxAttribute);
                            emitJsxAttribute(<JsxAttribute>attribs[i]);
                        }
                    }
                }

                function emitJsxOpeningOrSelfClosingElement(node: JsxOpeningElement | JsxSelfClosingElement) {
                    write("<");
                    emit(node.tagName);
                    if (node.attributes.length > 0 || (node.kind === SyntaxKind.JsxSelfClosingElement)) {
                        write(" ");
                    }

                    emitAttributes(node.attributes);

                    if (node.kind === SyntaxKind.JsxSelfClosingElement) {
                        write("/>");
                    }
                    else {
                        write(">");
                    }
                }

                function emitJsxClosingElement(node: JsxClosingElement) {
                    write("</");
                    emit(node.tagName);
                    write(">");
                }

                function emitJsxElement(node: JsxElement) {
                    emitJsxOpeningOrSelfClosingElement(node.openingElement);

                    for (var i = 0, n = node.children.length; i < n; i++) {
                        emit(node.children[i]);
                    }

                    emitJsxClosingElement(node.closingElement);
                }

                if (node.kind === SyntaxKind.JsxElement) {
                    emitJsxElement(<JsxElement>node);
                }
                else {
                    Debug.assert(node.kind === SyntaxKind.JsxSelfClosingElement);
                    emitJsxOpeningOrSelfClosingElement(<JsxSelfClosingElement>node);
                }
            }

            // This function specifically handles numeric/string literals for enum and accessor 'identifiers'.
            // In a sense, it does not actually emit identifiers as much as it declares a name for a specific property.
            // For example, this is utilized when feeding in a result to Object.defineProperty.
            function emitExpressionForPropertyName(node: DeclarationName) {
                Debug.assert(node.kind !== SyntaxKind.BindingElement);

                if (node.kind === SyntaxKind.StringLiteral) {
                    emitLiteral(<LiteralExpression>node);
                }
                else if (node.kind === SyntaxKind.ComputedPropertyName) {
                    // if this is a decorated computed property, we will need to capture the result
                    // of the property expression so that we can apply decorators later. This is to ensure
                    // we don't introduce unintended side effects:
                    //
                    //   class C {
                    //     [_a = x]() { }
                    //   }
                    //
                    // The emit for the decorated computed property decorator is:
                    //
                    //   __decorate([dec], C.prototype, _a, Object.getOwnPropertyDescriptor(C.prototype, _a));
                    //
                    if (nodeIsDecorated(node.parent)) {
                        if (!computedPropertyNamesToGeneratedNames) {
                            computedPropertyNamesToGeneratedNames = [];
                        }

                        let generatedName = computedPropertyNamesToGeneratedNames[getNodeId(node)];
                        if (generatedName) {
                            // we have already generated a variable for this node, write that value instead.
                            write(generatedName);
                            return;
                        }

                        generatedName = createAndRecordTempVariable(TempFlags.Auto).text;
                        computedPropertyNamesToGeneratedNames[getNodeId(node)] = generatedName;
                        write(generatedName);
                        write(" = ");
                    }

                    emit((<ComputedPropertyName>node).expression);
                }
                else {
                    if (node.kind === SyntaxKind.NumericLiteral) {
                        write((<LiteralExpression>node).text);
                    }
                    else {
                        writeTextOfNode(currentSourceFile, node);
                    }
                }
            }

            function isExpressionIdentifier(node: Node): boolean {
                let parent = node.parent;
                switch (parent.kind) {
                    case SyntaxKind.ArrayLiteralExpression:
                    case SyntaxKind.AsExpression:
                    case SyntaxKind.BinaryExpression:
                    case SyntaxKind.CallExpression:
                    case SyntaxKind.CaseClause:
                    case SyntaxKind.ComputedPropertyName:
                    case SyntaxKind.ConditionalExpression:
                    case SyntaxKind.Decorator:
                    case SyntaxKind.DeleteExpression:
                    case SyntaxKind.DoStatement:
                    case SyntaxKind.ElementAccessExpression:
                    case SyntaxKind.ExportAssignment:
                    case SyntaxKind.ExpressionStatement:
                    case SyntaxKind.ExpressionWithTypeArguments:
                    case SyntaxKind.ForStatement:
                    case SyntaxKind.ForInStatement:
                    case SyntaxKind.ForOfStatement:
                    case SyntaxKind.IfStatement:
                    case SyntaxKind.JsxSelfClosingElement:
                    case SyntaxKind.JsxOpeningElement:
                    case SyntaxKind.JsxSpreadAttribute:
                    case SyntaxKind.JsxExpression:
                    case SyntaxKind.NewExpression:
                    case SyntaxKind.ParenthesizedExpression:
                    case SyntaxKind.PostfixUnaryExpression:
                    case SyntaxKind.PrefixUnaryExpression:
                    case SyntaxKind.ReturnStatement:
                    case SyntaxKind.ShorthandPropertyAssignment:
                    case SyntaxKind.SpreadElementExpression:
                    case SyntaxKind.SwitchStatement:
                    case SyntaxKind.TaggedTemplateExpression:
                    case SyntaxKind.TemplateSpan:
                    case SyntaxKind.ThrowStatement:
                    case SyntaxKind.TypeAssertionExpression:
                    case SyntaxKind.TypeOfExpression:
                    case SyntaxKind.VoidExpression:
                    case SyntaxKind.WhileStatement:
                    case SyntaxKind.WithStatement:
                    case SyntaxKind.YieldExpression:
                        return true;
                    case SyntaxKind.BindingElement:
                    case SyntaxKind.EnumMember:
                    case SyntaxKind.Parameter:
                    case SyntaxKind.PropertyAssignment:
                    case SyntaxKind.PropertyDeclaration:
                    case SyntaxKind.VariableDeclaration:
                        return (<BindingElement | EnumMember | ParameterDeclaration | PropertyAssignment | PropertyDeclaration | VariableDeclaration>parent).initializer === node;
                    case SyntaxKind.PropertyAccessExpression:
                        return (<ExpressionStatement>parent).expression === node;
                    case SyntaxKind.ArrowFunction:
                    case SyntaxKind.FunctionExpression:
                        return (<FunctionLikeDeclaration>parent).body === node;
                    case SyntaxKind.ImportEqualsDeclaration:
                        return (<ImportEqualsDeclaration>parent).moduleReference === node;
                    case SyntaxKind.QualifiedName:
                        return (<QualifiedName>parent).left === node;
                }
                return false;
            }

            function emitExpressionIdentifier(node: Identifier) {
                if (resolver.getNodeCheckFlags(node) & NodeCheckFlags.LexicalArguments) {
                    write("_arguments");
                    return;
                }

                let container = resolver.getReferencedExportContainer(node);
                if (container) {
                    if (container.kind === SyntaxKind.SourceFile) {
                        // Identifier references module export
                        if (modulekind !== ModuleKind.ES6 && modulekind !== ModuleKind.System) {
                            write("exports.");
                        }
                    }
                }
                else {
                    if (modulekind !== ModuleKind.ES6) {
                        let declaration = resolver.getReferencedImportDeclaration(node);
                        if (declaration) {
                            if (declaration.kind === SyntaxKind.ImportClause) {
                                // Identifier references default import
                                write(getGeneratedNameForNode(<ImportDeclaration>declaration.parent));
                                write(languageVersion === ScriptTarget.ES3 ? "[\"default\"]" : ".default");
                                return;
                            }
                            else if (declaration.kind === SyntaxKind.ImportSpecifier) {
                                // Identifier references named import
                                let name = (<ImportSpecifier>declaration).propertyName || (<ImportSpecifier>declaration).name;
                                let identifier = getSourceTextOfNodeFromSourceFile(currentSourceFile, name);
                                if (languageVersion === ScriptTarget.ES3 && identifier === "default") {
                                    write(`["default"]`);
                                }
                                else {
                                    write(identifier);
                                }
                                return;
                            }
                        }
                    }

                    if (languageVersion !== ScriptTarget.ES6) {
                        let declaration = resolver.getReferencedNestedRedeclaration(node);
                        if (declaration) {
                            write(getGeneratedNameForNode(declaration.name));
                            return;
                        }
                    }
                }

                if (nodeIsSynthesized(node)) {
                    write(node.text);
                }
                else {
                    writeTextOfNode(currentSourceFile, node);
                }
            }

            function isNameOfNestedRedeclaration(node: Identifier) {
                if (languageVersion < ScriptTarget.ES6) {
                    let parent = node.parent;
                    switch (parent.kind) {
                        case SyntaxKind.BindingElement:
                        case SyntaxKind.ClassDeclaration:
                        case SyntaxKind.EnumDeclaration:
                        case SyntaxKind.VariableDeclaration:
                            return (<Declaration>parent).name === node && resolver.isNestedRedeclaration(<Declaration>parent);
                    }
                }
                return false;
            }

            function getImmediateContainerNode(node: Node): Declaration {
                while (true) {
                    node = node.parent;
                    if (!node) {
                        return undefined;
                    }
                    switch (node.kind) {
                        case SyntaxKind.SourceFile:
                        case SyntaxKind.Constructor:
                        case SyntaxKind.MethodDeclaration:
                        case SyntaxKind.MethodSignature:
                        case SyntaxKind.FunctionDeclaration:
                        case SyntaxKind.FunctionExpression:
                        case SyntaxKind.GetAccessor:
                        case SyntaxKind.SetAccessor:
                        case SyntaxKind.ClassDeclaration:
                        case SyntaxKind.InterfaceDeclaration:
                        case SyntaxKind.EnumDeclaration:
                        case SyntaxKind.ModuleDeclaration:
                            return <Declaration>node;
                    }
                }
            }

            function getSymbolScope(node: Node): Node {
                var result = getSymbolAndScope(node);

                if (result) {
                    return result.scope;
                }

                return null;
            }

            function getSymbolDeclaration(node): Node {
                var result = getSymbolAndScope(node);

                if (result) {
                    return result.node;
                }

                return null;
            }

            function getSymbolAndScope(node: Node): { scope: Node, node: Node } {
                let _node = node;
                let kind = node.kind;
                let containingNode: Node;
                let isDefinedInTopLevelClass = false;
                let statements: NodeArray<Statement | ClassElement>;
                let declarationList: Array<Declaration | Statement | Expression> = [];

                function filter(d: Declaration | Statement): boolean {
                    let symbolName = d.symbol ? d.symbol.name : "";

                    return symbolName === getNodeName(node);
                }

                if (node.kind === SyntaxKind.VariableStatement) {
                    node = (<VariableStatement>node).declarationList.declarations[0];
                }
                else if (node.kind === SyntaxKind.PropertyAccessExpression) {
                    isDefinedInTopLevelClass = (<PropertyAccessExpression>node).expression.kind === SyntaxKind.ThisKeyword;
                }

                while (containingNode = getImmediateContainerNode(_node)) {
                    if (containingNode.kind === SyntaxKind.SourceFile || containingNode.kind === SyntaxKind.ModuleDeclaration) {
                        let nodeName = getNodeName(node);
                        let localNode: any = containingNode.locals[nodeName];

                        if (containingNode.kind === SyntaxKind.SourceFile || (containingNode.kind === SyntaxKind.ModuleDeclaration && localNode)) {
                            return {
                                scope: containingNode,
                                node: localNode ? localNode.declarations ? localNode.declarations[0] : void 0 : void 0
                            };
                        }
                    }

                    if (containingNode.kind === SyntaxKind.ClassDeclaration || ts.isFunctionLike(containingNode)) {
                        let declarations: Array<Declaration>;

                        if (containingNode.kind === SyntaxKind.ClassDeclaration) {
                            declarations = (<ClassDeclaration>containingNode).members;
                        }

                        declarations = declarations || containingNode.symbol.getDeclarations();

                        for (let i = 0; i < declarations.length; i++) {
                            let declaration = <FunctionLikeDeclaration | ModuleDeclaration>declarations[i];
                            let body = <Block | ModuleBlock>declaration.body;

                            if (body) {
                                statements = body.statements;
                            }
                            else if (containingNode.kind === SyntaxKind.ClassDeclaration) {
                                statements = (<ClassDeclaration>containingNode).members;
                            }

                            statements = statements || <NodeArray<Statement | ClassElement>>[];

                            for (let j = 0; j < statements.length; j++) {
                                let statement = statements[j];

                                if (statement.kind === SyntaxKind.VariableStatement) {
                                    declarationList = (<VariableStatement>statement).declarationList.declarations;
                                }
                                else if (isForLoop(statement)) {
                                    let loop = <ForInStatement | ForStatement | ForOfStatement>statement;
                                    let initializer: VariableDeclarationList | Expression = loop.initializer;

                                    if (initializer && initializer.kind !== SyntaxKind.Identifier) {
                                        if (initializer.kind === SyntaxKind.BinaryExpression) {
                                            let binaryExpression = <BinaryExpression>initializer;
                                            declarationList = [binaryExpression.left];
                                        }
                                        else {
                                            declarationList = (<VariableDeclarationList>initializer).declarations;
                                        }
                                    }
                                }
                                else {
                                    declarationList = [statement];
                                }

                                let filteredNodes = declarationList.filter(filter);

                                if (filteredNodes.length) {
                                    var candidate = filteredNodes[0];

                                    if (isDefinedInTopLevelClass && !ts.isClassLike(containingNode)) {
                                        continue;
                                    }

                                    return {
                                        scope: containingNode,
                                        node: filteredNodes[0]
                                    };
                                }
                            }

                            if (containingNode.kind !== SyntaxKind.ModuleDeclaration) {
                                let moduleDeclaration = (<FunctionLikeDeclaration>declaration);
                                var parameters = moduleDeclaration.parameters || <Array<ParameterDeclaration>>[];

                                parameters = parameters.filter(filter);

                                if (parameters.length) {
                                    return {
                                        node: parameters[0],
                                        scope: containingNode
                                    };
                                }

                                let tryStatements = <Array<TryStatement>>statements.filter(statement => statement.kind === SyntaxKind.TryStatement);

                                if (tryStatements.length) {
                                    let declaredWithinCatchClause = tryStatements.reduce((arr, tryStatement) => {
                                        declarationList = [];
                                        statements = tryStatement.tryBlock.statements;

                                        if (tryStatement.finallyBlock) {
                                            statements = <NodeArray<Statement | ClassElement>>statements.concat(tryStatement.finallyBlock.statements);
                                        }

                                        if (tryStatement.catchClause) {
                                            declarationList.push(tryStatement.catchClause.variableDeclaration);
                                        }

                                        declarationList = statements.filter(statement => statement.kind === SyntaxKind.VariableStatement)
                                            .reduce((arr, variableStatement: VariableStatement) => {
                                                return arr.concat(variableStatement.declarationList.declarations);
                                            }, declarationList);

                                        return arr.concat(declarationList.filter(filter));
                                    }, []);

                                    if (declaredWithinCatchClause.length) {
                                        return {
                                            scope: containingNode,
                                            node: declaredWithinCatchClause[0]
                                        }
                                    }
                                }
                            }
                        }
                    }
                    _node = containingNode;
                }
                return null;
            }

            function emitIdentifier(node: Identifier) {
                if (!node.parent) {
                    write(node.text);
                }
                else if (isExpressionIdentifier(node)) {
                    emitExpressionIdentifier(node);
                }
                else if (isNameOfNestedRedeclaration(node)) {
                    write(getGeneratedNameForNode(node));
                }
                else if (nodeIsSynthesized(node)) {
                    write(node.text);
                }
                else {
                    writeTextOfNode(currentSourceFile, node);
                }
            }

            function emitThis(node: Node) {
                if (resolver.getNodeCheckFlags(node) & NodeCheckFlags.LexicalThis) {
                    write("_this");
                }
                else {
                    write("this");
                }
            }

            function getClassLikeEnclosingParent(node: Node): ClassLikeDeclaration {
                while (node && (node.kind !== SyntaxKind.ClassDeclaration && node.kind !== SyntaxKind.ClassExpression)) {
                    node = node.parent;
                }

                return <ClassLikeDeclaration>node;
            }

            function emitSuper(node: Node) {
                if (languageVersion >= ScriptTarget.ES6) {
                    write("super");
                }
                else {
                    let flags = resolver.getNodeCheckFlags(node);
                    let enclosingParent = getClassLikeEnclosingParent(node);
                    let baseTypeNode = ts.getClassExtendsHeritageClauseElement(enclosingParent);
                    emitModuleIfNeeded(baseTypeNode.expression);
                    emit(baseTypeNode.expression);
                    if (flags & NodeCheckFlags.SuperInstance) {
                        write(".prototype");
                    }
                }
            }

            function emitObjectBindingPattern(node: BindingPattern) {
                write("{ ");
                let elements = node.elements;
                emitList(elements, 0, elements.length, /*multiLine*/ false, /*trailingComma*/ elements.hasTrailingComma);
                write(" }");
            }

            function emitArrayBindingPattern(node: BindingPattern) {
                write("[");
                let elements = node.elements;
                emitList(elements, 0, elements.length, /*multiLine*/ false, /*trailingComma*/ elements.hasTrailingComma);
                write("]");
            }

            function emitBindingElement(node: BindingElement) {
                if (node.propertyName) {
                    emit(node.propertyName);
                    write(": ");
                }
                if (node.dotDotDotToken) {
                    write("...");
                }
                if (isBindingPattern(node.name)) {
                    emit(node.name);
                }
                else {
                    emitModuleMemberName(node);
                }
                emitOptional(" = ", node.initializer);
            }

            function emitSpreadElementExpression(node: SpreadElementExpression) {
                write("...");
                emit((<SpreadElementExpression>node).expression);
            }

            function emitYieldExpression(node: YieldExpression) {
                write(tokenToString(SyntaxKind.YieldKeyword));
                if (node.asteriskToken) {
                    write("*");
                }
                if (node.expression) {
                    write(" ");
                    emit(node.expression);
                }
            }

            function emitAwaitExpression(node: AwaitExpression) {
                let needsParenthesis = needsParenthesisForAwaitExpressionAsYield(node);
                if (needsParenthesis) {
                    write("(");
                }
                write(tokenToString(SyntaxKind.YieldKeyword));
                write(" ");
                emit(node.expression);
                if (needsParenthesis) {
                    write(")");
                }
            }

            function needsParenthesisForAwaitExpressionAsYield(node: AwaitExpression) {
                if (node.parent.kind === SyntaxKind.BinaryExpression && !isAssignmentOperator((<BinaryExpression>node.parent).operatorToken.kind)) {
                    return true;
                }
                else if (node.parent.kind === SyntaxKind.ConditionalExpression && (<ConditionalExpression>node.parent).condition === node) {
                    return true;
                }

                return false;
            }

            function needsParenthesisForPropertyAccessOrInvocation(node: Expression) {
                switch (node.kind) {
                    case SyntaxKind.Identifier:
                    case SyntaxKind.ArrayLiteralExpression:
                    case SyntaxKind.PropertyAccessExpression:
                    case SyntaxKind.ElementAccessExpression:
                    case SyntaxKind.CallExpression:
                    case SyntaxKind.ParenthesizedExpression:
                        // This list is not exhaustive and only includes those cases that are relevant
                        // to the check in emitArrayLiteral. More cases can be added as needed.
                        return false;
                }
                return true;
            }

            function emitListWithSpread(elements: Expression[], needsUniqueCopy: boolean, multiLine: boolean, trailingComma: boolean, useConcat: boolean) {
                let pos = 0;
                let group = 0;
                let length = elements.length;
                while (pos < length) {
                    // Emit using the pattern <group0>.concat(<group1>, <group2>, ...)
                    if (group === 1 && useConcat) {
                        write(".concat(");
                    }
                    else if (group > 0) {
                        write(", ");
                    }
                    let e = elements[pos];
                    if (e.kind === SyntaxKind.SpreadElementExpression) {
                        e = (<SpreadElementExpression>e).expression;
                        emitParenthesizedIf(e, /*parenthesized*/ group === 0 && needsParenthesisForPropertyAccessOrInvocation(e));
                        pos++;
                        if (pos === length && group === 0 && needsUniqueCopy && e.kind !== SyntaxKind.ArrayLiteralExpression) {
                            write(".slice()");
                        }
                    }
                    else {
                        let i = pos;
                        while (i < length && elements[i].kind !== SyntaxKind.SpreadElementExpression) {
                            i++;
                        }
                        write("[");
                        if (multiLine) {
                            increaseIndent();
                        }
                        emitList(elements, pos, i - pos, multiLine, trailingComma && i === length);
                        if (multiLine) {
                            decreaseIndent();
                        }
                        write("]");
                        pos = i;
                    }
                    group++;
                }
                if (group > 1) {
                    if (useConcat) {
                        write(")");
                    }
                }
            }

            function isSpreadElementExpression(node: Node) {
                return node.kind === SyntaxKind.SpreadElementExpression;
            }

            function emitArrayLiteral(node: ArrayLiteralExpression) {
                let elements = node.elements;
                if (elements.length === 0) {
                    write("[]");
                }
                else if (languageVersion >= ScriptTarget.ES6 || !forEach(elements, isSpreadElementExpression)) {
                    write("[");
                    emitLinePreservingList(node, node.elements, elements.hasTrailingComma, /*spacesBetweenBraces:*/ false);
                    write("]");
                }
                else {
                    emitListWithSpread(elements, /*needsUniqueCopy*/ true, /*multiLine*/(node.flags & NodeFlags.MultiLine) !== 0,
                        /*trailingComma*/ elements.hasTrailingComma, /*useConcat*/ true);
                }
            }

            function emitObjectLiteralBody(node: ObjectLiteralExpression, numElements: number): void {
                let functions: Array<PropertyAssignment> = [];

                if (numElements === 0) {
                    write("{}");
                    return;
                }

                write("{");

                if (numElements > 0) {
                    let index = 0;
                    let firstIsNotFunction: boolean;
                    let properties = <NodeArray<PropertyAssignment>>node.properties;

                    functions = properties.filter(function (prop, index) { return ts.isFunctionLike(prop.initializer); });
                    firstIsNotFunction = properties.indexOf(functions[0]) > 0;
                    // If we are not doing a downlevel transformation for object literals,
                    // then try to preserve the original shape of the object literal.
                    // Otherwise just try to preserve the formatting.
                    if (numElements === properties.length) {
                        if (firstIsNotFunction) {
                            forceWriteLine(getIndent() + 1);
                        }
                        emitLinePreservingList(node, properties, /* allowTrailingComma */ languageVersion >= ScriptTarget.ES5, /* spacesBetweenBraces */ true);
                    }
                    else {
                        let multiLine = (node.flags & NodeFlags.MultiLine) !== 0;
                        if (!multiLine) {
                            write(" ");
                        }
                        else {
                            increaseIndent();
                        }

                        emitList(properties, 0, numElements, /*multiLine*/ multiLine, /*trailingComma*/ false);

                        if (!multiLine) {
                            write(" ");
                        }
                        else {
                            decreaseIndent();
                        }
                    }
                }

                if (functions.length) {
                    forceWriteLine();
                }
                write("}");
            }

            function emitDownlevelObjectLiteralWithComputedProperties(node: ObjectLiteralExpression, firstComputedPropertyIndex: number) {
                let multiLine = (node.flags & NodeFlags.MultiLine) !== 0;
                let properties = node.properties;

                write("(");

                if (multiLine) {
                    increaseIndent();
                }

                // For computed properties, we need to create a unique handle to the object
                // literal so we can modify it without risking internal assignments tainting the object.
                let tempVar = createAndRecordTempVariable(TempFlags.Auto);

                // Write out the first non-computed properties
                // (or all properties if none of them are computed),
                // then emit the rest through indexing on the temp variable.
                emit(tempVar);
                write(" = ");
                emitObjectLiteralBody(node, firstComputedPropertyIndex);

                for (let i = firstComputedPropertyIndex, n = properties.length; i < n; i++) {
                    writeComma();

                    let property = properties[i];

                    emitStart(property);
                    if (property.kind === SyntaxKind.GetAccessor || property.kind === SyntaxKind.SetAccessor) {
                        // TODO (drosen): Reconcile with 'emitMemberFunctions'.
                        let accessors = getAllAccessorDeclarations(node.properties, <AccessorDeclaration>property);
                        if (property !== accessors.firstAccessor) {
                            continue;
                        }
                        write("Object.defineProperty(");
                        emit(tempVar);
                        write(", ");
                        emitStart(node.name);
                        emitExpressionForPropertyName(property.name);
                        emitEnd(property.name);
                        write(", {");
                        increaseIndent();
                        if (accessors.getAccessor) {
                            writeLine();
                            emitLeadingComments(accessors.getAccessor);
                            write("get: ");
                            emitStart(accessors.getAccessor);
                            write("function ");
                            emitSignatureAndBody(accessors.getAccessor);
                            emitEnd(accessors.getAccessor);
                            emitTrailingComments(accessors.getAccessor);
                            write(",");
                        }
                        if (accessors.setAccessor) {
                            writeLine();
                            emitLeadingComments(accessors.setAccessor);
                            write("set: ");
                            emitStart(accessors.setAccessor);
                            write("function ");
                            emitSignatureAndBody(accessors.setAccessor);
                            emitEnd(accessors.setAccessor);
                            emitTrailingComments(accessors.setAccessor);
                            write(",");
                        }
                        writeLine();
                        write("enumerable: true,");
                        writeLine();
                        write("configurable: true");
                        decreaseIndent();
                        writeLine();
                        write("})");
                        emitEnd(property);
                    }
                    else {
                        emitLeadingComments(property);
                        emitStart(property.name);
                        emit(tempVar);
                        emitMemberAccessForPropertyName(property.name);
                        emitEnd(property.name);

                        write(" = ");

                        if (property.kind === SyntaxKind.PropertyAssignment) {
                            emit((<PropertyAssignment>property).initializer);
                        }
                        else if (property.kind === SyntaxKind.ShorthandPropertyAssignment) {
                            emitExpressionIdentifier((<ShorthandPropertyAssignment>property).name);
                        }
                        else if (property.kind === SyntaxKind.MethodDeclaration) {
                            emitFunctionDeclaration(<MethodDeclaration>property);
                        }
                        else {
                            Debug.fail("ObjectLiteralElement type not accounted for: " + property.kind);
                        }
                    }

                    emitEnd(property);
                }

                writeComma();
                emit(tempVar);

                if (multiLine) {
                    decreaseIndent();
                    writeLine();
                }

                write(")");

                function writeComma() {
                    if (multiLine) {
                        write(",");
                        writeLine();
                    }
                    else {
                        write(", ");
                    }
                }
            }

            function emitObjectLiteral(node: ObjectLiteralExpression): void {
                let properties = node.properties;

                if (languageVersion < ScriptTarget.ES6) {
                    let numProperties = properties.length;

                    // Find the first computed property.
                    // Everything until that point can be emitted as part of the initial object literal.
                    let numInitialNonComputedProperties = numProperties;
                    for (let i = 0, n = properties.length; i < n; i++) {
                        if (properties[i].name.kind === SyntaxKind.ComputedPropertyName) {
                            numInitialNonComputedProperties = i;
                            break;
                        }
                    }

                    let hasComputedProperty = numInitialNonComputedProperties !== properties.length;
                    if (hasComputedProperty) {
                        emitDownlevelObjectLiteralWithComputedProperties(node, numInitialNonComputedProperties);
                        return;
                    }
                }

                // Ordinary case: either the object has no computed properties
                // or we're compiling with an ES6+ target.
                emitObjectLiteralBody(node, properties.length);
            }

            function createBinaryExpression(left: Expression, operator: SyntaxKind, right: Expression, startsOnNewLine?: boolean): BinaryExpression {
                let result = <BinaryExpression>createSynthesizedNode(SyntaxKind.BinaryExpression, startsOnNewLine);
                result.operatorToken = createSynthesizedNode(operator);
                result.left = left;
                result.right = right;

                return result;
            }

            function createPropertyAccessExpression(expression: Expression, name: Identifier): PropertyAccessExpression {
                let result = <PropertyAccessExpression>createSynthesizedNode(SyntaxKind.PropertyAccessExpression);
                result.expression = parenthesizeForAccess(expression);
                result.dotToken = createSynthesizedNode(SyntaxKind.DotToken);
                result.name = name;

                return result;
            }

            function createElementAccessExpression(expression: Expression, argumentExpression: Expression): ElementAccessExpression {
                let result = <ElementAccessExpression>createSynthesizedNode(SyntaxKind.ElementAccessExpression);
                result.expression = parenthesizeForAccess(expression);
                result.argumentExpression = argumentExpression;

                return result;
            }

            function parenthesizeForAccess(expr: Expression): LeftHandSideExpression {
                // When diagnosing whether the expression needs parentheses, the decision should be based
                // on the innermost expression in a chain of nested type assertions.
                while (expr.kind === SyntaxKind.TypeAssertionExpression || expr.kind === SyntaxKind.AsExpression) {
                    expr = (<AssertionExpression>expr).expression;
                }

                // isLeftHandSideExpression is almost the correct criterion for when it is not necessary
                // to parenthesize the expression before a dot. The known exceptions are:
                //
                //    NewExpression:
                //       new C.x        -> not the same as (new C).x
                //    NumberLiteral
                //       1.x            -> not the same as (1).x
                //
                if (isLeftHandSideExpression(expr) &&
                    expr.kind !== SyntaxKind.NewExpression &&
                    expr.kind !== SyntaxKind.NumericLiteral) {

                    return <LeftHandSideExpression>expr;
                }
                let node = <ParenthesizedExpression>createSynthesizedNode(SyntaxKind.ParenthesizedExpression);
                node.expression = expr;
                return node;
            }

            function emitComputedPropertyName(node: ComputedPropertyName) {
                write("[");
                emitExpressionForPropertyName(node);
                write("]");
            }

            function emitMethod(node: MethodDeclaration) {
                if (languageVersion >= ScriptTarget.ES6 && node.asteriskToken) {
                    write("*");
                }

                emit(node.name);
                if (languageVersion < ScriptTarget.ES6) {
                    write(": function ");
                }
                emitSignatureAndBody(node);
            }

            function emitPropertyAssignment(node: PropertyDeclaration) {
                if (ts.isFunctionLike(node.initializer)) {
                    forceWriteLine();
                }
                emit(node.name);
                write(": ");
                // This is to ensure that we emit comment in the following case:
                //      For example:
                //          obj = {
                //              id: /*comment1*/ ()=>void
                //          }
                // "comment1" is not considered to be leading comment for node.initializer
                // but rather a trailing comment on the previous node.
                emitTrailingCommentsOfPosition(node.initializer.pos);
                emit(node.initializer);
            }

            // Return true if identifier resolves to an exported member of a namespace
            function isNamespaceExportReference(node: Identifier) {
                let container = resolver.getReferencedExportContainer(node);
                return container && container.kind !== SyntaxKind.SourceFile;
            }

            function emitShorthandPropertyAssignment(node: ShorthandPropertyAssignment) {
                // The name property of a short-hand property assignment is considered an expression position, so here
                // we manually emit the identifier to avoid rewriting.
                writeTextOfNode(currentSourceFile, node.name);
                // If emitting pre-ES6 code, or if the name requires rewriting when resolved as an expression identifier,
                // we emit a normal property assignment. For example:
                //   module m {
                //       export let y;
                //   }
                //   module m {
                //       let obj = { y };
                //   }
                // Here we need to emit obj = { y : m.y } regardless of the output target.
                if (languageVersion < ScriptTarget.ES6 || isNamespaceExportReference(node.name)) {
                    // Emit identifier as an identifier
                    write(": ");
                    emit(node.name);
                }

                if (languageVersion >= ScriptTarget.ES6 && node.objectAssignmentInitializer) {
                    write(" = ");
                    emit(node.objectAssignmentInitializer);
                }
            }

            function tryEmitConstantValue(node: PropertyAccessExpression | ElementAccessExpression): boolean {
                let constantValue = tryGetConstEnumValue(node);
                if (constantValue !== undefined) {
                    write(constantValue.toString());
                    if (!compilerOptions.removeComments) {
                        let propertyName: string = node.kind === SyntaxKind.PropertyAccessExpression ? declarationNameToString((<PropertyAccessExpression>node).name) : getTextOfNode((<ElementAccessExpression>node).argumentExpression);
                        write(" /* " + propertyName + " */");
                    }
                    return true;
                }
                return false;
            }

            function tryGetConstEnumValue(node: Node): number {
                if (compilerOptions.isolatedModules) {
                    return undefined;
                }

                return node.kind === SyntaxKind.PropertyAccessExpression || node.kind === SyntaxKind.ElementAccessExpression
                    ? resolver.getConstantValue(<PropertyAccessExpression | ElementAccessExpression>node)
                    : undefined;
            }

            // Returns 'true' if the code was actually indented, false otherwise.
            // If the code is not indented, an optional valueToWriteWhenNotIndenting will be
            // emitted instead.
            function indentIfOnDifferentLines(parent: Node, node1: Node, node2: Node, valueToWriteWhenNotIndenting?: string): boolean {
                let realNodesAreOnDifferentLines = !nodeIsSynthesized(parent) && !nodeEndIsOnSameLineAsNodeStart(node1, node2);

                // Always use a newline for synthesized code if the synthesizer desires it.
                let synthesizedNodeIsOnDifferentLine = synthesizedNodeStartsOnNewLine(node2);

                if (realNodesAreOnDifferentLines || synthesizedNodeIsOnDifferentLine) {
                    increaseIndent();
                    writeLine();
                    return true;
                }
                else {
                    if (valueToWriteWhenNotIndenting) {
                        write(valueToWriteWhenNotIndenting);
                    }
                    return false;
                }
            }

            function emitPropertyAccess(node: PropertyAccessExpression) {
                if (tryEmitConstantValue(node)) {
                    return;
                }
                emit(node.expression);
                let indentedBeforeDot = indentIfOnDifferentLines(node, node.expression, node.dotToken);

                // 1 .toString is a valid property access, emit a space after the literal
                // Also emit a space if expression is a integer const enum value - it will appear in generated code as numeric literal
                let shouldEmitSpace: boolean;
                if (!indentedBeforeDot) {
                    if (node.expression.kind === SyntaxKind.NumericLiteral) {
                        // check if numeric literal was originally written with a dot
                        let text = getSourceTextOfNodeFromSourceFile(currentSourceFile, node.expression);
                        shouldEmitSpace = text.indexOf(tokenToString(SyntaxKind.DotToken)) < 0;
                    }
                    else {
                        // check if constant enum value is integer
                        let constantValue = tryGetConstEnumValue(node.expression);
                        // isFinite handles cases when constantValue is undefined
                        shouldEmitSpace = isFinite(constantValue) && Math.floor(constantValue) === constantValue;
                    }
                }
                if (shouldEmitSpace) {
                    write(" .");
                }
                else {
                    write(".");
                }
                let indentedAfterDot = indentIfOnDifferentLines(node, node.dotToken, node.name);
                emit(node.name);
                decreaseIndentIf(indentedBeforeDot, indentedAfterDot);
            }

            function emitQualifiedName(node: QualifiedName) {
                emit(node.left);
                write(".");
                emit(node.right);
            }

            function emitQualifiedNameAsExpression(node: QualifiedName, useFallback: boolean) {
                if (node.left.kind === SyntaxKind.Identifier) {
                    emitEntityNameAsExpression(node.left, useFallback);
                }
                else if (useFallback) {
                    let temp = createAndRecordTempVariable(TempFlags.Auto);
                    write("(");
                    emitNodeWithoutSourceMap(temp);
                    write(" = ");
                    emitEntityNameAsExpression(node.left, /*useFallback*/ true);
                    write(") && ");
                    emitNodeWithoutSourceMap(temp);
                }
                else {
                    emitEntityNameAsExpression(node.left, /*useFallback*/ false);
                }

                write(".");
                emit(node.right);
            }

            function emitEntityNameAsExpression(node: EntityName, useFallback: boolean) {
                switch (node.kind) {
                    case SyntaxKind.Identifier:
                        if (useFallback) {
                            write("typeof ");
                            emitExpressionIdentifier(<Identifier>node);
                            write(" !== 'undefined' && ");
                        }

                        emitExpressionIdentifier(<Identifier>node);
                        break;

                    case SyntaxKind.QualifiedName:
                        emitQualifiedNameAsExpression(<QualifiedName>node, useFallback);
                        break;
                }
            }

            function emitIndexedAccess(node: ElementAccessExpression) {
                if (tryEmitConstantValue(node)) {
                    return;
                }
                emitModuleIfNeeded(node.expression);
                emit(node.expression);
                write("[");
                emit(node.argumentExpression);
                write("]");
            }

            function hasSpreadElement(elements: Expression[]) {
                return forEach(elements, e => e.kind === SyntaxKind.SpreadElementExpression);
            }

            function skipParentheses(node: Expression): Expression {
                while (node.kind === SyntaxKind.ParenthesizedExpression || node.kind === SyntaxKind.TypeAssertionExpression || node.kind === SyntaxKind.AsExpression) {
                    node = (<ParenthesizedExpression | AssertionExpression>node).expression;
                }
                return node;
            }

            function emitCallTarget(node: Expression): Expression {
                if (node.kind === SyntaxKind.Identifier || node.kind === SyntaxKind.ThisKeyword || node.kind === SyntaxKind.SuperKeyword) {
                    emit(node);
                    return node;
                }
                let temp = createAndRecordTempVariable(TempFlags.Auto);

                write("(");
                emit(temp);
                write(" = ");
                emit(node);
                write(")");
                return temp;
            }

            function emitCallWithSpread(node: CallExpression) {
                let target: Expression;
                let expr = skipParentheses(node.expression);
                if (expr.kind === SyntaxKind.PropertyAccessExpression) {
                    // Target will be emitted as "this" argument
                    target = emitCallTarget((<PropertyAccessExpression>expr).expression);
                    write(".");
                    emit((<PropertyAccessExpression>expr).name);
                }
                else if (expr.kind === SyntaxKind.ElementAccessExpression) {
                    // Target will be emitted as "this" argument
                    target = emitCallTarget((<PropertyAccessExpression>expr).expression);
                    write("[");
                    emit((<ElementAccessExpression>expr).argumentExpression);
                    write("]");
                }
                else if (expr.kind === SyntaxKind.SuperKeyword) {
                    target = expr;
                    write("_super");
                }
                else {
                    emit(node.expression);
                }
                write(".apply(");
                if (target) {
                    if (target.kind === SyntaxKind.SuperKeyword) {
                        // Calls of form super(...) and super.foo(...)
                        emitThis(target);
                    }
                    else {
                        // Calls of form obj.foo(...)
                        emit(target);
                    }
                }
                else {
                    // Calls of form foo(...)
                    write("void 0");
                }
                write(", ");
                emitListWithSpread(node.arguments, /*needsUniqueCopy*/ false, /*multiLine*/ false, /*trailingComma*/ false, /*useConcat*/ true);
                write(")");
            }

            function emitCallExpression(node: CallExpression) {
                if (languageVersion < ScriptTarget.ES6 && hasSpreadElement(node.arguments)) {
                    emitCallWithSpread(node);
                    return;
                }
                let superCall = false;
                if (node.expression.kind === SyntaxKind.SuperKeyword) {
                    emitSuper(node.expression);
                    superCall = true;
                }
                else {
                    emit(node.expression);
                    superCall = node.expression.kind === SyntaxKind.PropertyAccessExpression && (<PropertyAccessExpression>node.expression).expression.kind === SyntaxKind.SuperKeyword;
                }
                if (superCall && languageVersion < ScriptTarget.ES6) {
                    write(".call(");
                    emitThis(node.expression);
                    if (node.arguments.length) {
                        write(", ");
                        emitCommaList(node.arguments);
                    }
                    write(")");
                }
                else {
                    write("(");
                    emitCommaList(node.arguments);
                    write(")");
                }
            }

            function emitNewExpression(node: NewExpression) {
                write("new ");
                emitModuleIfNeeded(node.expression);
                // Spread operator logic is supported in new expressions in ES5 using a combination
                // of Function.prototype.bind() and Function.prototype.apply().
                //
                //     Example:
                //
                //         var args = [1, 2, 3, 4, 5];
                //         new Array(...args);
                //
                //     is compiled into the following ES5:
                //
                //         var args = [1, 2, 3, 4, 5];
                //         new (Array.bind.apply(Array, [void 0].concat(args)));
                //
                // The 'thisArg' to 'bind' is ignored when invoking the result of 'bind' with 'new',
                // Thus, we set it to undefined ('void 0').
                if (languageVersion === ScriptTarget.ES5 &&
                    node.arguments &&
                    hasSpreadElement(node.arguments)) {

                    write("(");
                    let target = emitCallTarget(node.expression);
                    write(".bind.apply(");
                    emit(target);
                    write(", [void 0].concat(");
                    emitListWithSpread(node.arguments, /*needsUniqueCopy*/ false, /*multiline*/ false, /*trailingComma*/ false, /*useConcat*/ false);
                    write(")))");
                    write("()");
                }
                else {
                    emit(node.expression);
                    if (node.arguments) {
                        write("(");
                        emitCommaList(node.arguments);
                        write(")");
                    }
                }
            }

            function emitTaggedTemplateExpression(node: TaggedTemplateExpression): void {
                if (languageVersion >= ScriptTarget.ES6) {
                    emit(node.tag);
                    write(" ");
                    emit(node.template);
                }
                else {
                    emitDownlevelTaggedTemplate(node);
                }
            }

            function emitParenExpression(node: ParenthesizedExpression) {
                // If the node is synthesized, it means the emitter put the parentheses there,
                // not the user. If we didn't want them, the emitter would not have put them
                // there.
                if (!nodeIsSynthesized(node) && node.parent.kind !== SyntaxKind.ArrowFunction) {
                    if (node.expression.kind === SyntaxKind.TypeAssertionExpression || node.expression.kind === SyntaxKind.AsExpression) {
                        let operand = (<TypeAssertion>node.expression).expression;

                        // Make sure we consider all nested cast expressions, e.g.:
                        // (<any><number><any>-A).x;
                        while (operand.kind === SyntaxKind.TypeAssertionExpression || operand.kind === SyntaxKind.AsExpression) {
                            operand = (<TypeAssertion>operand).expression;
                        }

                        // We have an expression of the form: (<Type>SubExpr)
                        // Emitting this as (SubExpr) is really not desirable. We would like to emit the subexpr as is.
                        // Omitting the parentheses, however, could cause change in the semantics of the generated
                        // code if the casted expression has a lower precedence than the rest of the expression, e.g.:
                        //      (<any>new A).foo should be emitted as (new A).foo and not new A.foo
                        //      (<any>typeof A).toString() should be emitted as (typeof A).toString() and not typeof A.toString()
                        //      new (<any>A()) should be emitted as new (A()) and not new A()
                        //      (<any>function foo() { })() should be emitted as an IIF (function foo(){})() and not declaration function foo(){} ()
                        if (operand.kind !== SyntaxKind.PrefixUnaryExpression &&
                            operand.kind !== SyntaxKind.VoidExpression &&
                            operand.kind !== SyntaxKind.TypeOfExpression &&
                            operand.kind !== SyntaxKind.DeleteExpression &&
                            operand.kind !== SyntaxKind.PostfixUnaryExpression &&
                            operand.kind !== SyntaxKind.NewExpression &&
                            !(operand.kind === SyntaxKind.CallExpression && node.parent.kind === SyntaxKind.NewExpression) &&
                            !(operand.kind === SyntaxKind.FunctionExpression && node.parent.kind === SyntaxKind.CallExpression) &&
                            !(operand.kind === SyntaxKind.NumericLiteral && node.parent.kind === SyntaxKind.PropertyAccessExpression)) {
                            emit(operand);
                            return;
                        }
                    }
                }

                write("(");
                emit(node.expression);
                write(")");
            }

            function emitDeleteExpression(node: DeleteExpression) {
                write(tokenToString(SyntaxKind.DeleteKeyword));
                write(" ");
                emit(node.expression);
            }

            function emitVoidExpression(node: VoidExpression) {
                write(tokenToString(SyntaxKind.VoidKeyword));
                write(" ");
                emit(node.expression);
            }

            function emitTypeOfExpression(node: TypeOfExpression) {
                write(tokenToString(SyntaxKind.TypeOfKeyword));
                write(" ");
                emit(node.expression);
            }

            function isNameOfExportedSourceLevelDeclarationInSystemExternalModule(node: Node): boolean {
                if (!isCurrentFileSystemExternalModule() || node.kind !== SyntaxKind.Identifier || nodeIsSynthesized(node)) {
                    return false;
                }

                const isVariableDeclarationOrBindingElement =
                    node.parent && (node.parent.kind === SyntaxKind.VariableDeclaration || node.parent.kind === SyntaxKind.BindingElement);

                const targetDeclaration =
                    isVariableDeclarationOrBindingElement
                        ? <Declaration>node.parent
                        : resolver.getReferencedValueDeclaration(<Identifier>node);

                return isSourceFileLevelDeclarationInSystemJsModule(targetDeclaration, /*isExported*/ true);
            }

            function emitPrefixUnaryExpression(node: PrefixUnaryExpression) {
                const exportChanged = isNameOfExportedSourceLevelDeclarationInSystemExternalModule(node.operand);

                if (exportChanged) {
                    // emit
                    // ++x
                    // as
                    // exports('x', ++x)
                    write(`${exportFunctionForFile}("`);
                    emitNodeWithoutSourceMap(node.operand);
                    write(`", `);
                }

                write(tokenToString(node.operator));
                // In some cases, we need to emit a space between the operator and the operand. One obvious case
                // is when the operator is an identifier, like delete or typeof. We also need to do this for plus
                // and minus expressions in certain cases. Specifically, consider the following two cases (parens
                // are just for clarity of exposition, and not part of the source code):
                //
                //  (+(+1))
                //  (+(++1))
                //
                // We need to emit a space in both cases. In the first case, the absence of a space will make
                // the resulting expression a prefix increment operation. And in the second, it will make the resulting
                // expression a prefix increment whose operand is a plus expression - (++(+x))
                // The same is true of minus of course.
                if (node.operand.kind === SyntaxKind.PrefixUnaryExpression) {
                    let operand = <PrefixUnaryExpression>node.operand;
                    if (node.operator === SyntaxKind.PlusToken && (operand.operator === SyntaxKind.PlusToken || operand.operator === SyntaxKind.PlusPlusToken)) {
                        write(" ");
                    }
                    else if (node.operator === SyntaxKind.MinusToken && (operand.operator === SyntaxKind.MinusToken || operand.operator === SyntaxKind.MinusMinusToken)) {
                        write(" ");
                    }
                }
                if (node.operand.kind !== SyntaxKind.PropertyAccessExpression) {
                    emitModuleIfNeeded(node.operand);
                }
                emit(node.operand);

                if (exportChanged) {
                    write(")");
                }
            }

            function emitPostfixUnaryExpression(node: PostfixUnaryExpression) {
                const exportChanged = isNameOfExportedSourceLevelDeclarationInSystemExternalModule(node.operand);
                if (exportChanged) {
                    // export function returns the value that was passes as the second argument
                    // however for postfix unary expressions result value should be the value before modification.
                    // emit 'x++' as '(export('x', ++x) - 1)' and 'x--' as '(export('x', --x) + 1)'
                    write(`(${exportFunctionForFile}("`);
                    emitNodeWithoutSourceMap(node.operand);
                    write(`", `);

                    write(tokenToString(node.operator));
                    emit(node.operand);

                    if (node.operator === SyntaxKind.PlusPlusToken) {
                        write(") - 1)");
                    }
                    else {
                        write(") + 1)");
                    }
                }
                else {
                    if (node.operand.kind !== SyntaxKind.PropertyAccessExpression) {
                        emitModuleIfNeeded(node.operand);
                    }
                    emit(node.operand);
                    write(tokenToString(node.operator));
                }
            }

            function shouldHoistDeclarationInSystemJsModule(node: Node): boolean {
                return isSourceFileLevelDeclarationInSystemJsModule(node, /*isExported*/ false);
            }

            /*
             * Checks if given node is a source file level declaration (not nested in module/function).
             * If 'isExported' is true - then declaration must also be exported.
             * This function is used in two cases:
             * - check if node is a exported source file level value to determine
             *   if we should also export the value after its it changed
             * - check if node is a source level declaration to emit it differently,
             *   i.e non-exported variable statement 'var x = 1' is hoisted so
             *   we we emit variable statement 'var' should be dropped.
             */
            function isSourceFileLevelDeclarationInSystemJsModule(node: Node, isExported: boolean): boolean {
                if (!node || languageVersion >= ScriptTarget.ES6 || !isCurrentFileSystemExternalModule()) {
                    return false;
                }

                let current: Node = node;
                while (current) {
                    if (current.kind === SyntaxKind.SourceFile) {
                        return !isExported || ((getCombinedNodeFlags(node) & NodeFlags.Export) !== 0);
                    }
                    else if (isFunctionLike(current) || current.kind === SyntaxKind.ModuleBlock) {
                        return false;
                    }
                    else {
                        current = current.parent;
                    }
                }
            }

            /**
             * Emit ES7 exponentiation operator downlevel using Math.pow
             * @param node a binary expression node containing exponentiationOperator (**, **=)
             */
            function emitExponentiationOperator(node: BinaryExpression) {
                let leftHandSideExpression = node.left;
                if (node.operatorToken.kind === SyntaxKind.AsteriskAsteriskEqualsToken) {
                    let synthesizedLHS: ElementAccessExpression | PropertyAccessExpression;
                    let shouldEmitParentheses = false;
                    if (isElementAccessExpression(leftHandSideExpression)) {
                        shouldEmitParentheses = true;
                        write("(");

                        synthesizedLHS = <ElementAccessExpression>createSynthesizedNode(SyntaxKind.ElementAccessExpression, /*startsOnNewLine*/ false);

                        let identifier = emitTempVariableAssignment(leftHandSideExpression.expression, /*canDefinedTempVariablesInPlaces*/ false, /*shouldEmitCommaBeforeAssignment*/ false);
                        synthesizedLHS.expression = identifier;

                        if (leftHandSideExpression.argumentExpression.kind !== SyntaxKind.NumericLiteral &&
                            leftHandSideExpression.argumentExpression.kind !== SyntaxKind.StringLiteral) {
                            let tempArgumentExpression = createAndRecordTempVariable(TempFlags._i);
                            (<ElementAccessExpression>synthesizedLHS).argumentExpression = tempArgumentExpression;
                            emitAssignment(tempArgumentExpression, leftHandSideExpression.argumentExpression, /*shouldEmitCommaBeforeAssignment*/ true);
                        }
                        else {
                            (<ElementAccessExpression>synthesizedLHS).argumentExpression = leftHandSideExpression.argumentExpression;
                        }
                        write(", ");
                    }
                    else if (isPropertyAccessExpression(leftHandSideExpression)) {
                        shouldEmitParentheses = true;
                        write("(");
                        synthesizedLHS = <PropertyAccessExpression>createSynthesizedNode(SyntaxKind.PropertyAccessExpression, /*startsOnNewLine*/ false);

                        let identifier = emitTempVariableAssignment(leftHandSideExpression.expression, /*canDefinedTempVariablesInPlaces*/ false, /*shouldemitCommaBeforeAssignment*/ false);
                        synthesizedLHS.expression = identifier;

                        (<PropertyAccessExpression>synthesizedLHS).dotToken = leftHandSideExpression.dotToken;
                        (<PropertyAccessExpression>synthesizedLHS).name = leftHandSideExpression.name;
                        write(", ");
                    }

                    emit(synthesizedLHS || leftHandSideExpression);
                    write(" = ");
                    write("Math.pow(");
                    emit(synthesizedLHS || leftHandSideExpression);
                    write(", ");
                    emit(node.right);
                    write(")");
                    if (shouldEmitParentheses) {
                        write(")");
                    }
                }
                else {
                    write("Math.pow(");
                    emit(leftHandSideExpression);
                    write(", ");
                    emit(node.right);
                    write(")");
                }
            }

            function emitBinaryExpression(node: BinaryExpression) {
                if (languageVersion < ScriptTarget.ES6 && node.operatorToken.kind === SyntaxKind.EqualsToken &&
                    (node.left.kind === SyntaxKind.ObjectLiteralExpression || node.left.kind === SyntaxKind.ArrayLiteralExpression)) {
                    emitDestructuring(node, node.parent.kind === SyntaxKind.ExpressionStatement);
                }
                else {
                    const exportChanged =
                        node.operatorToken.kind >= SyntaxKind.FirstAssignment &&
                        node.operatorToken.kind <= SyntaxKind.LastAssignment &&
                        isNameOfExportedSourceLevelDeclarationInSystemExternalModule(node.left);

                    if (exportChanged) {
                        // emit assignment 'x <op> y' as 'exports("x", x <op> y)'
                        write(`${exportFunctionForFile}("`);
                        emitNodeWithoutSourceMap(node.left);
                        write(`", `);
                    }

                    if (node.operatorToken.kind === SyntaxKind.AsteriskAsteriskToken || node.operatorToken.kind === SyntaxKind.AsteriskAsteriskEqualsToken) {
                        // Downleveled emit exponentiation operator using Math.pow
                        emitExponentiationOperator(node);
                    }
                    else {
                        if (node.left.kind !== SyntaxKind.PropertyAccessExpression) {
                            emitModuleName(node.left);
                        }
                        emit(node.left);
                        // Add indentation before emit the operator if the operator is on different line
                        // For example:
                        //      3
                        //      + 2;
                        //   emitted as
                        //      3
                        //          + 2;
                        let indentedBeforeOperator = indentIfOnDifferentLines(node, node.left, node.operatorToken, node.operatorToken.kind !== SyntaxKind.CommaToken ? " " : undefined);
                        write(tokenToString(node.operatorToken.kind));
                        let indentedAfterOperator = indentIfOnDifferentLines(node, node.operatorToken, node.right, " ");

                        if (node.right.kind !== SyntaxKind.PropertyAccessExpression) {
                            emitModuleName(node.right);
                        }
                        emit(node.right);
                        decreaseIndentIf(indentedBeforeOperator, indentedAfterOperator);
                    }

                    if (exportChanged) {
                        write(")");
                    }
                }
            }

            function synthesizedNodeStartsOnNewLine(node: Node) {
                return nodeIsSynthesized(node) && (<SynthesizedNode>node).startsOnNewLine;
            }

            function emitConditionalExpression(node: ConditionalExpression) {
                emit(node.condition);
                let indentedBeforeQuestion = indentIfOnDifferentLines(node, node.condition, node.questionToken, " ");
                write("?");
                let indentedAfterQuestion = indentIfOnDifferentLines(node, node.questionToken, node.whenTrue, " ");
                emit(node.whenTrue);
                decreaseIndentIf(indentedBeforeQuestion, indentedAfterQuestion);
                let indentedBeforeColon = indentIfOnDifferentLines(node, node.whenTrue, node.colonToken, " ");
                write(":");
                let indentedAfterColon = indentIfOnDifferentLines(node, node.colonToken, node.whenFalse, " ");
                emit(node.whenFalse);
                decreaseIndentIf(indentedBeforeColon, indentedAfterColon);
            }

            // Helper function to decrease the indent if we previously indented.  Allows multiple
            // previous indent values to be considered at a time.  This also allows caller to just
            // call this once, passing in all their appropriate indent values, instead of needing
            // to call this helper function multiple times.
            function decreaseIndentIf(value1: boolean, value2?: boolean) {
                if (value1) {
                    decreaseIndent();
                }
                if (value2) {
                    decreaseIndent();
                }
            }

            function isSingleLineEmptyBlock(node: Node) {
                if (node && node.kind === SyntaxKind.Block) {
                    let block = <Block>node;
                    return block.statements.length === 0 && nodeEndIsOnSameLineAsNodeStart(block, block);
                }
            }

            function emitBlock(node: Block) {
                if (isSingleLineEmptyBlock(node)) {
                    emitToken(SyntaxKind.OpenBraceToken, node.pos);
                    write(" ");
                    emitToken(SyntaxKind.CloseBraceToken, node.statements.end);
                    return;
                }

                if (node.kind === SyntaxKind.ModuleBlock) {
                    Debug.assert(node.parent.kind === SyntaxKind.ModuleDeclaration);
                    emitCaptureThisForNodeIfNecessary(node.parent);
                    emitLines(node.statements);
                    emitTempDeclarations(true);
                    scopeEmitEnd();
                }
                else {
                    emitToken(SyntaxKind.OpenBraceToken, node.pos);
                    increaseIndent();
                    scopeEmitStart(node.parent);
                    emitLines(node.statements);
                    decreaseIndent();
                    writeLine();
                    emitToken(SyntaxKind.CloseBraceToken, node.statements.end);
                }
            }

            function emitEmbeddedStatement(node: Node) {
                if (node.kind === SyntaxKind.Block) {
                    write(" ");
                    emit(<Block>node);
                }
                else {
                    increaseIndent();
                    writeLine();
                    emit(node);
                    decreaseIndent();
                }
            }

            function emitExpressionStatement(node: ExpressionStatement) {
                emitParenthesizedIf(node.expression, /*parenthesized*/ node.expression.kind === SyntaxKind.ArrowFunction);
                write(";");
            }

            function emitIfStatement(node: IfStatement) {
                let endPos = emitToken(SyntaxKind.IfKeyword, node.pos);
                write(" ");
                endPos = emitToken(SyntaxKind.OpenParenToken, endPos);
                emit(node.expression);
                emitToken(SyntaxKind.CloseParenToken, node.expression.end);
                emitEmbeddedStatement(node.thenStatement);
                if (node.elseStatement) {
                    writeLine();
                    emitToken(SyntaxKind.ElseKeyword, node.thenStatement.end);
                    if (node.elseStatement.kind === SyntaxKind.IfStatement) {
                        write(" ");
                        emit(node.elseStatement);
                    }
                    else {
                        emitEmbeddedStatement(node.elseStatement);
                    }
                }
            }

            function emitDoStatement(node: DoStatement) {
                write("do");
                emitEmbeddedStatement(node.statement);
                if (node.statement.kind === SyntaxKind.Block) {
                    write(" ");
                }
                else {
                    writeLine();
                }
                write("while (");
                emit(node.expression);
                write(");");
            }

            function emitWhileStatement(node: WhileStatement) {
                write("while (");
                emit(node.expression);
                write(")");
                emitEmbeddedStatement(node.statement);
            }

            /**
             * Returns true if start of variable declaration list was emitted.
             * Returns false if nothing was written - this can happen for source file level variable declarations
             *     in system modules where such variable declarations are hoisted.
             */
            function tryGetStartOfVariableDeclarationList(decl: VariableDeclarationList, startPos?: number): string {
                let empty = "";
                if (shouldHoistVariable(decl, /*checkIfSourceFileLevelDecl*/ true)) {
                    // variables in variable declaration list were already hoisted
                    return empty;
                }

                let tokenKind = SyntaxKind.VarKeyword;
                if (decl && languageVersion >= ScriptTarget.ES6) {
                    if (isLet(decl)) {
                        tokenKind = SyntaxKind.LetKeyword;
                    }
                    else if (isConst(decl)) {
                        tokenKind = SyntaxKind.ConstKeyword;
                    }
                }

                let firstDeclaration = decl.declarations[0];

                if (isForLoop(decl.parent) && !isNodeDeclaredWithinFunction(firstDeclaration) && isNodeContainedWithinModule(decl.parent)) {
                    return empty;
                }

                if (!trySetVariableDeclarationInModule(firstDeclaration)) {
                    return empty;
                }

                if (startPos !== undefined) {
                    emitToken(tokenKind, startPos);
                    write(" ");
                }
                else {
                    switch (tokenKind) {
                        case SyntaxKind.VarKeyword:
                            return "var ";
                        case SyntaxKind.LetKeyword:
                            return "let ";
                        case SyntaxKind.ConstKeyword:
                            return "const ";
                    }
                }

                return empty;
            }

            function emitVariableDeclarationListSkippingUninitializedEntries(list: VariableDeclarationList): boolean {
                let started = false;
                for (let decl of list.declarations) {
                    if (!decl.initializer) {
                        continue;
                    }

                    if (!started) {
                        started = true;
                    }
                    else {
                        write(";");
                        forceWriteLine();
                    }

                    if (decl.kind !== SyntaxKind.Parameter) {
                        emitVariableTypeAnnotation(decl);
                    }
                    emit(decl);
                }

                return started;
            }

            function emitForStatement(node: ForStatement) {
                let endPos = emitToken(SyntaxKind.ForKeyword, node.pos);
                write(" ");
                endPos = emitToken(SyntaxKind.OpenParenToken, endPos);
                if (node.initializer && node.initializer.kind === SyntaxKind.VariableDeclarationList) {
                    let variableDeclarationList = <VariableDeclarationList>node.initializer;
                    let startIsEmitted = tryGetStartOfVariableDeclarationList(variableDeclarationList, endPos);
                    if (startIsEmitted) {
                        write(startIsEmitted);
                        emitCommaList(variableDeclarationList.declarations);
                    }
                    else {
                        emitVariableDeclarationListSkippingUninitializedEntries(variableDeclarationList);
                    }
                }
                else if (node.initializer) {
                    emit(node.initializer);
                }
                write(";");
                emitOptional(" " + getModuleName(node.condition), node.condition);
                write(";");
                emitOptional(" ", node.incrementor);
                write(")");
                emitEmbeddedStatement(node.statement);
            }

            function emitForInOrForOfStatement(node: ForInStatement | ForOfStatement) {
                if (languageVersion < ScriptTarget.ES6 && node.kind === SyntaxKind.ForOfStatement) {
                    return emitDownLevelForOfStatement(node);
                }
                let moduleName = "";
                let isContainedWithinModule = false;
                let endPos = emitToken(SyntaxKind.ForKeyword, node.pos);

                if (moduleName = getModuleName(node.initializer)) {
                    isContainedWithinModule = true;
                }

                write(" ");
                endPos = emitToken(SyntaxKind.OpenParenToken, endPos);
                if (node.initializer.kind === SyntaxKind.VariableDeclarationList) {
                    let variableDeclarationList = <VariableDeclarationList>node.initializer;
                    if (variableDeclarationList.declarations.length >= 1) {
                        if (!isContainedWithinModule) {
                            let start = tryGetStartOfVariableDeclarationList(variableDeclarationList, endPos);

                            if (start) {
                                write(start);
                            }
                        }
                        emit(variableDeclarationList.declarations[0]);
                    }
                }
                else {
                    write(moduleName);
                    emit(node.initializer);
                }

                if (node.kind === SyntaxKind.ForInStatement) {
                    write(" in ");
                }
                else {
                    write(" of ");
                }
                if (node.expression.kind === SyntaxKind.Identifier) {
                    write(moduleName);
                }
                emit(node.expression);
                emitToken(SyntaxKind.CloseParenToken, node.expression.end);
                emitEmbeddedStatement(node.statement);
            }

            function emitDownLevelForOfStatement(node: ForOfStatement) {
                var moduleName = getModuleName(node.expression);
                var isContainedWithinModule = !!moduleName;

                //
                //    for (let v of expr) { }
                //
                // should be emitted as
                //
                //    for (let _i = 0, _a = expr; _i < _a.length; _i++) {
                //        let v = _a[_i];
                //    }
                //
                // where _a and _i are temps emitted to capture the RHS and the counter,
                // respectively.
                // When the left hand side is an expression instead of a let declaration,
                // the "let v" is not emitted.
                // When the left hand side is a let/const, the v is renamed if there is
                // another v in scope.
                // Note that all assignments to the LHS are emitted in the body, including
                // all destructuring.
                // Note also that because an extra statement is needed to assign to the LHS,
                // for-of bodies are always emitted as blocks.

                let endPos = emitToken(SyntaxKind.ForKeyword, node.pos);
                write(" ");
                endPos = emitToken(SyntaxKind.OpenParenToken, endPos);
                // Do not emit the LHS let declaration yet, because it might contain destructuring.

                // Do not call recordTempDeclaration because we are declaring the temps
                // right here. Recording means they will be declared later.
                // In the case where the user wrote an identifier as the RHS, like this:
                //
                //     for (let v of arr) { }
                //
                // we don't want to emit a temporary variable for the RHS, just use it directly.
                let rhsIsIdentifier = node.expression.kind === SyntaxKind.Identifier;
                let counter = createTempVariable(TempFlags._i);
                let rhsReference = rhsIsIdentifier ? <Identifier>node.expression : createTempVariable(TempFlags.Auto);

                // This is the let keyword for the counter and rhsReference. The let keyword for
                // the LHS will be emitted inside the body.
                emitStart(node.expression);
                if (isContainedWithinModule) {
                    write(moduleName);
                }
                else {
                    write("var ");
                }

                // _i = 0
                emitNodeWithoutSourceMap(counter);
                write(" = 0");
                emitEnd(node.expression);

                if (!rhsIsIdentifier) {
                    // , _a = expr
                    write(", ");
                    emitStart(node.expression);
                    write(moduleName);
                    emitNodeWithoutSourceMap(rhsReference);
                    write(" = ");
                    emitNodeWithoutSourceMap(node.expression);
                    emitEnd(node.expression);
                }

                write("; ");

                // _i < _a.length;
                emitStart(node.initializer);
                if (isContainedWithinModule) {
                    write(moduleName);
                }
                emitNodeWithoutSourceMap(counter);
                write(" < ");
                emitModuleIfNeeded(rhsReference)
                emitNodeWithCommentsAndWithoutSourcemap(rhsReference);
                write(".length");
                emitEnd(node.initializer);
                write("; ");

                // _i++)
                emitStart(node.initializer);
                if (isContainedWithinModule) {
                    write(moduleName);
                }
                emitNodeWithoutSourceMap(counter);
                write("++");
                emitEnd(node.initializer);
                emitToken(SyntaxKind.CloseParenToken, node.expression.end);

                // Body
                write(" {");
                writeLine();
                increaseIndent();

                // Initialize LHS
                // let v = _a[_i];
                let rhsIterationValue = createElementAccessExpression(rhsReference, counter);
                emitStart(node.initializer);
                if (node.initializer.kind === SyntaxKind.VariableDeclarationList) {
                    if (!isContainedWithinModule) {
                        write("var ");
                    }
                    let variableDeclarationList = <VariableDeclarationList>node.initializer;
                    if (variableDeclarationList.declarations.length > 0) {
                        let declaration = variableDeclarationList.declarations[0];
                        if (isBindingPattern(declaration.name)) {
                            // This works whether the declaration is a var, let, or const.
                            // It will use rhsIterationValue _a[_i] as the initializer.
                            emitDestructuring(declaration, /*isAssignmentExpressionStatement*/ false, rhsIterationValue);
                        }
                        else {
                            // The following call does not include the initializer, so we have
                            // to emit it separately.
                            emitNodeWithCommentsAndWithoutSourcemap(declaration);
                            write(" = ");
                            emitModuleIfNeeded(rhsIterationValue);
                            emitNodeWithoutSourceMap(rhsIterationValue);
                        }
                    }
                    else {
                        // It's an empty declaration list. This can only happen in an error case, if the user wrote
                        //     for (let of []) {}
                        emitNodeWithoutSourceMap(createTempVariable(TempFlags.Auto));
                        write(" = ");
                        emitModuleIfNeeded(rhsIterationValue);
                        emitNodeWithoutSourceMap(rhsIterationValue);
                    }
                }
                else {
                    // Initializer is an expression. Emit the expression in the body, so that it's
                    // evaluated on every iteration.
                    let assignmentExpression = createBinaryExpression(<Expression>node.initializer, SyntaxKind.EqualsToken, rhsIterationValue, /*startsOnNewLine*/ false);
                    if (node.initializer.kind === SyntaxKind.ArrayLiteralExpression || node.initializer.kind === SyntaxKind.ObjectLiteralExpression) {
                        // This is a destructuring pattern, so call emitDestructuring instead of emit. Calling emit will not work, because it will cause
                        // the BinaryExpression to be passed in instead of the expression statement, which will cause emitDestructuring to crash.
                        emitDestructuring(assignmentExpression, /*isAssignmentExpressionStatement*/ true, /*value*/ undefined);
                    }
                    else {
                        emitNodeWithCommentsAndWithoutSourcemap(assignmentExpression);
                    }
                }
                emitEnd(node.initializer);
                write(";");

                if (node.statement.kind === SyntaxKind.Block) {
                    emitLines((<Block>node.statement).statements);
                }
                else {
                    writeLine();
                    emit(node.statement);
                }

                writeLine();
                decreaseIndent();
                write("}");
            }

            function emitBreakOrContinueStatement(node: BreakOrContinueStatement) {
                emitToken(node.kind === SyntaxKind.BreakStatement ? SyntaxKind.BreakKeyword : SyntaxKind.ContinueKeyword, node.pos);
                emitOptional(" ", node.label);
                write(";");
            }

            function emitReturnStatement(node: ReturnStatement) {
                emitToken(SyntaxKind.ReturnKeyword, node.pos);
                emitOptional(" ", node.expression);
                write(";");
            }

            function emitWithStatement(node: WithStatement) {
                write("with (");
                emit(node.expression);
                write(")");
                emitEmbeddedStatement(node.statement);
            }

            function emitSwitchStatement(node: SwitchStatement) {
                let endPos = emitToken(SyntaxKind.SwitchKeyword, node.pos);
                write(" ");
                emitToken(SyntaxKind.OpenParenToken, endPos);
                emit(node.expression);
                endPos = emitToken(SyntaxKind.CloseParenToken, node.expression.end);
                write(" ");
                emitCaseBlock(node.caseBlock, endPos);
            }

            function emitCaseBlock(node: CaseBlock, startPos: number): void {
                emitToken(SyntaxKind.OpenBraceToken, startPos);
                increaseIndent();
                emitLines(node.clauses);
                decreaseIndent();
                writeLine();
                emitToken(SyntaxKind.CloseBraceToken, node.clauses.end);
            }

            function nodeStartPositionsAreOnSameLine(node1: Node, node2: Node) {
                return getLineOfLocalPosition(currentSourceFile, skipTrivia(currentSourceFile.text, node1.pos)) ===
                    getLineOfLocalPosition(currentSourceFile, skipTrivia(currentSourceFile.text, node2.pos));
            }

            function nodeEndPositionsAreOnSameLine(node1: Node, node2: Node) {
                return getLineOfLocalPosition(currentSourceFile, node1.end) ===
                    getLineOfLocalPosition(currentSourceFile, node2.end);
            }

            function nodeEndIsOnSameLineAsNodeStart(node1: Node, node2: Node) {
                return getLineOfLocalPosition(currentSourceFile, node1.end) ===
                    getLineOfLocalPosition(currentSourceFile, skipTrivia(currentSourceFile.text, node2.pos));
            }

            function emitCaseOrDefaultClause(node: CaseOrDefaultClause) {
                if (node.kind === SyntaxKind.CaseClause) {
                    write("case ");
                    emit((<CaseClause>node).expression);
                    write(":");
                }
                else {
                    write("default:");
                }

                if (node.statements.length === 1 && nodeStartPositionsAreOnSameLine(node, node.statements[0])) {
                    write(" ");
                    emit(node.statements[0]);
                }
                else {
                    increaseIndent();
                    emitLines(node.statements);
                    decreaseIndent();
                }
            }

            function emitThrowStatement(node: ThrowStatement) {
                write("throw ");
                emit(node.expression);
                write(";");
            }

            function emitTryStatement(node: TryStatement) {
                write("try ");
                emit(node.tryBlock);
                emit(node.catchClause);
                if (node.finallyBlock) {
                    writeLine();
                    write("finally ");
                    emit(node.finallyBlock);
                }
            }

            function emitCatchClause(node: CatchClause) {
                writeLine();
                let endPos = emitToken(SyntaxKind.CatchKeyword, node.pos);
                write(" ");
                emitToken(SyntaxKind.OpenParenToken, endPos);
                emit(node.variableDeclaration);
                emitToken(SyntaxKind.CloseParenToken, node.variableDeclaration ? node.variableDeclaration.end : endPos);
                write(" ");
                emitBlock(node.block);
            }

            function emitDebuggerStatement(node: Node) {
                emitToken(SyntaxKind.DebuggerKeyword, node.pos);
                write(";");
            }

            function emitLabelledStatement(node: LabeledStatement) {
                emit(node.label);
                write(": ");
                emit(node.statement);
            }

            function isLiteral(node: Node): boolean {
                return node.kind === SyntaxKind.StringLiteral ||
                    node.kind === SyntaxKind.NumericLiteral ||
                    node.kind === SyntaxKind.ArrayLiteralExpression ||
                    node.kind === SyntaxKind.ObjectLiteralExpression;
            }

            function isForLoop(node: Node): boolean {
                return node.kind === SyntaxKind.ForStatement ||
                    node.kind === SyntaxKind.ForOfStatement ||
                    node.kind === SyntaxKind.ForInStatement;
            }

            function isNodeDeclaredWithinFunction(node: Node): boolean {
                var scope = getSymbolScope(node);
                if (scope && ts.isFunctionLike(scope)) {
                    return true;
                }

                return false;
            }

            function isScopeLike(node: Node): boolean {
                if (node && (ts.isFunctionLike(node) ||
                    node.kind === SyntaxKind.CatchClause ||
                    node.kind === SyntaxKind.SourceFile)) {
                    return true;
                }

                return false;
            }

            function isNodeDeclaredWithinScope(node: Node): boolean {
                return isScopeLike(getSymbolScope(node));
            }
            function isNodeContainedWithinModule(node: Node): boolean {
                return !!getContainingModule(node);
            }

            function getContainingModule(node: Node): ModuleDeclaration {
                do {
                    node = node.parent;
                } while (node && node.kind !== SyntaxKind.ModuleDeclaration);
                return <ModuleDeclaration>node;
            }

            function emitContainingModuleName(node: Node) {
                let container = getContainingModule(node);
                write(container ? getGeneratedNameForNode(container) : "exports");
            }

            function emitModuleMemberName(node: Declaration) {
                emitStart(node.name);
                emitNodeWithCommentsAndWithoutSourcemap(node.name);
                emitEnd(node.name);
            }

            function createVoidZero(): Expression {
                let zero = <LiteralExpression>createSynthesizedNode(SyntaxKind.NumericLiteral);
                zero.text = "0";
                let result = <VoidExpression>createSynthesizedNode(SyntaxKind.VoidExpression);
                result.expression = zero;
                return result;
            }

            function emitEs6ExportDefaultCompat(node: Node) {
                if (node.parent.kind === SyntaxKind.SourceFile) {
                    Debug.assert(!!(node.flags & NodeFlags.Default) || node.kind === SyntaxKind.ExportAssignment);
                    // only allow export default at a source file level
                    if (modulekind === ModuleKind.CommonJS || modulekind === ModuleKind.AMD || modulekind === ModuleKind.UMD) {
                        if (!currentSourceFile.symbol.exports["___esModule"]) {
                            if (languageVersion === ScriptTarget.ES5) {
                                // default value of configurable, enumerable, writable are `false`.
                                write("Object.defineProperty(exports, \"__esModule\", { value: true });");
                                writeLine();
                            }
                            else if (languageVersion === ScriptTarget.ES3) {
                                write("exports.__esModule = true;");
                                writeLine();
                            }
                        }
                    }
                }
            }

            function emitExportMemberAssignment(node: FunctionLikeDeclaration | ClassDeclaration) {
                if (node.flags & NodeFlags.Export) {
                    writeLine();
                    emitStart(node);

                    // emit call to exporter only for top level nodes
                    if (modulekind === ModuleKind.System && node.parent === currentSourceFile) {
                        // emit export default <smth> as
                        // export("default", <smth>)
                        write(`${exportFunctionForFile}("`);
                        if (node.flags & NodeFlags.Default) {
                            write("default");
                        }
                        else {
                            emitNodeWithCommentsAndWithoutSourcemap(node.name);
                        }
                        write(`", `);
                        emitDeclarationName(node);
                        write(")");
                    }
                    else {
                        if (node.flags & NodeFlags.Default) {
                            emitEs6ExportDefaultCompat(node);
                            if (languageVersion === ScriptTarget.ES3) {
                                write("exports[\"default\"]");
                            }
                            else {
                                write("exports.default");
                            }
                        }
                        else {
                            emitModuleMemberName(node);
                        }
                        write(" = ");
                        emitDeclarationName(node);
                    }
                    emitEnd(node);
                    write(";");
                }
            }

            function emitExportMemberAssignments(name: Identifier) {
                if (modulekind === ModuleKind.System) {
                    return;
                }

                if (!exportEquals && exportSpecifiers && hasProperty(exportSpecifiers, name.text)) {
                    for (let specifier of exportSpecifiers[name.text]) {
                        writeLine();
                        emitStart(specifier.name);
                        emitContainingModuleName(specifier);
                        write(".");
                        emitNodeWithCommentsAndWithoutSourcemap(specifier.name);
                        emitEnd(specifier.name);
                        write(" = ");
                        emitExpressionIdentifier(name);
                        write(";");
                    }
                }
            }

            function emitExportSpecifierInSystemModule(specifier: ExportSpecifier): void {
                Debug.assert(modulekind === ModuleKind.System);

                if (!resolver.getReferencedValueDeclaration(specifier.propertyName || specifier.name) && !resolver.isValueAliasDeclaration(specifier)) {
                    return;
                }

                writeLine();
                emitStart(specifier.name);
                write(`${exportFunctionForFile}("`);
                emitNodeWithCommentsAndWithoutSourcemap(specifier.name);
                write(`", `);
                emitExpressionIdentifier(specifier.propertyName || specifier.name);
                write(")");
                emitEnd(specifier.name);
                write(";");
            }

            /**
             * Emit an assignment to a given identifier, 'name', with a given expression, 'value'.
             * @param name an identifier as a left-hand-side operand of the assignment
             * @param value an expression as a right-hand-side operand of the assignment
             * @param shouldEmitCommaBeforeAssignment a boolean indicating whether to prefix an assignment with comma
             */
            function emitAssignment(name: Identifier, value: Expression, shouldEmitCommaBeforeAssignment: boolean) {
                if (shouldEmitCommaBeforeAssignment) {
                    write(", ");
                }

                let exportChanged = isNameOfExportedSourceLevelDeclarationInSystemExternalModule(name);

                if (exportChanged) {
                    write(`${exportFunctionForFile}("`);
                    emitNodeWithCommentsAndWithoutSourcemap(name);
                    write(`", `);
                }

                const isVariableDeclarationOrBindingElement =
                    name.parent && (name.parent.kind === SyntaxKind.VariableDeclaration || name.parent.kind === SyntaxKind.BindingElement);

                if (isVariableDeclarationOrBindingElement) {
                    emitModuleMemberName(<Declaration>name.parent);
                }
                else {
                    emit(name);
                }

                write(" = ");
                emit(value);

                if (exportChanged) {
                    write(")");
                }
            }

            /**
             * Create temporary variable, emit an assignment of the variable the given expression
             * @param expression an expression to assign to the newly created temporary variable
             * @param canDefineTempVariablesInPlace a boolean indicating whether you can define the temporary variable at an assignment location
             * @param shouldEmitCommaBeforeAssignment a boolean indicating whether an assignment should prefix with comma
             */
            function emitTempVariableAssignment(expression: Expression, canDefineTempVariablesInPlace: boolean, shouldEmitCommaBeforeAssignment: boolean): Identifier {
                let identifier = createTempVariable(TempFlags.Auto);
                if (!canDefineTempVariablesInPlace) {
                    recordTempDeclaration(identifier);
                }
                emitAssignment(identifier, expression, shouldEmitCommaBeforeAssignment);
                return identifier;
            }

            function emitDestructuring(root: BinaryExpression | VariableDeclaration | ParameterDeclaration, isAssignmentExpressionStatement: boolean, value?: Expression) {
                let emitCount = 0;

                // An exported declaration is actually emitted as an assignment (to a property on the module object), so
                // temporary variables in an exported declaration need to have real declarations elsewhere
                // Also temporary variables should be explicitly allocated for source level declarations when module target is system
                // because actual variable declarations are hoisted
                let canDefineTempVariablesInPlace = false;
                if (root.kind === SyntaxKind.VariableDeclaration) {
                    let isExported = getCombinedNodeFlags(root) & NodeFlags.Export;
                    let isSourceLevelForSystemModuleKind = shouldHoistDeclarationInSystemJsModule(root);
                    canDefineTempVariablesInPlace = !isExported && !isSourceLevelForSystemModuleKind;
                }
                else if (root.kind === SyntaxKind.Parameter) {
                    canDefineTempVariablesInPlace = true;
                }

                if (root.kind === SyntaxKind.BinaryExpression) {
                    emitAssignmentExpression(<BinaryExpression>root);
                }
                else {
                    Debug.assert(!isAssignmentExpressionStatement);
                    emitBindingElement(<BindingElement>root, value);
                }


                /**
                 * Ensures that there exists a declared identifier whose value holds the given expression.
                 * This function is useful to ensure that the expression's value can be read from in subsequent expressions.
                 * Unless 'reuseIdentifierExpressions' is false, 'expr' will be returned if it is just an identifier.
                 *
                 * @param expr the expression whose value needs to be bound.
                 * @param reuseIdentifierExpressions true if identifier expressions can simply be returned;
                 *                                   false if it is necessary to always emit an identifier.
                 */
                function ensureIdentifier(expr: Expression, reuseIdentifierExpressions: boolean): Expression {
                    if (expr.kind === SyntaxKind.Identifier && reuseIdentifierExpressions) {
                        return expr;
                    }

                    let identifier = emitTempVariableAssignment(expr, canDefineTempVariablesInPlace, emitCount > 0);
                    emitCount++;
                    return identifier;
                }

                function createDefaultValueCheck(value: Expression, defaultValue: Expression): Expression {
                    // The value expression will be evaluated twice, so for anything but a simple identifier
                    // we need to generate a temporary variable
                    value = ensureIdentifier(value, /*reuseIdentifierExpressions*/ true);
                    // Return the expression 'value === void 0 ? defaultValue : value'
                    let equals = <BinaryExpression>createSynthesizedNode(SyntaxKind.BinaryExpression);
                    equals.left = value;
                    equals.operatorToken = createSynthesizedNode(SyntaxKind.EqualsEqualsEqualsToken);
                    equals.right = createVoidZero();
                    return createConditionalExpression(equals, defaultValue, value);
                }

                function createConditionalExpression(condition: Expression, whenTrue: Expression, whenFalse: Expression) {
                    let cond = <ConditionalExpression>createSynthesizedNode(SyntaxKind.ConditionalExpression);
                    cond.condition = condition;
                    cond.questionToken = createSynthesizedNode(SyntaxKind.QuestionToken);
                    cond.whenTrue = whenTrue;
                    cond.colonToken = createSynthesizedNode(SyntaxKind.ColonToken);
                    cond.whenFalse = whenFalse;
                    return cond;
                }

                function createNumericLiteral(value: number) {
                    let node = <LiteralExpression>createSynthesizedNode(SyntaxKind.NumericLiteral);
                    node.text = "" + value;
                    return node;
                }

                function createPropertyAccessForDestructuringProperty(object: Expression, propName: Identifier | LiteralExpression): Expression {
                    // We create a synthetic copy of the identifier in order to avoid the rewriting that might
                    // otherwise occur when the identifier is emitted.
                    let syntheticName = <Identifier | LiteralExpression>createSynthesizedNode(propName.kind);
                    syntheticName.text = propName.text;
                    if (syntheticName.kind !== SyntaxKind.Identifier) {
                        return createElementAccessExpression(object, syntheticName);
                    }
                    return createPropertyAccessExpression(object, syntheticName);
                }

                function createSliceCall(value: Expression, sliceIndex: number): CallExpression {
                    let call = <CallExpression>createSynthesizedNode(SyntaxKind.CallExpression);
                    let sliceIdentifier = <Identifier>createSynthesizedNode(SyntaxKind.Identifier);
                    sliceIdentifier.text = "slice";
                    call.expression = createPropertyAccessExpression(value, sliceIdentifier);
                    call.arguments = <NodeArray<LiteralExpression>>createSynthesizedNodeArray();
                    call.arguments[0] = createNumericLiteral(sliceIndex);
                    return call;
                }

                function emitObjectLiteralAssignment(target: ObjectLiteralExpression, value: Expression) {
                    let properties = target.properties;
                    if (properties.length !== 1) {
                        // For anything but a single element destructuring we need to generate a temporary
                        // to ensure value is evaluated exactly once.
                        value = ensureIdentifier(value, /*reuseIdentifierExpressions*/ true);
                    }
                    for (let p of properties) {
                        if (p.kind === SyntaxKind.PropertyAssignment || p.kind === SyntaxKind.ShorthandPropertyAssignment) {
                            let propName = <Identifier | LiteralExpression>(<PropertyAssignment>p).name;
                            let target = p.kind === SyntaxKind.ShorthandPropertyAssignment ? <ShorthandPropertyAssignment>p : (<PropertyAssignment>p).initializer || propName;
                            emitDestructuringAssignment(target, createPropertyAccessForDestructuringProperty(value, propName));
                        }
                    }
                }

                function emitArrayLiteralAssignment(target: ArrayLiteralExpression, value: Expression) {
                    let elements = target.elements;
                    if (elements.length !== 1) {
                        // For anything but a single element destructuring we need to generate a temporary
                        // to ensure value is evaluated exactly once.
                        value = ensureIdentifier(value, /*reuseIdentifierExpressions*/ true);
                    }
                    for (let i = 0; i < elements.length; i++) {
                        let e = elements[i];
                        if (e.kind !== SyntaxKind.OmittedExpression) {
                            if (e.kind !== SyntaxKind.SpreadElementExpression) {
                                emitDestructuringAssignment(e, createElementAccessExpression(value, createNumericLiteral(i)));
                            }
                            else if (i === elements.length - 1) {
                                emitDestructuringAssignment((<SpreadElementExpression>e).expression, createSliceCall(value, i));
                            }
                        }
                    }
                }

                function emitDestructuringAssignment(target: Expression | ShorthandPropertyAssignment, value: Expression) {
                    if (target.kind === SyntaxKind.ShorthandPropertyAssignment) {
                        if ((<ShorthandPropertyAssignment>target).objectAssignmentInitializer) {
                            value = createDefaultValueCheck(value, (<ShorthandPropertyAssignment>target).objectAssignmentInitializer);
                        }
                        target = (<ShorthandPropertyAssignment>target).name;
                    }
                    else if (target.kind === SyntaxKind.BinaryExpression && (<BinaryExpression>target).operatorToken.kind === SyntaxKind.EqualsToken) {
                        value = createDefaultValueCheck(value, (<BinaryExpression>target).right);
                        target = (<BinaryExpression>target).left;
                    }
                    if (target.kind === SyntaxKind.ObjectLiteralExpression) {
                        emitObjectLiteralAssignment(<ObjectLiteralExpression>target, value);
                    }
                    else if (target.kind === SyntaxKind.ArrayLiteralExpression) {
                        emitArrayLiteralAssignment(<ArrayLiteralExpression>target, value);
                    }
                    else {
                        emitAssignment(<Identifier>target, value, /*shouldEmitCommaBeforeAssignment*/ emitCount > 0);
                        emitCount++;
                    }
                }

                function emitAssignmentExpression(root: BinaryExpression) {
                    let target = root.left;
                    let value = root.right;

                    if (isEmptyObjectLiteralOrArrayLiteral(target)) {
                        emit(value);
                    }
                    else if (isAssignmentExpressionStatement) {
                        emitDestructuringAssignment(target, value);
                    }
                    else {
                        if (root.parent.kind !== SyntaxKind.ParenthesizedExpression) {
                            write("(");
                        }
                        value = ensureIdentifier(value, /*reuseIdentifierExpressions*/ true);
                        emitDestructuringAssignment(target, value);
                        write(", ");
                        emit(value);
                        if (root.parent.kind !== SyntaxKind.ParenthesizedExpression) {
                            write(")");
                        }
                    }
                }

                function emitBindingElement(target: BindingElement | VariableDeclaration, value: Expression) {
                    if (target.initializer) {
                        // Combine value and initializer
                        value = value ? createDefaultValueCheck(value, target.initializer) : target.initializer;
                    }
                    else if (!value) {
                        // Use 'void 0' in absence of value and initializer
                        value = createVoidZero();
                    }
                    if (isBindingPattern(target.name)) {
                        const pattern = <BindingPattern>target.name;
                        const elements = pattern.elements;
                        const numElements = elements.length;

                        if (numElements !== 1) {
                            // For anything other than a single-element destructuring we need to generate a temporary
                            // to ensure value is evaluated exactly once. Additionally, if we have zero elements
                            // we need to emit *something* to ensure that in case a 'var' keyword was already emitted,
                            // so in that case, we'll intentionally create that temporary.
                            value = ensureIdentifier(value, /*reuseIdentifierExpressions*/ numElements !== 0);
                        }

                        for (let i = 0; i < numElements; i++) {
                            let element = elements[i];
                            if (pattern.kind === SyntaxKind.ObjectBindingPattern) {
                                // Rewrite element to a declaration with an initializer that fetches property
                                let propName = element.propertyName || <Identifier>element.name;
                                emitBindingElement(element, createPropertyAccessForDestructuringProperty(value, propName));
                            }
                            else if (element.kind !== SyntaxKind.OmittedExpression) {
                                if (!element.dotDotDotToken) {
                                    // Rewrite element to a declaration that accesses array element at index i
                                    emitBindingElement(element, createElementAccessExpression(value, createNumericLiteral(i)));
                                }
                                else if (i === numElements - 1) {
                                    emitBindingElement(element, createSliceCall(value, i));
                                }
                            }
                        }
                    }
                    else {
                        emitAssignment(<Identifier>target.name, value, /*shouldEmitCommaBeforeAssignment*/ emitCount > 0);
                        emitCount++;
                    }
                }
            }

            function emitVariableDeclaration(node: VariableDeclaration) {
                if (isBindingPattern(node.name)) {
                    if (languageVersion < ScriptTarget.ES6) {
                        emitDestructuring(node, /*isAssignmentExpressionStatement*/ false);
                    }
                    else {
                        emit(node.name);
                        emitOptional(" = ", node.initializer);
                    }
                }
                else {
                    let initializer = node.initializer;
                    if (!initializer && languageVersion < ScriptTarget.ES6) {

                        // downlevel emit for non-initialized let bindings defined in loops
                        // for (...) {  let x; }
                        // should be
                        // for (...) { var <some-uniqie-name> = void 0; }
                        // this is necessary to preserve ES6 semantic in scenarios like
                        // for (...) { let x; console.log(x); x = 1 } // assignment on one iteration should not affect other iterations
                        let isUninitializedLet =
                            (resolver.getNodeCheckFlags(node) & NodeCheckFlags.BlockScopedBindingInLoop) &&
                            (getCombinedFlagsForIdentifier(<Identifier>node.name) & NodeFlags.Let);

                        // NOTE: default initialization should not be added to let bindings in for-in\for-of statements
                        if (isUninitializedLet &&
                            node.parent.parent.kind !== SyntaxKind.ForInStatement &&
                            node.parent.parent.kind !== SyntaxKind.ForOfStatement) {
                            initializer = createVoidZero();
                        }
                    }

                    let exportChanged = isNameOfExportedSourceLevelDeclarationInSystemExternalModule(node.name);

                    if (exportChanged) {
                        write(`${exportFunctionForFile}("`);
                        emitNodeWithCommentsAndWithoutSourcemap(node.name);
                        write(`", `);
                    }

                    if (initializer) {
                        if (initializer.kind === SyntaxKind.ObjectLiteralExpression && !isNodeDeclaredWithinScope(node)) {
                            forceWriteLine();
                        }
                        if (ts.isFunctionLike(initializer)) {
                            emitFunctionAnnotation(<ArrowFunction>initializer);
                        }
                    }

                    emitModuleIfNeeded(node);
                    emitModuleMemberName(node);

                    if (initializer) {
                        write(" = ");
                        if (!isLiteral(initializer) && initializer.kind !== SyntaxKind.PropertyAccessExpression) {
                            emitModuleIfNeeded(initializer);
                        }
                        emit(initializer);
                    }

                    if (exportChanged) {
                        write(")");
                    }
                }
            }

            function emitExportVariableAssignments(node: VariableDeclaration | BindingElement) {
                if (node.kind === SyntaxKind.OmittedExpression) {
                    return;
                }
                let name = node.name;
                if (name.kind === SyntaxKind.Identifier) {
                    emitExportMemberAssignments(<Identifier>name);
                }
                else if (isBindingPattern(name)) {
                    forEach((<BindingPattern>name).elements, emitExportVariableAssignments);
                }
            }

            function getCombinedFlagsForIdentifier(node: Identifier): NodeFlags {
                if (!node.parent || (node.parent.kind !== SyntaxKind.VariableDeclaration && node.parent.kind !== SyntaxKind.BindingElement)) {
                    return 0;
                }

                return getCombinedNodeFlags(node.parent);
            }

            function isES6ExportedDeclaration(node: Node) {
                return !!(node.flags & NodeFlags.Export) &&
                    modulekind === ModuleKind.ES6 &&
                    node.parent.kind === SyntaxKind.SourceFile;
            }

            function emitVariableStatement(node: VariableStatement) {
                let nodeIndex: number;
                let startIsEmitted: string;
                let statement: VariableStatement;
                let parentStatements = (<Block>node.parent).statements;
                let nodeFirstVariable = node.declarationList.declarations[0];

                if (parentStatements) {
                    nodeIndex = parentStatements.indexOf(node);

                    if (nodeIndex === 0) {
                        statement = <VariableStatement>parentStatements[0];
                    }
                    else {
                        var prevStatement = parentStatements[nodeIndex - 1];

                        if (prevStatement.kind !== SyntaxKind.VariableStatement) {
                            statement = <VariableStatement>parentStatements[nodeIndex];
                        }
                    }

                    if (statement) {
                        var firstDeclaration = statement.declarationList.declarations[0];

                        if (!ts.isFunctionLike(getSymbolScope(firstDeclaration))) {
                            forceWriteLine();
                        }
                    }
                }

                if (node.flags & NodeFlags.Export) {
                    if (isES6ExportedDeclaration(node)) {
                        // Exported ES6 module member
                        write("export ");
                        startIsEmitted = tryGetStartOfVariableDeclarationList(node.declarationList);
                    }
                }
                else {
                    if (isNodeDeclaredWithinScope(nodeFirstVariable)) {
                        startIsEmitted = tryGetStartOfVariableDeclarationList(node.declarationList);
                    }
                }

                if (startIsEmitted) {
                    if (nodeFirstVariable.kind !== SyntaxKind.Parameter) {
                        emitVariableTypeAnnotation(nodeFirstVariable);
                    }
                    write(startIsEmitted);
                    emitCommaList(node.declarationList.declarations);
                    write(";");
                }
                else {
                    let atLeastOneItem = emitVariableDeclarationListSkippingUninitializedEntries(node.declarationList);
                    if (atLeastOneItem) {
                        write(";");
                    }
                }
                if (modulekind !== ModuleKind.ES6 && node.parent === currentSourceFile) {
                    forEach(node.declarationList.declarations, emitExportVariableAssignments);
                }
            }

            function shouldEmitLeadingAndTrailingCommentsForVariableStatement(node: VariableStatement) {
                // If we're not exporting the variables, there's nothing special here.
                // Always emit comments for these nodes.
                if (!(node.flags & NodeFlags.Export)) {
                    return true;
                }

                // If we are exporting, but it's a top-level ES6 module exports,
                // we'll emit the declaration list verbatim, so emit comments too.
                if (isES6ExportedDeclaration(node)) {
                    return true;
                }

                // Otherwise, only emit if we have at least one initializer present.
                for (let declaration of node.declarationList.declarations) {
                    if (declaration.initializer) {
                        return true;
                    }
                }
                return false;
            }

            function emitParameter(node: ParameterDeclaration) {
                if (languageVersion < ScriptTarget.ES6) {
                    if (isBindingPattern(node.name)) {
                        let name = createTempVariable(TempFlags.Auto);
                        if (!tempParameters) {
                            tempParameters = [];
                        }
                        tempParameters.push(name);
                        emit(name);
                    }
                    else {
                        emit(node.name);

                        if (ts.isRestParameter(node)) {
                            write("$rest");
                        }
                    }
                }
                else {
                    if (node.dotDotDotToken) {
                        write("...");
                    }
                    emit(node.name);
                    emitOptional(" = ", node.initializer);
                }
            }

            function emitDefaultValueAssignments(node: FunctionLikeDeclaration) {
                if (languageVersion < ScriptTarget.ES6) {
                    let tempIndex = 0;
                    forEach(node.parameters, parameter => {
                        // A rest parameter cannot have a binding pattern or an initializer,
                        // so let's just ignore it.
                        if (parameter.dotDotDotToken) {
                            return;
                        }

                        let { name: paramName, initializer } = parameter;
                        if (isBindingPattern(paramName)) {
                            // In cases where a binding pattern is simply '[]' or '{}',
                            // we usually don't want to emit a var declaration; however, in the presence
                            // of an initializer, we must emit that expression to preserve side effects.
                            let hasBindingElements = paramName.elements.length > 0;
                            if (hasBindingElements || initializer) {
                                writeLine();
                                write("var ");

                                if (hasBindingElements) {
                                    emitDestructuring(parameter, /*isAssignmentExpressionStatement*/ false, tempParameters[tempIndex]);
                                }
                                else {
                                    emit(tempParameters[tempIndex]);
                                    write(" = ");
                                    emit(initializer);
                                }

                                write(";");
                                tempIndex++;
                            }
                        }
                        else if (initializer) {
                            writeLine();
                            emitStart(parameter);
                            write("if (");
                            emitNodeWithoutSourceMap(paramName);
                            write(" === void 0)");
                            emitEnd(parameter);
                            write(" { ");
                            emitStart(parameter);
                            emitNodeWithCommentsAndWithoutSourcemap(paramName);
                            write(" = ");
                            emitNodeWithCommentsAndWithoutSourcemap(initializer);
                            emitEnd(parameter);
                            write("; }");
                        }
                    });
                }
            }

            function emitRestParameter(node: FunctionLikeDeclaration) {
                if (languageVersion < ScriptTarget.ES6 && hasRestParameter(node)) {
                    let restIndex = node.parameters.length - 1;
                    let restParam = node.parameters[restIndex];

                    // A rest parameter cannot have a binding pattern, so let's just ignore it if it does.
                    if (isBindingPattern(restParam.name)) {
                        return;
                    }

                    let tempName = createTempVariable(TempFlags._i).text;
                    writeLine();
                    emitLeadingComments(restParam);
                    emitStart(restParam);
                    emitArrayTypeAnnotation(restParam);
                    write("var ");
                    emitNodeWithCommentsAndWithoutSourcemap(restParam.name);
                    write(" = [];");
                    emitEnd(restParam);
                    emitTrailingComments(restParam);
                    writeLine();
                    write("for (");
                    emitStart(restParam);
                    write("var " + tempName + " = " + restIndex + ";");
                    emitEnd(restParam);
                    write(" ");
                    emitStart(restParam);
                    write(tempName + " < arguments.length;");
                    emitEnd(restParam);
                    write(" ");
                    emitStart(restParam);
                    write(tempName + "++");
                    emitEnd(restParam);
                    write(") {");
                    increaseIndent();
                    writeLine();
                    emitStart(restParam);
                    emitNodeWithCommentsAndWithoutSourcemap(restParam.name);
                    write("[" + tempName + " - " + restIndex + "] = arguments[" + tempName + "];");
                    emitEnd(restParam);
                    decreaseIndent();
                    writeLine();
                    write("}");
                }
            }

            function emitAccessor(node: AccessorDeclaration) {
                write(node.kind === SyntaxKind.GetAccessor ? "get " : "set ");
                emit(node.name);
                emitSignatureAndBody(node);
            }

            function shouldEmitAsArrowFunction(node: FunctionLikeDeclaration): boolean {
                return node.kind === SyntaxKind.ArrowFunction && languageVersion >= ScriptTarget.ES6;
            }

            function emitDeclarationName(node: Declaration) {
                if (node.name) {
                    emitNodeWithCommentsAndWithoutSourcemap(node.name);
                }
                else {
                    write(getGeneratedNameForNode(node));
                }
            }

            function shouldEmitFunctionName(node: FunctionLikeDeclaration) {
                if (node.kind === SyntaxKind.FunctionExpression) {
                    // Emit name if one is present
                    return !!node.name;
                }
                if (node.kind === SyntaxKind.FunctionDeclaration) {
                    // Emit name if one is present, or emit generated name in down-level case (for export default case)
                    return !!node.name || languageVersion < ScriptTarget.ES6;
                }
            }

            function isInterfaceFunctionMember(member: Node): boolean {
                let node = member.parent;

                return node.kind === SyntaxKind.MethodSignature ||
                    member.kind === SyntaxKind.MethodSignature ||
                    member.kind === SyntaxKind.PropertySignature && (<any>member).type.kind === SyntaxKind.FunctionType;
            }

            function emitFunctionDeclaration(node: FunctionLikeDeclaration) {
                let emitFunctionName = true;
                let emittedNode: Node = node;
                let shouldEmitSemicolon = false;
                let symbolScope = getSymbolScope(node);
                let isDeclaredWithinFunction = ts.isFunctionLike(symbolScope);
                let nodeIsInterfaceFunctionMember = isInterfaceFunctionMember(node);

                // TODO (yuisu) : we should not have special cases to condition emitting comments
                // but have one place to fix check for these conditions.
                if (node.kind !== SyntaxKind.MethodDeclaration && node.kind !== SyntaxKind.MethodSignature &&
                    node.parent && node.parent.kind !== SyntaxKind.PropertyAssignment &&
                    node.parent.kind !== SyntaxKind.CallExpression) {
                    // 1. Methods will emit the comments as part of emitting method declaration

                    // 2. If the function is a property of object literal, emitting leading-comments
                    // is done by emitNodeWithoutSourceMap which then call this function.
                    // In particular, we would like to avoid emit comments twice in following case:
                    //      For example:
                    //          var obj = {
                    //              id:
                    //                  /*comment*/ () => void
                    //          }

                    // 3. If the function is an argument in call expression, emitting of comments will be
                    // taken care of in emit list of arguments inside of emitCallexpression
                    emitLeadingComments(node);
                }

                emitStart(node);
                // For targeting below es6, emit functions-like declaration including arrow function using function keyword.
                // When targeting ES6, emit arrow function natively in ES6 by omitting function keyword and using fat arrow instead
                if (!shouldEmitAsArrowFunction(node)) {
                    if (isES6ExportedDeclaration(node)) {
                        write("export ");
                        if (node.flags & NodeFlags.Default) {
                            write("default ");
                        }
                    }

                    if (node.kind === SyntaxKind.MethodDeclaration || node.kind === SyntaxKind.FunctionDeclaration || nodeIsInterfaceFunctionMember) {
                        let tryEmitModule = node.kind === SyntaxKind.MethodDeclaration || !isScopeLike(symbolScope) || nodeIsInterfaceFunctionMember;

                        if (node.kind === SyntaxKind.FunctionDeclaration) {
                            if (!isDeclaredWithinFunction) {
                                forceWriteLine();
                            }

                            emitFunctionAnnotation(node);
                        }

                        if (tryEmitModule) {
                            if (shouldEmitSemicolon = emitModuleForFunctionIfNeeded(node)) {
                                emitFunctionName = false;
                                emitDeclarationName(node);
                                write(" = ");
                            }
                        }
                        else {
                            if (node.kind === SyntaxKind.FunctionDeclaration && (symbolScope.kind === SyntaxKind.SourceFile || isDeclaredWithinFunction)) {
                                shouldEmitSemicolon = true;
                            }
                            emitFunctionName = false;
                            write("var ");
                            emitDeclarationName(node);
                            write(" = ");
                        }
                    }

                    write("function");
                    if (languageVersion >= ScriptTarget.ES6 && node.asteriskToken) {
                        write("*");
                    }
                    write(" ");
                }

                if (emitFunctionName && shouldEmitFunctionName(node)) {
                    emitDeclarationName(node);
                }

                if (nodeIsInterfaceFunctionMember) {
                    if (node.kind === 140) {
                        emittedNode = node.type;
                    }

                    emitSignatureParameters(<FunctionLikeDeclaration>emittedNode);
                    write(" { }");
                }
                else if (!ts.nodeIsMissing(node.body)) {
                    emitSignatureAndBody(node);
                }

                if (modulekind !== ModuleKind.ES6 && node.kind === SyntaxKind.FunctionDeclaration && node.parent === currentSourceFile && node.name) {
                    emitExportMemberAssignments((<FunctionDeclaration>node).name);
                }

                emitEnd(node);
                if (node.kind !== SyntaxKind.MethodDeclaration && node.kind !== SyntaxKind.MethodSignature) {
                    emitTrailingComments(node);
                }

                if (shouldEmitSemicolon) {
                    write(";");
                }
            }

            function emitCaptureThisForNodeIfNecessary(node: Node): void {
                if (resolver.getNodeCheckFlags(node) & NodeCheckFlags.CaptureThis) {
                    writeLine();
                    emitStart(node);
                    write("var _this = this;");
                    emitEnd(node);
                }
            }

            function emitSignatureParameters(node: FunctionLikeDeclaration) {
                increaseIndent();
                write("(");
                if (node) {
                    let parameters = node.parameters;
                    emitList(parameters, 0, parameters.length - 0, /*multiLine*/ false, /*trailingComma*/ false);
                }
                write(")");
                decreaseIndent();
            }

            function emitSignatureParametersForArrow(node: FunctionLikeDeclaration) {
                // Check whether the parameter list needs parentheses and preserve no-parenthesis
                if (node.parameters.length === 1 && node.pos === node.parameters[0].pos) {
                    emit(node.parameters[0]);
                    return;
                }

                emitSignatureParameters(node);
            }

            function emitAsyncFunctionBodyForES6(node: FunctionLikeDeclaration) {
                let promiseConstructor = getEntityNameFromTypeNode(node.type);
                let isArrowFunction = node.kind === SyntaxKind.ArrowFunction;
                let hasLexicalArguments = (resolver.getNodeCheckFlags(node) & NodeCheckFlags.CaptureArguments) !== 0;
                let args: string;

                // An async function is emit as an outer function that calls an inner
                // generator function. To preserve lexical bindings, we pass the current
                // `this` and `arguments` objects to `__awaiter`. The generator function
                // passed to `__awaiter` is executed inside of the callback to the
                // promise constructor.
                //
                // The emit for an async arrow without a lexical `arguments` binding might be:
                //
                //  // input
                //  let a = async (b) => { await b; }
                //
                //  // output
                //  let a = (b) => __awaiter(this, void 0, void 0, function* () {
                //      yield b;
                //  });
                //
                // The emit for an async arrow with a lexical `arguments` binding might be:
                //
                //  // input
                //  let a = async (b) => { await arguments[0]; }
                //
                //  // output
                //  let a = (b) => __awaiter(this, arguments, void 0, function* (arguments) {
                //      yield arguments[0];
                //  });
                //
                // The emit for an async function expression without a lexical `arguments` binding
                // might be:
                //
                //  // input
                //  let a = async function (b) {
                //      await b;
                //  }
                //
                //  // output
                //  let a = function (b) {
                //      return __awaiter(this, void 0, void 0, function* () {
                //          yield b;
                //      });
                //  }
                //
                // The emit for an async function expression with a lexical `arguments` binding
                // might be:
                //
                //  // input
                //  let a = async function (b) {
                //      await arguments[0];
                //  }
                //
                //  // output
                //  let a = function (b) {
                //      return __awaiter(this, arguments, void 0, function* (_arguments) {
                //          yield _arguments[0];
                //      });
                //  }
                //
                // The emit for an async function expression with a lexical `arguments` binding
                // and a return type annotation might be:
                //
                //  // input
                //  let a = async function (b): MyPromise<any> {
                //      await arguments[0];
                //  }
                //
                //  // output
                //  let a = function (b) {
                //      return __awaiter(this, arguments, MyPromise, function* (_arguments) {
                //          yield _arguments[0];
                //      });
                //  }
                //

                // If this is not an async arrow, emit the opening brace of the function body
                // and the start of the return statement.
                if (!isArrowFunction) {
                    write(" {");
                    increaseIndent();
                    writeLine();
                    write("return");
                }

                write(" __awaiter(this");
                if (hasLexicalArguments) {
                    write(", arguments");
                }
                else {
                    write(", void 0");
                }

                if (promiseConstructor) {
                    write(", ");
                    emitNodeWithoutSourceMap(promiseConstructor);
                }
                else {
                    write(", Promise");
                }

                // Emit the call to __awaiter.
                if (hasLexicalArguments) {
                    write(", function* (_arguments)");
                }
                else {
                    write(", function* ()");
                }

                // Emit the signature and body for the inner generator function.
                emitFunctionBody(node);
                write(")");

                // If this is not an async arrow, emit the closing brace of the outer function body.
                if (!isArrowFunction) {
                    write(";");
                    decreaseIndent();
                    writeLine();
                    write("}");
                }
            }

            function emitFunctionBody(node: FunctionLikeDeclaration) {
                if (!node.body) {
                    // There can be no body when there are parse errors.  Just emit an empty block
                    // in that case.
                    write(" { }");
                }
                else {
                    if (node.body.kind === SyntaxKind.Block) {
                        emitBlockFunctionBody(node, <Block>node.body);
                    }
                    else {
                        emitExpressionFunctionBody(node, <Expression>node.body);
                    }
                }
            }

            function emitSignatureAndBody(node: FunctionLikeDeclaration) {
                let saveTempFlags = tempFlags;
                let saveTempVariables = tempVariables;
                let saveTempParameters = tempParameters;
                tempFlags = 0;
                tempVariables = undefined;
                tempParameters = undefined;

                // When targeting ES6, emit arrow function natively in ES6
                if (shouldEmitAsArrowFunction(node)) {
                    emitSignatureParametersForArrow(node);
                    write(" =>");
                }
                else {
                    emitSignatureParameters(node);
                }

                let isAsync = isAsyncFunctionLike(node);
                if (isAsync && languageVersion === ScriptTarget.ES6) {
                    emitAsyncFunctionBodyForES6(node);
                }
                else {
                    emitFunctionBody(node);
                }

                if (!isES6ExportedDeclaration(node)) {
                    emitExportMemberAssignment(node);
                }

                tempFlags = saveTempFlags;
                tempVariables = saveTempVariables;
                tempParameters = saveTempParameters;
            }

            // Returns true if any preamble code was emitted.
            function emitFunctionBodyPreamble(node: FunctionLikeDeclaration): void {
                emitCaptureThisForNodeIfNecessary(node);
                emitDefaultValueAssignments(node);
                emitRestParameter(node);
            }

            function emitExpressionFunctionBody(node: FunctionLikeDeclaration, body: Expression) {
                if (languageVersion < ScriptTarget.ES6 || node.flags & NodeFlags.Async) {
                    emitDownLevelExpressionFunctionBody(node, body);
                    return;
                }

                // For es6 and higher we can emit the expression as is.  However, in the case
                // where the expression might end up looking like a block when emitted, we'll
                // also wrap it in parentheses first.  For example if you have: a => <foo>{}
                // then we need to generate: a => ({})
                write(" ");

                // Unwrap all type assertions.
                let current = body;
                while (current.kind === SyntaxKind.TypeAssertionExpression) {
                    current = (<TypeAssertion>current).expression;
                }

                emitParenthesizedIf(body, current.kind === SyntaxKind.ObjectLiteralExpression);
            }

            function emitDownLevelExpressionFunctionBody(node: FunctionLikeDeclaration, body: Expression) {
                write(" {");
                scopeEmitStart(node);

                increaseIndent();
                let outPos = writer.getTextPos();
                emitDetachedComments(node.body);
                emitFunctionBodyPreamble(node);
                let preambleEmitted = writer.getTextPos() !== outPos;
                decreaseIndent();

                // If we didn't have to emit any preamble code, then attempt to keep the arrow
                // function on one line.
                if (!preambleEmitted && nodeStartPositionsAreOnSameLine(node, body)) {
                    write(" ");
                    emitStart(body);
                    write("return ");
                    emit(body);
                    emitEnd(body);
                    write(";");
                    emitTempDeclarations(/*newLine*/ false);
                    write(" ");
                }
                else {
                    increaseIndent();
                    writeLine();
                    emitLeadingComments(node.body);
                    write("return ");
                    emit(body);
                    write(";");
                    emitTrailingComments(node.body);

                    emitTempDeclarations(/*newLine*/ true);
                    decreaseIndent();
                    writeLine();
                }

                emitStart(node.body);
                write("}");
                emitEnd(node.body);

                scopeEmitEnd();
            }

            function emitBlockFunctionBody(node: FunctionLikeDeclaration, body: Block) {
                write(" {");
                scopeEmitStart(node);
                let initialTextPos = writer.getTextPos();
                increaseIndent();
                emitDetachedComments(body.statements);
                // Emit all the directive prologues (like "use strict").  These have to come before
                // any other preamble code we write (like parameter initializers).
                let startIndex = emitDirectivePrologues(body.statements, /*startWithNewLine*/ true);
                emitFunctionBodyPreamble(node);
                decreaseIndent();
                increaseIndent();
                emitLinesStartingAt(body.statements, startIndex);
                emitTempDeclarations(/*newLine*/ true);
                writeLine();
                emitLeadingCommentsOfPosition(body.statements.end);
                decreaseIndent();
                emitToken(SyntaxKind.CloseBraceToken, body.statements.end);
                scopeEmitEnd();
            }

            function findInitialSuperCall(ctor: ConstructorDeclaration): ExpressionStatement {
                if (ctor.body) {
                    let statement = (<Block>ctor.body).statements[0];
                    if (statement && statement.kind === SyntaxKind.ExpressionStatement) {
                        let expr = (<ExpressionStatement>statement).expression;
                        if (expr && expr.kind === SyntaxKind.CallExpression) {
                            let func = (<CallExpression>expr).expression;
                            if (func && func.kind === SyntaxKind.SuperKeyword) {
                                return <ExpressionStatement>statement;
                            }
                        }
                    }
                }
            }

            function emitParameterPropertyAssignments(node: ConstructorDeclaration) {
                forEach(node.parameters, param => {
                    if (param.flags & NodeFlags.AccessibilityModifier) {
                        writeLine();
                        emitStart(param);
                        emitStart(param.name);
                        emitPropertyOrParamterAnnotation(param, true);
                        write("this.");
                        emitNodeWithoutSourceMap(param.name);
                        emitEnd(param.name);
                        write(" = ");
                        emit(param.name);
                        write(";");
                        emitEnd(param);
                    }
                });
            }

            function emitMemberAccessForPropertyName(memberName: DeclarationName) {
                // This does not emit source map because it is emitted by caller as caller
                // is aware how the property name changes to the property access
                // eg. public x = 10; becomes this.x and static x = 10 becomes className.x
                if (memberName.kind === SyntaxKind.StringLiteral || memberName.kind === SyntaxKind.NumericLiteral) {
                    write("[");
                    emitNodeWithCommentsAndWithoutSourcemap(memberName);
                    write("]");
                }
                else if (memberName.kind === SyntaxKind.ComputedPropertyName) {
                    emitComputedPropertyName(<ComputedPropertyName>memberName);
                }
                else {
                    write(".");
                    emitNodeWithCommentsAndWithoutSourcemap(memberName);
                }
            }

            function getProperties(node: ClassLikeDeclaration, isStatic: boolean) {
                let properties: PropertyDeclaration[] = [];
                for (let member of node.members) {
                    if (member.kind === SyntaxKind.PropertyDeclaration && isStatic === ((member.flags & NodeFlags.Static) !== 0)) {
                        properties.push(<PropertyDeclaration>member);
                    }
                }

                return properties;
            }

            function emitPropertyDeclarations(node: ClassLikeDeclaration, properties: PropertyDeclaration[]) {
                for (let property of properties) {
                    emitPropertyDeclaration(node, property);
                }
            }

            function emitPropertyDeclaration(node: ClassLikeDeclaration, property: PropertyDeclaration, receiver?: Identifier, isExpression?: boolean) {
                let isStaticProperty = property.flags & NodeFlags.Static;
                let nodeIsInterface = node.kind === SyntaxKind.InterfaceDeclaration;

                writeLine();
                emitLeadingComments(property);
                emitStart(property);
                emitStart(property.name);
                if (receiver) {
                    emit(receiver);
                }
                else {
                    if (isStaticProperty) {
                        forceWriteLine();
                        emitPropertyOrParamterAnnotation(property);
                        emitModuleIfNeeded(node);
                        emitDeclarationName(node);
                    }
                    else if (nodeIsInterface) {
                        if (property.kind === SyntaxKind.IndexSignature) {
                            return;
                        }
                        forceWriteLine();
                        emitPropertyOrParamterAnnotation(property);
                        emitClassMemberPrefix(node, property);
                    }
                    else {
                        emitPropertyOrParamterAnnotation(property);
                        write("this");
                    }
                }
                if (property.name) {
                    emitMemberAccessForPropertyName(property.name);
                }

                emitEnd(property.name);

                if (!nodeIsInterface && property.initializer) {
                    write(" = ");
                    emit(property.initializer);
                }

                if (!isExpression) {
                    write(";");
                }

                emitEnd(property);
                emitTrailingComments(property);
            }

            function emitMemberFunctionsForES5AndLower(node: ClassLikeDeclaration) {
                forEach(node.members, member => {
                    if (member.kind === SyntaxKind.SemicolonClassElement) {
                        writeLine();
                        write(";");
                    }
                    else if (member.kind === SyntaxKind.MethodDeclaration || node.kind === SyntaxKind.MethodSignature || isInterfaceFunctionMember(member)) {
                        if (ts.nodeIsMissing((<MethodDeclaration>member).body) && member.parent.kind !== SyntaxKind.InterfaceDeclaration) {
                            return emitCommentsOnNotEmittedNode(member);
                        }

                        forceWriteLine();
                        forceWriteLine();
                        emitLeadingComments(member);
                        emitStart(member);
                        emitStart((<MethodDeclaration>member).name);
                        emitFunctionAnnotation(<MethodDeclaration>member);
                        emitClassMemberPrefix(node, member);
                        emitMemberAccessForPropertyName((<MethodDeclaration>member).name);
                        emitEnd((<MethodDeclaration>member).name);
                        write(" = ");
                        emitFunctionDeclaration(<MethodDeclaration>member);
                        emitEnd(member);
                        write(";");
                        emitTrailingComments(member);
                    }
                    else if (member.kind === SyntaxKind.GetAccessor || member.kind === SyntaxKind.SetAccessor) {
                        let accessors = getAllAccessorDeclarations(node.members, <AccessorDeclaration>member);
                        if (member === accessors.firstAccessor) {
                            forceWriteLine();
                            emitStart(member);
                            write("Object.defineProperty(");
                            emitStart((<AccessorDeclaration>member).name);
                            emitClassMemberPrefix(node, member);
                            write(", ");
                            emitExpressionForPropertyName((<AccessorDeclaration>member).name);
                            emitEnd((<AccessorDeclaration>member).name);
                            write(", {");
                            increaseIndent();
                            if (accessors.getAccessor) {
                                writeLine();
                                emitLeadingComments(accessors.getAccessor);
                                emitFunctionAnnotation(<AccessorDeclaration>member);
                                write("get: ");
                                emitStart(accessors.getAccessor);
                                write("function ");
                                emitSignatureAndBody(accessors.getAccessor);
                                emitEnd(accessors.getAccessor);
                                emitTrailingComments(accessors.getAccessor);
                                write(",");
                            }
                            if (accessors.setAccessor) {
                                writeLine();
                                emitLeadingComments(accessors.setAccessor);
                                emitFunctionAnnotation(<AccessorDeclaration>member);
                                write("set: ");
                                emitStart(accessors.setAccessor);
                                write("function ");
                                emitSignatureAndBody(accessors.setAccessor);
                                emitEnd(accessors.setAccessor);
                                emitTrailingComments(accessors.setAccessor);
                                write(",");
                            }
                            writeLine();
                            write("enumerable: true,");
                            writeLine();
                            write("configurable: true");
                            decreaseIndent();
                            writeLine();
                            write("});");
                            emitEnd(member);
                        }
                    }
                });
            }

            function emitMemberFunctionsForES6AndHigher(node: ClassLikeDeclaration) {
                for (let member of node.members) {
                    if ((member.kind === SyntaxKind.MethodDeclaration || node.kind === SyntaxKind.MethodSignature) && !(<MethodDeclaration>member).body) {
                        emitCommentsOnNotEmittedNode(member);
                    }
                    else if (member.kind === SyntaxKind.MethodDeclaration ||
                        member.kind === SyntaxKind.GetAccessor ||
                        member.kind === SyntaxKind.SetAccessor) {
                        writeLine();
                        emitLeadingComments(member);
                        emitStart(member);
                        if (member.flags & NodeFlags.Static) {
                            write("static ");
                        }

                        if (member.kind === SyntaxKind.GetAccessor) {
                            write("get ");
                        }
                        else if (member.kind === SyntaxKind.SetAccessor) {
                            write("set ");
                        }
                        if ((<MethodDeclaration>member).asteriskToken) {
                            write("*");
                        }
                        emit((<MethodDeclaration>member).name);
                        emitSignatureAndBody(<MethodDeclaration>member);
                        emitEnd(member);
                        emitTrailingComments(member);
                    }
                    else if (member.kind === SyntaxKind.SemicolonClassElement) {
                        writeLine();
                        write(";");
                    }
                }
            }

            function emitStartAnnotation() {
                writeValueAndNewLine("/**");
            }

            function emitEndAnnotation() {
                writeValueAndNewLine(" */");
            }

            function emitCommentedAnnotation(value: string) {
                writeValueAndNewLine(" * " + value);
            }

            function getParameterizedNode(members: NodeArray<Declaration | TypeNode>, omitName?: boolean): string {
                let mapped = ts.map(members, (member) => {
                    return getPropertyKeValue(member, omitName);
                });
                return mapped.join(", ");
            }

            function getTypeLiteral(members: NodeArray<Declaration | Node>): string {
                if (members.length) {
                    var other: Array<string> = [];
                    var indexSignatures: Array<string> = [];

                    ts.forEach(members, (member: Declaration | TypeNode): void => {
                        if (member.kind === SyntaxKind.IndexSignature) {
                            indexSignatures.push(getIndexSignature(<IndexSignatureDeclaration>member));
                        }
                        else {
                            other.push(getPropertyKeValue(member));
                        }
                    });

                    if (other.length) {
                        indexSignatures.push(`{${other.join(", ")}}`);
                    }

                    return indexSignatures.join("|");
                }

                return "Object";
            }

            function addOptionalIfNeeded(node: Node, type: string, isParameterPropertyAssignment: boolean): string {
                if (!isParameterPropertyAssignment) {
                    if (node.kind === SyntaxKind.Parameter && resolver.isOptionalParameter(<ParameterDeclaration>node)) {
                        type = `${type}=`;
                    }
                    else if (node.symbol && (node.symbol.flags & SymbolFlags.Optional) > 0) {
                        type = `(${type}|undefined)`;
                    }
                }

                return type;
            }

            function addVarArgsIfNeeded(node: ParameterDeclaration, type: string): string {
                return ts.isRestParameter(node) ? addVarArgs(type) : type;
            }

            function addVarArgs(type: string): string {
                return `...${type}`;
            }

            function getUnionType(unionType: UnionOrIntersectionTypeNode): string {
                return getTypes(unionType.types);
            }

            function getTypes(types: Array<Node>): string {
                let mapped = ts.map(types, (type: Node) => {
                    return getParameterOrUnionTypeAnnotation(type);
                });

                return `(${mapped.join("|")})`;
            }

            function getArrayLiteral(node: ArrayLiteralExpression): string {
                let type: string;
                let typeCounter = 0;
                let map: { [name: string]: boolean } = {};

                ts.forEach(node.elements, (element) => {
                    type = getParameterOrUnionTypeAnnotation(element);

                    if (!map[type]) {
                        typeCounter++;
                    }

                    map[type] = true;
                    return;
                });

                if (typeCounter !== 1) {
                    return "Array<*>";
                }

                return `Array<${type}>`;
            }

            function getTypeReference(typeRef: TypeReferenceNode): string {
                let text: string
                var isVarArgs = ts.isRestParameter(<ParameterDeclaration>typeRef.parent);

                if (!isVarArgs) {
                    let symbol: { members?: NodeArray<Node> };
                    let hasCallSignatures = false;
                    let name = ts.getEntityNameFromTypeNode(typeRef);

                    if (!name) {
                        name = typeRef.typeName;
                        text = ts.getTextOfNode(name);
                    }
                    else {
                        text = ts.getTextOfNode(name);
                    }

                    text = `${getModuleName(name)}${text}`;
                    symbol = <{ members?: NodeArray<Node> }>getSymbolDeclaration(name);

                    if (symbol && symbol.members) {
                        hasCallSignatures = symbol.members.some(member => member.kind === SyntaxKind.CallSignature);
                    }

                    if (!hasCallSignatures && typeRef.typeArguments) {
                        text = `${text}<${getParameterizedNode(typeRef.typeArguments, true)}>`;
                    }
                }
                else if (typeRef.typeArguments) {
                    text = getParameterizedNode(typeRef.typeArguments, true);
                }

                return text;
            }

            function getFunctionType(func: FunctionLikeDeclaration): string {
                let returnType = "";
                let hasReturnType: boolean;
                let type = func.type || func.body;
                let isCtor = func.kind === SyntaxKind.ConstructorType || func.kind === SyntaxKind.Constructor;

                if (func.kind === SyntaxKind.Constructor) {
                    returnType = getGeneratedPathForModule(func.parent);
                }
                else {
                    if (type.kind === SyntaxKind.PropertyAccessExpression) {
                        let symbol = <PropertyDeclaration>getSymbolDeclaration(type);

                        hasReturnType = true;
                        returnType = getParameterOrUnionTypeAnnotation(symbol.initializer);
                    }
                    else if (hasReturnType = type.kind !== SyntaxKind.VoidKeyword) {
                        returnType = getParameterOrUnionTypeAnnotation(type);
                    }
                }

                if (func.parameters.length || hasReturnType) {
                    var params = getParameterizedNode(func.parameters, true);

                    if (isCtor) {
                        return `function(new:${returnType}, ${params})`;
                    }
                    else {
                        if (returnType) {
                            returnType = `: ${returnType}`;
                        }

                        return `function(${params})${returnType}`;
                    }
                }

                return "Function";
            }

            function getPropertyKeValue(member: Declaration | TypeNode, omitName?: boolean): string {
                let type = getParameterOrUnionTypeAnnotation(member);

                if (omitName) {
                    return type;
                }
                return `${ts.getTextOfNode((<Declaration>member).name)}:${type}`;
            }

            function getNodeName(node): string {
                return node.hasOwnProperty("text") ? node.text : node.hasOwnProperty("name") ? node.name.text : "";
            }

            function getThisType(node: Node): { nodeType: ClassLikeDeclaration, container: Node } {
                var container = ts.getThisContainer(node, false);
                var parent = container && container.parent;

                if (parent && (ts.isClassLike(parent) || parent.kind === SyntaxKind.InterfaceDeclaration)) {
                    if (container.kind !== SyntaxKind.Constructor || ts.isNodeDescendentOf(node, (<FunctionLikeDeclaration>container).body)) {
                        return {
                            container,
                            nodeType: <ClassLikeDeclaration>parent
                        };
                    }
                }

                return null;
            }

            function getThis(node): string {
                var type = getThisType(node);

                if (!type) {
                    return "Window";
                }

                if (type.container.flags & NodeFlags.Static) {
                    return getTypes(ts.filter(type.nodeType.members, member => member.kind === SyntaxKind.Constructor));
                }

                return getGeneratedPathForModule(type.nodeType);
            }

            function getExpression(node: Node): string {
                var type = typeChecker.getTypeAtLocation(node);
                var name = type.symbol ? type.symbol.name : (<IntrinsicType>type).intrinsicName;

                return name === "any" ? "?" : name;
            }

            function getParameterOrUnionTypeAnnotation(node: Node, isParameterPropertyAssignment?: boolean): string {
                let mapped: Array<string>;
                let propertySig: any = node;
                let typeNode = (<{ type: TypeNode, initializer?: Expression, elementType?: TypeNode }>propertySig);

                switch (node.kind) {
                    case SyntaxKind.Parameter:
                    case SyntaxKind.PropertySignature:
                    case SyntaxKind.ParenthesizedType:
                    case SyntaxKind.PropertyAssignment:
                    case SyntaxKind.TypeAliasDeclaration:
                        if (typeNode.type) {
                            return getParameterOrUnionTypeAnnotation(typeNode.type, isParameterPropertyAssignment);
                        }
                        else if (typeNode.initializer) {
                            return getParameterOrUnionTypeAnnotation(typeNode.type || typeNode.initializer, isParameterPropertyAssignment);
                        }
                        break;
                    case SyntaxKind.ArrayType:
                        var type = getParameterOrUnionTypeAnnotation(typeNode.elementType, isParameterPropertyAssignment);

                        if (!ts.isRestParameter(<ParameterDeclaration>node.parent)) {
                            return `Array<${type}>`;
                        }

                        return addVarArgs(type);
                    case SyntaxKind.ArrayLiteralExpression:
                        return getArrayLiteral(<ArrayLiteralExpression>node);
                    case SyntaxKind.UnionType:
                        return addOptionalIfNeeded(node.parent, getUnionType(<UnionOrIntersectionTypeNode>node), isParameterPropertyAssignment);
                    case SyntaxKind.TypeReference:
                        var type = addOptionalIfNeeded(node.parent, getTypeReference(<TypeReferenceNode>node), isParameterPropertyAssignment);

                        return addVarArgsIfNeeded(<ParameterDeclaration>node.parent, type);
                    case SyntaxKind.TypeLiteral:
                    case SyntaxKind.ObjectLiteralExpression:
                        return addOptionalIfNeeded(node.parent, getTypeLiteral((<TypeLiteralNode>node).members || (<ObjectLiteralExpression>node).properties), isParameterPropertyAssignment);
                    case SyntaxKind.IndexSignature:
                        return getIndexSignature(<IndexSignatureDeclaration>node);
                    case SyntaxKind.StringKeyword:
                    case SyntaxKind.NumberKeyword:
                    case SyntaxKind.BooleanKeyword:
                    case SyntaxKind.SymbolKeyword:
                    case SyntaxKind.VoidKeyword:
                        return addOptionalIfNeeded(node.parent, ts.tokenToString(node.kind), isParameterPropertyAssignment);
                    case SyntaxKind.Constructor:
                    case SyntaxKind.FunctionType:
                    case SyntaxKind.ArrowFunction:
                    case SyntaxKind.ConstructorType:
                    case SyntaxKind.FunctionExpression:
                        return addOptionalIfNeeded(node.parent, getFunctionType(<FunctionLikeDeclaration>node), isParameterPropertyAssignment);
                    case SyntaxKind.NumericLiteral:
                        return addOptionalIfNeeded(node.parent, "number", isParameterPropertyAssignment);
                    case SyntaxKind.StringLiteral:
                        return addOptionalIfNeeded(node.parent, "string", isParameterPropertyAssignment);
                    case SyntaxKind.RegularExpressionLiteral:
                        return addOptionalIfNeeded(node.parent, "RegExp", isParameterPropertyAssignment);
                    case SyntaxKind.TrueKeyword:
                    case SyntaxKind.FalseKeyword:
                        return addOptionalIfNeeded(node.parent, "boolean", isParameterPropertyAssignment);
                    case SyntaxKind.VoidExpression:
                        return "undefined";
                    case SyntaxKind.Identifier:
                        var symbol = getSymbolDeclaration(node);

                        if (symbol) {
                            return getParameterOrUnionTypeAnnotation(symbol, isParameterPropertyAssignment)
                        }
                        break;
                    case SyntaxKind.NewExpression:
                        let buffer: Array<string> = [];
                        let propertyAccess = <PropertyAccessExpression>node;

                        do {
                            propertyAccess = <PropertyAccessExpression>propertyAccess.expression;
                            buffer.push(getNodeName(propertyAccess))
                        }
                        while (propertyAccess.expression);

                        return buffer.reverse().join(".");
                    case SyntaxKind.ThisKeyword:
                        return getThis(node);
                    case SyntaxKind.CallExpression:
                    case SyntaxKind.PropertyAccessExpression:
                        return getExpression(node);
                }

                return addVarArgsIfNeeded(<ParameterDeclaration>node, "?");
            }

            function createGenericsTypeChecker(genericArguments): (param: string) => string {
                return (param: string) => genericArguments.indexOf(param) > -1 ? "?" : param;
            }

            function emitCallSignatures(interface: InterfaceDeclaration, members: Array<SignatureDeclaration>) {
                let genericArguments = getGenericArguments(interface);
                let genericsTypeChecker = createGenericsTypeChecker(genericArguments);

                emitCallOrIndexSignatures(interface, members, (indexSignature): string => {
                    var params = ts.map(indexSignature.parameters, param => genericsTypeChecker(getParameterOrUnionTypeAnnotation(param)));
                    var returnType = genericsTypeChecker(getParameterOrUnionTypeAnnotation(indexSignature.type));

                    return `function(${params.join(", ")}): ${returnType}`;
                });
            }

            function getIndexSignature(indexSignature: IndexSignatureDeclaration, genericsTypeChecker = (param: string) => param): string {
                var params = ts.map(indexSignature.parameters, param => genericsTypeChecker(getParameterOrUnionTypeAnnotation(param)));
                var returnType = genericsTypeChecker(getParameterOrUnionTypeAnnotation(indexSignature.type));

                return `Object<${params.join(", ")}, ${returnType}>`;
            }

            function emitIndexSignatures(interface: InterfaceDeclaration, members: Array<SignatureDeclaration>) {
                let genericArguments = getGenericArguments(interface);
                let genericsTypeChecker = createGenericsTypeChecker(genericArguments);

                emitCallOrIndexSignatures(interface, members, member => getIndexSignature(<IndexSignatureDeclaration>member, genericsTypeChecker));
            }

            function emitCallOrIndexSignatures(node: InterfaceDeclaration, members: Array<SignatureDeclaration>, mapFunction: (member: SignatureDeclaration) => string) {
                var rightParenthesis = "", leftParenthesis = "";
                var indexOrCallSignatureName = ts.getTextOfNode(node.name);
                var indexOrCallSignatures = ts.map(members, mapFunction);

                forceWriteLine();
                emitStartAnnotation();

                if (indexOrCallSignatures.length > 1) {
                    rightParenthesis = "(";
                    leftParenthesis = ")";
                }
                emitCommentedAnnotation(`@typedef {${rightParenthesis}${indexOrCallSignatures.join("|")}${leftParenthesis}}`);
                emitEndAnnotation();

                if (!emitModuleIfNeeded(node)) {
                    write("var ");
                }

                write(`${indexOrCallSignatureName};`);
            }

            function emitEnumAnnotation(node: EnumDeclaration) {
                var type = "number";
                var multipleTypes = false;
                var types = { number: 0, string: 0, other: 0 };
                var notNumbers = ts.filter(node.members, (member) => member.initializer && member.initializer.kind === SyntaxKind.TypeAssertionExpression)
                    .map(member => <TypeAssertion>member.initializer);

                if (notNumbers.length) {
                    types.number = node.members.length - notNumbers.length;
                    notNumbers.map(function (initializer) { return initializer.expression; })
                        .forEach(function (type) {
                            if (type.kind === SyntaxKind.NumericLiteral) {
                                types.number++;
                                multipleTypes = types.string + types.other > 0;
                            }
                            else if (type.kind === SyntaxKind.StringLiteral) {
                                types.string++;
                                multipleTypes = types.number + types.other > 0;
                            }
                            else {
                                types.other++;
                                multipleTypes = types.string + types.number > 0;
                            }
                        });
                }

                if (!multipleTypes && !types.other) {
                    if (types.string) {
                        type = "string";
                    }
                    emitStartAnnotation();
                    emitCommentedAnnotation(`@enum {${type}}`);
                    emitEndAnnotation();
                }
            }

            function emitArrayTypeAnnotation(node: ParameterDeclaration): void {
                var cloned = (<any>Object).assign({}, node);

                delete cloned.dotDotDotToken;
                cloned.type.parent = cloned;

                emitVariableTypeAnnotation(<ParameterDeclaration>cloned);
            }

            function emitVariableTypeAnnotation(node: VariableDeclaration | PropertyDeclaration | ParameterDeclaration, isParameterPropertyAssignment?: boolean): void {
                var type = "?";
                var annotation = ts.isConst(node) ? "@const" : "@type";

                if (node.type || node.initializer) {
                    type = getParameterOrUnionTypeAnnotation(node.type || node.initializer, isParameterPropertyAssignment);
                }

                write(`/** ${annotation} {${type}} */ `);
            }

            function emitPropertyOrParamterAnnotation(node: PropertyDeclaration | ParameterDeclaration, isParameterPropertyAssignment?: boolean): void {
                emitVariableTypeAnnotation(node, isParameterPropertyAssignment);
            }

            function emitFunctionAnnotation(node: FunctionLikeDeclaration): void {
                let hasModifiers = false;
                let accessModifierKind: SyntaxKind;
                let declaredWithinInterface = node.parent.kind === SyntaxKind.InterfaceDeclaration;
                let hasParameters = node.parameters && node.parameters.length > 0;
                let hasReturnType = declaredWithinInterface || (node.type && node.type.kind !== SyntaxKind.VoidKeyword);

                if (node.modifiers) {
                    let accessModifiers = ts.filter(node.modifiers, (modifier) => ts.isAccessibilityModifier(modifier.kind));

                    if (accessModifiers.length) {
                        accessModifierKind = accessModifiers[0].kind;

                        if (accessModifierKind !== SyntaxKind.PublicKeyword) {
                            hasModifiers = true;
                        }
                    }
                }

                if (hasReturnType || hasParameters || hasModifiers) {
                    emitStartAnnotation();

                    if (hasParameters) {
                        emitParametersAnnotations(node.parameters);
                    }

                    if (hasReturnType) {
                        let returnType = node.type

                        if (!returnType && declaredWithinInterface) {
                            let anyMock: any = { type: { kind: SyntaxKind.AnyKeyword } };

                            returnType = <TypeNode>anyMock;
                        }

                        if (returnType) {
                            emitCommentedAnnotation(`@return {${getParameterOrUnionTypeAnnotation(returnType)}}`);
                        }
                    }

                    if (hasModifiers) {
                        emitCommentedAnnotation(`@${ts.tokenToString(accessModifierKind)}`);
                    }

                    emitGenericTypes(getGenericArguments(node));
                    emitEndAnnotation();
                }
            }

            function emitParametersAnnotations(parameters: NodeArray<ParameterDeclaration>): void {
                ts.forEach(parameters, (parameter) => {
                    let type = getParameterOrUnionTypeAnnotation(parameter);
                    let name = ts.getTextOfNode(parameter.name);

                    if (ts.isRestParameter(parameter)) {
                        name += "$rest";
                    }

                    emitCommentedAnnotation(`@param {${type}} ${name}`);
                });
            }

            function emitExtendsAnnotation(): void {
                emitStartAnnotation();
                emitCommentedAnnotation("@param {Function} d");
                emitCommentedAnnotation("@param {Function} b");
                write(" */");
            }

            function emitInterfaceDeclarationAnnotation(node: InterfaceDeclaration, interfacesImpl: Array<ExpressionWithTypeArguments>): void {
                emitConstructorOrInterfaceAnnotation(node, false, interfacesImpl);
            }

            function emitConstructorAnnotation(node: ClassLikeDeclaration, ctor: ConstructorDeclaration, baseTypeElement: ExpressionWithTypeArguments, interfacesImpl: Array<ExpressionWithTypeArguments>): void {
                emitConstructorOrInterfaceAnnotation(node, true, interfacesImpl, baseTypeElement, ctor);
            }

            function getClassOrInterfaceFullPath(node: ExpressionWithTypeArguments): string {
                return getModuleName(node.expression) + ts.getTextOfNode(node);
            }

            function emitConstructorOrInterfaceAnnotation(node: InterfaceDeclaration | ClassLikeDeclaration, isClass: boolean, interfacesImpl: Array<ExpressionWithTypeArguments>, baseTypeElement?: ExpressionWithTypeArguments, ctor?: ConstructorDeclaration) {
                let type: string;
                let heritageType: string;

                if (isClass) {
                    type = "@constructor";
                    heritageType = "implements";
                }
                else {
                    type = "@interface";
                    heritageType = "extends";
                }

                emitStartAnnotation();
                emitCommentedAnnotation(type);

                if (baseTypeElement) {
                    emitCommentedAnnotation(`@extends {${getClassOrInterfaceFullPath(baseTypeElement)}}`);
                }

                ts.forEach(interfacesImpl, (_interface) => {
                    emitCommentedAnnotation(`@${heritageType} {${getClassOrInterfaceFullPath(_interface)}}`);
                });

                if (ctor) {
                    emitParametersAnnotations(ctor.parameters);
                }

                emitGenericTypes(getGenericArguments(node));
                emitEndAnnotation();
            }

            function getGenericArguments(node: ClassLikeDeclaration | InterfaceDeclaration | FunctionLikeDeclaration): Array<string> {
                return ts.map(node.typeParameters || <NodeArray<TypeParameterDeclaration>>[], getNodeName);
            }

            function emitGenericTypes(genericTypes: Array<string>): void {
                if (genericTypes.length) {
                    emitCommentedAnnotation(`@template ${genericTypes.join(", ")}`);
                }
            }

            function emitConstructor(node: ClassLikeDeclaration, baseTypeElement: ExpressionWithTypeArguments, interfacesImpl: Array<ExpressionWithTypeArguments> = []) {
                let saveTempFlags = tempFlags;
                let saveTempVariables = tempVariables;
                let saveTempParameters = tempParameters;
                tempFlags = 0;
                tempVariables = undefined;
                tempParameters = undefined;
                forceWriteLine();
                emitConstructorWorker(node, baseTypeElement, interfacesImpl);
                tempFlags = saveTempFlags;
                tempVariables = saveTempVariables;
                tempParameters = saveTempParameters;
            }

            function emitConstructorWorker(node: ClassLikeDeclaration, baseTypeElement: ExpressionWithTypeArguments, interfacesImpl: Array<ExpressionWithTypeArguments>) {
                let isDeclaredInAModule = false;
                let nodeName = ts.declarationNameToString(node.name);
                // Check if we have property assignment inside class declaration.
                // If there is property assignment, we need to emit constructor whether users define it or not
                // If there is no property assignment, we can omit constructor if users do not define it
                let hasInstancePropertyWithInitializer = false;
                let nodeIsInterface = node.kind === SyntaxKind.InterfaceDeclaration;
                
                // Emit the constructor overload pinned comments
                forEach(node.members, member => {
                    if (member.kind === SyntaxKind.Constructor && !(<ConstructorDeclaration>member).body) {
                        emitCommentsOnNotEmittedNode(member);
                    }
                    // Check if there is any non-static property assignment
                    if (member.kind === SyntaxKind.PropertyDeclaration && (<PropertyDeclaration>member).initializer && (member.flags & NodeFlags.Static) === 0) {
                        hasInstancePropertyWithInitializer = true;
                    }
                });

                let ctor = getFirstConstructorWithBody(node);

                if (!nodeIsInterface) {
                    emitConstructorAnnotation(node, ctor, baseTypeElement, interfacesImpl);
                }
                else {
                    let interface: any = node;
                    emitInterfaceDeclarationAnnotation(<InterfaceDeclaration>interface, interfacesImpl);
                }
                // For target ES6 and above, if there is no user-defined constructor and there is no property assignment
                // do not emit constructor in class declaration.
                if (languageVersion >= ScriptTarget.ES6 && !ctor && !hasInstancePropertyWithInitializer) {
                    return;
                }

                if (ctor) {
                    emitLeadingComments(ctor);
                }
                emitStart(ctor);

                if (languageVersion < ScriptTarget.ES6) {
                    if (isDeclaredInAModule = emitModuleIfNeeded(node)) {
                        emitDeclarationName(node);
                        write(" = function ");
                    }
                    else {
                        write("function ");
                        emitDeclarationName(node);
                    }

                    emitSignatureParameters(ctor);
                }
                else {
                    write("constructor");
                    if (ctor) {
                        emitSignatureParameters(ctor);
                    }
                    else {
                        // Based on EcmaScript6 section 14.5.14: Runtime Semantics: ClassDefinitionEvaluation.
                        // If constructor is empty, then,
                        //      If ClassHeritageopt is present, then
                        //          Let constructor be the result of parsing the String "constructor(... args){ super (...args);}" using the syntactic grammar with the goal symbol MethodDefinition.
                        //      Else,
                        //          Let constructor be the result of parsing the String "constructor( ){ }" using the syntactic grammar with the goal symbol MethodDefinition
                        if (baseTypeElement) {
                            write("(...args)");
                        }
                        else {
                            write("()");
                        }
                    }
                }

                let startIndex = 0;

                write(" {");
                scopeEmitStart(node, "constructor");
                increaseIndent();
                if (ctor) {
                    // Emit all the directive prologues (like "use strict").  These have to come before
                    // any other preamble code we write (like parameter initializers).
                    startIndex = emitDirectivePrologues(ctor.body.statements, /*startWithNewLine*/ true);
                    emitDetachedComments(ctor.body.statements);
                }
                emitCaptureThisForNodeIfNecessary(node);
                let superCall: ExpressionStatement;
                if (ctor) {
                    emitDefaultValueAssignments(ctor);
                    emitRestParameter(ctor);
                    if (baseTypeElement) {
                        superCall = findInitialSuperCall(ctor);
                        if (superCall) {
                            writeLine();
                            emit(superCall);
                        }
                    }
                    emitParameterPropertyAssignments(ctor);
                }
                else {
                    if (baseTypeElement && !nodeIsInterface) {
                        writeLine();
                        emitStart(baseTypeElement);
                        if (languageVersion < ScriptTarget.ES6) {
                            emit(baseTypeElement.expression);
                            write(".apply(this, arguments);");
                        }
                        else {
                            write("super(...args);");
                        }
                        emitEnd(baseTypeElement);
                    }
                }
                emitPropertyDeclarations(node, getProperties(node, /*static:*/ false));
                if (ctor) {
                    let statements: Node[] = (<Block>ctor.body).statements;
                    if (superCall) {
                        statements = statements.slice(1);
                    }
                    emitLinesStartingAt(statements, startIndex);
                }
                emitTempDeclarations(/*newLine*/ true);
                writeLine();
                if (ctor) {
                    emitLeadingCommentsOfPosition((<Block>ctor.body).statements.end);
                }
                decreaseIndent();
                emitToken(SyntaxKind.CloseBraceToken, ctor ? (<Block>ctor.body).statements.end : node.members.end);
                scopeEmitEnd();
                emitEnd(<Node>ctor || node);
                if (ctor) {
                    emitTrailingComments(ctor);
                }

                if (isDeclaredInAModule) {
                    write(";");
                }

                setModuleGenerated(node);
            }
            function emitTypeAliasDeclaration(node: TypeAliasDeclaration) {
                let typeAliasName = ts.getTextOfNode(node.name);
                let annotationValue = getParameterOrUnionTypeAnnotation(node);

                forceWriteLine();
                emitStartAnnotation();
                emitCommentedAnnotation(`@typedef {${annotationValue}}`);
                emitEndAnnotation();

                if (!emitModuleIfNeeded(node)) {
                    write("var ");
                }

                write(`${typeAliasName};`);
                typeAliases[typeAliasName] = true;
            }

            function symbolIsTypeAlias(symbol: string): boolean {
                return !!typeAliases[symbol];
            }

            function emitClassExpression(node: ClassExpression) {
                return emitClassLikeDeclaration(node);
            }

            function emitClassDeclaration(node: ClassDeclaration) {
                return emitClassLikeDeclaration(node);
            }

            function emitClassLikeDeclaration(node: ClassLikeDeclaration) {
                if (languageVersion < ScriptTarget.ES6) {
                    emitClassLikeDeclarationBelowES6(node);
                }
                else {
                    emitClassLikeDeclarationForES6AndHigher(node);
                }
                if (modulekind !== ModuleKind.ES6 && node.parent === currentSourceFile && node.name) {
                    emitExportMemberAssignments(node.name);
                }
            }

            function emitClassLikeDeclarationForES6AndHigher(node: ClassLikeDeclaration) {
                let thisNodeIsDecorated = nodeIsDecorated(node);
                if (node.kind === SyntaxKind.ClassDeclaration) {
                    if (thisNodeIsDecorated) {
                        // To preserve the correct runtime semantics when decorators are applied to the class,
                        // the emit needs to follow one of the following rules:
                        //
                        // * For a local class declaration:
                        //
                        //     @dec class C {
                        //     }
                        //
                        //   The emit should be:
                        //
                        //     let C = class {
                        //     };
                        //     C = __decorate([dec], C);
                        //
                        // * For an exported class declaration:
                        //
                        //     @dec export class C {
                        //     }
                        //
                        //   The emit should be:
                        //
                        //     export let C = class {
                        //     };
                        //     C = __decorate([dec], C);
                        //
                        // * For a default export of a class declaration with a name:
                        //
                        //     @dec default export class C {
                        //     }
                        //
                        //   The emit should be:
                        //
                        //     let C = class {
                        //     }
                        //     C = __decorate([dec], C);
                        //     export default C;
                        //
                        // * For a default export of a class declaration without a name:
                        //
                        //     @dec default export class {
                        //     }
                        //
                        //   The emit should be:
                        //
                        //     let _default = class {
                        //     }
                        //     _default = __decorate([dec], _default);
                        //     export default _default;
                        //
                        if (isES6ExportedDeclaration(node) && !(node.flags & NodeFlags.Default)) {
                            write("export ");
                        }

                        write("let ");
                        emitDeclarationName(node);
                        write(" = ");
                    }
                    else if (isES6ExportedDeclaration(node)) {
                        write("export ");
                        if (node.flags & NodeFlags.Default) {
                            write("default ");
                        }
                    }
                }

                // If the class has static properties, and it's a class expression, then we'll need
                // to specialize the emit a bit.  for a class expression of the form:
                //
                //      class C { static a = 1; static b = 2; ... }
                //
                // We'll emit:
                //
                //      (_temp = class C { ... }, _temp.a = 1, _temp.b = 2, _temp)
                //
                // This keeps the expression as an expression, while ensuring that the static parts
                // of it have been initialized by the time it is used.
                let staticProperties = getProperties(node, /*static:*/ true);
                let isClassExpressionWithStaticProperties = staticProperties.length > 0 && node.kind === SyntaxKind.ClassExpression;
                let tempVariable: Identifier;

                if (isClassExpressionWithStaticProperties) {
                    tempVariable = createAndRecordTempVariable(TempFlags.Auto);
                    write("(");
                    increaseIndent();
                    emit(tempVariable);
                    write(" = ");
                }

                write("class");

                // emit name if
                // - node has a name
                // - this is default export with static initializers
                if ((node.name || (node.flags & NodeFlags.Default && staticProperties.length > 0)) && !thisNodeIsDecorated) {
                    write(" ");
                    emitDeclarationName(node);
                }

                let baseTypeNode = getClassExtendsHeritageClauseElement(node);
                if (baseTypeNode) {
                    write(" extends ");
                    emit(baseTypeNode.expression);
                }

                write(" {");
                increaseIndent();
                scopeEmitStart(node);
                writeLine();
                emitConstructor(node, baseTypeNode);
                emitMemberFunctionsForES6AndHigher(node);
                decreaseIndent();
                writeLine();
                emitToken(SyntaxKind.CloseBraceToken, node.members.end);
                scopeEmitEnd();

                // TODO(rbuckton): Need to go back to `let _a = class C {}` approach, removing the defineProperty call for now.

                // For a decorated class, we need to assign its name (if it has one). This is because we emit
                // the class as a class expression to avoid the double-binding of the identifier:
                //
                //   let C = class {
                //   }
                //   Object.defineProperty(C, "name", { value: "C", configurable: true });
                //
                if (thisNodeIsDecorated) {
                    write(";");
                }

                // Emit static property assignment. Because classDeclaration is lexically evaluated,
                // it is safe to emit static property assignment after classDeclaration
                // From ES6 specification:
                //      HasLexicalDeclaration (N) : Determines if the argument identifier has a binding in this environment record that was created using
                //                                  a lexical declaration such as a LexicalDeclaration or a ClassDeclaration.

                if (isClassExpressionWithStaticProperties) {
                    for (let property of staticProperties) {
                        write(",");
                        writeLine();
                        emitPropertyDeclaration(node, property, /*receiver:*/ tempVariable, /*isExpression:*/ true);
                    }
                    write(",");
                    writeLine();
                    emit(tempVariable);
                    decreaseIndent();
                    write(")");
                }
                else {
                    writeLine();
                    emitPropertyDeclarations(node, staticProperties);
                    emitDecoratorsOfClass(node);
                }

                // If this is an exported class, but not on the top level (i.e. on an internal
                // module), export it
                if (!isES6ExportedDeclaration(node) && (node.flags & NodeFlags.Export)) {
                    writeLine();
                    emitStart(node);
                    emitModuleMemberName(node);
                    write(" = ");
                    emitDeclarationName(node);
                    emitEnd(node);
                    write(";");
                }
                else if (isES6ExportedDeclaration(node) && (node.flags & NodeFlags.Default) && thisNodeIsDecorated) {
                    // if this is a top level default export of decorated class, write the export after the declaration.
                    writeLine();
                    write("export default ");
                    emitDeclarationName(node);
                    write(";");
                }
            }

            function emitClassLikeDeclarationBelowES6(node: ClassLikeDeclaration) {
                let baseTypeNode = ts.getClassExtendsHeritageClauseElement(node);
                var interfacesImpl = ts.getClassImplementsHeritageClauseElements(node);
                let saveTempFlags = tempFlags;
                let saveTempVariables = tempVariables;
                let saveTempParameters = tempParameters;
                let saveComputedPropertyNamesToGeneratedNames = computedPropertyNamesToGeneratedNames;

                tempFlags = 0;
                tempVariables = undefined;
                tempParameters = undefined;
                computedPropertyNamesToGeneratedNames = undefined;
                scopeEmitStart(node);
                writeLine();
                emitConstructor(node, baseTypeNode, interfacesImpl);
                emitMemberFunctionsForES5AndLower(node);
                emitPropertyDeclarations(node, getProperties(node, /*static:*/ true));
                writeLine();
                emitDecoratorsOfClass(node);
                writeLine();
                emitTempDeclarations(/*newLine*/ true);
                tempFlags = saveTempFlags;
                tempVariables = saveTempVariables;
                tempParameters = saveTempParameters;
                computedPropertyNamesToGeneratedNames = saveComputedPropertyNamesToGeneratedNames;
                if (baseTypeNode) {
                    writeLine();
                    emitStart(baseTypeNode);
                    forceWriteLine();
                    write("__extends(");
                    emitModuleIfNeeded(node);
                    emitDeclarationName(node);
                    write(", ");
                    emitModuleIfNeeded(baseTypeNode.expression);
                    emit(baseTypeNode.expression);
                    write(");");
                    emitEnd(baseTypeNode);
                }
            }

            function emitClassMemberPrefix(node: ClassLikeDeclaration, member: Node) {
                emitModuleIfNeeded(node);
                emitDeclarationName(node);
                if (!(member.flags & NodeFlags.Static)) {
                    write(".prototype");
                }
            }

            function emitDecoratorsOfClass(node: ClassLikeDeclaration) {
                emitDecoratorsOfMembers(node, /*staticFlag*/ 0);
                emitDecoratorsOfMembers(node, NodeFlags.Static);
                emitDecoratorsOfConstructor(node);
            }

            function emitDecoratorsOfConstructor(node: ClassLikeDeclaration) {
                let decorators = node.decorators;
                let constructor = getFirstConstructorWithBody(node);
                let hasDecoratedParameters = constructor && forEach(constructor.parameters, nodeIsDecorated);

                // skip decoration of the constructor if neither it nor its parameters are decorated
                if (!decorators && !hasDecoratedParameters) {
                    return;
                }

                // Emit the call to __decorate. Given the class:
                //
                //   @dec
                //   class C {
                //   }
                //
                // The emit for the class is:
                //
                //   C = __decorate([dec], C);
                //

                writeLine();
                emitStart(node);
                emitDeclarationName(node);
                write(" = __decorate([");
                increaseIndent();
                writeLine();

                let decoratorCount = decorators ? decorators.length : 0;
                let argumentsWritten = emitList(decorators, 0, decoratorCount, /*multiLine*/ true, /*trailingComma*/ false, /*leadingComma*/ false, /*noTrailingNewLine*/ true, decorator => {
                    emitStart(decorator);
                    emit(decorator.expression);
                    emitEnd(decorator);
                });

                argumentsWritten += emitDecoratorsOfParameters(constructor, /*leadingComma*/ argumentsWritten > 0);
                emitSerializedTypeMetadata(node, /*leadingComma*/ argumentsWritten >= 0);

                decreaseIndent();
                writeLine();
                write("], ");
                emitDeclarationName(node);
                write(");");
                emitEnd(node);
                writeLine();
            }

            function emitDecoratorsOfMembers(node: ClassLikeDeclaration, staticFlag: NodeFlags) {
                for (let member of node.members) {
                    // only emit members in the correct group
                    if ((member.flags & NodeFlags.Static) !== staticFlag) {
                        continue;
                    }

                    // skip members that cannot be decorated (such as the constructor)
                    if (!nodeCanBeDecorated(member)) {
                        continue;
                    }

                    // skip a member if it or any of its parameters are not decorated
                    if (!nodeOrChildIsDecorated(member)) {
                        continue;
                    }

                    // skip an accessor declaration if it is not the first accessor
                    let decorators: NodeArray<Decorator>;
                    let functionLikeMember: FunctionLikeDeclaration;
                    if (isAccessor(member)) {
                        let accessors = getAllAccessorDeclarations(node.members, <AccessorDeclaration>member);
                        if (member !== accessors.firstAccessor) {
                            continue;
                        }

                        // get the decorators from the first accessor with decorators
                        decorators = accessors.firstAccessor.decorators;
                        if (!decorators && accessors.secondAccessor) {
                            decorators = accessors.secondAccessor.decorators;
                        }

                        // we only decorate parameters of the set accessor
                        functionLikeMember = accessors.setAccessor;
                    }
                    else {
                        decorators = member.decorators;

                        // we only decorate the parameters here if this is a method
                        if (member.kind === SyntaxKind.MethodDeclaration) {
                            functionLikeMember = <MethodDeclaration>member;
                        }
                    }

                    // Emit the call to __decorate. Given the following:
                    //
                    //   class C {
                    //     @dec method(@dec2 x) {}
                    //     @dec get accessor() {}
                    //     @dec prop;
                    //   }
                    //
                    // The emit for a method is:
                    //
                    //   __decorate([
                    //       dec,
                    //       __param(0, dec2),
                    //       __metadata("design:type", Function),
                    //       __metadata("design:paramtypes", [Object]),
                    //       __metadata("design:returntype", void 0)
                    //   ], C.prototype, "method", undefined);
                    //
                    // The emit for an accessor is:
                    //
                    //   __decorate([
                    //       dec
                    //   ], C.prototype, "accessor", undefined);
                    //
                    // The emit for a property is:
                    //
                    //   __decorate([
                    //       dec
                    //   ], C.prototype, "prop");
                    //

                    writeLine();
                    emitStart(member);
                    write("__decorate([");
                    increaseIndent();
                    writeLine();

                    let decoratorCount = decorators ? decorators.length : 0;
                    let argumentsWritten = emitList(decorators, 0, decoratorCount, /*multiLine*/ true, /*trailingComma*/ false, /*leadingComma*/ false, /*noTrailingNewLine*/ true, decorator => {
                        emitStart(decorator);
                        emit(decorator.expression);
                        emitEnd(decorator);
                    });

                    argumentsWritten += emitDecoratorsOfParameters(functionLikeMember, argumentsWritten > 0);
                    emitSerializedTypeMetadata(member, argumentsWritten > 0);

                    decreaseIndent();
                    writeLine();
                    write("], ");
                    emitStart(member.name);
                    emitClassMemberPrefix(node, member);
                    write(", ");
                    emitExpressionForPropertyName(member.name);
                    emitEnd(member.name);

                    if (languageVersion > ScriptTarget.ES3) {
                        if (member.kind !== SyntaxKind.PropertyDeclaration) {
                            // We emit `null` here to indicate to `__decorate` that it can invoke `Object.getOwnPropertyDescriptor` directly.
                            // We have this extra argument here so that we can inject an explicit property descriptor at a later date.
                            write(", null");
                        }
                        else {
                            // We emit `void 0` here to indicate to `__decorate` that it can invoke `Object.defineProperty` directly, but that it
                            // should not invoke `Object.getOwnPropertyDescriptor`.
                            write(", void 0");
                        }
                    }

                    write(");");
                    emitEnd(member);
                    writeLine();
                }
            }

            function emitDecoratorsOfParameters(node: FunctionLikeDeclaration, leadingComma: boolean): number {
                let argumentsWritten = 0;
                if (node) {
                    let parameterIndex = 0;
                    for (let parameter of node.parameters) {
                        if (nodeIsDecorated(parameter)) {
                            let decorators = parameter.decorators;
                            argumentsWritten += emitList(decorators, 0, decorators.length, /*multiLine*/ true, /*trailingComma*/ false, /*leadingComma*/ leadingComma, /*noTrailingNewLine*/ true, decorator => {
                                emitStart(decorator);
                                write(`__param(${parameterIndex}, `);
                                emit(decorator.expression);
                                write(")");
                                emitEnd(decorator);
                            });
                            leadingComma = true;
                        }
                        ++parameterIndex;
                    }
                }
                return argumentsWritten;
            }

            function shouldEmitTypeMetadata(node: Declaration): boolean {
                // This method determines whether to emit the "design:type" metadata based on the node's kind.
                // The caller should have already tested whether the node has decorators and whether the emitDecoratorMetadata
                // compiler option is set.
                switch (node.kind) {
                    case SyntaxKind.MethodDeclaration:
                    case SyntaxKind.GetAccessor:
                    case SyntaxKind.SetAccessor:
                    case SyntaxKind.PropertyDeclaration:
                        return true;
                }

                return false;
            }

            function shouldEmitReturnTypeMetadata(node: Declaration): boolean {
                // This method determines whether to emit the "design:returntype" metadata based on the node's kind.
                // The caller should have already tested whether the node has decorators and whether the emitDecoratorMetadata
                // compiler option is set.
                switch (node.kind) {
                    case SyntaxKind.MethodDeclaration:
                        return true;
                }
                return false;
            }

            function shouldEmitParamTypesMetadata(node: Declaration): boolean {
                // This method determines whether to emit the "design:paramtypes" metadata based on the node's kind.
                // The caller should have already tested whether the node has decorators and whether the emitDecoratorMetadata
                // compiler option is set.
                switch (node.kind) {
                    case SyntaxKind.ClassDeclaration:
                    case SyntaxKind.MethodDeclaration:
                    case SyntaxKind.SetAccessor:
                        return true;
                }
                return false;
            }

            /** Serializes the type of a declaration to an appropriate JS constructor value. Used by the __metadata decorator for a class member. */
            function emitSerializedTypeOfNode(node: Node) {
                // serialization of the type of a declaration uses the following rules:
                //
                // * The serialized type of a ClassDeclaration is "Function"
                // * The serialized type of a ParameterDeclaration is the serialized type of its type annotation.
                // * The serialized type of a PropertyDeclaration is the serialized type of its type annotation.
                // * The serialized type of an AccessorDeclaration is the serialized type of the return type annotation of its getter or parameter type annotation of its setter.
                // * The serialized type of any other FunctionLikeDeclaration is "Function".
                // * The serialized type of any other node is "void 0".
                //
                // For rules on serializing type annotations, see `serializeTypeNode`.
                switch (node.kind) {
                    case SyntaxKind.ClassDeclaration:
                        write("Function");
                        return;

                    case SyntaxKind.PropertyDeclaration:
                        emitSerializedTypeNode((<PropertyDeclaration>node).type);
                        return;

                    case SyntaxKind.Parameter:
                        emitSerializedTypeNode((<ParameterDeclaration>node).type);
                        return;

                    case SyntaxKind.GetAccessor:
                        emitSerializedTypeNode((<AccessorDeclaration>node).type);
                        return;

                    case SyntaxKind.SetAccessor:
                        emitSerializedTypeNode(getSetAccessorTypeAnnotationNode(<AccessorDeclaration>node));
                        return;

                }

                if (isFunctionLike(node)) {
                    write("Function");
                    return;
                }

                write("void 0");
            }

            function emitSerializedTypeNode(node: TypeNode) {
                if (node) {

                    switch (node.kind) {
                        case SyntaxKind.VoidKeyword:
                            write("void 0");
                            return;

                        case SyntaxKind.ParenthesizedType:
                            emitSerializedTypeNode((<ParenthesizedTypeNode>node).type);
                            return;

                        case SyntaxKind.FunctionType:
                        case SyntaxKind.ConstructorType:
                            write("Function");
                            return;

                        case SyntaxKind.ArrayType:
                        case SyntaxKind.TupleType:
                            write("Array");
                            return;

                        case SyntaxKind.TypePredicate:
                        case SyntaxKind.BooleanKeyword:
                            write("Boolean");
                            return;

                        case SyntaxKind.StringKeyword:
                        case SyntaxKind.StringLiteral:
                            write("String");
                            return;

                        case SyntaxKind.NumberKeyword:
                            write("Number");
                            return;

                        case SyntaxKind.SymbolKeyword:
                            write("Symbol");
                            return;

                        case SyntaxKind.TypeReference:
                            emitSerializedTypeReferenceNode(<TypeReferenceNode>node);
                            return;

                        case SyntaxKind.TypeQuery:
                        case SyntaxKind.TypeLiteral:
                        case SyntaxKind.UnionType:
                        case SyntaxKind.IntersectionType:
                        case SyntaxKind.AnyKeyword:
                            break;

                        default:
                            Debug.fail("Cannot serialize unexpected type node.");
                            break;
                    }
                }
                write("Object");
            }

            /** Serializes a TypeReferenceNode to an appropriate JS constructor value. Used by the __metadata decorator. */
            function emitSerializedTypeReferenceNode(node: TypeReferenceNode) {
                let location: Node = node.parent;
                while (isDeclaration(location) || isTypeNode(location)) {
                    location = location.parent;
                }

                // Clone the type name and parent it to a location outside of the current declaration.
                let typeName = cloneEntityName(node.typeName);
                typeName.parent = location;

                let result = resolver.getTypeReferenceSerializationKind(typeName);
                switch (result) {
                    case TypeReferenceSerializationKind.Unknown:
                        let temp = createAndRecordTempVariable(TempFlags.Auto);
                        write("(typeof (");
                        emitNodeWithoutSourceMap(temp);
                        write(" = ");
                        emitEntityNameAsExpression(typeName, /*useFallback*/ true);
                        write(") === 'function' && ");
                        emitNodeWithoutSourceMap(temp);
                        write(") || Object");
                        break;

                    case TypeReferenceSerializationKind.TypeWithConstructSignatureAndValue:
                        emitEntityNameAsExpression(typeName, /*useFallback*/ false);
                        break;

                    case TypeReferenceSerializationKind.VoidType:
                        write("void 0");
                        break;

                    case TypeReferenceSerializationKind.BooleanType:
                        write("Boolean");
                        break;

                    case TypeReferenceSerializationKind.NumberLikeType:
                        write("Number");
                        break;

                    case TypeReferenceSerializationKind.StringLikeType:
                        write("String");
                        break;

                    case TypeReferenceSerializationKind.ArrayLikeType:
                        write("Array");
                        break;

                    case TypeReferenceSerializationKind.ESSymbolType:
                        if (languageVersion < ScriptTarget.ES6) {
                            write("typeof Symbol === 'function' ? Symbol : Object");
                        }
                        else {
                            write("Symbol");
                        }
                        break;

                    case TypeReferenceSerializationKind.TypeWithCallSignature:
                        write("Function");
                        break;

                    case TypeReferenceSerializationKind.ObjectType:
                        write("Object");
                        break;
                }
            }

            /** Serializes the parameter types of a function or the constructor of a class. Used by the __metadata decorator for a method or set accessor. */
            function emitSerializedParameterTypesOfNode(node: Node) {
                // serialization of parameter types uses the following rules:
                //
                // * If the declaration is a class, the parameters of the first constructor with a body are used.
                // * If the declaration is function-like and has a body, the parameters of the function are used.
                //
                // For the rules on serializing the type of each parameter declaration, see `serializeTypeOfDeclaration`.
                if (node) {
                    let valueDeclaration: FunctionLikeDeclaration;
                    if (node.kind === SyntaxKind.ClassDeclaration) {
                        valueDeclaration = getFirstConstructorWithBody(<ClassDeclaration>node);
                    }
                    else if (isFunctionLike(node) && nodeIsPresent((<FunctionLikeDeclaration>node).body)) {
                        valueDeclaration = <FunctionLikeDeclaration>node;
                    }

                    if (valueDeclaration) {
                        const parameters = valueDeclaration.parameters;
                        const parameterCount = parameters.length;
                        if (parameterCount > 0) {
                            for (var i = 0; i < parameterCount; i++) {
                                if (i > 0) {
                                    write(", ");
                                }

                                if (parameters[i].dotDotDotToken) {
                                    let parameterType = parameters[i].type;
                                    if (parameterType.kind === SyntaxKind.ArrayType) {
                                        parameterType = (<ArrayTypeNode>parameterType).elementType;
                                    }
                                    else if (parameterType.kind === SyntaxKind.TypeReference && (<TypeReferenceNode>parameterType).typeArguments && (<TypeReferenceNode>parameterType).typeArguments.length === 1) {
                                        parameterType = (<TypeReferenceNode>parameterType).typeArguments[0];
                                    }
                                    else {
                                        parameterType = undefined;
                                    }

                                    emitSerializedTypeNode(parameterType);
                                }
                                else {
                                    emitSerializedTypeOfNode(parameters[i]);
                                }
                            }
                        }
                    }
                }
            }

            /** Serializes the return type of function. Used by the __metadata decorator for a method. */
            function emitSerializedReturnTypeOfNode(node: Node): string | string[] {
                if (node && isFunctionLike(node) && (<FunctionLikeDeclaration>node).type) {
                    emitSerializedTypeNode((<FunctionLikeDeclaration>node).type);
                    return;
                }

                write("void 0");
            }


            function emitSerializedTypeMetadata(node: Declaration, writeComma: boolean): number {
                // This method emits the serialized type metadata for a decorator target.
                // The caller should have already tested whether the node has decorators.
                let argumentsWritten = 0;
                if (compilerOptions.emitDecoratorMetadata) {
                    if (shouldEmitTypeMetadata(node)) {
                        if (writeComma) {
                            write(", ");
                        }
                        writeLine();
                        write("__metadata('design:type', ");
                        emitSerializedTypeOfNode(node);
                        write(")");
                        argumentsWritten++;
                    }
                    if (shouldEmitParamTypesMetadata(node)) {
                        if (writeComma || argumentsWritten) {
                            write(", ");
                        }
                        writeLine();
                        write("__metadata('design:paramtypes', [");
                        emitSerializedParameterTypesOfNode(node);
                        write("])");
                        argumentsWritten++;
                    }
                    if (shouldEmitReturnTypeMetadata(node)) {
                        if (writeComma || argumentsWritten) {
                            write(", ");
                        }

                        writeLine();
                        write("__metadata('design:returntype', ");
                        emitSerializedReturnTypeOfNode(node);
                        write(")");
                        argumentsWritten++;
                    }
                }

                return argumentsWritten;
            }

            function emitInterfaceDeclaration(node: InterfaceDeclaration) {
                let anyNode = <any>node;
                let classLikeDeclaration = <ClassLikeDeclaration>anyNode;
                let callOrIndexSignatures = <Array<SignatureDeclaration>>ts.filter(node.members, member => member.kind === SyntaxKind.CallSignature);

                if (!callOrIndexSignatures.length) {
                    emitConstructor(classLikeDeclaration, null, ts.getInterfaceBaseTypeNodes(node));
                    emitMemberFunctionsForES5AndLower(classLikeDeclaration);
                    emitPropertyDeclarations(classLikeDeclaration, <Array<PropertyDeclaration>>ts.filter(node.members, member  => !isInterfaceFunctionMember(member)));
                    emitCommentsOnNotEmittedNode(node);
                }
                else {
                    emitCallSignatures(node, callOrIndexSignatures);
                }
            }

            function shouldEmitEnumDeclaration(node: EnumDeclaration) {
                let isConstEnum = isConst(node);
                return !isConstEnum || compilerOptions.preserveConstEnums || compilerOptions.isolatedModules;
            }

            function emitEnumDeclaration(node: EnumDeclaration) {
                let membersLength = node.members.length - 1; 
                // const enums are completely erased during compilation.
                if (!shouldEmitEnumDeclaration(node)) {
                    return;
                }

                forceWriteLine();
                emitEnumAnnotation(node);

                if (!emitModuleIfNeeded(node)) {
                    write("var ");
                }

                emit(node.name);
                write(" = {");
                increaseIndent();

                emitLines(node.members, function (node, i) {
                    if (i < membersLength) {
                        write(",");
                    }
                });

                decreaseIndent();
                writeLine();
                write("};");

                if (!isES6ExportedDeclaration(node) && node.flags & NodeFlags.Export && !shouldHoistDeclarationInSystemJsModule(node)) {
                    // do not emit var if variable was already hoisted
                    writeLine();
                    emitStart(node);
                    write("var ");
                    emit(node.name);
                    write(" = ");
                    emitModuleMemberName(node);
                    emitEnd(node);
                    write(";");
                }
                if (modulekind !== ModuleKind.ES6 && node.parent === currentSourceFile) {
                    if (modulekind === ModuleKind.System && (node.flags & NodeFlags.Export)) {
                        // write the call to exporter for enum
                        writeLine();
                        write(`${exportFunctionForFile}("`);
                        emitDeclarationName(node);
                        write(`", `);
                        emitDeclarationName(node);
                        write(");");
                    }
                    emitExportMemberAssignments(node.name);
                }
            }

            function emitEnumMember(node: EnumMember) {
                emitExpressionForPropertyName(node.name);
                write(": ");
                writeEnumMemberDeclarationValue(node);
            }

            function writeEnumMemberDeclarationValue(member: EnumMember) {
                let value = resolver.getConstantValue(member);
                if (value !== undefined) {
                    write(value.toString());
                    return;
                }
                else if (member.initializer) {
                    emit(member.initializer);
                }
                else {
                    write("undefined");
                }
            }

            function getInnerMostModuleDeclarationFromDottedModule(moduleDeclaration: ModuleDeclaration): ModuleDeclaration {
                if (moduleDeclaration.body.kind === SyntaxKind.ModuleDeclaration) {
                    let recursiveInnerModule = getInnerMostModuleDeclarationFromDottedModule(<ModuleDeclaration>moduleDeclaration.body);
                    return recursiveInnerModule || <ModuleDeclaration>moduleDeclaration.body;
                }
            }

            function isInstantiatedModule(node: ModuleDeclaration, preserveConstEnums: boolean) {
                let moduleState = getModuleInstanceState(node);
                return moduleState === ModuleInstanceState.Instantiated ||
                    (preserveConstEnums && moduleState === ModuleInstanceState.ConstEnumOnly);
            }

            function getModuleInstanceState(node: Node): ModuleInstanceState {
                // A module is uninstantiated if it contains only
                // 1. interface declarations, type alias declarations
                if (node.kind === SyntaxKind.InterfaceDeclaration || node.kind === SyntaxKind.TypeAliasDeclaration) {
                    return ts.ModuleInstanceState.Instantiated;
                }
                // 2. const enum declarations
                else if (isConstEnumDeclaration(node)) {
                    return ModuleInstanceState.ConstEnumOnly;
                }
                // 3. non-exported import declarations
                else if ((node.kind === SyntaxKind.ImportDeclaration || node.kind === SyntaxKind.ImportEqualsDeclaration) && !(node.flags & NodeFlags.Export)) {
                    return ModuleInstanceState.NonInstantiated;
                }
                // 4. other uninstantiated module declarations.
                else if (node.kind === SyntaxKind.ModuleBlock) {
                    let state = ModuleInstanceState.NonInstantiated;
                    forEachChild(node, n => {
                        switch (getModuleInstanceState(n)) {
                            case ModuleInstanceState.NonInstantiated:
                                // child is non-instantiated - continue searching
                                return false;
                            case ModuleInstanceState.ConstEnumOnly:
                                // child is const enum only - record state and continue searching
                                state = ModuleInstanceState.ConstEnumOnly;
                                return false;
                            case ModuleInstanceState.Instantiated:
                                // child is instantiated - record state and stop
                                state = ModuleInstanceState.Instantiated;
                                return true;
                        }
                    });
                    return state;
                }
                else if (node.kind === SyntaxKind.ModuleDeclaration) {
                    return getModuleInstanceState((<ModuleDeclaration>node).body);
                }
                else {
                    return ModuleInstanceState.Instantiated;
                }
            }

            function shouldEmitModuleDeclaration(node: ModuleDeclaration) {
                return isInstantiatedModule(node, compilerOptions.preserveConstEnums || compilerOptions.isolatedModules);
            }

            function isModuleMergedWithES6Class(node: ModuleDeclaration) {
                return languageVersion === ScriptTarget.ES6 && !!(resolver.getNodeCheckFlags(node) & NodeCheckFlags.LexicalModuleMergesWithClass);
            }

            function emitModuleIfNeeded(node: Node): boolean {
                return !!emitModuleName(node);
            }

            function getModuleName(node: Node): string {
                let scope = getSymbolScope(node)

                if (!isScopeLike(scope)) {
                    let generatedPath;

                    if (generatedPath = getGeneratedPathForModule(scope)) {
                        return generatedPath + ".";
                    }
                }
                return "";
            }

            function emitModuleName(node: Node): string {
                let generatedPath: string;

                if (generatedPath = getModuleName(node)) {
                    write(generatedPath);
                    return generatedPath;
                }
                return "";
            }

            function emitModuleForFunctionIfNeeded(node: FunctionLikeDeclaration): boolean {
                if (shouldEmitFunctionName(node)) {
                    return emitModuleIfNeeded(node);
                }

                return false;
            }

            function emitModuleDeclaration(node: ModuleDeclaration) {
                // Emit only if this module is non-ambient.
                let shouldEmit = shouldEmitModuleDeclaration(node);
                if (!shouldEmit) {
                    return emitCommentsOnNotEmittedNode(node);
                }
                let containingModule = getContainingModule(node);
                let moduleAlreadyGenerated = isModuleAlreadyGenerated(node);
                let hoistedInDeclarationScope = !containingModule && !moduleAlreadyGenerated;
                let name = getGeneratedNameForNode(node)

                forceWriteLine();

                if (hoistedInDeclarationScope) {
                    write("var ");
                    write(name);
                    write(" = {};");
                    writeLine();
                }
                else if (!moduleAlreadyGenerated) {
                    emitModuleIfNeeded(node);
                    write(name);
                    write(" = {};");
                }

                if (node.body.kind === SyntaxKind.ModuleBlock) {
                    let saveTempFlags = tempFlags;
                    let saveTempVariables = tempVariables;
                    tempFlags = 0;
                    tempVariables = undefined;
                    emit(node.body);
                    tempFlags = saveTempFlags;
                    tempVariables = saveTempVariables;
                }
                else {
                    emit(node.body);
                }

                if (!isES6ExportedDeclaration(node) && node.name.kind === SyntaxKind.Identifier && node.parent === currentSourceFile) {
                    if (modulekind === ModuleKind.System && (node.flags & NodeFlags.Export)) {
                        writeLine();
                        write(`${exportFunctionForFile}("`);
                        emitDeclarationName(node);
                        write(`", `);
                        emitDeclarationName(node);
                        write(");");
                    }
                    emitExportMemberAssignments(<Identifier>node.name);
                }

                setModuleGenerated(node);
            }

            /*
             * Some bundlers (SystemJS builder) sometimes want to rename dependencies.
             * Here we check if alternative name was provided for a given moduleName and return it if possible.
             */
            function tryRenameExternalModule(moduleName: LiteralExpression): string {
                if (currentSourceFile.renamedDependencies && hasProperty(currentSourceFile.renamedDependencies, moduleName.text)) {
                    return `"${currentSourceFile.renamedDependencies[moduleName.text]}"`;
                }
                return undefined;
            }

            function emitRequire(moduleName: Expression) {
                if (moduleName.kind === SyntaxKind.StringLiteral) {
                    write("require(");
                    let text = tryRenameExternalModule(<LiteralExpression>moduleName);
                    if (text) {
                        write(text);
                    }
                    else {
                        emitStart(moduleName);
                        emitLiteral(<LiteralExpression>moduleName);
                        emitEnd(moduleName);
                    }
                    emitToken(SyntaxKind.CloseParenToken, moduleName.end);
                }
                else {
                    write("require()");
                }
            }

            function getNamespaceDeclarationNode(node: ImportDeclaration | ImportEqualsDeclaration | ExportDeclaration) {
                if (node.kind === SyntaxKind.ImportEqualsDeclaration) {
                    return <ImportEqualsDeclaration>node;
                }
                let importClause = (<ImportDeclaration>node).importClause;
                if (importClause && importClause.namedBindings && importClause.namedBindings.kind === SyntaxKind.NamespaceImport) {
                    return <NamespaceImport>importClause.namedBindings;
                }
            }

            function isDefaultImport(node: ImportDeclaration | ImportEqualsDeclaration | ExportDeclaration) {
                return node.kind === SyntaxKind.ImportDeclaration && (<ImportDeclaration>node).importClause && !!(<ImportDeclaration>node).importClause.name;
            }

            function emitExportImportAssignments(node: Node) {
                if (isAliasSymbolDeclaration(node) && resolver.isValueAliasDeclaration(node)) {
                    emitExportMemberAssignments(<Identifier>(<Declaration>node).name);
                }
                forEachChild(node, emitExportImportAssignments);
            }

            function emitImportDeclaration(node: ImportDeclaration) {
                if (modulekind !== ModuleKind.ES6) {
                    return emitExternalImportDeclaration(node);
                }

                // ES6 import
                if (node.importClause) {
                    let shouldEmitDefaultBindings = resolver.isReferencedAliasDeclaration(node.importClause);
                    let shouldEmitNamedBindings = node.importClause.namedBindings && resolver.isReferencedAliasDeclaration(node.importClause.namedBindings, /* checkChildren */ true);
                    if (shouldEmitDefaultBindings || shouldEmitNamedBindings) {
                        write("import ");
                        emitStart(node.importClause);
                        if (shouldEmitDefaultBindings) {
                            emit(node.importClause.name);
                            if (shouldEmitNamedBindings) {
                                write(", ");
                            }
                        }
                        if (shouldEmitNamedBindings) {
                            emitLeadingComments(node.importClause.namedBindings);
                            emitStart(node.importClause.namedBindings);
                            if (node.importClause.namedBindings.kind === SyntaxKind.NamespaceImport) {
                                write("* as ");
                                emit((<NamespaceImport>node.importClause.namedBindings).name);
                            }
                            else {
                                write("{ ");
                                emitExportOrImportSpecifierList((<NamedImports>node.importClause.namedBindings).elements, resolver.isReferencedAliasDeclaration);
                                write(" }");
                            }
                            emitEnd(node.importClause.namedBindings);
                            emitTrailingComments(node.importClause.namedBindings);
                        }

                        emitEnd(node.importClause);
                        write(" from ");
                        emit(node.moduleSpecifier);
                        write(";");
                    }
                }
                else {
                    write("import ");
                    emit(node.moduleSpecifier);
                    write(";");
                }
            }

            function emitExternalImportDeclaration(node: ImportDeclaration | ImportEqualsDeclaration) {
                if (contains(externalImports, node)) {
                    let isExportedImport = node.kind === SyntaxKind.ImportEqualsDeclaration && (node.flags & NodeFlags.Export) !== 0;
                    let namespaceDeclaration = getNamespaceDeclarationNode(node);

                    if (modulekind !== ModuleKind.AMD) {
                        emitLeadingComments(node);
                        emitStart(node);
                        if (namespaceDeclaration && !isDefaultImport(node)) {
                            // import x = require("foo")
                            // import * as x from "foo"
                            if (!isExportedImport) write("var ");
                            emitModuleMemberName(namespaceDeclaration);
                            write(" = ");
                        }
                        else {
                            // import "foo"
                            // import x from "foo"
                            // import { x, y } from "foo"
                            // import d, * as x from "foo"
                            // import d, { x, y } from "foo"
                            let isNakedImport = SyntaxKind.ImportDeclaration && !(<ImportDeclaration>node).importClause;
                            if (!isNakedImport) {
                                write("var ");
                                write(getGeneratedNameForNode(<ImportDeclaration>node));
                                write(" = ");
                            }
                        }
                        emitRequire(getExternalModuleName(node));
                        if (namespaceDeclaration && isDefaultImport(node)) {
                            // import d, * as x from "foo"
                            write(", ");
                            emitModuleMemberName(namespaceDeclaration);
                            write(" = ");
                            write(getGeneratedNameForNode(<ImportDeclaration>node));
                        }
                        write(";");
                        emitEnd(node);
                        emitExportImportAssignments(node);
                        emitTrailingComments(node);
                    }
                    else {
                        if (isExportedImport) {
                            emitModuleMemberName(namespaceDeclaration);
                            write(" = ");
                            emit(namespaceDeclaration.name);
                            write(";");
                        }
                        else if (namespaceDeclaration && isDefaultImport(node)) {
                            // import d, * as x from "foo"
                            write("var ");
                            emitModuleMemberName(namespaceDeclaration);
                            write(" = ");
                            write(getGeneratedNameForNode(<ImportDeclaration>node));
                            write(";");
                        }
                        emitExportImportAssignments(node);
                    }
                }
            }

            function emitImportEqualsDeclaration(node: ImportEqualsDeclaration) {
                if (isExternalModuleImportEqualsDeclaration(node)) {
                    emitExternalImportDeclaration(node);
                    return;
                }
                // preserve old compiler's behavior: emit 'var' for import declaration (even if we do not consider them referenced) when
                // - current file is not external module
                // - import declaration is top level and target is value imported by entity name
                if (resolver.isReferencedAliasDeclaration(node) ||
                    (!isExternalModule(currentSourceFile) && resolver.isTopLevelValueImportEqualsWithEntityName(node))) {
                    emitLeadingComments(node);
                    emitStart(node);

                    // variable declaration for import-equals declaration can be hoisted in system modules
                    // in this case 'var' should be omitted and emit should contain only initialization
                    let variableDeclarationIsHoisted = shouldHoistVariable(node, /*checkIfSourceFileLevelDecl*/ true);

                    // is it top level export import v = a.b.c in system module?
                    // if yes - it needs to be rewritten as exporter('v', v = a.b.c)
                    let isExported = isSourceFileLevelDeclarationInSystemJsModule(node, /*isExported*/ true);

                    if (!variableDeclarationIsHoisted) {
                        Debug.assert(!isExported);

                        if (isES6ExportedDeclaration(node)) {
                            write("export ");
                            write("var ");
                        }
                    }

                    if (isExported) {
                        write(`${exportFunctionForFile}("`);
                        emitNodeWithoutSourceMap(node.name);
                        write(`", `);
                    }

                    emitModuleIfNeeded(node);
                    emitModuleMemberName(node);
                    write(" = ");
                    emit(node.moduleReference);

                    if (isExported) {
                        write(")");
                    }

                    write(";");
                    emitEnd(node);
                    emitExportImportAssignments(node);
                    emitTrailingComments(node);
                }
            }

            function emitExportDeclaration(node: ExportDeclaration) {
                Debug.assert(modulekind !== ModuleKind.System);

                if (modulekind !== ModuleKind.ES6) {
                    if (node.moduleSpecifier && (!node.exportClause || resolver.isValueAliasDeclaration(node))) {
                        emitStart(node);
                        let generatedName = getGeneratedNameForNode(node);
                        if (node.exportClause) {
                            // export { x, y, ... } from "foo"
                            if (modulekind !== ModuleKind.AMD) {
                                write("var ");
                                write(generatedName);
                                write(" = ");
                                emitRequire(getExternalModuleName(node));
                                write(";");
                            }
                            for (let specifier of node.exportClause.elements) {
                                if (resolver.isValueAliasDeclaration(specifier)) {
                                    writeLine();
                                    emitStart(specifier);
                                    emitContainingModuleName(specifier);
                                    write(".");
                                    emitNodeWithCommentsAndWithoutSourcemap(specifier.name);
                                    write(" = ");
                                    write(generatedName);
                                    write(".");
                                    emitNodeWithCommentsAndWithoutSourcemap(specifier.propertyName || specifier.name);
                                    write(";");
                                    emitEnd(specifier);
                                }
                            }
                        }
                        else {
                            // export * from "foo"
                            writeLine();
                            write("__export(");
                            if (modulekind !== ModuleKind.AMD) {
                                emitRequire(getExternalModuleName(node));
                            }
                            else {
                                write(generatedName);
                            }
                            write(");");
                        }
                        emitEnd(node);
                    }
                }
                else {
                    if (!node.exportClause || resolver.isValueAliasDeclaration(node)) {
                        write("export ");
                        if (node.exportClause) {
                            // export { x, y, ... }
                            write("{ ");
                            emitExportOrImportSpecifierList(node.exportClause.elements, resolver.isValueAliasDeclaration);
                            write(" }");
                        }
                        else {
                            write("*");
                        }
                        if (node.moduleSpecifier) {
                            write(" from ");
                            emit(node.moduleSpecifier);
                        }
                        write(";");
                    }
                }
            }

            function emitExportOrImportSpecifierList(specifiers: ImportOrExportSpecifier[], shouldEmit: (node: Node) => boolean) {
                Debug.assert(modulekind === ModuleKind.ES6);

                let needsComma = false;
                for (let specifier of specifiers) {
                    if (shouldEmit(specifier)) {
                        if (needsComma) {
                            write(", ");
                        }
                        if (specifier.propertyName) {
                            emit(specifier.propertyName);
                            write(" as ");
                        }
                        emit(specifier.name);
                        needsComma = true;
                    }
                }
            }

            function emitExportAssignment(node: ExportAssignment) {
                if (!node.isExportEquals && resolver.isValueAliasDeclaration(node)) {
                    if (modulekind === ModuleKind.ES6) {
                        writeLine();
                        emitStart(node);
                        write("export default ");
                        let expression = node.expression;
                        emit(expression);
                        if (expression.kind !== SyntaxKind.FunctionDeclaration &&
                            expression.kind !== SyntaxKind.ClassDeclaration) {
                            write(";");
                        }
                        emitEnd(node);
                    }
                    else {
                        writeLine();
                        emitStart(node);
                        if (modulekind === ModuleKind.System) {
                            write(`${exportFunctionForFile}("default",`);
                            emit(node.expression);
                            write(")");
                        }
                        else {
                            emitEs6ExportDefaultCompat(node);
                            emitContainingModuleName(node);
                            if (languageVersion === ScriptTarget.ES3) {
                                write("[\"default\"] = ");
                            }
                            else {
                                write(".default = ");
                            }
                            emit(node.expression);
                        }
                        write(";");
                        emitEnd(node);
                    }
                }
            }

            function collectExternalModuleInfo(sourceFile: SourceFile) {
                externalImports = [];
                exportSpecifiers = {};
                exportEquals = undefined;
                hasExportStars = false;
                for (let node of sourceFile.statements) {
                    switch (node.kind) {
                        case SyntaxKind.ImportDeclaration:
                            if (!(<ImportDeclaration>node).importClause ||
                                resolver.isReferencedAliasDeclaration((<ImportDeclaration>node).importClause, /*checkChildren*/ true)) {
                                // import "mod"
                                // import x from "mod" where x is referenced
                                // import * as x from "mod" where x is referenced
                                // import { x, y } from "mod" where at least one import is referenced
                                externalImports.push(<ImportDeclaration>node);
                            }
                            break;
                        case SyntaxKind.ImportEqualsDeclaration:
                            if ((<ImportEqualsDeclaration>node).moduleReference.kind === SyntaxKind.ExternalModuleReference && resolver.isReferencedAliasDeclaration(node)) {
                                // import x = require("mod") where x is referenced
                                externalImports.push(<ImportEqualsDeclaration>node);
                            }
                            break;
                        case SyntaxKind.ExportDeclaration:
                            if ((<ExportDeclaration>node).moduleSpecifier) {
                                if (!(<ExportDeclaration>node).exportClause) {
                                    // export * from "mod"
                                    externalImports.push(<ExportDeclaration>node);
                                    hasExportStars = true;
                                }
                                else if (resolver.isValueAliasDeclaration(node)) {
                                    // export { x, y } from "mod" where at least one export is a value symbol
                                    externalImports.push(<ExportDeclaration>node);
                                }
                            }
                            else {
                                // export { x, y }
                                for (let specifier of (<ExportDeclaration>node).exportClause.elements) {
                                    let name = (specifier.propertyName || specifier.name).text;
                                    (exportSpecifiers[name] || (exportSpecifiers[name] = [])).push(specifier);
                                }
                            }
                            break;
                        case SyntaxKind.ExportAssignment:
                            if ((<ExportAssignment>node).isExportEquals && !exportEquals) {
                                // export = x
                                exportEquals = <ExportAssignment>node;
                            }
                            break;
                    }
                }
            }

            function emitExportStarHelper() {
                if (hasExportStars) {
                    writeLine();
                    write("function __export(m) {");
                    increaseIndent();
                    writeLine();
                    write("for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];");
                    decreaseIndent();
                    writeLine();
                    write("}");
                }
            }

            function getLocalNameForExternalImport(node: ImportDeclaration | ExportDeclaration | ImportEqualsDeclaration): string {
                let namespaceDeclaration = getNamespaceDeclarationNode(node);
                if (namespaceDeclaration && !isDefaultImport(node)) {
                    return getSourceTextOfNodeFromSourceFile(currentSourceFile, namespaceDeclaration.name);
                }
                if (node.kind === SyntaxKind.ImportDeclaration && (<ImportDeclaration>node).importClause) {
                    return getGeneratedNameForNode(node);
                }
                if (node.kind === SyntaxKind.ExportDeclaration && (<ExportDeclaration>node).moduleSpecifier) {
                    return getGeneratedNameForNode(node);
                }
            }

            function getExternalModuleNameText(importNode: ImportDeclaration | ExportDeclaration | ImportEqualsDeclaration): string {
                let moduleName = getExternalModuleName(importNode);
                if (moduleName.kind === SyntaxKind.StringLiteral) {
                    return tryRenameExternalModule(<LiteralExpression>moduleName) || getLiteralText(<LiteralExpression>moduleName);
                }

                return undefined;
            }

            function emitVariableDeclarationsForImports(): void {
                if (externalImports.length === 0) {
                    return;
                }

                writeLine();
                let started = false;
                for (let importNode of externalImports) {
                    // do not create variable declaration for exports and imports that lack import clause
                    let skipNode =
                        importNode.kind === SyntaxKind.ExportDeclaration ||
                        (importNode.kind === SyntaxKind.ImportDeclaration && !(<ImportDeclaration>importNode).importClause);

                    if (skipNode) {
                        continue;
                    }

                    if (!started) {
                        write("var ");
                        started = true;
                    }
                    else {
                        write(", ");
                    }

                    write(getLocalNameForExternalImport(importNode));
                }

                if (started) {
                    write(";");
                }
            }

            function emitLocalStorageForExportedNamesIfNecessary(exportedDeclarations: (Identifier | Declaration)[]): string {
                // when resolving exports local exported entries/indirect exported entries in the module
                // should always win over entries with similar names that were added via star exports
                // to support this we store names of local/indirect exported entries in a set.
                // this set is used to filter names brought by star expors.
                if (!hasExportStars) {
                    // local names set is needed only in presence of star exports
                    return undefined;
                }

                // local names set should only be added if we have anything exported
                if (!exportedDeclarations && isEmpty(exportSpecifiers)) {
                    // no exported declarations (export var ...) or export specifiers (export {x})
                    // check if we have any non star export declarations.
                    let hasExportDeclarationWithExportClause = false;
                    for (let externalImport of externalImports) {
                        if (externalImport.kind === SyntaxKind.ExportDeclaration && (<ExportDeclaration>externalImport).exportClause) {
                            hasExportDeclarationWithExportClause = true;
                            break;
                        }
                    }

                    if (!hasExportDeclarationWithExportClause) {
                        // we still need to emit exportStar helper
                        return emitExportStarFunction(/*localNames*/ undefined);
                    }
                }

                const exportedNamesStorageRef = makeUniqueName("exportedNames");

                writeLine();
                write(`var ${exportedNamesStorageRef} = {`);
                increaseIndent();

                let started = false;
                if (exportedDeclarations) {
                    for (let i = 0; i < exportedDeclarations.length; ++i) {
                        // write name of exported declaration, i.e 'export var x...'
                        writeExportedName(exportedDeclarations[i]);
                    }
                }

                if (exportSpecifiers) {
                    for (let n in exportSpecifiers) {
                        for (let specifier of exportSpecifiers[n]) {
                            // write name of export specified, i.e. 'export {x}'
                            writeExportedName(specifier.name);
                        }
                    }
                }

                for (let externalImport of externalImports) {
                    if (externalImport.kind !== SyntaxKind.ExportDeclaration) {
                        continue;
                    }

                    let exportDecl = <ExportDeclaration>externalImport;
                    if (!exportDecl.exportClause) {
                        // export * from ...
                        continue;
                    }

                    for (let element of exportDecl.exportClause.elements) {
                        // write name of indirectly exported entry, i.e. 'export {x} from ...'
                        writeExportedName(element.name || element.propertyName);
                    }
                }

                decreaseIndent();
                writeLine();
                write("};");

                return emitExportStarFunction(exportedNamesStorageRef);

                function emitExportStarFunction(localNames: string): string {
                    const exportStarFunction = makeUniqueName("exportStar");

                    writeLine();

                    // define an export star helper function
                    write(`function ${exportStarFunction}(m) {`);
                    increaseIndent();
                    writeLine();
                    write(`var exports = {};`);
                    writeLine();
                    write(`for(var n in m) {`);
                    increaseIndent();
                    writeLine();
                    write(`if (n !== "default"`);
                    if (localNames) {
                        write(`&& !${localNames}.hasOwnProperty(n)`);
                    }
                    write(`) exports[n] = m[n];`);
                    decreaseIndent();
                    writeLine();
                    write("}");
                    writeLine();
                    write(`${exportFunctionForFile}(exports);`);
                    decreaseIndent();
                    writeLine();
                    write("}");

                    return exportStarFunction;
                }

                function writeExportedName(node: Identifier | Declaration): void {
                    // do not record default exports
                    // they are local to module and never overwritten (explicitly skipped) by star export
                    if (node.kind !== SyntaxKind.Identifier && node.flags & NodeFlags.Default) {
                        return;
                    }

                    if (started) {
                        write(",");
                    }
                    else {
                        started = true;
                    }

                    writeLine();
                    write("'");
                    if (node.kind === SyntaxKind.Identifier) {
                        emitNodeWithCommentsAndWithoutSourcemap(node);
                    }
                    else {
                        emitDeclarationName(<Declaration>node);
                    }

                    write("': true");
                }
            }

            function processTopLevelVariableAndFunctionDeclarations(node: SourceFile): (Identifier | Declaration)[] {
                // per ES6 spec:
                // 15.2.1.16.4 ModuleDeclarationInstantiation() Concrete Method
                // - var declarations are initialized to undefined - 14.a.ii
                // - function/generator declarations are instantiated - 16.a.iv
                // this means that after module is instantiated but before its evaluation
                // exported functions are already accessible at import sites
                // in theory we should hoist only exported functions and its dependencies
                // in practice to simplify things we'll hoist all source level functions and variable declaration
                // including variables declarations for module and class declarations
                let hoistedVars: (Identifier | ClassDeclaration | ModuleDeclaration | EnumDeclaration)[];
                let hoistedFunctionDeclarations: FunctionDeclaration[];
                let exportedDeclarations: (Identifier | Declaration)[];

                visit(node);

                if (hoistedVars) {
                    writeLine();
                    write("var ");
                    let seen: Map<string> = {};
                    for (let i = 0; i < hoistedVars.length; ++i) {
                        let local = hoistedVars[i];
                        let name = local.kind === SyntaxKind.Identifier
                            ? <Identifier>local
                            : <Identifier>(<ClassDeclaration | ModuleDeclaration | EnumDeclaration>local).name;

                        if (name) {
                            // do not emit duplicate entries (in case of declaration merging) in the list of hoisted variables
                            let text = unescapeIdentifier(name.text);
                            if (hasProperty(seen, text)) {
                                continue;
                            }
                            else {
                                seen[text] = text;
                            }
                        }

                        if (i !== 0) {
                            write(", ");
                        }

                        if (local.kind === SyntaxKind.ClassDeclaration || local.kind === SyntaxKind.ModuleDeclaration || local.kind === SyntaxKind.EnumDeclaration) {
                            emitDeclarationName(<ClassDeclaration | ModuleDeclaration | EnumDeclaration>local);
                        }
                        else {
                            emit(local);
                        }

                        let flags = getCombinedNodeFlags(local.kind === SyntaxKind.Identifier ? local.parent : local);
                        if (flags & NodeFlags.Export) {
                            if (!exportedDeclarations) {
                                exportedDeclarations = [];
                            }
                            exportedDeclarations.push(local);
                        }
                    }
                    write(";");
                }

                if (hoistedFunctionDeclarations) {
                    for (let f of hoistedFunctionDeclarations) {
                        writeLine();
                        emit(f);

                        if (f.flags & NodeFlags.Export) {
                            if (!exportedDeclarations) {
                                exportedDeclarations = [];
                            }
                            exportedDeclarations.push(f);
                        }
                    }
                }

                return exportedDeclarations;

                function visit(node: Node): void {
                    if (node.flags & NodeFlags.Ambient) {
                        return;
                    }

                    if (node.kind === SyntaxKind.FunctionDeclaration) {
                        if (!hoistedFunctionDeclarations) {
                            hoistedFunctionDeclarations = [];
                        }

                        hoistedFunctionDeclarations.push(<FunctionDeclaration>node);
                        return;
                    }

                    if (node.kind === SyntaxKind.ClassDeclaration) {
                        if (!hoistedVars) {
                            hoistedVars = [];
                        }

                        hoistedVars.push(<ClassDeclaration>node);
                        return;
                    }

                    if (node.kind === SyntaxKind.EnumDeclaration) {
                        if (shouldEmitEnumDeclaration(<EnumDeclaration>node)) {
                            if (!hoistedVars) {
                                hoistedVars = [];
                            }

                            hoistedVars.push(<ModuleDeclaration>node);
                        }

                        return;
                    }

                    if (node.kind === SyntaxKind.ModuleDeclaration) {
                        if (shouldEmitModuleDeclaration(<ModuleDeclaration>node)) {
                            if (!hoistedVars) {
                                hoistedVars = [];
                            }

                            hoistedVars.push(<ModuleDeclaration>node);
                        }
                        return;
                    }

                    if (node.kind === SyntaxKind.VariableDeclaration || node.kind === SyntaxKind.BindingElement) {
                        if (shouldHoistVariable(<VariableDeclaration | BindingElement>node, /*checkIfSourceFileLevelDecl*/ false)) {
                            let name = (<VariableDeclaration | BindingElement>node).name;
                            if (name.kind === SyntaxKind.Identifier) {
                                if (!hoistedVars) {
                                    hoistedVars = [];
                                }

                                hoistedVars.push(<Identifier>name);
                            }
                            else {
                                forEachChild(name, visit);
                            }
                        }
                        return;
                    }

                    if (isInternalModuleImportEqualsDeclaration(node) && resolver.isValueAliasDeclaration(node)) {
                        if (!hoistedVars) {
                            hoistedVars = [];
                        }

                        hoistedVars.push(node.name);
                        return;
                    }

                    if (isBindingPattern(node)) {
                        forEach((<BindingPattern>node).elements, visit);
                        return;
                    }

                    if (!isDeclaration(node)) {
                        forEachChild(node, visit);
                    }
                }
            }

            function shouldHoistVariable(node: VariableDeclaration | VariableDeclarationList | BindingElement, checkIfSourceFileLevelDecl: boolean): boolean {
                if (checkIfSourceFileLevelDecl && !shouldHoistDeclarationInSystemJsModule(node)) {
                    return false;
                }
                // hoist variable if
                // - it is not block scoped
                // - it is top level block scoped
                // if block scoped variables are nested in some another block then
                // no other functions can use them except ones that are defined at least in the same block
                return (getCombinedNodeFlags(node) & NodeFlags.BlockScoped) === 0 ||
                    getEnclosingBlockScopeContainer(node).kind === SyntaxKind.SourceFile;
            }

            function isCurrentFileSystemExternalModule() {
                return modulekind === ModuleKind.System && isExternalModule(currentSourceFile);
            }

            function emitSystemModuleBody(node: SourceFile, dependencyGroups: DependencyGroup[], startIndex: number): void {
                // shape of the body in system modules:
                // function (exports) {
                //     <list of local aliases for imports>
                //     <hoisted function declarations>
                //     <hoisted variable declarations>
                //     return {
                //         setters: [
                //             <list of setter function for imports>
                //         ],
                //         execute: function() {
                //             <module statements>
                //         }
                //     }
                //     <temp declarations>
                // }
                // I.e:
                // import {x} from 'file1'
                // var y = 1;
                // export function foo() { return y + x(); }
                // console.log(y);
                // will be transformed to
                // function(exports) {
                //     var file1; // local alias
                //     var y;
                //     function foo() { return y + file1.x(); }
                //     exports("foo", foo);
                //     return {
                //         setters: [
                //             function(v) { file1 = v }
                //         ],
                //         execute(): function() {
                //             y = 1;
                //             console.log(y);
                //         }
                //     };
                // }
                emitExecute(node, startIndex);
            }

            function emitSetters(exportStarFunction: string, dependencyGroups: DependencyGroup[]) {
                write("setters:[");

                for (let i = 0; i < dependencyGroups.length; ++i) {
                    if (i !== 0) {
                        write(",");
                    }

                    writeLine();
                    increaseIndent();

                    let group = dependencyGroups[i];

                    // derive a unique name for parameter from the first named entry in the group
                    let parameterName = makeUniqueName(forEach(group, getLocalNameForExternalImport) || "");
                    write(`function (${parameterName}) {`);
                    increaseIndent();

                    for (let entry of group) {
                        let importVariableName = getLocalNameForExternalImport(entry) || "";

                        switch (entry.kind) {
                            case SyntaxKind.ImportDeclaration:
                                if (!(<ImportDeclaration>entry).importClause) {
                                    // 'import "..."' case
                                    // module is imported only for side-effects, no emit required
                                    break;
                                }
                            // fall-through
                            case SyntaxKind.ImportEqualsDeclaration:
                                Debug.assert(importVariableName !== "");

                                writeLine();
                                // save import into the local
                                write(`${importVariableName} = ${parameterName};`);
                                writeLine();
                                break;
                            case SyntaxKind.ExportDeclaration:
                                Debug.assert(importVariableName !== "");

                                if ((<ExportDeclaration>entry).exportClause) {
                                    // export {a, b as c} from 'foo'
                                    // emit as:
                                    // exports_({
                                    //    "a": _["a"],
                                    //    "c": _["b"]
                                    // });
                                    writeLine();
                                    write(`${exportFunctionForFile}({`);
                                    writeLine();
                                    increaseIndent();
                                    for (let i = 0, len = (<ExportDeclaration>entry).exportClause.elements.length; i < len; ++i) {
                                        if (i !== 0) {
                                            write(",");
                                            writeLine();
                                        }

                                        let e = (<ExportDeclaration>entry).exportClause.elements[i];
                                        write(`"`);
                                        emitNodeWithCommentsAndWithoutSourcemap(e.name);
                                        write(`": ${parameterName}["`);
                                        emitNodeWithCommentsAndWithoutSourcemap(e.propertyName || e.name);
                                        write(`"]`);
                                    }
                                    decreaseIndent();
                                    writeLine();
                                    write("});");
                                }
                                else {
                                    writeLine();
                                    // export * from 'foo'
                                    // emit as:
                                    // exportStar(_foo);
                                    write(`${exportStarFunction}(${parameterName});`);
                                }

                                writeLine();
                                break;
                        }

                    }

                    decreaseIndent();

                    write("}");
                    decreaseIndent();
                }
                write("],");
            }

            function emitExecute(node: SourceFile, startIndex: number) {
                for (let i = startIndex; i < node.statements.length; ++i) {
                    let statement = node.statements[i];
                    switch (statement.kind) {
                        // - function declarations are not emitted because they were already hoisted
                        // - import declarations are not emitted since they are already handled in setters
                        // - export declarations with module specifiers are not emitted since they were already written in setters
                        // - export declarations without module specifiers are emitted preserving the order
                        case SyntaxKind.FunctionDeclaration:
                        case SyntaxKind.ImportDeclaration:
                            continue;
                        case SyntaxKind.ExportDeclaration:
                            continue;
                        case SyntaxKind.ImportEqualsDeclaration:
                            if (!isInternalModuleImportEqualsDeclaration(statement)) {
                                // - import equals declarations that import external modules are not emitted
                                continue;
                            }
                        // fall-though for import declarations that import internal modules
                        default:
                            emit(statement);
                    }
                }
            }

            function emitSystemModule(node: SourceFile): void {
                // System modules has the following shape
                // System.register(['dep-1', ... 'dep-n'], function(exports) {/* module body function */})
                // 'exports' here is a function 'exports<T>(name: string, value: T): T' that is used to publish exported values.
                // 'exports' returns its 'value' argument so in most cases expressions
                // that mutate exported values can be rewritten as:
                // expr -> exports('name', expr).
                // The only exception in this rule is postfix unary operators,
                // see comment to 'emitPostfixUnaryExpression' for more details
                // make sure that  name of 'exports' function does not conflict with existing identifiers
                let groupIndices: Map<number> = {};
                let dependencyGroups: DependencyGroup[] = [];

                externalImports = [];

                let startIndex = emitDirectivePrologues(node.statements, /*startWithNewLine*/ true);
                emitCaptureThisForNodeIfNecessary(node);
                emitSystemModuleBody(node, dependencyGroups, startIndex);
            }

            interface AMDDependencyNames {
                aliasedModuleNames: string[];
                unaliasedModuleNames: string[];
                importAliasNames: string[];
            }

            function getAMDDependencyNames(node: SourceFile, includeNonAmdDependencies: boolean): AMDDependencyNames {
                // names of modules with corresponding parameter in the factory function
                let aliasedModuleNames: string[] = [];
                // names of modules with no corresponding parameters in factory function
                let unaliasedModuleNames: string[] = [];
                let importAliasNames: string[] = [];     // names of the parameters in the factory function; these
                // parameters need to match the indexes of the corresponding
                // module names in aliasedModuleNames.

                // Fill in amd-dependency tags
                for (let amdDependency of node.amdDependencies) {
                    if (amdDependency.name) {
                        aliasedModuleNames.push("\"" + amdDependency.path + "\"");
                        importAliasNames.push(amdDependency.name);
                    }
                    else {
                        unaliasedModuleNames.push("\"" + amdDependency.path + "\"");
                    }
                }

                for (let importNode of externalImports) {
                    // Find the name of the external module
                    let externalModuleName = getExternalModuleNameText(importNode);

                    // Find the name of the module alias, if there is one
                    let importAliasName = getLocalNameForExternalImport(importNode);
                    if (includeNonAmdDependencies && importAliasName) {
                        aliasedModuleNames.push(externalModuleName);
                        importAliasNames.push(importAliasName);
                    }
                    else {
                        unaliasedModuleNames.push(externalModuleName);
                    }
                }

                return { aliasedModuleNames, unaliasedModuleNames, importAliasNames };
            }

            function emitAMDDependencies(node: SourceFile, includeNonAmdDependencies: boolean) {
                // An AMD define function has the following shape:
                //     define(id?, dependencies?, factory);
                //
                // This has the shape of
                //     define(name, ["module1", "module2"], function (module1Alias) {
                // The location of the alias in the parameter list in the factory function needs to
                // match the position of the module name in the dependency list.
                //
                // To ensure this is true in cases of modules with no aliases, e.g.:
                // `import "module"` or `<amd-dependency path= "a.css" />`
                // we need to add modules without alias names to the end of the dependencies list

                let dependencyNames = getAMDDependencyNames(node, includeNonAmdDependencies);
                emitAMDDependencyList(dependencyNames);
                write(", ");
                emitAMDFactoryHeader(dependencyNames);
            }

            function emitAMDDependencyList({ aliasedModuleNames, unaliasedModuleNames }: AMDDependencyNames) {
                write("[\"require\", \"exports\"");
                if (aliasedModuleNames.length) {
                    write(", ");
                    write(aliasedModuleNames.join(", "));
                }
                if (unaliasedModuleNames.length) {
                    write(", ");
                    write(unaliasedModuleNames.join(", "));
                }
                write("]");
            }

            function emitAMDFactoryHeader({ importAliasNames }: AMDDependencyNames) {
                write("function (require, exports");
                if (importAliasNames.length) {
                    write(", ");
                    write(importAliasNames.join(", "));
                }
                write(") {");
            }

            function emitAMDModule(node: SourceFile) {
                let startIndex = emitDirectivePrologues(node.statements, /*startWithNewLine*/ true);
                emitCaptureThisForNodeIfNecessary(node);
                emitLinesStartingAt(node.statements, startIndex);
            }

            function emitCommonJSModule(node: SourceFile) {
                let startIndex = emitDirectivePrologues(node.statements, /*startWithNewLine*/ false);
                emitCaptureThisForNodeIfNecessary(node);
                emitLinesStartingAt(node.statements, startIndex);
            }

            function emitUMDModule(node: SourceFile) {
                emitEmitHelpers(node);
                collectExternalModuleInfo(node);

                let dependencyNames = getAMDDependencyNames(node, /*includeNonAmdDependencies*/ false);

                // Module is detected first to support Browserify users that load into a browser with an AMD loader
                writeLines(`(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(`);
                emitAMDDependencyList(dependencyNames);
                write(", factory);");
                writeLines(`    }
})(`);
                emitAMDFactoryHeader(dependencyNames);
                increaseIndent();
                let startIndex = emitDirectivePrologues(node.statements, /*startWithNewLine*/ true);
                emitExportStarHelper();
                emitCaptureThisForNodeIfNecessary(node);
                emitLinesStartingAt(node.statements, startIndex);
                emitTempDeclarations(/*newLine*/ true);
                emitExportEquals(/*emitAsReturn*/ true);
                decreaseIndent();
                writeLine();
                write("});");
            }

            function emitES6Module(node: SourceFile) {
                externalImports = undefined;
                exportSpecifiers = undefined;
                exportEquals = undefined;
                hasExportStars = false;
                let startIndex = emitDirectivePrologues(node.statements, /*startWithNewLine*/ false);
                emitEmitHelpers(node);
                emitCaptureThisForNodeIfNecessary(node);
                emitLinesStartingAt(node.statements, startIndex);
                emitTempDeclarations(/*newLine*/ true);
                // Emit exportDefault if it exists will happen as part
                // or normal statement emit.
            }

            function emitExportEquals(emitAsReturn: boolean) {
                if (exportEquals && resolver.isValueAliasDeclaration(exportEquals)) {
                    writeLine();
                    emitStart(exportEquals);
                    write(emitAsReturn ? "return " : "module.exports = ");
                    emit((<ExportAssignment>exportEquals).expression);
                    write(";");
                    emitEnd(exportEquals);
                }
            }

            function emitJsxElement(node: JsxElement | JsxSelfClosingElement) {
                switch (compilerOptions.jsx) {
                    case JsxEmit.React:
                        jsxEmitReact(node);
                        break;
                    case JsxEmit.Preserve:
                    // Fall back to preserve if None was specified (we'll error earlier)
                    default:
                        jsxEmitPreserve(node);
                        break;
                }
            }

            function trimReactWhitespaceAndApplyEntities(node: JsxText): string {
                let result: string = undefined;
                let text = getTextOfNode(node, /*includeTrivia*/ true);
                let firstNonWhitespace = 0;
                let lastNonWhitespace = -1;

                // JSX trims whitespace at the end and beginning of lines, except that the
                // start/end of a tag is considered a start/end of a line only if that line is
                // on the same line as the closing tag. See examples in tests/cases/conformance/jsx/tsxReactEmitWhitespace.tsx
                for (let i = 0; i < text.length; i++) {
                    let c = text.charCodeAt(i);
                    if (isLineBreak(c)) {
                        if (firstNonWhitespace !== -1 && (lastNonWhitespace - firstNonWhitespace + 1 > 0)) {
                            let part = text.substr(firstNonWhitespace, lastNonWhitespace - firstNonWhitespace + 1);
                            result = (result ? result + "\" + ' ' + \"" : "") + escapeString(part);
                        }
                        firstNonWhitespace = -1;
                    }
                    else if (!isWhiteSpace(c)) {
                        lastNonWhitespace = i;
                        if (firstNonWhitespace === -1) {
                            firstNonWhitespace = i;
                        }
                    }
                }

                if (firstNonWhitespace !== -1) {
                    let part = text.substr(firstNonWhitespace);
                    result = (result ? result + "\" + ' ' + \"" : "") + escapeString(part);
                }

                if (result) {
                    // Replace entities like &nbsp;
                    result = result.replace(/&(\w+);/g, function (s: any, m: string) {
                        if (entities[m] !== undefined) {
                            return String.fromCharCode(entities[m]);
                        }
                        else {
                            return s;
                        }
                    });
                }

                return result;
            }

            function getTextToEmit(node: JsxText) {
                switch (compilerOptions.jsx) {
                    case JsxEmit.React:
                        let text = trimReactWhitespaceAndApplyEntities(node);
                        if (text === undefined || text.length === 0) {
                            return undefined;
                        }
                        else {
                            return text;
                        }
                    case JsxEmit.Preserve:
                    default:
                        return getTextOfNode(node, /*includeTrivia*/ true);
                }
            }

            function emitJsxText(node: JsxText) {
                switch (compilerOptions.jsx) {
                    case JsxEmit.React:
                        write("\"");
                        write(trimReactWhitespaceAndApplyEntities(node));
                        write("\"");
                        break;

                    case JsxEmit.Preserve:
                    default: // Emit JSX-preserve as default when no --jsx flag is specified
                        writer.writeLiteral(getTextOfNode(node, /*includeTrivia*/ true));
                        break;
                }
            }

            function emitJsxExpression(node: JsxExpression) {
                if (node.expression) {
                    switch (compilerOptions.jsx) {
                        case JsxEmit.Preserve:
                        default:
                            write("{");
                            emit(node.expression);
                            write("}");
                            break;
                        case JsxEmit.React:
                            emit(node.expression);
                            break;
                    }
                }
            }

            function emitDirectivePrologues(statements: Node[], startWithNewLine: boolean): number {
                for (let i = 0; i < statements.length; ++i) {
                    if (isPrologueDirective(statements[i])) {
                        if (startWithNewLine || i > 0) {
                            writeLine();
                        }
                        emit(statements[i]);
                    }
                    else {
                        // return index of the first non prologue directive
                        return i;
                    }
                }
                return statements.length;
            }

            function writeLines(text: string): void {
                let lines = text.split(/\r\n|\r|\n/g);
                for (let i = 0; i < lines.length; ++i) {
                    let line = lines[i];
                    if (line.length) {
                        writeLine();
                        write(line);
                    }
                }
            }

            function emitEmitHelpers(node: SourceFile): void {
                // Only emit helpers if the user did not say otherwise.
                if (!compilerOptions.noEmitHelpers) {
                    // Only Emit __extends function when target ES5.
                    // For target ES6 and above, we can emit classDeclaration as is.
                    if ((languageVersion < ScriptTarget.ES6) && (!extendsEmitted && resolver.getNodeCheckFlags(node) & NodeCheckFlags.EmitExtends)) {
                        emitExtendsAnnotation();
                        writeLines(extendsHelper);
                        extendsEmitted = true;
                    }

                    if (!decorateEmitted && resolver.getNodeCheckFlags(node) & NodeCheckFlags.EmitDecorate) {
                        writeLines(decorateHelper);
                        if (compilerOptions.emitDecoratorMetadata) {
                            writeLines(metadataHelper);
                        }
                        decorateEmitted = true;
                    }

                    if (!paramEmitted && resolver.getNodeCheckFlags(node) & NodeCheckFlags.EmitParam) {
                        writeLines(paramHelper);
                        paramEmitted = true;
                    }

                    if (!awaiterEmitted && resolver.getNodeCheckFlags(node) & NodeCheckFlags.EmitAwaiter) {
                        writeLines(awaiterHelper);
                        awaiterEmitted = true;
                    }
                }
            }

            function emitSourceFileNode(node: SourceFile) {
                // Start new file on new line
                writeLine();
                emitShebang();
                emitDetachedComments(node);

                if (isExternalModule(node) || compilerOptions.isolatedModules) {
                    let emitModule = moduleEmitDelegates[modulekind] || moduleEmitDelegates[ModuleKind.CommonJS];
                    emitModule(node);
                }
                else {
                    // emit prologue directives prior to __extends
                    let startIndex = emitDirectivePrologues(node.statements, /*startWithNewLine*/ false);
                    externalImports = undefined;
                    exportSpecifiers = undefined;
                    exportEquals = undefined;
                    hasExportStars = false;
                    emitEmitHelpers(node);
                    emitCaptureThisForNodeIfNecessary(node);
                    emitLinesStartingAt(node.statements, startIndex);
                    emitTempDeclarations(/*newLine*/ true);
                }

                emitLeadingComments(node.endOfFileToken);
            }

            function emitNodeWithCommentsAndWithoutSourcemap(node: Node): void {
                emitNodeConsideringCommentsOption(node, emitNodeWithoutSourceMap);
            }

            function emitNodeConsideringCommentsOption(node: Node, emitNodeConsideringSourcemap: (node: Node) => void): void {
                if (node) {
                    if (node.flags & NodeFlags.Ambient) {
                        return emitCommentsOnNotEmittedNode(node);
                    }

                    if (isSpecializedCommentHandling(node)) {
                        // This is the node that will handle its own comments and sourcemap
                        return emitNodeWithoutSourceMap(node);
                    }

                    let emitComments = shouldEmitLeadingAndTrailingComments(node);
                    if (emitComments) {
                        emitLeadingComments(node);
                    }

                    emitNodeConsideringSourcemap(node);

                    if (emitComments) {
                        emitTrailingComments(node);
                    }
                }
            }

            function emitNodeWithoutSourceMap(node: Node): void {
                if (node) {
                    emitJavaScriptWorker(node);
                }
            }

            function isSpecializedCommentHandling(node: Node): boolean {
                switch (node.kind) {
                    // All of these entities are emitted in a specialized fashion.  As such, we allow
                    // the specialized methods for each to handle the comments on the nodes.
                    case SyntaxKind.InterfaceDeclaration:
                    case SyntaxKind.FunctionDeclaration:
                    case SyntaxKind.ImportDeclaration:
                    case SyntaxKind.ImportEqualsDeclaration:
                    case SyntaxKind.TypeAliasDeclaration:
                    case SyntaxKind.ExportAssignment:
                        return true;
                }
            }

            function shouldEmitLeadingAndTrailingComments(node: Node) {
                switch (node.kind) {
                    case SyntaxKind.VariableStatement:
                        return shouldEmitLeadingAndTrailingCommentsForVariableStatement(<VariableStatement>node);

                    case SyntaxKind.ModuleDeclaration:
                        // Only emit the leading/trailing comments for a module if we're actually
                        // emitting the module as well.
                        return shouldEmitModuleDeclaration(<ModuleDeclaration>node);

                    case SyntaxKind.EnumDeclaration:
                        // Only emit the leading/trailing comments for an enum if we're actually
                        // emitting the module as well.
                        return shouldEmitEnumDeclaration(<EnumDeclaration>node);
                }

                // If the node is emitted in specialized fashion, dont emit comments as this node will handle
                // emitting comments when emitting itself
                Debug.assert(!isSpecializedCommentHandling(node));

                // If this is the expression body of an arrow function that we're down-leveling,
                // then we don't want to emit comments when we emit the body.  It will have already
                // been taken care of when we emitted the 'return' statement for the function
                // expression body.
                if (node.kind !== SyntaxKind.Block &&
                    node.parent &&
                    node.parent.kind === SyntaxKind.ArrowFunction &&
                    (<ArrowFunction>node.parent).body === node &&
                    compilerOptions.target <= ScriptTarget.ES5) {

                    return false;
                }

                // Emit comments for everything else.
                return true;
            }

            function emitJavaScriptWorker(node: Node) {
                // Check if the node can be emitted regardless of the ScriptTarget
                switch (node.kind) {
                    case SyntaxKind.Identifier:
                        return emitIdentifier(<Identifier>node);
                    case SyntaxKind.Parameter:
                        return emitParameter(<ParameterDeclaration>node);
                    case SyntaxKind.MethodDeclaration:
                    case SyntaxKind.MethodSignature:
                        return emitMethod(<MethodDeclaration>node);
                    case SyntaxKind.GetAccessor:
                    case SyntaxKind.SetAccessor:
                        return emitAccessor(<AccessorDeclaration>node);
                    case SyntaxKind.ThisKeyword:
                        return emitThis(node);
                    case SyntaxKind.SuperKeyword:
                        return emitSuper(node);
                    case SyntaxKind.NullKeyword:
                        return write("null");
                    case SyntaxKind.TrueKeyword:
                        return write("true");
                    case SyntaxKind.FalseKeyword:
                        return write("false");
                    case SyntaxKind.NumericLiteral:
                    case SyntaxKind.StringLiteral:
                    case SyntaxKind.RegularExpressionLiteral:
                    case SyntaxKind.NoSubstitutionTemplateLiteral:
                    case SyntaxKind.TemplateHead:
                    case SyntaxKind.TemplateMiddle:
                    case SyntaxKind.TemplateTail:
                        return emitLiteral(<LiteralExpression>node);
                    case SyntaxKind.TemplateExpression:
                        return emitTemplateExpression(<TemplateExpression>node);
                    case SyntaxKind.TemplateSpan:
                        return emitTemplateSpan(<TemplateSpan>node);
                    case SyntaxKind.JsxElement:
                    case SyntaxKind.JsxSelfClosingElement:
                        return emitJsxElement(<JsxElement | JsxSelfClosingElement>node);
                    case SyntaxKind.JsxText:
                        return emitJsxText(<JsxText>node);
                    case SyntaxKind.JsxExpression:
                        return emitJsxExpression(<JsxExpression>node);
                    case SyntaxKind.QualifiedName:
                        return emitQualifiedName(<QualifiedName>node);
                    case SyntaxKind.ObjectBindingPattern:
                        return emitObjectBindingPattern(<BindingPattern>node);
                    case SyntaxKind.ArrayBindingPattern:
                        return emitArrayBindingPattern(<BindingPattern>node);
                    case SyntaxKind.BindingElement:
                        return emitBindingElement(<BindingElement>node);
                    case SyntaxKind.ArrayLiteralExpression:
                        return emitArrayLiteral(<ArrayLiteralExpression>node);
                    case SyntaxKind.ObjectLiteralExpression:
                        return emitObjectLiteral(<ObjectLiteralExpression>node);
                    case SyntaxKind.PropertyAssignment:
                        return emitPropertyAssignment(<PropertyDeclaration>node);
                    case SyntaxKind.ShorthandPropertyAssignment:
                        return emitShorthandPropertyAssignment(<ShorthandPropertyAssignment>node);
                    case SyntaxKind.ComputedPropertyName:
                        return emitComputedPropertyName(<ComputedPropertyName>node);
                    case SyntaxKind.PropertyAccessExpression:
                        return emitPropertyAccess(<PropertyAccessExpression>node);
                    case SyntaxKind.ElementAccessExpression:
                        return emitIndexedAccess(<ElementAccessExpression>node);
                    case SyntaxKind.CallExpression:
                        return emitCallExpression(<CallExpression>node);
                    case SyntaxKind.NewExpression:
                        return emitNewExpression(<NewExpression>node);
                    case SyntaxKind.TaggedTemplateExpression:
                        return emitTaggedTemplateExpression(<TaggedTemplateExpression>node);
                    case SyntaxKind.TypeAssertionExpression:
                        return emit((<TypeAssertion>node).expression);
                    case SyntaxKind.AsExpression:
                        return emit((<AsExpression>node).expression);
                    case SyntaxKind.ParenthesizedExpression:
                        return emitParenExpression(<ParenthesizedExpression>node);
                    case SyntaxKind.FunctionDeclaration:
                    case SyntaxKind.FunctionExpression:
                    case SyntaxKind.ArrowFunction:
                        return emitFunctionDeclaration(<FunctionLikeDeclaration>node);
                    case SyntaxKind.DeleteExpression:
                        return emitDeleteExpression(<DeleteExpression>node);
                    case SyntaxKind.TypeOfExpression:
                        return emitTypeOfExpression(<TypeOfExpression>node);
                    case SyntaxKind.VoidExpression:
                        return emitVoidExpression(<VoidExpression>node);
                    case SyntaxKind.AwaitExpression:
                        return emitAwaitExpression(<AwaitExpression>node);
                    case SyntaxKind.PrefixUnaryExpression:
                        return emitPrefixUnaryExpression(<PrefixUnaryExpression>node);
                    case SyntaxKind.PostfixUnaryExpression:
                        return emitPostfixUnaryExpression(<PostfixUnaryExpression>node);
                    case SyntaxKind.BinaryExpression:
                        return emitBinaryExpression(<BinaryExpression>node);
                    case SyntaxKind.ConditionalExpression:
                        return emitConditionalExpression(<ConditionalExpression>node);
                    case SyntaxKind.SpreadElementExpression:
                        return emitSpreadElementExpression(<SpreadElementExpression>node);
                    case SyntaxKind.YieldExpression:
                        return emitYieldExpression(<YieldExpression>node);
                    case SyntaxKind.OmittedExpression:
                        return;
                    case SyntaxKind.Block:
                    case SyntaxKind.ModuleBlock:
                        return emitBlock(<Block>node);
                    case SyntaxKind.VariableStatement:
                        return emitVariableStatement(<VariableStatement>node);
                    case SyntaxKind.EmptyStatement:
                        return write(";");
                    case SyntaxKind.ExpressionStatement:
                        return emitExpressionStatement(<ExpressionStatement>node);
                    case SyntaxKind.IfStatement:
                        return emitIfStatement(<IfStatement>node);
                    case SyntaxKind.DoStatement:
                        return emitDoStatement(<DoStatement>node);
                    case SyntaxKind.WhileStatement:
                        return emitWhileStatement(<WhileStatement>node);
                    case SyntaxKind.ForStatement:
                        return emitForStatement(<ForStatement>node);
                    case SyntaxKind.ForOfStatement:
                    case SyntaxKind.ForInStatement:
                        return emitForInOrForOfStatement(<ForInStatement>node);
                    case SyntaxKind.ContinueStatement:
                    case SyntaxKind.BreakStatement:
                        return emitBreakOrContinueStatement(<BreakOrContinueStatement>node);
                    case SyntaxKind.ReturnStatement:
                        return emitReturnStatement(<ReturnStatement>node);
                    case SyntaxKind.WithStatement:
                        return emitWithStatement(<WithStatement>node);
                    case SyntaxKind.SwitchStatement:
                        return emitSwitchStatement(<SwitchStatement>node);
                    case SyntaxKind.CaseClause:
                    case SyntaxKind.DefaultClause:
                        return emitCaseOrDefaultClause(<CaseOrDefaultClause>node);
                    case SyntaxKind.LabeledStatement:
                        return emitLabelledStatement(<LabeledStatement>node);
                    case SyntaxKind.ThrowStatement:
                        return emitThrowStatement(<ThrowStatement>node);
                    case SyntaxKind.TryStatement:
                        return emitTryStatement(<TryStatement>node);
                    case SyntaxKind.CatchClause:
                        return emitCatchClause(<CatchClause>node);
                    case SyntaxKind.DebuggerStatement:
                        return emitDebuggerStatement(node);
                    case SyntaxKind.VariableDeclaration:
                        return emitVariableDeclaration(<VariableDeclaration>node);
                    case SyntaxKind.ClassExpression:
                        return emitClassExpression(<ClassExpression>node);
                    case SyntaxKind.ClassDeclaration:
                        return emitClassDeclaration(<ClassDeclaration>node);
                    case SyntaxKind.InterfaceDeclaration:
                        return emitInterfaceDeclaration(<InterfaceDeclaration>node);
                    case SyntaxKind.TypeAliasDeclaration:
                        return emitTypeAliasDeclaration(<TypeAliasDeclaration>node);
                    case SyntaxKind.EnumDeclaration:
                        return emitEnumDeclaration(<EnumDeclaration>node);
                    case SyntaxKind.EnumMember:
                        return emitEnumMember(<EnumMember>node);
                    case SyntaxKind.ModuleDeclaration:
                        return emitModuleDeclaration(<ModuleDeclaration>node);
                    case SyntaxKind.ImportDeclaration:
                        return emitImportDeclaration(<ImportDeclaration>node);
                    case SyntaxKind.ImportEqualsDeclaration:
                        return emitImportEqualsDeclaration(<ImportEqualsDeclaration>node);
                    case SyntaxKind.ExportDeclaration:
                        return emitExportDeclaration(<ExportDeclaration>node);
                    case SyntaxKind.ExportAssignment:
                        return emitExportAssignment(<ExportAssignment>node);
                    case SyntaxKind.SourceFile:
                        return emitSourceFileNode(<SourceFile>node);
                }
            }

            function hasDetachedComments(pos: number) {
                return detachedCommentsInfo !== undefined && lastOrUndefined(detachedCommentsInfo).nodePos === pos;
            }

            function getLeadingCommentsWithoutDetachedComments() {
                // get the leading comments from detachedPos
                let leadingComments = getLeadingCommentRanges(currentSourceFile.text,
                    lastOrUndefined(detachedCommentsInfo).detachedCommentEndPos);
                if (detachedCommentsInfo.length - 1) {
                    detachedCommentsInfo.pop();
                }
                else {
                    detachedCommentsInfo = undefined;
                }

                return leadingComments;
            }

            function isPinnedComments(comment: CommentRange) {
                return currentSourceFile.text.charCodeAt(comment.pos + 1) === CharacterCodes.asterisk &&
                    currentSourceFile.text.charCodeAt(comment.pos + 2) === CharacterCodes.exclamation;
            }

            /**
             * Determine if the given comment is a triple-slash
             *
             * @return true if the comment is a triple-slash comment else false
             **/
            function isTripleSlashComment(comment: CommentRange) {
                // Verify this is /// comment, but do the regexp match only when we first can find /// in the comment text
                // so that we don't end up computing comment string and doing match for all // comments
                if (currentSourceFile.text.charCodeAt(comment.pos + 1) === CharacterCodes.slash &&
                    comment.pos + 2 < comment.end &&
                    currentSourceFile.text.charCodeAt(comment.pos + 2) === CharacterCodes.slash) {
                    let textSubStr = currentSourceFile.text.substring(comment.pos, comment.end);
                    return textSubStr.match(fullTripleSlashReferencePathRegEx) ||
                        textSubStr.match(fullTripleSlashAMDReferencePathRegEx) ?
                        true : false;
                }
                return false;
            }

            function getLeadingCommentsToEmit(node: Node) {
                // Emit the leading comments only if the parent's pos doesn't match because parent should take care of emitting these comments
                if (node.parent) {
                    if (node.parent.kind === SyntaxKind.SourceFile || node.pos !== node.parent.pos) {
                        if (hasDetachedComments(node.pos)) {
                            // get comments without detached comments
                            return getLeadingCommentsWithoutDetachedComments();
                        }
                        else {
                            // get the leading comments from the node
                            return getLeadingCommentRangesOfNode(node, currentSourceFile);
                        }
                    }
                }
            }

            function getTrailingCommentsToEmit(node: Node) {
                // Emit the trailing comments only if the parent's pos doesn't match because parent should take care of emitting these comments
                if (node.parent) {
                    if (node.parent.kind === SyntaxKind.SourceFile || node.end !== node.parent.end) {
                        return getTrailingCommentRanges(currentSourceFile.text, node.end);
                    }
                }
            }

            /**
             * Emit comments associated with node that will not be emitted into JS file
             */
            function emitCommentsOnNotEmittedNode(node: Node) {
                emitLeadingCommentsWorker(node, /*isEmittedNode:*/ false);
            }

            function emitLeadingComments(node: Node) {
                return emitLeadingCommentsWorker(node, /*isEmittedNode:*/ true);
            }

            function emitLeadingCommentsWorker(node: Node, isEmittedNode: boolean) {
                if (compilerOptions.removeComments) {
                    return;
                }

                let leadingComments: CommentRange[];
                if (isEmittedNode) {
                    leadingComments = getLeadingCommentsToEmit(node);
                }
                else {
                    // If the node will not be emitted in JS, remove all the comments(normal, pinned and ///) associated with the node,
                    // unless it is a triple slash comment at the top of the file.
                    // For Example:
                    //      /// <reference-path ...>
                    //      declare var x;
                    //      /// <reference-path ...>
                    //      interface F {}
                    //  The first /// will NOT be removed while the second one will be removed eventhough both node will not be emitted
                    if (node.pos === 0) {
                        leadingComments = filter(getLeadingCommentsToEmit(node), isTripleSlashComment);
                    }
                }

                emitNewLineBeforeLeadingComments(currentSourceFile, writer, node, leadingComments);

                // Leading comments are emitted at /*leading comment1 */space/*leading comment*/space
                emitComments(currentSourceFile, writer, leadingComments, /*trailingSeparator:*/ true, newLine, writeComment);
            }

            function emitTrailingComments(node: Node) {
                if (compilerOptions.removeComments) {
                    return;
                }

                // Emit the trailing comments only if the parent's end doesn't match
                let trailingComments = getTrailingCommentsToEmit(node);

                // trailing comments are emitted at space/*trailing comment1 */space/*trailing comment*/
                emitComments(currentSourceFile, writer, trailingComments, /*trailingSeparator*/ false, newLine, writeComment);
            }

            /**
             * Emit trailing comments at the position. The term trailing comment is used here to describe following comment:
             *      x, /comment1/ y
             *        ^ => pos; the function will emit "comment1" in the emitJS
             */
            function emitTrailingCommentsOfPosition(pos: number) {
                if (compilerOptions.removeComments) {
                    return;
                }

                let trailingComments = getTrailingCommentRanges(currentSourceFile.text, pos);

                // trailing comments are emitted at space/*trailing comment1 */space/*trailing comment*/
                emitComments(currentSourceFile, writer, trailingComments, /*trailingSeparator*/ true, newLine, writeComment);
            }

            function emitLeadingCommentsOfPositionWorker(pos: number) {
                if (compilerOptions.removeComments) {
                    return;
                }

                let leadingComments: CommentRange[];
                if (hasDetachedComments(pos)) {
                    // get comments without detached comments
                    leadingComments = getLeadingCommentsWithoutDetachedComments();
                }
                else {
                    // get the leading comments from the node
                    leadingComments = getLeadingCommentRanges(currentSourceFile.text, pos);
                }

                emitNewLineBeforeLeadingComments(currentSourceFile, writer, { pos: pos, end: pos }, leadingComments);

                // Leading comments are emitted at /*leading comment1 */space/*leading comment*/space
                emitComments(currentSourceFile, writer, leadingComments, /*trailingSeparator*/ true, newLine, writeComment);
            }

            function emitDetachedComments(node: TextRange) {
                let leadingComments: CommentRange[];
                if (compilerOptions.removeComments) {
                    // removeComments is true, only reserve pinned comment at the top of file
                    // For example:
                    //      /*! Pinned Comment */
                    //
                    //      var x = 10;
                    if (node.pos === 0) {
                        leadingComments = filter(getLeadingCommentRanges(currentSourceFile.text, node.pos), isPinnedComments);
                    }
                }
                else {
                    // removeComments is false, just get detached as normal and bypass the process to filter comment
                    leadingComments = getLeadingCommentRanges(currentSourceFile.text, node.pos);
                }

                if (leadingComments) {
                    let detachedComments: CommentRange[] = [];
                    let lastComment: CommentRange;

                    forEach(leadingComments, comment => {
                        if (lastComment) {
                            let lastCommentLine = getLineOfLocalPosition(currentSourceFile, lastComment.end);
                            let commentLine = getLineOfLocalPosition(currentSourceFile, comment.pos);

                            if (commentLine >= lastCommentLine + 2) {
                                // There was a blank line between the last comment and this comment.  This
                                // comment is not part of the copyright comments.  Return what we have so
                                // far.
                                return detachedComments;
                            }
                        }

                        detachedComments.push(comment);
                        lastComment = comment;
                    });

                    if (detachedComments.length) {
                        // All comments look like they could have been part of the copyright header.  Make
                        // sure there is at least one blank line between it and the node.  If not, it's not
                        // a copyright header.
                        let lastCommentLine = getLineOfLocalPosition(currentSourceFile, lastOrUndefined(detachedComments).end);
                        let nodeLine = getLineOfLocalPosition(currentSourceFile, skipTrivia(currentSourceFile.text, node.pos));
                        if (nodeLine >= lastCommentLine + 2) {
                            // Valid detachedComments
                            emitNewLineBeforeLeadingComments(currentSourceFile, writer, node, leadingComments);
                            emitComments(currentSourceFile, writer, detachedComments, /*trailingSeparator*/ true, newLine, writeComment);
                            let currentDetachedCommentInfo = { nodePos: node.pos, detachedCommentEndPos: lastOrUndefined(detachedComments).end };
                            if (detachedCommentsInfo) {
                                detachedCommentsInfo.push(currentDetachedCommentInfo);
                            }
                            else {
                                detachedCommentsInfo = [currentDetachedCommentInfo];
                            }
                        }
                    }
                }
            }

            function emitShebang() {
                let shebang = getShebang(currentSourceFile.text);
                if (shebang) {
                    write(shebang);
                }
            }
        }

        function emitFile(jsFilePath: string, sourceFile?: SourceFile) {
            emitJavaScript(jsFilePath, sourceFile);

            if (compilerOptions.declaration) {
                writeDeclarationFile(jsFilePath, sourceFile, host, resolver, diagnostics);
            }
        }
    }
}