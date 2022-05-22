export default function Suspend(props){
    
    let buttonStyle = {
        backgroundColor:"#1f1f1f",
        marginRight:"10px",
    }

    let suspend = ()=>{
        let id = props.user.id;
    }

    return (
        <button onClick={suspend} style={buttonStyle}>Suspend</button>
    )
}