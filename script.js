const imageInput = document.getElementById('imageInput');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let img = new Image();
let originalImg = null; // simpan gambar asli

// Upload gambar
imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    img.src = event.target.result;
    originalImg = new Image();
    originalImg.src = event.target.result; // simpan gambar asli
  };
  reader.readAsDataURL(file);
});

// Load gambar → HD
img.onload = () => {
  drawImageHD();
};

// Fungsi draw HD
function drawImageHD() {
  if(!originalImg) return;
  const scale = 2; // HD
  canvas.width = originalImg.width * scale;
  canvas.height = originalImg.height * scale;
  ctx.setTransform(1,0,0,1,0,0); // reset transform
  ctx.scale(scale, scale);
  ctx.drawImage(originalImg, 0, 0);
}

// ----- FUNGSI EFEK -----
function applySepia() {
  drawImageHD();
  const imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
  const data = imageData.data;
  for(let i=0;i<data.length;i+=4){
    const r = data[i], g = data[i+1], b = data[i+2];
    data[i] = r*0.393 + g*0.769 + b*0.189;
    data[i+1] = r*0.349 + g*0.686 + b*0.168;
    data[i+2] = r*0.272 + g*0.534 + b*0.131;
  }
  ctx.putImageData(imageData,0,0);
}

function invertColors() {
  drawImageHD();
  const imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
  const data = imageData.data;
  for(let i=0;i<data.length;i+=4){
    data[i] = 255 - data[i];
    data[i+1] = 255 - data[i+1];
    data[i+2] = 255 - data[i+2];
  }
  ctx.putImageData(imageData,0,0);
}

function adjustBrightness(value){
  drawImageHD();
  const imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
  const data = imageData.data;
  for(let i=0;i<data.length;i+=4){
    data[i] += value;
    data[i+1] += value;
    data[i+2] += value;
  }
  ctx.putImageData(imageData,0,0);
}

function resetImage(){
  drawImageHD();
}

// ----- Resize -----
document.getElementById('resizeBtn').addEventListener('click', () => {
  if(!originalImg) return;
  const newWidth = prompt("Masukkan lebar baru (px):", originalImg.width);
  const newHeight = prompt("Masukkan tinggi baru (px):", originalImg.height);
  if(newWidth && newHeight){
    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.drawImage(originalImg,0,0,newWidth,newHeight);
  }
});

// ----- Grayscale -----
document.getElementById('grayscaleBtn').addEventListener('click', () => {
  drawImageHD();
  const imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
  const data = imageData.data;
  for(let i=0;i<data.length;i+=4){
    const avg = (data[i]+data[i+1]+data[i+2])/3;
    data[i] = data[i+1] = data[i+2] = avg;
  }
  ctx.putImageData(imageData,0,0);
});

// ----- Download HD -----
document.getElementById('downloadBtn').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'image-hd.png';
  link.href = canvas.toDataURL('image/png',1.0);
  link.click();
});
