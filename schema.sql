DROP TABLE IF EXISTS conservation_activities CASCADE;
DROP TABLE IF EXISTS animals_threats CASCADE;
DROP TABLE IF EXISTS wildlife_sightings CASCADE;
DROP TABLE IF EXISTS animals CASCADE;
DROP TABLE IF EXISTS habitats CASCADE;
DROP TABLE IF EXISTS species CASCADE;
DROP TABLE IF EXISTS rangers CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- 1. roles table
CREATE TABLE roles(
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(20) UNIQUE NOT NULL
);

-- 2. users table
CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  role_id INT NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- 3. rangers table (rangers record the observations by tracking wildlife animals, perform assigned actions necessary against the threats )
CREATE TABLE rangers(
  ranger_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  experience_years INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  CONSTRAINT check_experience_years_positive CHECK (experience_years >= 0)
);

--4. Species table
CREATE TABLE species(
  species_id SERIAL PRIMARY KEY, 
  common_name VARCHAR(50) NOT NULL,
  conservation_status VARCHAR(50) NOT NULL,
  population INT NOT NULL
);

--5 Habitats table
CREATE TABLE habitats(
  habitat_id SERIAL PRIMARY KEY,
  country VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  ecosystem_type VARCHAR(50) NOT NULL
);

--6 Animals table
CREATE TABLE animals(
  animal_id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  species_id INT NOT NULL,
  habitat_id INT NOT NULL,
  gender VARCHAR(50) NOT NULL,
  FOREIGN KEY (species_id) REFERENCES species(species_id),
  FOREIGN KEY (habitat_id) REFERENCES habitats(habitat_id)
);

--7 Observation table
CREATE TABLE wildlife_sightings (
    sighting_id SERIAL PRIMARY KEY,
    animal_id INT NOT NULL, 
    habitat_id INT NOT NULL,
    ranger_id INT NOT NULL,
    sighting_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    count INT,
    threat_found BOOLEAN,
    FOREIGN KEY (habitat_id) REFERENCES habitats(habitat_id),
    FOREIGN KEY (animal_id) REFERENCES animals(animal_id),
    FOREIGN KEY (ranger_id) REFERENCES rangers(ranger_id)
);

--8 threats table
CREATE TABLE animals_threats (
    threat_id SERIAL PRIMARY KEY,
    animal_id INT NOT NULL, 
    sighting_id INT NOT NULL,
    threat_type VARCHAR(200) NOT NULL,
    threat_level VARCHAR(100) NOT NULL,
    FOREIGN KEY (animal_id) REFERENCES animals(animal_id),
    FOREIGN KEY (sighting_id) REFERENCES wildlife_sightings(sighting_id)
);


--9 conservation_activities (actions performed by the rangers against threats for the conservation of animals)
CREATE TABLE conservation_activities (
  activity_id SERIAL PRIMARY KEY,
  threat_id INT NOT NULL,
  performed_by INT,
  activity_name VARCHAR(300) NOT NULL,
  status VARCHAR(20) NOT NULL, 
  FOREIGN KEY (threat_id) REFERENCES animals_threats(threat_id),
  FOREIGN KEY (performed_by)  REFERENCES rangers(ranger_id)
);
