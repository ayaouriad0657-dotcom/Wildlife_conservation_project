document.addEventListener("DOMContentLoaded", () => {

    const role = "ranger"; // later from login

    if (role === "ranger") {

        document.querySelectorAll(".action-btn").forEach(btn => {
            btn.style.display = "none";
        });

    }

});