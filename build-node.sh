#!/bin/bash

# check edp
type edp >/dev/null 2>&1 || { echo >&2 "Please install edp.  Aborting."; exit 1; }

# fonteditor-core node build

edp build --config ./edp-build-config-node.js --force

echo "asset path：node"
