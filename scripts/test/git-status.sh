#!/bin/bash

set -eu

if [ -n "$(git diff --raw)" ]; then
  echo "git repository is dirty"
  git diff
  exit 1
fi

if [ -n "$(git diff --cached --raw)" ]; then
  echo "git repository is dirty"
  git diff --cached
  exit 1
fi
