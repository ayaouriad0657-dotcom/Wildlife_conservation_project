const supabaseClient = window.supabase;


async function protectPage() {

    const { data } = await supabaseClient.auth.getSession();

    if (!data.session) {
        window.location.href = "login.html";
    }
}

protectPage();

// window.addEventListener("DOMContentLoaded", async () => {

//     const { data } = await supabaseClient.auth.getSession();

//     if (data.session) {
//         alert("You are logged in");
//     } else {
//         window.location.href = "login.html";
//     }
// });