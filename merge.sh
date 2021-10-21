#!/bin/sh

branch1=$1
branch2=$2

git checkout "${branch2}"
git reset --hard origin/"${branch1}"
git reset --soft origin/"${branch2}"

rm -rf dist
npm run build