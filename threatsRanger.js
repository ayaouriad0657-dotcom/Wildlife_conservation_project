function applyRangerRules() {
    const role = localStorage.getItem("userRole");

    if (role === "ranger") {
        document.querySelectorAll(".action-column, .action-btn")
            .forEach(el => {
                el.style.display = "none";
            });
    }
}