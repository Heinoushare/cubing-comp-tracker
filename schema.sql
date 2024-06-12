-- DROP TABLE users;
-- DROP TABLE competition_zones;
-- DROP TABLE competitions;
-- DROP TABLE persons;

-- users
CREATE TABLE IF NOT EXISTS users (id INTEGER, wca_id TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL, PRIMARY KEY(id));
CREATE UNIQUE INDEX IF NOT EXISTS wca_id ON users (wca_id);
CREATE UNIQUE INDEX IF NOT EXISTS email ON users (email);

-- competition zones
CREATE TABLE IF NOT EXISTS competition_zones (
    zone_id INTEGER, user_id INTEGER NOT NULL, name TEXT NOT NULL,
    latitude REAL NOT NULL, longitude REAL NOT NULL, radius INTEGER NOT NULL , radius_units TEXT NOT NULL, 
    PRIMARY KEY (zone_id), FOREIGN KEY(user_id) REFERENCES users(id));

-- competitions
CREATE TABLE IF NOT EXISTS competitions (
    row_id INTEGER, competition_id TEXT NOT NULL, name TEXT NOT NULL, 
    city TEXT NOT NULL, country TEXT NOT NULL, 
    date_from TEXT NOT NULL, date_till TEXT NOT NULL, 
    events TEXT NOT NULL, 
    venue_address TEXT NOT NULL, venue_latitude REAL NOT NULL, venue_longitude REAL NOT NULL,
    PRIMARY KEY(row_id));

-- persons
CREATE TABLE IF NOT EXISTS persons (
    row_id INTEGER, wca_id TEXT NOT NULL, name TEXT NOT NULL, 
    numberOfCompetitions INTEGER NOT NULL, competitionIds TEXT NOT NULL, 
    rank TEXT NOT NULL, results TEXT NOT NULL,
    PRIMARY KEY (row_id));