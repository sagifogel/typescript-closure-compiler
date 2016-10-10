/// <reference path="scanner.ts"/>

namespace ts {
    export declare function createNode(kind: SyntaxKind): Node;
    export declare function forEachChild<T>(node: Node, cbNode: (node: Node) => T, cbNodeArray?: (nodes: Node[]) => T): T;
    export declare function createSourceFile(fileName: string, sourceText: string, languageVersion: ScriptTarget, setParentNodes?: boolean): SourceFile;
}