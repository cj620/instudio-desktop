'use strict'

const assert = require('node:assert/strict')
const {
  chmodSync,
  mkdtempSync,
  mkdirSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync
} = require('node:fs')
const { tmpdir } = require('node:os')
const { join, resolve } = require('node:path')
const test = require('node:test')
const {
  assertLinuxX64,
  createAppImageSmokeInvocation,
  resolveSingleLinuxAppImage,
  runAppImageSmoke
} = require('./smoke-packaged-extension-appimage.cjs')

function temporaryDist(t) {
  const root = mkdtempSync(join(tmpdir(), 'kun-appimage-smoke-test-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  return root
}

test('requires one exact final Linux x64 AppImage artifact', (t) => {
  const dist = temporaryDist(t)
  assert.throws(() => resolveSingleLinuxAppImage(dist), /exactly one/)

  const appImage = join(dist, 'Kun-1.2.3-dev-4-linux-x86_64.AppImage')
  writeFileSync(appImage, 'appimage')
  writeFileSync(join(dist, 'Kun-1.2.3-linux-arm64.AppImage'), 'wrong arch')
  mkdirSync(join(dist, 'Kun-9.9.9-linux-x86_64.AppImage'))
  if (process.platform !== 'win32') {
    symlinkSync(appImage, join(dist, 'Kun-8.8.8-linux-x86_64.AppImage'))
  }
  assert.equal(resolveSingleLinuxAppImage(dist), appImage)

  writeFileSync(join(dist, 'Kun-2.0.0-linux-x86_64.AppImage'), 'stale artifact')
  assert.throws(() => resolveSingleLinuxAppImage(dist), /found 2/)
})

test('builds a FUSE-free desktop invocation for the final AppImage', () => {
  const invocation = createAppImageSmokeInvocation({
    appImage: '/release/Kun-1.2.3-linux-x86_64.AppImage',
    resourcesDir: '/release/linux-unpacked/resources',
    desktopSmokePath: '/repo/scripts/smoke-packaged-extension-desktop.cjs',
    environment: {
      HOME: '/untrusted-home',
      ELECTRON_RUN_AS_NODE: '1'
    }
  })

  assert.equal(invocation.command, process.execPath)
  assert.deepEqual(invocation.args, [
    resolve('/repo/scripts/smoke-packaged-extension-desktop.cjs'),
    '--resources',
    resolve('/release/linux-unpacked/resources'),
    '--desktop-executable',
    resolve('/release/Kun-1.2.3-linux-x86_64.AppImage')
  ])
  assert.equal(invocation.env.APPIMAGE_EXTRACT_AND_RUN, '1')
  assert.equal(invocation.env.ELECTRON_RUN_AS_NODE, undefined)
  assert.equal(invocation.env.HOME, '/untrusted-home')
})

test('fails closed off native linux/x64 and propagates desktop smoke failure', (t) => {
  assert.doesNotThrow(() => assertLinuxX64('linux', 'x64'))
  assert.throws(() => assertLinuxX64('darwin', 'arm64'), /native linux\/x64/)
  assert.throws(() => assertLinuxX64('linux', 'arm64'), /native linux\/x64/)

  const dist = temporaryDist(t)
  const appImage = join(dist, 'Kun-1.2.3-linux-x86_64.AppImage')
  writeFileSync(appImage, 'appimage')
  chmodSync(appImage, 0o644)
  let invocation
  assert.throws(() => runAppImageSmoke({
    platform: 'linux',
    arch: 'x64',
    distDirectory: dist,
    spawnSyncCommand: (command, args, options) => {
      invocation = { command, args, options }
      return { status: 9, signal: null }
    }
  }), /exit 9/)
  assert.equal(invocation.options.env.APPIMAGE_EXTRACT_AND_RUN, '1')
  assert.equal(invocation.options.shell, false)
  assert.equal(statSync(appImage).mode & 0o111, 0o111)
})
