let videoPlayer;
let currentVideo = 0;

const magicLocation = {
  x: "6.5%",
  y: "26.5rem",
  w: "35rem",
  h: "7.8rem",
};

const magicLocation2 = {
  x: "6.5%",
  y: "26.5rem",
  w: "35rem",
  h: "7.8rem",
};

function changeVideo(videoPath) {
  videoPlayer.src({ type: "video/mp4", src: videoPath });
  videoPlayer.play();
}

function populateSlides(slides) {
  const slidesContainer = document.querySelector(".slider__slides");

  slides.forEach((slide, index) => {
    // Create slide thumbnail
    const slideElement = document.createElement("div");
    slideElement.classList.add("slider__slide");
    slideElement.style.backgroundImage = `url(${slide.thumbnail})`;

    // Create title with .slider__slide-title class
    const slideTitle = document.createElement("h3");
    // slideTitle.classList.add('slider__slide-title');
    slideTitle.textContent = slide.title;

    // Append the title to the slide name container
    const slideName = document.createElement("div");
    slideName.classList.add("slider__slide-name");
    slideName.appendChild(slideTitle);

    // Append the slide name container to the slide
    slideElement.appendChild(slideName);

    // Event listener for slide click
    slideElement.addEventListener("click", () => {
      changeVideo(slide.video);
      setTimeout(() => {
        currentVideo = slide.id - 1;
      }, 0);
    });

    // Append the slide to the slides container
    slidesContainer.appendChild(slideElement);
  });
}

let fuse;

// Fetching data from slides.json for Fuse.js searching
fetch("slides.json")
  .then((response) => response.json())
  .then((data) => {
    const options = {
      keys: ["title", "description"],
      threshold: 0.3,
      includeScore: true, // Useful for debugging
      shouldSort: true,
      caseSensitive: false,
    };
    fuse = new Fuse(data, options);
  });

function handleSearch() {
  const inputElement = document.querySelector("#chats #message");
  const query = inputElement.value.trim();
  const results = fuse.search(query);
  console.log(results);

  if (results.length > 0) {
    const matchedVideo = results[0].item.video;
    changeVideo(matchedVideo); // Use the changeVideo function
  }

  inputElement.value = ""; // Clear the input after handling the search
}

document.addEventListener("DOMContentLoaded", function () {
  const sendButton = document.querySelector("button");
  const messageInput = document.querySelector("#chats #message");

  messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  });

  sendButton.addEventListener("click", handleSearch);

  let slidesData;

  // Fetch slides from JSON and populate the slider
  fetch("./slides.json")
    .then((response) => response.json())
    .then((data) => {
      populateSlides(data);
      slidesData = data;
    });

  videoPlayer = videojs("my-video"); // Use Video.js's API
  videoPlayer.controlBar.removeChild(
    videoPlayer.controlBar.getChild("PictureInPictureToggle")
  );
  videoPlayer.controlBar.removeChild(
    videoPlayer.controlBar.getChild("FullscreenToggle")
  );

  const magicButton13 = document.getElementById("magic-button");
  if (magicButton13) {
    magicButton13.style.left = magicLocation.x;
    magicButton13.style.top = magicLocation.y;
    magicButton13.style.width = magicLocation.w;
    magicButton13.style.height = magicLocation.h;

    magicButton13.addEventListener("click", () => {
      changeVideo(slidesData[currentVideo === 0 ? 2 : 4].video);
      setTimeout(() => {
        currentVideo = currentVideo === 0 ? 2 : 4;
      }, 0);
    });
  }

  const helpInput = document.querySelector("#provide-help form input");
  const helpForm = document.querySelector("#provide-help form");
  helpForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    helpInput.value = "";
  });

  const chatEmojis = document.querySelectorAll("#chats-emojis button");
  const input = document.querySelector("#chats form input");

  const add = (emoji) => {
    input.value += emoji;
  };

  Array.from(chatEmojis).forEach((emoji) => {
    emoji.addEventListener("click", (event) => {
      add(event.target.textContent.trim());
    });
  });

  const form = document.querySelector("#chats form");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    input.value = "";
  });
});

// function handleChatSearch() {
//     const inputElement = document.querySelector('.chat-input'); // targeting the chatbot input
//     const query = inputElement.value.trim();
//     const results = fuse.search(query);

//     if (results.length > 0) {
//         const matchedResponse = results[0].item.response; // Assuming the structure has a 'response' field
//         displayChatResponse(matchedResponse); // This is a new function you need to implement
//     }
// }

// document.addEventListener('DOMContentLoaded', function() {
//     const chatSendButton = document.querySelector('.chat-send');
//     const chatInput = document.querySelector('.chat-input');

//     chatInput.addEventListener('keydown', (event) => {
//         if (event.key === "Enter") {
//             handleChatSearch();
//         }
//     });

//     chatSendButton.addEventListener('click', handleChatSearch);

//     // If you have some initial data fetch, you can keep this
//     // fetch('./responses.json') // Example: fetch predefined responses from a JSON
//     // .then(response => response.json())
//     // .then(data => populateChatResponses(data)); // This is a new function you'd implement
// });

// function displayChatResponse(response) {
//     const chatMessagesDiv = document.querySelector('.chat-messages');
//     const newMessageDiv = document.createElement('div');
//     newMessageDiv.classList.add('bot-message');
//     newMessageDiv.textContent = response;
//     chatMessagesDiv.appendChild(newMessageDiv);
//     chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight; // scroll to bottom to see latest message
// }

import Alpine from "https://cdn.skypack.dev/alpinejs@3.11.1";

//Demo variables
const mockTypingAfter = 1500;
const mockResponseAfter = 3000;
// const mockOpeningMessage =
//   "Hello there. I am FakeGPT. Created by Jan Willem Kolkman. Aks me anything you want. I will not have a usefull response. I will just echo what you sent me.";
// const mockResponsePrefix = "Thanks for sending me: ";

document.addEventListener("alpine:init", () => {
  Alpine.data("chat", () => ({
    newMessage: "",
    showTyping: false,
    waitingOnResponse: true,
    messages: [],
    init() {
      this.mockResponse(mockOpeningMessage);
    },
    sendMessage() {
      if (this.waitingOnResponse) return;
      this.waitingOnResponse = true;
      this.messages.push({ role: "user", body: this.newMessage });
      this.newMessage = "";
      window.scrollTo(0, 0); //To fix weird iOS zoom on input
      this.mockResponse();
    },
    typeOutResponse(message) {
      this.messages.push({ role: "assistant", body: "", beingTyped: true });
      let responseMessage = this.messages[this.messages.length - 1];
      let i = 0;
      let interval = setInterval(() => {
        responseMessage.body += message.charAt(i);
        i++;
        if (i > message.length - 1) {
          this.waitingOnResponse = false;
          delete responseMessage.beingTyped;
          clearInterval(interval);
        }
      }, 30);
    },
    mockResponse(message) {
      setTimeout(() => {
        this.showTyping = true;
      }, mockTypingAfter);
      setTimeout(() => {
        this.showTyping = false;
        let responseMessage =
          message ??
          mockResponsePrefix + this.messages[this.messages.length - 1].body;
        this.typeOutResponse(responseMessage);
      }, mockResponseAfter);
    },
  }));
});

Alpine.start();

// function handleSearch() {
//     const inputElement = document.querySelector('input[type="search"]');
//     const query = inputElement.value.trim();
//     const results = fuse.search(query);

//     if (results.length > 0) {
//         const matchedVideo = results[0].item.video;
//         changeVideo(matchedVideo); // Use the changeVideo function
//     }
// }

// document.addEventListener('DOMContentLoaded', function() {
//     const searchIcon = document.querySelector('#basic-addon2');
//     const searchInput = document.querySelector('input[type="search"]');

//     searchInput.addEventListener('keydown', (event) => {
//         if (event.key === "Enter") {
//             handleSearch();
//         }
//     });

//     searchIcon.addEventListener('click', handleSearch); // Call handleSearch on icon click

//     // Fetch slides from JSON and populate the slider
//     fetch('./slides.json')
//     .then(response => response.json())
//     .then(data => populateSlides(data));
// });

// const slider = document.querySelector('.slider');
// const sliderArrow = document.querySelector('.slider__arrow');

// slider.addEventListener('mouseenter', function() {
//     sliderArrow.style.transform = 'translateX(300px)'; // Adjust translateX value as needed
// });

// slider.addEventListener('mouseleave', function() {
//     sliderArrow.style.transform = 'translateX(0)';
// });
