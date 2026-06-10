// masz API które zwraca różne odpowiedzi
// napisz:
// 1. ApiResponse<T> — generyczny interfejs z data, status, message
// 2. Discriminated union ApiResult:
//    - success z data: User[]
//    - error z message: string i code: number
// 3. Funkcję handleResult która przyjmuje ApiResult
//    i zwraca string — przy success "Znaleziono X userów", przy error "Błąd X: message"
// 4. Typ UserResponse = ApiResponse z User[] jako T
// 5. Funkcję fetchUsers która zwraca Promise<ApiResponse<User[]>>
//    i wyciągnij jej typ przez ReturnType + Awaited


interface ApiResponse<T>{
    data:T
    status:number,
    message:string
}

type ApiResult=
    | {success:true, data:User[] }
    | {success: false, message:string, code:number}


function handleResult(result:ApiResult):string{
    if(result.success) return `znalezono ${result.data.length} userów`
    else return `blad ${result.code} ${result.message}`
}


type UserResponse = ApiResponse<User[]>


const data=[
    {
        id: 1,
        name: 'dsasdsad',
        email: 'sadsadsad',
        password: 'ddsad',
        role: 'admin'
    },
    {
        id: 2,
        name: 'dsasdsad',
        email: 'sadsadsad',
        password: 'ddsad',
        role: 'admin'
    }



]


type FetchUsersReturnType = Awaited<ReturnType<typeof fetchUsers>>

function fetchUsers():Promise<ApiResponse<User[]>>{
    return new Promise((resolve) => {
        resolve({
            data: data as User[],
            status: 200,
            message: 'success'
        });
    });
}