#!/usr/bin/env node

// 发布推送:只推 master 与本次 `npm version` 新建的那一个标签。
// 取代旧的 `git push origin master --follow-tags`——后者会把所有「可达的
// annotated 标签」(包括从 upstream 同步进来的 v0.2.x)一并推到 origin,
// 既污染本 fork 的标签列表,又会触发误发布。用 Node 实现以兼容 Windows
//(npm 默认用 cmd.exe 跑脚本,不支持 $(...) 命令替换 / 单引号语义)。

const { execFileSync } = require('node:child_process')
const { join } = require('node:path')

const pkg = require(join(__dirname, '..', 'package.json'))
const tag = `v${pkg.version}`

function git(...args) {
  execFileSync('git', args, { stdio: 'inherit' })
}

git('push', 'origin', 'master')
git('push', 'origin', tag)

console.log(`[push-release] Pushed master and ${tag}`)
