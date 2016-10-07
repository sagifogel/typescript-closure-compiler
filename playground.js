/// <reference types="monaco-editor" />
(function () {
    "use strict";
    var examples = document.getElementById('examples');
    var wrapper = document.getElementById('wrapper');
    var excuteButton = document.getElementById("execute");
    var shareButton = document.getElementById("share");
    var lhs = {
        domNode: document.getElementById('typescriptEditor'),
        editor: null
    };
    var rhs = {
        domNode: document.getElementById('javascriptEditor'),
        editor: null
    };
    var editorLoaded = false;
    var sampleLoaded = false;
    // ------------ Loading logic
    (function () {
        var DEFAULT_EXAMPLE = '/typescript-closure-compiler/examples/walkthrough2.ts';
        var sample = '';
        require.config({ paths: { 'vs': './script/vs' } });
        require(['vs/editor/editor.main', 'vs/language/typescript/lib/typescriptServices'], function () {
            lhs.editor = monaco.editor.create(lhs.domNode, {
                value: sample,
                language: "typescript",
                formatOnType: true
            });
            rhs.editor = monaco.editor.create(rhs.domNode, {
                value: "",
                language: "javascript",
                readOnly: true
            });
            console.info('editors rendered @@ ' + ((new Date()).getTime() - startTime) + 'ms');
            editorLoaded = true;
            onSomethingLoaded();
        });
        (function () {
            var queryStringSrcStart = window.location.hash.indexOf("#src=");
            var tutorialStart = window.location.hash.indexOf('#tut=');
            var localStorageStart = window.localStorage && window.localStorage["src"];
            function loadTutorial() {
                var tutorialName = window.location.hash.substring('#tut='.length);
                var path = '/examples/' + tutorialName + '.ts';
                xhr(path, function (xhr) {
                    sample = xhr.responseText;
                    sampleLoaded = true;
                    onSomethingLoaded();
                }, function (_) {
                    loadInitialText(false, true, true);
                });
            }
            function loadByQueryString() {
                var encoded = window.location.hash.substring("#src=".length);
                try {
                    sample = decodeURIComponent(encoded);
                    sampleLoaded = true;
                    onSomethingLoaded();
                    return;
                }
                catch (e) {
                    console.log("unable to parse #src= uri component");
                }
            }
            function loadByLocalStorage() {
                sampleLoaded = true;
                sample = localStorageStart;
                onSomethingLoaded();
            }
            function loadDefault() {
                examples.selectedIndex = 3;
                xhr(DEFAULT_EXAMPLE, function (xmlHttpReq) {
                    sampleLoaded = true;
                    sample = xmlHttpReq.responseText;
                    onSomethingLoaded();
                });
            }
            function loadInitialText(tryTutorial, tryQueryString, tryLocalStorage) {
                if (tryTutorial && tutorialStart === 0)
                    loadTutorial();
                else if (tryQueryString && queryStringSrcStart === 0)
                    loadByQueryString();
                else if (tryLocalStorage && localStorageStart)
                    loadByLocalStorage();
                else
                    loadDefault();
            }
            loadInitialText(true, true, true);
        })();
        function onSomethingLoaded() {
            if (editorLoaded && sampleLoaded) {
                lhs.editor.getModel().setValue(sample);
                console.info('sample rendered @@ ' + ((new Date()).getTime() - startTime) + 'ms');
                console.info('starting compilation @@ ' + ((new Date()).getTime() - startTime) + 'ms');
                triggerCompile();
                lhs.editor.onDidChangeModelContent(function () {
                    triggerCompile();
                });
                console.info('sample compiled @@ ' + ((new Date()).getTime() - startTime) + 'ms');
            }
        }
    })();
    // ------------ Resize logic
    function resize() {
        // incorporate header and footer and adaptive layout
        var headerSize = 0; // 120
        var footerSize = 51;
        var horizontalSpace = 10;
        var wrapperSizeDiff = headerSize + footerSize;
        var windowHeight = window.innerHeight || document.body.offsetHeight || document.documentElement.offsetHeight;
        wrapper.style.height = (windowHeight - wrapper.offsetTop - wrapperSizeDiff) + "px";
        var halfWidth = Math.floor((wrapper.clientWidth - 40) / 2) - 8 - (horizontalSpace / 2);
        // Layout lhs
        var lhsSizeDiff = wrapperSizeDiff + 40;
        lhs.domNode.style.width = halfWidth + "px";
        lhs.domNode.style.height = (windowHeight - wrapper.offsetTop - lhsSizeDiff) + "px";
        if (lhs.editor) {
            lhs.editor.layout();
        }
        // Layout rhs
        var rhsSizeDiff = wrapperSizeDiff + 40;
        rhs.domNode.style.left = (halfWidth + 2 + horizontalSpace) + "px";
        rhs.domNode.style.width = halfWidth + "px";
        rhs.domNode.style.height = (windowHeight - wrapper.offsetTop - rhsSizeDiff) + "px";
        rhs.domNode.style.top = -(wrapper.clientHeight - 38) + "px";
        if (rhs.editor) {
            rhs.editor.layout();
        }
    }
    resize();
    window.onresize = resize;
    // ------------ Compilation logic
    var compilerTriggerTimeoutID = null;
    function triggerCompile() {
        if (compilerTriggerTimeoutID !== null) {
            window.clearTimeout(compilerTriggerTimeoutID);
        }
        compilerTriggerTimeoutID = window.setTimeout(function () {
            try {
                if (!sampleLoaded || !editorLoaded) {
                    console.log("not loaded");
                }
                var output = transpileModule(lhs.editor.getValue());
                if (typeof output === "string") {
                    var rhsModel = rhs.editor.getModel();
                    // Save view state
                    var viewState = rhs.editor.saveViewState();
                    // Update content
                    rhsModel.setValue(output);
                    // Remove flicker: force tokenization
                    rhsModel.getLineTokens(rhsModel.getLineCount());
                    // Restore view state
                    rhs.editor.restoreViewState(viewState);
                    // Remove flicker: force rendering
                    rhs.editor.getOffsetForColumn(1, 1);
                }
            }
            catch (e) {
                console.log("Error from compilation: " + e + "  " + (e.stack || ""));
            }
        }, 100);
    }
    
    function transpileModule(input) {
        var options = {
            noLib: true,
            noResolve: true,
            emitInterfaces: true,
            emitAnnotations: true,
            emitOneSideEnum: true,
            module: ts.ModuleKind.AMD,
            target: ts.ScriptTarget.ES5,
            suppressOutputPathCheck: true
        };
        
        var inputFileName = options.jsx ? "module.tsx" : "module.ts";
        var sourceFile = ts.createSourceFile(inputFileName, input, options.target || ts.ScriptTarget.ES5);
        // Output
        var outputText;
        var program = ts.createProgram([inputFileName], options, {
            getSourceFile: function (fileName) { return fileName.indexOf("module") === 0 ? sourceFile : undefined; },
            writeFile: function (_name, text) { outputText = text; },
            getDefaultLibFileName: function () { return "lib.d.ts"; },
            useCaseSensitiveFileNames: function () { return false; },
            getCanonicalFileName: function (fileName) { return fileName; },
            getCurrentDirectory: function () { return ""; },
            getNewLine: function () { return "\r\n"; },
            fileExists: function (fileName) { return fileName === inputFileName; },
            readFile: function () { return ""; },
            directoryExists: function () { return true; },
            getDirectories: function () { return []; }
        });
        // Emit
        program.emit();
        if (outputText === undefined) {
            throw new Error("Output generation failed");
        }
        return outputText;
    }
    // ------------ Execution logic
    excuteButton.onclick = function () {
        var external = window.open();
        var script = external.window.document.createElement("script");
        script.textContent = rhs.editor.getModel().getValue();
        external.window.document.body.appendChild(script);
        //external.window.eval(rhs.editor.getModel().getValue());
    };
    examples.onchange = function () {
        var selectedExample = examples.options[examples.selectedIndex].value;
        if (selectedExample != "") {
            xhr('/typescript-closure-compiler/examples/' + selectedExample, function (xmlHttpReq) {
                if (editorLoaded) {
                    lhs.editor.getModel().setValue(xmlHttpReq.responseText);
                }
            });
        }
    };
    var ignoreHashChange = false;
    // ------------ Sharing logic
    if ("onhashchange" in window) {
        window.onhashchange = function () {
            if (ignoreHashChange) {
                ignoreHashChange = false;
                return;
            }
            var queryStringSrcStart = window.location.hash.indexOf("#src=");
            if (queryStringSrcStart == 0) {
                var encoded = window.location.hash.substring("#src=".length);
                try {
                    var text = decodeURIComponent(encoded);
                    if (sampleLoaded) {
                        lhs.editor.getModel().setValue(text);
                    }
                }
                catch (e) {
                    console.log("unable to parse #src= uri component");
                }
            }
        };
    }
    // Save buffer to localStorage every second if there are changes to model
    if (window.localStorage) {
        var lastVersion_1;
        setInterval(function () {
            if (!sampleLoaded || !editorLoaded)
                return;
            var model = lhs.editor.getModel();
            var version = model.getVersionId();
            if (version !== lastVersion_1) {
                window.localStorage["src"] = model.getValue();
                lastVersion_1 = version;
            }
        }, 1000);
    }
    function xhr(url, complete, error) {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (req.readyState === 4) {
                if ((req.status >= 200 && req.status < 300) || req.status === 1223) {
                    complete(req);
                }
                else {
                    error && error(req);
                }
                req.onreadystatechange = function () { };
            }
        };
        req.open("GET", url, true);
        req.responseType = "";
        req.send(null);
    }
})();
