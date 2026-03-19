Game Tournament App
Description

This project is a fullstack application where users can manage tournaments and games.

The user can:

view all tournaments and their related games

create new tournaments and games

update existing data

delete tournaments and games

The application consists of:

a frontend built with HTML, CSS, and JavaScript (no frameworks)

a backend built with .NET Web API

a database connected via Entity Framework Core

The goal of the project is to demonstrate the full flow from user interaction in the browser to data stored in the database and back to the UI.

How to run the project
Backend (.NET API)

Open the project in Visual Studio or VS Code

Make sure the database connection string is set in appsettings.json

Run database migrations (if needed):

dotnet ef database update

Start the API:

dotnet run

The API will run on:

https://localhost:7003

http://localhost:5249

Swagger is available at:
https://localhost:7003/swagger

Frontend

Open index.html in your browser
or run it using Live Server

Make sure the backend is running at the same time

Backend structure

The backend is structured into:

Controllers (handle HTTP requests)

Services (contain business logic)

DTOs (data transfer objects)

Models (entities)

DbContext (database connection)

Controllers are kept thin and delegate logic to services.

Database

The project uses SQL Server with Entity Framework Core.

The database is used to:

store tournaments and games

retrieve data

update data

delete data

Relationship:

One tournament can have multiple games

Endpoints
Tournaments

GET /api/tournaments → get all
GET /api/tournaments/{id} → get by id
POST /api/tournaments → create
PUT /api/tournaments/{id} → update
DELETE /api/tournaments/{id} → delete

Games

GET /api/games → get all
GET /api/games/{id} → get by id
POST /api/games → create
PUT /api/games/{id} → update
DELETE /api/games/{id} → delete

Frontend

The frontend is built using:

HTML

CSS

JavaScript

DOM

fetch

The frontend can:

display data from the API

create new data through forms

update data using a modal

delete data

show feedback via toast notifications

How the frontend communicates with the API

The frontend uses fetch() to communicate with the API.

Example GET:

fetch("https://localhost:7003/api/tournaments")

Example POST:

fetch("https://localhost:7003/api/tournaments", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(payload)
});

Data is sent and received as JSON.

Games are linked to tournaments using:

game.tournamentId === tournament.id

The DOM is used to:

dynamically render data

handle user input

update the UI

Reflection
What went well

Clear structure between frontend and backend

Full CRUD functionality implemented

Services made the backend more organized

UI became user-friendly with modals and toast notifications

What was challenging

CORS issues in the beginning

HTTPS certificate issues in Postman

JSON cycle/reference problems between entities

validation (e.g. future date requirement)

matching frontend and backend data structures

What I learned

how frontend and backend communicate

how to use services in a .NET API

how to connect an API to a database

how to use DOM and fetch in frontend

how to debug API and network issues

Summary

This project fulfills the requirements of a fullstack application where:

a .NET API is used with controllers and services

a database is managed using Entity Framework Core

the frontend communicates with the API using fetch

DOM is used to display and update data
