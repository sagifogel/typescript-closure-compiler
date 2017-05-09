namespace ts {
    export interface CommentWriter {
        reset(): void;
        setWriter(writer: EmitTextWriter): void;
        setSourceFile(sourceFile: SourceFile): void;
        emitLeadingCommentsOfPosition(pos: number): void;
        emitTrailingCommentsOfPosition(pos: number): void;
        emitNodeWithComments(hint: EmitHint, node: Node, emitCallback: (hint: EmitHint, node: Node) => void): void;
        emitBodyWithDetachedComments(node: Node, detachedRange: TextRange, emitCallback: (node: Node) => void): void;
    }

    export declare function createCommentWriter(printerOptions: PrinterOptions, emitPos: ((pos: number) => void) | undefined): CommentWriter;
}