function applyRangerRules() {

    const role = localStorage.getItem("userRole");

    if (role === "ranger") {

        document.getElementById("animalFormContainer").style.display = "none";

        
    }
}