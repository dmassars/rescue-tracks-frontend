FROM node:10

EXPOSE 4200

WORKDIR /rescue_tracks

COPY package.json package-lock.json ./

RUN npm i --depth=0 \
    && npm rebuild node-sass --force

ENV PATH="./node_modules/.bin/:${PATH}"

COPY . /rescue_tracks/

CMD ["ng", "serve"]
