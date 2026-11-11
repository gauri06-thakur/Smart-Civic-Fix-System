const form = document.getElementById("issueForm");
const issueList = document.getElementById("issueList");
const formMessage = document.getElementById("formMessage");

const API_URL = "http://127.0.0.1:3000/api/public/complaints";

// Load complaints from backend
async function loadComplaints() {
    try {
        const response = await fetch(API_URL);
        const complaints = await response.json();

        issueList.innerHTML = "";

        complaints.forEach(addComplaintToUI);
    } catch (error) {
        console.error("Could not load complaints:", error);
    }
}

// Display complaint in Community section
function addComplaintToUI(complaint) {
    const card = document.createElement("div");

    card.className = "issue-card";

    card.innerHTML = `
        <h3>${complaint.category}</h3>
        <p>${complaint.description}</p>
        <p><strong>Location:</strong> ${complaint.location}</p>
        <p><strong>Status:</strong> ${complaint.status}</p>
        <small>Complaint ID: ${complaint.id}</small>
    `;

    issueList.prepend(card);
}

// Submit complaint
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const complaint = {
        title: document.getElementById("title")?.value.trim() || "",
        category: document.getElementById("category").value,
        description: document.getElementById("description").value.trim(),
        location: document.getElementById("location").value.trim()
    };

    console.log("Sending complaint:", complaint);

    if (!complaint.category || !complaint.description || !complaint.location) {
        formMessage.textContent = "Please fill all required fields.";
        formMessage.style.display = "block";
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:3000/api/complaints", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(complaint)
        });

        const data = await response.json();

        console.log("Backend response:", data);

        if (!response.ok) {
            throw new Error(data.message || "Something went wrong");
        }

        formMessage.textContent = "Complaint submitted successfully!";
        formMessage.style.display = "block";

        form.reset();

        await loadComplaints();

    } catch (error) {
        console.error("Complaint submission error:", error);

        formMessage.textContent =
            "Something went wrong. Please try again.";

        formMessage.style.display = "block";
    }
});

// Category buttons
document.querySelectorAll("[data-category]").forEach(button => {
    button.addEventListener("click", () => {
        const category = button.dataset.category;

        const categoryField = document.querySelector(
            '[name="category"]'
        );

        if (categoryField) {
            categoryField.value = category;
        }

        document.getElementById("report").scrollIntoView({
            behavior: "smooth"
        });
    });
});

// Load complaints when page opens
loadComplaints();
