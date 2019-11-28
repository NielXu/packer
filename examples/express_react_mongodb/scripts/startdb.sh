#!/usr/bin/env bash

# This script will do the following job:
# 1. Pull database image if not exists on local
# 2. Start a container with the image
# Note: The container will be removed after it stopped
# to disable that, remove the `--rm` flag

if [[ "$(docker images -q mongo 2> /dev/null)" == "" ]]; then
    docker pull mongo
fi

if [[ "$(docker ps -a | grep webapp_database)" == "" ]]; then
    docker run --rm --name webapp_database -d -p 27017:27017  mongo
    echo Mongo container[webapp_database] started at port 27017
else
    echo Mongo container[webapp_database] already running at port 27017
fi
