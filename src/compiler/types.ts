namespace ts {
    export interface Symbol {
        getDeclarations(): Declaration[];
    }

    export interface EmitHost extends ScriptReferenceHost {
        getNewLine(): string;
        writeFile: WriteFileCallback;
        getSourceFiles(): SourceFile[];
        getCommonSourceDirectory(): string;
        getCanonicalFileName(fileName: string): string;
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

    export interface SourceFile {
        getLineAndCharacterOfPosition(pos: number): LineAndCharacter;
        getLineStarts(): number[];
        getPositionOfLineAndCharacter(line: number, character: number): number;
        update(newText: string, textChangeRange: TextChangeRange): SourceFile;
    }
}