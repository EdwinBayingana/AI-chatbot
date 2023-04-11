import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
  element.textContent = '';
  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300); // Repeating every 300 milliseconds
}

function typeText(element, text) {
  let index = 0;
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return `
     <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img src="${isAi ? bot : user}" alt="${isAi ? 'bot' : 'user'}"/>
        </div>
        <div class="message" id=${uniqueId}>
          ${value}
        </div>
      </div>
     </div>
    `;
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // Generate the User's chatStripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  // Generate the Bot's chatStripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, ' ', uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight; // Keep scrolling down as the user types in the textarea

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  // Fetch data from the server "bot's response"
  const response = await fetch('https://yanna.onrender.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: data.get('prompt'),
    }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();

    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();

    messageDiv.innerHTML = 'Something went wrong';

    alert(err);
  }
};

form.addEventListener('submit', handleSubmit); // Submit by clicking the submit button
form.addEventListener('keyup', (e) => {
  // Submit by clicking the 'Enter' button on the keyboard
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});

// footer date
let yearNow = document.querySelector('#date-now');
let today = new Date();
yearNow.innerHTML = today.getFullYear();
