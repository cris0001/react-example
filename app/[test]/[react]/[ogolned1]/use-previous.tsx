import {useRef, useState} from "react";

function  usePrevious<T>(value:T):T|undefined{

    let refValue = useRef(undefined)


    useEffect(() => {
        ref.current = value
    }, [value])

    return refValue.current
}