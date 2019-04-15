heroku container:login

dotnet publish -c Release 

cp dockerfile ./bin/release/netcoreapp2.2/publish

docker build -t voyager-arg-image ./bin/release/netcoreapp2.2/publish

docker tag voyager-arg-image registry.heroku.com/voyager-arg/web

docker push registry.heroku.com/voyager-arg/web

heroku container:release web -a voyager-arg

# sudo chmod 755 deploy.sh
# ./deploy.sh