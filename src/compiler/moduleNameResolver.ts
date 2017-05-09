/// <reference path="core.ts" />
/// <reference path="diagnosticInformationMap.generated.ts" />


namespace ts {
    export interface PerModuleNameCache {
        get(directory: string): ResolvedModuleWithFailedLookupLocations;
        set(directory: string, result: ResolvedModuleWithFailedLookupLocations): void;
    }

    export interface ModuleResolutionCache extends NonRelativeModuleNameResolutionCache {
        getOrCreateCacheForDirectory(directoryName: string): Map<ResolvedModuleWithFailedLookupLocations>;
    }

    export interface NonRelativeModuleNameResolutionCache {
        getOrCreateCacheForModuleName(nonRelativeModuleName: string): PerModuleNameCache;
    }

    export interface ModuleResolutionCache extends NonRelativeModuleNameResolutionCache {
        getOrCreateCacheForDirectory(directoryName: string): Map<ResolvedModuleWithFailedLookupLocations>;
    }

    export declare function createModuleResolutionCache(currentDirectory: string, getCanonicalFileName: (s: string) => string): ModuleResolutionCache;
    export declare function resolveModuleName(moduleName: string, containingFile: string, compilerOptions: CompilerOptions, host: ModuleResolutionHost, cache?: ModuleResolutionCache): ResolvedModuleWithFailedLookupLocations;
}