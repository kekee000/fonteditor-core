#/bin/bash
fileDir=$(cd "$(dirname "$0")"; pwd)
projectDir=$(dirname "$fileDir")
cd $projectDir

source $projectDir/tool/build-node.sh
node $projectDir/test/node-spec/main.js
source $projectDir/tool/clean-node.sh
