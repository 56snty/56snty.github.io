/* =========================================================================
   DOM ELEMENTS
   ========================================================================= */
const intro = document.getElementById('intro');
const cardWrap = document.getElementById('cardWrap');
const bgVideo = document.getElementById('bg');
const music = document.getElementById('music');
const musicBtn = document.getElementById('musicToggle');
const tiltCard = document.getElementById('tiltCard');
const glare = document.getElementById('glare');
const localInfo = document.getElementById('local-info');

/* =========================================================================
   LIVE CLOCK & WEATHER (Eindhoven)
   ========================================================================= */
let cachedWeather = '';

async function fetchWeather() {
  try {
    const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=51.4416&longitude=5.4697&current_weather=true");
    const data = await res.json();
    cachedWeather = ` // ${Math.round(data.current_weather.temperature)}°C`;
  } catch (err) { 
    console.log("Weather failed to load"); 
  }
}

function updateLocalInfo() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { timeZone: 'Europe/Amsterdam', hour: '2-digit', minute: '2-digit' });
  localInfo.innerText = `Eindhoven // ${timeStr}${cachedWeather}`;
}

fetchWeather();
setInterval(updateLocalInfo, 1000);
updateLocalInfo();

/* =========================================================================
   3D TILT & DYNAMIC GLARE EFFECT
   ========================================================================= */
document.addEventListener('mousemove', (e) => {
  if (window.innerWidth > 768) { 
    // 3D Tilt calculation
    const xAxis = (window.innerWidth / 2 - e.pageX) / 35; 
    const yAxis = (window.innerHeight / 2 - e.pageY) / 35;
    tiltCard.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;

    // Glare calculation (follows mouse)
    const xPos = (e.clientX / window.innerWidth) * 100;
    const yPos = (e.clientY / window.innerHeight) * 100;
    glare.style.background = `radial-gradient(circle at ${xPos}% ${yPos}%, rgba(255,255,255,0.08) 0%, transparent 60%)`;
    glare.style.opacity = 1;
  }
});

document.addEventListener('mouseleave', () => {
  tiltCard.style.transform = `rotateY(0deg) rotateX(0deg)`;
  glare.style.opacity = 0;
});

/* =========================================================================
   MAGNETIC BUTTONS
   ========================================================================= */
const magneticBtns = document.querySelectorAll('.btn');
magneticBtns.forEach(btn => {
  btn.addEventListener('mousemove', function(e) {
    if (window.innerWidth > 768) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      this.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    }
  });
  btn.addEventListener('mouseleave', function() {
    this.style.transform = `translate(0px, 0px)`;
  });
});

/* =========================================================================
   AUDIO VISUALIZER (Bass Reactive Avatar)
   ========================================================================= */
let audioCtx, analyzer, dataArray;

function initVisualizer() {
  if (audioCtx) return; 
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyzer = audioCtx.createAnalyser();
  const source = audioCtx.createMediaElementSource(music);
  source.connect(analyzer);
  analyzer.connect(audioCtx.destination);
  
  analyzer.fftSize = 256;
  dataArray = new Uint8Array(analyzer.frequencyBinCount);
  
  const avatar = document.getElementById('discord-avatar');
  
  function renderFrame() {
    requestAnimationFrame(renderFrame);
    analyzer.getByteFrequencyData(dataArray);
    
    let bass = (dataArray[1] + dataArray[2] + dataArray[3]) / 3;
    let scale = 1 + (bass / 1500); 
    let glow = bass / 6;
    
    if(bass > 50) {
      avatar.style.transform = `scale(${scale})`;
      avatar.style.boxShadow = `0 8px 20px rgba(0,0,0,0.6), 0 0 ${glow}px rgba(255, 255, 255, ${glow/60})`;
    } else {
      avatar.style.transform = `scale(1)`;
      avatar.style.boxShadow = `0 8px 20px rgba(0,0,0,0.6)`;
    }
  }
  renderFrame();
}

/* =========================================================================
   INTRO & MEDIA CONTROLS
   ========================================================================= */
function enterSite() {
  intro.style.opacity = '0';
  setTimeout(() => { intro.style.visibility = 'hidden'; }, 1200);
  cardWrap.classList.add("show");
  
  bgVideo.load();
  music.load();
  music.volume = 0.4; 
  
  bgVideo.play().catch(e => console.error("Video error:", e));
  music.play().then(() => {
    initVisualizer(); 
  }).catch(e => console.error("Audio error:", e));
}

// Ensure the enterSite function is globally accessible to the HTML inline onclick
window.enterSite = enterSite; 

let isPlaying = true;
function toggleMusic() {
  if (isPlaying) {
    music.pause(); 
    musicBtn.innerText = "[ Play Audio ]";
  } else {
    music.play(); 
    musicBtn.innerText = "[ Pause Audio ]";
    if(audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  }
  isPlaying = !isPlaying;
}
window.toggleMusic = toggleMusic;

/* =========================================================================
   COUNTER API
   ========================================================================= */
fetch("https://api.counterapi.dev/v1/lowkey-emal-dev/visits/up")
  .then(res => res.json())
  .then(data => { document.getElementById("view-count").innerText = data.count; })
  .catch(() => { document.getElementById("view-count").innerText = "-"; });

/* =========================================================================
   TYPEWRITER EFFECT
   ========================================================================= */
const words = ["stay lowkey", "calm energy", "radiant mind"];
let wordIndex = 0, charIndex = 0, isDeleting = false;

function typeEffect() {
  const currentWord = words[wordIndex];
  document.getElementById("type").textContent = currentWord.substring(0, charIndex);
  
  if (!isDeleting && charIndex === currentWord.length) {
    isDeleting = true; 
    setTimeout(typeEffect, 2000); 
    return;
  }
  
  if (isDeleting && charIndex === 0) {
    isDeleting = false; 
    wordIndex = (wordIndex + 1) % words.length;
  }
  
  charIndex += isDeleting ? -1 : 1;
  setTimeout(typeEffect, isDeleting ? 30 : 80);
}
typeEffect();

/* =========================================================================
   LANYARD API
   ========================================================================= */
function fetchLanyard() {
  fetch("https://api.lanyard.rest/v1/users/285468327135019019")
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const d = data.data;
        
        // Avatar
        if (d.discord_user.avatar) {
          const avatarExt = d.discord_user.avatar.startsWith('a_') ? 'gif' : 'webp';
          document.getElementById("discord-avatar").src = `https://cdn.discordapp.com/avatars/${d.discord_user.id}/${d.discord_user.avatar}.${avatarExt}?size=128`;
        }
        
        // Status Dot
        const colors = { online: '#43b581', idle: '#faa61a', dnd: '#f04747', offline: '#747f8d' };
        document.getElementById("status-dot").style.background = colors[d.discord_status] || colors.offline;
        
        // Custom Status Bio
        const customStatus = d.activities.find(a => a.type === 4);
        if (customStatus && customStatus.state) {
           const emoji = customStatus.emoji ? (customStatus.emoji.id ? '' : customStatus.emoji.name + ' ') : '';
           document.getElementById("discord-bio").innerText = `"${emoji}${customStatus.state}"`;
        } else {
           document.getElementById("discord-bio").innerText = `"staying lowkey."`; 
        }
        
        // Spotify
        const spotifyWidget = document.getElementById("spotify-widget");
        if (d.listening_to_spotify && d.spotify) {
          document.getElementById("spotify-art").src = d.spotify.album_art_url;
          document.getElementById("spotify-song").innerText = d.spotify.song;
          document.getElementById("spotify-artist").innerText = d.spotify.artist;
          spotifyWidget.style.display = "flex";
        } else {
          spotifyWidget.style.display = "none";
        }
      }
    })
    .catch(err => console.log("Lanyard fetch error:", err));
}
fetchLanyard(); 
setInterval(fetchLanyard, 3000);

/* =========================================================================
   SUBTLE RAIN EFFECT
   ========================================================================= */
const canvas = document.getElementById("rain"); 
const ctx = canvas.getContext("2d");

function resizeCanvas() { 
  canvas.width = window.innerWidth; 
  canvas.height = window.innerHeight; 
}
window.addEventListener('resize', resizeCanvas); 
resizeCanvas();

let rainDrops = Array.from({length: 60}, () => ({
  x: Math.random() * canvas.width, 
  y: Math.random() * canvas.height,
  l: Math.random() * 10 + 5, 
  s: Math.random() * 2 + 1.5 
}));

function drawRain() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)"; 
  ctx.lineWidth = 1; 
  ctx.lineCap = 'round';
  
  rainDrops.forEach(r => {
    ctx.beginPath(); 
    ctx.moveTo(r.x, r.y); 
    ctx.lineTo(r.x, r.y + r.l); 
    ctx.stroke();
    r.y += r.s; 
    
    if (r.y > canvas.height) { 
      r.y = -20; 
      r.x = Math.random() * canvas.width; 
    }
  });
  requestAnimationFrame(drawRain);
}
drawRain();
