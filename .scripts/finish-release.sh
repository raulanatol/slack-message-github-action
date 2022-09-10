#!/usr/bin/env bash

set -eu

function error() {
  echo "🚨 $1"
  exit 1
}

if [ $# != 1 ]; then
  error "Please specify the version number: sh .scripts/finish-release.sh patch|minor|major"
fi

NEW_VERSION=$1
BRANCH=$(git rev-parse --abbrev-ref HEAD)

function check_branch() {
  if [ "${BRANCH}" == 'main' ]; then
    echo "Main branch"
  else
    error "Invalid branch name ${BRANCH}"
  fi
}

function git_pull() {
  git pull origin main
}

function is_duplicated_tag() {
  if git rev-parse v"${NEW_VERSION}" >/dev/null 2>&1; then
    error "Duplicated tag"
  fi
}

function uncommitted_changes() {
  if [[ $(git status --porcelain) ]]; then
    error "There are uncommitted changes in the working tree."
  fi
}

function git_push() {
  git push -u origin main && git push --tags
}

function change_version() {
  npm version "${NEW_VERSION}"
}

publish() {
  npm publish --access public
  git push --tags
}

git_pull
uncommitted_changes
check_branch
is_duplicated_tag
change_version
publish
git_push
