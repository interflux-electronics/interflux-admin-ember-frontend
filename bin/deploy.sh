#!/usr/local/bin/fish

echo ----------
echo Updating production branch with master
echo ----------
echo git push
git push
echo ----------
echo git checkout production
git checkout production
echo ----------
echo git pull origin master
git pull origin master
echo ----------
echo git push
git push
echo ----------

set remote "jw@server.interflux.com"
set path "/var/www/admin.interflux.com"
set branch (git rev-parse --abbrev-ref HEAD)
set revision (git rev-parse --short HEAD)

echo Deploying to remote server
echo Branch: $branch
echo Revision: $revision
echo Remote: $remote
echo Path: $path
echo ----------

switch $branch
case production
  echo scp bin/install.sh $remote:$path
  scp bin/install.sh $remote:$path
  and echo ----------
  and echo ssh $remote "$path/install.sh $branch $revision"
  and ssh $remote "$path/install.sh $branch $revision"
  echo ----------
  echo git checkout master
  git checkout master
  and echo ----------
  and echo Deploy successful!
  and echo ----------
case '*'
    echo Aborting - Only the branch production is deployable.
    echo ----------
end
