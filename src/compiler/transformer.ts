namespace ts {
    export declare function transformNodes<T extends Node>(resolver: EmitResolver, host: EmitHost, options: CompilerOptions, nodes: T[], transformers: TransformerFactory<T>[], allowDtsFiles: boolean): TransformationResult<T>;
}