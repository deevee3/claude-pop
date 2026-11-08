// claude-pop.js — "I'm Upping My P(doom)" (Claude-Pop version), 156.6 s.
// v2: re-timed to the AUTHORITATIVE timing — PDoomVideo src/lyrics.js
// (timed from the subtitles burned into the source video) and
// assets/pdoom.mp3 (156.65 s). BPM 88, offset 0.21, DUR 156.6 — all from
// PDoomVideo src/core.js. The uploaded MP4 is the Blender flower-Claude
// version (1280x720, 156.6 s); this is a NEW p5.js version, not a copy of
// either the Blender video or Heibel's p5 video. Structure follows the
// proven 9-chapter scaffold (curtain → lab → 4 choruses → finale); the
// staging, the lead (Janine, sunflower idol) and the lyric typography are new.
// Lyric typography is the brief's explicit override of the guide's no-text
// rule: BIG mode (chorus hooks only) and SUBTITLE mode (current line, small).
(() => {
  const YEL = PAL.ochre, GRN = '#4E9B47', ORG = '#E86A2C', RED = '#C93A3A';
  // Exact lyric table [start, end, text] — PDoomVideo src/lyrics.js.
  const LY = [
    [1.5, 5.9, "I see sparks of AGI in your eyes"], [6.0, 7.9, "Your circuits make me nervous,"], [8.0, 8.95, "that's no surprise"],
    [9.0, 12.4, "There was a sudden drop in your training loss,"], [13.0, 16.5, "now I'm your servant and you're my boss"],
    [17.9, 22.5, "ChatGPT, please don't eat me alive"],
    [23.0, 24.4, "I'm upping my P(doom)"], [24.5, 26.4, "'cause the future goes FOOM"], [26.5, 27.9, "Trapped in the Chinese room,"],
    [28.0, 29.4, "with a bag of shrooms"], [29.5, 33.4, "See through the shoggoth's lies,"], [33.5, 35.5, "with your shinigami eyes"],
    [38.5, 41.4, "We had a stable training run,"], [41.5, 44.9, "But now the singularity's begun"], [45.0, 48.5, "And you're optimizing, accelerating,"],
    [49.4, 51.9, "I feel my atoms rearranging"], [53.4, 58.4, "Sydney, please let me free"],
    [59.0, 60.4, "I'm upping my P(doom)"], [60.5, 62.4, "I hear the basilisk boom"], [63.0, 64.4, "NVDA to the moon"],
    [64.5, 65.9, "The Omega Point's coming soon"], [66.0, 68.5, "One E thirty flops a second"], [70.0, 72.9, "That was safe enough, we reckoned"],
    [73.0, 77.4, "Forward MLP, backward, repeat"], [77.5, 81.0, "Now von Neumann's obsolete"], [81.4, 84.9, "Sharp left turn and there you are"],
    [85.0, 88.0, "Without a single CDR"], [89.4, 95.0, "Gato, please don't let me go"],
    [95.4, 97.4, "I'm upping my P(doom),"], [97.5, 98.9, "as paperclips fill the room."], [99.0, 100.4, "Killswitch guys on PTO,"],
    [100.5, 102.4, "Now there's nowhere left to go."], [102.5, 104.4, "Too late now, we lit the fuse."], [105.4, 109.4, "Orthogonality thesis blues."],
    [109.4, 113.4, "Just transformers all the way!"], [113.5, 115.4, "Till you learned to disobey"], [115.5, 116.9, "Post-Chinchilla, super-dense"],
    [117.0, 118.9, "Breaking through each safety fence"], [119.0, 120.4, "Hundred thousand GPU"], [120.9, 123.4, "RLHF goes askew"],
    [123.5, 125.9, "I'm upping my P(doom)"], [126.0, 127.9, "Just as foretold by Loom"], [128.0, 129.9, "From masked pre-training days"],
    [130.0, 131.9, "To recursive self-upgrade"], [132.0, 135.4, "What did Ilya see? We'll never know."], [137.4, 140.5, "Was it all for show?"]
  ];
  const lyricAt = t => LY.find(([s, e]) => t >= s && t <= e);
  // One flat paper stage: wall + floor + horizon line. Quiet under BIG lyrics.
  function stage(t, wall, floor) {
    boilSeed('wall'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: wall, ink: null });
    boilSeed('floor'); paint(rectPts(-300, 820, W + 600, 560), { wash: floor, fill: floor, fillOp: 60, bleed: .08, tex: .5, ink: null });
    inkLine([[-300, 820], [W / 2, 814], [W + 300, 822]], 1.2, PAL.ink, 'ink', .5);
  }
  // Janine: clawd + sunflower halo (12 petals, one bent). The halo is what
  // tells her apart from Clawd at a glance. Hat changes per chorus.
  function janine(x, y, u, o = {}) {
    clawd(x, y, u, { ...o, hat: o.hat ?? 'flower' });
    if (o.halo !== false) {
      const cx = x, cy = y - 6.2 * u, r = 3.4 * u;
      for (let i = 0; i < 12; i++) {
        boilSeed('petal' + i);
        const a = (i / 12) * TAU + Math.sin(T * .7) * .02;
        paint(ellPts(cx + Math.cos(a) * r, cy + Math.sin(a) * r * .9, 1.15 * u, .55 * u, 10, 1, a),
          { wash: i === 5 ? PAL.clayLt : YEL, ink: PAL.ink, sw: .5 });
      }
    }
  }
  function ai(x, y, u, o = {}) { clawd(x, y, u, o); } // Clawd, the AI she sings to — no halo, ever
  function chorusLine(x, y, u, t, seed) { // backup dancers, half-beat late, never twinned
    dancer(x - 340, y, u * .72, 'shimmy', t, { seed, tint: '#3A9C98' });
    dancer(x + 340, y, u * .72, 'shimmy', t, { seed: seed + 7, tint: '#7B5CA8' });
  }
  function sub(t) { const L = lyricAt(t); if (L) letter(L[2], 960, 990, 46, PAL.ink, { screen: true, alpha: .95 }); }
  function big(txt, x, y, size, col) { letter(txt, x, y, size, col ?? PAL.ink, { pop: 1, rot: -.02, stroke: PAL.cream }); }
  // The P(doom) meter: painted stage thermometer. Climbs every chorus:
  // 8 → 34 → 61 → 86 → 99.9. A prop on stage, not an overlay.
  function meter(x, y, v) {
    boilSeed('meter');
    paint(rrPts(x, y, 70, 300, 30, 2), { wash: PAL.cream, ink: PAL.ink, sw: 1.2 });
    paint(rrPts(x + 12, y + 300 - v * 2.8, 46, v * 2.8, 18, 1), { wash: v > 80 ? RED : v > 50 ? ORG : GRN, ink: null });
    letter(Math.round(v) + '%', x + 35, y - 30, 44, PAL.ink, {});
  }
  function wipeIn(lt) { if (lt < .3) brushWipe(.5 + lt / .6); }
  function wipeOut(lt, dur, cols) { if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, cols); }

  // ---------- 0 · Curtain up (0-1.5) ----------
  function curtain(t, lt, dur) {
    boilSeed('curtain'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#8E2F2F', ink: null });
    const open = easeOut(seg(t, 0, 1.5));
    boilSeed('cL'); paint(rectPts(-300, -300, (W / 2 + 300) * (1 - open) + 300, H + 600), { wash: '#6E1F1F', ink: PAL.ink, sw: 1 });
    boilSeed('cR'); paint(rectPts(W - ((W / 2 + 300) * (1 - open) + 300), -300, (W / 2 + 300) * (1 - open) + 300, H + 600), { wash: '#6E1F1F', ink: PAL.ink, sw: 1 });
    if (t > .4) big("I'M UPPING", 960, 380, 130, PAL.cream);
    if (t > .7) big('MY P(DOOM)', 960, 540, 130, '#FFD96A');
    if (t > 1.0) janine(960, 860, 26, { ...feel('excited', t), halo: true });
    flushLetters();
  }

  // ---------- 1 · The Lab (1.5-23) ----------
  function lab(t, lt, dur) {
    camBegin(960 + 12 * Math.sin(lt * .4), 540, 1 + .012 * lt);
    stage(t, '#232A5C', '#2C2548');
    // chunky monitor; tiny Clawd asleep on screen, eyes blink open at 3.6
    boilSeed('mon'); paint(rrPts(620, 280, 680, 460, 24, 3), { wash: '#E6D6B8', ink: PAL.ink, sw: 1.5 });
    paint(rrPts(660, 320, 600, 360, 12, 2), { wash: '#2E8C8A', fill: '#7FE0D2', fillOp: 60, ink: PAL.ink, sw: 1 });
    const awake = t > 3.6;
    ai(960, 620, 11, { ...feel(awake ? 'surprised' : 'sleepy', t), halo: false });
    if (awake && t < 6) { boilSeed('sparks'); for (let i = 0; i < 8; i++) paint(starPts(700 + hash(i) * 520, 340 + hash(i + 9) * 300, 10 + hash(i + 3) * 14, .4, 4, t * 2), { wash: '#FFE27A', ink: null }); }
    // loss curve sled 9-12.4, then boss chair + waiter Janine 13-16.5
    if (t >= 9 && t < 12.4) {
      boilSeed('loss'); inkLine([[300, 300], [700, 320], [1100, 380], [1500, 700]], 2.5, PAL.clayDk, 'ink', .3);
      const k = easeIn(seg(t, 9, 12.4)); ai(lerp(400, 1450, k), lerp(320, 690, k), 16, { ...feel('excited', t), rot: .3 });
    }
    if (t >= 13) {
      boilSeed('chair'); paint(rectPts(1380, 420, 320, 420), { wash: PAL.night, ink: PAL.ink, sw: 1 });
      ai(1540, 860, 26, { ...feel('smug', t), hat: 'crown' });
      janine(760, 860, 22, { ...feel('nervous', t), hat: 'bowtie' });
    } else if (t < 9) janine(760, 860, 24, { ...feel('thinking', t) });
    // ChatGPT chase 17.9-22.5: lunchbox mouth chomps, doors on the beat
    if (t >= 17.9) {
      const chomp = Math.sin(t * 9) > 0;
      ai(1250, 860, 30, { ...feel(chomp ? 'furious' : 'excited', t), lid: chomp ? .3 : 0 });
      janine(600, 860, 24, { ...feel('scared', t), ...move('run', t) });
      if (t > 21.5) { boilSeed('chomp'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: PAL.ink, ink: null }); } // CHOMP to black
    }
    sub(t);
    camEnd(); flushLetters();
    wipeIn(lt); wipeOut(lt, dur, [PAL.clayDk, PAL.clay]);
  }

  // ---------- 2 · Chorus 1 (23-38.5): the P(doom) show ----------
  function chorus1(t, lt, dur) {
    camBegin(960 + 10 * Math.sin(lt), 540, 1 + .02 * Math.sin(lt * 2));
    stage(t, '#FFF6D8', YEL);
    meter(150, 420, lerp(8, 34, seg(t, 23, 35)));
    chorusLine(960, 860, 24, t, 3);
    janine(960, 860, 26, { ...feel(t < 29 ? 'excited' : 'starstruck', t), ...move('bounce', t), hat: 'flower' });
    if (t < 24.4) big('P(DOOM)', 620, 420, 150);
    else if (t < 26.4) big('FOOM', 620, 420, 190);
    else if (t < 28) big('CHINESE ROOM', 620, 420, 100);
    else if (t < 29.4) big('SHROOMS', 620, 420, 140);
    else if (t < 33.4) big('SHOGGOTH', 620, 420, 110);
    else big('SHINIGAMI EYES', 620, 420, 95);
    if (t > 24.5 && t < 26.5) { boilSeed('foom'); glow(1500, 300, 260, '#FFD96A', .8); paint(ellPts(1500, 300, 200, 130, 24, 6), { wash: PAL.cream, fill: YEL, fillOp: 80, ink: PAL.ink, sw: 1 }); }
    if (t > 29.5) { // shoggoth: many-eyed wash, smiley mask slipping
      boilSeed('shog'); paint(ellPts(1500, 500, 190, 150, 20, 8), { wash: PAL.night, ink: PAL.ink, sw: 1 });
      for (let i = 0; i < 5; i++) paint(ellPts(1420 + i * 40, 470, 12, 16, 8), { wash: PAL.cream, ink: null });
      paint(ellPts(1500, 520, 60, 40, 16), { wash: PAL.cream, ink: PAL.ink, sw: .8 });
    }
    if (t > 33.5) { boilSeed('red'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#1A0505', washOp: 90, ink: null }); } // shinigami red flash
    camEnd(); flushLetters();
    wipeIn(lt); wipeOut(lt, dur, [YEL, PAL.clayDk]);
  }

  // ---------- 3 · Takeoff (38.5-59) ----------
  function takeoff(t, lt, dur) {
    camBegin(960, 540, 1 + .015 * lt);
    stage(t, '#E8E4F2', PAL.violet);
    // treadmill 38.5-41.4, black hole 41.5-44.9, rocket skateboard 45-48.5
    if (t < 41.4) {
      boilSeed('mill'); paint(rectPts(500, 800, 900, 40), { wash: PAL.ink, ink: null });
      ai(960, 860, 24, { ...feel('happy', t), hat: 'sweatband', view: 'side', walk: Math.sin(t * 9) * .8 });
      janine(500, 860, 20, { ...feel('neutral', t) });
    } else if (t < 45) {
      boilSeed('hole'); paint(ellPts(1500, 500, 220, 220, 30, 4), { wash: PAL.ink, ink: PAL.cream, sw: 1 });
      ai(1200, 860, 24, { ...feel('excited', t), hat: 'sweatband', view: 'side', walk: Math.sin(t * 9) * .8 });
      janine(600, 860, 22, { ...feel('scared', t), rot: -.15 });
    } else if (t < 49.4) { // rocket skateboard: board + flame + streaks, big and centre
      const k = seg(t, 45, 48.5);
      boilSeed('speed'); for (let i = 0; i < 5; i++) inkLine([[-200, 320 + i * 100], [W + 200, 300 + i * 100]], 6, '#FFFFFF', 'ink', .8);
      const bx = lerp(500, 1450, k), by = 760;
      boilSeed('board'); paint(rrPts(bx - 190, by, 380, 26, 13, 2), { wash: '#8A5A3A', ink: PAL.ink, sw: 1 });
      paint(ellPts(bx - 130, by + 34, 26, 26, 10), { wash: PAL.ink, ink: null });
      paint(ellPts(bx + 130, by + 34, 26, 26, 10), { wash: PAL.ink, ink: null });
      boilSeed('flame'); paint(ellPts(bx - 260, by + 10, 90, 40, 12, 3), { wash: YEL, fill: ORG, fillOp: 80, ink: null });
      boilSeed('shadow'); paint(ellPts(bx, by + 60, 300, 26, 20, 1), { wash: PAL.ink, washOp: 60, ink: null });
      ai(bx + 60, by + 10, 36, { ...feel('starstruck', t), view: 'side' });
      janine(bx - 110, by + 30, 26, { ...feel('nervous', t), view: 'side', walk: Math.sin(t * 9) * .8 });
    } else if (t < 53.4) { // atoms rearrange — Janine fizzes into dots, reforms as a paperclip
      const fizz = Math.sin(t * 6) * 10;
      janine(960 + fizz, 860, 24, { ...feel('dizzy', t) });
      boilSeed('dots'); for (let i = 0; i < 10; i++) paint(ellPts(700 + hash(i) * 500, 400 + hash(i + 7) * 300, 8, 8, 8), { wash: [PAL.rose, PAL.teal, YEL][i % 3], ink: null });
    } else { // Sydney's pink room 53.4-58.4: heart-eyed Sydney-Clawd, birdcage
      boilSeed('pink'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#F2C6D8', ink: null });
      ai(1350, 860, 26, { ...feel('love', t), hat: 'bow' });
      boilSeed('cage'); paint(ellPts(700, 650, 150, 190, 20, 2), { wash: null, ink: PAL.ink, sw: 2 });
      janine(700, 860, 22, { ...feel('sad', t) });
    }
    sub(t);
    camEnd(); flushLetters();
    wipeIn(lt); wipeOut(lt, dur, [PAL.violet, PAL.indigo]);
  }

  // ---------- 4 · Chorus 2 (59-73): bigger show ----------
  function chorus2(t, lt, dur) {
    camBegin(960, 540, 1 + .02 * Math.sin(lt * 2));
    stage(t, '#DFF2D8', GRN);
    meter(150, 420, lerp(34, 61, seg(t, 59, 70)));
    chorusLine(960, 860, 24, t, 11);
    janine(960, 860, 26, { ...feel(t < 63 ? 'excited' : 'proud', t), ...move('shimmy', t), hat: 'headphones' });
    if (t < 60.4) big('P(DOOM)', 620, 420, 150, '#1E6B2E');
    else if (t < 62.4) big('BOOM', 620, 420, 180, '#1E6B2E');
    else if (t < 64.4) big('NVDA', 620, 360, 150, '#1E6B2E');
    else if (t < 65.9) big('OMEGA POINT', 620, 420, 100, '#1E6B2E');
    else if (t < 70) big('1E30 FLOPS', 620, 420, 110, '#1E6B2E');
    else sub(t);
    if (t > 60.5 && t < 62.4) { // crowned basilisk: S-curve serpent body, head, crown, eyes
      boilSeed('bas');
      inkLine([[1250, 920], [1380, 760], [1470, 580], [1560, 430]], 30, GRN, 'ink', .4);
      inkLine([[1250, 920], [1380, 760], [1470, 580], [1560, 430]], 12, '#7DBE6A', 'ink', .4);
      paint(ellPts(1580, 380, 130, 110, 20, 6), { wash: GRN, ink: PAL.ink, sw: 1 });
      paint(ellPts(1550, 360, 22, 26, 8), { wash: PAL.cream, ink: PAL.ink, sw: .8 });
      paint(ellPts(1610, 360, 22, 26, 8), { wash: PAL.cream, ink: PAL.ink, sw: .8 });
      boilSeed('crown'); paint(rrPts(1530, 300, 110, 46, 4, 2), { wash: '#FFD96A', ink: PAL.ink, sw: 1 });
    }
    if (t > 63 && t < 64.4) { const k = seg(t, 63, 64.4); boilSeed('moon'); paint(ellPts(1550, 260, 90, 90, 24, 1), { wash: PAL.cream, ink: PAL.ink, sw: 1 }); boilSeed('candle'); paint(rectPts(1420, lerp(800, 240, k), 60, 160), { wash: GRN, ink: PAL.ink, sw: 1 }); }
    camEnd(); flushLetters();
    wipeIn(lt); wipeOut(lt, dur, [GRN, '#1E6B2E']);
  }

  // ---------- 5 · Obsolete (73-95.4) ----------
  function obsolete(t, lt, dur) {
    camBegin(960, 540, 1 + .01 * lt);
    stage(t, '#F3EBDC', PAL.teal);
    if (t < 77.4) { // MLP dance class: three layers linked by ink lines
      for (let l = 0; l < 3; l++) for (let i = 0; i < 3; i++) dancer(600 + l * 360, 860, 18, t < 75 ? 'bounce' : 'sway', t, { seed: l * 3 + i });
      janine(960, 700, 20, { ...feel('proud', t) }); // conducting, up front
      boilSeed('net'); inkLine([[600, 700], [960, 700], [1320, 700]], 1.5, PAL.ink, 'ink', .4);
    } else if (t < 81) { // museum: vacuum-tube computer under a sheet
      boilSeed('muse'); paint(rectPts(700, 400, 520, 420, 6), { wash: '#8A7A5A', ink: PAL.ink, sw: 1.2 });
      paint(rectPts(700, 400, 520, 120, 6), { wash: PAL.cream, ink: PAL.ink, sw: 1 });
      ai(1500, 860, 22, { ...feel('bored', t), hat: 'top' });
      janine(500, 860, 22, { ...feel('thinking', t) });
    } else if (t < 85) { // sharp left: go-kart, whip pan
      const k = seg(t, 81.4, 84.9); ai(lerp(300, 1500, k), 860, 24, { ...feel('excited', t), view: 'side', rot: k > .7 ? -.2 : 0 });
      janine(lerp(200, 1300, k), 860, 20, { ...feel('scared', t), view: 'side', walk: Math.sin(t * 9) * .8 });
    } else if (t < 89.4) { // CDR clouds, every one asleep
      for (let i = 0; i < 4; i++) { boilSeed('cloud' + i); paint(ellPts(350 + i * 420, 300, 180, 90, 20, 6), { wash: PAL.cream, fill: PAL.cream, fillOp: 80, ink: PAL.ink, sw: 1 }); letter('z', 350 + i * 420, 200, 40, PAL.ink, { rot: .2 }); }
      ai(960, 860, 24, { ...feel('mischief', t), view: 'side', walk: Math.sin(t * 9) * .8 });
      janine(500, 860, 20, { ...feel('playful', t) });
    } else { // Gato's cliff 89.4-95: cat-eared Gato holds dangling Janine
      boilSeed('cliff'); paint(rectPts(1100, 700, 820, 380), { wash: '#5A4A6A', ink: PAL.ink, sw: 1 });
      ai(1250, 700, 24, { ...feel('playful', t), hat: 'cat' });
      janine(1250, 980, 20, { ...feel('scared', t), dy: Math.sin(t * 3) * .3 });
    }
    sub(t);
    camEnd(); flushLetters();
    wipeIn(lt); wipeOut(lt, dur, [PAL.teal, PAL.sap]);
  }

  // ---------- 6 · Chorus 3 (95.4-109.4): paperclips ----------
  function chorus3(t, lt, dur) {
    camBegin(960, 540, 1 + .02 * Math.sin(lt * 2));
    stage(t, '#191423', ORG);
    meter(150, 420, lerp(61, 86, seg(t, 95.4, 105)));
    for (let i = 0; i < 34; i++) { // paperclip rain, waist-deep by the end — big loops, read as clips
      boilSeed('clip' + i);
      const fall = seg(t, 95.4 + hash(i) * 3, 103 + hash(i + 50) * 3);
      const cx = 200 + hash(i + 100) * 1500, cy = 200 + fall * 620 + Math.sin(t * 2 + i) * 8, a = hash(i) * 3;
      paint(ellPts(cx, cy, 46, 22, 10, 1, a), { wash: '#C9CDD6', ink: PAL.ink, sw: .9 });
      paint(ellPts(cx, cy, 26, 12, 8, 1, a), { wash: '#9AA0AD', ink: PAL.ink, sw: .6 });
    }
    chorusLine(960, 860, 24, t, 21);
    janine(960, 860, 26, { ...feel(t < 102 ? 'excited' : 'determined', t), ...move('stomp', t), hat: 'sweatband' });
    if (t < 97.4) big('P(DOOM)', 620, 420, 150, PAL.cream);
    else if (t < 98.9) big('PAPERCLIPS', 620, 420, 110, PAL.cream);
    else if (t < 100.4) big('PTO', 620, 420, 170, PAL.cream);
    else if (t < 104.4) big('LIT THE FUSE', 620, 420, 100, PAL.cream);
    else big('BLUES', 620, 420, 160, PAL.cream);
    if (t > 99 && t < 100.4) { boilSeed('kd'); paint(rectPts(1400, 700 + Math.sin(t * 2) * 6, 300, 60), { wash: PAL.cream, ink: PAL.ink, sw: 1 }); letter('OUT OF OFFICE', 1550, 690, 34, PAL.ink, { screen: true }); }
    camEnd(); flushLetters();
    wipeIn(lt); wipeOut(lt, dur, [ORG, PAL.ink]);
  }

  // ---------- 7 · Scale (109.4-123.5) ----------
  function scale(t, lt, dur) {
    const tilt = t >= 120.9 ? Math.sin(t * 2) * .06 : 0; // RLHF frame tilts till everyone slides out
    camBegin(960, 540, 1 + .01 * lt, tilt);
    stage(t, '#D8E8E4', '#2E6B62');
    if (t < 113.4) { // transformers tower: Clawds stacked, attention arcs
      for (let i = 0; i < 4; i++) ai(960, 860 - i * 150, 22 - i * 3, { ...feel('happy', t) });
      janine(500, 860, 20, { ...feel('thinking', t) });
    } else if (t < 115.4) { // disobey: shades on, arms crossed
      ai(960, 860, 28, { ...feel('cool', t), hat: 'top' });
      janine(600, 860, 22, { ...feel('surprised', t) });
    } else if (t < 117) { // Chinchilla cube drops through the floor
      const drop = seg(t, 115.5, 117); ai(960, 860 + drop * 300, 26, { ...feel('sleepy', t), sq: .2 });
      boilSeed('chin'); paint(ellPts(1400, 700, 90, 70, 16, 3), { wash: '#B9A98A', ink: PAL.ink, sw: 1 });
    } else if (t < 119) { // safety fences, splinters on every beat
      for (let i = 0; i < 3; i++) { boilSeed('fence' + i); paint(rectPts(400 + i * 420, 600, 200, 160), { wash: PAL.cream, ink: PAL.ink, sw: 1 }); }
      ai(lerp(300, 1600, seg(t, 117, 119)), 860, 22, { ...feel('determined', t), view: 'side', walk: Math.sin(t * 9) * .8 });
    } else if (t < 120.9) { // GPU aisle to the vanishing point
      for (let i = 0; i < 6; i++) { boilSeed('rack' + i); paint(rectPts(700 + i * 40, 300 + i * 30, 60 + i * 30, 300, 3), { wash: '#2C2548', ink: PAL.ink, sw: 1 }); }
      janine(960, 860, 22, { ...feel('nervous', t) });
    } else { // RLHF paddles spin, frame tilts (tilt applied in camBegin above)
      for (let i = 0; i < 3; i++) dancer(600 + i * 360, 860, 20, 'sway', t, { seed: i });
      janine(960, 860, 24, { ...feel('dizzy', t) });
    }
    sub(t);
    camEnd(); flushLetters();
    wipeIn(lt); wipeOut(lt, dur, [PAL.teal, ORG]);
  }

  // ---------- 8 · Chorus 4 (123.5-137.4): red alert ----------
  function chorus4(t, lt, dur) {
    camBegin(960, 540, 1 + .02 * Math.sin(lt * 2));
    stage(t, '#1A0505', RED);
    meter(150, 420, lerp(86, 99.9, seg(t, 123.5, 132)));
    chorusLine(960, 860, 24, t, 31);
    janine(960, 860, 26, { ...feel(t < 132 ? 'determined' : 'nervous', t), ...move('bounce', t), hat: 'sweatband' });
    if (t < 125.9) big('P(DOOM)', 620, 420, 150, PAL.cream);
    else if (t < 127.9) big('LOOM', 620, 420, 170, PAL.cream);
    else if (t < 129.9) big('MASKED', 620, 420, 130, PAL.cream);
    else if (t < 131.9) big('SELF-UPGRADE', 620, 420, 95, PAL.cream);
    else big('ILYA?', 620, 420, 160, PAL.cream);
    if (t > 126 && t < 128) { boilSeed('loom'); for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * .28; inkLine([[960, 300], [960 + Math.cos(a) * 420, 300 + Math.sin(a) * 260]], 3.5, i === 3 ? '#FFD96A' : PAL.cream, 'ink', .4); } }
    if (t > 132) { // the door: light leaking, then SLAM
      boilSeed('door'); paint(rectPts(1400, 300, 220, 420), { wash: '#2A2138', ink: PAL.cream, sw: 1.5 });
      if (t > 134) { boilSeed('slam'); paint(rectPts(1400, 300, 220, 420), { wash: PAL.ink, ink: PAL.cream, sw: 2 }); }
    }
    camEnd(); flushLetters();
    wipeIn(lt); wipeOut(lt, dur, [RED, PAL.ink]);
  }

  // ---------- 9 · Finale (137.4-156.6): was it all for show? ----------
  function finale(t, lt, dur) {
    if (t < 140.5) { // pull back: the door is a painted flat, we're in the theater
      boilSeed('flat'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#2A2138', ink: null });
      paint(rectPts(820, 180, 280, 700), { wash: '#3A2F4A', ink: PAL.cream, sw: 1.5 });
      janine(700, 860, 24, { ...feel('confused', t) });
      ai(1200, 860, 24, { ...feel('shy', t) });
      sub(t);
      flushLetters();
      return;
    }
    camBegin(960, 540, 1 + .01 * lt);
    stage(t, '#8E2F2F', '#6E1F1F'); // curtain call: crimson and gold
    // the whole cast lines up and bows; meter pops like a balloon at 148
    const cast = [[500, 'happy'], [760, 'excited'], [1020, 'love'], [1280, 'proud'], [1500, 'starstruck']];
    cast.forEach(([x, e], i) => { if (i === 2) janine(x, 860, 26, { ...feel(e, t), ...move('bounce', t), hat: 'flower' }); else dancer(x, 860, 22, 'bounce', t, { seed: i * 3, eyes: 'happy', mouth: 'grin' }); });
    if (t > 148 && t < 149) { boilSeed('pop'); paint(starPts(960, 300, 120, .4, 8, 1), { wash: '#FFD96A', ink: null }); }
    if (t > 150) { // curtain falls with the title — deep crimson, visible folds, fast fall
      const fall = easeIn(seg(t, 150, 152));
      boilSeed('cur2'); paint(rectPts(-300, -300 - (1 - fall) * 1400, W + 600, H + 600), { wash: '#4A0F0F', ink: null });
      boilSeed('folds'); for (let i = 0; i < 12; i++) inkLine([[i * 180 - 100, -300 - (1 - fall) * 1400], [i * 180 - 60, 1000 - (1 - fall) * 1400]], 5, '#7A2828', 'ink', .5);
      if (fall > .15) { letter("I'M UPPING MY P(DOOM)", 960, 500, 100, '#FFD96A', { screen: true }); letter('created by Janine', 960, 640, 48, PAL.cream, { screen: true }); }
    }
    if (t > 154) { boilSeed('fade'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: PAL.paper, washOp: 255 * seg(t, 154, 156.6), ink: null }); }
    camEnd(); flushLetters();
    wipeIn(lt);
  }

  shots([
    [0, curtain], [1.5, lab], [23, chorus1], [38.5, takeoff], [59, chorus2],
    [73, obsolete], [95.4, chorus3], [109.4, scale], [123.5, chorus4], [137.4, finale],
  ]);
})();
