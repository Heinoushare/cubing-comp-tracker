-- DROP TABLE users;
-- DROP TABLE competition_zones;
CREATE TABLE IF NOT EXISTS users (id INTEGER, wca_id TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL, PRIMARY KEY(id));
CREATE UNIQUE INDEX IF NOT EXISTS wca_id ON users (wca_id);
CREATE UNIQUE INDEX IF NOT EXISTS email ON users (email);

CREATE TABLE IF NOT EXISTS competition_zones (zone_id INTEGER, user_id INTEGER NOT NULL, latitude REAL NOT NULL, longitude REAL NOT NULL, radius INTEGER NOT NULL , radius_units TEXT NOT NULL, PRIMARY KEY (zone_id), FOREIGN KEY(user_id) REFERENCES users(id))