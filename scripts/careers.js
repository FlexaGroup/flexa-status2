let isButtonDisabled = false;

// Function to toggle the visibility of the popup
function togglePopup() {
  const popup = document.getElementById("popup");
  popup.style.display = popup.style.display === "none" ? "block" : "none";
}

// Modify your existing submitForm function to handle marketing form submission
async function submitMarketingForm() {
  const applyButton = document.querySelector(".buttonapply");
  applyButton.disabled = true;
  applyButton.style.backgroundColor = "#ccc";
  applyButton.textContent = "Application Submitted"; // Change to the desired text

  // Close the popup
  togglePopup();
  // Extract data from the popup form
  const name = document.getElementById("modalName").value.trim().toLowerCase();
  const email = document.getElementById("modalEmail").value;
  const availability = document.getElementById("availability").value;
  const discordid = document.getElementById("discordid").value;
  const reason1 = document.getElementById("reason1").value;
  const reason = document.getElementById("reason").value;

  // Generate a 6-digit number
  const applicationCode = Math.floor(100000 + Math.random() * 900000);

  // Create a local timestamp
  const timestamp = new Date().toLocaleString();

  // Get the CV file input element
  const cvInput = document.getElementById("cv");

  // Check if a file is selected
  if (cvInput.files.length > 0) {
    // Get the selected file
    const cvFile = cvInput.files[0];

    // Encode the file data as a Data URL
    const cvDataUrl = await encodeFileToDataUrl(cvFile);

    // Construct the embed object with the CV link
    const marketingEmbed = {
      title: "Marketing Career",
      fields: [
        { name: "Name", value: name },
        { name: "Email", value: email },
        { name: "Discord user/id", value: discordid },
        { name: "Availability", value: availability },
        { name: "Why do you want to join", value: reason },
        {
          name: "Create an example of a blog post or a previous written piece you have created",
          value: reason1,
        },
      ],
      footer: {
        text: `Application Code: ${applicationCode} | Timestamp: ${timestamp}`,
      },
    };
    // Send the payload with the embed to the webhook for the embed
    const marketingWebhookUrl =
      "https://discord.com/api/webhooks/1223699303953072128/ccXnC_Aa99K4ARKOj3XLrzlRBcLvBLaQyWardbyHthRnyFUlpJpVytSyMFAHK9L_w2yC";

    try {
      const embedResponse = await fetch(marketingWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ embeds: [marketingEmbed] }),
      });

      if (!embedResponse.ok) {
        console.error(
          "Failed to send marketing embed:",
          embedResponse.status,
          embedResponse.statusText
        );
        // Add any additional error handling as needed
      } else {
        console.log("Marketing embed sent successfully:", embedResponse.status);
      }
    } catch (error) {
      console.error("Error sending marketing embed:", error);
    }

    // Send the CV file as a separate message
    const cvWebhookUrl =
      "https://discord.com/api/webhooks/1223699333816516709/SwKcT2oxiwt7JWLzU78F9DxZgltjjnBQoEMPY-CH0mRuDePJDzZL0gGBJlVNHLF-oNf_"; // Replace with your CV webhook URL

    const cvFormData = new FormData();
    cvFormData.append("file", cvFile);

    try {
      const cvResponse = await fetch(cvWebhookUrl, {
        method: "POST",
        body: cvFormData,
      });

      if (!cvResponse.ok) {
        console.error(
          "Failed to send CV file:",
          cvResponse.status,
          cvResponse.statusText
        );
        // Add any additional error handling as needed
      } else {
        console.log("CV file sent successfully:", cvResponse.status);
      }
    } catch (error) {
      console.error("Error sending CV file:", error);
    }
  } else {
    // Handle the case where no file is selected
    console.error("No CV file selected.");
  }
}

// Function to encode a file to Data URL
function encodeFileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

let profanityList = [];

async function loadProfanityList() {
  try {
    const response = await fetch("profanitylist.txt");
    const profanityText = await response.text();
    profanityList = profanityText
      .split("\n")
      .map((word) => word.trim().toLowerCase())
      .filter((word) => word !== "");
  } catch (error) {
    console.error("Error loading profanity list:", error);
  }
}

async function submitForm() {
  // Disable sign-up button
  const signUpButton = document.getElementById("signupButton");
  signUpButton.disabled = true;
  signUpButton.style.backgroundColor = "#ccc";
  signUpButton.textContent = "Signed Up";

  if (profanityList.length === 0) {
    console.error(
      "Profanity list not loaded. Please check your network or file path."
    );
    // Re-enable sign-up button
    setTimeout(() => {
      signUpButton.disabled = false;
      signUpButton.style.backgroundColor = ""; // Restore original background color if needed
      signUpButton.textContent = "Sign Up"; // Restore original text
    }, 5000);
    return;
  }

  const nameInput = document.getElementById("name");
  const originalName = nameInput.value.trim();
  const name = originalName.toLowerCase();
  const email = document.getElementById("email").value;
  const errorContainer = document.querySelector(".error-container");
  const errorMessage = document.getElementById("errorMessage");

  if (!name || !email) {
    alert("Please fill out all fields.");
    // Re-enable sign-up button
    setTimeout(() => {
      signUpButton.disabled = false;
      signUpButton.style.backgroundColor = ""; // Restore original background color if needed
      signUpButton.textContent = "Sign Up"; // Restore original text
    }, 5000);
    return;
  }

  const containsProfanity = profanityList.some((word) => {
    if (name.includes(word)) {
      return true;
    }

    const connectedRegex = new RegExp(`\\b${word}\\b`, "i");
    return connectedRegex.test(name);
  });

  if (containsProfanity) {
    errorMessage.textContent = "Profanity is prohibited on this site.";
    errorContainer.style.display = "block";

    const ipAddress = await fetch("https://api64.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => data.ip);

    console.log("IP Address:", ipAddress);
    console.log("Name:", originalName);
    console.log("Email:", email);

    const profanityEmbed = {
      title: "Profanity Detected",
      color: 0xff0000,
      fields: [
        {
          name: "Name:",
          value: originalName,
        },
        {
          name: "Email:",
          value: email,
        },
        {
          name: "IP Address:",
          value: ipAddress,
        },
      ],
      footer: {
        text: `Timestamp: ${new Date().toLocaleString()}`,
      },
    };

    const profanityPayload = {
      embeds: [profanityEmbed],
    };

    const webhookUrl1 =
      "https://discord.com/api/webhooks/1223328615106875454/2E1GD5TAHyKfaibxqD3Ge90JkBn74VUJb0lGOUckUMzI-n1v38OxjLKQkq0LcLfwO_wg";

    fetch(webhookUrl1, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profanityPayload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Profanity log sent successfully:", data);
      })
      .catch((error) => {
        console.error("Error sending profanity log:", error);
      });

    nameInput.value = "";

    setTimeout(() => {
      errorContainer.style.display = "none";
      // Re-enable sign-up button
      signUpButton.disabled = false;
      signUpButton.style.backgroundColor = ""; // Restore original background color if needed
      signUpButton.textContent = "Sign Up"; // Restore original text
    }, 5000);

    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please input a valid email.");
    // Re-enable sign-up button
    setTimeout(() => {
      signUpButton.disabled = false;
      signUpButton.style.backgroundColor = ""; // Restore original background color if needed
      signUpButton.textContent = "Sign Up"; // Restore original text
    }, 5000);
    return;
  }

  // Rest of your existing code...

  const randomCode = Math.floor(100000 + Math.random() * 900000);
  const timestamp = new Date().toLocaleString();

  const embed = {
    title: "New Email Signup",
    color: 0x5398e5,
    fields: [
      {
        name: "Name:",
        value: originalName,
      },
      {
        name: "Email:",
        value: email,
      },
    ],
    footer: {
      text: `Code: ${randomCode} | Timestamp: ${timestamp}`,
    },
  };

  const payload = {
    embeds: [embed],
  };

  const webhookUrl =
    "https://discord.com/api/webhooks/1223328490640769054/TnJB1kb1Azn4L3xfGmY3GWacV-3O5IL8TPXvz_ZMCQ4_JpWTxUFM7hlNlYHTVu0fKNKt";

  if (!containsProfanity) {
    fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Webhook sent successfully:", data);
      })
      .catch((error) => {
        console.error("Error sending webhook:", error);
      });
  }
}

loadProfanityList();

// Animation for Email Form //

// Function to add animation class to form elements
function animateForm() {
  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const nameLabel = document.querySelector('label[for="name"]');
  const emailLabel = document.querySelector('label[for="email"]');
  const signUpButton = document.getElementById("signupButton");

  nameField.classList.add("fly-in-left");
  emailField.classList.add("fly-in-right");
  nameLabel.classList.add("fly-in-right");
  emailLabel.classList.add("fly-in-left");
  signUpButton.classList.add("fly-in-bottom");
}

// Run the animation on page load
document.addEventListener("DOMContentLoaded", function () {
  animateForm();
});
