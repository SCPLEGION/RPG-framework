FROM node:20.19.4-alpine3.22

WORKDIR /app

COPY package*.json ./

RUN apt update && \
    apt upgrade -y && \
    apt install -y python3 python3-pip python3-venv make g++ ffmpeg && \
    python3 -m venv /opt/venv && \
    /opt/venv/bin/pip install --upgrade pip && \
    /opt/venv/bin/pip install vosk && \
    apt clean && rm -rf /var/lib/apt/lists/*

ENV PATH="/opt/venv/bin:$PATH"

RUN npm install && \
    npm install @solyarisoftware/voskjs@latest

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
