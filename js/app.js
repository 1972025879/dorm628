(() => {
  const mates = {
    zhou: {
      title: "周晴",
      body: "人设大概是魔丸：天天发疯，电波不稳定，宿舍的突发状况制造机。别问为什么，问就是今天又开始了。",
    },
    ma: {
      title: "马廉婕",
      body: "她妈妈做的是黑暗料理——颜色可疑、味道传奇，室友听说过就怕。家里还有一位严格的高中班主任（规矩感拉满），所以她身上总带着一点「别闹」和一点「来尝尝这个」。",
    },
    tian: {
      title: "田静阳",
      body: "年级第一。卷王不必吵，成绩单会替她说话。夜谈里别人在吐槽，她可能刚刷完一套题——然后继续安静地坐在第一名的位置上。",
    },
    zong: {
      title: "宗依林",
      body: "养蛇的人。628 的空气里偶尔有鳞片气息：换垫材、看进食、讲冷知识。敢养蛇的人，通常也不怕宿舍里的其它突发状况。",
    },
  };

  const panelTitle = document.getElementById("mate-title");
  const panelBody = document.getElementById("mate-body");
  const mateButtons = document.querySelectorAll(".mate");

  function showMate(key) {
    const m = mates[key];
    if (!m) return;
    panelTitle.textContent = m.title;
    panelBody.textContent = m.body;
    mateButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mate === key);
    });
  }
  mateButtons.forEach((btn) => {
    btn.addEventListener("click", () => showMate(btn.dataset.mate));
  });
  showMate("zhou");

  const names = ["周晴", "马廉婕", "田静阳", "宗依林"];
  const colors = ["#e85d4c", "#1c1c1c", "#f0b7ae", "#5b7c6a"];
  const canvas = document.getElementById("wheel");
  const ctx = canvas.getContext("2d");
  const resultEl = document.getElementById("spin-result");
  let angle = 0;
  let spinning = false;

  function drawWheel(rot) {
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = w / 2 - 8;
    const slice = (Math.PI * 2) / names.length;
    ctx.clearRect(0, 0, w, h);
    names.forEach((name, i) => {
      const start = rot + i * slice;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, start + slice);
      ctx.closePath();
      ctx.fillStyle = colors[i];
      ctx.fill();
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + slice / 2);
      ctx.fillStyle = i === 1 ? "#f6f1e8" : "#141414";
      ctx.font = "600 16px Droid Sans Fallback, DejaVu Sans, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(name, r - 16, 6);
      ctx.restore();
    });
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.fillStyle = "#f6f1e8";
    ctx.fill();
    ctx.strokeStyle = "#141414";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  drawWheel(angle);

  function spin() {
    if (spinning) return;
    spinning = true;
    resultEl.textContent = "转起来了……";
    const extra = Math.PI * 6 + Math.random() * Math.PI * 4;
    const start = angle;
    const target = start + extra;
    const duration = 3200;
    const t0 = performance.now();

    function frame(now) {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      angle = start + (target - start) * eased;
      drawWheel(angle);
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        spinning = false;
        const slice = (Math.PI * 2) / names.length;
        const normalized =
          (((-angle - Math.PI / 2) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const idx = Math.floor(normalized / slice) % names.length;
        resultEl.textContent = `今晚拿外卖：${names[idx]}！`;
      }
    }
    requestAnimationFrame(frame);
  }
  document.getElementById("spin-btn").addEventListener("click", spin);

  document.getElementById("quiz").addEventListener("submit", (e) => {
    e.preventDefault();
    const picked = new FormData(e.target).get("q1");
    const out = document.getElementById("quiz-result");
    if (!picked) {
      out.textContent = "先选一个嘛。";
      return;
    }
    out.textContent =
      picked === "d"
        ? "满分。你懂 628。"
        : "也没错，但标准答案是：以上全是，而且同时进行。";
  });

  const chaosLines = [
    "突然宣布要连夜改头像，连改十七版。",
    "对着空气发表 40 分钟演讲，主题未知。",
    "把「我没事」说了八遍，明显有事。",
    "半夜起来唱歌，音准随缘。",
    "宣布退学三分钟后又宣布回去卷。",
    "和充电器吵架，最后充电器赢了。",
    "把所有人拉进一个只有她懂的梗局。",
    "开始复读同一句话直到有人求饶。",
    "情绪过山车：开心→崩溃→狂笑→睡觉。",
    "魔丸已上线，宿舍防御等级升至红色。",
  ];
  document.getElementById("chaos-btn").addEventListener("click", () => {
    const line = chaosLines[Math.floor(Math.random() * chaosLines.length)];
    document.getElementById("chaos-out").textContent = `周晴今日发作：${line}`;
  });

  const foods = [
    "紫黑色神秘汤 —— 建议先拍照再喝",
    "甜咸交战炒饭 —— 谁赢谁知道",
    "造型像艺术品的凉菜 —— 味道是另一门课",
    "颜色过于自信的炖菜 —— 勇气 +3",
    "名字听起来很健康的黑暗甜点",
    "「尝尝嘛不贵」特供 —— 传说级",
    "班主任同款严格口味：偏咸，不许挑食",
    "马妈妈惊喜拼盘：每一口都是盲盒",
  ];
  document.getElementById("food-btn").addEventListener("click", () => {
    const food = foods[Math.floor(Math.random() * foods.length)];
    document.getElementById("food-out").textContent = `开出：${food}`;
  });

  const feedBtn = document.getElementById("feed-btn");
  const feedTimer = document.getElementById("feed-timer");
  const feedCount = document.getElementById("feed-count");
  const feedOut = document.getElementById("feed-out");
  let feeding = false;
  let feedScore = 0;
  let feedLeft = 5;

  feedBtn.addEventListener("click", () => {
    if (!feeding) {
      feeding = true;
      feedScore = 0;
      feedLeft = 5;
      feedCount.textContent = "0";
      feedOut.textContent = "快喂！蛇醒了！";
      feedBtn.textContent = "喂！";
      const t0 = performance.now();
      const tick = (now) => {
        feedLeft = Math.max(0, 5 - (now - t0) / 1000);
        feedTimer.textContent = feedLeft.toFixed(1);
        if (feedLeft > 0) {
          requestAnimationFrame(tick);
        } else {
          feeding = false;
          feedBtn.textContent = "再喂一轮";
          let rank = "蛇还在看你。";
          if (feedScore >= 40) rank = "宗依林点头：投喂达人。";
          else if (feedScore >= 20) rank = "蛇吃饱了，宿舍安全。";
          else if (feedScore >= 8) rank = "勉强够塞牙缝。";
          else rank = "蛇：就这？";
          feedOut.textContent = `${feedScore} 口。${rank}`;
        }
      };
      requestAnimationFrame(tick);
      return;
    }
    feedScore += 1;
    feedCount.textContent = String(feedScore);
  });

  const duties = ["扫地", "倒垃圾", "关灯锁门", "收快递"];
  document.getElementById("duty-btn").addEventListener("click", () => {
    const pool = [...names];
    for (let i = pool.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const list = document.getElementById("duty-list");
    list.innerHTML = duties
      .map((d, i) => `<li><strong>${d}</strong> —— ${pool[i]}</li>`)
      .join("");
  });

  const studyBtn = document.getElementById("study-btn");
  const studyTimer = document.getElementById("study-timer");
  const studyCount = document.getElementById("study-count");
  const studyOut = document.getElementById("study-out");
  let studying = false;
  let studyScore = 0;

  studyBtn.addEventListener("click", () => {
    if (!studying) {
      studying = true;
      studyScore = 0;
      studyCount.textContent = "0";
      studyOut.textContent = "刷！刷！刷！";
      studyBtn.textContent = "刷题！";
      const t0 = performance.now();
      const tick = (now) => {
        const left = Math.max(0, 10 - (now - t0) / 1000);
        studyTimer.textContent = String(Math.ceil(left));
        if (left > 0) {
          requestAnimationFrame(tick);
        } else {
          studying = false;
          studyBtn.textContent = "再冲一波";
          let line = "还差田静阳一个光年。";
          if (studyScore >= 80) line = "疑似年级第一附体。";
          else if (studyScore >= 45) line = "绩点发光中。";
          else if (studyScore >= 20) line = "及格线附近徘徊。";
          studyOut.textContent = `${studyScore} 题。${line}`;
        }
      };
      requestAnimationFrame(tick);
      return;
    }
    studyScore += 1;
    studyCount.textContent = String(studyScore);
  });

  const truths = [
    "上周最后悔的一件事是什么？",
    "宿舍里谁最像班主任？",
    "如果只能留一个人值班，你会投谁？",
    "黑暗料理你敢不敢试一口？",
    "周晴发疯时你第一反应是？",
    "蛇如果会说话，它会吐槽谁？",
    "你最想删掉的一条夜谈聊天记录？",
    "考试周谁最先崩溃？",
    "外卖迟到怪谁比较合理？",
    "628 的群名该叫什么？",
  ];
  document.getElementById("truth-btn").addEventListener("click", () => {
    const q = truths[Math.floor(Math.random() * truths.length)];
    document.getElementById("truth-out").textContent = q;
  });

  const board = document.getElementById("mood-board");
  const chips = document.querySelectorAll(".chip");

  function placeChip(color, clientX, clientY) {
    const rect = board.getBoundingClientRect();
    const x = clientX != null ? clientX - rect.left : 24 + Math.random() * (rect.width - 80);
    const y = clientY != null ? clientY - rect.top : 24 + Math.random() * (rect.height - 90);
    const dot = document.createElement("span");
    dot.className = "mood-dot";
    dot.style.background = color;
    dot.style.left = `${Math.max(8, Math.min(rect.width - 64, x - 28))}px`;
    dot.style.top = `${Math.max(8, Math.min(rect.height - 80, y - 36))}px`;
    dot.style.setProperty("--rot", `${(Math.random() * 24 - 12).toFixed(1)}deg`);
    board.appendChild(dot);
    board.classList.add("has-items");
  }

  chips.forEach((chip) => {
    chip.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/color", chip.dataset.color);
    });
    chip.addEventListener("click", () => placeChip(chip.dataset.color));
  });
  board.addEventListener("dragover", (e) => e.preventDefault());
  board.addEventListener("drop", (e) => {
    e.preventDefault();
    const color = e.dataTransfer.getData("text/color");
    if (color) placeChip(color, e.clientX, e.clientY);
  });
  document.getElementById("mood-clear").addEventListener("click", () => {
    board.querySelectorAll(".mood-dot").forEach((n) => n.remove());
    board.classList.remove("has-items");
  });

  const stitch = document.getElementById("stitch-canvas");
  const sctx = stitch.getContext("2d");
  function resizeStitch() {
    stitch.width = window.innerWidth;
    stitch.height = window.innerHeight;
  }
  function drawStitch(t) {
    sctx.clearRect(0, 0, stitch.width, stitch.height);
    sctx.strokeStyle = "rgba(20,20,20,0.06)";
    sctx.lineWidth = 1;
    const gap = 48;
    const offset = (t / 40) % gap;
    for (let y = -gap; y < stitch.height + gap; y += gap) {
      sctx.beginPath();
      for (let x = 0; x < stitch.width; x += 12) {
        const yy = y + offset + Math.sin((x + t) * 0.01) * 3;
        if (x === 0) sctx.moveTo(x, yy);
        else sctx.lineTo(x, yy);
      }
      sctx.stroke();
    }
    requestAnimationFrame(drawStitch);
  }
  resizeStitch();
  window.addEventListener("resize", resizeStitch);
  requestAnimationFrame(drawStitch);
})();
