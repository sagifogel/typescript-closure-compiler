/// <reference path="diagnosticInformationMap.generated.ts"/>

namespace ts {
    export declare function getShebang(text: string): string;
    export declare function isLineBreak(ch: number): boolean;
    export declare function isWhiteSpace(ch: number): boolean;
    export declare function tokenToString(t: SyntaxKind): string;
    export declare function stringToToken(s: string): SyntaxKind;
    export declare function getLeadingCommentRanges(text: string, pos: number): CommentRange[];
    export declare function getTrailingCommentRanges(text: string, pos: number): CommentRange[];
    export declare function skipTrivia(text: string, pos: number, stopAfterLineBreak?: boolean): number;
    export declare function getLineAndCharacterOfPosition(sourceFile: SourceFile, position: number): LineAndCharacter;
}