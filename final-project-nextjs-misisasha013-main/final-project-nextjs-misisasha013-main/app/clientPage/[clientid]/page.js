"use client"

import { useParams } from "next/navigation"
import { useSearchParams } from 'next/navigation'


export default function Client() {

    const params = useParams()
    // this needs to match the exact folder name
    const clientID = params.clientid

    const searchParams = useSearchParams()
    // this needs to match the exact key value in the search
    const a = searchParams.get('a')

    return (
        <div>
            <h1>Client Dynamic Page</h1>
            <p>This page is dynamic passed on the passed URL</p>
            <p>This clientID ({clientID}) will change based on what is passed after client</p>
            <p>If you entered a search param a, it would show up here: {a}</p>
        </div>
    )
}