import { NextResponse } from 'next/server'
import { promises as fs } from 'node:fs'
import path from 'path'

/* With this API route, we can get the JSON config at runtime by calling the /api/config endpoint */
export async function GET() {
  const CONFIG_PATH = path.join(process.cwd(), 'config.json')
  const fileBuffer = await fs.readFile(CONFIG_PATH, 'utf8')
  const json = JSON.parse(fileBuffer.toString())
  return NextResponse.json(json)
}
