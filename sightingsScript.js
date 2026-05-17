const supabaseClient = window.supabase;

// LOAD SIGHTINGS
async function loadSightings() {

    const { data, error } = await supabaseClient
        .from("wildlife_sightings")
        .select(`
            sighting_id,
            animal_id,
            habitat_id,
            ranger_id,
            sighting_date,
            count,
            threat_found,
            animals (name),
            habitats (ecosystem_type),
            rangers (
                users (
                    full_name
                )
            )
        `)
        .order("sighting_date", { ascending: false });

    if (error) {
        console.log(error);
        return;
    }

    const table = document.getElementById("sightingsTable");
    table.innerHTML = "";

    data.forEach(s => {

        table.innerHTML += `
            <tr onclick="selectSighting(
                ${s.sighting_id},
                ${s.animal_id},
                ${s.habitat_id},
                ${s.ranger_id},
                '${s.sighting_date}',
                ${s.count},
                '${s.threat_found}'
            )">

                <td>${s.animals?.name ?? '-'}</td>
                <td>${s.habitats?.ecosystem_type ?? '-'}</td>
                <td>${s.rangers?.users?.full_name ?? '-'}</td>
                <td>${s.sighting_date}</td>
                <td>${s.count}</td>
                <td>${s.threat_found ? 'Yes' : 'No'}</td>

            </tr>
        `;
    });
}

loadSightings();

async function loadAnimalDropdown() {

    const { data, error } = await supabaseClient
        .from("animals")
        .select("animal_id, name");

    if (error) {
        console.log(error);
        return;
    }

    const dropdown = document.getElementById("animal");

    // reset options first
    dropdown.innerHTML = `<option value="">Select Animal</option>`;

    data.forEach(a => {
        dropdown.innerHTML += `
            <option value="${a.animal_id}">${a.name}</option>
        `;
    });
}

async function loadHabitatDropdown() {

    const { data, error } = await supabaseClient
        .from("habitats")
        .select("habitat_id, ecosystem_type");

    if (error) {
        console.log(error);
        return;
    }

    const dropdown = document.getElementById("habitat");

    dropdown.innerHTML = `<option value="">Select Habitat</option>`;

    data.forEach(h => {
        dropdown.innerHTML += `
            <option value="${h.habitat_id}">
                ${h.ecosystem_type}
            </option>
        `;
    });
}

async function loadRangerDropdown() {

    const { data, error } = await supabaseClient
        .from("rangers")
.select(`
    ranger_id,
    users (
        full_name
    )
`)

    if (error) {
        console.log(error);
        return;
    }

    const dropdown = document.getElementById("ranger");

    dropdown.innerHTML = `<option value="">Select Ranger</option>`;

    data.forEach(r => {
        dropdown.innerHTML += `
            <option value="${r.ranger_id}">
    ${r.users.full_name}
</option>
        `;
    });
}

loadAnimalDropdown();
loadHabitatDropdown();
loadRangerDropdown();

// SELECT SIGHTING — fills form when row is clicked
function selectSighting(id, animal_id, habitat_id, user_id, date, count, threat_found) {
    document.getElementById("sightingId").value = id;
    document.getElementById("animal").value = animal_id;
    document.getElementById("habitat").value = habitat_id;
    document.getElementById("ranger").value = user_id;
    document.getElementById("sightingDate").value = date;
    document.getElementById("count").value = count;
    document.getElementById("threatFound").value = threat_found === 'true' ? 'true' : 'false';
}

// ADD SIGHTING
async function addSighting() {

    const animal_id = document.getElementById("animal").value;
    const habitat_id = document.getElementById("habitat").value;
    const ranger_id = document.getElementById("ranger").value;
    const sighting_date = document.getElementById("sightingDate").value;
    const count = document.getElementById("count").value;
    const threat_found = document.getElementById("threatFound").value === "true";

    if (!animal_id || !habitat_id || !ranger_id || !sighting_date || !count) {
        alert("Please fill all fields");
        return;
    }

    if (count < 0) {
        alert("Count cannot be less than 0");
        return;
    }

    const { error } = await supabaseClient
        .from("wildlife_sightings")
        .insert([{
            animal_id,
            habitat_id,
            ranger_id,
            sighting_date,
            count,
            threat_found
        }]);

    if (error) {
        console.log(error);
        alert(error.message);
        return;
    }

    alert("Sighting added!");
    loadSightings();
    clearSightingForm();
}
// UPDATE SIGHTING
async function updateSighting() {

    const sighting_id = document.getElementById("sightingId").value;

    if (!sighting_id) {
        alert("Please select a sighting first");
        return;
    }

    const animal_id = document.getElementById("animal").value;
    const habitat_id = document.getElementById("habitat").value;
    const ranger_id = document.getElementById("ranger").value;
    const sighting_date = document.getElementById("sightingDate").value;
    const count = document.getElementById("count").value;
    const threat_found = document.getElementById("threatFound").value === "true";

    if (count < 0) {
        alert("Count cannot be less than 0");
        return;
    }

    const { error } = await supabaseClient
        .from("wildlife_sightings")
        .update({
            animal_id,
            habitat_id,
            ranger_id,
            sighting_date,
            count,
            threat_found
        })
        .eq("sighting_id", sighting_id);

    if (error) {
        console.log(error);
        alert(error.message);
        return;
    }

    alert("Sighting updated!");
    loadSightings();
    clearSightingForm();
}

// DELETE SIGHTING
async function deleteSighting() {

    const sighting_id = document.getElementById("sightingId").value;

    if (!sighting_id) {
        alert("Please select a sighting first");
        return;
    }

    const confirmDelete = confirm("Delete this sighting?");
    if (!confirmDelete) return;

    const { error } = await supabaseClient
        .from("wildlife_sightings")
        .delete()
        .eq("sighting_id", sighting_id);

    if (error) {
        console.log(error);
        alert(error.message);
        return;
    }

    alert("Sighting deleted!");
    loadSightings();
    clearSightingForm();
}

function clearSightingForm() {

    document.getElementById("sightingId").value = "";

    document.getElementById("animal").value = "";
    document.getElementById("habitat").value = "";
    document.getElementById("ranger").value = "";

    document.getElementById("sightingDate").value = "";
    document.getElementById("count").value = "";
    document.getElementById("threatFound").value = "false";
}