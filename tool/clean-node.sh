#!/bin/bash

fileDir=$(cd "$(dirname "$0")"; pwd)
projectDir=$(dirname "$fileDir")

cd $projectDir

echo "[clean node]: ./"

if [ -d ./node ]; then

    ls -l ./node | awk '{if($9) print " \
    if [ -a "$9" ]; then \
        rm -r ./"$9" \
    fi"}' | sh

    rm -r ./node

fi

echo "[done]"
