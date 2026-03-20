# 🎮 Game Tournament App

A simple fullstack application for managing tournaments and games, built with .NET Web API and Vanilla JavaScript (DOM + fetch).


## 🚀 Features

📋 View all tournaments and their games

➕ Create new tournaments and matches

✏️ Update existing data

❌ Delete tournaments and matches

🔔 Real-time feedback with toast notifications


## 🧱 Tech Stack

Frontend

HTML

CSS

JavaScript (Vanilla)

DOM manipulation

Fetch API

Backend

ASP.NET Core Web API

Controllers + Services architecture

DTOs

Database

SQL Server

Entity Framework Core


## ⚙️ Getting Started
1. Clone the backend repository
git clone https://github.com/Johnjr1/GameTournaments
cd <your-project>
2. Run the Backend (.NET API)

Make sure you have .NET installed.

dotnet ef database update
dotnet run

API runs on:

https://localhost:7003

http://localhost:5249

Swagger UI:

https://localhost:7003/swagger


3. Run the Frontend

Open:

index.html

Or use Live Server in VS Code.

⚠️ Make sure the backend is running at the same time.

## 📡 API Endpoints
### 🎯 Tournaments
Method	Endpoint	Description
GET	/api/tournaments	Get all tournaments
GET	/api/tournaments/{id}	Get tournament by ID
POST	/api/tournaments	Create tournament
PUT	/api/tournaments/{id}	Update tournament
DELETE	/api/tournaments/{id}	Delete tournament
### 🎮 Games
Method	Endpoint	Description
GET	/api/games	Get all games
GET	/api/games/{id}	Get game by ID
POST	/api/games	Create game
PUT	/api/games/{id}	Update game
DELETE	/api/games/{id}	Delete game
🔄 Frontend ↔ Backend Communication

The frontend communicates with the API using the Fetch API.

#### Example (GET)
fetch("https://localhost:7003/api/tournaments")
Example (POST)
fetch("https://localhost:7003/api/tournaments", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(payload)
});

📦 Data is sent and received as JSON.

🔗 Games are linked to tournaments using:

game.tournamentId === tournament.id

### 🧠 The DOM is used to:

render data dynamically

handle user input

update the UI in real-time

### 🗄️ Database

SQL Server with Entity Framework Core

Stores tournaments and games

Supports full CRUD operations

Relationship:

One tournament → many games

### 🧩 Architecture

Controllers → Handle HTTP requests

Services → Business logic

DTOs → Data transfer

Models → Database entities

👉 Controllers are kept thin, logic lives in services.

## 💭 Reflection

### ✅ What went well
- Clean separation between frontend and backend  
- Full CRUD functionality working end-to-end  
- Services improved code structure and organization  
- UI became more user-friendly with modals and toast messages  

---

### ⚠️ Challenges
- CORS issues in the beginning  
- HTTPS certificate issues in Postman  
- JSON cycle/reference problems between entities  
- Validation (e.g. future date requirement)  
- Keeping frontend and backend in sync  

---

### 📚 What I learned
- The full flow: UI → API → database → UI  
- How to structure a .NET API using services  
- How to connect frontend with backend using fetch  
- How to debug API and network issues  
- The importance of user feedback and error handling  

---

### 🧩 Strengths
- Clear separation between controllers and services  
- Fully working CRUD functionality  
- Good integration between frontend, API, and database  
- Simple and clean structure that is easy to understand  

---

### ⚠️ Weaknesses
- Limited validation and error handling in some areas  
- No authentication or security implemented  
- Basic UI without advanced features  
- Some parts of the code could be more modular and reusable  

---

### 🚀 Improvements
- Add authentication and authorization  
- Improve validation and error handling  
- Refactor code for better structure and reuse  
- Add search, filtering, and improved UI features  
- Deploy the application to a live environment  

---

### 📌 Summary
This project demonstrates a complete fullstack application where:

- ✔️ .NET API uses controllers and services  
- ✔️ Database is managed with Entity Framework Core  
- ✔️ Frontend communicates with the API using fetch  
- ✔️ DOM is used for dynamic UI updates  
