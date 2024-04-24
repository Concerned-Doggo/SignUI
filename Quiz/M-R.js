import * as Plotly from 'plotly.js-dist-min';

// MODEL LINK

const URL = "http://localhost:5173/Models/A-F/";
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
let labelContainer = document.getElementById("label-container");
const preloader = document.getElementById("preloader");
const predictionChart = document.getElementById("predictionChart");


const letterImage = document.getElementById('letterImage');
const signImage = document.getElementById('signImage');

let model, webcamRun = true, maxPredictions, score = 0;

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



// Initializing 
const initilize_btn = document.getElementById("initialize-btn");
initilize_btn.addEventListener("click", () => {
    let initialize_btn_clickCnt = 0;
    const btnText = initilize_btn.innerText;
    let initialize_btn_click_cnt = 0;
    if (btnText === "Start Webcam") {
        if(initialize_btn_click_cnt <= 1){
            initialize_btn_click_cnt++;
            loader = true;
        }

        preloader.classList.remove("hidden");
        initilize_btn.innerText = "Loading...";
        webcamRun = true;
        init();
    }
    else if (btnText === "Stop webcam") {
        // preloader.classList.remove("hidden");
        webcamRun = false;
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        initilize_btn.innerText = "Start Webcam";
        camera.stop();
    }

});

let loader = true;
const plotlyLayout = {
    colorway: ['#f3cec9', '#e7a4b6', '#cd7eaf', '#a262a9', '#6f4d96', '#3d3b72', '#182844']
};

const letters = ["M","N","O","P","Q","R"];


let startTime = new Date().getTime();
let firstTime = true;

let letterIndex = 0;
letterImage.src = "../Assets/Images/Alphabet/" + letters[letterIndex] + ".png";
signImage.src = "../Assets/Images/Signs/" + letters[letterIndex] + ".png";




async function init() {

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
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
        startTime = new Date().getTime();
        window.requestAnimationFrame(loop);
    }
    // holistic.onResults(draw); //change
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
    // adding delay before every new letter prediction
    if (startTime + 5000 < new Date().getTime() && prediction[maxIndex].className == letters[letterIndex]) {
        score += 5;
        startTime = new Date().getTime();
        letterIndex = (letterIndex + 1) % letters.length;
        letterImage.src = "../Assets/Images/Alphabet/" + letters[letterIndex] + ".png";
        signImage.src = "../Assets/Images/Signs/" + letters[letterIndex] + ".png";
        console.log(score);
    }
    if(initilize_btn.innerText == "Stop webcam" && startTime + 15000 <= new Date().getTime()){
        score -= 5;
        startTime = new Date().getTime();
        letterIndex = (letterIndex + 1) % letters.length;
        letterImage.src = "../Assets/Images/Alphabet/" + letters[letterIndex] + ".png";
        signImage.src = "../Assets/Images/Signs/" + letters[letterIndex] + ".png";
        console.log(score);
    }



    // if(initilize_btn.innerText === "Stop webcam" && startTime + 15000 < new Date().getTime() &&  prediction[maxIndex].className != letters[letterIndex]){
    //     startTime = new Date().getTime();
    //     letterIndex = (letterIndex + 1) % letters.length;
    //     letterImage.src = "../Assets/Images/Alphabet/" + letters[letterIndex] + ".png";
    //     signImage.src = "../Assets/Images/Signs/" + letters[letterIndex] + ".png";
    // }
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

