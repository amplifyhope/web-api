#!/bin/bash
# install yarn
sudo wget https://dl.yarnpkg.com/rpm/yarn.repo -O /etc/yum.repos.d/yarn.repo
sudo yum -y install yarn
# install
cd /var/app/current/
# debugging..
ls -lah
yarn