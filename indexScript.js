

async function loadDashboardStats() {

  const { count: animalCount } = await supabaseClient
    .from("animals")
    .select("*", { count: "exact", head: true });

  document.getElementById("totalAnimals").innerText = animalCount || 0;

  // Total Species
  const { count: speciesCount } = await supabaseClient
    .from("species")
    .select("*", { count: "exact", head: true });

  document.getElementById("totalSpecies").innerText = speciesCount || 0;

  // Wildlife Sightings
  const { count: sightingCount } = await supabaseClient
    .from("wildlife_sightings")
    .select("*", { count: "exact", head: true });

  document.getElementById("totalSightings").innerText = sightingCount || 0;

  // Active Threats
const { count: threatCount } = await supabaseClient
  .from("animals_threats")
  .select("*", { count: "exact", head: true });

document.getElementById("totalThreats").innerText = threatCount || 0;
}

loadDashboardStats();

async function loadSightingsTable() {

  const { data, error } = await supabaseClient
    .from("wildlife_sightings")
    .select(`
      sighting_id,
      sighting_date,
      threat_found,
      animals (name),
      habitats (ecosystem_type),
      rangers (
        users (full_name)
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
      <tr>
        <td>${s.animals?.name || "-"}</td>
        <td>${s.habitats?.ecosystem_type || "-"}</td>
        <td>${s.rangers?.users?.full_name || "-"}</td>
        <td>${s.sighting_date?.split("T")[0]}</td>
        <td>${s.threat_found ? "Yes" : "No"}</td>
      </tr>
    `;
  });
}

loadSightingsTable();