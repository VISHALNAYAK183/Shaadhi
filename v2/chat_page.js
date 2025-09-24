// Get receiver data from localStorage
const receiverData = JSON.parse(localStorage.getItem('receiverData'));

const base_url = `${BASE_URL}/message.php`;
// Check if receiver data exists, if not, redirect
if (!receiverData) {
  window.location.href = 'chat_list.html'; // Redirect to chat list if no data
} else {
  // Set receiver's name and image
  const receiverNameElement = document.getElementById('receiverName');
  const receiverImageElement = document.getElementById('receiverImage');
  const receiverMatriIdElement = document.getElementById('receiverMatriId');

  receiverNameElement.textContent = receiverData.receiverName;
  receiverMatriIdElement.textContent = receiverData.receiverMatriId;
  receiverImageElement.src = localStorage.getItem("baseURL")+receiverData.receiverImage;
}

// Function to fetch old messages
async function fetchMessages() {
  try {
    const response = await fetch(base_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        matri_id_by: localStorage.getItem("matriId"), // Your matri_id
        matri_id_to: receiverData.receiverMatriId,
        type: 'messages',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    const data = await response.json();
    displayMessages(data.dataout);
  } catch (error) {
   console.error('Error fetching messages:', error);
  }
}

// Function to display messages
function displayMessages(messages) {
  const chatMessagesContainer = document.getElementById('chatMessages');
  chatMessagesContainer.innerHTML = ''; // Clear existing messages

  messages.forEach((message) => {
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${message.matri_id_by === localStorage.getItem("matriId") ? 'sender' : 'receiver'}`;
    messageElement.textContent = message.message;
    chatMessagesContainer.appendChild(messageElement);
  });

  // Scroll to the bottom of chat window
  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

// Handle sending a message
document.getElementById('sendButton').addEventListener('click', () => {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value;

  if (message.trim()) {
    // Send the message (mock API call here)
    sendMessage(message);
    messageInput.value = ''; // Clear input field
  }
});

// Mock function to send a message
async function sendMessage(message) {
  // Mock API call to send the message
  // const newMessage = {
  //   message : message,
  //   "type" : "chat_initated",
  //   matri_id_by: 'TB3269', // Your matri_id
  //   matri_id_to: receiverData.receiverMatriId,
  // };

  const response = await fetch(base_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({message : message,
      "type" : "chat_initated",
      matri_id_by: localStorage.getItem("matriId"), // Your matri_id
      matri_id_to: receiverData.receiverMatriId,}),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }

  const messageElement = document.createElement('div');
  messageElement.className = 'chat-message sender';
  messageElement.textContent = message;
  document.getElementById('chatMessages').appendChild(messageElement);
  document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
}

// Fetch old messages when the page loads
window.addEventListener('load', fetchMessages);
