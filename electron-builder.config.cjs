const { existsSync, readFileSync } = require('node:fs')
const { join } = require('node:path')
const {
  configureElectronNativeBuildEnvironment
} = require('./scripts/electron-native-build-env.cjs')

// 品牌升级后构建环境变量改用 KUN_* 前缀;旧的 DEEPSEEK_GUI_* 仍然
// 兼容读取,避免 CI / 本地发布脚本一刀切失效。
function envWithLegacyFallback(kunName, legacyName) {
  const value = process.env[kunName]
  if (value !== undefined && value !== '') return value
  return process.env[legacyName]
}

function loadLocalReleaseEnv() {
  const candidates = [
    envWithLegacyFallback('KUN_RELEASE_ENV', 'DEEPSEEK_GUI_RELEASE_ENV'),
    join(__dirname, 'scripts', 'release.local.env'),
    join(__dirname, 'release.local.env')
  ].filter(Boolean)

  for (const candidate of candidates) {
    if (!existsSync(candidate)) continue
    for (const rawLine of readFileSync(candidate, 'utf8').split(/\r?\n/)) {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) continue
      const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
      if (!match) continue
      let value = match[2].trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      if (!process.env[match[1]]) process.env[match[1]] = value
    }
    break
  }
}

loadLocalReleaseEnv()
configureElectronNativeBuildEnvironment(process.platform, process.env)

const hasExplicitMacSigningIdentity = Boolean(
  process.env.CSC_LINK ||
    process.env.CSC_NAME ||
    process.env.CSC_KEY_PASSWORD ||
    process.env.MAC_SIGN === '1'
)

const hasNotaryToolCredentials = Boolean(
  process.env.APPLE_API_KEY_ID &&
    process.env.APPLE_API_ISSUER &&
    (process.env.APPLE_API_KEY || process.env.APPLE_API_KEY_BASE64)
)

// 自动更新指向当前仓库(本 fork)的 GitHub Releases。electron-builder 会
// 生成 latest.yml / latest-mac.yml / latest-linux.yml 并在发布时上传到该
// 仓库的 Release;客户端用 electron-updater 的 github provider 直接读取。
// owner/repo 可用环境变量覆盖,默认取当前仓库 cj620/instudio-desktop。
const githubOwner = (process.env.XIAOYUAN_GITHUB_OWNER || 'cj620').trim()
const githubRepo = (process.env.XIAOYUAN_GITHUB_REPO || 'instudio-desktop').trim()
const updateChannel = normalizeUpdateChannel(
  envWithLegacyFallback('KUN_UPDATE_CHANNEL', 'DEEPSEEK_GUI_UPDATE_CHANNEL') || 'stable'
)
const releaseAppVersion = (
  envWithLegacyFallback('KUN_APP_VERSION', 'DEEPSEEK_GUI_APP_VERSION') || ''
).trim()
const releaseArtifactVersion = (
  envWithLegacyFallback('KUN_ARTIFACT_VERSION', 'DEEPSEEK_GUI_ARTIFACT_VERSION') || ''
).trim()
const artifactVersion = releaseArtifactVersion || releaseAppVersion || '${version}'
const semverVersionPattern = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/
const artifactVersionPattern = /^[0-9A-Za-z][0-9A-Za-z._-]*$/

function normalizeUpdateChannel(raw) {
  const value = String(raw || '').trim()
  if (value === 'stable' || value === 'frontier') return value
  throw new Error(`KUN_UPDATE_CHANNEL (or legacy DEEPSEEK_GUI_UPDATE_CHANNEL) must be "stable" or "frontier", got: ${raw}`)
}

if (releaseAppVersion && !semverVersionPattern.test(releaseAppVersion)) {
  throw new Error(
    `KUN_APP_VERSION (or legacy DEEPSEEK_GUI_APP_VERSION) must be a valid semver for electron-updater, got: ${releaseAppVersion}`
  )
}

if (releaseArtifactVersion && !artifactVersionPattern.test(releaseArtifactVersion)) {
  throw new Error(
    `KUN_ARTIFACT_VERSION (or legacy DEEPSEEK_GUI_ARTIFACT_VERSION) must use only letters, numbers, dots, dashes, and underscores, got: ${releaseArtifactVersion}`
  )
}

module.exports = {
  // 小元 是全新产品、无需兼容上游存量用户,因此使用自己的 appId。
  // 这个 id 必须和 src/main/index.ts 的 APP_USER_MODEL_ID 保持一致:
  //  - macOS:bundle identifier,TCC 权限 / 通知授权都挂在它上面;
  //  - Windows:NSIS 以 appId 派生卸载 GUID、通知与任务栏分组也用它。
  // 一旦正式发布就不要再改,否则老用户升级会装出两份应用、权限丢失。
  appId: 'com.instudio.xiaoyuan',
  productName: '小元',
  asar: true,
  asarUnpack: [
    '**/kun/dist/**/*',
    '**/kun/package*.json',
    '**/kun/node_modules/**/*',
    '**/packages/extension-api/**/*',
    '**/packages/create-kun-extension/**/*',
    '**/node_modules/better-sqlite3/**/*',
    '**/node_modules/node-pty/**/*',
    '**/node_modules/bindings/**/*',
    '**/node_modules/file-uri-to-path/**/*',
    // Computer-use native automation (@computer-use/nut-js + its libnut
    // binding + node-mac-permissions) ships prebuilt .node files that must
    // live outside the asar archive to load.
    '**/node_modules/@computer-use/**/*',
    // OCR fallback loads native canvas bindings plus Tesseract worker/core
    // wasm and language data by filesystem path at runtime.
    '**/node_modules/@napi-rs/canvas*/**/*',
    // UI Plugin image validation uses Sharp's native binding and its separately
    // packaged libvips runtime; both must remain outside app.asar.
    '**/node_modules/sharp/**/*',
    '**/node_modules/@img/**/*',
    '**/node_modules/tesseract.js/**/*',
    '**/node_modules/tesseract.js-core/**/*',
    '**/node_modules/@tesseract.js-data/**/*',
    '**/node_modules/bmp-js/**/*',
    '**/node_modules/idb-keyval/**/*',
    '**/node_modules/is-url/**/*',
    '**/node_modules/node-fetch/**/*',
    '**/node_modules/whatwg-url/**/*',
    '**/node_modules/tr46/**/*',
    '**/node_modules/webidl-conversions/**/*',
    '**/node_modules/regenerator-runtime/**/*',
    '**/node_modules/wasm-feature-detect/**/*',
    '**/node_modules/zlibjs/**/*'
  ],
  npmRebuild: true,
  directories: {
    output: envWithLegacyFallback('KUN_DIST_DIR', 'DEEPSEEK_GUI_DIST_DIR') || 'dist'
  },
  files: [
    'out/**/*',
    'package.json',
    'kun/dist/**/*',
    'kun/package.json',
    'kun/package-lock.json',
    'kun/node_modules/**/*',
    'packages/extension-api/package.json',
    'packages/extension-api/dist/**/*',
    'packages/extension-api/schema/**/*',
    'packages/extension-api/fixtures/**/*',
    'packages/create-kun-extension/package.json',
    'packages/create-kun-extension/src/**/*',
    // The Agent SDK ships a ~222MB per-platform Claude Code binary as an optional
    // dep; do NOT bundle it into the installer. It's downloaded on demand into the
    // user-data dir (see src/main/agent-sdk-installer.ts). The small SDK JS stays.
    '!kun/node_modules/@anthropic-ai/claude-agent-sdk-*/**',
    '!**/*.map',
    '!**/*.d.ts',
    '!**/*.ts',
    '!**/tsconfig*.json',
    '!**/README*',
    '!**/CHANGELOG*',
    'packages/create-kun-extension/templates/**/*'
    // node_modules/openclaw (the vendor/openclaw-shim file: dep) must ship:
    // the WeChat bridge imports @tencent-weixin/openclaw-weixin/dist at
    // runtime to send media, and that chain resolves openclaw/plugin-sdk/*.
  ],
  extraResources: [
    {
      from: 'resources/bundled-extensions',
      to: 'bundled-extensions',
      filter: ['catalog.json', '*.kunx']
    },
    {
      from: 'resources/whisper',
      to: 'whisper',
      filter: ['**/*']
    }
  ],
  // 产物文件名保持 ASCII（Xiaoyuan），避免中文文件名在 electron-updater
  // 下载 / GitHub Release 资源 URL 编码时出现兼容问题；用户可见的应用名
  // 仍是「小元」（productName / 快捷方式 / 卸载项）。
  artifactName: `Xiaoyuan-${artifactVersion}-\${os}-\${arch}.\${ext}`,
  publish: [
    {
      provider: 'github',
      owner: githubOwner,
      repo: githubRepo,
      releaseType: updateChannel === 'frontier' ? 'prerelease' : 'release'
    }
  ],
  beforePack: './scripts/before-pack.cjs',
  afterPack: './scripts/after-pack.cjs',
  afterSign: './scripts/mac-notarize.cjs',
  mac: {
    category: 'public.app-category.developer-tools',
    identity: hasExplicitMacSigningIdentity ? undefined : null,
    // We notarize in scripts/mac-notarize.cjs so APPLE_API_KEY_BASE64 can be supported.
    notarize: false,
    hardenedRuntime: hasExplicitMacSigningIdentity,
    forceCodeSigning: hasExplicitMacSigningIdentity,
    timestamp: hasExplicitMacSigningIdentity ? 'http://timestamp.apple.com/ts01' : null,
    gatekeeperAssess: false,
    entitlements: 'build/entitlements.mac.plist',
    entitlementsInherit: 'build/entitlements.mac.inherit.plist',
    extendInfo: {
      // 语音输入：渲染进程通过 getUserMedia 录音做语音转文字。
      NSMicrophoneUsageDescription: '小元需要使用麦克风进行语音转文字输入。'
    },
    // macOS 不会自动套圆角遮罩,图标文件本身需要是「圆角方块 + 透明边距」
    icon: './src/asset/img/kun_mac.png',
    // arm64 (Apple Silicon) + x64 (Intel). On M 系列 Mac 本地打包会各出一组 dmg/zip。
    target: [
      { target: 'dmg', arch: ['arm64', 'x64'] },
      { target: 'zip', arch: ['arm64', 'x64'] }
    ]
  },
  dmg: {
    sign: hasExplicitMacSigningIdentity
  },
  win: {
    // Windows does not mask app icons for us; use the rounded asset so
    // desktop/start-menu/taskbar shortcuts do not show a hard square edge.
    // Ship a multi-size .ico (16/24/32/48/64/72/96/128/256) so Explorer and
    // the desktop render crisp icons at small sizes (#222). Regenerate with:
    // npx --yes png2icons src/asset/img/kun_mac.png build/icon -icowe -bc
    icon: './build/icon.ico',
    target: [{ target: 'nsis', arch: ['x64'] }]
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    perMachine: false,
    allowElevation: true,
    selectPerMachineByDefault: false,
    include: 'build/installer.nsh',
    // 明确创建快捷方式；always 在覆盖安装时也会重建（即使用户曾删掉桌面图标）
    createDesktopShortcut: 'always',
    createStartMenuShortcut: true,
    shortcutName: '小元',
    uninstallDisplayName: '小元',
    deleteAppDataOnUninstall: false
  },
  linux: {
    category: 'Development',
    icon: './src/asset/img/kun.png',
    target: [{ target: 'AppImage', arch: ['x64'] }]
  },
  // Override electron-builder's sandbox-disabling default desktop argument.
  // Linux uses user namespaces and seccomp; only the legacy SUID helper is disabled.
  appImage: {
    executableArgs: ['--disable-setuid-sandbox', '--no-first-run']
  },
  extraMetadata: {
    ...(releaseAppVersion ? { version: releaseAppVersion } : {}),
    updateChannel,
    buildHints: {
      macSigningEnabled: hasExplicitMacSigningIdentity,
      notarizationEnabled: hasNotaryToolCredentials
    }
  }
}
