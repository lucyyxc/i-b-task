CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(180),
    email VARCHAR(180),
    emailAgree bool,
    assignee VARCHAR(180),
    weddingDate VARCHAR(180),
    birthday VARCHAR(180),
    collabAdded bool,
    collabID int,
    sub bool,
    timeSelected VARCHAR(180),
    auth_id TEXT
);