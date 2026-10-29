import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const changedFilePath = process.argv[2]

if (!changedFilePath) {
  console.error('Geen bestands-pad ontvangen van watcher.')
  process.exit(1)
}

const fileName = path.basename(changedFilePath)
const organizationsDir = path.resolve('design-tokens/organizations')

const buildOrganization = (organization) => {
  const result = spawnSync(
    'npm',
    ['run', 'tokens:build:org', '--', organization],
    { stdio: 'inherit' }
  )

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

if (fileName === 'base.json' || fileName === 'overrides.json') {
  const organizations = fs
    .readdirSync(organizationsDir)
    .filter((entry) => entry.endsWith('.json'))
    .map((entry) => path.basename(entry, '.json'))

  console.log(
    `${fileName} gewijzigd, build voor alle organisaties: ${organizations.join(', ')}`
  )

  for (const organization of organizations) {
    buildOrganization(organization)
  }

  process.exit(0)
}

const orgMatch = fileName.match(/^(.+)\.json$/)
if (!orgMatch) {
  console.log(`Niet-org bestand gewijzigd (${fileName}), overgeslagen.`)
  process.exit(0)
}

const organization = orgMatch[1]
console.log(
  `Wijziging gedetecteerd in ${fileName}, build voor "${organization}"...`
)

buildOrganization(organization)
