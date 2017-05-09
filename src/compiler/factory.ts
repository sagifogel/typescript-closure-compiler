namespace ts {
    export declare function getCommentRange(node: Node);
    export declare function getExternalHelpersModuleName(node: SourceFile);
    export declare function getEmitFlags(node: Node): EmitFlags | undefined;
    export declare function compareEmitHelpers(x: EmitHelper, y: EmitHelper);
    export declare function getEmitHelpers(node: Node): EmitHelper[] | undefined;
    export declare function skipPartiallyEmittedExpressions(node: Expression): Expression;
    export declare function getConstantValue(node: PropertyAccessExpression | ElementAccessExpression);
}