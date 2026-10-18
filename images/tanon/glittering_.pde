// ==========================================
// 空間をデザインする変数
// ==========================================
float travelSpeed = 1.0;      // 前に進むスピード
int fragmentCount = 1200;      // 雲のモコモコ感を出すため少し数を増やしています
float worldDepth = 200;      // 世界の奥行き
float swayAmount = 0.5;       // 揺れる強さs

// 雲（ノイズ）のコントロール
float noiseScale = 0.012;     // 雲の波の大きさ

color bgColor = color(6, 10, 18);         // 深みのある暗い背景
color lightColor1 = color(120, 190, 255); // パステルブルーの光
color lightColor2 = color(255, 140, 200); // 艶やかなピンクの光
// ==========================================

float[] x = new float[fragmentCount];
float[] y = new float[fragmentCount];
float[] z = new float[fragmentCount];
float[] rotX = new float[fragmentCount];
float[] rotY = new float[fragmentCount];
float[] rotZ = new float[fragmentCount];
float[] rotSpeed = new float[fragmentCount];
float[] fragSize = new float[fragmentCount];

float globalTime = 0;
float breeze = 0;

void setup() {
  // 高画質化：サイズを2000x2000に拡大（必要に応じて4000x4000などに拡大可能）
  //size(2000, 2000, P3D);
  //test用
  size(1000, 1000, P3D);
  
  
  // アンチエイリアスを最高設定(8)にしてジャギー（ギザギザ）を抑える
  smooth(8);
  
  noStroke();
  
  // 欠片の初期配置
  for (int i = 0; i < fragmentCount; i++) {
    resetFragment(i);
    z[i] = random(-worldDepth, 200); // 初期化時のみZ軸を分散
  }
}

// ★ パーリンノイズで「中央に浮かぶ雲」を作る配置関数
void resetFragment(int i) {
  float candidateX, candidateY;
  
  while (true) {
    candidateX = random(-1000, 1000);
    candidateY = random(-1000, 1000);
    
    float cloudNoise = noise(
      (candidateX + 3000) * noiseScale, 
      (candidateY + 3000) * noiseScale, 
      globalTime * 0.03
    );
    
    float distFromCenter = sqrt(candidateX * candidateX + candidateY * candidateY);
    float centerFactor = map(distFromCenter, 0, 900, 1.0, 0.0);
    centerFactor = constrain(centerFactor, 0.0, 1.0);
    centerFactor = pow(centerFactor, 1.5);
    
    float finalDensity = cloudNoise * centerFactor;

    if (random(1) < finalDensity) {
      break;
    }
  }

  x[i] = candidateX;
  y[i] = candidateY;
  z[i] = -worldDepth;
  
  rotX[i] = random(TWO_PI);
  rotY[i] = random(TWO_PI);
  rotZ[i] = random(TWO_PI);
  rotSpeed[i] = random(0.005, 0.02);
  
  fragSize[i] = random(2, 5);
}

void draw() {
  background(bgColor);
  
  breeze *= 0.96;
  float currentSpeed = travelSpeed + breeze;

  // --- カメラ ---
  float camX = map(mouseX, 0, width, -150, 150) + sin(globalTime * 0.3) * 50;
  float camY = map(mouseY, 0, height, -100, 100) + cos(globalTime * 0.2) * 30;
  camera(camX, camY, 400, 0, 0, -500, 0, 1, 0);

  // --- ライティング ---
  lightSpecular(255, 255, 255);
  ambientLight(15, 20, 30);
  pointLight(red(lightColor1), green(lightColor1), blue(lightColor1), 400, -300, -300);
  pointLight(red(lightColor2), green(lightColor2), blue(lightColor2), -400, 300, -800);
  directionalLight(200, 220, 255, 1, 1, -1);

  blendMode(BLEND);

  // --- 欠片の更新と描画 ---
  for (int i = 0; i < fragmentCount; i++) {
    z[i] += currentSpeed;
    x[i] += sin(globalTime + i) * swayAmount;
    y[i] += cos(globalTime * 0.8 + i) * (swayAmount * 0.5);

    if (z[i] > 300) {
      resetFragment(i);
    }

    rotX[i] += rotSpeed[i];
    rotY[i] += rotSpeed[i] + (breeze * 0.01);
    rotZ[i] += rotSpeed[i] * 0.5;

    pushMatrix();
    translate(x[i], y[i], z[i]);
    rotateX(rotX[i]);
    rotateY(rotY[i]);
    rotateZ(rotZ[i]);

    float alpha = 255;
    if (z[i] < -worldDepth * 0.2) {
      alpha = map(z[i], -worldDepth, -worldDepth * 0.7, 0, 255);
    } else if (z[i] > 100) {
      alpha = map(z[i], 100, 300, 255, 0);
    }

    specular(255, 255, 255);
    shininess(200);
    
    float r = map(sin(globalTime + i), -1, 1, 170, 230);
    float g = map(cos(rotX[i]), -1, 1, 190, 245);
    float b = 255;
    fill(r, g, b, alpha * 1.0);

    box(fragSize[i] * 0.2, fragSize[i] * 3.0, fragSize[i] * 1.6);

    popMatrix();
  }

  globalTime += 0.01;
}

void mousePressed() {
  breeze = 25.0;
}

// ★ キーボードの 's' キーを押すと画像を保存
void keyPressed() {
  if (key == 's' || key == 'S') {
    // 日時付きのファイル名で保存（例: render_20260906_170900.png）
    String filename = "render_" + year() + nf(month(), 2) + nf(day(), 2) + "_" + nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2) + ".png";
    save(filename);
    println("画像を保存しました: " + filename);
  }
}
