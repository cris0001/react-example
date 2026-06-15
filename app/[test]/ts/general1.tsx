// Zadanie 1 — typy vs interfejsy: 💻💻💻
// Zadanie 1 — typy vs interfejsy: 💻💻💻
// Zadanie 1 — typy vs interfejsy: 💻💻💻
// Zadanie 1 — typy vs interfejsy: 💻💻💻



import {useState} from "react";

interface Order {
    id: number;
    customerId: number;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
    createdAt: Date;
}

// napisz typ OrderPreview z tylko id i total
type OrderPreview = Pick<Order,'id'|'total'>

// napisz typ OrderStatus — union ze statusami
type OrderStatus = Order['status']

// napisz typ AdminOrder łączący Order z { handledBy: string, note?: string }

type AdminOrder = Order & {handledBy:string, note?:string}


// Zadanie 2 — generics: 💻💻💻
// Zadanie 2 — generics: 💻💻💻
// Zadanie 2 — generics: 💻💻💻
// Zadanie 2 — generics: 💻💻💻

// napisz funkcję swap<T, U> która przyjmuje parę [T, U] i zwraca [U, T]

function swap<T, U>([x, y]: [T, U]): [U, T] {

    return [y,x]
}

// napisz typ Pair<T, U> z polami first i second

type Pair<T,U>={
    first:T,
    second:U
}

// napisz funkcję makePair<T, U> która przyjmuje dwie wartości i zwraca Pair<T, U>


function makePair<T,U>(x:T,y:U):Pair<T, U>{

    return {
        first:x,
        second:y
    }
}


// Zadanie 3 — utility types + mapped types: 💻💻💻
// Zadanie 3 — utility types + mapped types: 💻💻💻
// Zadanie 3 — utility types + mapped types: 💻💻💻
// Zadanie 3 — utility types + mapped types: 💻💻💻


// mając Order napisz:
// UpdateOrder — wszystkie pola opcjonalne oprócz id (id zawsze wymagane)

type UpdateOrder = Pick<Order,'id'> & Omit<Partial<Order>,'id'>


// ReadonlyOrder — wszystkie pola readonly

type ReadonlyOrder = Readonly<Order>

// OrderKeys — union wszystkich kluczy Order

type OrderKeys = keyof Order


// Zadanie 4 — discriminated unions + type guards: 💻💻💻
// Zadanie 4 — discriminated unions + type guards: 💻💻💻
// Zadanie 4 — discriminated unions + type guards: 💻💻💻
// Zadanie 4 — discriminated unions + type guards: 💻💻💻

// napisz discriminated union PaymentMethod:
// - card z polami: cardNumber: string, expiryDate: string
// - blik z polem: phoneNumber: string
// - cash (bez dodatkowych pól)


type PaymentMethod=
    | {type:'card',cardNumber:string,expiryDate:string}
    | {type:'blik', phoneNumber:string}
    | {type:'cash'}

// napisz funkcję processPayment która przyjmuje PaymentMethod
// i zwraca string opisujący metodę płatności
// napisz custom type guard isCardPayment
function processPayment(x:PaymentMethod):string{

switch(x.type){
    case 'card': return 'platnosc karta'
    case 'blik':return 'platnosc blik'
    case 'cash': return 'gotowa'
    default:
        const val:never=x
        return x

}

}
function isCardPayment(x: PaymentMethod): x is Extract<PaymentMethod, { type: 'card' }> {
    return x.type === 'card'
}


// Zadanie 5 —  conditional types + infer: 💻💻💻
// Zadanie 5 —  conditional types + infer: 💻💻💻
// Zadanie 5 —  conditional types + infer: 💻💻💻
// Zadanie 5 —  conditional types + infer: 💻💻💻


// napisz typ UnwrapArray<T> — jeśli T to tablica zwraca typ elementu, jeśli nie zwraca T

type UnwrapArray<T> = T extends Array<infer U>? U:T

// napisz typ UnwrapPromise<T> — wyciąga typ z Promise

type UnwrapPromise<T> = T extends Promise<infer U>? U:T

// napisz typ FirstArg<T> — wyciąga typ pierwszego argumentu funkcji

type FirstArgs<T> = T extends (first: infer U, ...args:any[])=> any? U:T


// Zadanie 6 —  mapped types: 💻💻💻
// Zadanie 6 —  mapped types: 💻💻💻
// Zadanie 6 —  mapped types: 💻💻💻
// Zadanie 6 —  mapped types: 💻💻💻



// mając Order napisz:
// Nullable<T> — każde pole może być null

type Nullable<T> ={[K in keyof T]: T[K]| null}

// Optional<T, K extends keyof T> — tylko podane pola K opcjonalne, reszta wymagana

type Optional<T, K extends keyof T> = Partial<Pick<T,K>> & Omit<T, K>

// Getters<T> — dla każdego pola tworzy metodę getX

type Getters<T>= {[K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]}



// Zadanie 7 —  template literal types: 💻💻💻
// Zadanie 7 —  template literal types: 💻💻💻
// Zadanie 7 —  template literal types: 💻💻💻
// Zadanie 7 —  template literal types: 💻💻💻


// napisz typ EventHandlers<T> — dla każdego pola tworzy handler onChange

// np. dla { name: string } → { onChangeName: (value: string) => void }
type EventHandlers<T>= {[K in keyof T as `onChange${Capitalize<string & K>}`]: (value: T[K])=>void}


// napisz typ CSSProperty — union: 'margin' | 'padding' | 'border'

type CSSProperty = 'margin' | 'padding' | 'border'
type Directions ='top' | 'bottom' | 'left' | 'right'
// napisz typ CSSWithDirection — wszystkie kombinacje z kierunkami: 'top' | 'bottom' | 'left' | 'right'

type CSSWithDirection = `${CSSProperty}-${Directions}`


// np. 'margin-top' | 'margin-bottom' | 'padding-left' itp.


// Zadanie 8 —  branded types: 💻💻💻
// Zadanie 8 —  branded types: 💻💻💻
// Zadanie 8 —  branded types: 💻💻💻
// Zadanie 8 —  branded types: 💻💻💻



// napisz Brand<T, B>

type Brand<T, B> = T & { __brand: B };

// napisz typy OrderId i CustomerId (oba oparte na number)

type OrderId= Brand<number,'order_id'>
type CustomerId=Brand<number,'customer_id'>

// napisz smart constructory createOrderId i createCustomerId

function createOrderId(x: number):OrderId{
    if (x <= 0) throw new Error('Invalid');
    return x as OrderId;
}

function createCustomerId(x:number):CustomerId{
    if (x <= 0) throw new Error('Invalid');
    return x as CustomerId;
}

// napisz funkcję getOrder która przyjmuje tylko OrderId

function getOrder(x:OrderId){
    return{}
}

const validOrderId = createOrderId(5)
const validCustomerId = createCustomerId(323)
getOrder(validOrderId)





// Zadanie 9 — 💻💻💻
// Zadanie 9 — 💻💻💻
// Zadanie 9 — 💻💻💻
// Zadanie 9 — 💻💻💻


// napisz hook useOrderForm który:
// - przyjmuje initialOrder: Partial<Order>
// - zwraca FormState<Partial<Order>> plus metody setValue i reset
//             FormState<T> to typ opisujący stan formularza z trzema polami:
//
//                 values — aktualne wartości inputów (wszystko jako string)
//             errors — błędy walidacji (string | undefined)
//             touched — czy pole było dotknięte (boolean)
// - setValue przyjmuje klucz z Order i wartość
// - używa ApiState<Order> do śledzenia stanu zapisu
// - ma metodę submit która zmienia ApiState na loading, potem success lub error




type FormState<T extends object> = {
    val: {[K in keyof T]:string},
    err: { [K in keyof T]: string | undefined };
    tched: { [K in keyof T]: boolean };
}

function useOrderForm<T>(initialOrder: Partial<Order>):FormState<Partial<Order>>& {
    setValue(key: keyof T, value: string): void;
    reset(): void;
    submit(): void;
}{

    // const[values,setValues] = useState<{ [K in keyof T]: string }>(Object.fromEntries(
    //     Object.entries(initialValues as object).map(([k]) => [k, ''])
    // ) as { [K in keyof T]: string })

    const [val, setVal] = useState<{ [K in keyof T]: string }>(Object.fromEntries(Object.entries(initialOrder as object).map(([K])=> [K,''])) as {[K in keyof T]: string} )
    const [err, setErr] = useState<{ [K in keyof T]: string | undefined }>(Object.fromEntries(Object.entries(initialOrder as object).map(([K])=> [K,undefined])) as {[K in keyof T]: string | undefined} )
    const [tched, setTched] = useState<{ [K in keyof T]: boolean }>(Object.fromEntries(Object.entries(initialOrder as object).map(([K])=> [K,false])) as {[K in keyof T]: boolean} )

    const setValue = (key: keyof T, value: string):void => {
        setVal(prev => ({ ...prev, [key]: value }));
    }

    const reset = ()=>{
        setVal(Object.fromEntries(Object.entries(initialOrder as object).map(([K])=> [K,''])) as {[K in keyof T]: string})
        setErr(Object.fromEntries(Object.entries(initialOrder as object).map(([K])=> [K,undefined])) as {[K in keyof T]: string | undefined} )
        setTched(Object.fromEntries(Object.entries(initialOrder as object).map(([K])=> [K,false])) as {[K in keyof T]: boolean})
    }

    const submit =()=>{
        console.log('submit')
    }


    return {reset, submit, setValue, val, err, tched}

}

// Z 10 —  distributive conditional types + infer: 💻💻💻
// Z 10 —  distributive conditional types + infer: 💻💻💻
// Z 10 —  distributive conditional types + infer: 💻💻💻
// Z 10 —  distributive conditional types + infer: 💻💻💻



// napisz typ Flatten<T> — jeśli T to tablica tablic, spłaszcza o jeden poziom
// np. Flatten<string[][]> = string[]
// np. Flatten<string[]> = string[]  — już płaska, zostaje

type Flatten2<T> = T extends Array<Array<infer U>> ? U[] : T


// napisz typ DeepUnwrap<T> — rekurencyjnie rozpakowuje Promise
// np. DeepUnwrap<Promise<Promise<User>>> = User
// np. DeepUnwrap<Promise<User>> = User
// np. DeepUnwrap<User> = User


type DeepUnwrap<T> = T extends Promise< infer U>? DeepUnwrap<U>: T


// Z 11 —  💻💻💻
// Z 11 —  💻💻💻
// Z 11 —  💻💻💻
// Z 11 —  💻💻💻




// napisz typ Repository<T> który tworzy obiekt z metodami CRUD:
// - findById(id: number): Promise<T>
// - findAll(): Promise<T[]>
// - create(data: Omit<T, 'id'>): Promise<T>
// - update(id: number, data: Partial<Omit<T, 'id'>>): Promise<T>
// - delete(id: number): Promise<void>
// użyj go dla Order i napisz implementację orderRepository


type Repository<T>={
    findById(id:number): Promise<T>
    findAll(): Promise<T[]>
    create(data: Omit<T, 'id'>): Promise<T>
    update(id: number, data: Partial<Omit<T, 'id'>>): Promise<T>
    delete(id: number): Promise<void>
}


const orderRepository: Repository<Order> = {
    findById: async (id) => ({} as Order),
    findAll: async () => ([] as Order[]),
    create: async (data) => ({} as Order),
    update: async (id, data) => ({} as Order),
    delete: async (id) => {},
}



































