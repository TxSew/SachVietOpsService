start:
	 npm run start:dev
# start database local
start-database:
		sudo /opt/lampp/lampp start
# create a new DB => create a new databaseName after migrate db
migrate-database:
	npx sequelize-cli db:migrate