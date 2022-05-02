export default function Form({children}, {eventHandler}){
    return (
        <form onSubmit={eventHandler}>{children}</form>
    )
}