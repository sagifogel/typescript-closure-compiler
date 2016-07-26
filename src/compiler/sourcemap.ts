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
        initialize(filePath: string, sourceMapFilePath: string, sourceFiles: SourceFile[], isBundledEmit: boolean): void;
    }

    export declare function getNullSourceMapWriter(): SourceMapWriter;
    export declare function createSourceMapWriter(host: EmitHost, writer: EmitTextWriter): SourceMapWriter;
}