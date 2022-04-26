export default function VideoCard(props){
    return (
        <div className="video" style={{background:`url(${props.video.thumbnail})`}}>
            <span className="video-title">{props.video.title}</span>
            <span className="video-description">{props.video.description}</span>
            <span className="video-channel">{props.video.channel}</span>
        </div>
    )
}