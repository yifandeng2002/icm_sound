let osc;
let playing = false;
let baseFreq = 140;
let counter = 0;
let glitchInterval = 20;
let glitchAmount = 200;
let glitchDuration = 10;
let glitchCounter = 0;
let isGlitching = false;

// 添加旋律相关变量
let melodyNotes = [140, 176, 198, 264, 198, 176]; // 简单的旋律音符频率
let melodyIndex = 0;
let noteDuration = 30; // 每个音符的持续帧数
let noteCounter = 0;

// 添加效果器
let delay;
let reverb;

function setup() {
  createCanvas(400, 400);
  background(0);
  
  // 创建振荡器和效果器
  osc = new p5.Oscillator();
  osc.setType('square');
  
  // 添加延迟效果
  delay = new p5.Delay();
  delay.process(osc, 0.12, 0.7, 2300);
  
  // 添加混响效果
  reverb = new p5.Reverb();
  reverb.process(osc, 3, 2);
  
  // 创建控制按钮
  let button = createButton('Start/Stop');
  button.position(10, 10);
  button.mousePressed(togglePlay);
  
  // 添加音量滑块
  let volumeSlider = createSlider(0, 1, 0.5, 0.01);
  volumeSlider.position(10, 40);
  volumeSlider.input(() => {
    osc.amp(volumeSlider.value());
  });
}

function draw() {
  background(0);
  
  if (playing) {
    counter++;
    noteCounter++;
    
    // 旋律进行
    if (noteCounter >= noteDuration) {
      melodyIndex = (melodyIndex + 1) % melodyNotes.length;
      baseFreq = melodyNotes[melodyIndex];
      if (!isGlitching) {
        osc.freq(baseFreq);
      }
      noteCounter = 0;
    }
    
    // 控制glitch发生的时机
    if (counter % glitchInterval === 0 && !isGlitching) {
      isGlitching = true;
      glitchCounter = 0;
    }
    
    // 处理glitch效果
    if (isGlitching) {
      glitchCounter++;
      
      // 随机化频率，但基于当前旋律音符
      if (glitchCounter % 2 === 0) {
        let randomFreq = baseFreq + random(-glitchAmount, glitchAmount);
        osc.freq(randomFreq);
      }
      
      // 结束glitch
      if (glitchCounter >= glitchDuration) {
        isGlitching = false;
        osc.freq(baseFreq);
      }
    }
    
    // 绘制可视化效果
    stroke(255);
    noFill();
    beginShape();
    for (let i = 0; i < width; i++) {
      let y = height/2 + sin(i * 0.1 + frameCount * 0.1) * 50;
      if (isGlitching) {
        y += random(-20, 20);
      }
      vertex(i, y);
    }
    endShape();
  }
}

function togglePlay() {
  if (!playing) {
    osc.start();
    osc.amp(0.5);
    osc.freq(baseFreq);
    playing = true;
  } else {
    osc.stop();
    playing = false;
  }
}