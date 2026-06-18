const { ipcRenderer } = require('electron');

const dropZone = document.getElementById('drop-zone');
const refImage = document.getElementById('ref-image');
const dropText = document.getElementById('drop-text');
const modeText = document.getElementById('mode-text');

ipcRenderer.on('toggle-mode', (event, isClickThrough) => {
  if (isClickThrough) {
    document.body.classList.add('click-through');
    modeText.innerText = '穿透模式 (無法操作)';
  } else {
    document.body.classList.remove('click-through');
    modeText.innerText = '操作模式 (拖曳這裡移動視窗)';
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
