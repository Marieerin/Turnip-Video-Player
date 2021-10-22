// General Cache
const videoURL = window.document.getElementById('videoURL');
const videoWidth = window.document.getElementById('videoWidth');
const videoHeight = window.document.getElementById('videoHeight');
const addVideoPlayer = window.document.getElementById('addVideoPlayer');
const videoViewPort = window.document.getElementById('videoViewPort');
const videoImportDiv = window.document.getElementById('videoImportDiv');
const videoLoadingForm = window.document.getElementById('videoLoadingForm');
const autoplay = window.document.getElementById('autoplay')

// videoPlayerControls cache
const playPause = window.document.getElementById('playPause');
const progressBar = window.document.getElementById('progressBar');
const track = window.document.getElementById('track')
const volume = window.document.getElementById('volume');
const fullscreen = window.document.getElementById('fullscreen');
const mute = document.getElementById('mute');

class VideoPlayer {
    constructor(divId, width, height) {
        this.divId = divId,
        this.width = width,
        this.height = height,
        this.viewRatio = '',
        this.autoplay = ''
    }
};

let freshOffThePress  = new VideoPlayer();


// Intersection Observer
const getViewability = () => {
    const video = document.querySelector('#videoImportDiv');
    
    observer = new IntersectionObserver((entries) => {
        ratio = Math.round(entries[0].intersectionRatio * 100);

        freshOffThePress.videRatio = ratio;
        document.getElementById('ratioDisplay').innerHTML = `${ratio}% Viewability`;
    });
    observer.observe(video);
};

// get dimensions
const getHeight = () => {
    return freshOffThePress.height
};
const getWidth = () => {
    return freshOffThePress.width
};

// Resize video
const resize = () => {
    freshOffThePress.width = videoWidth.value;
    freshOffThePress.height =  videoHeight.value;
};

// Load url
const load = (url) => {
    freshOffThePress.divId = url;
};

// Add video to videoViewPort
addVideoPlayer.addEventListener('click', (e) => {
    e.preventDefault();
    resize();
    load(videoURL.value);

    let videoPlayerDiv = 
        `<div id="${freshOffThePress.divId}" class="video">
            <video id="video" width="${freshOffThePress.width}" height="${freshOffThePress.height}" ${freshOffThePress.autoplay}>
                <source src=${videoURL.value} type="video/mp4">
                <source src=${videoURL.value} type="video/webm">
            </video>
        </div>`;

    // loads video
    videoImportDiv.innerHTML = videoPlayerDiv;

    // activates video controls
    document.getElementById('formDisabler').disabled = false;

    getViewability();
    displayProgress();
    playbackState();
    getHeight();
    getWidth();

    // if(freshOffThePress.autoplay === 'autoplay'){
    //     playPause.checked = false
    // };
});

// Sets autoplay
autoplay.addEventListener('click', (e) => freshOffThePress.autoplay === '' ? freshOffThePress.autoplay = 'autoplay' : freshOffThePress.autoplay = '');

// Play / Pause
const playVideo = () => {
    document.getElementById(`video`).play();
}
const pauseVideo = () => {
    document.getElementById(`video`).pause();
}
playPause.addEventListener('click', (e) => e.target.checked ? pauseVideo() : playVideo());

// To fastforward and rewind
progressBar.addEventListener('click', (e)=> {
    let newTime = (e.pageX - track.offsetLeft) / track.offsetWidth;
    let setTime = document.getElementById(`video`).duration * newTime;

    document.getElementById(`video`).currentTime = setTime;
    displayProgress();
});

// Displays progress in the video
const displayProgress = () => {
    const video = document.getElementById('video');
    const progress = document.getElementById('progress');

    video.addEventListener('timeupdate',() => {
        let percentage = (video.currentTime / video.duration) * 100;

        progress.style.width = `${percentage}%`
        document.getElementById('videoProgress').innerHTML = `${Math.round(video.currentTime)} / ${Math.round(video.duration)}`
    });
};

// Playback State
const playbackState = () => {
    const video = document.getElementById('video');
    let currentstate =  document.getElementById('currentState');
    
    currentstate.innerHTML = 'Ready to play!'
    video.addEventListener('playing', () => {
        currentstate.innerHTML = 'Video is playing';
        if(video.ended === true){
            document.getElementById('currentState').innerHTML = 'Video Ended'
        } 
    })
    video.addEventListener('pause', () => {
        currentstate.innerHTML = 'Video is paused'
    })

}

// Changes video volume
volume.addEventListener('click', (e) =>{
    document.getElementById(`video`).volume = e.target.value;

    if (e.target.value === '0'){ 
        mute.checked = false
    } else {
        mute.checked = true;
    }
});

// Mute Button
mute.addEventListener('click', () => mute.checked === true ?  document.getElementById(`video`).volume = volume.value : document.getElementById(`video`).volume = 0);

// Sets Video to fullscreen
fullscreen.addEventListener('click', () => document.getElementById(`video`).requestFullscreen());

// Updates Viewable Video Ratio on Scroll
videoViewPort.addEventListener('scroll', () => getViewability());

// Updates Viewable Video Ratio on Window Resize
window.addEventListener('resize', () => getViewability());

// Loading reset for local storage
document.onload = () => {
    playPause.checked = true;
    mute.checked = true;
    autoplay.checked = false;
};