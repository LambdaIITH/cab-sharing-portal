CREATE TABLE users
(
  user_email VARCHAR NOT NULL,
  phone_number NUMERIC(10) NOT NULL,
  PRIMARY KEY (user_email)
);

CREATE TABLE locations
(
  place VARCHAR NOT NULL,
  id BIGSERIAL NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE cab_booking
(
  id BIGSERIAL NOT NULL,
  date DATE NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  comments VARCHAR,
  capacity INT NOT NULL DEFAULT 4,
  from_loc INT,
  to_loc INT,
  PRIMARY KEY (id),
  FOREIGN KEY (from_loc) REFERENCES locations(id),
  FOREIGN KEY (to_loc) REFERENCES locations(id)
);

CREATE TABLE traveller
(
  user_email VARCHAR NOT NULL,
  id INT NOT NULL,
  PRIMARY KEY (user_email, id),
  FOREIGN KEY (user_email) REFERENCES users(user_email),
  FOREIGN KEY (id) REFERENCES cab_booking(id)
);

CREATE TABLE request
(
  status INT NOT NULL,
  booking_id INT NOT NULL,
  request_id INT NOT NULL,
  PRIMARY KEY (booking_id, request_id),
  FOREIGN KEY (booking_id) REFERENCES cab_booking(id),
  FOREIGN KEY (request_id) REFERENCES cab_booking(id)
);