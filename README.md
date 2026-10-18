# Simple To-Do App (full-stack starter)

A beginner-friendly full-stack to-do app. React frontend, Express backend, tasks stored in a JSON file so there is no database to install.

## Run it

Terminal 1 (the API):
```
cd server
npm install
npm start
```

Terminal 2 (the UI):
```
cd client
npm install
npm run dev
```

Then open http://localhost:5173

## What to learn from it
- `server/server.js` is the API: the four CRUD routes (list, add, update, delete) and simple file persistence in `db.json`.
- `client/src/App.jsx` is the React side: how components hold state, call the API with fetch, and re-render.
- `client/vite.config.js` proxies `/api` to the backend so both pieces talk to each other.
