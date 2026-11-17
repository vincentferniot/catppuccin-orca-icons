// Which names and extensions get an icon.
//
// Orca caps an icon theme at 512 mappings (default slots + every name or extension key).
// Upstream catppuccin/vscode-icons has about 2,600, so we keep the most common ones here.
// Each entry must exist in upstream's maps; the build fails otherwise.
//
// How Orca matches (see README): a file name first, then its extensions from the longest
// (`test.ts` in `foo.test.ts`) to the shortest (`ts`). A dotfile like `.env` also matches
// the extension `env`.

/** Folder names. Each one costs 2 mappings (collapsed and expanded). */
export const folders: string[] = [
  // source layout
  'src', 'source', 'lib', 'libs', 'app', 'apps', 'packages', 'core', 'shared',
  'components', 'hooks', 'utils', 'types', '@types', 'plugins', 'middleware',
  'controllers', 'routes', 'views', 'layouts', 'server', 'api', 'client', 'scripts',
  // assets
  'public', 'assets', 'images', 'img', 'icons', 'fonts', 'styles', 'css', 'locales', 'i18n',
  // quality
  'test', 'tests', '__tests__', 'spec', '__mocks__', 'mocks', 'coverage',
  // build and docs
  'dist', 'build', 'out', 'docs', 'doc', 'examples', 'templates', 'config', 'temp', 'tmp',
  // tooling
  'node_modules', 'database', 'db', 'docker', 'kubernetes', 'k8s', 'workflows',
  '.git', '.github', '.gitlab', '.vscode', '.idea', '.husky', '.devcontainer', '.cursor', '.storybook',
]

/** Exact file names (matched case-insensitively). */
export const fileNames: string[] = [
  // node and js tooling
  'package.json', 'package-lock.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', 'yarn.lock',
  '.yarnrc.yml', 'bun.lock', 'bun.lockb', '.npmrc', '.npmignore', 'tsconfig.json', 'jsconfig.json',
  'deno.json', 'deno.lock', 'turbo.json', 'nx.json', 'lerna.json', 'biome.json',
  '.prettierrc', '.prettierrc.json', 'prettier.config.js', '.prettierignore',
  '.eslintrc', '.eslintrc.json', '.eslintrc.js', '.eslintrc.cjs', 'eslint.config.js',
  'eslint.config.mjs', 'eslint.config.ts', '.eslintignore', '.stylelintrc', '.browserslistrc',
  '.babelrc', 'babel.config.js', 'commitlint.config.js', '.commitlintrc.json', '.lintstagedrc',
  'vite.config.ts', 'vite.config.js', 'vitest.config.ts', 'jest.config.js', 'jest.config.ts',
  'playwright.config.ts', 'cypress.config.ts', 'webpack.config.js', 'rollup.config.js',
  'tailwind.config.js', 'tailwind.config.ts', 'postcss.config.js', 'next.config.js',
  'next.config.mjs', 'next.config.ts', 'nuxt.config.ts', 'svelte.config.js', 'astro.config.mjs',
  // git and repo meta
  '.gitignore', '.gitattributes', '.gitmodules', '.gitkeep', '.editorconfig',
  'readme.md', 'readme', 'license', 'license.md', 'changelog.md', 'contributing.md',
  'code_of_conduct.md', 'codeowners', 'security.md', 'renovate.json', '.pre-commit-config.yaml',
  // containers, build, infra
  'dockerfile', 'docker-compose.yml', 'docker-compose.yaml', 'compose.yml', 'compose.yaml',
  'makefile', 'justfile', 'taskfile.yml', 'cmakelists.txt', 'flake.nix',
  'flake.lock', 'netlify.toml', 'vercel.json', 'wrangler.toml',
  // other ecosystems
  'cargo.toml', 'cargo.lock', 'go.mod', 'go.sum', 'gemfile', 'gemfile.lock', 'requirements.txt',
  'pyproject.toml', 'poetry.lock', 'uv.lock', 'gradlew',
  // misc
  '.envrc', 'favicon.ico', 'robots.txt', '.ds_store', '.vscodeignore', '.cursorignore',
]

/** File extensions, without the leading dot. */
export const fileExtensions: string[] = [
  // js / ts
  'js', 'mjs', 'cjs', 'jsx', 'ts', 'mts', 'cts', 'tsx', 'd.ts', 'js.map',
  'test.ts', 'spec.ts', 'test.tsx', 'spec.tsx', 'test.js', 'spec.js', 'test.jsx', 'spec.jsx',
  'vue', 'svelte', 'astro', 'marko', 'mdx',
  // web
  'html', 'htm', 'css', 'scss', 'sass', 'less', 'css.map', 'ejs', 'hbs',
  'pug', 'njk', 'liquid', 'twig', 'wasm', 'wat', 'graphql', 'gql', 'http',
  // data and config
  'json', 'jsonc', 'json5', 'yaml', 'yml', 'toml', 'xml', 'xsd', 'xsl', 'csv', 'tsv', 'ini',
  'cfg', 'conf', 'properties', 'env', 'kdl', 'cue', 'dhall', 'proto', 'avsc', 'lock', 'plist',
  'sql', 'sqlite', 'db', 'prisma',
  // docs
  'md', 'markdown', 'txt', 'rst', 'adoc', 'org', 'tex', 'bib', 'typ', 'pdf', 'doc', 'docx',
  'xls', 'xlsx', 'ppt', 'pptx', 'log', 'diff', 'patch', 'ipynb', 'mmd', 'puml', 'drawio',
  // shells and scripting
  'sh', 'bash', 'zsh', 'fish', 'ps1', 'psm1', 'bat', 'cmd', 'ahk', 'vim', 'lua', 'luau',
  'pl', 'pm', 'rb', 'erb', 'php', 'py', 'pyi', 'pyc', 'r', 'rmd', 'jl',
  // systems
  'c', 'h', 'cpp', 'cc', 'cxx', 'hpp', 'hh', 'hxx', 'cu', 'rs', 'go', 'zig', 'nim', 'odin',
  'v', 'd', 'asm', 's', 'f90', 'cob', 'ha', 'cs', 'csx', 'fs', 'fsx', 'vb', 'xaml', 'csproj',
  'sln', 'swift', 'm', 'java', 'class', 'jar', 'kt', 'kts', 'scala', 'sc', 'groovy',
  'gradle', 'clj', 'cljs', 'edn', 'dart', 'ex', 'exs', 'heex', 'erl', 'gleam', 'hs',
  'elm', 'ml', 'mli', 're', 'res', 'rkt', 'scm', 'lisp', 'el', 'sol', 'vala', 'hx',
  'pro', 'mat', 'nix', 'sv', 'vhd', 'cmake', 'mk', 'ninja', 'bzl',
  // infra
  'tf', 'tfvars', 'hcl', 'bicep', 'dockerfile', 'nginx', 'pp',
  // shaders and game
  'glsl', 'hlsl', 'wgsl', 'shader', 'gd', 'tscn', 'unity',
  // security
  'pem', 'crt', 'cer', 'key', 'pub', 'gpg', 'asc',
  // media
  'svg', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'avif', 'ico', 'bmp', 'tiff', 'heic',
  'psd', 'ai', 'fig', 'sketch', 'xd',
  'mp3', 'wav', 'flac', 'ogg', 'm4a', 'aac', 'mid', 'midi',
  'mp4', 'mov', 'mkv', 'webm', 'avi',
  'ttf', 'otf', 'woff', 'woff2', 'eot',
  'obj', 'fbx', 'glb', 'gltf', 'stl',
  // archives and binaries
  'zip', 'tar', 'gz', 'tgz', 'bz2', 'xz', '7z', 'rar', 'zst', 'exe',
  'bin', 'apk',
  // misc
  'gitlab-ci.yml', 'dockerignore', 'url', 'todo', 'tape', 'sublime-project', 'code-workspace',
]
