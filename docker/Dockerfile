FROM nginx:latest

# RUN npm i -g pnpm
# RUN pnpm install
# RUN pnpm build

COPY ./dist /usr/share/nginx/html
COPY /docker/nginx.conf /etc/nginx/conf.d/default.conf

# 镜像对外暴露端口
EXPOSE 9527