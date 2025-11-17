

export default async function Page({params}) {
    const { serverID } = await params
    return <div>Server ID: {serverID}</div>

}