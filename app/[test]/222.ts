// ❌ Co tu jest nie tak?
import {useCallback, useEffect, useRef, useState} from "react";


export function useDebounce<T>(value:T, ms:number){

    const [debounced, setDebounced] = useState(value)

    useEffect(()=>{
        const timer = setTimeout(()=>setDebounced(value),ms)
        return () => clearTimeout(timer)
    },[ms,value])
return debounced

}


export function useDebounceFn<T extends (...args:  Parameters<T>)=> void>(fn:T, ms:number){

  const timerRef= useRef<ReturnType<typeof setTimeout>| null>(null)
    const fnRef= useRef(fn)

    useEffect(()=>{fnRef.current=fn},[fn])

    return useCallback((...args:  Parameters<T>)=>{
        clearTimeout(timerRef.current ?? undefined)
        timerRef.current= setTimeout(()=>{
            return fnRef.current(...args)
        },ms)

    },[ms]) as T

}


export function useThrottleValue<T>(value: T, ms: number): T {
    const [throttled, setThrottled] = useState(value)
    const lastRun = useRef(Date.now())

    useEffect(() => {
        const now = Date.now()
        const remaining = ms - (now - lastRun.current)
        if (remaining <= 0) {
            lastRun.current = now
            setThrottled(value)
            return
        } else {
            const timer = setTimeout(() => {
                lastRun.current = Date.now()
                setThrottled(value)
            }, remaining)
            return () => clearTimeout(timer)
        }
    }, [value, ms])

    return throttled
}

export function useThrottleFn<T extends (...args: Parameters<T>) => void>(fn: T, ms: number): T {
    const lastRun = useRef(0)
    const fnRef = useRef(fn)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => { fnRef.current = fn }, [fn])

    useEffect(() => {
        return () => clearTimeout(timerRef.current ?? undefined)
    }, [])

    return useCallback((...args: Parameters<T>) => {
        const now = Date.now()
        const remaining = ms - (now - lastRun.current)

        if (remaining <= 0) {
            lastRun.current = now
            fnRef.current(...args)
        } else {
            clearTimeout(timerRef.current ?? undefined)
            timerRef.current = setTimeout(() => {
                lastRun.current = Date.now()
                fnRef.current(...args)
            }, remaining)
        }
    }, [ms]) as T
}