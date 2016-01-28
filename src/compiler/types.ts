namespace ts {
    export interface EmitHost extends ScriptReferenceHost {
        getSourceFiles(): SourceFile[];
        getCommonSourceDirectory(): string;
        getCanonicalFileName(fileName: string): string;
        getNewLine(): string;
        writeFile: WriteFileCallback;
    }

    export interface EmitTextWriter {
        write(s: string): void;
        writeTextOfNode(sourceFile: SourceFile, node: Node): void;
        writeLine(): void;
        increaseIndent(): void;
        decreaseIndent(): void;
        getText(): string;
        rawWrite(s: string): void;
        writeLiteral(s: string): void;
        getTextPos(): number;
        getLine(): number;
        getColumn(): number;
        getIndent(): number;
    }
}