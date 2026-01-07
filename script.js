// 全局变量
const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const progressThumb = document.getElementById('progressThumb');
const volumeSlider = document.getElementById('volumeSlider');
const lyricsContainer = document.getElementById('lyricsContainer');
const lyricsContent = document.getElementById('lyricsContent');
const vinylRecord = document.querySelector('.vinyl-record');
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');
const timeCurrentElem = document.querySelector('.time-current');
const timeTotalElem = document.querySelector('.time-total');

// 歌词数据
let lyrics = [
    { time: 14, text: "欲说还休的话，" },
    { time: 17, text: "欲进还退的她，" },
    { time: 20, text: "徘徊惆怅，" },
    { time: 22, text: "始终没能够抵达。" },
    { time: 27, text: "情意绵绵如画，" },
    { time: 30, text: "真心错付成沙，" },
    { time: 34, text: "温柔刹那，" },
    { time: 36, text: "却化作刻骨伤疤。" },
    { time: 40, text: "看窗外黄叶落，" },
    { time: 44, text: "看孤鸿影单飞落，" },
    { time: 48, text: "听秋爽冷寒心魄，" },
    { time: 51, text: "把情丝斩破。" },
    { time: 55, text: "任泪水多滂沱，" },
    { time: 58, text: "任哀愁多寂寞，" },
    { time: 61, text: "任寒风瑟瑟，" },
    { time: 64, text: "任夜色萧索。" },
    { time: 81, text: "言不由衷的话，" },
    { time: 85, text: "欲罢难休的她，" },
    { time: 88, text: "犹豫彷徨，" },
    { time: 90, text: "一直没能够表达。" },
    { time: 95, text: "情深意浓似画，" },
    { time: 98, text: "痴心付之东流，" },
    { time: 100, text: "甜蜜瞬间，" },
    { time: 102, text: "却变成痛苦无涯。" },
    { time: 107, text: "看窗外黄叶落，" },
    { time: 110, text: "看孤鸿影单飞落，" },
    { time: 114, text: "听秋爽冷寒心魄，" },
    { time: 118, text: "把情丝斩破。" },
    { time: 121, text: "任泪水多滂沱，" },
    { time: 123, text: "任哀愁多寂寞，" },
    { time: 127, text: "任寒风瑟瑟，" },
    { time: 130, text: "任夜色萧索。" },
    { time: 134, text: "看窗外黄叶落，" },
    { time: 137, text: "看孤鸿影单飞落，" },
    { time: 141, text: "听秋爽冷寒心魄，" },
    { time: 145, text: "把情丝斩破。" },
    { time: 148, text: "任泪水多滂沱，" },
    { time: 151, text: "任哀愁多寂寞，" },
    { time: 154, text: "任寒风瑟瑟，" },
    { time: 157, text: "任夜色萧索。" }
];
let currentLyricIndex = -1;

// 音频可视化
const canvas = document.getElementById('visualizer');
const canvasCtx = canvas.getContext('2d');
let audioContext;
let analyser;
let dataArray;
let animationId;
let audioSourceCreated = false;

// 初始化画布大小
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 初始化音频可视化
function initAudioVisualizer() {
    // 只在 HTTP 服务器环境下启用音频可视化，避免 CORS 问题
    if (window.location.protocol === 'file:') {
        return;
    }
    
    if (!audioContext && !audioSourceCreated) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaElementSource(audioPlayer);
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            analyser.fftSize = 256;
            
            const bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
            audioSourceCreated = true;
        } catch (error) {
            audioSourceCreated = true;
        }
    }
}

// 绘制音频可视化
function drawVisualizer() {
    if (!analyser) return;
    
    animationId = requestAnimationFrame(drawVisualizer);
    analyser.getByteFrequencyData(dataArray);
    
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.9;
    
    const barCount = 60;
    const barWidth = 3;
    
    for (let i = 0; i < barCount; i++) {
        const angle = (Math.PI * 2 * i) / barCount;
        const dataIndex = Math.floor((i / barCount) * dataArray.length);
        const barHeight = (dataArray[dataIndex] / 255) * radius * 0.5;
        
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + barHeight);
        const y2 = centerY + Math.sin(angle) * (radius + barHeight);
        
        const gradient = canvasCtx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, 'rgba(139, 69, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 0, 110, 0.8)');
        
        canvasCtx.strokeStyle = gradient;
        canvasCtx.lineWidth = barWidth;
        canvasCtx.beginPath();
        canvasCtx.moveTo(x1, y1);
        canvasCtx.lineTo(x2, y2);
        canvasCtx.stroke();
    }
}

// 播放/暂停
playBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        initAudioVisualizer();
        
        const playPromise = audioPlayer.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                vinylRecord.classList.add('playing');
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
                
                if (analyser) {
                    drawVisualizer();
                }
            }).catch(error => {
                console.error('播放失败:', error);
            });
        }
    } else {
        audioPlayer.pause();
        vinylRecord.classList.remove('playing');
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }
});

// 上一句歌词
prevBtn.addEventListener('click', () => {
    if (lyrics.length === 0) return;
    
    const prevIndex = currentLyricIndex > 0 ? currentLyricIndex - 1 : 0;
    if (lyrics[prevIndex]) {
        audioPlayer.currentTime = lyrics[prevIndex].time;
    }
});

// 下一句歌词
nextBtn.addEventListener('click', () => {
    if (lyrics.length === 0) return;
    
    const nextIndex = currentLyricIndex < lyrics.length - 1 ? currentLyricIndex + 1 : lyrics.length - 1;
    if (lyrics[nextIndex]) {
        audioPlayer.currentTime = lyrics[nextIndex].time;
    }
});

// 进度条控制
let isDragging = false;

// 鼠标事件
progressBar.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateProgress(e);
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        updateProgress(e);
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// 触摸事件（移动端支持）
progressBar.addEventListener('touchstart', (e) => {
    isDragging = true;
    updateProgress(e.touches[0]);
    e.preventDefault();
});

document.addEventListener('touchmove', (e) => {
    if (isDragging) {
        updateProgress(e.touches[0]);
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener('touchend', () => {
    isDragging = false;
});

// 点击进度条
progressBar.addEventListener('click', (e) => {
    updateProgress(e);
});

// 更新进度
function updateProgress(e) {
    if (audioPlayer.duration) {
        const rect = progressBar.getBoundingClientRect();
        let percent = (e.clientX - rect.left) / rect.width;
        percent = Math.max(0, Math.min(1, percent));
        audioPlayer.currentTime = percent * audioPlayer.duration;
    }
}

// 音量控制
volumeSlider.addEventListener('input', (e) => {
    audioPlayer.volume = e.target.value / 100;
});

// 设置初始音量
audioPlayer.volume = 0.7;

// 更新播放进度
audioPlayer.addEventListener('timeupdate', () => {
    if (!isDragging && audioPlayer.duration) {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressFill.style.width = percent + '%';
        progressThumb.style.left = percent + '%';
        
        timeCurrentElem.textContent = formatTime(audioPlayer.currentTime);
    }
    
    updateLyrics(audioPlayer.currentTime);
});

// 更新总时长
audioPlayer.addEventListener('loadedmetadata', () => {
    timeTotalElem.textContent = formatTime(audioPlayer.duration);
});

// 格式化时间
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// 更新歌词显示
function updateLyrics(currentTime) {
    if (lyrics.length === 0) return;
    
    let newIndex = -1;
    for (let i = 0; i < lyrics.length; i++) {
        if (currentTime >= lyrics[i].time) {
            newIndex = i;
        } else {
            break;
        }
    }
    
    if (newIndex !== currentLyricIndex) {
        currentLyricIndex = newIndex;
        highlightLyric();
    }
}

// 高亮当前歌词
function highlightLyric() {
    const lyricLines = document.querySelectorAll('.lyric-line');
    
    lyricLines.forEach((line, index) => {
        line.classList.remove('active', 'past');
        
        if (index === currentLyricIndex) {
            line.classList.add('active');
        } else if (index < currentLyricIndex) {
            line.classList.add('past');
        }
    });
    
    // 滚动到当前歌词 - 精确居中
    if (currentLyricIndex >= 0 && lyricLines[currentLyricIndex]) {
        const containerHeight = lyricsContainer.offsetHeight;
        const currentLine = lyricLines[currentLyricIndex];
        
        let offsetTop = 0;
        for (let i = 0; i < currentLyricIndex; i++) {
            offsetTop += lyricLines[i].offsetHeight;
        }
        
        const centerOffset = containerHeight / 2 - currentLine.offsetHeight / 2;
        const translateY = -(offsetTop - centerOffset);
        
        lyricsContent.style.transform = `translateY(${translateY}px)`;
    }
}

// 渲染歌词列表
function renderLyrics() {
    if (lyrics.length === 0) {
        lyricsContent.innerHTML = '<div class="lyric-line">暂无歌词</div>';
        return;
    }
    
    lyricsContent.innerHTML = lyrics.map(lyric => 
        `<div class="lyric-line">${lyric.text}</div>`
    ).join('');
    
    currentLyricIndex = -1;
    lyricsContent.style.transform = 'translateY(0)';
}

// 页面加载时初始化
window.addEventListener('load', () => {
    // 渲染歌词
    renderLyrics();
    
    // 自动加载音频
    if (audioPlayer.src) {
        audioPlayer.load();
    }
});

// 播放结束时重置
audioPlayer.addEventListener('ended', () => {
    vinylRecord.classList.remove('playing');
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});

// 快捷键支持
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        playBtn.click();
    }
});
