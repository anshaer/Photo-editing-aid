const { ipcRenderer } = require('electron');

const dropZone = document.getElementById('drop-zone');
const refImage = document.getElementById('ref-image');
const dropText = document.getElementById('drop-text');
const modeText = document.getElementById('mode-text');
const opacitySlider = document.getElementById('opacity-slider');

// 新增：抓取最小化與關閉按鈕
const minimizeBtn = document.getElementById('minimize-btn');
const closeBtn = document.getElementById('close-btn');

// 新增：綁定點擊事件，發送指令給 main.js
minimizeBtn.addEventListener('click', () => {
  ipcRenderer.send('window-minimize');
});

closeBtn.addEventListener('click', () => {
  ipcRenderer.send('window-close');
});

opacitySlider.addEventListener('input', (e) => {
  refImage.style.opacity = e.target.value;
});

ipcRenderer.on('toggle-mode', (event, isClickThrough) => {
  if (isClickThrough) {
    document.body.classList.add('click-through');
    modeText.innerText = '穿透模式 (無法操作)';
  } else {
    document.body.classList.remove('click-through');
    modeText.innerText = '拖曳這裡移動視窗 (Cmd/Ctrl+Shift+X 切換穿透)';
  }
});

document.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
});
document.addEventListener('drop', (e) => {
  e.preventDefault();
  e.stopPropagation();
});

dropZone.addEventListener('drop', (e) => {
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    const file = e.dataTransfer.files[0];
    if (file.type.startsWith('image/')) {
      refImage.src = URL.createObjectURL(file);
      refImage.style.display = 'block';
      dropText.style.display = 'none';
      dropZone.style.backgroundColor = 'transparent';
    }
  }
});
