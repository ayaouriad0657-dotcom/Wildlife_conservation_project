// const supabaseClient = window.supabase;

// LOAD RANGERS
async function loadRangers() {

    console.log("Loading rangers...");

    const { data, error } = await supabaseClient
        .from("rangers")
        .select(`
            ranger_id,
            experience_years,
            users (
                user_id,
                full_name,
                email
            )
        `);
    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
        alert(error.message);
        return;
    }

    const table = document.getElementById("rangersTable");

    table.innerHTML = "";

    data.forEach(ranger => {
        table.innerHTML += `
            <tr onclick='selectRanger(
                ${ranger.users.user_id},
                ${JSON.stringify(ranger.users.full_name)},
                ${JSON.stringify(ranger.users.email)},
                ${ranger.experience_years}
        )'>

            <td>${ranger.users.user_id}</td>
            <td>${ranger.users.full_name}</td>
            <td>${ranger.users.email}</td>
            <td>${ranger.experience_years}</td>

        </tr>
    `;
    });
}
loadRangers();

// SELECT RANGER — fills the form when row is clicked
function selectRanger(id, full_name, email, experience_years) {

    document.getElementById("rangerId").value = id;
    document.getElementById("fullName").value = full_name;
    document.getElementById("email").value = email;
    document.getElementById("experienceYears").value = experience_years;
}

// ADD RANGER
async function addRanger() {

    const full_name = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const experience_years = document.getElementById("experienceYears").value;

    if (!full_name || !email || !experience_years) {
        alert("Please fill all fields");
        return;
    }
    if (experience_years < 0) {
    alert("Experience years cannot be less than 0");
    return;
}

    // STEP 1: insert into users table
    const { data: userData, error: userError } = await supabaseClient
        .from("users")
        .insert([{
            full_name,
            email,
            password: "default123", // temporary
            role_id: 2
        }])
        .select();

    if (userError) {
        console.log(userError);
        alert(userError.message);
        return;
    }

    // get created user_id
    const user_id = userData[0].user_id;

    // STEP 2: insert into rangers table
    const { error: rangerError } = await supabaseClient
        .from("rangers")
        .insert([{
            user_id,
            experience_years
        }]);

    if (rangerError) {
        console.log(rangerError);
        alert(rangerError.message);
        return;
    }

    alert("Ranger added successfully!");

    loadRangers();
    clearRangerForm();
}

async function updateRanger() {

    const user_id = document.getElementById("rangerId").value;
    const full_name = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const experience_years = document.getElementById("experienceYears").value;

    if (!user_id) {
        alert("Select a ranger first");
        return;
    }
    if (experience_years < 0) {
    alert("Experience years cannot be less than 0");
    return;
}

    // UPDATE users table
    const { error: userError } = await supabaseClient
        .from("users")
        .update({
            full_name,
            email
        })
        .eq("user_id", user_id);

    if (userError) {
        console.log(userError);
        alert(userError.message);
        return;
    }

    // UPDATE rangers table
    const { error: rangerError } = await supabaseClient
        .from("rangers")
        .update({
            experience_years
        })
        .eq("user_id", user_id);

    if (rangerError) {
        console.log(rangerError);
        alert(rangerError.message);
        return;
    }

    alert("Ranger updated!");

    loadRangers();
    clearRangerForm();
}

async function deleteRanger() {

    const user_id = document.getElementById("rangerId").value;

    if (!user_id) {
        alert("Select a ranger first");
        return;
    }

    const confirmDelete = confirm("Delete this ranger?");
    if (!confirmDelete) return;

    // DELETE ranger record first
    const { error: rangerError } = await supabaseClient
        .from("rangers")
        .delete()
        .eq("user_id", user_id);

    if (rangerError) {
        console.log(rangerError);
        alert(rangerError.message);
        return;
    }

    // DELETE user record
    const { error: userError } = await supabaseClient
        .from("users")
        .delete()
        .eq("user_id", user_id);

    if (userError) {
        console.log(userError);
        alert(userError.message);
        return;
    }

    alert("Ranger deleted!");

    loadRangers();
    clearRangerForm();
}

function clearRangerForm() {

    document.getElementById("rangerId").value = "";
    document.getElementById("fullName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("experienceYears").value = "";
}