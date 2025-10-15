function get_list_js() {
  const myPlanStatus = localStorage.getItem("my_plan_status");
  const upgradeCard = document.getElementById("upgrade_card");
  const listCard = document.getElementById("list_card");
  const chatListContainer = document.getElementById('chatList');

  if (!chatListContainer) {
    console.error('Chat list container not found!');
    return;
  }


  function logout() {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("matriId");
    window.location.href = "login.html";
  }

  function isTokenExpired(token) {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (e) {
      console.error("Error decoding token:", e);
      return true;
    }
  }


  async function fetchChatList() {
    const token = localStorage.getItem("jwtToken");

    if (!token || isTokenExpired(token)) {
      console.warn("Session expired or token missing!");
      logout();
      return;
    }

    if (myPlanStatus !== "Paid") {
      upgradeCard.style.display = "block";
    } else {
      if (listCard) listCard.style.display = "block";
      await getChatList();
    }
  }


  async function getChatList() {
    try {
      const response = await fetch(`${BASE_URL}/message.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem("jwtToken")
        },
        body: JSON.stringify({
          matri_id: localStorage.getItem("matriId"),
          type: 'chat_list',
        }),
      });

      if (response.status === 401) {
        console.warn("Unauthorized - Token expired!");
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch chat list');
      }

      const data = await response.json();

   
      if (data.error && data.error === "Token expired") {
        console.warn("Token expired - Redirecting to login!");
        logout();
        return;
      }

      populateChatList(data.dataout);
    } catch (error) {
      console.error('Error fetching chat list:', error);
      logout(); 
    }
  }

  function populateChatList(chatList) {
    chatListContainer.innerHTML = "";

    chatList.forEach((chat) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <img src="${localStorage.getItem("baseURL") + chat.url}" alt="${chat.first_name} ${chat.last_name}" />
        <div style="display: flex; flex-direction: column;">
          <span>${chat.first_name} ${chat.last_name}</span>
          <span>${chat.matri_id}</span>
        </div>
      `;
      listItem.addEventListener('click', () => openChat(chat));
      chatListContainer.appendChild(listItem);
    });
  }


  fetchChatList();
}


function openChat(chat) {
  openChatPage(chat.matri_id, chat.first_name + " " + chat.last_name, chat.url);
}
