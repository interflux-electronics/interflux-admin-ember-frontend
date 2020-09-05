#!/usr/bin/env bash

set -e
set -o pipefail

user=bot
server=sydney.floatplane.dev
domain=moovin.rentals
repo=git@github.com:janwerkhoven/moovin.rentals.git

echo "----------"
echo "Setting up $domain on server $server"
echo "----------"

(
  set -x
  scp -i ~/.ssh/$user@$server remote/setup-remote.sh $user@$server:~/
  ssh -i ~/.ssh/$user@$server -t $user@$server "~/setup-remote.sh $domain $repo; rm -f ~/setup-remote.sh"
)
