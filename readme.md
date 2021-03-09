# Mini Microservices App
A mini microservices event-driven practice project.

This app is created mainly using microservices architecture, docker, kubernetes, React, and Express.js.

## Installation 
make sure you have docker and kubernetes installed in your local enviorment, then clone this repository.

### Set Up Mock Hostname
In order to redirect all the traffic going to posts.com to localhost, add the following line to the end of you hosts file. You can safely delete this line after running this app.
```
127.0.0.1 posts.com
```

### Run the App
From the project's root directory, type in:
```
skaffold dev
```

## Architecture Overview
![](https://i.ibb.co/WPkr1Mv/mini-microservice-app.jpg)

## Micro-Services
There are 4 micro-services running on the backend. Each of them can work independently. They are communicating through the event bus.

- Post Service <br>
This service running on port 4000. It manages all the event related to posts, such as creating a post.

- Comments Service <br>
This service running on port 4001. It deals with all the event related to comments, such as creating a comment for a specific post.

- Query Service <br>
This service running on port 4002. This is a representation service. All the get request will go to this service, and this service will send back the required data to the front end.

- Moderation Service
This service running on port 4003. This service in charge of checking if the comment is valid. In this app, all the comment contains the word `orange` will be rejected.