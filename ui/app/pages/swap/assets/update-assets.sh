#!/usr/bin/env bash

DIR=$(dirname "$0")
node -e "require('./${DIR}/lib').main()"
