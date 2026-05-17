fetch("navbar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;

    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll(".nav-link").forEach(link => {
      const linkPage = link.getAttribute("href");

      if (linkPage === currentPage) {
        link.classList.add("active-link");
      }
    });

    // ROLE LOGIC (ADD THIS)
    const role = localStorage.getItem("userRole");

    if (role === "ranger") {
      document.querySelectorAll(".admin-only").forEach(el => {
        el.style.display = "none";
      });
    }

  });

  async function logout() {
    await supabaseClient.auth.signOut();
    localStorage.removeItem("userRole");
    window.location.href = "login.html";
}