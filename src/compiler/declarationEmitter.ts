/// <reference path="../../TypeScript/src/compiler/types.ts" />

namespace ts {
    export declare function getDeclarationDiagnostics(host: EmitHost, resolver: EmitResolver, targetSourceFile: SourceFile): Diagnostic[];
    export declare function writeDeclarationFile(jsFilePath: string, sourceFile: SourceFile, host: EmitHost, resolver: EmitResolver, diagnostics: Diagnostic[]);
}