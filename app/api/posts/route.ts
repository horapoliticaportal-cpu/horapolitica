import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const WP_URL = process.env.WP_URL

    if (!WP_URL) {
      return NextResponse.json(
        { error: 'WP_URL missing in env' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')

    let url = `${WP_URL}/wp-json/wp/v2/posts?per_page=20&_embed`
    if (category) url += `&categories=${category}`

    const res = await fetch(url)
    const text = await res.text()

    let data
    try {
      data = JSON.parse(text)
    } catch {
      return NextResponse.json(
        { error: 'WP did not return JSON', raw: text },
        { status: 500 }
      )
    }

    return NextResponse.json(data)

  } catch (err) {
    return NextResponse.json(
      { error: 'server error', detail: String(err) },
      { status: 500 }
    )
  }
}