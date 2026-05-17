// const supabaseClient = window.supabase;

async function loadThreats() {

    const { data, error } = await supabaseClient
        .from("animals_threats")
        .select("*");

    if (error) {
        console.log(error);
        return;
    }

    const table = document.getElementById("threatsTable");
    table.innerHTML = "";

    data.forEach(t => {

        table.innerHTML += `
            <tr>
                <td>${t.threat_type}</td>
                <td>${t.threat_level}</td>
                <td class="action-column action-btn">
                    <button class="btn btn-sm btn-danger action-btn"
                        onclick="deleteThreat(${t.threat_id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

async function loadSightingDropdown() {

    const { data, error } = await supabaseClient
        .from("wildlife_sightings")
        .select(`
            sighting_id,
            animals(name)
        `);

    if (error) {
        console.log(error);
        return;
    }

    const dropdown = document.getElementById("sighting");

    dropdown.innerHTML = `<option value="">-- Select Sighting --</option>`;

    data.forEach(s => {
        dropdown.innerHTML += `
            <option value="${s.sighting_id}">
                ${s.animals?.name ?? "Animal"} (Sighting ${s.sighting_id})
            </option>
        `;
    });
}

loadThreats();
loadSightingDropdown();

async function addThreat() {

    const sighting_id = document.getElementById("sighting").value;
    const threat_type = document.getElementById("threatType").value;
    const threat_level = document.getElementById("threatLevel").value;

    if (!sighting_id || !threat_type || !threat_level) {
        alert("Please fill all fields");
        return;
    }

    // auto get animal_id
    const { data, error } = await supabaseClient
        .from("wildlife_sightings")
        .select("animal_id")
        .eq("sighting_id", sighting_id)
        .single();

    if (error) {
        console.log(error);
        return;
    }

    const animal_id = data.animal_id;

    const { error: insertError } = await supabaseClient
        .from("animals_threats")
        .insert([{
            sighting_id,
            animal_id,
            threat_type,
            threat_level
        }]);

    if (insertError) {
        console.log(insertError);
        alert(insertError.message);
        return;
    }

    alert("Threat added!");

    loadThreats();

    document.getElementById("threatType").value = "";
    document.getElementById("threatLevel").value = "";
    document.getElementById("sighting").value = "";
}


async function deleteThreat(threat_id) {

    if (!threat_id) {
        alert("Invalid threat");
        return;
    }

    const confirmDelete = confirm("Are you sure you want to delete this threat?");
    if (!confirmDelete) return;

    const { error } = await supabaseClient
        .from("animals_threats")
        .delete()
        .eq("threat_id", threat_id);

    if (error) {
        console.log(error);
        alert(error.message);
        return;
    }

    alert("Threat deleted!");

    loadThreats();
}

// // ── ACTIVITIES ───────────────────────────────────────────────────

async function loadActivities() {

    const { data, error } = await supabaseClient
        .from("conservation_activities")
        .select("*");

    if (error) {
        console.log(error);
        return;
    }

    const table = document.getElementById("activitiesTable");
    table.innerHTML = "";

    for (let a of data) {

        // get ranger name
        const { data: ranger } = await supabaseClient
            .from("rangers")
            .select("user_id")
            .eq("ranger_id", a.performed_by)
            .single();

        let name = "-";

        if (ranger) {
            const { data: user } = await supabaseClient
                .from("users")
                .select("full_name")
                .eq("user_id", ranger.user_id)
                .single();

            name = user?.full_name ?? "-";
        }

        table.innerHTML += `
            <tr>
                <td>${a.activity_name}</td>
                <td>${a.status}</td>
                <td>${name}</td>
                <td class="action-column">
                    <button class="btn btn-sm btn-danger action-btn"
                        onclick="deleteActivity(${a.activity_id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    }
    applyRangerRules();
}

loadActivities();


/* =========================
   LOAD DROPDOWNS
========================= */

async function loadRangerDropdown() {

    const { data, error } = await supabaseClient
        .from("rangers")
        .select("ranger_id, user_id");

    if (error) {
        console.log(error);
        return;
    }

    const userIds = data.map(r => r.user_id);

    const { data: users, error: userError } = await supabaseClient
        .from("users")
        .select("user_id, full_name")
        .in("user_id", userIds);

    if (userError) {
        console.log(userError);
        return;
    }

    const dropdown = document.getElementById("performedBy");
    dropdown.innerHTML = `<option value="">Select Ranger</option>`;

    data.forEach(r => {

        const user = users.find(u => u.user_id === r.user_id);

        dropdown.innerHTML += `
            <option value="${r.ranger_id}">
                ${user ? user.full_name : "Unknown"}
            </option>
        `;
    });
}


async function loadThreatDropdown() {

    const { data, error } = await supabaseClient
        .from("animals_threats")
        .select("threat_id, threat_type");

    if (error) {
        console.log(error);
        return;
    }

    const dropdown = document.getElementById("threatId");
    dropdown.innerHTML = `<option value="">Select Threat</option>`;

    data.forEach(t => {
        dropdown.innerHTML += `
            <option value="${t.threat_id}">
                ${t.threat_type}
            </option>
        `;
    });
}

loadRangerDropdown();
loadThreatDropdown();

/* =========================
   ADD ACTIVITY
========================= */

async function addActivity() {

    const threat_id = document.getElementById("threatId").value;
    const activity_name = document.getElementById("activityName").value;
    const status = document.getElementById("activityStatus").value;
    const performed_by = document.getElementById("performedBy").value;

    if (!threat_id || !activity_name || !status || !performed_by) {
        alert("Please fill all fields");
        return;
    }

    const { error } = await supabaseClient
        .from("conservation_activities")
        .insert([{
            threat_id: parseInt(threat_id),
            activity_name,
            status,
            performed_by: parseInt(performed_by)
        }]);

    if (error) {
        console.log(error);
        alert(error.message);
        return;
    }

    alert("Activity added!");

    loadActivities();
    clearActivityForm();
}


/* =========================
   DELETE ACTIVITY
========================= */

async function deleteActivity(activity_id) {

    const confirmDelete = confirm("Are you sure you want to delete this activity?");
    if (!confirmDelete) return;

    const { error } = await supabaseClient
        .from("conservation_activities")
        .delete()
        .eq("activity_id", activity_id);

    if (error) {
        console.log(error);
        alert(error.message);
        return;
    }

    alert("Activity deleted!");

    loadActivities();
}

function clearActivityForm() {
    document.getElementById("threatId").value = "";
    document.getElementById("activityName").value = "";
    document.getElementById("activityStatus").value = "";
    document.getElementById("performedBy").value = "";
}