// YOUR SUPABASE INFO
console.log("script running");
const supabaseUrl = "https://misayvgmrhsxyjiskljb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pc2F5dmdtcmhzeHlqaXNrbGpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczOTgyNzQsImV4cCI6MjA5Mjk3NDI3NH0.P005Ws86TKU-9bmGtuYnnIuirvgWiPMpVqsCZ9pfHJ0";

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);


// LOAD ANIMALS
async function loadAnimals() {

    const { data, error } = await supabaseClient
  .from("animals")
  .select(`
    *,
    species (
      common_name
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
            <tr>
                <td>${animal.animal_id}</td>
                <td>${animal.name}</td>
                <td>${animal.species.common_name}</td>
                <td>${animal.habitat_id}</td>
                <td>${animal.gender}</td>
                <td>
                    <button class="btn btn-sm btn-primary">Edit</button>
                    <button class="btn btn-sm btn-danger">Delete</button>
                </td>
            </tr>
        `;
    });
}

loadAnimals();

