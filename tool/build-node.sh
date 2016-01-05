#!/bin/bash

fileDir=$(cd "$(dirname "$0")"; pwd)
projectDir=$(dirname "$fileDir")

cd $projectDir

# check edp
type edp >/dev/null 2>&1 || { echo >&2 "Please install edp.  Aborting."; exit 1; }

echo "[edp build]: ./node"

edp build --config ./edp-build-config-node.js --force

echo "[asset node]: ./"

if [ -d ./node ]; then

    ls -l ./node | awk '{if($9) print " \
    if [ -a "$9" ]; then \
        rm -r ./"$9" \
    fi"}' | sh

    cp -r ./node/* ./

fi

echo "[done]"


