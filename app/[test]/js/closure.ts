// Napisz funkcję memoize która cachuje wyniki funkcji
// żeby nie przeliczać dla tych samych argumentów

function slowSquare(n) {
    // symulacja wolnego obliczenia
    return n * n
}

const fastSquare = memoize(slowSquare)

fastSquare(4) // liczy
fastSquare(4) // zwraca z cache
fastSquare(5) // liczy


function memoize<T extends (...args:any[])=> any>(fn:T){

    const cache = new Map<string, ReturnType<T>>()
    return (...args: Parameters<T>): ReturnType<T> =>{
        const key= JSON.stringify(args)
        if (cache.has(key)) return cache.get(key)!
        const result = fn(...args)
        cache.set(key, result)
        return result
    }

}



// Co wypisze?
// Co wypisze?
function outer() {
    let x = 10

    function inner() {
        let y = 20
        console.log(x + y)
    }

    x = 50
    inner()
}

outer()

//70



// co wypisze

function createFunctions() {
    const funcs = []

    for (let i = 0; i < 3; i++) {
        funcs.push(() => console.log(i))
    }

    return funcs
}

const fns = createFunctions()
fns[0]()  // ?
fns[1]()  // ?
fns[2]()  // ?


//0,1,2


//co wypisze


function makeMultiplier(x) {
    return {
        multiply: (y) => x * y,
        multiplyAndAdd: (y, z) => x * y + z,
        getX: () => x,
        setX: (newX) => { x = newX }
    }
}

const m = makeMultiplier(3)

console.log(m.multiply(4))      // 12
console.log(m.multiplyAndAdd(2, 10)) // 16
m.setX(10)
console.log(m.multiply(4))      // 40
console.log(m.getX())           // 10







// napisz once


function once<T extends (...args: any[]) => any>(fn: T): T {
    let isCalled = false
    let fnRes: ReturnType<T> | undefined = undefined


    return ((...args: Parameters<T>) => {
        if (!isCalled) {
            isCalled = true
            fnRes = fn(...args)
            return fnRes
        }
        return fnRes
    }) as T


}

function greet(name) {
    console.log(`Cześć ${name}!`)
    return `Hello ${name}`
}

const greetOnce = once(greet)

greetOnce('Anna')  // loguje i zwraca
greetOnce('Jan')   // nic nie loguje, zwraca wynik pierwszego wywołania
greetOnce('Piotr') // nic nie loguje, zwraca wynik pierwszego wywołania





// Napisz funkcję throttle
// fn może być wywołana maksymalnie raz na X ms
// kolejne wywołania w tym oknie są ignorowane

function throttle<T extends (...args:any[])=> any>(fn:T, delay:number):T {

    let lastCall = 0

    return ((...args: any[]) => {
        const now = Date.now()
        if (now - lastCall >= delay) {
            lastCall = now
            return fn(...args)
        }
    }) as T
}

const log = throttle(() => console.log('wywołano'), 1000)

log() // wywołuje
log() // ignoruje — za wcześnie
log() // ignoruje — za wcześnie

setTimeout(() => log(), 1100) // wywołuje — minęło 1100ms






// Napisz funkcję debounce
// fn wywoła się dopiero po X ms od ostatniego wywołania
// każde nowe wywołanie resetuje timer

function debounce<T extends (...args:any [])=>any>(fn:T, delay:number): T {
    let timer: ReturnType<typeof setTimeout>

    return ((...args: any[]) => {
        clearTimeout(timer)
        timer = setTimeout(() => fn(...args), delay)
    }) as T
}





const log = debounce(() => console.log('wywołano'), 300)

log() // resetuje timer
log() // resetuje timer
log() // resetuje timer
// po 300ms od ostatniego wywołania → loguje 'wywołano'






