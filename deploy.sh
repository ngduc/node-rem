#!/bin/bash
docker build -t ngduc/node-rem .
docker push ngduc/node-rem

ssh deploy@$DEPLOY_SERVER << EOF
docker pull ngduc/node-rem
docker stop api-boilerplate || true
docker rm api-boilerplate || true
docker rmi ngduc/node-rem:current || true
docker tag ngduc/node-rem:latest ngduc/node-rem:current
docker run -d --restart always --name api-boilerplate -p 3009:3009 ngduc/node-rem:current
EOF
