const supabaseUrl = "https://misayvgmrhsxyjiskljb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pc2F5dmdtcmhzeHlqaXNrbGpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczOTgyNzQsImV4cCI6MjA5Mjk3NDI3NH0.P005Ws86TKU-9bmGtuYnnIuirvgWiPMpVqsCZ9pfHJ0";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

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

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        errorMsg.textContent = "Invalid email or password.";
        errorMsg.classList.remove("d-none");
        return;
    }

    // Get role from metadata only — no users table lookup!
    const role = data.user.user_metadata?.role;

    console.log("metadata:", data.user.user_metadata);
    console.log("role:", role);

    if (!role) {
        errorMsg.textContent = "No role assigned. Contact your administrator.";
        errorMsg.classList.remove("d-none");
        await supabaseClient.auth.signOut();
        return;
    }

    localStorage.setItem("userRole", role);
    window.location.href = "index.html";
}

document.addEventListener("keydown", function(e) {
    if (e.key === "Enter") handleLogin();
});