#!/usr/bin/env bash

set -eo pipefail
PS4="command: "
set -x
if [ -z $REMOTE_SERVER_IP ]
then
  echo "Please Set the REMOTE_SERVER_IP"
  exit 1
fi

npm install

zip -qr web-api.zip ./
scp web-api.zip $REMOTE_SERVER_IP:/home/ubuntu/twars
ssh -T $REMOTE_SERVER_IP 'unzip -qo /home/ubuntu/twars/web-api.zip -d /home/ubuntu/twars/web-api'
ssh -T $REMOTE_SERVER_IP 'rm /home/ubuntu/twars/web-api.zip'
