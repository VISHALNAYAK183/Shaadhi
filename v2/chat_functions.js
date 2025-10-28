function openChatPage(receiverMatriId, receiverName, receiverImage) {
  const receiverData = {
    receiverName,
    receiverImage,
    receiverMatriId,
  };

  // Ensure token is updated before redirection
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    console.error("No token found before opening chat!");
    handleSessionExpiry();
    return;
  }

  if (localStorage.getItem("my_plan_status") === 'Paid') {
    localStorage.setItem('receiverData', JSON.stringify(receiverData));
    window.location.href = 'chat_page.html';
  } else {
    window.location.href = 'chat_list.html';
  }
}
