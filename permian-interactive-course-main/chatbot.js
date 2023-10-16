document.addEventListener("DOMContentLoaded", function() {
    const chatContainer = document.getElementById("chatbot-container");

    // Setup initial chatbot interface
    const chatInterface = `
        <div class="chat-header">Chat with Us!</div>
        <div class="chat-messages"></div>
        <input type="text" class="chat-input" placeholder="Type a message...">
        <button class="chat-send">Send</button>
    `;
    chatContainer.innerHTML = chatInterface;

    const chatInput = chatContainer.querySelector(".chat-input");
    const chatMessages = chatContainer.querySelector(".chat-messages");
    const chatSendButton = chatContainer.querySelector(".chat-send");

    chatSendButton.addEventListener("click", function() {
        const message = chatInput.value;
        if(message.trim()) {
            chatMessages.innerHTML += `<div class="user-message">${message}</div>`;
            chatInput.value = "";

            // Add logic to process the message and respond, e.g., using an API or predefined answers.
            setTimeout(() => {
                chatMessages.innerHTML += `<div class="bot-message">Hello! This is a mock response.</div>`;
            }, 1000);
        }
    });
});
