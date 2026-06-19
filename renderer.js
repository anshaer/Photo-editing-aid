const { ipcRenderer } = require('electron');

const dropZone = document.getElementById('drop-zone');
const refImage = document.getElementById('ref-image');
const dropText = document.getElementById('drop-text');
const modeText = document.getElementById('mode-text');
const opacitySlider = document.getElementById('opacity-slider');
const minimizeBtn = document.getElementById('minimize-btn');
const closeBtn = document.getElementById('close-btn');
const fileInput = document.getElementById('file-input');

// 新增：抓取語言相關元素
const langSelect = document.getElementById('lang-select');
const opacityLabel = document.getElementById('opacity-label');

// 新增：多國語言字典
const translations = {
  zh: {
    modeNormal: '拖曳這裡移動視窗 (Cmd/Ctrl+Shift+X 切換穿透)',
    modeThrough: '穿透模式 (無法操作)',
    opacity: '透明度:',
    dropText: '將圖片拖曳至此<br>或點擊此處選擇圖片',
    minimizeTitle: '最小化',
    closeTitle: '關閉'
  },
  en: {
    modeNormal: 'Drag here to move (Cmd/Ctrl+Shift+X to click-through)',
    modeThrough: 'Click-Through Mode',
    opacity: 'Opacity:',
    dropText: 'Drop image here<br>or click to select',
    minimizeTitle: 'Minimize',
    closeTitle: 'Close'
  },
  ja: {
    modeNormal: 'ここをドラッグして移動 (Cmd/Ctrl+Shift+X で透過)',
    modeThrough: 'クリック透過モード',
    opacity: '不透明度:',
    dropText: 'ここに画像をドロップ<br>またはクリックして選択',
    minimizeTitle: '最小化',
    closeTitle: '閉じる'
  }
};

// 新增：紀錄目前的狀態，讓語言切換時知道標題該顯示哪一句
let currentLang = localStorage.getItem('appLang') || 'zh'; // 讀取上次選擇的語言，預設中文
let isClickThroughState = false;

// 新增：更新介面文字的函式
function updateLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('appLang', lang); // 記住使用者的選擇
  const t = translations[lang];

  opacityLabel.innerText = t.opacity;
  dropText.innerHTML = t.dropText;
  minimizeBtn.title = t.minimizeTitle;
  closeBtn.title = t.closeTitle;
  modeText.innerText = isClickThroughState ? t.modeThrough : t.modeNormal;
}

// 初始化：一打開 APP 就套用語言
langSelect.value = currentLang;
updateLanguage(currentLang);

// 監聽下拉選單的切換事件
langSelect.addEventListener('change', (e) => {
  updateLanguage(e.target.value);
});

// --- 原有的視窗控制與圖片載入邏輯 ---

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
  isClickThroughState = isClickThrough;
  const t = translations[currentLang]; // 抓取當前語言
  
  if (isClickThrough) {
    document.body.classList.add('click-through');
    modeText.innerText = t.modeThrough;
  } else {
    document.body.classList.remove('click-through');
    modeText.innerText = t.modeNormal;
  }
});

function loadImage(file) {
  if (file.type.startsWith('image/')) {
    refImage.src = URL.createObjectURL(file);
    refImage.style.display = 'block';
    dropText.style.display = 'none';
    dropZone.style.backgroundColor = 'transparent';
    dropZone.style.cursor = 'default'; 
  }
}

dropZone.addEventListener('click', () => {
  if (refImage.style.display !== 'block') {
    fileInput.click();
  }
});

fileInput.addEventListener('change', (e) => {
  if (e.target.files && e.target.files.length > 0) {
    loadImage(e.target.files[0]);
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
    loadImage(e.dataTransfer.files[0]);
  }
});
