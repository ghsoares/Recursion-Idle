import React from 'react';
import { forwardRef } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';

const FunctionUserInput = ({type, name, initialValue}) => {
    const inpRef = useRef();

    const resizeInput = () => {
        let inp = inpRef.current;
        let vl = inp.value.length | 1;
        inp.size = vl;
    }

    const changeRef = (r) => {
        inpRef.current = r;
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
        onChange={resizeInput}
        userinputtype={type}
        type="text"
        className={`function-input ${type}`}
        name={name} />);
}

export default FunctionUserInput;