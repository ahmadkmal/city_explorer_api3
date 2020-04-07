DROP TABLE IF EXISTS data;
CREATE TABLE data (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(255),
  location json,
  weather json,
  trails json
);