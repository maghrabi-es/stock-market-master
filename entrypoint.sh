#!/bin/bash

cd /stock-market-api && yarn start:dev &> /dev/null &

cd /stock-market-frontend && yarn start
