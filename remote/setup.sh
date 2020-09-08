#!/usr/bin/env bash

set -e
set -o pipefail

user=bot
server=server.interflux.com
domain=admin.interflux.com
repo=git@github.com:interflux-electronics/admin.interflux.com.git

echo "----------"
echo "Setting up $domain on server $server"
echo "----------"

(
  set -x
  scp -i ~/.ssh/$user@$server remote/setup-remote.sh $user@$server:~/
  ssh -i ~/.ssh/$user@$server -t $user@$server "~/setup-remote.sh $domain $repo; rm -f ~/setup-remote.sh"
)
