# TodoApi

A simple ASP.NET Core 8 Web API demonstrating a CRUD Todo list with structured logging and Swagger UI.

## Features

- Full CRUD REST API (`GET`, `POST`, `PUT`, `DELETE`) for Todo items
- **Swagger UI** – interactive API documentation at `/swagger`
- **Serilog** – structured console logging with per-request middleware

## NuGet Dependencies

| Package | Version | Purpose |
|---|---|---|
| `Serilog.AspNetCore` | 8.0.3 | Structured logging with ASP.NET Core integration |
| `Swashbuckle.AspNetCore` | 6.9.0 | OpenAPI / Swagger UI generation |

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

### Run

```bash
dotnet run --project TodoApi
```

The API starts on `https://localhost:5001` (or `http://localhost:5000`).

### Swagger UI

Open `http://localhost:5000/swagger` in your browser to explore and test the API interactively.

## API Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/todo` | List all todo items |
| `GET` | `/api/todo/{id}` | Get a todo item by ID |
| `POST` | `/api/todo` | Create a new todo item |
| `PUT` | `/api/todo/{id}` | Update an existing todo item |
| `DELETE` | `/api/todo/{id}` | Delete a todo item |

### Example Request

```bash
# Get all items
curl http://localhost:5000/api/todo

# Create a new item
curl -X POST http://localhost:5000/api/todo \
  -H "Content-Type: application/json" \
  -d '{"title": "Write tests", "isComplete": false}'
```

## Project Structure

```
TodoApi/
├── Controllers/
│   └── TodoController.cs   # CRUD endpoints
├── Models/
│   └── TodoItem.cs         # Data model
├── Program.cs              # App setup (Serilog + Swagger)
├── appsettings.json        # Serilog configuration
└── TodoApi.csproj          # Project file with NuGet references
```
