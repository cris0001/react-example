// Masz 3 rodzaje notyfikacji:
// - "email" → ma pole: to (string), subject (string), body (string)
// - "push"  → ma pole: deviceId (string), title (string), payload (unknown)
// - "sms"   → ma pole: phone (string), message (string)

// Napisz:
// 1. Discriminated union `Notification`
// 2. Funkcję `send(n: Notification): string` która zwraca:
//    - dla email: "Sending email to {to}"
//    - dla push:  "Pushing to device {deviceId}"
//    - dla sms:   "Texting {phone}"
//    TS ma pilnować że obsłużyłeś wszystkie przypadki (exhaustive check)


type Notificationn =
    | {type:'email', to:string, subject:string,body:string}
    | {type:'push', deviceId:string, title:string, payload:unknown}
    | {type: 'sms', phone:string, message:string}


function send(n:Notificationn ){

    switch(n.type){
        case 'email': return `Send eail to ${n.to}`
        case 'push': return `Pushing to device ${n.deviceId}`
        case 'sms': return `Texting ${n.phone}`
        default:
            const x:never = n
            return x
    }
}


// Napisz generic type Result<T> — discriminated union sukcesu i błędu
// Następnie wytypuj funkcję fetchUser(id: number) która zwraca Result<User>
// i obsłuż oba przypadki z exhaustive checkiem

type Userr = { id: number; name: string }
