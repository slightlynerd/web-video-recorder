const video = getId('video');
const startBtn = getId('start-btn');
const stopBtn = getId('stop-btn');
startBtn.addEventListener('click', startRecording);
stopBtn.addEventListener('click', stopRecording);

let stream = null;
let mediaRecorder = null;
let chunks = [];

const constraints = {
  video: true,
  audio: true
};

// returns the DOM element with the id
function getId(id) {
  return document.getElementById(id);
}

// initialize app
async function init() {
  try {
    // check if browser supports mediaDevices
    if (navigator.mediaDevices) {
      // get stream and pass it to video element
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = stream;
      // mute video due to chrome autoplay policies
      video.volume = 0;
    }
    else {
      alert('MediaDevices not supported by this browser');
    }
  } catch (e) {
    console.log(e);
  }
}

// start recording media
async function startRecording() {
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.start();

  // push recording data to array when new data is available
  mediaRecorder.ondataavailable = (e) => {
    chunks.push(e.data);
  }
}

// stop recording media
async function stopRecording() {
  mediaRecorder.stop();

  mediaRecorder.onstop = (e) => {
    const recordingName = prompt('Enter name of recording');
    const recording = document.createElement('a');
    // set download attribute of link to video name
    recording.download = [recordingName, '.mp4'].join('');
    // create a new blob object using the recording data
    const blob = new Blob(chunks, { 'type' : 'video/mp4; codecs=vp8' });
    const videoURL = URL.createObjectURL(blob);
    // append blob url to the link to make it downloadable
    recording.href = videoURL;
    chunks = [];
    // download the video
    recording.click();
  }
}

init();