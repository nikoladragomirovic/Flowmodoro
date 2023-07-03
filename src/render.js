const Timer = document.getElementById("timer");
const Body = document.getElementById("body");

const bgStart = document.querySelector(".bg-start");
const bgPause = document.querySelector(".bg-pause");

let seconds = 0;
let interval;
let paused = false;
ratio = 0.2;

function format_time(total_seconds) {
  let minutes = Math.floor(total_seconds / 60);
  let seconds = total_seconds % 60;
  minutes = minutes.toString().padStart(2, "0");
  seconds = seconds.toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function start_timer() {
  if (!interval) {
    interval = setInterval(() => {
      seconds++;
      Timer.textContent = format_time(seconds);
    }, 1000);
    paused = false;
    bgStart.style.opacity = "1";
    bgPause.style.opacity = "0";
  } else {
    pause_timer();
  }
}

function pause_timer() {
  clearInterval(interval);
  const fileUrl = "preference.txt";
  const xhr = new XMLHttpRequest();
  xhr.open("GET", fileUrl, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const contents = xhr.responseText;
      if (contents == "short") {
        ratio = 0.1;
      } else if (contents == "default") {
        ratio = 0.2;
      } else if (contents == "long") {
        ratio = 0.4;
      }
      let countdownSeconds = Math.floor(seconds * ratio);
      seconds = countdownSeconds;
      Timer.textContent = format_time(countdownSeconds);
      interval = setInterval(() => {
        countdownSeconds > 0 ? countdownSeconds-- : reset_timer();
        Timer.textContent = format_time(countdownSeconds);
        if (countdownSeconds === 0) {
          clearInterval(interval);
        }
      }, 1000);
      paused = true;
      bgStart.style.opacity = "0";
      bgPause.style.opacity = "1";
    }
  };
  xhr.send();
}

function reset_timer() {
  clearInterval(interval);
  seconds = 0;
  Timer.textContent = format_time(seconds);
  interval = null;
  paused = false;
  bgStart.style.opacity = "0";
  bgPause.style.opacity = "0";
}

Body.addEventListener("click", () => {
  if (paused) {
    reset_timer();
  } else {
    start_timer();
  }
});
