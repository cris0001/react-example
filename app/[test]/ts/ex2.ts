import {useRef, useState} from "react";

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
}

// Zadanie 1 — mapped types:
//     Napisz typ FormState<T> który tworzy stan formularza:
//     values — wszystkie pola jako string
//     errors — wszystkie pola jako string | undefined
//     touched — wszystkie pola jako boolean

type FormState<T> = {
    values: { [K in keyof T]: string };
    errors: { [K in keyof T]: string | undefined };
    touched: { [K in keyof T]: boolean };
}

// Zadanie 2 — discriminated union + infer:
// Napisz typ ApiState<T> z wariantami idle, loading, success, error i funkcję handleState która zwraca string dla każdego wariantu.



type ApiState<T> =
    | { variant: 'idle' }
    | { variant: 'loading'; message: string }
    | { variant: 'success'; data: T }
    | { variant: 'error'; message: string }


function handleState(x:ApiState<User[]>){
 switch(x.variant){
     case'idle':
         return 'idle xd'
     case 'loading':
         return 'Ładowanie...';
     case 'success':
         return `Załadowano ${x.data.length} userów`;
     case 'error':
         return `Błąd  ${x.message}`;
     default:
         const def: never = x;
         return def;
 }
}


// Napisz komponent UserList który:
//
//     Przyjmuje propsy: users: User[], onDelete: (id: number) => void, isLoading?: boolean
// Używa useState dla selectedId: number | null
// Używa useRef dla HTMLUListElement
// Ma handler onSelect który przyjmuje React.MouseEvent<HTMLLIElement>
// Gdy isLoading — zwraca <p>Ładowanie...</p>
// Gdy brak userów — zwraca <p>Brak userów</p>

interface Props{
    users: User[],
    onDelete: (id: number) => void,
    isLoading?:boolean
}


const UserList = ({users,onDelete,isLoading}:Props)=>{

    const[selectedId, setSelectedId] = useState<number|null>(null)
    const ref= useRef<HTMLUListElement>
    const onSelect=(e:React.MouseEvent<HTMLLIElement> )=>{
        console.log('zzz')
    }

    if(isLoading) return <p>Ładowanie...</p>
    if(users.length<1) return <p>Brak userów</p>

}