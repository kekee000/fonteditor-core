#!/bin/bash

fileDir=$(cd "$(dirname "$0")"; pwd)
projectDir=$(dirname "$fileDir")

cd $projectDir

echo "[npm publish]"

sh ./tool/build-node.sh

cd $projectDir

npm publish

sh ./tool/clean-node.sh

echo "[publish done]"
