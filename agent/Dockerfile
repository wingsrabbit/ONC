FROM python:3.12-slim

# 让 stdout 不缓冲，docker logs 能实时看到日志
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# 构建上下文为仓库根（-f agent/Dockerfile .），以便一并拷入根 VERSION
# 先装依赖（用清华镜像源，国内拉取更快），利用层缓存
COPY agent/requirements.txt .
RUN pip install --no-cache-dir -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt

# v1.1 一键更新：装 docker CLI（仅 CLI，经挂载的 /var/run/docker.sock 指挥宿主 docker）+ git（拉源码重建镜像）
RUN apt-get update && apt-get install -y --no-install-recommends git curl ca-certificates \
  && curl -fsSL https://download.docker.com/linux/static/stable/x86_64/docker-27.3.1.tgz \
     | tar xz -C /usr/local/bin --strip-components=1 docker/docker \
  && rm -rf /var/lib/apt/lists/*

# 再拷贝 agent 代码 + 版本号文件
COPY agent/probes.py agent/resources.py agent/main.py agent/testserver.py ./
COPY VERSION ./VERSION

CMD ["python", "main.py"]
