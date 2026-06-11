/* ============================================================
   ONC — 系统设置（admin）：分组表单 → PUT /api/settings
   keys: site_title, site_subtitle, data_retention_days,
         global_alert_cooldown, default_probe_interval, default_probe_timeout
   ============================================================ */
import React, { useState, useEffect } from "react";
import { Ic, useToast } from "../../ui.jsx";
import { PageHeader } from "./_common.jsx";
import { apiGetSettings, apiPutSettings } from "../../api.js";

const DEFAULTS = {
  site_title: "ONC 网络状态中心",
  site_subtitle: "实时服务器资源监控 · 网络质量探测",
  data_retention_days: 3,
  global_alert_cooldown: 300,
  default_probe_interval: 5,
  default_probe_timeout: 5,
};

export function SettingsPage() {
  const toast = useToast();
  const [f, setF] = useState(DEFAULTS);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    apiGetSettings().then((d) => {
      if (!alive) return;
      setF({ ...DEFAULTS, ...(d.settings || {}) });
    }).catch((e) => { if (alive) toast.error(e.message || "加载设置失败"); })
      .finally(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, []);

  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const save = async () => {
    setBusy(true);
    try {
      const payload = {
        site_title: f.site_title,
        site_subtitle: f.site_subtitle,
        data_retention_days: Number(f.data_retention_days),
        global_alert_cooldown: Number(f.global_alert_cooldown),
        default_probe_interval: Number(f.default_probe_interval),
        default_probe_timeout: Number(f.default_probe_timeout),
      };
      const d = await apiPutSettings(payload);
      setF({ ...DEFAULTS, ...(d.settings || payload) });
      toast.success("保存成功");
    } catch (e) {
      toast.error(e.message || "保存失败");
    } finally {
      setBusy(false);
    }
  };

  if (!loaded) {
    return <div className="fade-up" style={{ maxWidth: 820 }}><PageHeader title="系统设置" desc="站点、探测默认值与数据保留策略" /><div className="card card-pad"><div className="muted">加载中…</div></div></div>;
  }

  return (
    <div className="fade-up" style={{ maxWidth: 820 }}>
      <PageHeader title="系统设置" desc="站点、探测默认值与数据保留策略" />
      <div className="col gap-16">
        <SettingsGroup title="站点信息" icon="globe">
          <SField label="站点标题"><input className="input" value={f.site_title} onChange={(e) => set("site_title", e.target.value)} /></SField>
          <SField label="站点副标题"><input className="input" value={f.site_subtitle} onChange={(e) => set("site_subtitle", e.target.value)} /></SField>
        </SettingsGroup>

        <SettingsGroup title="探测默认值" icon="signal">
          <SField label="默认探测间隔（秒）" hint="新建任务的默认值"><NumIn v={f.default_probe_interval} min={1} max={3600} on={(v) => set("default_probe_interval", v)} /></SField>
          <SField label="默认探测超时（秒）" hint="新建任务的默认值"><NumIn v={f.default_probe_timeout} min={1} max={120} on={(v) => set("default_probe_timeout", v)} /></SField>
        </SettingsGroup>

        <SettingsGroup title="数据与告警" icon="history">
          <SField label="数据保留天数" hint="时序数据超期自动清理"><NumIn v={f.data_retention_days} min={1} max={365} on={(v) => set("data_retention_days", v)} /></SField>
          <SField label="全局告警冷却（秒）" hint="同一任务两次告警的最小间隔"><NumIn v={f.global_alert_cooldown} min={0} max={86400} on={(v) => set("global_alert_cooldown", v)} /></SField>
        </SettingsGroup>

        <div className="row end" style={{ position: "sticky", bottom: 0, paddingTop: 4 }}>
          <button className="btn primary lg" onClick={save} disabled={busy}><Ic name="check" size={16} />{busy ? "保存中…" : "保存设置"}</button>
        </div>
      </div>
    </div>
  );
}

function SettingsGroup({ title, icon, children }) {
  return (
    <div className="card card-pad">
      <div className="row gap-8" style={{ marginBottom: 16 }}>
        <span style={{ width: 28, height: 28, borderRadius: 8, background: "var(--primary-soft)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Ic name={icon} size={16} /></span>
        <h3 className="h3" style={{ fontSize: 14.5 }}>{title}</h3>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "14px 24px" }}>{children}</div>
    </div>
  );
}
function SField({ label, hint, children }) {
  return (
    <div className="field" style={{ marginBottom: 0 }}>
      <label>{label}</label>
      {children}
      {hint && <div className="hint">{hint}</div>}
    </div>
  );
}
function NumIn({ v, min, max, on }) {
  return <input className="input num" type="number" min={min} max={max} value={v} onChange={(e) => on(e.target.value)} />;
}
