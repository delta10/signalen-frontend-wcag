'use server'

import { AppConfig } from '@/types/config'
import path from 'path'
import { promises as fs } from 'fs'

export async function getServerConfig() {
  const CONFIG_PATH = path.join(process.cwd(), 'config.json')
  const fileBuffer = await fs.readFile(CONFIG_PATH, 'utf8')
  const json: AppConfig = JSON.parse(fileBuffer.toString())
  return json
}
