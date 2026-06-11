/* ============================================================
   TermRat — 管理端页面公用小组件（页头 / 行操作按钮 / 部署片段）
   ============================================================ */
import React from "react";
import { Ic } from "../../ui.jsx";

/* —— 页头 —— */
export function PageHeader({ title, desc, action }) {
  return (
    <div className="row between wrap gap-12" style={{ marginBottom: 18 }}>
      <div>
        <h2 className="h1" style={{ fontSize: 19 }}>{title}</h2>
        {desc && <div className="muted" style={{ fontSize: 13, marginTop: 3 }}>{desc}</div>}
      </div>
      {action}
    </div>
  );
}

/* —— 行操作按钮 —— */
export function RowBtn({ icon, label, tone, onClick, disabled }) {
  return (
    <button className="btn xs ghost" onClick={onClick} title={label} disabled={disabled}
      style={{ color: tone === "danger" ? "var(--red)" : "var(--text-2)" }}>
      <Ic name={icon} size={14} /><span className="desktop-only">{label}</span>
    </button>
  );
}

/* —— Docker 部署命令片段（以当前站点 origin 作为 NC_SERVER） —— */
export function deploySnippet(token) {
  const server = (typeof window !== "undefined" && window.location.origin) || "http://<server>:8080";
  return `docker run -d --name termrat-nc-agent \\
  --restart=always --net=host --cap-add=NET_RAW \\
  -e NC_SERVER=${server} \\
  -e NC_TOKEN=${token} \\
  termrat-nc-agent`;
}
