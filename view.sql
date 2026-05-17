--View 1: Animal Full Details
CREATE OR REPLACE VIEW view_animal_details AS
SELECT 
    a.animal_id,
    a.name AS animal_name,
    a.gender,
    s.common_name AS species,
    s.conservation_status,
    s.population,
    h.country,
    h.location,
    h.ecosystem_type
FROM animals a
JOIN species s ON a.species_id = s.species_id
JOIN habitats h ON a.habitat_id = h.habitat_id;

SELECT * FROM view_animal_details;

--View 2: Ranger Performance Summary

CREATE OR REPLACE VIEW view_ranger_performance AS
SELECT 
    r.ranger_id,
    u.full_name AS ranger_name,
    u.email,
    r.experience_years,
    COUNT(ws.sighting_id) AS total_sightings,
    COALESCE(SUM(ws.count), 0) AS total_animals_seen
FROM rangers r
JOIN users u ON r.user_id = u.user_id
LEFT JOIN wildlife_sightings ws ON r.ranger_id = ws.ranger_id
GROUP BY r.ranger_id, u.full_name, u.email, r.experience_years;

SELECT * FROM view_ranger_performance;

--View 3: Threat Management Report

CREATE OR REPLACE VIEW view_threat_management AS
SELECT 
    at.threat_id,
    a.name AS animal_name,
    at.threat_type,
    at.threat_level,
    ws.sighting_date,
    h.location AS habitat_location,
    h.country,
    ca.activity_name,
    ca.status AS activity_status
FROM animals_threats at
JOIN animals a ON at.animal_id = a.animal_id
JOIN wildlife_sightings ws ON at.sighting_id = ws.sighting_id
JOIN habitats h ON ws.habitat_id = h.habitat_id
LEFT JOIN conservation_activities ca ON at.threat_id = ca.threat_id;

SELECT * FROM view_threat_management;