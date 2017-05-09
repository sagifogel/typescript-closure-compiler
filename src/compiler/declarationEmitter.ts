/// <reference path="../../TypeScript/src/compiler/types.ts" />

namespace ts {
    export declare function getDeclarationDiagnostics(host: EmitHost, resolver: EmitResolver, targetSourceFile: SourceFile): Diagnostic[];
    export declare function writeDeclarationFile(declarationFilePath: string, sourceFileOrBundle: SourceFile | Bundle, host: EmitHost, resolver: EmitResolver, emitterDiagnostics: DiagnosticCollection, emitOnlyDtsFiles: boolean): boolean;
}