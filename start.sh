#!/usr/bin/env bash

MOCO_START_PORT=12306
MOCO_STOP_PORT=9527

## 检查12306端口是否占用
check_port() {
    lsof -i:$1 | grep "\b$1\b"
}

if check_port $MOCO_START_PORT
then
    java -jar spec/support/moco-runner-0.10.2-standalone.jar shutdown -s $MOCO_STOP_PORT
fi

## nohup 方式启动
nohup java -jar spec/support/moco-runner-0.10.2-standalone.jar http -p 12306 -g spec/support/paper-api.json -s 9527 > /dev/null &
## development 环境启动 npm start 方式启动
export NODE_ENV=development && ./node_modules/.bin/nodemon app.js