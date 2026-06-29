# 用户认证（钉钉扫码登录）开发文档

> 状态：**设计已定，待后端对接值确认后开发**
> 最后更新：2026-06-29
> 适用范围：小元（Xiaoyuan）桌面端（Electron 壳层），不涉及内置 `kun` runtime。

---

## 1. 背景与目标

### 1.1 现状

小元是**本地优先（local-first）的 Electron 应用**：应用壳（main / preload / renderer）+ 打包进去的本地 `kun` runtime，跑在 `localhost` 走 HTTP/SSE。

当前应用里**没有用户账号体系**。已有的两类"认证"都不是用户登录：

- 本地 runtime 的 `x-kun-secret` / bearer token —— 应用和自己本地子进程通信用。
- [`src/main/claude-subscription-auth.ts`](../src/main/claude-subscription-auth.ts) —— 通过官方 Claude Code CLI 的 OAuth 登录 Anthropic，仅用于拿 LLM 调用权限，不是登录本应用。

**本仓库是 `KunAgent/Kun` 的 fork，会周期性同步上游**（`git merge upstream/master`）。这是本功能的硬约束之一，见 §3。

### 1.2 目标

给应用加一个用户登录入口：**点击登录 → 弹窗加载钉钉扫码登录页 → 扫码认证成功 → 解锁"更多功能"。**

### 1.3 已确认的产品/工程决策

| 决策项 | 结论 |
|---|---|
| 认证目的 | 控制 App 功能访问（账号体系） |
| 身份来源 | **复用现有后端**：已有"钉钉扫码登录业务系统"的能力 |
| 登录门槛 | **完全可选**：不强制登录；登录后解锁更多功能。架构保留"启动即强制登录"的开关，便于以后切换 |
| 客户端流程 | **路线 B**：弹窗加载现有登录网页（非 App 内原生画二维码） |
| 凭证形态 | 登录成功后，后端在**域名下种 session cookie**；要求**复用网页登录态** |
| **上游合并** | **架构必须最小化对上游文件的改动**，保证 fork 同步 `upstream/master` 尽量无冲突（见 §3） |

---

## 2. 整体方案

### 2.1 一句话

用一个**持久化的 Electron `session` 分区**承载登录窗口的 cookie，之后所有业务请求都复用这个分区发出——cookie（含 httpOnly）由 Electron 自动携带，不需要手动搬运 token。

### 2.2 关键机制

1. **持久分区**：`session.fromPartition('persist:xiaoyuan-auth')`。该分区的 cookie 落盘到 userData，**应用重启后仍在**。
2. **登录窗口**：点登录时开一个子 `BrowserWindow`，`webPreferences.partition` 指向上述分区，加载后端的钉钉扫码登录页。用户扫码确认后，后端把 session cookie 种进这个分区。
3. **成功判定**：监听登录窗口的导航事件（`did-navigate` / `did-navigate-in-page`），每次用验证接口探测（见 §5）；返回 200 即视为登录成功。**不依赖匹配跳转 URL 字符串，也不需要知道 cookie 名。**
4. **复用登录态**：所有业务 API 调用走 `net.fetch(url, { session: authSession, credentials: 'include' })`，Electron 自动带上该分区里的 cookie。**main 进程能读到 httpOnly cookie**（只有渲染层 JS 读不到），不存在抓不到凭证的问题。
5. **不主动关窗**：成功检测与关窗解耦。检测到成功就更新登录态、推送事件；窗口可留给用户自己关，或在窗口内显示"已登录"提示。

### 2.3 为什么不走"原生画二维码 + 轮询"（路线 A）

本仓库已有成熟的"原生 QR + 轮询"范式（微信/飞书 bridge，见 [`claw-platform-install.ts`](../src/main/claw-platform-install.ts) 与 [`ConnectPhoneView.tsx`](../src/renderer/src/components/chat/ConnectPhoneView.tsx)）。但它要求后端额外提供"取二维码 + 轮询状态返回 token"的无头接口。

当前后端只暴露**网页登录页**且要求**复用网页登录态**，因此选路线 B：复用现有网页、后端零改动、登录态天然由 session cookie 承载。若以后后端提供无头接口，可平滑升级到路线 A。

---

## 3. 上游合并隔离架构（关键约束）

### 3.1 约束

本仓库会周期性 `git merge upstream/master`。历史经验：改动越落在上游拥有的"枢纽文件"（`locales/**`、`settings-store.ts`、`app-settings-types.ts`、`index.ts` 等），同步时冲突越多。

**本功能必须设计成高度隔离、纯增量，把对上游文件的改动压到最少、且尽量是"末尾追加"，让未来同步几乎无冲突，也便于将来需要时整体下线/迁移。**

### 3.2 原则

- **新增优于修改**：逻辑全部放进专属新目录 `src/main/auth/**`、`src/renderer/src/auth/**`、`src/preload/auth-bridge.ts`。新文件几乎不会与上游冲突。
- **独立配置，不进上游 settings**：auth 的配置（登录页 URL、域名、接口路径等）用**独立的 `electron-store` 实例 / 独立 JSON**，**不动** `app-settings-types.ts`、`settings-store.ts`（历史冲突高发区）。
- **独立 i18n 命名空间**：auth 文案放新文件，运行时 `i18n.addResourceBundle('zh', 'auth', {...})` 注册，**不动**上游 `locales/{zh,en}/*.json`。
- **独立 preload 桥**：暴露单独的 `window.xiaoyuanAuth`，**不扩展**上游的 `window.kunGui` / `kun-gui-api.ts`。
- **IPC 自注册**：auth 的 IPC handler + zod schema 都在 `src/main/auth/` 内，由一个 `initAuth()` 注册，**不动** `register-app-ipc-handlers.ts`、`app-ipc-schemas.ts`。
- **单一接入缝（seam）**：对上游文件的改动收敛成屈指可数的几行，且都是末尾追加。

### 3.3 上游文件接入点（唯一允许改动的地方）

| 上游文件 | 改动 | 约行数 |
|---|---|---|
| [`src/main/index.ts`](../src/main/index.ts) | import 块末尾加 `import { initAuth } from './auth'`；`whenReady` 末尾加一行 `initAuth({ getMainWindow, ... })` | +2 |
| [`src/preload/index.ts`](../src/preload/index.ts) | 末尾加一行 `import './auth-bridge'`，由它自注册 `window.xiaoyuanAuth` | +1 |
| [`src/renderer/src/AppShell.tsx`](../src/renderer/src/AppShell.tsx) | import + 在根部挂一个自包含的 `<AuthGate>`（或登录入口组件） | +2 |

> 以上即全部接入点。其余一律新文件。**严禁触碰**：`app-settings-types.ts`、`settings-store.ts`、`kun-gui-api.ts`、`register-app-ipc-handlers.ts`、`app-ipc-schemas.ts`、`locales/**`。
>
> 这些接入点都选在文件**末尾 / 稳定锚点**追加，最大限度避开上游改动区。

### 3.4 目录布局

```
src/main/auth/
  index.ts            // initAuth()：建分区、注册 IPC、启动校验、装配
  auth-session.ts     // 持久分区 + authedFetch + validateSession + 登录窗 + 登出
  auth-ipc.ts         // IPC handler + zod schema（自注册，不进上游 ipc 文件）
  auth-config.ts      // 独立配置存储（独立 electron-store，不进上游 settings）
src/renderer/src/auth/
  auth-store.ts       // zustand：{ status, user }，订阅 auth:changed
  AuthGate.tsx        // 门槛 / 登录入口容器（自包含，AppShell 一行挂载）
  LoginEntry.tsx      // 登录按钮 / 头像菜单 / "登录解锁"提示
  locales.ts          // i18n.addResourceBundle 注册 'auth' 命名空间
src/preload/
  auth-bridge.ts      // contextBridge 暴露 window.xiaoyuanAuth（新文件）
  auth-bridge.d.ts    // window.xiaoyuanAuth 的环境类型（新文件，不动 index.d.ts）
```

### 3.5 同步上游后的复检清单

- 三个接入点（`index.ts` / `preload/index.ts` / `AppShell.tsx`）是否仍在、有没有被上游改动顶掉或挪走。
- `window.xiaoyuanAuth` 命名有无与上游新增冲突（基本不会）。
- 若上游自己引入了账号/登录体系，再评估两套如何取舍。
- 其余 auth 文件均为独有新增，正常不会进入冲突。

---

## 4. 登录态生命周期与过期处理

> 这是本方案唯一需要认真设计的部分。核心原则：**不信任 cookie 是否存在，服务器才是唯一真相。**

### 4.1 状态机

```
anonymous ──(点击登录, 扫码成功, 验证 200)──▶ authenticated
authenticated ──(业务请求 401/403, 或启动校验 401)──▶ expired
expired ──(重新登录, 扫码成功)──▶ authenticated
authenticated/expired ──(用户登出, 清 cookie)──▶ anonymous
```

渲染层只需区分两态：`anonymous`（含 `expired`）→ 显示登录入口 / "登录已过期"；`authenticated` → 解锁功能。

### 4.2 过期处理四层

**① 401/403 = 已过期（主防线，权威）**

所有业务请求统一走一个 `net.fetch` 包装。后端返回 401/403（或重定向到登录页）即判定登录失效：置登出态、推送 `auth:changed`，UI 提示"登录已过期，请重新登录"。服务器说了算，不靠猜。

```ts
async function authedFetch(url: string, init?: RequestInit): Promise<Response> {
  const res = await net.fetch(url, { ...init, session: authSession, credentials: 'include' })
  if (res.status === 401 || res.status === 403) {
    markLoggedOut()         // 推送 auth:changed → 渲染层切未登录
    throw new AuthExpiredError()
  }
  return res
}
```

**② 关键时机主动校验，而非只看 cookie 在不在**

启动时、窗口重新聚焦、执行需登录的操作前，先打验证接口；200 才算登录，401 切未登录。覆盖"cookie 文件还在但服务端 session 已失效"的情况。

**③ 重新登录复用同一持久分区**

检测到过期 → 弹同一个登录窗、再加载登录页。分区持久、钉钉登录页可能仍记得账号，**再扫一次即在同分区换上新 cookie**，对用户基本无感，无需清理任何东西。

**④ 滑动续期自动生效（"白送"的好处）**

所有业务请求复用同一持久 session，**后端响应里的 `Set-Cookie` 会被 Electron 自动写回分区**。若后端是"活跃即顺延有效期"的滑动 session，则用户在用时 cookie 持续自动续期，几乎碰不到过期。这是复用 session 而非手动搬 token 换来的。

### 4.3 UX 原则

过期不硬踢人：基础功能（本就免登录）继续可用；仅在点到"更多功能"时，非破坏性提示"登录已过期"+ 重新登录按钮，保住用户当前上下文。

### 4.4 ⚠️ 待后端确认：session 策略决定是否加 refresh 层

| 策略 | 含义 | 客户端做法 |
|---|---|---|
| **A. 滑动续期** | 每次请求顺延有效期 | ①+② 足够，**无需额外开发** |
| **B. 固定有效期硬失效，无 refresh** | 到点必须重新登录 | ③ 已覆盖；可选加"临近过期主动提示"（读 cookie `expirationDate`，仅作提示，仍以 401 为准） |
| **C. 有独立 refresh 接口 / 长效 refresh cookie** | 可静默续期 | 401 时先静默调一次 refresh，失败再让用户重新登录，体验最好 |

**→ 需要后端明确属于 A / B / C，再决定是否实现 refresh 层。**

---

## 5. 待后端确认的对接值

开发前需要后端提供以下值（可先用占位配置把架子搭起来，后续填真实值即可）：

| # | 项 | 说明 | 必需 |
|---|---|---|---|
| 1 | **登录页 URL** | 点登录后加载的钉钉扫码页地址 | 是 |
| 2 | **业务域名 / API base** | cookie 种在哪个域、业务接口的根地址 | 是 |
| 3 | **验证接口** | 已登录返回 200、未登录返回 401 的接口（如 `/api/me`、`/api/user/profile`），用于成功判定 + 启动校验 + 拉用户资料 | 是 |
| 4 | **session cookie 名** | 有则成功判定更稳；无则靠验证接口兜底 | 否 |
| 5 | **session 过期策略** | A / B / C（见 §4.4） | 是 |
| 6 | **登出接口**（可选） | 服务端吊销 session 的接口；无则仅客户端清 cookie | 否 |

这些值进**独立的 auth 配置存储**（带 env 覆盖），**不进上游 settings**（见 §3.2）。

---

## 6. 客户端实现计划（本仓库改动）

> 总原则见 §3：新增为主，上游接入点只有 §3.3 的三处末尾追加。

### 6.1 主进程（`src/main/auth/`，全部新增）

- `auth-session.ts`：
  - 持有持久分区 `session.fromPartition('persist:xiaoyuan-auth')`。
  - `authedFetch(url, init)`：业务请求统一入口（§4.2 ①）。
  - `validateSession()`：调验证接口，返回 `{ ok, user? }`。
  - `openLoginWindow()`：开登录窗、监听导航做成功判定、推送 `auth:changed`。
  - `logout()`：`authSession.clearStorageData({ storages: ['cookies'] })`（或按域 `cookies.remove`）+ 可选调登出接口 + 推送事件。
  - `getStatus()`：返回当前登录态 + 用户资料。
- `auth-ipc.ts`：注册 `auth:status` / `auth:start-login` / `auth:logout` / `auth:request` 及其 zod schema（自注册，不进上游 ipc 文件）。
- `auth-config.ts`：独立配置存储（§5 的对接值）。
- `index.ts`：`initAuth()` 装配以上，并由 [`src/main/index.ts`](../src/main/index.ts) 的 `whenReady` 末尾调用一次。

**安全要求**（加载远程页必须锁死）：登录窗 `webPreferences` 必须 `sandbox: true`、`contextIsolation: true`、`nodeIntegration: false`、**不挂业务 preload**。参考现有 [`installDevPreviewWebviewGuards`](../src/main/index.ts) 的收紧思路。

### 6.2 preload（新增 `src/preload/auth-bridge.ts`）

`contextBridge.exposeInMainWorld('xiaoyuanAuth', {...})` 暴露独立桥；类型放同目录新文件 `auth-bridge.d.ts`。[`src/preload/index.ts`](../src/preload/index.ts) 仅末尾加一行 `import './auth-bridge'`。**不动** [`kun-gui-api.ts`](../src/shared/kun-gui-api.ts)。

### 6.3 渲染层（`src/renderer/src/auth/`，全部新增）

- `auth-store.ts`（zustand，项目已用）：`{ status: 'anonymous' | 'authenticated', user }`，订阅 `window.xiaoyuanAuth.onChanged`。
- `AuthGate.tsx` + `LoginEntry.tsx`：登录入口 + 锁定态。未登录时"更多功能"显示"登录解锁"，点击触发 `startLogin`。
- `locales.ts`：`i18n.addResourceBundle` 注册独立 `auth` 命名空间，**不动** [`locales/**`](../src/renderer/src/locales)。
- 接入点：[`AppShell.tsx`](../src/renderer/src/AppShell.tsx) 根部挂一个自包含 `<AuthGate>`（§3.3）。具体哪些功能算"更多功能"待产品确认。

---

## 7. IPC 契约（草案）

桥对象为独立的 `window.xiaoyuanAuth`（不挂在上游 `window.kunGui` 上，见 §3.2）。

```ts
// 渲染层 → 主进程
window.xiaoyuanAuth.getStatus(): Promise<AuthStatus>
window.xiaoyuanAuth.startLogin(): Promise<AuthStatus>   // 开窗 + 等成功；也可不阻塞、靠 onChanged
window.xiaoyuanAuth.logout(): Promise<void>
window.xiaoyuanAuth.onChanged(cb: (s: AuthStatus) => void): () => void  // 返回取消订阅

type AuthStatus =
  | { state: 'anonymous' }
  | { state: 'authenticated'; user: { id: string; name?: string; avatar?: string } }

// 业务请求统一入口（渲染层不直接 fetch 业务域）
window.xiaoyuanAuth.request(input: {
  path: string            // 相对业务 API base
  method?: string
  body?: unknown
  headers?: Record<string, string>
}): Promise<{ ok: boolean; status: number; data: unknown }>
// 401/403 时主进程已置登出态并推送 auth:changed；此处返回 ok:false 让调用方提示重新登录
```

---

## 8. 安全要点

- 登录窗加载远程页：`sandbox` + `contextIsolation` + 无 `nodeIntegration` + 不挂业务 preload。
- 业务请求集中在**主进程**用 `net.fetch({ session })` 发出；渲染层（sandbox）不直接触达业务域，统一走 `auth:request` IPC。
- cookie 由持久分区承载，登出时清理；尽量要求后端 HTTPS。httpOnly session cookie 没问题——主进程 `session.cookies.get` 可读。
- 不把 session cookie / token 写进明文配置；cookie 走 Electron 分区即可，无需再加密落盘。（注：仓库目前**未使用** `safeStorage`。）

---

## 9. 测试计划

- **单元**：`auth-session.ts` 的 `authedFetch` 401/403 → 置登出 + 抛 `AuthExpiredError`；`validateSession` 解析；状态机迁移。注入 `fetch`/`session` 便于测试（参考现有 `claw-platform-install.ts` 的 `spawnFn` 可注入风格）。
- **集成**：mock 一个会种 cookie 的本地服务器，验证登录窗成功判定 + 后续 `net.fetch` 自动带 cookie + 401 触发登出。
- **手动**：真实钉钉登录页跑通"登录 → 解锁 → 过期 → 重新登录 → 登出"全链路；重启应用验证登录态持久化。
- **隔离回归**：确认对上游文件的改动仅限 §3.3 三处；模拟一次 `merge upstream/master`（或 dry-run）确认接入点不引入冲突。

---

## 10. 开发前置清单（Definition of Ready）

- [ ] 后端提供 §5 的 1/2/3/5（4/6 可选）。
- [ ] 明确 session 过期策略 A/B/C（§4.4），据此决定是否做 refresh 层。
- [ ] 产品确认"更多功能"具体指哪些入口（门槛挂载点）。
- [ ] 确认登录窗加载的域是否需要特殊 CSP / 代理（现有 [`proxy-fetch.ts`](../src/main/proxy-fetch.ts) 走代理，`net.fetch` 是否需同样代理策略待定）。

> 以上确认后即可开工。客户端架子（持久分区、登录窗、IPC、store、门槛 UI）可在对接值确定前用占位配置先行搭建，且全部落在 §3.4 的新目录里，不影响上游同步。
