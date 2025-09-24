// chat_list.js

// Wait for the DOM to be fully loaded
// document.addEventListener('DOMContentLoaded', () =>
  function get_list_js() {
  

  const myPlanStatus = localStorage.getItem("my_plan_status");
  
  const upgradeCard = document.getElementById("upgrade_card");
  const listCard = document.getElementById("list_card");

  
  const chatListContainer = document.getElementById('chatList');

  // Ensure that the element exists before proceeding
  if (!chatListContainer) {
   console.error('Chat list container not found!');
    return;
  }

  // Function to fetch chat list data
  async function fetchChatList() {

    if (myPlanStatus != 'Paid') {
      upgradeCard.style.display = 'block';
   } else {
       if (listCard) listCard.style.display = 'block';  
       get_list_js();
   }

   async function get_list_js(){
    try {
      const response = await fetch(`${BASE_URL}/message.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matri_id: localStorage.getItem("matriId"), // Replace with logged-in user's matri_id
          type: 'chat_list',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chat list');
      }

      const data = await response.json();
      populateChatList(data.dataout); // Call function to populate the list
    } catch (error) {
     console.error('Error fetching chat list:', error);
    }
  }
}
  

  // Function to populate the chat list
  function populateChatList(chatList) {
    chatList.forEach((chat) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <img src="${localStorage.getItem("baseURL")+chat.url}" alt="${chat.first_name} ${chat.last_name}"/>
        <div style="display: flex; flex-direction: column;">
        <span>${chat.first_name} ${chat.last_name}</span>
        <span>${chat.matri_id}</span>
        </div>
      `;
      listItem.addEventListener('click', () => openChat(chat));  // Open chat on click
      chatListContainer.appendChild(listItem);
    });
  }

  // Fetch the chat list when the page loads
  fetchChatList();

}
// );

// Function to open the chat page (function call)
function openChat(chat) {
  // Open the chat page by passing necessary data
  openChatPage(chat.matri_id, chat.first_name+" "+chat.last_name, chat.url);
}
