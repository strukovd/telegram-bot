#!/bin/bash

SERVICE_NAME=telegram-bot
REMOTE_ADDRESS='212.113.123.59'
REMOTE_USER=root

# Up-аем версию
PREV_VERSION=$(cat package.json | awk '/"version[ :"]*[0-9]*\.[0-9]*\.[0-9]*",/ {print $0}' | sed -s 's:[^0-9\.]*::g')
FIRST_PART_OF_VERSION=$(echo $PREV_VERSION | grep -P '^[0-9]+\.[0-9]+\.' -o)
PREV_BUILD_NUM=$(echo $PREV_VERSION | grep -P '[0-9]+$' -o)
CUR_BUILD_NUM=$(($PREV_BUILD_NUM+1))
CUR_VERSION="$FIRST_PART_OF_VERSION$CUR_BUILD_NUM"
# Обновляем версию в файле
sed -i "s@\"version\"[: \t]*\"[0-9\.]*\"@\"version\": \"$CUR_VERSION\"@" package.json
echo "Build version upgraded: $PREV_VERSION -> $CUR_VERSION"

# Меням исполнителя
GIT_USER=$(git config user.name)
sed -i "s@\"assigneer\".*@\"assigneer\": \"$GIT_USER\",@" package.json

# Билдим и пушим
npm run build

echo "Build and push version: ${SERVICE_NAME}:${CUR_VERSION}"
docker build -t "${SERVICE_NAME}:${CUR_VERSION}" \
	--label "git_user=$GIT_USER" \
	--label "sys_info=$(uname -a)" \
	./

docker save ${SERVICE_NAME}:${CUR_VERSION} | ssh -C $REMOTE_USER@$REMOTE_ADDRESS docker load