namespace ts {
    export declare var sys: System;
    export declare const supportedExtensions: Array<string>;
    export declare function fileExtensionIs(path: string, extension: string): boolean;

    export declare interface System {
        args: string[];
        newLine: string;
        write(s: string): void;
        getMemoryUsage?(): number;
        getCurrentDirectory(): string;
        exit(exitCode?: number): void;
        getExecutingFilePath(): string;
        resolvePath(path: string): string;
        fileExists(path: string): boolean;
        useCaseSensitiveFileNames: boolean;
        createDirectory(path: string): void;
        directoryExists(path: string): boolean;
        readFile(path: string, encoding?: string): string;
        writeFile(path: string, data: string, writeByteOrderMark?: boolean): void;
        readDirectory(path: string, extension?: string, exclude?: string[]): string[];
    } 
}
