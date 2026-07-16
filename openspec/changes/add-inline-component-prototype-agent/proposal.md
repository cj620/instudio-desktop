## Why

Kun can delegate general work to child agents and Design mode can preview HTML artifacts, but a Code conversation cannot ask a dedicated design child agent to produce one interactive UI component and experience that result inside the answer flow. Users currently have to leave the conversation for a separate canvas or browser even when they only want to compare or refine one component interaction.

## What Changes

- Add a first-party `component-designer` child-agent profile specialized in accessible, responsive, component-scoped HTML interaction prototypes.
- Add a top-level `design_component` tool that accepts the requested interaction, optional existing implementation text, and optional source-file paths, then invokes the dedicated child agent with a bounded output contract.
- Persist each standalone prototype under `.kun-design/component-prototypes/` and return durable structured metadata through the normal tool-result/SSE history path.
- Harden generated prototypes with workspace containment, size and structure validation, and an offline Content Security Policy.
- Render running and completed component prototypes as interactive cards in the middle of the existing conversation timeline rather than opening a separate canvas.
- Add desktop/mobile preview controls plus adopt, iterate, inspect-code, copy-code, and refresh actions that remain inside the conversation workflow.

## Capabilities

### New Capabilities

- `component-design-subagent-tool`: A bounded Kun tool that packages component-design context, delegates to a dedicated child agent, and returns a durable HTML prototype artifact contract.
- `inline-component-prototype-message`: A safe, interactive conversation message card for component-level HTML prototypes and follow-up actions.

### Modified Capabilities

None.

## Impact

- Kun built-in subagent profiles, delegation-backed tool providers, runtime composition, and tool-result tests.
- Renderer Kun mapping, turn-section derivation, message timeline rendering, and a new inline prototype card.
- Existing main/preload prototype authorization and isolated webview paths are reused; no second runtime, provider, or standalone canvas is added.
- Prototype files are workspace-local design artifacts and remain portable with existing `.kun-design` handling.
