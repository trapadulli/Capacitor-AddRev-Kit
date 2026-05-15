import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const envPath = path.join(rootDir, '.env')

dotenv.config({ path: envPath })

const iosInfoPlistPath = path.join(rootDir, 'ios', 'App', 'App', 'Info.plist')

function requireEnv (name) {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(`Missing required env var: ${name}`)
  }
  return value
}

function upsertPlistString (xml, key, value) {
  const escapedValue = value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')

  const blockRegex = new RegExp(
    `<key>${key}<\\/key>\\s*<string>[\\s\\S]*?<\\/string>`
  )
  if (blockRegex.test(xml)) {
    return xml.replace(
      blockRegex,
      `<key>${key}</key>\n\t<string>${escapedValue}</string>`
    )
  }

  return xml.replace(
    '</dict>',
    `\t<key>${key}</key>\n\t<string>${escapedValue}</string>\n</dict>`
  )
}

const revenueCatApiKey = requireEnv('IOS_REVENUECAT_API_KEY')
const admobAppId = requireEnv('IOS_ADMOB_APP_ID')

let plistXml = fs.readFileSync(iosInfoPlistPath, 'utf8')
plistXml = upsertPlistString(plistXml, 'RevenueCatAPIKey', revenueCatApiKey)
plistXml = upsertPlistString(plistXml, 'GADApplicationIdentifier', admobAppId)
fs.writeFileSync(iosInfoPlistPath, plistXml, 'utf8')

console.log('Applied env values to ios/App/App/Info.plist')
