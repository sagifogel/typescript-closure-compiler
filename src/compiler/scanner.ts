/// <reference path="diagnosticInformationMap.generated.ts"/>

namespace ts {
    export interface ErrorCallback {
        (message: DiagnosticMessage, length: number): void;
    }

    export interface Scanner {
        scan(): SyntaxKind;
        getTextPos(): number;
        getStartPos(): number;
        getTokenPos(): number;
        getToken(): SyntaxKind;
        getTokenText(): string;
        getTokenValue(): string;
        isIdentifier(): boolean;
        isReservedWord(): boolean;
        isUnterminated(): boolean;
        scanJsxToken(): SyntaxKind;
        reScanJsxToken(): SyntaxKind;
        scanJSDocToken(): SyntaxKind;
        reScanSlashToken(): SyntaxKind;
        scanJsxIdentifier(): SyntaxKind;
        reScanGreaterToken(): SyntaxKind;
        tryScan<T>(callback: () => T): T;
        hasPrecedingLineBreak(): boolean;
        reScanTemplateToken(): SyntaxKind;
        setTextPos(textPos: number): void;
        lookAhead<T>(callback: () => T): T;
        hasExtendedUnicodeEscape(): boolean;
        setOnError(onError: ErrorCallback): void;
        setScriptTarget(scriptTarget: ScriptTarget): void;
        setLanguageVariant(variant: LanguageVariant): void;
        setText(text: string, start?: number, length?: number): void;
        scanRange<T>(start: number, length: number, callback: () => T): T;
    }

    export declare function getShebang(text: string): string;
    export declare function isLineBreak(ch: number): boolean;
    export declare function isWhiteSpace(ch: number): boolean;
    export declare function tokenToString(t: SyntaxKind): string;
    export declare function stringToToken(s: string): SyntaxKind;
    export declare function getLineStarts(sourceFile: SourceFile): number[];
    export declare function isIdentifier(name: string, languageVersion: ScriptTarget): boolean;
    export declare function getLeadingCommentRanges(text: string, pos: number): CommentRange[];
    export declare function getTrailingCommentRanges(text: string, pos: number): CommentRange[];
    export declare function skipTrivia(text: string, pos: number, stopAfterLineBreak?: boolean): number;
    export declare function getLineAndCharacterOfPosition(sourceFile: SourceFile, position: number): LineAndCharacter;
    export declare function createScanner(languageVersion: ScriptTarget, skipTrivia: boolean, languageVariant = LanguageVariant.Standard, text?: string, onError?: ErrorCallback, start?: number, length?: number): Scanner;
}