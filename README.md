# COMP 2406 Final Assignment
This is the final assignment for the COMP 2406 Fundamentals of Web Applications course at Carleton University

This Assignment is programmed in JavaScript using the Express.js framework and Pug template engine. It is a restaurant application where users
can register an account or sign into an existing account in the web app and can make orders to restaurants. The users can also view other users 
profiles and see their order history. The user can also change their privacy setting which makes their account visible to other users or not
visible to other users. The user profiles also store the particular users order history which is a link to the complete order and total cost.
The users are all kept trackj of using express sessions. All of the data for this web application is stored in a MongoDB database.

## How to run the code
1. Run the ```npm install``` command

### To start the Database
1. Change directories to your database's folder
2. Type ```mongod --dbpath=<database folder name>``` where inside the <> is the name of your database folder

### To start the server
1. To intialize the Database with some users type ```node database-initializer.js``` this will fill the database with some users
2. Then type ```node server.js``` to start the server

The server now should be running on http://localhost:3000.
