import * as Plotly from 'plotly.js-dist-min';

const path = (window.location.search).split('?')[1];

let letters = [];
const startLetter = path.charAt(0);
console.log(startLetter);
switch (startLetter) {
    case 'A':
        letters = ['A', 'B', 'C', 'D', 'E', 'F'];
        break;
        
    case 'G':
        letters = ['G', 'H', 'I', 'J', 'K', 'L'];
        break;
    case 'M':
        letters = ['M', 'N', 'O', 'P', 'Q', 'R'];
        break;
    case 'S':
        letters = ['S', 'T', 'U', 'V'];
        break;
    case 'W':
        letters = ['W', 'X', 'Y', 'Z'];
        break;
    case '1':
        letters = ['1', '2', '3', '4'];
        break;
    case '5':
        letters = ['5', '6', '7', '8', '9'];
        break;
    default:
        letters = ['A', 'B', 'C', 'D', 'E', 'F'];
        break;
}

console.log(letters);
console.log(path)

const waitTime = 15000;
const detectionDelay = 5000;

// MODEL LINK

let ImageUrl = "../Assets/Images/Alphabet";
if(startLetter === '1' || startLetter === '5'){
    ImageUrl = `../Assets/Images/Numbers`;   
}
const Url = `https://raw.githubusercontent.com/Concerned-Doggo/SignUI/main/Models/${path}/`;
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
let labelContainer = document.getElementById("label-container");
const preloader = document.getElementById("preloader");
const predictionChart = document.getElementById("predictionChart");


const letterImage = document.getElementById('letterImage');
const signImage = document.getElementById('signImage');
const correctMark = document.getElementById('correct');
const nextMark = document.getElementById('nextMark');
correctMark.src = `../Assets/Images/Logos/check-mark.png`;

let model, webcamRun = true, maxPredictions;

let loader = true;
const plotlyLayout = {
    colorway : ['#f3cec9', '#e7a4b6', '#cd7eaf', '#a262a9', '#6f4d96', '#3d3b72', '#182844']
};



// Initializing 
const initilize_btn = document.getElementById("initialize-btn");
initilize_btn.addEventListener("click", () => {
    const btnText = initilize_btn.innerText;
    let initialize_btn_click_cnt = 0;
    if(btnText === "Start Webcam"){
        if(initialize_btn_click_cnt <= 1){
            initialize_btn_click_cnt++;
            loader = true;
        }

        webcamRun = true;
        preloader.classList.remove("hidden");
        initilize_btn.innerText = "Loading...";
        init();
    }
    else if(btnText === "Stop webcam"){
        // preloader.classList.remove("hidden");
        webcamRun = false;
        initilize_btn.innerText = "Start Webcam";
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        camera.stop();
    }

});



let startTime = new Date().getTime();
// let currentTime = new Date().getTime();

// console.log("Start Time: " + startTime);
// console.log("Current Time: " + currentTime);

// console.log("A-F Loaded")
// calling holistic api from mediapipe cdn
const holistic = new Holistic({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
    }
});
// creating camera element
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await holistic.send({ image: videoElement });
    },
    width: 1280,
    height: 720
});


let letterIndex = 0;
letterImage.src = `${ImageUrl}/${letters[letterIndex]}.png?raw=true`;
signImage.src = `/Assets/Images/Signs/${letters[letterIndex]}.png?raw=true`;




async function init() {

    const modelUrl = Url + "model.json";
    const metadataUrl = Url + "metadata.json";

    // load the model and metadata
    model = await tmImage.load(modelUrl, metadataUrl);
    maxPredictions = model.getTotalClasses();
    // append elements to the DOM
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }

    // console.log(loader);
    // configuring our holistic api according to webcam and requirements
    holistic.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: true,
        smoothSegmentation: true,
        refineFaceLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    // creating an camera using holistic api 


    camera.start();

    // console.log(loader);
    // on detecting webcam image draw landmarks
    if (webcamRun) {
        window.requestAnimationFrame(loop);
    }
}

async function loop() {
    // webcam.update(); // update the webcam frame
    holistic.onResults(draw);
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(canvasElement);
    let maxIndex = 0;
    const letterprobabilities = [];
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        letterprobabilities.push(prediction[i].probability.toFixed(2) * 100);
        labelContainer.childNodes[i].innerHTML = classPrediction;
        if (prediction[i].probability > prediction[maxIndex].probability) {
            maxIndex = i;
        }
    }
    if (startTime + detectionDelay < new Date().getTime() && prediction[maxIndex].className == letters[letterIndex]) {
        
        correctMark.classList.remove("hidden");
        nextMark.classList.remove("hidden");
        setTimeout(() => {
            nextMark.classList.add("hidden");
            correctMark.classList.add("hidden");
        }, 1500);

        startTime = new Date().getTime();
        letterIndex = (letterIndex + 1) % letters.length;
        letterImage.src =  `${ImageUrl}/${letters[letterIndex]}.png?raw=true`;
        signImage.src =  `/Assets/Images/Signs/${letters[letterIndex]}.png?raw=true`;
    }
    if(initilize_btn.innerText === "Stop webcam" && startTime + waitTime < new Date().getTime() &&  prediction[maxIndex].className != letters[letterIndex]){
        nextMark.classList.remove("hidden");
        setTimeout(() => {
            nextMark.classList.add("hidden");
        }, 1500)
        startTime = new Date().getTime();
        letterIndex = (letterIndex + 1) % letters.length;
        letterImage.src =  `${ImageUrl}/${letters[letterIndex]}.png?raw=true`;
        signImage.src =  `/Assets/Images/Signs/${letters[letterIndex]}.png?raw=true`;
    }
    const data = [{
        x: letterprobabilities,
        y: letters,
        type: "bar",
        orientation: "h",
        marker: { color: ['#f3cec9', '#e7a4b6', '#cd7eaf', '#a262a9', '#6f4d96', '#3d3b72', '#182844'] }
    }];

    Plotly.newPlot("predictionChart", data, plotlyLayout);
}

function draw(results) {
    if (loader) {
        startTime = new Date().getTime();
        loader = false;
        preloader.classList.add("hidden");
        initilize_btn.innerText = "Stop webcam";
    }
    if(!webcamRun){
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        return;
    }
    // console.log("Called draw function")
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);


    // Only overwrite missing pixels.
    canvasCtx.globalCompositeOperation = 'destination-atop';
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);

    canvasCtx.globalCompositeOperation = 'source-over';
    //drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
    //              {color: '#00FF00', lineWidth: 4});
    //drawLandmarks(canvasCtx, results.poseLandmarks,
    //              {color: '#FF0000', lineWidth: 2});
    //
    //drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION,
    //               {color: '#C0C0C070', lineWidth: 1});
    drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS,
        { color: '#CC0000', lineWidth: 5 });
    drawLandmarks(canvasCtx, results.leftHandLandmarks,
        { color: '#00FF00', lineWidth: 2 });
    drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS,
        { color: '#00CC00', lineWidth: 5 });
    drawLandmarks(canvasCtx, results.rightHandLandmarks,
        { color: '#FF0000', lineWidth: 2 });
    canvasCtx.restore();
}
