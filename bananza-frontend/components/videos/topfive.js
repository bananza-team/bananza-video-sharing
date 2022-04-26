import VideoCard from "./videocard.js"
export default function TopFive(props){
    return (
        <>
        {
        props.videos.map((video, key) => (
           <VideoCard video={video} key={key}/>
        ))
        }
        </>
    );
}