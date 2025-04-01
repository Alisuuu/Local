// Script do primeiro HTML
import { transformSrtTracks } from 'https://cdn.jsdelivr.net/gh/codeit-ninja/SRT-Support-for-HTML5-videos@master/dist/main.es.js';
var track_elem = document.querySelector('track');

document.querySelector('#input-change-line').addEventListener('change',initialize_test,false);
document.querySelector('[name="video"]').addEventListener("change", function() {
  loader(this);
});
document.querySelector('[name="track"]').addEventListener("change", function() {
  loader(this);
});
document.querySelector('video').addEventListener('loadedmetadata',resize, false);

function resize(video) {
	var video = document.querySelector('video');
	video.width = video.videoWidth*1.5;
};

function loader(elm) {
	if (elm.name != 'track')
		document.querySelector(elm.name).src = URL.createObjectURL(elm.files[0]);

	if (elm.name == 'track') {
		var elm_actual;
		if (document.querySelectorAll(elm.name).length>0) {
			elm_actual = document.querySelector(elm.name);
			for (var i = elm_actual.parentNode.textTracks.length - 1; i >= 0; i--)
				elm_actual.parentNode.textTracks[i].mode = "disabled";
			document.querySelector(elm.name).parentNode.removeChild(document.querySelector(elm.name));
		}
		var track = document.createElement('track');
		var elm_actual = document.querySelector('video').appendChild(track), encoding, is_srt;
		document.querySelector(elm.name).src = URL.createObjectURL(elm.files[0]);
		initialize_test();
		elm_actual.setAttribute('kind', 'subtitles');
		elm_actual.setAttribute('default', '');
		is_srt = elm.files[0].name.toLowerCase().endsWith('.srt');
		languageEncoding(elm.files[0]).then(fileInfo => {encoding = fileInfo.encoding;
			if (encoding !== null) {
				elm_actual.setAttribute('label', fileInfo.language == null ? 'Unknown' : fileInfo.language.replace(/^./, str => str.toUpperCase()));
				if (is_srt)
					elm_actual.setAttribute('data-encoding', encoding);
			}
			if (is_srt)
				transformSrtTracks(elm_actual.parentNode);
		});
	}
}

function initialize_test() {
  var i, j, track, video = document.querySelector('video');
  track = video.textTracks;
  for (i=0; i<track.length; i++) {
	if (track[i].cues != null)
		for (j=0; j<track[i].cues.length; j++)
			track[i].cues[j].line = parseInt(document.querySelector('#input-change-line').value);
  }
}

// Script do segundo HTML (chat.html)
const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

const BOT_CMDS = {
  '/initial': 'Olá, bem-vindo ao Chat! Use <code>/</code> para comandos (ex: <code>/pause</code>)',
  '/pause': 'Vídeo pausado',
  '/play': 'Vídeo reproduzindo'
}

const BOT_MSGS = [
  "Oi, tudo bem?",
  "Hmm... Não entendi o que você quis dizer. Desculpe!",
  "Eu gosto de jogar... Mas não sei como jogar!",
  "Desculpe se minhas respostas não são relevantes. :))",
  "Estou com sono! :("
];

const BOT_IMG = "";
const PERSON_IMG = "";
const BOT_NAME = "BOT";
const PERSON_NAME = "";
const BOT_CMD_ONLY = true;

botResponse('/initial');
msgerForm.addEventListener("submit", event => {
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;

  var host = get("#name");
  if (host.value != '')
    host = host.value;
  else
    host = host.placeholder.split(' ', 1)[0];

  appendMessage(host, PERSON_IMG, "right", msgText);
  msgerInput.value = "";

  if (!BOT_CMD_ONLY || msgText.charAt() == '/')
   botResponse(msgText);
});

function appendMessage(name, img, side, text) {
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop = msgerChat.scrollHeight;
}

function botResponse(themsg) {
  if (BOT_CMDS[themsg])
    appendMessage(BOT_NAME, BOT_IMG, "left", BOT_CMDS[themsg]);
  else {
    const r = random(0, BOT_MSGS.length - 1);
    const msgText = BOT_MSGS[r];
    const delay = msgText.split(" ").length * 100;

    setTimeout(() => {
      appendMessage(BOT_NAME, BOT_IMG, "left", msgText);
    }, delay);
  }
}

function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}