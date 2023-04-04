## Getting started

# Run locally

- You will need to get the proper environment variables of course and populate the .env file

- you will need to install mongodb and make sure it is running in the background.

- run npm install if this is your first time cloning the app.

- run "npm run start" this should start your app.

# Run with Docker

- You need to make sure you install docker on your desktop to run build your images and run your containers

- populate the docker-compose.yml file with the proper env variables

- Once you have docker installed cd into this directory

- run command "docker-compose build"
    - This will build your project into an image

- run command "docker-compose up"
    - This will run your image into 2 separate containers 1 for mongodb && 1 for the app

- go to url http://localhost:3000/health if you see "healthy" then your app is running.