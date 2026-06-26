// 纯前端仿真桌面端 UI,替代上游录屏 GIF。
// 配色与图标严格对齐桌面端真实界面:
//   主题 src/renderer/src/styles/base-shell.css(浅色「鲸蓝」)
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
  ImageIcon,
  Sparkles
} from 'lucide-react'
import logo from '../assets/logo.png'

// 桌面端真实色板
const C = {
  app: '#f3f5fc',
  bar: '#eef2fa',
  canvas: '#fafbff',
  border: '#dde6f3',
  borderSoft: '#e7eef8',
  cardBorder: '#e2eaf5',
  text: '#233659',
  text2: '#54678c',
  text3: '#8492b1',
  placeholder: '#93a1c0',
  accent: '#3b82d8',
  active: '#d8e8f9',
  chip: '#eef3fa',
  green: '#128a4a',
  red: '#d6493f'
}

function WindowFrame({ title, children }) {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      {/* 背后柔光,呼应真实截图的桌面壁纸氛围 */}
      <div
        aria-hidden
        className="absolute -inset-5 -z-10 rounded-[2rem] bg-gradient-to-tr from-brand/25 via-indigo-500/10 to-transparent blur-2xl"
      />
      <div
        className="overflow-hidden rounded-xl border border-slate-800/70 shadow-2xl shadow-black/60 ring-1 ring-white/10"
        style={{ background: C.app }}
      >
        {/* 标题栏 */}
        <div
          className="flex items-center gap-2 border-b px-3 py-2"
          style={{ background: C.bar, borderColor: C.border }}
        >
          <span className="h-3 w-3 rounded-full" style={{ background: '#ff5f57' }} />
          <span className="h-3 w-3 rounded-full" style={{ background: '#febc2e' }} />
          <span className="h-3 w-3 rounded-full" style={{ background: '#28c840' }} />
          <span className="mx-auto text-[11px] font-medium" style={{ color: C.text3 }}>
            {title}
          </span>
          <MessageCircleMore size={13} style={{ color: C.text3 }} />
          <LayoutGrid size={13} style={{ color: C.text3 }} />
        </div>
        {children}
      </div>
    </div>
  )
}

function Icon({ as: I, size = 14, color = C.text3, stroke = 1.9, className }) {
  return <I size={size} strokeWidth={stroke} style={{ color }} className={className} />
}

/* ════════════ 经营工作台:Agent 对话 ════════════ */

function SideItem({ as: I, label, danger }) {
  return (
    <div className="flex items-center gap-2 rounded-md px-2 py-[5px]" style={{ color: C.text2 }}>
      <Icon as={I} size={13} color={danger ? C.accent : C.text3} />
      <span className="truncate text-[11px]">{label}</span>
    </div>
  )
}

function ToolCard({ as: I, label, arg, running }) {
  return (
    <div
      className="flex w-fit max-w-full items-center gap-2 rounded-lg border bg-white px-2.5 py-1.5"
      style={{ borderColor: C.cardBorder }}
    >
      <Icon as={I} size={13} color={C.accent} />
      <span className="text-[11px] font-medium" style={{ color: C.text2 }}>
        {label}
      </span>
      <span
        className="truncate rounded px-1.5 py-0.5 font-mono text-[10px]"
        style={{ background: C.chip, color: C.text3 }}
      >
        {arg}
      </span>
      {running ? (
        <Loader2 size={12} strokeWidth={2.2} className="animate-spin" style={{ color: C.accent }} />
      ) : (
        <Check size={13} strokeWidth={2.6} style={{ color: C.green }} />
      )}
    </div>
  )
}

export function OperationsMock() {
  return (
    <WindowFrame title="小元 — 经营工作台">
      <div className="flex h-[452px] text-left">
        {/* 侧栏 */}
        <aside
          className="hidden w-[132px] shrink-0 flex-col border-r p-2 sm:flex"
          style={{ background: C.bar, borderColor: C.border }}
        >
          {/* Code / 写作 切换 */}
          <div className="mb-2 flex gap-1 rounded-lg p-0.5" style={{ background: '#e3ebf6' }}>
            <div
              className="flex flex-1 items-center justify-center gap-1 rounded-md bg-white py-1 text-[11px] font-semibold"
              style={{ color: C.text }}
            >
              <Code2 size={12} strokeWidth={2} style={{ color: C.accent }} /> Code
            </div>
            <div
              className="flex flex-1 items-center justify-center gap-1 rounded-md py-1 text-[11px]"
              style={{ color: C.text3 }}
            >
              <Pencil size={12} strokeWidth={2} /> 写作
            </div>
          </div>

          <SideItem as={Plus} label="新建会话" danger />
          <SideItem as={FileQuestion} label="新建需求" />
          <SideItem as={LayoutGrid} label="插件" />
          <SideItem as={Clock3} label="定时任务" />

          <div className="my-2 h-px" style={{ background: C.border }} />

          {/* 搜索 */}
          <div
            className="mb-1.5 flex items-center gap-1.5 rounded-md border px-2 py-1"
            style={{ borderColor: C.border, background: 'rgba(255,255,255,0.6)' }}
          >
            <Search size={11} strokeWidth={2} style={{ color: C.text3 }} />
            <span className="text-[10px]" style={{ color: C.placeholder }}>
              搜索
            </span>
          </div>
          {/* 项目 */}
          <div className="flex items-center gap-1.5 px-1 py-0.5">
            <Folder size={12} strokeWidth={2} style={{ color: C.text3 }} />
            <span className="text-[11px] font-medium" style={{ color: C.text2 }}>
              default
            </span>
          </div>
          <div
            className="mt-1 flex items-center gap-1.5 rounded-md px-2 py-1.5"
            style={{ background: C.active }}
          >
            <MessageCircleMore size={12} strokeWidth={2} style={{ color: C.accent }} />
            <span className="truncate text-[11px] font-semibold" style={{ color: C.text }}>
              蓝牙耳机 · 选品
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1.5">
            <MessageCircleMore size={12} strokeWidth={2} style={{ color: C.text3 }} />
            <span className="truncate text-[11px]" style={{ color: C.text2 }}>
              Q2 采购询盘
            </span>
          </div>

          <div className="flex-1" />

          {/* 底部栏 */}
          <div className="my-1.5 h-px" style={{ background: C.border }} />
          <div className="flex items-center gap-1.5 px-1">
            <img src={logo} alt="" className="h-5 w-5 rounded-md" />
            <span className="flex items-center gap-1 text-[10px]" style={{ color: C.text2 }}>
              <Focus size={11} strokeWidth={2} /> 专注
            </span>
            <span
              className="ml-auto flex h-3.5 w-6 items-center rounded-full px-0.5"
              style={{ background: '#cdd9ea' }}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-white" />
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-3 px-1 text-[10px]" style={{ color: C.text3 }}>
            <span className="flex items-center gap-1">
              <Smartphone size={11} strokeWidth={2} /> 连接手机
            </span>
            <span className="flex items-center gap-1">
              <Settings size={11} strokeWidth={2} /> 设置
            </span>
          </div>
        </aside>

        {/* 主面板 */}
        <div className="flex min-w-0 flex-1 flex-col" style={{ background: C.canvas }}>
          {/* 顶部标签 */}
          <div
            className="flex items-center gap-2 border-b px-3 py-2 text-[11px]"
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

          {/* 对话 */}
          <div className="flex-1 space-y-2 overflow-hidden p-3">
            <div
              className="ml-auto w-fit max-w-[78%] rounded-2xl rounded-tr-sm px-3 py-2 text-[11px] leading-relaxed"
              style={{ background: 'rgba(133,193,241,0.25)', color: C.text }}
            >
              调研蓝牙耳机类目近 30 天竞品价格和卖点,给出定价建议
            </div>

            <div className="flex items-start gap-2">
              <img src={logo} alt="" className="mt-0.5 h-5 w-5 shrink-0 rounded-md" />
              <div className="min-w-0 space-y-2">
                <ToolCard as={SearchCode} label="搜索网络" arg="蓝牙耳机 热销榜 价格" />
                <ToolCard as={FileText} label="读取" arg="competitors.csv" />
                <ToolCard as={BarChart3} label="分析价格分布" arg="12 款竞品" running />
                <p className="text-[11px] leading-relaxed" style={{ color: C.text }}>
                  对比 <b>12</b> 款竞品,均价 <b>¥149</b>,卖点集中在「降噪 / 续航 / 低延迟」。建议切入{' '}
                  <span style={{ color: C.accent, fontWeight: 600 }}>¥99–129</span> 并补强续航文案。
                </p>

                {/* 变更审查 */}
                <div className="overflow-hidden rounded-lg border bg-white" style={{ borderColor: C.cardBorder }}>
                  <div
                    className="flex items-center gap-1.5 border-b px-2.5 py-1.5 text-[10px]"
                    style={{ borderColor: C.borderSoft }}
                  >
                    <FileText size={11} strokeWidth={2} style={{ color: C.text3 }} />
                    <span className="font-mono" style={{ color: C.text2 }}>
                      listing/蓝牙耳机.md
                    </span>
                    <span className="ml-auto" style={{ color: C.text3 }}>
                      变更审查
                    </span>
                  </div>
                  <div className="font-mono text-[10px] leading-5">
                    <div className="px-2.5" style={{ background: 'rgba(214,73,63,0.10)', color: C.red }}>
                      - 标题:蓝牙耳机
                    </div>
                    <div className="px-2.5" style={{ background: 'rgba(18,138,74,0.10)', color: C.green }}>
                      + 标题:主动降噪蓝牙耳机 40h 续航
                    </div>
                    <div className="px-2.5" style={{ background: 'rgba(18,138,74,0.10)', color: C.green }}>
                      + 卖点:游戏低延迟 · 入耳检测 · 双设备连接
                    </div>
                  </div>
                  <div
                    className="flex items-center justify-end gap-1.5 border-t px-2 py-1.5"
                    style={{ borderColor: C.borderSoft }}
                  >
                    <span
                      className="rounded-md px-2 py-0.5 text-[10px] font-medium"
                      style={{ color: C.text2, background: C.chip }}
                    >
                      拒绝
                    </span>
                    <span
                      className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold text-white"
                      style={{ background: C.green }}
                    >
                      <Check size={11} strokeWidth={2.6} /> 接受
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 输入框 */}
          <div className="p-2.5">
            <div
              className="rounded-xl border bg-white px-2.5 pb-1.5 pt-2"
              style={{ borderColor: '#dbe5f2', boxShadow: '0 6px 18px rgba(20,47,95,0.06)' }}
            >
              <p className="px-0.5 text-[11px]" style={{ color: C.placeholder }}>
                向智能体提问…
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <Plus size={15} strokeWidth={2} style={{ color: C.text3 }} />
                <span className="flex items-center gap-1 text-[10px]" style={{ color: C.text3 }}>
                  <GitBranch size={12} strokeWidth={2} /> main
                </span>
                <div className="ml-auto flex items-center gap-2">
                  <span
                    className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                    style={{ background: C.chip, color: C.text2 }}
                  >
                    deepseek-v4-pro <ChevronDown size={11} strokeWidth={2} />
                  </span>
                  <Mic size={14} strokeWidth={2} style={{ color: C.text3 }} />
                  <button
                    className="flex h-6 w-6 items-center justify-center rounded-lg text-white"
                    style={{ background: C.accent }}
                  >
                    <Send size={13} strokeWidth={2.2} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WindowFrame>
  )
}

/* ════════════ 文案工作台:Markdown 编辑器 ════════════ */

function FmtBtn({ as: I }) {
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-black/5">
      <Icon as={I} size={14} color={C.text2} stroke={2} />
    </span>
  )
}

function Skill({ as: I, label }) {
  return (
    <div className="flex items-center gap-2 rounded-md px-2 py-1.5" style={{ color: C.text }}>
      <Icon as={I} size={14} color={C.accent} stroke={2} />
      <span className="text-[11px]">{label}</span>
    </div>
  )
}

const VIEWS = ['Live', 'Source', 'Split', 'Preview']

export function WriteMock() {
  return (
    <WindowFrame title="小元 — 文案工作台">
      <div className="flex h-[452px] text-left">
        {/* 文件树 */}
        <aside
          className="hidden w-[132px] shrink-0 flex-col p-2 sm:flex"
          style={{ background: C.bar, borderRight: `1px solid ${C.border}` }}
        >
          <div className="mb-1.5 flex items-center justify-between px-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: C.text3 }}>
              文案
            </span>
            <Plus size={13} strokeWidth={2} style={{ color: C.text3 }} />
          </div>
          <div className="flex items-center gap-1 px-1 py-0.5">
            <ChevronDown size={12} strokeWidth={2} style={{ color: C.text3 }} />
            <FolderOpen size={12} strokeWidth={2} style={{ color: C.accent }} />
            <span className="text-[11px] font-medium" style={{ color: C.text2 }}>
              商品文案
            </span>
          </div>
          {[
            { name: '蓝牙耳机-详情.md', active: true },
            { name: '种草笔记.md' },
            { name: '活动文案.md' }
          ].map((f) => (
            <div
              key={f.name}
              className="ml-3 flex items-center gap-1.5 rounded-md px-2 py-1"
              style={f.active ? { background: C.active } : undefined}
            >
              <FileText size={11} strokeWidth={2} style={{ color: f.active ? C.accent : C.text3 }} />
              <span
                className="truncate text-[11px]"
                style={f.active ? { color: C.text, fontWeight: 600 } : { color: C.text2 }}
              >
                {f.name}
              </span>
            </div>
          ))}
          <div className="mt-0.5 flex items-center gap-1 px-1 py-0.5">
            <ChevronRight size={12} strokeWidth={2} style={{ color: C.text3 }} />
            <Folder size={12} strokeWidth={2} style={{ color: C.text3 }} />
            <span className="text-[11px]" style={{ color: C.text2 }}>
              营销活动
            </span>
          </div>
        </aside>

        {/* 编辑器 */}
        <div className="flex min-w-0 flex-1 flex-col" style={{ background: C.canvas }}>
          {/* 工具栏 */}
          <div
            className="flex items-center gap-2 border-b px-3 py-2 text-[10px]"
            style={{ borderColor: C.borderSoft }}
          >
            <FileText size={12} strokeWidth={2} style={{ color: C.text3 }} />
            <span className="font-medium" style={{ color: C.text }}>
              蓝牙耳机-详情.md
            </span>
            <span className="ml-auto flex items-center gap-0.5 rounded-md p-0.5" style={{ background: '#eaf0f9' }}>
              {VIEWS.map((v, i) => (
                <span
                  key={v}
                  className="rounded px-1.5 py-0.5"
                  style={i === 0 ? { background: '#fff', color: C.text, fontWeight: 600 } : { color: C.text3 }}
                >
                  {v}
                </span>
              ))}
            </span>
          </div>

          {/* 文档 */}
          <div className="relative flex-1 overflow-hidden px-5 py-4" style={{ color: C.text }}>
            <h3 className="text-[15px] font-bold leading-snug">主动降噪蓝牙耳机 · 商品详情</h3>
            <p className="mt-1 text-[10px]" style={{ color: C.text3 }}>
              # H1 · 156 字 · 已自动保存
            </p>
            <p className="mt-3 text-[13px] font-semibold">一、核心卖点</p>

            {/* 被选中的一句 */}
            <p className="mt-1.5 text-[12px] leading-relaxed" style={{ color: C.text2 }}>
              整日佩戴也轻盈无感,40 小时续航陪你从通勤到深夜,{' '}
              <span style={{ background: 'rgba(59,130,216,0.22)', color: C.text, padding: '1px 1px' }}>
                主动降噪让地铁与办公室的嘈杂瞬间安静下来
              </span>
              。
            </p>

            <ul className="mt-2.5 space-y-1.5 text-[12px]" style={{ color: C.text2 }}>
              {['40h 超长续航,快充 10 分钟用 3 小时', '入耳检测,摘下自动暂停', '蓝牙 5.4 双设备无缝切换'].map(
                (li) => (
                  <li key={li} className="flex gap-1.5">
                    <span style={{ color: C.accent }}>•</span>
                    <span>{li}</span>
                  </li>
                )
              )}
            </ul>

            <p className="mt-3 text-[13px] font-semibold">
              二、适用场景
              <span className="ml-0.5 inline-block h-3.5 w-px animate-pulse align-middle" style={{ background: C.accent }} />
            </p>
            <p className="mt-1.5 text-[12px] leading-relaxed" style={{ color: C.text2 }}>
              通勤 · 运动 · 办公 · 游戏,一副全搞定。
            </p>

            {/* 内联 AI 工具条(选区浮层) */}
            <div
              className="absolute left-5 top-[122px] z-10 w-[186px] rounded-xl border bg-white p-1.5"
              style={{ borderColor: '#dbe5f2', boxShadow: '0 18px 44px rgba(20,47,95,0.22)' }}
            >
              {/* 段落类型 */}
              <div
                className="flex items-center gap-1.5 rounded-md px-2 py-1.5"
                style={{ background: C.chip }}
              >
                <Pilcrow size={13} strokeWidth={2} style={{ color: C.text2 }} />
                <span className="text-[11px]" style={{ color: C.text }}>
                  普通文本
                </span>
                <ChevronDown size={12} strokeWidth={2} className="ml-auto" style={{ color: C.text3 }} />
              </div>
              {/* 格式按钮 */}
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
              {/* 技能 */}
              <p
                className="mt-1.5 px-2 text-[9px] font-semibold uppercase tracking-wider"
                style={{ color: C.text3 }}
              >
                技能
              </p>
              <Skill as={Wand2} label="润色" />
              <Skill as={Lightbulb} label="解释" />
              <Skill as={ImageIcon} label="生成信息图" />
              {/* 使用 AI 编辑 */}
              <div className="mt-1 flex items-center gap-2 border-t px-2 pt-2" style={{ borderColor: C.borderSoft }}>
                <Sparkles size={13} strokeWidth={2} style={{ color: C.accent }} />
                <span className="text-[11px]" style={{ color: C.text2 }}>
                  使用 AI 编辑
                </span>
                <button
                  className="ml-auto flex h-5 w-5 items-center justify-center rounded-md text-white"
                  style={{ background: C.accent }}
                >
                  <Send size={11} strokeWidth={2.4} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WindowFrame>
  )
}
