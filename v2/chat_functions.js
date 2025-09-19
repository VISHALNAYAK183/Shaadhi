// chat_functions.js

// Function to open the chat page and pass data
function openChatPage(receiverMatriId, receiverName, receiverImage) {
  // Store receiver data in localStorage
  const receiverData = {
    receiverName,
    receiverImage,
    receiverMatriId,
  };

  if(localStorage.getItem("my_plan_status") === 'Paid'){ 

  localStorage.setItem('receiverData', JSON.stringify(receiverData));
  window.location.href = 'chat_page.html'; // This will navigate to the chat page
  }
  else{
    window.location.href = 'chat_list.html';
  }
}
