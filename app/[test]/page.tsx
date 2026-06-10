'use client'
import {useCallback, useState} from "react";
// import {useDebounce, useDebounceFn, useThrottleFn, useThrottleValue} from "@/app/[test]/222";
import {memoize} from "@/hooks/x";


const Page=  ()=>{

const[value, setValue] = useState('')

    // const debounced = useDebounce(value, 500)
    // const throttled = useThrottleValue(value, 2000)
    //
    // const handleClick = useDebounceFn(()=> console.log(value),1111)
    // const handleClick2 = useThrottleFn(()=> console.log(value),1111)

const add = (a:number, b:number):number=>{
 return a+ b
}

const memoAdd = useCallback(()=> memoize(add),[])


    return <div className='flex flex-col items-center justify-center h-screen '>
     {/*<h1>{debounced}</h1>*/}
     {/*   <input value={value} onChange={(e)=> setValue(e.target.value)} className={'border'} />*/}
     {/*   <button  onClick={handleClick} >click me !</button>*/}
     {/*   <button  onClick={handleClick2} >click me throttle !</button>*/}
    </div>
}

export default Page