## Building and Running the application

### Prerequisites
Kindly ensure you have the following tools installed.
1. Docker [Installation Instructions here](https://docs.docker.com/engine/install/)
2. Docker Compose [Installation Instructions here](https://docs.docker.com/compose/install/)

There exists a `docker-compose.yml` file in the root folder, this is used to encapsulate the two services that will be running for this project.
1. The web application
2. The MySQL database

The `Dockerfile` is required to build the web application and contains the logic to initialize, bundle and start the web application.
The `entrypoint.sh` file is the exact script that is run in order to initialize the web application in the docker container.


The `docker-compose.yml` contains the logic to initialize the mysql database and to set the database credentials before the application is run. It ensures that the database is running before the web application is built and run.
It also allows `volumes` which ensures that the data stored in the database, is not volatile. This means that whenever we stop the container, and start it again, we do not lose the database.


# Micro-service Information
We are exposing two services in the web container. 
Port 3000 - the user facing application, to be accessed on the user's web browser.
Port 5000 - the web application interface (API), which interacts with the database and contains all the business logic. It runs on a NodeJS base compiler. 
            It is run in the background, hence the logs that appear in the docker output are only for the web application.

The MySQL service is not exposed to the host machine, as it is only required through the docker network, and accessed by the Web API.

## Database Configuration
There exists an ormconfig.json file which describes all the database configuration requirements. This includes the database URL, database username and password, port and database name.
The database host is set to the name of the mysql service in  `docker-compose.yml`

## Building and running the docker images.
The first step is to build the web application.

```bash
docker-compose build web
```

The next step is to create the database volume. This will ensure data persistence whenever the container is destroyed or stopped.
```bash
docker volume create --name=stock_market_data
```

The final step is to run the web application on the container
```bash
docker-compose up web
```

### To build and run in a single command you can use
```bash
docker-compose up --build web
```

## Accessing the web client
Open the following link on your browser to access the frontend

`http://localhost:3000`
