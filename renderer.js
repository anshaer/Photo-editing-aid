const { ipcRenderer } = require('electron');

const dropZone = document.getElementById('drop-zone');
const refImage = document.getElementById('ref-image');
const dropText = document.getElementById('drop-text');
const modeText = document.getElementById('mode-text');
const opacitySlider = document.getElementById('opacity-slider');
const minimizeBtn = document.getElementById('minimize-btn');
const closeBtn = document.getElementById('close-btn');

// 新增：抓取隱藏的檔案輸入框
const fileInput = document.getElementById('file-input');

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

// --- 圖片載入共用邏輯 ---
function loadImage(file) {
  if (file.type.startsWith('image/')) {
    refImage.src = URL.createObjectURL(file);
    refImage.style.display = 'block';
    dropText.style.display = 'none';
    dropZone.style.backgroundColor = 'transparent';
    dropZone.style.cursor = 'default'; // 圖片載入後，把手指圖示變回一般箭頭
  }
}

// --- 點擊選擇檔案事件 ---
dropZone.addEventListener('click', () => {
  // 如果還沒有顯示圖片，才允許點擊開啟選擇器（避免干擾後續可能想做的其他操作）
  if (refImage.style.display !== 'block') {
    fileInput.click();
  }
});

fileInput.addEventListener('change', (e) => {
  if (e.target.files && e.target.files.length > 0) {
    loadImage(e.target.files[0]);
  }
});

// --- 拖曳檔案事件 ---
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
    loadImage(e.dataTransfer.files[0]);
  }
});
