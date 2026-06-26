// 站点全部文案集中在此,zh / en 结构保持一致,新增分区时两边同步增删。
const GITHUB = 'https://github.com/cj620/instudio-desktop'

export const LINKS = {
  github: GITHUB,
  releases: `${GITHUB}/releases/latest`,
  allReleases: `${GITHUB}/releases`,
  docs: `${GITHUB}#readme`
}

export const content = {
  zh: {
    nav: { modes: '模式', paradigm: '范式', models: '模型', download: '下载' },
    hero: {
      badge: '本地智能体桌面工作台',
      titleTop: '探索需求先行的',
      titleBottom: '下一代 coding 范式',
      subtitle:
        '用 DeepSeek、小米 MiMo、MiniMax 的高性价比组合,把需求澄清、设计稿、计划和 Agent 编码串成完整闭环。',
      ctaDownload: '免费下载',
      ctaGithub: '在 GitHub 查看',
      note: 'macOS · Windows · Linux ｜ 数据默认留在本机'
    },
    modes: {
      heading: '一个应用,两种模式',
      sub: '把本地目录交给它处理代码、需求、计划和变更审查;也可以在独立的 Write 工作区里写作、润色和导出文档。',
      code: {
        tag: 'Code 模式',
        title: '把 AI Agent 真正放进项目',
        desc: '绑定本地工作区,读写文件、搜索代码、执行命令,工具调用与结果一目了然,变更走内联 diff 和审查面板。',
        points: [
          '绑定本地目录,代码 / 需求 / 计划同处一处',
          '工具审批 · 权限模式 · 内联 diff · 变更审查',
          '需求变更可提示重规划,计划不与需求脱节'
        ]
      },
      write: {
        tag: 'Write 模式',
        title: '同一个应用里完成写作',
        desc: '独立的 Markdown 写作工作区:文件树、Live / Source / Split / Preview 多视图,选区内联 Agent 操作,一键导出多种格式。',
        points: [
          'Markdown 文件树与多视图编辑',
          '选区触发的内联 Agent 润色 / 改写',
          '导出多种文档格式'
        ]
      }
    },
    paradigm: {
      heading: '需求先行的 coding 范式',
      sub: '不是把聊天框贴到 IDE 上,而是把「需求 → 设计 → 计划 → 编码 → 验证」串成一条连续的 GUI 工作流。',
      stages: [
        { stage: '澄清需求', desc: '在 GUI 新建需求草稿,让需求 AI 补问题、做实现前调研、整理边界' },
        { stage: '沉淀文档', desc: '保存为结构化需求块,带验收标准与需求历史' },
        { stage: '生成设计', desc: '从需求片段生成 UI 设计稿、信息图或交互式 HTML 原型' },
        { stage: '形成计划', desc: '用 /plan 生成 GUI 管理的实施计划,并与需求关联' },
        { stage: 'Agent 编码', desc: '计划进入 Todo、文件编辑、命令执行与变更审查' },
        { stage: '回到验收', desc: '结合需求块、验收标准、计划状态与 /review,落回最初的需求' }
      ]
    },
    models: {
      heading: '完整能力 + 极致性价比',
      sub: '需求先行的流程更长、更依赖反复调用模型。小元 默认围绕三家中国高性价比模型供应商组织,让完整流程跑得起、用得久。',
      items: [
        { name: 'DeepSeek', role: '默认文本与推理主模型,支撑代码、计划、审查、长上下文会话与自动模型路由。' },
        { name: '小米 MiMo', role: '高性价比多模态与语音入口:长上下文文本、视觉输入、ASR 语音转写、TTS 与 Token Plan。' },
        { name: 'MiniMax', role: '补齐完整媒体生成:文本、图片、语音、音乐、视频生成与 Token Plan。' }
      ],
      note: '仍可添加 OpenAI 兼容、自托管或其他自定义 Provider。'
    },
    why: {
      heading: '为什么选择 小元',
      items: [
        { want: '下一代 coding 工作流', provide: '需求澄清、文档、设计稿、实施计划、Agent 编码与验证连成一条线' },
        { want: '完整能力又极致性价比', provide: 'DeepSeek、小米 MiMo、MiniMax 覆盖文本、推理、视觉、语音、图像、音乐、视频' },
        { want: '能动真实项目的 AI', provide: '绑定本地工作区,读写文件、搜索代码、执行命令,审查工具调用与结果' },
        { want: '让需求变成可执行计划', provide: '新建需求、/plan、Todo、/goal、子对话、线程压缩、分叉与归档' },
        { want: '可控的变更', provide: '工具审批、权限模式、内联 diff、变更审查面板与 /review' },
        { want: '远程或后台触发', provide: '飞书 / Lark / 微信接入、本地 webhook / 中继,定时或一次性任务' }
      ]
    },
    download: {
      heading: '现在就开始',
      sub: '免费下载,数据默认留在本机。macOS 当前为未签名构建,首次打开需右键 →「打开」。',
      platforms: [
        { os: 'macOS', hint: 'Apple Silicon / Intel · .dmg' },
        { os: 'Windows', hint: 'x64 · .exe 安装包' },
        { os: 'Linux', hint: 'x64 · .AppImage' }
      ],
      cta: '前往下载页',
      note: '所有安装包发布在 GitHub Releases,客户端跟随最新版本自动更新。'
    },
    footer: {
      tagline: '需求先行的下一代 coding 工作台',
      stack: '基于本地 kun runtime · Electron · React',
      colProduct: '产品',
      colResources: '资源',
      docs: '文档',
      releases: '下载',
      license: '许可:PolyForm Noncommercial 1.0.0'
    }
  },

  en: {
    nav: { modes: 'Modes', paradigm: 'Paradigm', models: 'Models', download: 'Download' },
    hero: {
      badge: 'Local AI agent desktop workbench',
      titleTop: 'Requirement-first coding',
      titleBottom: 'for the next paradigm',
      subtitle:
        'Use DeepSeek, Xiaomi MiMo, and MiniMax to connect requirement clarification, design drafts, plans, and agent coding into one complete loop.',
      ctaDownload: 'Free download',
      ctaGithub: 'View on GitHub',
      note: 'macOS · Windows · Linux ｜ Your data stays on your machine'
    },
    modes: {
      heading: 'One app, two modes',
      sub: 'Hand it a local folder for code, requirements, plans, and change review — or use the dedicated Write workspace for long-form writing, editing, and export.',
      code: {
        tag: 'Code mode',
        title: 'Put the AI agent into real projects',
        desc: 'Bind a local workspace: read/write files, search code, run commands. Tool calls and results are transparent, and changes flow through inline diffs and a review panel.',
        points: [
          'Bind a local folder — code / requirements / plans in one place',
          'Tool approvals · permission modes · inline diff · change review',
          'Requirement changes can surface replanning, so plans never drift'
        ]
      },
      write: {
        tag: 'Write mode',
        title: 'Do your writing in the same app',
        desc: 'A dedicated Markdown workspace: file tree, Live / Source / Split / Preview views, selection-based inline agent actions, and one-click export.',
        points: [
          'Markdown file tree with multi-view editing',
          'Selection-triggered inline agent polish / rewrite',
          'Export to multiple document formats'
        ]
      }
    },
    paradigm: {
      heading: 'Requirement-first coding',
      sub: 'Not a chat box bolted onto an IDE — but “requirement → design → plan → code → verify” connected into one continuous GUI workflow.',
      stages: [
        { stage: 'Clarify', desc: 'Create requirement drafts in the GUI; let Requirement AI find gaps, research options, and shape boundaries' },
        { stage: 'Document', desc: 'Save as structured requirement blocks with acceptance criteria and history' },
        { stage: 'Design', desc: 'Generate UI design drafts, infographics, or interactive HTML prototypes from requirements' },
        { stage: 'Plan', desc: 'Use /plan to produce GUI-owned implementation plans linked back to requirements' },
        { stage: 'Agent coding', desc: 'Move from plan into todos, file edits, command execution, and change review' },
        { stage: 'Verify', desc: 'Bring requirement blocks, acceptance criteria, plan state, and /review back to the original requirement' }
      ]
    },
    models: {
      heading: 'Complete capability + extreme cost efficiency',
      sub: 'A requirement-first workflow is longer and leans on repeated model calls. Xiaoyuan is organized around three cost-efficient Chinese providers so the full loop stays affordable to run.',
      items: [
        { name: 'DeepSeek', role: 'Default text and reasoning provider — coding, planning, review, long-context sessions, and auto model routing.' },
        { name: 'Xiaomi MiMo', role: 'Cost-efficient multimodal and speech entry: long-context text, vision input, ASR, TTS, and Token Plan.' },
        { name: 'MiniMax', role: 'Full media generation: text, image, speech, music, and video generation, plus Token Plan.' }
      ],
      note: 'You can still add OpenAI-compatible, self-hosted, or other custom providers.'
    },
    why: {
      heading: 'Why Xiaoyuan',
      items: [
        { want: 'A next-generation coding workflow', provide: 'Clarification, documents, design drafts, plans, agent coding, and verification in one line' },
        { want: 'Full capability at low cost', provide: 'DeepSeek, Xiaomi MiMo, and MiniMax for text, reasoning, vision, speech, image, music, and video' },
        { want: 'AI that works on real projects', provide: 'Bind a local workspace, read/write files, search code, run commands, inspect tool calls' },
        { want: 'Requirements as executable plans', provide: 'New requirements, /plan, todos, /goal, side chats, compaction, forking, and archiving' },
        { want: 'Controlled changes', provide: 'Tool approvals, permission modes, inline diffs, a change-review panel, and /review' },
        { want: 'Remote or background triggers', provide: 'Feishu / Lark / WeChat, local webhook / relay, one-time or recurring tasks' }
      ]
    },
    download: {
      heading: 'Get started now',
      sub: 'Free download, data stays on your machine. macOS builds are currently unsigned — on first launch, right-click → “Open”.',
      platforms: [
        { os: 'macOS', hint: 'Apple Silicon / Intel · .dmg' },
        { os: 'Windows', hint: 'x64 · .exe installer' },
        { os: 'Linux', hint: 'x64 · .AppImage' }
      ],
      cta: 'Go to downloads',
      note: 'All installers ship on GitHub Releases; the app auto-updates to the latest version.'
    },
    footer: {
      tagline: 'Requirement-first coding for the next paradigm',
      stack: 'Powered by local kun runtime · Electron · React',
      colProduct: 'Product',
      colResources: 'Resources',
      docs: 'Docs',
      releases: 'Download',
      license: 'License: PolyForm Noncommercial 1.0.0'
    }
  }
}
