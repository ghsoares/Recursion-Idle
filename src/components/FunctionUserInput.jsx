import React from 'react';
import { forwardRef } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';

const FunctionUserInput = ({inputId, type, name, initialValue, onChange}) => {
    const inpRef = useRef();

    const resizeInput = () => {
        let inp = inpRef.current;
        let vl = inp.value.length | 1;
        inp.size = vl;
    }

    const changeRef = (r) => {
        inpRef.current = r;
    }

    const onInputChange = (e) => {
        resizeInput();
        onChange(e, e.target.value, inputId);
    }

    useEffect(() => {
        if (!inpRef.current) return;
        resizeInput();
    }, [inpRef]);
    
    return (<input
        ref={changeRef}
        defaultValue={initialValue}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        onChange={onInputChange}
        userinputtype={type}
        type="text"
        className={`function-input ${type}`}
        name={name} />);
}

export default FunctionUserInput;