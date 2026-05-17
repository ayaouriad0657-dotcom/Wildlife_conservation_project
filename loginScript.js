const supabaseClient = window.supabase;

async function handleLogin() {
    const email    = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("errorMsg");

    errorMsg.classList.add("d-none");
    errorMsg.textContent = "";

    if (!email || !password) {
        errorMsg.textContent = "Please enter your email and password.";
        errorMsg.classList.remove("d-none");
        return;
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

    if (error) {
        errorMsg.textContent = "Invalid email or password.";
        errorMsg.classList.remove("d-none");
        return;
    }

    // Get role from Supabase user metadata
    const role = data.user.user_metadata?.role;

    if (!role) {
        errorMsg.textContent = "No role assigned. Contact your administrator.";
        errorMsg.classList.remove("d-none");
        await supabaseClient.auth.signOut();
        return;
    }

    // Save role so all pages can read it
    localStorage.setItem("userRole", role);

    // Redirect to dashboard
    window.location.href = "index.html";
}

document.addEventListener("keydown", function(e) {
    if (e.key === "Enter") handleLogin();
});