(() => {
  const mates = {
    zhou: {
      title: "周晴",
      body: "628 的一员，服装设计在读。针脚比日程表更密，灵感板比寝室灯更亮。宿舍官网留给她一间工作室角，但整间房才是主角。",
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

  const fabricMap = {
    剪裁: {
      fabric: "linear-gradient(145deg, #1c1c1c 0%, #3a3a3a 45%, #111 100%)",
      caption: "当前面料：结构感黑呢",
    },
    面料: {
      fabric: "linear-gradient(135deg, #f4c6c3 0%, #e8a99f 40%, #f7ebe4 100%)",
      caption: "当前面料：亲肤粉绸",
    },
    廓形: {
      fabric: "linear-gradient(160deg, #5b7c6a 0%, #7f9a88 50%, #dfe7e1 100%)",
      caption: "当前面料：苔绿斜纹",
    },
    情绪板: {
      fabric: "linear-gradient(120deg, #e85d4c 0%, #f0b7ae 50%, #c8b48a 100%)",
      caption: "当前面料：情绪拼贴缎",
    },
    成衣: {
      fabric: "linear-gradient(150deg, #f7f2ea 0%, #e6dccf 55%, #c8b48a 100%)",
      caption: "当前面料：坯布到成衣",
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

  const dress = document.querySelector(".dress");
  const fabricCaption = document.getElementById("fabric-caption");
  document.querySelectorAll("#zhou-tags li").forEach((li) => {
    li.addEventListener("click", () => {
      document.querySelectorAll("#zhou-tags li").forEach((x) => x.classList.remove("on"));
      li.classList.add("on");
      const conf = fabricMap[li.dataset.tag];
      if (conf && dress) {
        dress.style.background = conf.fabric;
        fabricCaption.textContent = conf.caption;
      }
    });
  });

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
