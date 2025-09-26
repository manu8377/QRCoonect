CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL
  password TEXT NOT NULL;

);

CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  nonce TEXT NOT NULL,
  status TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  session_id UUID REFERENCES sessions(id),
  user_id TEXT REFERENCES users(id),
  timestamp TIMESTAMP DEFAULT NOW()
);
