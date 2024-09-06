// Select the cake and add a video container
const cake = document.querySelector('.cake');
const videoContainer = document.querySelector('.video-container');
const birthdayVideo = document.getElementById('birthdayVideo');

// Add background music
const music = new Audio('HELP WHY ARE THE PEOPLE USING THIS SOUND_1725527506_musicaldown.com.mp3'); // Replace with the path to your music file
music.loop = true; // Loop the music
music.play();

// Function to check if all flames are extinguished
function checkAllCandlesBlown() {
    const flames = document.querySelectorAll('.flame');
    if (flames.length === 0) {
        // Wait for 1 second before unmuting and showing the video in the background
        setTimeout(() => {
            // Make the video container fullscreen and place it in the background
            videoContainer.style.display = 'block'; // Show the video container

            // Pause the background music
            music.pause();
            music.currentTime = 0; // Optionally reset the music to the start

            // Automatically play the video muted initially
            birthdayVideo.muted = true;
            birthdayVideo.play(); // Start playing the video

            // After 1 second, unmute the video
            setTimeout(() => {
                birthdayVideo.muted = false; // Unmute after 1 second
            }, 1000);
        }, 1000);
    }
}

// Function to create a new candle where the user clicks on the cake
function addCandle(x, y) {
    const candle = document.createElement('div');
    candle.classList.add('candle');
    candle.style.left = `${x - 8}px`; // Position the candle
    candle.style.top = `${y - 50}px`; // Position the candle

    // Create the flame
    const flame = document.createElement('div');
    flame.classList.add('flame');
    candle.appendChild(flame);

    // Add the candle to the cake
    cake.appendChild(candle);
}

// Function to extinguish the flame
function extinguishFlame(flame) {
    flame.remove(); // Remove the flame element
    checkAllCandlesBlown(); // Check if all candles are blown out
}

// Function to detect blowing via microphone
async function detectBlow() {
    try {
        // Access the microphone
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new AudioContext();
        const microphone = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        microphone.connect(analyser);

        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function checkBlow() {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
            }

            // Calculate the average volume level
            const average = sum / bufferLength;

            // If the volume exceeds the threshold, extinguish all flames
            if (average > 60) {
                const flames = document.querySelectorAll('.flame');
                flames.forEach(extinguishFlame);
            }

            requestAnimationFrame(checkBlow); // Continuously check for microphone input
        }

        checkBlow(); // Start the loop to check for blowing

    } catch (err) {
        console.error('Error accessing microphone:', err);
    }
}

// Event listener to add a candle where the cake is clicked
cake.addEventListener('click', function (event) {
    const x = event.offsetX;
    const y = event.offsetY;
    addCandle(x, y);
});

// Start detecting microphone input
detectBlow();
