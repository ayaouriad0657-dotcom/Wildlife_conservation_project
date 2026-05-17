-- QUERY 1: Animals with habitat information
SELECT 
    a.animal_id,
    a.name AS animal_name,
    s.common_name AS species,
    h.location AS habitat_location,
    h.ecosystem_type,
    a.gender
FROM animals a
JOIN species s ON a.species_id = s.species_id
JOIN habitats h ON a.habitat_id = h.habitat_id
ORDER BY a.name;
-- QUERY 2 number of animals per species
SELECT 
 s.common_name AS species,
 COUNT(a.animal_id) AS total_animals
 FROM species s
 LEFT JOIN animals a
 ON s.species_id = a.species_id
 GROUP BY s.common_name
 ORDER BY total_animals DESC;
-- QUERY 3 SIGHTINGS Recorded by each ranger 
SELECT 
    u.full_name AS ranger_name,
    COUNT(ws.sighting_id) AS total_sightings
FROM wildlife_sightings ws
JOIN rangers r 
ON ws.ranger_id = r.ranger_id
JOIN users u 
ON r.user_id = u.user_id
GROUP BY u.full_name
ORDER BY total_sightings DESC;
-- QUERY 4 — Threat Reports with Animal and Ranger Details
SELECT 
    at.threat_id,
    a.name AS animal_name,
    at.threat_type,
    at.threat_level,
    ws.sighting_date,
    u.full_name AS reported_by
FROM animals_threats at
JOIN animals a 
ON at.animal_id = a.animal_id
JOIN wildlife_sightings ws 
ON at.sighting_id = ws.sighting_id
JOIN rangers r 
ON ws.ranger_id = r.ranger_id
JOIN users u 
ON r.user_id = u.user_id
ORDER BY ws.sighting_date DESC;
--QUERY 5 — Average Population by Conservation Status
SELECT 
    conservation_status,
    COUNT(*) AS species_count,
    ROUND(AVG(population), 2) AS average_population,
    MIN(population) AS min_population,
    MAX(population) AS max_population,
    CASE 
        WHEN ROUND(AVG(population), 2) < 10000 THEN 'CRITICAL - Extreme Risk'
        WHEN ROUND(AVG(population), 2) < 100000 THEN 'ENDANGERED - High Risk'
        WHEN ROUND(AVG(population), 2) < 500000 THEN 'VULNERABLE - Medium Risk'
        ELSE 'STABLE - Low Risk'
    END AS population_risk_level
FROM species
GROUP BY conservation_status
ORDER BY average_population ASC;
-- QUERY 6 — High and Critical Threats with Conservation Activities using subquery
SELECT 
    a.name AS animal_name,
    at.threat_type,
    at.threat_level,
    ca.activity_name,
    ca.status
FROM animals_threats at
JOIN animals a 
ON at.animal_id = a.animal_id
LEFT JOIN conservation_activities ca 
ON at.threat_id = ca.threat_id
WHERE at.threat_id IN (
    SELECT threat_id
    FROM animals_threats
    WHERE threat_level IN ('High', 'Critical')
)
ORDER BY at.threat_level;

--QUERY 7 — Count endangered species per habitat 
SELECT 
    h.location,
    h.ecosystem_type,
    COUNT(a.animal_id) AS endangered_species_count
FROM habitats h
JOIN animals a 
ON h.habitat_id = a.habitat_id
JOIN species s 
ON a.species_id = s.species_id
WHERE s.conservation_status = 'Endangered'
GROUP BY h.location, h.ecosystem_type
ORDER BY endangered_species_count DESC;

--QUERY 8 performance summary of rangers 
SELECT u.full_name AS rangers, COUNT(ca.activity_id) AS activities,
       SUM(CASE WHEN ca.status = 'Completed' THEN 1 ELSE 0 END) AS completed
FROM rangers r
JOIN users u ON r.user_id = u.user_id
LEFT JOIN conservation_activities ca ON r.ranger_id = ca.performed_by
GROUP BY u.full_name
ORDER BY COUNT(ca.activity_id) DESC;


--FUNCTION: to return the number of animals in a given habitat
CREATE OR REPLACE FUNCTION animals_in_habitat(habitatId INT)
RETURNS INT AS
$$
DECLARE
    animal_total INT;
BEGIN

    SELECT COUNT(*)
    INTO animal_total
    FROM animals
    WHERE habitat_id = habitatId;

    RETURN animal_total;

END;
$$
LANGUAGE plpgsql;

SELECT animals_in_habitat(5);
-- FUNCTION: get the total threats detected by certain ranger
CREATE OR REPLACE FUNCTION ranger_total_threats(
    p_ranger_id INT
)
RETURNS INT
LANGUAGE plpgsql
AS
$$
DECLARE
    total_threats INT;
BEGIN

    SELECT COUNT(*) 
    INTO total_threats
    FROM wildlife_sightings
    WHERE ranger_id = p_ranger_id
    AND threat_found = TRUE;

    RETURN total_threats;
END;
$$;
SELECT ranger_total_threats(3);
-- Automatically trigger new threat record when a sighting inserted shows a threat detection
CREATE OR REPLACE FUNCTION auto_create_threat()
RETURNS TRIGGER
LANGUAGE plpgsql
AS
$$
BEGIN

    IF NEW.threat_found = TRUE THEN

        INSERT INTO animals_threats
        (
            animal_id,
            sighting_id,
            threat_type,
            threat_level
        )
        VALUES
        (
            NEW.animal_id,
            NEW.sighting_id,
            'Unidentified Threat',
            'Unidentified level'
        );

    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_auto_create_threat
AFTER INSERT
ON wildlife_sightings
FOR EACH ROW
EXECUTE FUNCTION auto_create_threat();
CALL add_wildlife_sighting(1, 2, 3, CURRENT_TIMESTAMP, 5, TRUE);

--automatically resolve the related threats after completed activity
CREATE OR REPLACE FUNCTION resolve_threat_after_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
AS
$$
BEGIN
    IF NEW.status = 'Completed' THEN

        UPDATE animals_threats
        SET threat_type = 'No threat', threat_level= 'none'
        WHERE threat_id = NEW.threat_id;
    END IF;
    RETURN NEW;
END;
$$;
 
CREATE TRIGGER trg_resolve_threat
BEFORE UPDATE
ON conservation_activities
FOR EACH ROW
EXECUTE FUNCTION resolve_threat_after_activity();

--add new sighting records 
CREATE OR REPLACE PROCEDURE add_wildlife_sighting(
    p_animal_id INT,
    p_habitat_id INT,
    p_ranger_id INT,
    p_sighting_date TIMESTAMP,
    p_count INT,
    p_threat_found BOOLEAN
)
LANGUAGE plpgsql
AS
$$
BEGIN

    INSERT INTO wildlife_sightings
    (
        animal_id,
        habitat_id,
        ranger_id,
        sighting_date,
        count,
        threat_found
    )
    VALUES
    (
        p_animal_id,
        p_habitat_id,
        p_ranger_id,
        p_sighting_date,
        p_count,
        p_threat_found
    );
END;
$$;

CALL add_wildlife_sighting(1, 2, 3, CURRENT_TIMESTAMP, 5, TRUE);
--assign a conservation activity against a threat
CREATE OR REPLACE PROCEDURE add_conservation_activitiy(
    p_threat_id INT,
    p_performed_by INT,
    p_activity_name VARCHAR,
    p_staus VARCHAR
)
LANGUAGE plpgsql
AS
$$
BEGIN

    INSERT INTO conservation_activities
    (
        threat_id,
        performed_by,
        activity_name,
        status
    )
    VALUES
    (
        p_threat_id,
        p_performed_by,
        p_activity_name,
        p_status
    );
END;
$$;
CALL add_conservation_activitiy(8, 3, 'Patrol Area', 'Completed');