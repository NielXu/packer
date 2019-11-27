#!/usr/bin/env bash

# This script will do the following job:
# 1. Pull database image if not exists on local
# 2. Start a container with the image
# Note: The container will be removed after it stopped
# to disable that, remove the `--rm` flag

if [[ "$(docker images -q mysql 2> /dev/null)" == "" ]]; then
    docker pull mysql
fi

if [[ "$(docker ps -a | grep webapp_database)" == "" ]]; then
    docker run --rm --name webapp_database -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password mysql --default-authentication-plugin=mysql_native_password
    echo MySQL container[webapp_database] started at port 3306
else
    echo MySQL container[webapp_database] already running at port 3306
fi
