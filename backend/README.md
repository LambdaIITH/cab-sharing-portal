## Cab Sharing Portal Backend

This folder contains the backend for the cab sharing portal.
The backend is built using FastAPI.

Prequisites:

- You must have [poetry](https://python-poetry.org) installed on your system.

Instructions to Start the Backend:

1. In this directory, run `poetry install`. This will install the required dependencies.
2. Then, run `poetry shell` to enter the poetry virtual environment.
3. Inside the shell, run `uvicorn main:app --reload`

Instructions to set up the database:

1. Install postgres
2. Go to the postgres shell and run `\i path/to/dump.sql` (There is a dump.sql file in /backend/).
3. Paste the `.env` file in backend/.

Other Requirements:

One must st the required configurations in a .env file for the routes to properly function
A sample env.example file has been provided for the same

#### Commit Guidelines
