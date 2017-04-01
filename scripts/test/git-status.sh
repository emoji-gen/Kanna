#!/bin/bash

set -eu

if [ -n "$(git diff --raw)" ]; then
  echo "git repository is dirty"
  git --no-pager diff
  exit 1
fi

if [ -n "$(git diff --cached --raw)" ]; then
  echo "git repository is dirty"
  git --no-pager diff --cached
  exit 1
fi
