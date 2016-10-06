/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * monaco-typescript version: 0.6.1(7724ecff2135cddc2df3bafd0acc23c2b38bd3e1)
 * Released under the MIT license
 * https://github.com/Microsoft/monaco-typescript/blob/master/LICENSE.md
 *-----------------------------------------------------------------------------*/
 define("vs/language/typescript/src/worker", ["require", "exports", "../lib/typescriptServices", "../lib/lib-ts", "../lib/lib-es6-ts"], function (e, n, r, t, a) {
    "use strict";

    function i(e, n) {
        return new d(e, n)
    }
    var o = monaco.Promise,
        s = {
            NAME: "defaultLib:lib.d.ts",
            CONTENTS: t.contents
        },
        l = {
            NAME: "defaultLib:lib.es6.d.ts",
            CONTENTS: a.contents
        },
        d = function () {
            function e(e, n) {
                this._extraLibs = Object.create(null), this._languageService = r.createLanguageService(this), this._ctx = e, this._compilerOptions = n.compilerOptions, this._extraLibs = n.extraLibs
            }
            return e.prototype.getCompilationSettings = function () {
                return this._compilerOptions
            }, e.prototype.getScriptFileNames = function () {
                var e = this._ctx.getMirrorModels().map(function (e) {
                    return e.uri.toString()
                });
                return e.concat(Object.keys(this._extraLibs))
            }, e.prototype._getModel = function (e) {
                for (var n = this._ctx.getMirrorModels(), r = 0; r < n.length; r++)
                    if (n[r].uri.toString() === e) return n[r];
                return null
            }, e.prototype.getScriptVersion = function (e) {
                var n = this._getModel(e);
                return n ? n.version.toString() : this.isDefaultLibFileName(e) || e in this._extraLibs ? "1" : void 0
            }, e.prototype.getScriptSnapshot = function (e) {
                var n, r = this._getModel(e);
                if (r) n = r.getValue();
                else if (e in this._extraLibs) n = this._extraLibs[e];
                else if (e === s.NAME) n = s.CONTENTS;
                else {
                    if (e !== l.NAME) return;
                    n = l.CONTENTS
                }
                return {
                    getText: function (e, r) {
                        return n.substring(e, r)
                    },
                    getLength: function () {
                        return n.length
                    },
                    getChangeRange: function () { }
                }
            }, e.prototype.getCurrentDirectory = function () {
                return ""
            }, e.prototype.getDefaultLibFileName = function (e) {
                return e.target > r.ScriptTarget.ES5 ? s.NAME : l.NAME
            }, e.prototype.isDefaultLibFileName = function (e) {
                return e === this.getDefaultLibFileName(this._compilerOptions)
            }, e.prototype.getSyntacticDiagnostics = function (e) {
                var n = this._languageService.getSyntacticDiagnostics(e);
                return n.forEach(function (e) {
                    return e.file = void 0
                }), o.as(n)
            }, e.prototype.getSemanticDiagnostics = function (e) {
                var n = this._languageService.getSemanticDiagnostics(e);
                return n.forEach(function (e) {
                    return e.file = void 0
                }), o.as(n)
            }, e.prototype.getCompilerOptionsDiagnostics = function (e) {
                var n = this._languageService.getCompilerOptionsDiagnostics();
                return n.forEach(function (e) {
                    return e.file = void 0
                }), o.as(n)
            }, e.prototype.getCompletionsAtPosition = function (e, n) {
                return o.as(this._languageService.getCompletionsAtPosition(e, n))
            }, e.prototype.getCompletionEntryDetails = function (e, n, r) {
                return o.as(this._languageService.getCompletionEntryDetails(e, n, r))
            }, e.prototype.getSignatureHelpItems = function (e, n) {
                return o.as(this._languageService.getSignatureHelpItems(e, n))
            }, e.prototype.getQuickInfoAtPosition = function (e, n) {
                return o.as(this._languageService.getQuickInfoAtPosition(e, n))
            }, e.prototype.getOccurrencesAtPosition = function (e, n) {
                return o.as(this._languageService.getOccurrencesAtPosition(e, n))
            }, e.prototype.getDefinitionAtPosition = function (e, n) {
                return o.as(this._languageService.getDefinitionAtPosition(e, n))
            }, e.prototype.getReferencesAtPosition = function (e, n) {
                return o.as(this._languageService.getReferencesAtPosition(e, n))
            }, e.prototype.getNavigationBarItems = function (e) {
                return o.as(this._languageService.getNavigationBarItems(e))
            }, e.prototype.getFormattingEditsForDocument = function (e, n) {
                return o.as(this._languageService.getFormattingEditsForDocument(e, n))
            }, e.prototype.getFormattingEditsForRange = function (e, n, r, t) {
                return o.as(this._languageService.getFormattingEditsForRange(e, n, r, t))
            }, e.prototype.getFormattingEditsAfterKeystroke = function (e, n, r, t) {
                return o.as(this._languageService.getFormattingEditsAfterKeystroke(e, n, r, t))
            }, e.prototype.getEmitOutput = function (e) {
                return o.as(this._languageService.getEmitOutput(e))
            }, e
        }();
    n.TypeScriptWorker = d, n.create = i
});