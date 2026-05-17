document.addEventListener("DOMContentLoaded", () => {

    const role = localStorage.getItem("userRole");

    if (role === "ranger") {

        document.querySelectorAll(".action-btn").forEach(btn => {
            btn.style.display = "none";
        });

    }

});