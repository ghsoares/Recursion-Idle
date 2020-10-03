import React, { useState } from "react";
import AceEditor from "react-ace";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-dracula";
import {
    buildFunction,
    parseCode,
} from "../../../decimal parser/DecimalParser";
import Decimal from "decimal.js";


const FunctionItem = ({ func }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [sourceCode, setSourceCode] = useState(func.sourceCode);
    const [errors, setErrors] = useState([]);

    const setFunctionCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const onEditorChange = (tex) => {
        setSourceCode(tex);
    };

    const onFunctionCompile = () => {
        setErrors([]);
        parseCode(sourceCode)
            .then((res) => {
                let newFunction = buildFunction(["x"], res);
                try {
                    let ret = newFunction(new Decimal("1.0"), Decimal);
                    if (!ret) {
                        throw "The function returns nothing!";
                    }
                    if (ret.lte(0.0)) {
                        throw "The function must return something bigger than zero!";
                    }
                    if (ret.gt(func.virtualMemory)) {
                        throw "The function will overflow the virtual machine's memory!";
                    }
                } catch (err) {
                    if (typeof(err) === "object") {
                        setErrors([err.message]);
                    } else {
                        setErrors([err]);
                    }
                }
            })
            .catch((err) => {
                if (typeof(err) === "object") {
                    setErrors([err.message]);
                }
            });
    };

    const onErrorClose = () => {
        let errs = [...errors];
        errs.shift();
        setErrors(errs);
    };

    let currentError;
    if (errors.length > 0) {
        currentError = errors[0];
    }

    return (
        <div className="function-item">
            <div className="function">
                <span className="function-header">
                    <button
                        onClick={setFunctionCollapsed}
                        className="collapse-function"
                    >
                        {collapsed ? (
                            <MdKeyboardArrowRight />
                        ) : (
                            <MdKeyboardArrowDown />
                        )}
                    </button>
                    function <span>{func.name}</span>(x) {"{"}
                </span>
                <div className="function-body">
                    {!collapsed ? (
                        <AceEditor
                            className="function-editor"
                            setOptions={{
                                useWorker: false,
                            }}
                            onChange={onEditorChange}
                            highlightActiveLine={false}
                            maxLines={Infinity}
                            width="100%"
                            mode="javascript"
                            theme="dracula"
                            fontSize={20}
                            defaultValue={sourceCode}
                        />
                    ) : (
                        <span>...</span>
                    )}
                </div>
                <span className="function-footer">{"}"}</span>
            </div>
            {errors.length > 0 ? (
                <div className="function-errors">
                    <div className="top">
                        <h2>Compilation Errors: </h2>
                        <button onClick={onErrorClose} className="error-close">
                            Close
                        </button>
                    </div>
                    <p className="error-info">{currentError}</p>
                </div>
            ) : null}
            <button onClick={onFunctionCompile} className="function-compile">
                Compile
            </button>
        </div>
    );
};

export default FunctionItem;
