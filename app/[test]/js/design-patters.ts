class Logger {
    private static instance: Logger | null = null
    private logs: string[] = []

    private constructor() {}  // blokuje new Logger() z zewnątrz

    static getInstance(): Logger {
        if (!Logger.instance) Logger.instance = new Logger()
        return Logger.instance
    }

    log(msg: string): void {
        this.logs.push(msg)
    }

    getLogs(): string[] {
        return this.logs
    }
}

class EventEmitter{

    private listeners = new Map<string, Array<(payload: any) => void>>()

    on(event:string, fn:(p:any)=> void){
        if (!this.listeners.has(event)) this.listeners.set(event, [])
        this.listeners.get(event)!.push(fn)    }

    off(event:string, fn:(p:any)=> void){
        this.listeners.set(event, (this.listeners.get(event) ?? []).filter(el => el !== fn))
    }

    emit(event:string,data:any){
        this.listeners.get(event)?.forEach(cb => cb(data))
    }

}

interface PaymentProvider {
    process(amount: number): void
}

class BlikProvider implements PaymentProvider {
    process(amount: number) {
        console.log(`Blik: ${amount}`)
    }
}

class CardProvider implements PaymentProvider {
    process(amount: number) {
        console.log(`Card: ${amount}`)
    }
}

function createPayment(method: string): PaymentProvider {
    if (method === 'blik') return new BlikProvider()
    if (method === 'card') return new CardProvider()
    throw new Error(`Unknown method: ${method}`)
}


type Prod={
    price:number,
    name:string
}

const sortStrategies = {
    byPrice: (a:Prod, b:Prod) => a.price - b.price,
    byName: (a:Prod, b:Prod) => a.name.localeCompare(b.name),
};


function sortProducts(products:Prod[], strategy:keyof typeof sortStrategies){
    return products.sort(sortStrategies[strategy])
}

// const sorted = products.sort(sortStrategies['byPrice']);



function withCache<T extends (...args:any[])=> any >(fn:T){
    const cache = new Map<string,ReturnType<T>>()

    return  (async (...args:any[])=>{
        const key = JSON.stringify(args)
        let result

        if(cache.has(key)) result=cache.get(key)
        else{
            result =  await fn(...args)
            cache.set(key, result)
        }

        return result
    })
}



const cart = (() => {
    let items: any[] = [] // prywatne

    return {
        add: (item: any) => items.push(item),
        get: () => items,
        clear: () => { items = [] }
    }
})()

cart.add('buty')
cart.get()   // ['buty']
cart.items   // ❌ undefined — prywatne







class Database{

    private constructor() {
    }

    private static instance:Database |null= null

    static getInstance(){

        if(!this.instance) {
            this.instance = new Database()
        }
        return this.instance
    }

    query(sql:string){
        console.log(`executing ${sql}`)
    }

}


class EventEmitter2{

    listeners = new Map<string,Array<(payload:any)=>void>>()


    on(event:string, fn:(p:any)=> void){
        if (!this.listeners.has(event)) this.listeners.set(event, [])
        this.listeners.get(event)!.push(fn)    }

    off(event:string, fn:(p:any)=> void){
        if(!this.listeners.has(event)) throw new Error('xd')
        this.listeners.set(event, this.listeners.get(event)!.filter((el)=> el !== fn))
    }

    emit(event:string, data:any){
        this.listeners.get(event)?.forEach((el)=> el(data))
    }

}






function createNotification(type:string){

}
















