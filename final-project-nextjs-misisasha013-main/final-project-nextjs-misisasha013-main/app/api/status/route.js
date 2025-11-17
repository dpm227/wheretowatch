

export async function GET(request) {

    return new Response(JSON.stringify({status: 'up'}),{
        headers: {"Content-Type": "application/json"}
    })
}