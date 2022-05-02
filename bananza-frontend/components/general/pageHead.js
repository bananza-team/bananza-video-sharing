import Head from 'next/head'

export default function PageHead(props){
    return (
        <Head>
            <title>{props.pageTitle || "Bananza"}</title>
            <meta name="description" content="Bananza - a video sharing platform"></meta>
            <link rel="icon" href="/favicon.ico"/>
        </Head>
    )
}