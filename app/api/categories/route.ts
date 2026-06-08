import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const WP_URL = process.env.WP_URL

    if (!WP_URL) {
      return NextResponse.json(
        { error: 'WP_URL missing in env' },
        { status: 500 }
      )
    }

    const url = `${WP_URL}/wp-json/wp/v2/categories?per_page=100`

    const res = await fetch(url)

    const text = await res.text()

    console.log('RAW WP CATEGORIES:', text)

    let data
    try {
      data = JSON.parse(text)
    } catch {
      return NextResponse.json(
        { error: 'invalid JSON from WP', raw: text },
        { status: 500 }
      )
    }

    return NextResponse.json(data)

  } catch (err) {
    return NextResponse.json([])
  }
}