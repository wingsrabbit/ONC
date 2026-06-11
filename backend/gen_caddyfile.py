"""容器启动时执行：依据 DB 当前设置生成 /etc/caddy/Caddyfile，供 Caddy 首次启动加载。
（之后管理后台切换 HTTPS 模式时由 webserver.apply_settings 重写 + 热重载。）
DB 不存在时 init_db 会建库并落默认设置（web_mode=http），即生成最简 HTTP:80 反代。
"""
import sys

try:
    import db
    import webserver

    db.init_db()
    s = db.get_settings()
    webserver.write_caddyfile(s)
    sys.stderr.write("[gen_caddyfile] mode=%s domain=%s -> %s\n" % (
        s.get("web_mode", "http"), s.get("web_domain", ""), webserver.CADDYFILE_PATH))
except Exception as e:  # 出错也不阻断启动，entrypoint 有兜底 Caddyfile
    sys.stderr.write("[gen_caddyfile] FAILED: %r (will fall back)\n" % e)
    sys.exit(1)
