
const qrcode = window.qrcode;

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

const qrResult = document.getElementById("qr-result");
const outputData = document.getElementById("outputData");
const btnScanQR = document.getElementById("btn-scan-qr");
const contentBody = document.getElementById("content_jobs");

const pet_type = document.getElementById("pet_type");
const pet_name = document.getElementById("pet_name");
const pet_amount = document.getElementById("pet_amount");

let scanning = false;

qrcode.callback = res => {
    if (res) {
        console.log(res);
        outputData.innerText = res;

        var nameArr = res.split(';');
        pet_type.innerText = nameArr[3];
        pet_name.innerText = nameArr[4];
        pet_amount.innerText = nameArr[2];

        scanning = false;

        video.srcObject.getTracks().forEach(track => {
            track.stop();
        });

        $('#qrCode').popup("open");
        qrResult.hidden = false;
        canvasElement.hidden = true;
        btnScanQR.hidden = false;
        contentBody.hidden = false;
    }
};

btnScanQR.onclick = () => {
    navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then(function (stream) {
            scanning = true;
            qrResult.hidden = true;
            $('#qrCode').popup("close");
            btnScanQR.hidden = true;
            contentBody.hidden = true;
            canvasElement.hidden = false;
            video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
            video.srcObject = stream;
            video.play();
            tick();
            scan();
        });
};

function tick() {
    canvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

    scanning && requestAnimationFrame(tick);
}

function scan() {
    try {
        qrcode.decode();
    } catch (e) {
        setTimeout(scan, 300);
    }
}

