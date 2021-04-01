I pretty much just followed lab 7.

To start the server/website:

docker-compose up

If you want to change the create.sql file and it's not working after restarting,
this probably deletes all docker data but it's the only one i could get to delete the database after it is created:

docker volume rm $(docker volume ls -q)

Theoretically, we should be able to make requests to a URL using the chorely app to this server to connect the two but I'm not 100% sure that's how it works yet.
