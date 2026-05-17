// console.log("script running");



// LOAD ANIMALS
async function loadAnimals() {

    const { data, error } = await supabaseClient
  .from("animals")
  .select(`
    *,
    species (
      common_name
    ),
    habitats (
      ecosystem_type
    )
  `); 

    if (error) {
        console.log(error);
        return;
    }

    console.log(data);      // full result
    console.log(data[0]);   // first row only

    const table = document.getElementById("animalsTable");
    table.innerHTML = "";

    data.forEach(animal => {

        table.innerHTML += `
            <tr onclick="selectAnimal(
            ${animal.animal_id},
            '${animal.name}',
            '${animal.species_id}',
            '${animal.habitat_id}',
            '${animal.gender}'
            )">
                <td>${animal.animal_id}</td>
                <td>${animal.name}</td>
                <td>${animal.species.common_name}</td>
                <td>${animal.habitats.ecosystem_type}</td>
                <td>${animal.gender}</td>
                
            </tr>
        `;
    });
    applyRangerRules();
    
}

loadAnimals();

async function loadSpeciesDropdown() {

    const { data, error } = await supabaseClient
        .from("species")
        .select("*");

    if (error) {
        console.log(error);
        return;
    }

    const speciesDropdown = document.getElementById("species");

    data.forEach(species => {

        speciesDropdown.innerHTML += `
            <option value="${species.species_id}">
                ${species.common_name}
            </option>
        `;
    });
}
async function loadHabitatDropdown() {

    const { data, error } = await supabaseClient
        .from("habitats")
        .select("*");

    if (error) {
        console.log(error);
        return;
    }

    const habitatDropdown = document.getElementById("habitat");

    data.forEach(habitat => {

        habitatDropdown.innerHTML += `
            <option value="${habitat.habitat_id}">
                ${habitat.ecosystem_type}
            </option>
        `;
    });
}
loadSpeciesDropdown();
loadHabitatDropdown();
loadAnimals();

async function addAnimal() {

    const name = document.getElementById("animalName").value;

    const species_id = document.getElementById("species").value;

    const habitat_id = document.getElementById("habitat").value;

    const gender = document.getElementById("gender").value;

    // Validation
    if (!name || !species_id || !habitat_id || !gender) {
        alert("Please fill all fields");
        return;
    }

    const { data, error } = await supabaseClient
        .from("animals")
        .insert([
            {
                name: name,
                species_id: species_id,
                habitat_id: habitat_id,
                gender: gender
            }
        ]);

    if (error) {
        console.log("SUPABASE ERROR:", error);
        alert(error.message);
        return;
    }

    alert("Animal added successfully!");

    // reload table
    loadAnimals();

    // clear form
    document.getElementById("animalForm").reset();
}

function selectAnimal(id, name, species_id, habitat_id, gender) {

    document.getElementById("animalId").value = id;

    document.getElementById("animalName").value = name;

    document.getElementById("species").value = species_id;

    document.getElementById("habitat").value = habitat_id;

    document.getElementById("gender").value = gender;
}

async function updateAnimal() {

    const animal_id = document.getElementById("animalId").value;

    const name = document.getElementById("animalName").value;

    const species_id = document.getElementById("species").value;

    const habitat_id = document.getElementById("habitat").value;

    const gender = document.getElementById("gender").value;

    const { data, error } = await supabaseClient
        .from("animals")
        .update({
            name,
            species_id,
            habitat_id,
            gender
        })
        .eq("animal_id", animal_id);

    if (error) {
        console.log(error);
        alert(error.message);
        return;
    }

    alert("Animal updated!");

    loadAnimals();

    document.getElementById("animalForm").reset();
}

async function deleteAnimal() {

    const animal_id = document.getElementById("animalId").value;

    if (!animal_id) {
        alert("Please select an animal first");
        return;
    }

    const confirmDelete = confirm("Are you sure you want to delete this animal?");

    if (!confirmDelete) {
        return;
    }

    const { error } = await supabaseClient
        .from("animals")
        .delete()
        .eq("animal_id", animal_id);

    if (error) {
        console.log(error);
        alert(error.message);
        return;
    }

    alert("Animal deleted!");

    loadAnimals();

    document.getElementById("animalForm").reset();
}

function clearForm() {

    document.getElementById("animalForm").reset();

    document.getElementById("animalId").value = "";
}