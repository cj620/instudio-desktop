// 站点全部文案集中在此,zh / en 结构保持一致,新增分区时两边同步增删。

export const content = {
  zh: {
    nav: { modes: '工作台', paradigm: '流程', models: '模型', download: '下载' },
    hero: {
      badge: '本地智能体电商工作台',
      titleTop: '电商运营提效的',
      titleBottom: '本地 AI 工作台',
      subtitle:
        '选品调研、采购询盘、商品上架、营销文案、平台监控——把电商日常交给本地 AI 智能体,一个应用里跑完,效率成倍提升。',
      ctaDownload: '免费下载',
      note: 'macOS · Windows · Linux ｜ 数据默认留在本机'
    },
    modes: {
      heading: '一个应用,两种工作台',
      sub: '把店铺数据交给「经营工作台」处理商品、采购与平台监控;也可以在「文案工作台」里批量产出商品详情、种草笔记和营销文案。',
      code: {
        tag: '经营工作台',
        title: '把 AI 智能体放进你的店铺',
        desc: '绑定本地店铺数据,读取表格、整理商品、批量处理采购询盘与平台上新监控,每一步操作和结果都清晰可见,改动可预览、可回退。',
        points: [
          '绑定本地目录,商品 / 采购 / 监控数据同处一处',
          '操作审批 · 权限模式 · 改动预览 · 结果可回退',
          '运营策略调整可提示重新规划,执行不脱节'
        ]
      },
      write: {
        tag: '文案工作台',
        title: '在同一个应用里写完所有文案',
        desc: '独立的写作工作区:商品详情、种草笔记、活动文案多视图编辑,选中文字即可让 AI 润色改写,一键导出多种格式。',
        points: [
          '商品文案文件树与多视图编辑',
          '选区触发的 AI 润色 / 改写 / 换风格',
          '导出多种文档格式'
        ]
      }
    },
    paradigm: {
      heading: '数据驱动的电商经营流程',
      sub: '不是把聊天框塞进表格,而是把「选品 → 询盘 → 上架 → 监控 → 复盘」串成一条连续、可控的工作流。',
      stages: [
        { stage: '选品调研', desc: '让 AI 调研类目趋势、竞品价格与卖点,整理成可对比的选品清单' },
        { stage: '采购询盘', desc: '生成询盘话术、比对供应商报价与起订量,整理可下单的采购清单' },
        { stage: '商品上架', desc: '根据卖点生成标题、卖点与详情结构,批量整理上架信息' },
        { stage: '营销文案', desc: '从商品片段生成详情页、种草笔记或活动海报文案' },
        { stage: '监控上新', desc: '持续监控主流电商平台的活动节奏与竞品上新,及时提醒跟进' },
        { stage: '数据复盘', desc: '结合销量、转化与计划状态,复盘并回到下一轮选品' }
      ]
    },
    models: {
      heading: '完整能力 + 极致性价比',
      sub: '电商日常要反复调用模型写文案、做图、做选品与监控。小元 默认围绕三家中国高性价比模型供应商组织,让全流程跑得起、用得久。',
      items: [
        { name: 'DeepSeek', role: '默认文本与推理主模型,支撑文案撰写、运营计划、数据分析与长上下文会话。' },
        { name: '小米 MiMo', role: '高性价比多模态与语音入口:长上下文文本、商品图理解、语音转写与 TTS。' },
        { name: 'MiniMax', role: '补齐完整媒体生成:商品文案、主图、配音、背景音乐与带货短视频生成。' }
      ],
      note: '仍可添加 OpenAI 兼容、自托管或其他自定义 Provider。'
    },
    why: {
      heading: '为什么选择 小元',
      items: [
        { want: '更高效的电商工作流', provide: '选品、采购、上架、文案、监控与复盘连成一条线' },
        { want: '完整能力又极致性价比', provide: 'DeepSeek、小米 MiMo、MiniMax 覆盖文本、推理、图片、语音、音乐、视频' },
        { want: '能动真实店铺数据的 AI', provide: '绑定本地工作区,读写表格、整理商品、批量处理采购询盘与平台监控' },
        { want: '让策略变成可执行计划', provide: '新建运营目标、生成计划、待办拆解、子对话与归档' },
        { want: '可控的每一步改动', provide: '操作审批、权限模式、改动预览、结果回退与复盘' },
        { want: '远程或后台触发', provide: '飞书 / 微信接入、本地 webhook / 中继,定时或一次性任务' }
      ]
    },
    download: {
      heading: '现在就开始',
      sub: '免费下载,数据默认留在本机。macOS 当前为未签名构建,首次打开需右键 →「打开」。',
      latest: '最新版本',
      detecting: '正在识别你的系统…',
      recommendedTitle: '为你的设备推荐',
      recommendBtn: '下载推荐版本',
      macIntelHint: '使用 Intel 芯片?下载 x64 版',
      otherTitle: '其他平台',
      downloadBtn: '下载',
      noBuild: '当前最新版本暂未提供你所在平台的安装包。',
      unsupported: '小元 是桌面应用,请在 Windows / macOS / Linux 电脑上打开本页下载。',
      loadError: '暂时无法获取最新版本信息。',
      note: '客户端跟随最新版本自动更新。',
      osNames: { windows: 'Windows', mac: 'macOS', linux: 'Linux' },
      platforms: [
        { key: 'macArm64', os: 'macOS', hint: 'Apple Silicon · .dmg' },
        { key: 'macX64', os: 'macOS', hint: 'Intel · .dmg' },
        { key: 'win', os: 'Windows', hint: 'x64 · .exe' },
        { key: 'linux', os: 'Linux', hint: 'x64 · .AppImage' }
      ],
      confirm: {
        title: '确认下载',
        body: '即将开始下载:',
        tip: '下载完成后,双击安装包即可安装。',
        confirm: '确认下载',
        cancel: '取消'
      }
    },
    footer: {
      tagline: '电商运营提效的本地 AI 工作台',
      stack: '基于本地 xiaoyuan runtime · Electron · React',
      colProduct: '产品',
      colResources: '资源',
      releases: '下载',
      license: '许可:PolyForm Noncommercial 1.0.0'
    }
  },

  en: {
    nav: { modes: 'Workspace', paradigm: 'Workflow', models: 'Models', download: 'Download' },
    hero: {
      badge: 'Local AI agent e-commerce workspace',
      titleTop: 'The local AI workspace',
      titleBottom: 'that powers your store',
      subtitle:
        'Sourcing research, supplier inquiries, listings, marketing copy, platform monitoring — hand your daily e-commerce work to local AI agents and get it all done in one app, far faster.',
      ctaDownload: 'Free download',
      note: 'macOS · Windows · Linux ｜ Your data stays on your machine'
    },
    modes: {
      heading: 'One app, two workspaces',
      sub: 'Hand store data to the Operations workspace for products, procurement, and platform monitoring — or batch-produce listings, seeding notes, and marketing copy in the Copywriting workspace.',
      code: {
        tag: 'Operations workspace',
        title: 'Put AI agents into your store',
        desc: 'Bind local store data: read spreadsheets, organize products, batch-handle supplier inquiries and new-arrival monitoring. Every action and result is transparent, and changes are previewable and reversible.',
        points: [
          'Bind a local folder — products / procurement / monitoring data in one place',
          'Action approvals · permission modes · change preview · reversible results',
          'Strategy changes can trigger replanning, so execution never drifts'
        ]
      },
      write: {
        tag: 'Copywriting workspace',
        title: 'Write all your copy in the same app',
        desc: 'A dedicated writing workspace: multi-view editing for listings, seeding notes, and campaign copy. Select text to let AI polish or rewrite, then export in one click.',
        points: [
          'Copy file tree with multi-view editing',
          'Selection-triggered AI polish / rewrite / restyle',
          'Export to multiple document formats'
        ]
      }
    },
    paradigm: {
      heading: 'A data-driven e-commerce workflow',
      sub: 'Not a chat box bolted onto a spreadsheet — but “sourcing → inquiry → listing → monitoring → review” connected into one continuous, controllable workflow.',
      stages: [
        { stage: 'Sourcing', desc: 'Let AI research category trends, competitor pricing, and selling points into a comparable shortlist' },
        { stage: 'Inquiry', desc: 'Generate inquiry scripts, compare supplier quotes and MOQs, and build an order-ready procurement list' },
        { stage: 'Listing', desc: 'Generate titles, selling points, and detail structure; batch-organize listing info' },
        { stage: 'Marketing copy', desc: 'Generate detail pages, seeding notes, or campaign poster copy from product snippets' },
        { stage: 'Monitoring', desc: 'Continuously watch campaigns and new arrivals across major e-commerce platforms and flag what to follow up on' },
        { stage: 'Review', desc: 'Combine sales, conversion, and plan state to review and feed the next sourcing round' }
      ]
    },
    models: {
      heading: 'Complete capability + extreme cost efficiency',
      sub: 'Daily e-commerce work calls models constantly for copy, images, sourcing, and monitoring. Xiaoyuan is organized around three cost-efficient Chinese providers so the whole loop stays affordable to run.',
      items: [
        { name: 'DeepSeek', role: 'Default text and reasoning provider — copywriting, operations planning, data analysis, and long-context sessions.' },
        { name: 'Xiaomi MiMo', role: 'Cost-efficient multimodal and speech entry: long-context text, product-image understanding, voice transcription, and TTS.' },
        { name: 'MiniMax', role: 'Full media generation: product copy, hero images, voiceover, background music, and short promo videos.' }
      ],
      note: 'You can still add OpenAI-compatible, self-hosted, or other custom providers.'
    },
    why: {
      heading: 'Why Xiaoyuan',
      items: [
        { want: 'A more efficient e-commerce workflow', provide: 'Sourcing, procurement, listing, copy, monitoring, and review in one line' },
        { want: 'Full capability at low cost', provide: 'DeepSeek, Xiaomi MiMo, and MiniMax for text, reasoning, image, speech, music, and video' },
        { want: 'AI that works on real store data', provide: 'Bind a local workspace, read/write spreadsheets, organize products, batch-handle supplier inquiries and platform monitoring' },
        { want: 'Strategy as executable plans', provide: 'New goals, generated plans, todo breakdown, side chats, and archiving' },
        { want: 'Every change under control', provide: 'Action approvals, permission modes, change preview, reversible results, and review' },
        { want: 'Remote or background triggers', provide: 'Feishu / WeChat, local webhook / relay, one-time or recurring tasks' }
      ]
    },
    download: {
      heading: 'Get started now',
      sub: 'Free download, data stays on your machine. macOS builds are currently unsigned — on first launch, right-click → “Open”.',
      latest: 'Latest',
      detecting: 'Detecting your system…',
      recommendedTitle: 'Recommended for your device',
      recommendBtn: 'Download recommended',
      macIntelHint: 'On an Intel Mac? Get the x64 build',
      otherTitle: 'Other platforms',
      downloadBtn: 'Download',
      noBuild: 'The latest release has no installer for your platform yet.',
      unsupported: 'Xiaoyuan is a desktop app — open this page on a Windows / macOS / Linux computer to download.',
      loadError: 'Could not fetch the latest release info right now.',
      note: 'The app auto-updates to the latest version.',
      osNames: { windows: 'Windows', mac: 'macOS', linux: 'Linux' },
      platforms: [
        { key: 'macArm64', os: 'macOS', hint: 'Apple Silicon · .dmg' },
        { key: 'macX64', os: 'macOS', hint: 'Intel · .dmg' },
        { key: 'win', os: 'Windows', hint: 'x64 · .exe' },
        { key: 'linux', os: 'Linux', hint: 'x64 · .AppImage' }
      ],
      confirm: {
        title: 'Confirm download',
        body: 'About to download:',
        tip: 'When the download finishes, double-click the installer to install.',
        confirm: 'Confirm',
        cancel: 'Cancel'
      }
    },
    footer: {
      tagline: 'The local AI workspace for e-commerce efficiency',
      stack: 'Powered by local xiaoyuan runtime · Electron · React',
      colProduct: 'Product',
      colResources: 'Resources',
      releases: 'Download',
      license: 'License: PolyForm Noncommercial 1.0.0'
    }
  }
}
