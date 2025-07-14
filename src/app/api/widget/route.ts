import { NextResponse } from 'next/server'

export function GET(request: Request) {
    const origin = request.headers.get("origin")

    const widget = {
        pubkey: "596fb51101e2071ad2f13b07335af3a1b26f38b32c02cae23e610c1e8ca750de",
        widget: {
            title: "Gomeru 🔐⚡",
            appUrl: "https://goomeru.netlify.app",
            iconUrl: "https://goomeru.netlify.app/gomeru-logo.png",
            imageUrl: "https://goomeru.netlify.app/gomeru-logo.png",
            buttonTitle: "Launch Widget",
            tags: [
                "tool",
                "utility",
                "nostr"
            ]
        }
    }

    const res = NextResponse.json(widget)
    res.headers.set("Access-Control-Allow-Origin", "https://yakihonne.coem")
    res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS")
    res.headers.set("Access-Control-Allow-Headers", "Content-Type")
    return res
}

export function OPTIONS() {
    const res = new Response(null, {
        status: 200,
    })
    res.headers.set("Access-Control-Allow-Origin", "https://yakihonne.coem")
    res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS")
    res.headers.set("Access-Control-Allow-Headers", "Content-Type")
    return res
}
