// ── Supabase connection ──────────────────────────────────────────
const supabaseUrl = "https://misayvgmrhsxyjiskljb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pc2F5dmdtcmhzeHlqaXNrbGpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczOTgyNzQsImV4cCI6MjA5Mjk3NDI3NH0.P005Ws86TKU-9bmGtuYnnIuirvgWiPMpVqsCZ9pfHJ0";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// ── AUTH GUARD: redirect to login if not logged in ───────────────
supabaseClient.auth.getSession().then(({ data: { session } }) => {

  if (!session) {
    window.location.href = "login.html";
    return;
  }

  // ── Load navbar only if logged in ─────────────────────────────
  fetch("navbar.html")
    .then(res => res.text())
    .then(data => {

      document.getElementById("navbar").innerHTML = data;

      // Highlight active page
      const currentPage = window.location.pathname.split("/").pop();
      document.querySelectorAll(".nav-link").forEach(link => {
        if (link.getAttribute("href") === currentPage) {
          link.classList.add("active-link");
        }
      });

      // Show logout button
      setTimeout(() => {
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) logoutBtn.classList.remove("d-none");
      }, 100);

      // Hide buttons if ranger
      const role = localStorage.getItem("userRole");
      if (role === "ranger") {
        hideActionButtons();
      }

    }); // closes fetch .then

}); // closes getSession .then

// ── Hide action buttons for rangers ─────────────────────────────
function hideActionButtons() {
  document.querySelectorAll(".btn-success, .btn-danger, .btn-primary").forEach(btn => {
    const text = btn.textContent.trim();
    if (
      text === "Add" ||
      text === "Update" ||
      text === "Delete" ||
      text === "Add Animal" ||
      text === "Add Sighting" ||
      text === "Report Threat" ||
      text === "Add Threat" ||
      text === "Add Activity"
    ) {
      btn.style.display = "none";
    }
  });

  // Hide Edit/Delete inside tables
  document.querySelectorAll(".btn-sm.btn-primary, .btn-sm.btn-danger").forEach(btn => {
    btn.style.display = "none";
  });
}

// ── Logout ───────────────────────────────────────────────────────
async function handleLogout() {
  await supabaseClient.auth.signOut();
  localStorage.removeItem("userRole");
  window.location.href = "login.html";
}