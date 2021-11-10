#!/bin/sh

# 被合并的分支
branch=$1
# 主分支
mainBranch=$2
# 是否合并主分支
isMain=$3

git add .
git reset --hard HEAD

git checkout "${mainBranch}"

if [ "${isMain}" = "--main" ]; then
  git reset --hard origin/"${branch}"
  git reset --soft origin/"${mainBranch}"
else
  git merge --squash "${branch}"
fi