#!/usr/bin/env node

'use strict'

const { spawnSync } = require('node:child_process')
const { chmodSync, readdirSync, statSync } = require('node:fs')
const { join, resolve } = require('node:path')

const APPIMAGE_FILE_PATTERN = /^Kun-[0-9A-Za-z][0-9A-Za-z._-]*-linux-x86_64\.AppImage$/

function assertLinuxX64(platform = process.platform, arch = process.arch) {
  if (platform !== 'linux' || arch !== 'x64') {
    throw new Error(
      `The final AppImage smoke requires a native linux/x64 runner, got ${platform}/${arch}`
    )
  }
}

function resolveSingleLinuxAppImage(distDirectory = resolve('dist')) {
  const candidates = readdirSync(distDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && APPIMAGE_FILE_PATTERN.test(entry.name))
    .map((entry) => join(distDirectory, entry.name))
    .sort()

  if (candidates.length !== 1) {
    throw new Error(
      `Expected exactly one final Linux x64 AppImage in ${distDirectory}, ` +
      `found ${candidates.length}${candidates.length ? `: ${candidates.join(', ')}` : ''}`
    )
  }
  return candidates[0]
}

function createAppImageSmokeInvocation({
  appImage,
  resourcesDir = resolve('dist/linux-unpacked/resources'),
  desktopSmokePath = join(__dirname, 'smoke-packaged-extension-desktop.cjs'),
  environment = process.env
}) {
  const env = {
    ...environment,
    // Avoid a FUSE dependency on hosted runners while still executing the
    // final AppImage runtime and its embedded application.
    APPIMAGE_EXTRACT_AND_RUN: '1'
  }
  delete env.ELECTRON_RUN_AS_NODE

  return {
    command: process.execPath,
    args: [
      resolve(desktopSmokePath),
      '--resources',
      resolve(resourcesDir),
      '--desktop-executable',
      resolve(appImage)
    ],
    env
  }
}

function runAppImageSmoke(options = {}) {
  assertLinuxX64(options.platform, options.arch)
  const appImage = resolveSingleLinuxAppImage(options.distDirectory)
  const mode = statSync(appImage).mode
  chmodSync(appImage, mode | 0o111)
  if ((statSync(appImage).mode & 0o111) !== 0o111) {
    throw new Error(`Final Linux AppImage is not executable after chmod: ${appImage}`)
  }

  const invocation = createAppImageSmokeInvocation({
    appImage,
    resourcesDir: options.resourcesDir,
    desktopSmokePath: options.desktopSmokePath,
    environment: options.environment
  })
  const result = (options.spawnSyncCommand ?? spawnSync)(
    invocation.command,
    invocation.args,
    {
      env: invocation.env,
      shell: false,
      stdio: 'inherit',
      windowsHide: true
    }
  )
  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(
      `Final Linux AppImage Extension desktop smoke failed` +
      `${result.signal ? ` (${result.signal})` : ` (exit ${String(result.status)})`}`
    )
  }
  return appImage
}

module.exports = {
  APPIMAGE_FILE_PATTERN,
  assertLinuxX64,
  createAppImageSmokeInvocation,
  resolveSingleLinuxAppImage,
  runAppImageSmoke
}

if (require.main === module) {
  try {
    const appImage = runAppImageSmoke()
    process.stdout.write(`Final Linux AppImage Extension desktop smoke OK: ${appImage}\n`)
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`)
    process.exitCode = 1
  }
}
