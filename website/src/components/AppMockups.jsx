// 纯前端仿真桌面端 UI,替代上游录屏 GIF。整窗占满容器宽度、多面板布局,贴近真实应用。
// 配色与图标严格对齐桌面端真实暗色主题:
//   主题 src/renderer/src/styles/base-shell.css [data-theme='dark'](夜间深海)
//   图标 lucide-react,与 app 内 Sidebar / FloatingComposer / WriteInlineAgent 同款
import {
  Code2,
  Pencil,
  Plus,
  FileQuestion,
  LayoutGrid,
  Clock3,
  Search,
  Folder,
  FolderOpen,
  Focus,
  Smartphone,
  Settings,
  MessageCircleMore,
  GitBranch,
  Mic,
  Send,
  ChevronDown,
  ChevronRight,
  SearchCode,
  FileText,
  BarChart3,
  Check,
  Loader2,
  ListTodo,
  Square,
  Eye,
  Sparkles,
  Pilcrow,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  List,
  Quote,
  Wand2,
  Lightbulb,
  ImageIcon
} from 'lucide-react'
import logo from '../assets/logo.png'

// 桌面端真实暗色色板(夜间深海)
const C = {
  app: '#0f1422',
  bar: '#121829',
  canvas: '#161d30',
  canvas2: '#131a2b',
  border: 'rgba(151,192,235,0.13)',
  borderSoft: 'rgba(151,192,235,0.07)',
  card: '#1b2338',
  cardElevated: '#212b44',
  cardBorder: 'rgba(151,192,235,0.12)',
  text: '#f0f5fc',
  text2: '#bdc9de',
  text3: '#8593b1',
  placeholder: '#76839e',
  accent: '#6fb0e8',
  onAccent: '#0f1422',
  active: 'rgba(111,176,232,0.18)',
  chip: 'rgba(151,192,235,0.10)',
  toggleBg: 'rgba(0,0,0,0.28)',
  hover: 'rgba(151,192,235,0.08)',
  userBubble: 'rgba(133,193,241,0.16)',
  green: '#40c977',
  greenSoft: 'rgba(64,201,119,0.15)',
  red: '#f8736a',
  redSoft: 'rgba(248,115,106,0.15)',
  skill: '#a89bf5',
  selection: 'rgba(111,176,232,0.26)'
}

function WindowFrame({ title, children }) {
  return (
    <div className="relative">
      {/* 背后柔光,呼应真实截图的桌面壁纸氛围 */}
      <div
        aria-hidden
        className="absolute -inset-x-10 -top-10 bottom-0 -z-10 rounded-[2.5rem] bg-gradient-to-b from-brand/20 via-indigo-500/10 to-transparent blur-3xl"
      />
      <div
        className="overflow-hidden rounded-xl border border-white/10 shadow-2xl shadow-black/70 ring-1 ring-black/40 sm:rounded-2xl"
        style={{ background: C.app }}
      >
        {/* 标题栏 */}
        <div
          className="flex items-center gap-2 border-b px-4 py-2.5"
          style={{ background: C.bar, borderColor: C.border }}
        >
          <span className="h-3 w-3 rounded-full" style={{ background: '#ff5f57' }} />
          <span className="h-3 w-3 rounded-full" style={{ background: '#febc2e' }} />
          <span className="h-3 w-3 rounded-full" style={{ background: '#28c840' }} />
          <span className="mx-auto text-[12px] font-medium" style={{ color: C.text3 }}>
            {title}
          </span>
          <MessageCircleMore size={14} style={{ color: C.text3 }} />
          <LayoutGrid size={14} style={{ color: C.text3 }} />
        </div>
        {children}
      </div>
    </div>
  )
}

function Icon({ as: I, size = 14, color = C.text3, stroke = 1.9, className }) {
  return <I size={size} strokeWidth={stroke} style={{ color }} className={className} />
}

/* ════════════ 经营工作台:Agent 对话 + 计划面板 ════════════ */

function SideItem({ as: I, label, highlight }) {
  return (
    <div className="flex items-center gap-2.5 rounded-md px-2 py-1.5" style={{ color: C.text2 }}>
      <Icon as={I} size={15} color={highlight ? C.accent : C.text3} />
      <span className="truncate text-[12.5px]">{label}</span>
    </div>
  )
}

function ToolCard({ as: I, label, arg, running }) {
  return (
    <div
      className="flex w-fit max-w-full items-center gap-2 rounded-lg border px-3 py-2"
      style={{ background: C.card, borderColor: C.cardBorder }}
    >
      <Icon as={I} size={14} color={C.accent} />
      <span className="text-[12px] font-medium" style={{ color: C.text2 }}>
        {label}
      </span>
      <span
        className="truncate rounded px-1.5 py-0.5 font-mono text-[11px]"
        style={{ background: C.chip, color: C.text3 }}
      >
        {arg}
      </span>
      {running ? (
        <Loader2 size={13} strokeWidth={2.2} className="animate-spin" style={{ color: C.accent }} />
      ) : (
        <Check size={14} strokeWidth={2.6} style={{ color: C.green }} />
      )}
    </div>
  )
}

function TodoItem({ label, state }) {
  const done = state === 'done'
  const active = state === 'active'
  return (
    <div
      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2"
      style={active ? { background: C.active } : undefined}
    >
      {done ? (
        <Check size={15} strokeWidth={2.6} style={{ color: C.green }} />
      ) : active ? (
        <Loader2 size={15} strokeWidth={2.2} className="animate-spin" style={{ color: C.accent }} />
      ) : (
        <Square size={15} strokeWidth={2} style={{ color: C.text3 }} />
      )}
      <span
        className="truncate text-[12.5px]"
        style={{
          color: done ? C.text3 : active ? C.text : C.text2,
          textDecoration: done ? 'line-through' : 'none',
          fontWeight: active ? 600 : 400
        }}
      >
        {label}
      </span>
    </div>
  )
}

export function OperationsMock() {
  return (
    <WindowFrame title="小元 — 经营工作台">
      <div className="flex h-[440px] text-left sm:h-[500px] lg:h-[564px]">
        {/* 会话侧栏 */}
        <aside
          className="hidden w-[196px] shrink-0 flex-col border-r p-2.5 md:flex"
          style={{ background: C.bar, borderColor: C.border }}
        >
          <div className="mb-2.5 flex gap-1 rounded-lg p-0.5" style={{ background: C.toggleBg }}>
            <div
              className="flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-[12px] font-semibold"
              style={{ background: C.cardElevated, color: C.text }}
            >
              <Code2 size={13} strokeWidth={2} style={{ color: C.accent }} /> Code
            </div>
            <div
              className="flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-[12px]"
              style={{ color: C.text3 }}
            >
              <Pencil size={13} strokeWidth={2} /> 写作
            </div>
          </div>

          <SideItem as={Plus} label="新建会话" highlight />
          <SideItem as={FileQuestion} label="新建需求" />
          <SideItem as={LayoutGrid} label="插件" />
          <SideItem as={Clock3} label="定时任务" />

          <div className="my-2.5 h-px" style={{ background: C.border }} />

          <div
            className="mb-2 flex items-center gap-2 rounded-md border px-2.5 py-1.5"
            style={{ borderColor: C.border, background: C.hover }}
          >
            <Search size={13} strokeWidth={2} style={{ color: C.text3 }} />
            <span className="text-[11.5px]" style={{ color: C.placeholder }}>
              搜索会话
            </span>
          </div>
          <div className="flex items-center gap-2 px-1.5 py-1">
            <Folder size={13} strokeWidth={2} style={{ color: C.text3 }} />
            <span className="text-[12px] font-medium" style={{ color: C.text2 }}>
              default
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2 rounded-md px-2.5 py-2" style={{ background: C.active }}>
            <MessageCircleMore size={13} strokeWidth={2} style={{ color: C.accent }} />
            <span className="truncate text-[12.5px] font-semibold" style={{ color: C.text }}>
              蓝牙耳机 · 选品
            </span>
          </div>
          {['Q2 采购询盘', '竞品上新监控'].map((s) => (
            <div key={s} className="flex items-center gap-2 px-2.5 py-2">
              <MessageCircleMore size={13} strokeWidth={2} style={{ color: C.text3 }} />
              <span className="truncate text-[12.5px]" style={{ color: C.text2 }}>
                {s}
              </span>
            </div>
          ))}

          <div className="flex-1" />

          <div className="my-2 h-px" style={{ background: C.border }} />
          <div className="flex items-center gap-2 px-1.5">
            <img src={logo} alt="" className="h-6 w-6 rounded-md" />
            <span className="flex items-center gap-1 text-[11px]" style={{ color: C.text2 }}>
              <Focus size={12} strokeWidth={2} /> 专注
            </span>
            <span
              className="ml-auto flex h-4 w-7 items-center rounded-full px-0.5"
              style={{ background: 'rgba(151,192,235,0.18)' }}
            >
              <span className="h-3 w-3 rounded-full" style={{ background: '#aebbd2' }} />
            </span>
          </div>
          <div className="mt-2 flex items-center gap-3.5 px-1.5 text-[11px]" style={{ color: C.text3 }}>
            <span className="flex items-center gap-1">
              <Smartphone size={12} strokeWidth={2} /> 连接手机
            </span>
            <span className="flex items-center gap-1">
              <Settings size={12} strokeWidth={2} /> 设置
            </span>
          </div>
        </aside>

        {/* 对话主区 */}
        <div className="flex min-w-0 flex-1 flex-col" style={{ background: C.canvas }}>
          <div
            className="flex items-center gap-2.5 border-b px-4 py-2.5 text-[12px]"
            style={{ borderColor: C.borderSoft }}
          >
            <span className="font-semibold" style={{ color: C.text }}>
              蓝牙耳机 · 选品
            </span>
            <span style={{ color: C.text3 }}>·</span>
            <span style={{ color: C.accent, fontWeight: 600 }}>Agent</span>
            <span style={{ color: C.text3 }}>概览</span>
            <span style={{ color: C.text3 }}>模型</span>
          </div>

          <div className="flex-1 space-y-2.5 overflow-hidden p-4">
            <div
              className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-[12.5px] leading-relaxed"
              style={{ background: C.userBubble, color: C.text }}
            >
              调研蓝牙耳机类目近 30 天竞品价格和卖点,给出定价建议
            </div>

            <div className="flex items-start gap-2.5">
              <img src={logo} alt="" className="mt-0.5 h-6 w-6 shrink-0 rounded-md" />
              <div className="min-w-0 space-y-2.5">
                <ToolCard as={SearchCode} label="搜索网络" arg="蓝牙耳机 热销榜 价格" />
                <ToolCard as={FileText} label="读取" arg="competitors.csv" />
                <ToolCard as={BarChart3} label="分析价格分布" arg="12 款竞品" running />
                <p className="text-[12.5px] leading-relaxed" style={{ color: C.text }}>
                  对比 <b>12</b> 款竞品,均价 <b>¥149</b>,卖点集中在「降噪 / 续航 / 低延迟」。建议切入{' '}
                  <span style={{ color: C.accent, fontWeight: 600 }}>¥99–129</span> 价位,并补强续航卖点。
                </p>

                <div className="overflow-hidden rounded-xl border" style={{ background: C.card, borderColor: C.cardBorder }}>
                  <div
                    className="flex items-center gap-2 border-b px-3 py-2 text-[11px]"
                    style={{ borderColor: C.borderSoft }}
                  >
                    <FileText size={12} strokeWidth={2} style={{ color: C.text3 }} />
                    <span className="font-mono" style={{ color: C.text2 }}>
                      listing/蓝牙耳机.md
                    </span>
                    <span className="ml-auto" style={{ color: C.text3 }}>
                      变更审查
                    </span>
                  </div>
                  <div className="font-mono text-[11px] leading-6">
                    <div className="px-3" style={{ background: C.redSoft, color: C.red }}>
                      - 标题:蓝牙耳机
                    </div>
                    <div className="px-3" style={{ background: C.greenSoft, color: C.green }}>
                      + 标题:主动降噪蓝牙耳机 40h 续航
                    </div>
                    <div className="px-3" style={{ background: C.greenSoft, color: C.green }}>
                      + 卖点:游戏低延迟 · 入耳检测 · 双设备连接
                    </div>
                  </div>
                  <div
                    className="flex items-center justify-end gap-2 border-t px-2.5 py-2"
                    style={{ borderColor: C.borderSoft }}
                  >
                    <span
                      className="rounded-md px-2.5 py-1 text-[11px] font-medium"
                      style={{ color: C.text2, background: C.chip }}
                    >
                      拒绝
                    </span>
                    <span
                      className="flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold"
                      style={{ background: C.green, color: C.onAccent }}
                    >
                      <Check size={12} strokeWidth={2.6} /> 接受
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3">
            <div
              className="rounded-xl border px-3 pb-2 pt-2.5"
              style={{ background: C.card, borderColor: C.border, boxShadow: '0 6px 18px rgba(0,0,0,0.3)' }}
            >
              <p className="px-0.5 text-[12.5px]" style={{ color: C.placeholder }}>
                向智能体提问…
              </p>
              <div className="mt-2 flex items-center gap-2.5">
                <Plus size={17} strokeWidth={2} style={{ color: C.text3 }} />
                <span className="flex items-center gap-1 text-[11px]" style={{ color: C.text3 }}>
                  <GitBranch size={13} strokeWidth={2} /> main
                </span>
                <div className="ml-auto flex items-center gap-2.5">
                  <span
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium"
                    style={{ background: C.chip, color: C.text2 }}
                  >
                    deepseek-v4-pro <ChevronDown size={12} strokeWidth={2} />
                  </span>
                  <Mic size={16} strokeWidth={2} style={{ color: C.text3 }} />
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{ background: C.accent, color: C.onAccent }}
                  >
                    <Send size={15} strokeWidth={2.2} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧:采购计划 Todo */}
        <aside
          className="hidden w-[244px] shrink-0 flex-col border-l p-3 lg:flex"
          style={{ background: C.bar, borderColor: C.border }}
        >
          <div className="flex items-center gap-2 px-1">
            <ListTodo size={15} strokeWidth={2} style={{ color: C.accent }} />
            <span className="text-[12.5px] font-semibold" style={{ color: C.text }}>
              采购计划
            </span>
            <span
              className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={{ background: C.active, color: C.accent }}
            >
              进行中
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 px-1">
            <span className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: C.chip }}>
              <span className="block h-full w-2/5 rounded-full" style={{ background: C.accent }} />
            </span>
            <span className="text-[10.5px]" style={{ color: C.text3 }}>
              2/5
            </span>
          </div>

          <div className="mt-2 space-y-0.5">
            <TodoItem label="选品调研" state="done" />
            <TodoItem label="竞品比价" state="done" />
            <TodoItem label="整理采购清单" state="active" />
            <TodoItem label="生成商品文案" state="todo" />
            <TodoItem label="提交供应商询盘" state="todo" />
          </div>

          <div className="my-3 h-px" style={{ background: C.border }} />
          <div className="rounded-xl border p-3" style={{ background: C.card, borderColor: C.cardBorder }}>
            <div className="flex items-center gap-1.5">
              <FileQuestion size={13} strokeWidth={2} style={{ color: C.skill }} />
              <span className="text-[11.5px] font-semibold" style={{ color: C.text }}>
                选品需求
              </span>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed" style={{ color: C.text3 }}>
              目标价位 ¥99–129,主推降噪与续航,首批 500 件。
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {['验收标准 3', '已关联'].map((c) => (
                <span
                  key={c}
                  className="rounded px-1.5 py-0.5 text-[10px]"
                  style={{ background: C.chip, color: C.text2 }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </WindowFrame>
  )
}

/* ════════════ 文案工作台:Split 源码 + 预览 ════════════ */

function FmtBtn({ as: I }) {
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-white/5">
      <Icon as={I} size={14} color={C.text2} stroke={2} />
    </span>
  )
}

function Skill({ as: I, label, color }) {
  return (
    <div className="flex items-center gap-2 rounded-md px-2 py-1.5" style={{ color: C.text }}>
      <Icon as={I} size={14} color={color || C.accent} stroke={2} />
      <span className="text-[12px]">{label}</span>
    </div>
  )
}

const VIEWS = ['Live', 'Source', 'Split', 'Preview']
const FILES = [
  { name: '蓝牙耳机-详情.md', active: true },
  { name: '种草笔记.md' },
  { name: '活动文案.md' }
]

export function WriteMock() {
  return (
    <WindowFrame title="小元 — 文案工作台">
      <div className="flex h-[440px] text-left sm:h-[500px] lg:h-[564px]">
        {/* 文件树 */}
        <aside
          className="hidden w-[182px] shrink-0 flex-col p-2.5 md:flex"
          style={{ background: C.bar, borderRight: `1px solid ${C.border}` }}
        >
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="text-[10.5px] font-semibold uppercase tracking-wider" style={{ color: C.text3 }}>
              文案库
            </span>
            <Plus size={14} strokeWidth={2} style={{ color: C.text3 }} />
          </div>
          <div className="flex items-center gap-1.5 px-1 py-1">
            <ChevronDown size={13} strokeWidth={2} style={{ color: C.text3 }} />
            <FolderOpen size={13} strokeWidth={2} style={{ color: C.accent }} />
            <span className="text-[12.5px] font-medium" style={{ color: C.text2 }}>
              商品文案
            </span>
          </div>
          {FILES.map((f) => (
            <div
              key={f.name}
              className="ml-3.5 flex items-center gap-1.5 rounded-md px-2 py-1.5"
              style={f.active ? { background: C.active } : undefined}
            >
              <FileText size={12} strokeWidth={2} style={{ color: f.active ? C.accent : C.text3 }} />
              <span
                className="truncate text-[12px]"
                style={f.active ? { color: C.text, fontWeight: 600 } : { color: C.text2 }}
              >
                {f.name}
              </span>
            </div>
          ))}
          <div className="mt-1 flex items-center gap-1.5 px-1 py-1">
            <ChevronRight size={13} strokeWidth={2} style={{ color: C.text3 }} />
            <Folder size={13} strokeWidth={2} style={{ color: C.text3 }} />
            <span className="text-[12.5px]" style={{ color: C.text2 }}>
              种草笔记
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-1 py-1">
            <ChevronRight size={13} strokeWidth={2} style={{ color: C.text3 }} />
            <Folder size={13} strokeWidth={2} style={{ color: C.text3 }} />
            <span className="text-[12.5px]" style={{ color: C.text2 }}>
              营销活动
            </span>
          </div>
        </aside>

        {/* 编辑器(主区) */}
        <div className="flex min-w-0 flex-1 flex-col" style={{ background: C.canvas }}>
          <div
            className="flex items-center gap-2 border-b px-4 py-2.5 text-[11px]"
            style={{ borderColor: C.borderSoft }}
          >
            <FileText size={13} strokeWidth={2} style={{ color: C.text3 }} />
            <span className="text-[12px] font-medium" style={{ color: C.text }}>
              蓝牙耳机-详情.md
            </span>
            <span className="ml-auto flex items-center gap-0.5 rounded-md p-0.5" style={{ background: C.toggleBg }}>
              {VIEWS.map((v) => (
                <span
                  key={v}
                  className="rounded px-2 py-0.5"
                  style={v === 'Split' ? { background: C.cardElevated, color: C.text, fontWeight: 600 } : { color: C.text3 }}
                >
                  {v}
                </span>
              ))}
            </span>
          </div>

          {/* Split:左源码 / 右预览 */}
          <div className="flex min-h-0 flex-1">
            {/* 源码 */}
            <div className="relative min-w-0 flex-1 overflow-hidden px-5 py-4" style={{ color: C.text2 }}>
              <div className="text-[12.5px] leading-7">
                <p>
                  <span style={{ color: C.accent }}># </span>
                  <span className="font-semibold" style={{ color: C.text }}>
                    主动降噪蓝牙耳机 · 商品详情
                  </span>
                </p>
                <p style={{ color: C.text3 }}>
                  <span style={{ color: C.accent }}>## </span>一、核心卖点
                </p>
                <p>
                  整日佩戴也轻盈无感,40 小时续航陪你从通勤到深夜,
                  <span style={{ background: C.selection, color: C.text }}>主动降噪让地铁与办公室的嘈杂瞬间安静下来</span>。
                </p>
                <p>
                  <span style={{ color: C.accent }}>- </span>40h 超长续航,快充 10 分钟用 3 小时
                </p>
                <p>
                  <span style={{ color: C.accent }}>- </span>入耳检测,摘下自动暂停
                </p>
                <p style={{ color: C.text3 }}>
                  <span style={{ color: C.accent }}>## </span>二、适用场景
                  <span className="ml-0.5 inline-block h-4 w-px animate-pulse align-middle" style={{ background: C.accent }} />
                </p>
              </div>

              {/* 内联 AI 工具条 */}
              <div
                className="absolute left-5 top-[120px] z-10 w-[196px] rounded-xl border p-1.5"
                style={{ background: C.cardElevated, borderColor: C.border, boxShadow: '0 18px 44px rgba(0,0,0,0.55)' }}
              >
                <div className="flex items-center gap-1.5 rounded-md px-2 py-1.5" style={{ background: C.chip }}>
                  <Pilcrow size={13} strokeWidth={2} style={{ color: C.text2 }} />
                  <span className="text-[11.5px]" style={{ color: C.text }}>
                    普通文本
                  </span>
                  <ChevronDown size={12} strokeWidth={2} className="ml-auto" style={{ color: C.text3 }} />
                </div>
                <div className="mt-1 flex items-center gap-0.5 px-0.5">
                  <FmtBtn as={Bold} />
                  <FmtBtn as={Italic} />
                  <FmtBtn as={Strikethrough} />
                  <FmtBtn as={Code} />
                  <span className="mx-0.5 h-4 w-px" style={{ background: C.border }} />
                  <FmtBtn as={Heading1} />
                  <FmtBtn as={List} />
                  <FmtBtn as={Quote} />
                </div>
                <p className="mt-1.5 px-2 text-[9.5px] font-semibold uppercase tracking-wider" style={{ color: C.text3 }}>
                  技能
                </p>
                <Skill as={Wand2} label="润色" color={C.skill} />
                <Skill as={Lightbulb} label="解释" color={C.skill} />
                <Skill as={ImageIcon} label="生成信息图" color={C.skill} />
                <div className="mt-1 flex items-center gap-2 border-t px-2 pt-2" style={{ borderColor: C.borderSoft }}>
                  <Sparkles size={13} strokeWidth={2} style={{ color: C.accent }} />
                  <span className="text-[11.5px]" style={{ color: C.text2 }}>
                    使用 AI 编辑
                  </span>
                  <button
                    className="ml-auto flex h-5 w-5 items-center justify-center rounded-md"
                    style={{ background: C.accent, color: C.onAccent }}
                  >
                    <Send size={11} strokeWidth={2.4} />
                  </button>
                </div>
              </div>
            </div>

            {/* 预览 */}
            <div
              className="hidden min-w-0 flex-1 flex-col overflow-hidden border-l lg:flex"
              style={{ borderColor: C.border, background: C.canvas2 }}
            >
              <div
                className="flex items-center gap-1.5 border-b px-4 py-1.5 text-[10.5px]"
                style={{ borderColor: C.borderSoft, color: C.text3 }}
              >
                <Eye size={12} strokeWidth={2} /> 预览
              </div>
              <div className="flex-1 overflow-hidden px-5 py-4">
                <h4 className="text-[16px] font-bold" style={{ color: C.text }}>
                  主动降噪蓝牙耳机
                </h4>
                {/* 商品主图占位 */}
                <div
                  className="mt-3 flex h-[78px] items-center justify-center rounded-lg border"
                  style={{
                    borderColor: C.cardBorder,
                    background: 'linear-gradient(135deg, rgba(111,176,232,0.16), rgba(168,155,245,0.12))'
                  }}
                >
                  <ImageIcon size={22} strokeWidth={1.6} style={{ color: C.accent }} />
                </div>
                <p className="mt-3 text-[12.5px] font-semibold" style={{ color: C.text }}>
                  一、核心卖点
                </p>
                <p className="mt-1.5 text-[12px] leading-relaxed" style={{ color: C.text2 }}>
                  整日佩戴也轻盈无感,40 小时续航陪你从通勤到深夜,
                  <b style={{ color: C.text }}>主动降噪</b>让嘈杂瞬间安静。
                </p>
                <ul className="mt-2.5 space-y-1.5 text-[12px]" style={{ color: C.text2 }}>
                  {['40h 超长续航,快充 10 分钟用 3 小时', '入耳检测,摘下自动暂停', '蓝牙 5.4 双设备无缝切换'].map(
                    (li) => (
                      <li key={li} className="flex gap-2">
                        <Check size={14} strokeWidth={2.4} className="mt-0.5 shrink-0" style={{ color: C.green }} />
                        <span>{li}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WindowFrame>
  )
}
