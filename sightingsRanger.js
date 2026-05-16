// function applyRangerRules() {

    // const role = "ranger";

    if (role === "ranger") {

        // document.getElementById("sightingFormContainer").style.display = "none";

        document.querySelectorAll(".action-btn").forEach(btn => {
            btn.style.display = "none";
        });

        // document.querySelectorAll(".action-column").forEach(col => {
        //     col.style.display = "none";
        // });
    }
// }