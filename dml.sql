INSERT INTO roles(role_name)VALUES 
('Admin'),
('Ranger');

INSERT INTO users(role_id, full_name, email, password)VALUES 
(1, 'System administrator', 'admin@wildlife.org', 'admin123'),
(2, 'Sarah Kimani', 'sarakimani@wildlife.org', 'sara432'),
(2, 'Michael Brown', 'michaelbrown@wildlife.org', 'michael123'),
(2, 'Kamil Otieno', 'kamilotieno@wildlife.org', 'kamil543'),
(2, 'Camila rey', 'camilarey@wildlife.org', 'camila321');

INSERT INTO rangers(user_id, experience_years)VALUES
(2, 8),
(3, 6),
(4, 10),
(5, 4);

INSERT INTO habitats(country, location, ecosystem_type)VALUES
('Tanzania', 'Serengeti National Park', 'Savanna'),

('Kenya', 'Samburu National Reserve', 'Semi-Arid Savanna')

('South Africa', 'Kruger National Park', 'Bushveld'),

('Botswana', 'Okavango Delta', 'Wetland'),

('Namibia', 'Etosha National Park', 'Desert'),

('Uganda', 'Bwindi Forest', 'Rainforest'),

('Rwanda', 'Volcanoes National Park', 'Mountain Forest'),

('Kenya', 'Amboseli National Park', 'Savanna');


INSERT INTO species(common_name, conservation_status, population) VALUES
('African Buffalo', 'Least Concern', 900000),

('Hippopotamus', 'Least Concern', 115000),

('African Lion', 'Vulnerable', 23000),

('Cheetah', 'Vulnerable', 7100),

('Giraffe', 'Vulnerable', 117000),

('African Elephant', 'Endangered', 415000),

('African Wild Dog', 'Endangered', 6600),

('Mountain Gorilla', 'Endangered', 1063),

('Black Rhinoceros', 'Critically Endangered', 5500),

('Addax', 'Critically Endangered', 100),

('Zebra', 'Endangered', 3000);

INSERT INTO animals(name, species_id, habitat_id,gender) VALUES
-- Lions
('Simba', 3, 1, 'Male'),
('Nala', 3, 1, 'Female'),
-- Elephant
('Tembo', 6, 8, 'Male'),
-- Rhino
('Shadow', 9, 3, 'Male'),
-- Giraffe
('Tallneck', 5, 1, 'Female'),
-- Gorilla
('Rafiki', 8, 6, 'Male'),
-- Wild Dog
('Hunter', 7, 5, 'Male'),
--Zebra
('Kifaru', 11, 8, 'Female');

INSERT INTO wildlife_sightings(animal_id, habitat_id, ranger_id,sighting_date, count, threat_found) VALUES
-- Lion monitoring
(1, 1, 1, '2026-05-01 08:15:00', 2, FALSE),
(2, 1, 1, '2026-05-02 09:10:00', 3, FALSE),
-- Elephant threat observation
(3, 8, 2 ,'2026-05-03 11:09:00',5, TRUE),
-- Rhino threat observation
(4, 3, 3,'2026-05-04 09:45:00', 3,TRUE),
-- Giraffe injury observation
(5, 1, 4, '2026-05-05 17:30:00', 1, TRUE),
-- Gorilla observation
(6, 6, 2, '2026-05-06 09:00:00', 4, TRUE),
-- Wild dog habitat observation
(7, 5, 4, '2026-05-07 18:10:00', 2, TRUE),
--Zebra water access
(8, 8, 3, '2026-05-12 16:30:00', 6, TRUE);

INSERT INTO animals_threats(animal_id, sighting_id, threat_type, threat_level)VALUES

(3,3,'Poaching Trap Presence','Critical'),

(4,4,'Illegal Hunting Activity','Critical'),

(5,5,'Snare Wire Injury','High'),

(6,6,'Human Disease Transmission','Medium'),

(7,7,'Habitat Destruction','Medium'),

(8, 8, 'Drought and Water Scarcity', 'High');

INSERT INTO conservation_activities(threat_id, performed_by, activity_name, status)VALUES
-- Elephant poaching threat
(1,2,'Remove poaching traps near elephant corridor','Completed'),

-- Rhino illegal hunting threat
(2,3,'Deploy rhino anti-poaching patrol','In progress'),

-- Giraffe injury threat
(3,1,'Provide veterinary treatment for injured giraffe','Planned'),

-- Gorilla tourism disturbance
(4,2,'Enforce tourist distance restriction near gorilla groups','Completed'),

-- Wild dog habitat destruction
(5,1,'Investigate habitat destruction area','Completed'),

-- Zebra restore water points
(6, 4, 'Restore emergency water access points', 'In progress' );
