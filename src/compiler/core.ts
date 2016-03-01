namespace ts {
    export declare enum Comparison {
        LessThan,
        EqualTo,
        GreaterThan
    }

    export declare namespace Debug {
        export function fail(message?: string): void;
        export function assert(expression: boolean, message?: string, verboseDebugInfo?: () => string): void;
    }

    export declare function isUrl(path: string);
    export declare let directorySeparator: string;
    export declare function isEmpty<T>(map: Map<T>);
    export declare function getBaseFileName(path: string);
    export declare function isRootedDiskPath(path: string);
    export declare function getDirectoryPath(path: string);
    export declare function lastOrUndefined<T>(array: T[]): T;
    export declare function normalizePath(path: string): string;
    export declare function normalizeSlashes(path: string): string;
    export declare function contains<T>(array: T[], value: T): boolean;
    export declare function combinePaths(path1: string, path2: string);
    export declare function getProperty<T>(map: Map<T>, key: string): T;
    export declare function filter<T>(array: T[], f: (x: T) => boolean): T[];
    export declare function hasProperty<T>(map: Map<T>, key: string): boolean;
    export declare function sortAndDeduplicateDiagnostics(diagnostics: Diagnostic[]): Diagnostic[];
    export declare function forEach<T, U>(array: T[], callback: (element: T, index: number) => U): U;
    export declare function map<U, T>(array : Array<T>, callbackfn: (value: T, index: number, array: T[]) => U, thisArg ?: any): U[];
    export declare function getRelativePathToDirectoryOrUrl(directoryPathOrUrl: string, relativeOrAbsolutePath: string, currentDirectory: string, getCanonicalFileName: (fileName: string) => string, isAbsolutePathAnUrl: boolean);
}