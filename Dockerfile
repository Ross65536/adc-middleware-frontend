# Docker instructions
#
# docker build -t $USERNAME/adc-middleware-frontend:$VERSION .
# docker login --username $USERNAME
# docker push $USERNAME/adc-middleware-frontend:$VERSION


FROM node:14

WORKDIR /frontend

ADD package.json /frontend
ADD yarn.lock /frontend

RUN yarn install

ADD public /frontend/public
ADD src /frontend/src
ADD .env /frontend
ADD config/keycloak.prod.json /frontend/public/keycloak.json

RUN yarn build

FROM nginx

COPY --from=0 /frontend/build /usr/share/nginx/html