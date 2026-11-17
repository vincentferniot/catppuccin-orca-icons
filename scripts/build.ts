// Builds the Orca icon themes from catppuccin/vscode-icons.
// Downloads upstream at UPSTREAM_COMMIT into a cache outside the repo (Orca counts every file in
// the plugin folder, and upstream alone has over 3,000), then writes themes/<flavor>.json and
// icons/<flavor>/*.svg. Run with `npm run build`.

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync, copyFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { fileExtensions, fileNames, folders } from './selection.ts'

/** catppuccin/vscode-icons commit to build from. Bump it to update the icons. */
const UPSTREAM_COMMIT = 'b6915da9f6889b683a110aa747de96c2820a537d'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

type FileIcons = Record<string, { fileExtensions?: string[], fileNames?: string[] }>
type FolderIcons = Record<string, { folderNames?: string[] }>

/** Returns the folder holding upstream at UPSTREAM_COMMIT, downloading it on first use. */
async function fetchUpstream(): Promise<string> {
  const cacheRoot = join(process.env.XDG_CACHE_HOME ?? join(homedir(), '.cache'), 'catppuccin-orca-icons')
  const dir = join(cacheRoot, `vscode-icons-${UPSTREAM_COMMIT}`)
  if (existsSync(join(dir, 'icons'))) return dir

  const url = `https://codeload.github.com/catppuccin/vscode-icons/tar.gz/${UPSTREAM_COMMIT}`
  console.log(`downloading ${url}`)
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`)
  const tmp = `${dir}.tmp`
  rmSync(tmp, { recursive: true, force: true })
  mkdirSync(tmp, { recursive: true })
  const archive = join(tmp, 'upstream.tar.gz')
  writeFileSync(archive, Buffer.from(await response.arrayBuffer()))
  execFileSync('tar', ['-xzf', archive, '-C', tmp, '--strip-components=1'])
  rmSync(archive)
  renameSync(tmp, dir)
  return dir
}

// Only Latte (light) and Mocha (dark), like Orca's own Catppuccin theme: each flavor ships its own
// copy of every SVG, and four flavors (1,340 files) held the plugin for review in Orca's directory.
export const FLAVORS = ['latte', 'mocha'] as const

// Orca's limits (shared/plugins/artifacts/plugin-icon-theme-artifact.js).
const MAX_MAPPINGS = 512
const MAX_SVG_BYTES = 64 * 1024

// Keys upstream maps only by VS Code language id (which Orca does not have), or not at all.
// `avsc` and `lock` follow catppuccin/zed-icons.
const ICON_OVERRIDES: Record<string, string> = {
  'avsc': 'json',
  'lock': 'lock',
  'diff': 'diff',
  'flake.nix': 'nix',
  'pyi': 'python',
  'hcl': 'terraform',
  'edn': 'clojure',
  'el': 'lisp',
}

/** Upstream key ("name" or "extension") -> icon basename. Later entries win, like upstream. */
function indexUpstream(fileIcons: FileIcons, folderIcons: FolderIcons) {
  const byName = new Map<string, string>()
  const byExtension = new Map<string, string>()
  for (const [icon, { fileNames = [], fileExtensions = [] }] of Object.entries(fileIcons)) {
    for (const name of fileNames) byName.set(name.toLowerCase(), icon)
    for (const ext of fileExtensions) byExtension.set(ext.toLowerCase(), icon)
  }
  const byFolder = new Map<string, string>()
  for (const [icon, { folderNames = [] }] of Object.entries(folderIcons)) {
    for (const name of folderNames) byFolder.set(name.toLowerCase(), icon)
  }
  return { byName, byExtension, byFolder }
}

function resolve(list: string[], index: Map<string, string>, label: string, missing: string[]) {
  const out = new Map<string, string>()
  for (const raw of list) {
    const key = raw.toLowerCase()
    if (out.has(key)) throw new Error(`duplicate ${label}: ${raw}`)
    const icon = ICON_OVERRIDES[key] ?? index.get(key)
    if (!icon) missing.push(`${label} ${raw}`)
    else out.set(key, icon)
  }
  return out
}

async function main() {
  const upstreamDir = await fetchUpstream()
  const defaults = join(upstreamDir, 'src/defaults')
  const { fileIcons } = await import(pathToFileURL(join(defaults, 'fileIcons.ts')).href)
  const { folderIcons } = await import(pathToFileURL(join(defaults, 'folderIcons.ts')).href)
  const upstreamIcons = join(upstreamDir, 'icons')
  const upstream = indexUpstream(fileIcons, folderIcons)
  const missing: string[] = []
  const names = resolve(fileNames, upstream.byName, 'file name', missing)
  const extensions = resolve(fileExtensions, upstream.byExtension, 'extension', missing)
  const folderMap = resolve(folders, upstream.byFolder, 'folder', missing)
  if (missing.length > 0) {
    throw new Error(`not in catppuccin/vscode-icons:\n  ${missing.join('\n  ')}`)
  }

  const mappings = 3 + names.size + extensions.size + folderMap.size * 2
  if (mappings > MAX_MAPPINGS) {
    throw new Error(`${mappings} mappings, Orca allows ${MAX_MAPPINGS}. Trim scripts/selection.ts.`)
  }

  for (const flavor of FLAVORS) {
    const iconDir = join(ROOT, 'icons', flavor)
    rmSync(iconDir, { recursive: true, force: true })
    mkdirSync(iconDir, { recursive: true })

    const used = new Set<string>()
    const ref = (basename: string) => {
      used.add(basename)
      return `icons/${flavor}/${basename}.svg`
    }
    const mapOf = (entries: Map<string, string>, toIcon: (icon: string) => string) =>
      Object.fromEntries([...entries].sort(([a], [b]) => a.localeCompare(b)).map(([k, icon]) => [k, ref(toIcon(icon))]))

    const theme = {
      schemaVersion: 1,
      icons: {
        'file': ref('_file'),
        'folder': ref('_folder'),
        'folder-open': ref('_folder_open'),
      },
      fileNames: mapOf(names, icon => icon),
      fileExtensions: mapOf(extensions, icon => icon),
      folderNames: mapOf(folderMap, icon => `folder_${icon}`),
      folderNamesExpanded: mapOf(folderMap, icon => `folder_${icon}_open`),
    }

    for (const basename of used) {
      const src = join(upstreamIcons, flavor, `${basename}.svg`)
      if (!existsSync(src)) throw new Error(`missing upstream SVG: ${src}`)
      const size = readFileSync(src).byteLength
      if (size > MAX_SVG_BYTES) throw new Error(`${src} is ${size} bytes, Orca allows ${MAX_SVG_BYTES}`)
      copyFileSync(src, join(iconDir, `${basename}.svg`))
    }

    mkdirSync(join(ROOT, 'themes'), { recursive: true })
    writeFileSync(join(ROOT, 'themes', `${flavor}.json`), `${JSON.stringify(theme, null, 2)}\n`)
    console.log(`${flavor}: ${mappings} mappings, ${used.size} SVGs`)
  }
}

await main()
