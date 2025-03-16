document.addEventListener("DOMContentLoaded", () => {
    const dropdown = document.querySelector(".dropdown");
    const button = document.querySelector(".dropdown-button");
    const dropdownContent = document.querySelector(".dropdown-content");

    // Toggle dropdown open/close when button is clicked
    button.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent click from closing immediately
        dropdown.classList.toggle("open");

        // Close any other open dropdowns
        document.querySelectorAll(".dropdown").forEach((otherDropdown) => {
            if (otherDropdown !== dropdown) {
                otherDropdown.classList.remove("open");
            }
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (event) => {
        if (!dropdown.contains(event.target)) {
            dropdown.classList.remove("open");
        }
    });
});
