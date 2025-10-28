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
    window.location.href = "Login";
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
 if (data.newToken) {
      localStorage.setItem("jwtToken", data.newToken);
    }
   
    if (response.status === 401) {
      console.warn("Unauthorized - Token expired!");
      await handleSessionExpiry();
      return;
    }

    if (!response.ok) {
      throw new Error('Failed to fetch chat list');
    }

    const data = await response.json();

 
    if (
      data.message &&
      data.message.p_out_mssg &&
      data.message.p_out_mssg.toLowerCase().includes("expired")
    ) {
      console.warn("Token expired - Redirecting to login!");
      await handleSessionExpiry();
      return;
    }

   

    populateChatList(data.dataout);
  } catch (error) {
    console.error('Error fetching chat list:', error);
    await handleSessionExpiry();
  }
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
    allowEscapeKey: false
  });

  localStorage.removeItem("jwtToken");
  localStorage.removeItem("matriId");
  sessionStorage.clear();
  window.location.href = "Login";
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
