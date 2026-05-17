// const supabaseClient = window.supabase;

async function loadHabitats() {

    const { data, error } = await supabaseClient
        .from("habitats")
        .select("*");

    if (error) {
        console.log(error);
        return;
    }

    const table = document.getElementById("habitatsTable");
    table.innerHTML = "";

    data.forEach(h => {

        table.innerHTML += `
            <tr onclick="selectHabitat(
                ${h.habitat_id},
                '${h.country}',
                '${h.location}',
                '${h.ecosystem_type}'
            )">

                <td>${h.habitat_id}</td>
                <td>${h.country}</td>
                <td>${h.location}</td>
                <td>${h.ecosystem_type}</td>

            </tr>
        `;
    });
}

loadHabitats();

async function addHabitat() {

    const country = document.getElementById("country").value;
    const location = document.getElementById("location").value;
    const ecosystem_type = document.getElementById("ecosystem").value;

    if (!country || !location || !ecosystem_type) {
        alert("Please fill all fields");
        return;
    }

    const { data, error } = await supabaseClient
        .from("habitats")
        .insert([
            {
                country,
                location,
                ecosystem_type
            }
        ]);

    if (error) {
        console.log(error);
        alert(error.message);
        return;
    }

    alert("Habitat added!");

    loadHabitats();

    document.getElementById("habitatForm")?.reset();
}

function selectHabitat(id, country, location, ecosystem_type) {

    document.getElementById("habitatId").value = id;
    document.getElementById("country").value = country;
    document.getElementById("location").value = location;
    document.getElementById("ecosystem").value = ecosystem_type;
}

async function addHabitat() {

    const country = document.getElementById("country").value;
    const location = document.getElementById("location").value;
    const ecosystem_type = document.getElementById("ecosystem").value;

    const { error } = await supabaseClient
        .from("habitats")
        .insert([{ country, location, ecosystem_type }]);

    if (error) return alert(error.message);

    loadHabitats();
    clearHabitatForm();
}

async function updateHabitat() {

    const habitat_id = document.getElementById("habitatId").value;
    const country = document.getElementById("country").value;
    const location = document.getElementById("location").value;
    const ecosystem_type = document.getElementById("ecosystem").value;

    if (!habitat_id) return alert("Select a habitat first");

    const { error } = await supabaseClient
        .from("habitats")
        .update({ country, location, ecosystem_type })
        .eq("habitat_id", habitat_id);

    if (error) return alert(error.message);

    loadHabitats();
    clearHabitatForm();
}

async function deleteHabitat() {

    const habitat_id = document.getElementById("habitatId").value;

    if (!habitat_id) return alert("Select a habitat first");

    const confirmDelete = confirm("Delete this habitat?");
    if (!confirmDelete) return;

    const { error } = await supabaseClient
        .from("habitats")
        .delete()
        .eq("habitat_id", habitat_id);

    if (error) return alert(error.message);

    loadHabitats();
    clearHabitatForm();
}

function clearHabitatForm() {

    document.getElementById("habitatId").value = "";
    document.getElementById("country").value = "";
    document.getElementById("location").value = "";
    document.getElementById("ecosystem").value = "";
}