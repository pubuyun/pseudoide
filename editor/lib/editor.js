var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import * as React from "react";
import { useEffect, useMemo, useRef } from "react";
import { noop, processSize } from "./utils";
function MonacoEditor(_a) {
    var width = _a.width, height = _a.height, value = _a.value, defaultValue = _a.defaultValue, language = _a.language, theme = _a.theme, options = _a.options, overrideServices = _a.overrideServices, editorWillMount = _a.editorWillMount, editorDidMount = _a.editorDidMount, editorWillUnmount = _a.editorWillUnmount, onChange = _a.onChange, className = _a.className, uri = _a.uri;
    var containerElement = useRef(null);
    var editor = useRef(null);
    var _subscription = useRef(null);
    var __prevent_trigger_change_event = useRef(null);
    var fixedWidth = processSize(width);
    var fixedHeight = processSize(height);
    var onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    var style = useMemo(function () { return ({
        width: fixedWidth,
        height: fixedHeight,
    }); }, [fixedWidth, fixedHeight]);
    var handleEditorWillMount = function () {
        var finalOptions = editorWillMount(monaco);
        return finalOptions || {};
    };
    var handleEditorDidMount = function () {
        editorDidMount(editor.current, monaco);
        _subscription.current = editor.current.onDidChangeModelContent(function (event) {
            var _a;
            if (!__prevent_trigger_change_event.current) {
                (_a = onChangeRef.current) === null || _a === void 0 ? void 0 : _a.call(onChangeRef, editor.current.getValue(), event);
            }
        });
    };
    var handleEditorWillUnmount = function () {
        editorWillUnmount(editor.current, monaco);
    };
    var initMonaco = function () {
        var finalValue = value !== null ? value : defaultValue;
        if (containerElement.current) {
            // Before initializing monaco editor
            var finalOptions = __assign(__assign({}, options), handleEditorWillMount());
            var modelUri = uri === null || uri === void 0 ? void 0 : uri(monaco);
            var model = modelUri && monaco.editor.getModel(modelUri);
            if (model) {
                // Cannot create two models with the same URI,
                // if model with the given URI is already created, just update it.
                model.setValue(finalValue);
                monaco.editor.setModelLanguage(model, language);
            }
            else {
                model = monaco.editor.createModel(finalValue, language, modelUri);
            }
            editor.current = monaco.editor.create(containerElement.current, __assign(__assign(__assign({ model: model }, (className ? { extraEditorClassName: className } : {})), finalOptions), (theme ? { theme: theme } : {})), overrideServices);
            // After initializing monaco editor
            handleEditorDidMount();
        }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(initMonaco, []);
    useEffect(function () {
        if (editor.current) {
            if (value === editor.current.getValue()) {
                return;
            }
            var model = editor.current.getModel();
            __prevent_trigger_change_event.current = true;
            editor.current.pushUndoStop();
            // pushEditOperations says it expects a cursorComputer, but doesn't seem to need one.
            model.pushEditOperations([], [
                {
                    range: model.getFullModelRange(),
                    text: value,
                },
            ], undefined);
            editor.current.pushUndoStop();
            __prevent_trigger_change_event.current = false;
        }
    }, [value]);
    useEffect(function () {
        if (editor.current) {
            var model = editor.current.getModel();
            monaco.editor.setModelLanguage(model, language);
        }
    }, [language]);
    useEffect(function () {
        if (editor.current) {
            // Don't pass in the model on update because monaco crashes if we pass the model
            // a second time. See https://github.com/microsoft/monaco-editor/issues/2027
            var _model = options.model, optionsWithoutModel = __rest(options, ["model"]);
            editor.current.updateOptions(__assign(__assign({}, (className ? { extraEditorClassName: className } : {})), optionsWithoutModel));
        }
    }, [className, options]);
    useEffect(function () {
        if (editor.current) {
            editor.current.layout();
        }
    }, [width, height]);
    useEffect(function () {
        monaco.editor.setTheme(theme);
    }, [theme]);
    useEffect(function () { return function () {
        if (editor.current) {
            handleEditorWillUnmount();
            editor.current.dispose();
        }
        if (_subscription.current) {
            _subscription.current.dispose();
        }
    }; }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    return (React.createElement("div", { ref: containerElement, style: style, className: "react-monaco-editor-container" }));
}
MonacoEditor.defaultProps = {
    width: "100%",
    height: "100%",
    value: null,
    defaultValue: "",
    language: "javascript",
    theme: null,
    options: {},
    overrideServices: {},
    editorWillMount: noop,
    editorDidMount: noop,
    editorWillUnmount: noop,
    onChange: noop,
    className: null,
};
MonacoEditor.displayName = "MonacoEditor";
export default MonacoEditor;
//# sourceMappingURL=editor.js.map