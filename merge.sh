#!/bin/sh

# 被合并的分支
branch=$1
# 主分支
mainBranch=$2

git add .
git reset --hard HEAD

git checkout "${mainBranch}"

if [ "${mainBranch}" = "master" ]; then
  git merge --squash "${branch}"
  read -p "手动提交：" isCommit
  if [ "${isCommit}" = "1" ]; then
      git checkout "${branch}"
      git merge "${mainBranch}"
  fi
else
  git merge "${branch}"
fi