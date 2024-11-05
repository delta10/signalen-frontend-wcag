'use server'

import { AppConfig } from '@/types/config'
import path from 'path'
import { promises as fs } from 'fs'
import defaultConfiguration from '../../../config.json'

export async function getServerConfig() {
  const CONFIG_PATH = path.join(process.cwd(), 'config.json')

  let json: AppConfig = defaultConfiguration

  try {
    const fileBuffer = await fs.readFile(CONFIG_PATH, 'utf8')
    json = JSON.parse(fileBuffer.toString())
  } catch (e) {
    console.log('Could not load config file, using default configuration')
  }

  return json
}
