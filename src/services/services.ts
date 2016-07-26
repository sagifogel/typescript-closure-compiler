module ts {
    export interface Node {
        getEnd(): number;
        getFullStart(): number;
        getFullWidth(): number;
        getSourceFile(): SourceFile;
        getText(sourceFile?: SourceFile): string;
        getStart(sourceFile?: SourceFile): number;
        getWidth(sourceFile?: SourceFile): number;
        getLastToken(sourceFile?: SourceFile): Node;
        getFirstToken(sourceFile?: SourceFile): Node;
        getChildren(sourceFile?: SourceFile): Node[];
        getFullText(sourceFile?: SourceFile): string;
        getChildCount(sourceFile?: SourceFile): number;
        getLeadingTriviaWidth(sourceFile?: SourceFile): number;
        getChildAt(index: number, sourceFile?: SourceFile): Node;
    }

    export module ScriptElementKindModifier {
        export const none = "";
        export const staticModifier = "static";
        export const exportedModifier = "export";
        export const ambientModifier = "declare";
        export const abstractModifier = "abstract";
        export const publicMemberModifier = "public";
        export const privateMemberModifier = "private";
        export const protectedMemberModifier = "protected";
    }

    export declare interface DisplayPartsSymbolWriter extends SymbolWriter {
        displayParts(): SymbolDisplayPart[];
    }

    export interface SymbolDisplayPart {
        text: string;
        kind: string;
    }

    export enum SymbolDisplayPartKind {
        text,
        space,
        keyword,
        enumName,
        operator,
        fieldName,
        lineBreak,
        localName,
        aliasName,
        className,
        methodName,
        moduleName,
        punctuation,
        propertyName,
        functionName,
        stringLiteral,
        parameterName,
        interfaceName,
        numericLiteral,
        enumMemberName,
        typeParameterName,
        regularExpressionLiteral
    }

    export interface HostCancellationToken {
        isCancellationRequested(): boolean;
    }

    export interface IScriptSnapshot {
    }

    export interface LanguageServiceHost {
        log?(s: string): void;
        trace?(s: string): void;
        error?(s: string): void;
        getNewLine?(): string;
        getProjectVersion?(): string;
        getCurrentDirectory(): string;
        getScriptFileNames(): string[];
        useCaseSensitiveFileNames?(): boolean;
        getLocalizedDiagnosticMessages?(): any;
        getCompilationSettings(): CompilerOptions;
        getScriptVersion(fileName: string): string;
        getScriptKind?(fileName: string): ScriptKind;
        getCancellationToken?(): HostCancellationToken;
        getScriptSnapshot(fileName: string): IScriptSnapshot;
        getDefaultLibFileName(options: CompilerOptions): string;
    }

    export declare function getContainerNode(node: Node): Declaration;
}