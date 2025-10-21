const tasks = [];
let time = 0;
let timer = null;
let timerBreak = null;
let current = null;
let statusApp = "stop";

const bAdd = document.querySelector("#bAdd");
const itTask = document.querySelector("#itTask");
const form = document.querySelector("#form");
document.getElementById('year').textContent = new Date().getFullYear();
const audio = document.getElementById('musica');


renderTasks();
renderTime();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (itTask.value !== "") {
    createTask(itTask.value);
    itTask.value = "";
    renderTasks();
  }
});

function createTask(value) {
  const newTask = {
    id: (Math.random() * 100).toString(36).slice(2),
    title: value,
    completed: false,
  };

  tasks.unshift(newTask);
}

function renderTasks() {
  const html = tasks.map((task) => {
    let buttonHTML = "";

    if (task.completed) {
      buttonHTML = "<span class='done'>Listo</span>";
    } else if (task.id === current) {
      buttonHTML = "<span class='in-progress'>En progreso</span>";
    } else {
      buttonHTML = `<button class="start-button" data-id="${task.id}">Iniciar</button>`;
    }

    return `
      <div class="task">
        <div class="completed">${buttonHTML}</div>
        <div class="title">${task.title}</div>
      </div>`;
  });

  const tasksContainer = document.querySelector("#tasks");
  tasksContainer.innerHTML = html.join("");

  const startButtons = document.querySelectorAll(".task .start-button");
  startButtons.forEach((startButton) => {
    startButton.addEventListener("click", () => {
      if (!timer) {
        startButtonHandler(startButton.getAttribute("data-id"));
        startButton.textContent = "En progreso";
      }
    });
  });
}


const config = document.getElementById('config');
const p = document.getElementById('texto');

function startButtonHandler(id) {
  time = workTime;
  current = id;

  const taskId = tasks.findIndex((task) => task.id === id);
  document.querySelector("#time #taskName").textContent = tasks[taskId].title;
  config.classList.add('hidden');
  p.classList.add('hidden'); 
  audio.src = "./videoplayback.mp4";
  audio.currentime = Math.floor(Math.random() * 661);
  audio.play();
  timer = setInterval(() => {
    timerHandler(id);
  }, 1000);
}

function timerHandler(id = null) {
  time--;
  renderTime();
  if (time === 0) {
    markComplete(id);
    clearInterval(timer);
    renderTasks();
    startBreak();
  }
}

function markComplete(id) {
  const taskId = tasks.findIndex((task) => task.id === id);
  tasks[taskId].completed = true;
}

function startBreak() {
  time = breakTime;
  document.querySelector("#time #taskName").textContent = "Break";
  timerBreak = setInterval(timerBreakHandler, 1000);
}

function timerBreakHandler() {
  time--;
  renderTime();
  config.classList.remove('hidden');
  p.classList.remove('hidden'); 
  audio.src = "";
  if (time === 0) {
    clearInterval(timerBreak);
    current = null;
    document.querySelector("#time #taskName").textContent = "";
    renderTime();
    configDiv.style.display = "flex";
  }
}

function renderTime() {
  const timeDiv = document.querySelector("#time #value");
  const minutes = parseInt(time / 60);
  const seconds = parseInt(time % 60);
  timeDiv.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
}
let workTime = 25 * 60;
let breakTime = 5 * 60;

const workInput = document.querySelector("#workTime");
const breakInput = document.querySelector("#breakTime");
const saveConfigBtn = document.querySelector("#saveConfig");

saveConfigBtn.addEventListener("click", () => {
  const newWork = parseInt(workInput.value);
  const newBreak = parseInt(breakInput.value);

  if (newWork > 0 && newBreak > 0) {
    workTime = newWork * 60;
    document.getElementById('min1').textContent = workTime /60;
    breakTime = newBreak * 60;
    document.getElementById('min2').textContent = breakTime /60;
  }
});

document.getElementById('min1').textContent = workTime /60; 
document.getElementById('min2').textContent = breakTime /60;