// Add this file as js/contact-form.js and include it AFTER main.js:
// <script src="js/contact-form.js"></script>
//
// Point this at your backend once it's deployed, e.g.
// "https://your-backend.onrender.com/send-message"
const CONTACT_API_URL = "http://localhost:5000/send-message";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const nameInput = document.getElementById("cf-name");
  const emailInput = document.getElementById("cf-email");
  const messageInput = document.getElementById("cf-message");
  const statusEl = document.getElementById("cf-status");
  const submitBtn = form.querySelector("button[type='submit']");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // stop the page reload that was swallowing your submissions

    const payload = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      message: messageInput.value.trim(),
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    statusEl.textContent = "";

    try {
      const response = await fetch(CONTACT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.ok) {
        statusEl.style.color = "#2ecc71";
        statusEl.textContent = "Message sent! I'll get back to you soon.";
        form.reset(); // this is what actually clears the inputs after sending
      } else {
        statusEl.style.color = "#e74c3c";
        statusEl.textContent = data.error || "Something went wrong. Please try again.";
      }
    } catch (err) {
      statusEl.style.color = "#e74c3c";
      statusEl.textContent = "Couldn't reach the server. Please try again later.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });
});
