// Get receiver data from localStorage
const receiverData = JSON.parse(localStorage.getItem("receiverData"));
const base_url = `${BASE_URL}/message.php`;

// Check if receiver data exists
if (!receiverData) {
  window.location.href = "chat_list";
} else {
  // Set receiver details
  const receiverNameElement = document.getElementById("receiverName");
  const receiverImageElement = document.getElementById("receiverImage");
  const receiverMatriIdElement = document.getElementById("receiverMatriId");

  receiverNameElement.textContent = receiverData.receiverName;
  receiverMatriIdElement.textContent = receiverData.receiverMatriId;
  receiverImageElement.src = receiverData.receiverImage || "default_profile.png";
}


async function handleSessionExpiry() {
  if (window.sessionExpiredAlertShown) return;
  window.sessionExpiredAlertShown = true;

  await Swal.fire({
    title: "Session Expired",
    text: "Your session has expired. Please log in again.",
    icon: "warning",
    confirmButtonText: "OK",
    allowOutsideClick: false,
    allowEscapeKey: false,
  });

  localStorage.removeItem("jwtToken");
  localStorage.removeItem("matriId");
  sessionStorage.clear();
  window.location.href = "Login";
}
async function fetchMessages() {
  try {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      console.warn("JWT token missing!");
      await handleSessionExpiry();
      return;
    }

    const response = await fetch(base_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwtToken")
      },
      body: JSON.stringify({
        matri_id_by: localStorage.getItem("matriId"),
        matri_id_to: receiverData.receiverMatriId,
        type: "messages",
      }),
    });

    const data = await response.json();

    // 🛑 If backend says token missing
    if (
      !response.ok ||
      data.message?.p_out_mssg_flg === "E" &&
      data.message?.p_out_mssg?.toLowerCase().includes("authorization")
    ) {
      console.warn("Authorization failed — refreshing session.");
      await handleSessionExpiry();
      return;
    }

    // 🟢 Update new token if available
    if (data.newToken) {
      localStorage.setItem("jwtToken", data.newToken);
    }

    // 🧩 Defensive fix — only display if messages exist
    if (Array.isArray(data.dataout) && data.dataout.length > 0) {
      displayMessages(data.dataout);
    } else {
      console.warn("No messages found or dataout missing.");
      document.getElementById("chatMessages").innerHTML =
        "<p style='text-align:center;color:gray;'>No messages yet</p>";
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
}

function displayMessages(messages = []) {
  const chatMessagesContainer = document.getElementById('chatMessages');
  chatMessagesContainer.innerHTML = '';

  if (!Array.isArray(messages)) {
    console.warn('Messages is not an array:', messages);
    return;
  }

  messages.forEach((message) => {
    const messageElement = document.createElement('div');
    messageElement.className =
      `chat-message ${message.matri_id_by === localStorage.getItem("matriId") ? 'sender' : 'receiver'}`;
    messageElement.textContent = message.message;
    chatMessagesContainer.appendChild(messageElement);
  });

  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

document.getElementById("sendButton").addEventListener("click", async () => {
  const messageInput = document.getElementById("messageInput");
  const message = messageInput.value.trim();

  if (message) {
    await sendMessage(message);
    messageInput.value = "";
  }
});


async function sendMessage(message) {
  try {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      await handleSessionExpiry();
      return;
    }

    const response = await fetch(base_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwtToken")
      },
      body: JSON.stringify({
        message: message,
        type: "chat_initated",
        matri_id_by: localStorage.getItem("matriId"),
        matri_id_to: receiverData.receiverMatriId,
      }),
    });

    const data = await response.json();

    // Handle invalid token
    if (
      response.status === 401 ||
      (data.message &&
        data.message.p_out_mssg_flg === "E" &&
        data.message.p_out_mssg.toLowerCase().includes("authorization"))
    ) {
      await handleSessionExpiry();
      return;
    }

    // Refresh token if new one received
    if (data.newToken) {
      localStorage.setItem("jwtToken", data.newToken);
    }

    // Add message to chat window instantly
    const messageElement = document.createElement("div");
    messageElement.className = "chat-message sender";
    messageElement.textContent = message;
    document.getElementById("chatMessages").appendChild(messageElement);
    document.getElementById("chatMessages").scrollTop =
      document.getElementById("chatMessages").scrollHeight;
  } catch (error) {
    console.error("Error sending message:", error);
    await handleSessionExpiry();
  }
}


window.addEventListener("load", fetchMessages);
