import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { WorkspaceFilePreviewPanel } from './WorkspaceFilePreviewPanel'

describe('WorkspaceFilePreviewPanel toolbar', () => {
  it('keeps reading as an icon control and omits the code-to-design action', () => {
    const html = renderToStaticMarkup(createElement(WorkspaceFilePreviewPanel, {
      target: { path: 'package.json' },
      workspaceRoot: '/workspace',
      onClose: () => {}
    }))

    expect(html).toContain('data-reading-mode="false"')
    expect(html).toContain('lucide-maximize-2')
    expect(html).not.toContain('lucide-palette')
    expect(html).not.toContain('kun-issue781-expand-button')
  })
})
