import PageHead from "/components/general/pageHead.js"

export default function layout({children}, props){
    return (
        <>
        <PageHead pageTitle={props.pageTitle}/>
        {children}
        </>
    )
}