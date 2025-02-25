const fs = require('fs');
const { createCanvas } = require('canvas');
const path = require('path');

// ディレクトリの存在確認・作成
const imagesDir = path.join(__dirname, 'assets', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// タワー画像の生成
function generateTower() {
  const canvas = createCanvas(50, 50);
  const ctx = canvas.getContext('2d');
  
  // タワーの本体
  ctx.fillStyle = '#4a90e2';
  ctx.fillRect(5, 5, 40, 40);
  
  // タワーの十字部分
  ctx.fillStyle = '#2a70c2';
  ctx.fillRect(20, 0, 10, 50);
  ctx.fillRect(0, 20, 50, 10);
  
  return canvas;
}

// 敵画像の生成
function generateEnemy() {
  const canvas = createCanvas(40, 40);
  const ctx = canvas.getContext('2d');
  
  // 敵（菱形）
  ctx.fillStyle = '#e24a4a';
  ctx.beginPath();
  ctx.moveTo(20, 0);
  ctx.lineTo(40, 20);
  ctx.lineTo(20, 40);
  ctx.lineTo(0, 20);
  ctx.fill();
  
  return canvas;
}

// 背景画像の生成
function generateBackground() {
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');
  
  // グラデーション背景
  const gradient = ctx.createLinearGradient(0, 0, 0, 600);
  gradient.addColorStop(0, '#c7e6ff');
  gradient.addColorStop(1, '#ffffff');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 800, 600);
  
  // グリッド線
  ctx.strokeStyle = '#dddddd';
  ctx.lineWidth = 1;
  
  // 縦線
  for (let x = 0; x <= 800; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 600);
    ctx.stroke();
  }
  
  // 横線
  for (let y = 0; y <= 600; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(800, y);
    ctx.stroke();
  }
  
  return canvas;
}

// ボタン画像の生成
function generateButton() {
  const canvas = createCanvas(100, 50);
  const ctx = canvas.getContext('2d');
  
  // ボタン背景
  ctx.fillStyle = '#4a90e2';
  ctx.fillRect(0, 0, 100, 50);
  
  // ボタンテキスト
  ctx.fillStyle = '#ffffff';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('ボタン', 50, 30);
  
  return canvas;
}

// 画像保存関数
function saveCanvas(canvas, filename) {
  const buffer = canvas.toBuffer('image/png');
  const filepath = path.join(imagesDir, filename);
  
  fs.writeFileSync(filepath, buffer);
  console.log(`画像を生成しました: ${filepath}`);
}

// 画像生成と保存
try {
  saveCanvas(generateTower(), 'tower_placeholder.png');
  saveCanvas(generateEnemy(), 'enemy_placeholder.png');
  saveCanvas(generateBackground(), 'background_placeholder.png');
  saveCanvas(generateButton(), 'button_placeholder.png');
  
  console.log('すべての画像生成が完了しました。');
} catch (error) {
  console.error('画像生成中にエラーが発生しました:', error);
}