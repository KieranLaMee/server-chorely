DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  household_id SMALLINT NOT NULL,
  name VARCHAR(30) NOT NULL,
  email VARCHAR(30) UNIQUE NOT NULL, 
  password VARCHAR(30) NOT NULL, 
  points SMALLINT,  
  monthly_points SMALLINT,
  avatar VARCHAR(30)
);

INSERT INTO users(household_id, name, email, password, points, monthly_points)
VALUES(-1, 'Frodo', 'frodo@gmail.com', 'theRingBearer', 340, 100), 
(-1, 'Aragorn', 'aragorn@gmail.com', 'returnedKing', 280, 150),
(-1, 'Gandalf', 'gandalf@gmail.com', 'theWhiteWizard', 140, 60),
(-1, 'Sauran', 'sauran@gmail.com', 'theLordoftheRings', 280, 0)
;

DROP TABLE IF EXISTS households CASCADE;
CREATE TABLE IF NOT EXISTS households(
  household_id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL,  
  address VARCHAR(30) NOT NULL,
  UNIQUE(name, address)
);

INSERT INTO households(name, address)
VALUES('Minas Tirith', 'Gondor, Middle Earth'),
('Rivendel', 'Trollshaws, Middle Earth'),
('Baradur', 'Mordor, Middle Earth')
;

DROP TABLE IF EXISTS chores CASCADE;
CREATE TABLE IF NOT EXISTS chores(
  chore_id SERIAL PRIMARY KEY,
  household_id SMALLINT NOT NULL,
  user_id SMALLINT NOT NULL,
  previous_user_id SMALLINT,
  due_date DATE NOT NULL,  
  points SMALLINT,  
  chore_name VARCHAR(30) NOT NULL
);

INSERT INTO chores(household_id, user_id, previous_user_id, due_date, points, chore_name)
VALUES(0, 1, 0, '20200523', 10, 'Kill Orcs'),
(0, 1, 1, '20200819', 100, 'Destory the Ring'),
(3, 1, 1, '20201028', 180, 'End the World of Men'),
(0, 1, 0, '20200523', 10, 'Take the Hobbits to Isengard'),
(0, 1, 1, '20200819', 100, 'Eat a lot'),
(3, 1, 1, '20201028', 180, 'Bow to no one')
;