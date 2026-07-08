import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  DEFAULT_CONVERSATION_WORKSPACE_ROOT,
  defaultConversationWorkspaceRoot,
  isConversationWorkspacePath,
  isInternalDeepSeekGuiWorkspace
} from './workspace-path'

describe('defaultConversationWorkspaceRoot', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('uses ~/Documents/Xiaoyuan on macOS', () => {
    vi.stubGlobal('window', { kunGui: { platform: 'darwin' } })
    expect(defaultConversationWorkspaceRoot()).toBe('~/Documents/Xiaoyuan')
  })

  it('uses ~/.local/share/Xiaoyuan/conversations on Linux', () => {
    vi.stubGlobal('window', { kunGui: { platform: 'linux' } })
    expect(defaultConversationWorkspaceRoot()).toBe('~/.local/share/Xiaoyuan/conversations')
  })

  it('falls back to ~/Documents/Xiaoyuan when platform is unknown', () => {
    vi.stubGlobal('window', { kunGui: { platform: '' } })
    expect(defaultConversationWorkspaceRoot()).toBe('~/Documents/Xiaoyuan')
  })

  it('DEFAULT_CONVERSATION_WORKSPACE_ROOT resolves at import time from the platform', () => {
    expect(typeof DEFAULT_CONVERSATION_WORKSPACE_ROOT).toBe('string')
    expect(DEFAULT_CONVERSATION_WORKSPACE_ROOT.length).toBeGreaterThan(0)
  })
})

describe('isInternalDeepSeekGuiWorkspace', () => {
  it('treats write and design workspaces as internal GUI workspaces', () => {
    expect(isInternalDeepSeekGuiWorkspace('/Users/alice/.xiaoyuan/write_workspace')).toBe(true)
    expect(isInternalDeepSeekGuiWorkspace('/Users/alice/.xiaoyuan/design-workspace')).toBe(true)
    expect(isInternalDeepSeekGuiWorkspace('/Users/alice/.kun/write_workspace')).toBe(true)
    expect(isInternalDeepSeekGuiWorkspace('/Users/alice/.kun/design-workspace')).toBe(true)
    expect(isInternalDeepSeekGuiWorkspace('~/.kun/design-workspace')).toBe(true)
    expect(isInternalDeepSeekGuiWorkspace('/Users/alice/projects/design-workspace')).toBe(false)
  })
})

describe('isConversationWorkspacePath', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('matches a path directly under the conversation root', () => {
    vi.stubGlobal('window', { kunGui: { platform: 'darwin', homeDir: '/Users/alice' } })
    expect(isConversationWorkspacePath('/Users/alice/Documents/Xiaoyuan/20260626-153012', '~/Documents/Xiaoyuan')).toBe(true)
  })

  it('matches the conversation root itself', () => {
    vi.stubGlobal('window', { kunGui: { platform: 'darwin', homeDir: '/Users/alice' } })
    expect(isConversationWorkspacePath('/Users/alice/Documents/Xiaoyuan', '~/Documents/Xiaoyuan')).toBe(true)
  })

  it('expands ~ in the candidate path', () => {
    vi.stubGlobal('window', { kunGui: { platform: 'darwin', homeDir: '/Users/alice' } })
    expect(isConversationWorkspacePath('~/Documents/Xiaoyuan/sub', '~/Documents/Xiaoyuan')).toBe(true)
  })

  it('does not match a sibling that merely shares a prefix segment', () => {
    // /Users/alice/Documents/Xiaoyuan-other 必须不被当成对话目录,否则会误伤真实项目。
    vi.stubGlobal('window', { kunGui: { platform: 'darwin', homeDir: '/Users/alice' } })
    expect(isConversationWorkspacePath('/Users/alice/Documents/Xiaoyuan-other', '~/Documents/Xiaoyuan')).toBe(false)
  })

  it('does not match a path outside the conversation root', () => {
    vi.stubGlobal('window', { kunGui: { platform: 'darwin', homeDir: '/Users/alice' } })
    expect(isConversationWorkspacePath('/Users/alice/projects/app', '~/Documents/Xiaoyuan')).toBe(false)
  })

  it('handles backslash separators (Windows)', () => {
    vi.stubGlobal('window', { kunGui: { platform: 'win32', homeDir: 'C:\\Users\\alice' } })
    expect(isConversationWorkspacePath('C:\\Users\\alice\\Documents\\Xiaoyuan\\20260626-153012', '~/Documents/Xiaoyuan')).toBe(true)
    expect(isConversationWorkspacePath('C:\\Users\\alice\\Documents\\Xiaoyuan-other', '~/Documents/Xiaoyuan')).toBe(false)
  })

  it('returns false for empty input', () => {
    vi.stubGlobal('window', { kunGui: { platform: 'darwin', homeDir: '/Users/alice' } })
    expect(isConversationWorkspacePath('', '~/Documents/Xiaoyuan')).toBe(false)
  })

  it('falls back to the platform default when no root is given', () => {
    vi.stubGlobal('window', { kunGui: { platform: 'linux', homeDir: '/home/alice' } })
    expect(
      isConversationWorkspacePath('/home/alice/.local/share/Xiaoyuan/conversations/20260626-153012')
    ).toBe(true)
  })
})
