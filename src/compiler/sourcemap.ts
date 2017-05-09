/// <reference path="checker.ts"/>

/* @internal */
namespace ts {
    export interface SourceMapWriter {
        reset(): void;
        getText(): string;
        emitPos(pos: number): void;
        changeEmitSourcePos(): void;
        getSourceMappingURL(): string;
        emitStart(range: TextRange): void;
        getSourceMapData(): SourceMapData;
        setSourceFile(sourceFile: SourceFile): void;
        emitEnd(range: TextRange, stopOverridingSpan?: boolean): void;
        initialize(filePath: string, sourceMapFilePath: string, sourceFileOrBundle: SourceFile | Bundle);
        emitNodeWithSourceMap(hint: EmitHint, node: Node, emitCallback: (hint: EmitHint, node: Node) => void): void;
        initialize(filePath: string, sourceMapFilePath: string, sourceFiles: SourceFile[], isBundledEmit: boolean): void;
        emitTokenWithSourceMap(node: Node, token: SyntaxKind, tokenStartPos: number, emitCallback: (token: SyntaxKind, tokenStartPos: number) => number): number;
    }

    export declare function getNullSourceMapWriter(): SourceMapWriter;
    export declare function createSourceMapWriter(host: EmitHost, writer: EmitTextWriter): SourceMapWriter;
}