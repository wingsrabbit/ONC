# 更新日志 / Changelog

本项目版本号**按操作规模递增**：大操作 +0.1、中型 +0.01、小型 +0.001（详见 README「开发规范」）。
格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)。

## [Unreleased]

## [0.2] - 2026-06-10
### 新增
- **后端数据层**（SQLite）：nodes / tasks / results / resources + 节点 token(sha256) 鉴权 + 在线/离线读时判定 + 时序保留清理。
- **REST API**：公开总览/历史；admin 节点/任务（X-Admin-Token）；agent 取任务/上报（Bearer token）。
- **manage.py** CLI（建节点/任务，直连 DB）。
- 经独立复审并应用修复：公开读路径不写库、`busy_timeout`、admin token 恒定时间比较、入参校验、保留清理。

## [0.1] - 2026-06-10
### 新增
- **前端工程**：Vite + React（ESM），复用 cd 设计系统 `styles.css`；将设计原型干净 ESM 化（`data` / `ui` / `sparkline` / `store` / `PublicHome`），去掉 babel-in-browser 与 CDN。
- **公开主页**（`/`）：状态横幅 + 节点状态卡片（CPU/内存/磁盘 阈值配色 + 流量 + 延迟 sparkline）+ 网络质量探测表 + 事件公告时间线；其余路由（节点/线路详情、管理端）占位，后续增量落地。
- **后端**：Flask 单进程，服务前端静态（SPA 回落）+ `/api/health` + SQLite 初始化。
- **单 Dockerfile 多阶段**（node 构建前端 → python 运行）= 一镜像一容器；配 `.dockerignore`。容器端口 8080，数据卷 `/app/data`。

## [0.000] - 2026-06-10
### 新增
- 仓库 bootstrap：`.gitignore`、`VERSION`、本更新日志、`README.md`（含架构与规范）。
- 收纳已认可的 cd 设计原型到 `docs/design-prototype/`（React 免构建版，作为前端设计基线）。
- `origin/`（两个源仓库 clone）与 `DEPLOY-NOTES.local.md`（含测试 VM 凭据）列入忽略，不入库。
