FROM node:dubnium

COPY . .

RUN cd stock-market-api && yarn install

RUN cd stock-market-frontend && yarn install

RUN cp ormconfig.json stock-market-api/ormconfig.json

ENTRYPOINT ["/entrypoint.sh"]
