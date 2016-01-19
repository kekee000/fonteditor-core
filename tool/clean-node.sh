#!/bin/bash

fileDir=$(cd "$(dirname "$0")"; pwd)
projectDir=$(dirname "$fileDir")

cd $projectDir

echo "[clean node]: ./"

if [ -d ./node ]; then


    ls ./node | xargs -I {} rm -r {}

    rm -r ./node

fi

echo "[clean done]"
