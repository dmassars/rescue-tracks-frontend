FROM node:10

EXPOSE 4200

WORKDIR /rescue_tracks

COPY package.json .

RUN npm i --depth=1

ENV PATH="./node_modules/.bin/:${PATH}"

COPY . /rescue_tracks/

CMD ["ng", "serve", "-H", "0.0.0.0"]
