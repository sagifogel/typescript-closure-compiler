namespace ts {
    export interface Symbol {
        getDeclarations(): Declaration[];
    }

    export interface EmitHost extends ScriptReferenceHost {
        getNewLine(): string;
        getNewLine(): string;
        writeFile: WriteFileCallback;
        getSourceFiles(): SourceFile[];
        getSourceFiles(): SourceFile[];
        getCommonSourceDirectory(): string;
        getCommonSourceDirectory(): string;
        isEmitBlocked(emitFileName: string): boolean;
        getCanonicalFileName(fileName: string): string;
        getCanonicalFileName(fileName: string): string;
    }

    export interface EmitTextWriter {
        reset(): void;
        writeLine(): void;
        getText(): string;
        getLine(): number;
        getColumn(): number;
        getIndent(): number;
        getTextPos(): number;
        increaseIndent(): void;
        decreaseIndent(): void;
        write(s: string): void;
        rawWrite(s: string): void;
        writeLiteral(s: string): void;
        writeTextOfNode(text: string, node: Node): void;
    }

    export interface SourceFile {
        getLineStarts(): number[];
        getLineAndCharacterOfPosition(pos: number): LineAndCharacter;
        update(newText: string, textChangeRange: TextChangeRange): SourceFile;
        getPositionOfLineAndCharacter(line: number, character: number): number;
    }
}