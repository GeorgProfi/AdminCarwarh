ARG HTTP_PORT=80

FROM car-wash-frontend as build

FROM nginx:1.23.3-alpine

# config nginx
RUN mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf_orig
COPY --from=build /app/nginx/nginx.conf /etc/nginx/nginx.conf
RUN mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf_orig
COPY --from=build /app/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

# copy site files
COPY --from=build /app/dist/car-wash-owner-panel /usr/share/nginx/html
COPY --from=build /app/port /usr/share/nginx/html/port
RUN PORT=$(cat /usr/share/nginx/html/port) && sed -i 's/replace_HTTP_PORT/'"${PORT}"'/g' /etc/nginx/conf.d/default.conf

EXPOSE ${HTTP_PORT}
