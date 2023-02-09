ARG HTTP_PORT=80

FROM car_wash_frontend_base_img as build

FROM nginx:1.23.3-alpine

# config nginx
RUN mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf_orig
COPY --from=build /app/nginx/nginx.conf /etc/nginx/nginx.conf
RUN mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf_orig
COPY --from=build /app/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
RUN sed -i -e 's/replace_HTTP_PORT/${HTTP_PORT}/g' /etc/nginx/conf.d/default.conf

# copy site files
COPY --from=build /app/dist/car-wash-owner-panel /usr/share/nginx/html

EXPOSE ${HTTP_PORT}
