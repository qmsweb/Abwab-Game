/* ============================================================
   جيم — لعبة أسئلة تنافسية بين فريقين
   منطق اللعبة (Vanilla JS، بلا أي خادم)
   ============================================================ */
(function () {
  'use strict';

  /* ===== ١) البيانات ===== */
  const STORAGE_KEY = 'jeem.quiz.state.v1';
  const STATE_VERSION = 4;
  const DOORS = Array.isArray(window.JEEM_DOORS) ? window.JEEM_DOORS.slice() : [];
  const TEAM_KEYS = [1, 2];
  const SLOT_OWNERS = [1, 2];
  const DEFAULT_NAMES = { 1: 'الفريق الأول', 2: 'الفريق الثاني' };
  const TEAM_ICONS = ['star', 'crown', 'shield', 'flame', 'rocket', 'moon', 'sun', 'heart', 'diamond'];
  const DEFAULT_ICONS = { 1: 'star', 2: 'shield' };
  const ICON_LABELS = {
    star: 'النجمة',
    crown: 'التاج',
    shield: 'الدرع',
    flame: 'اللهب',
    rocket: 'الصاروخ',
    moon: 'الهلال',
    sun: 'الشمس',
    heart: 'القلب',
    diamond: 'الجوهرة'
  };
  const DIFFICULTY_ALIASES = { easy: 1, medium: 2, hard: 3, 'سهل': 1, 'متوسط': 2, 'صعب': 3 };

  /* بنك الأسئلة الكامل + مجموعات المستويات لكل باب */
  const bankMap = new Map();
  const bankQuestions = [];
  const pools = new Map();
  const seenQuestionKeys = new Set();

  function normalizeText(value) {
    return String(value == null ? '' : value)
      .replace(/[\u064B-\u0652\u0670\u0640]/g, '')
      .replace(/[أإآٱ]/g, 'ا')
      .replace(/ى/g, 'ي')
      .replace(/ة/g, 'ه')
      .replace(/[^\u0621-\u064Aa-zA-Z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  function questionKey(q) {
    return normalizeText(q.question) + '|' + normalizeText(q.answer);
  }

  function resolveDifficulty(raw, levels) {
    const value = raw.difficulty != null ? raw.difficulty : raw.level;
    if (typeof value === 'string') {
      const alias = DIFFICULTY_ALIASES[value.trim().toLowerCase()];
      if (alias) return alias;
    }

    const numeric = Number(value);
    if (Number.isInteger(numeric) && numeric >= 1 && numeric <= levels.length) return numeric;

    const pointCandidate = raw.points != null ? Number(raw.points) : Number(raw.level);
    const pointIndex = levels.indexOf(pointCandidate);
    if (pointIndex > -1) return pointIndex + 1;

    return 1;
  }

  DOORS.forEach(function (door) {
    const levels = (Array.isArray(door.levels) ? door.levels : [100, 200, 300])
      .map(Number)
      .filter(function (value) { return value > 0; });
    door.levels = Array.from(new Set(levels.length ? levels : [100, 200, 300]));

    door.levels.forEach(function (points) {
      pools.set(door.id + '|' + points, []);
    });

    const source = Array.isArray(door.bank) ? door.bank
      : Array.isArray(door.questions) ? door.questions
        : [];
    const accepted = [];

    source.forEach(function (raw, index) {
      if (!raw || typeof raw !== 'object') return;

      const q = Object.assign({}, raw);
      const difficulty = resolveDifficulty(raw, door.levels);

      q.difficulty = difficulty;
      q.points = door.levels[difficulty - 1];
      q.doorId = door.id;
      q.doorName = door.name;
      q.type = q.type === 'image' || q.type === 'images' ? q.type : 'text';
      q.question = String(q.question == null ? '' : q.question).trim();
      q.answer = String(q.answer == null ? '' : q.answer).trim();
      q.id = String(q.id == null ? '' : q.id).trim();

      if (!q.id) q.id = door.id + '-auto-' + (index + 1);
      if (!q.question || !q.answer) {
        console.warn('[جيم] سؤال بلا نص أو إجابة في الباب «' + door.name + '»:', q.id);
        return;
      }
      if (bankMap.has(q.id)) {
        console.warn('[جيم] معرّف سؤال مكرر (تم تجاهله):', q.id);
        return;
      }

      const signature = questionKey(q);
      if (seenQuestionKeys.has(signature)) {
        console.warn('[جيم] سؤال مكرر (تم تجاهله):', q.id);
        return;
      }

      seenQuestionKeys.add(signature);
      bankMap.set(q.id, q);
      bankQuestions.push(q);
      accepted.push(q);
      pools.get(door.id + '|' + q.points).push(q);
    });

    door.bank = accepted;
    door.questions = accepted;
  });

  const allQuestions = [];
  const questionMap = new Map();
  const doorQuestions = new Map();
  const slotMap = new Map();
  let TOTAL_PER_TEAM = 0;
  let FULL_BOARD_POINTS = 0;

  function slotKey(doorId, points, owner) {
    return doorId + '|' + points + '|' + owner;
  }

  function shuffle(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  /* توزيع جديد: سؤالان لكل مستوى (واحد لكل فريق) بلا أي تكرار */
  function drawAssignments(avoidIds) {
    const avoid = new Set((avoidIds || []).filter(Boolean).map(String));
    const usedIds = new Set();
    const usedKeys = new Set();
    const assignments = {};
    let shortfall = 0;

    function eligible(q) {
      return !usedIds.has(q.id) && !usedKeys.has(questionKey(q));
    }

    DOORS.forEach(function (door) {
      door.levels.forEach(function (points) {
        const levelIndex = door.levels.indexOf(points);
        const own = (pools.get(door.id + '|' + points) || []).filter(eligible);
        const ordered = shuffle(own.filter(function (q) { return !avoid.has(q.id); }))
          .concat(shuffle(own.filter(function (q) { return avoid.has(q.id); })));
        let picks = ordered.slice(0, SLOT_OWNERS.length);

        /* احتياط: إن كان بنك المستوى أقل من سؤالين نكمل من بقية مستويات الباب */
        if (picks.length < SLOT_OWNERS.length) {
          const fallback = [];
          door.levels.forEach(function (otherPoints) {
            if (otherPoints === points) return;
            fallback.push.apply(fallback, pools.get(door.id + '|' + otherPoints) || []);
          });
          const extras = fallback.filter(eligible).sort(function (a, b) {
            return Math.abs(a.difficulty - (levelIndex + 1)) -
              Math.abs(b.difficulty - (levelIndex + 1));
          });
          picks = picks.concat(extras.slice(0, SLOT_OWNERS.length - picks.length));
        }

        if (picks.length < SLOT_OWNERS.length) {
          shortfall += SLOT_OWNERS.length - picks.length;
          console.warn('[جيم] لا توجد أسئلة كافية في الباب «' + door.name + '» للمستوى ' + points + '.');
        }

        SLOT_OWNERS.forEach(function (owner, index) {
          const chosen = picks[index];
          if (!chosen) return;
          assignments[slotKey(door.id, points, owner)] = chosen.id;
          usedIds.add(chosen.id);
          usedKeys.add(questionKey(chosen));
        });
      });
    });

    return { assignments: assignments, shortfall: shortfall };
  }

  function applyAssignments(assignments) {
    allQuestions.length = 0;
    questionMap.clear();
    slotMap.clear();
    doorQuestions.clear();

    DOORS.forEach(function (door) {
      const active = [];

      door.levels.forEach(function (points) {
        SLOT_OWNERS.forEach(function (owner) {
          const key = slotKey(door.id, points, owner);
          const source = bankMap.get(assignments[key]);
          if (!source) return;
          if (questionMap.has(source.id)) {
            console.warn('[جيم] السؤال نفسه وُزّع في أكثر من زر (تم تجاهل التكرار):', source.id);
            return;
          }

          const q = Object.assign({}, source, { points: points, owner: owner });
          allQuestions.push(q);
          questionMap.set(q.id, q);
          slotMap.set(key, q);
          active.push(q);
        });
      });

      active.sort(function (a, b) {
        return a.points - b.points || a.owner - b.owner;
      });
      doorQuestions.set(door.id, active);
    });

    TOTAL_PER_TEAM = allQuestions.filter(function (q) { return q.owner === 1; }).length;
    FULL_BOARD_POINTS = allQuestions.reduce(function (sum, q) { return sum + q.points; }, 0);
  }

  /* التحقق من توزيع محفوظ قبل إعادة استخدامه */
  function validateAssignments(raw) {
    if (!raw || typeof raw !== 'object') return null;

    const result = {};
    const used = new Set();

    for (let d = 0; d < DOORS.length; d += 1) {
      const door = DOORS[d];
      for (let l = 0; l < door.levels.length; l += 1) {
        const points = door.levels[l];
        for (let o = 0; o < SLOT_OWNERS.length; o += 1) {
          const owner = SLOT_OWNERS[o];
          const key = slotKey(door.id, points, owner);
          const id = typeof raw[key] === 'string' ? raw[key] : '';
          const q = bankMap.get(id);

          if (!q || q.doorId !== door.id || used.has(id)) return null;
          used.add(id);
          result[key] = id;
        }
      }
    }

    return result;
  }

  /* ===== ٢) الحالة ===== */
  function defaultState() {
    /* الصفحة المفتوحة يحدّدها معرّفها في الرابط، لا تُحفظ هنا */
    return {
      v: STATE_VERSION,
      names: Object.assign({}, DEFAULT_NAMES),
      icons: Object.assign({}, DEFAULT_ICONS),
      scores: { 1: 0, 2: 0 },
      played: [],
      turn: 1,
      assignments: {}
    };
  }

  function cleanName(value, team) {
    const name = String(value == null ? '' : value).replace(/\s+/g, ' ').trim().slice(0, 20);
    return name || DEFAULT_NAMES[team];
  }

  function cleanIcon(value, fallback) {
    return TEAM_ICONS.indexOf(value) > -1 ? value : fallback;
  }

  function readSavedState() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;

      const next = defaultState();
      next.v = Number(parsed.v) || 0;
      next.names[1] = cleanName(parsed.names && parsed.names[1], 1);
      next.names[2] = cleanName(parsed.names && parsed.names[2], 2);
      next.icons[1] = cleanIcon(parsed.icons && parsed.icons[1], DEFAULT_ICONS[1]);
      next.icons[2] = cleanIcon(parsed.icons && parsed.icons[2], DEFAULT_ICONS[2]);
      if (next.icons[1] === next.icons[2]) {
        next.icons[2] = TEAM_ICONS.filter(function (name) { return name !== next.icons[1]; })[0];
      }
      next.scores[1] = Math.max(0, Math.floor(Number(parsed.scores && parsed.scores[1]) || 0));
      next.scores[2] = Math.max(0, Math.floor(Number(parsed.scores && parsed.scores[2]) || 0));
      next.turn = Number(parsed.turn) === 2 ? 2 : 1;
      next.assignments = parsed.assignments && typeof parsed.assignments === 'object'
        ? parsed.assignments
        : {};
      next.played = Array.from(new Set((Array.isArray(parsed.played) ? parsed.played : [])
        .filter(function (id) { return typeof id === 'string'; })));

      return next;
    } catch (err) {
      return null;
    }
  }

  const savedState = readSavedState();
  let state = savedState || defaultState();
  let migrated = false;

  let assignments = savedState ? validateAssignments(savedState.assignments) : null;
  if (!assignments) {
    const previousIds = savedState && savedState.assignments
      ? Object.keys(savedState.assignments).map(function (key) { return savedState.assignments[key]; })
      : [];
    if (savedState) {
      state.scores = { 1: 0, 2: 0 };
      state.played = [];
      state.turn = 1;
      migrated = true;
    }
    assignments = drawAssignments(previousIds).assignments;
  }

  state.v = STATE_VERSION;
  state.assignments = assignments;
  applyAssignments(state.assignments);

  let playedSet = new Set(state.played);
  const hasOrphanPlayed = Array.from(playedSet).some(function (id) { return !questionMap.has(id); });
  if (hasOrphanPlayed) {
    state.scores = { 1: 0, 2: 0 };
    state.played = [];
    playedSet = new Set();
    migrated = true;
  }

  if (state.scores[1] + state.scores[2] > FULL_BOARD_POINTS) {
    state.scores[1] = 0;
    state.scores[2] = 0;
    state.played = [];
    playedSet = new Set();
  }

  let lastSnapshot = null;

  function drawNewBoard() {
    const previous = Object.keys(state.assignments || {}).map(function (key) {
      return state.assignments[key];
    });
    state.assignments = drawAssignments(previous).assignments;
    applyAssignments(state.assignments);
  }

  function hasProgress() {
    return state.scores[1] > 0 || state.scores[2] > 0 || playedSet.size > 0;
  }

  function save() {
    try {
      state.played = Array.from(playedSet);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      /* التخزين غير متاح: تستمر اللعبة في الذاكرة فقط */
    }
  }

  function other(team) {
    return team === 1 ? 2 : 1;
  }

  /* ===== ٣) مشتقات اللعبة ===== */
  function isPlayed(q) {
    return playedSet.has(q.id);
  }

  function remainingQuestions() {
    return allQuestions.filter(function (q) { return !isPlayed(q); });
  }

  function remainingPoints() {
    return remainingQuestions().reduce(function (sum, q) { return sum + q.points; }, 0);
  }

  function ownRemaining(team) {
    return allQuestions.filter(function (q) {
      return q.owner === team && !isPlayed(q);
    }).length;
  }

  function ownPlayed(team) {
    return allQuestions.filter(function (q) {
      return q.owner === team && isPlayed(q);
    }).length;
  }

  /* فريق أنهى كل أسئلته الخمسة عشر وكان متأخرًا: يحق له اللحاق */
  function isCatchupActive(team) {
    return ownRemaining(team) === 0 &&
      state.scores[team] < state.scores[other(team)] &&
      remainingQuestions().length > 0;
  }

  function canSelect(team, q) {
    if (!q || isPlayed(q)) return false;
    if (q.owner === team) return true;
    return isCatchupActive(team);
  }

  function gameStatus() {
    const remaining = remainingPoints();
    if (remainingQuestions().length === 0) {
      const diff = state.scores[1] - state.scores[2];
      return {
        over: true,
        reason: 'exhausted',
        winner: diff === 0 ? 0 : diff > 0 ? 1 : 2,
        remaining: 0
      };
    }
    const diff = Math.abs(state.scores[1] - state.scores[2]);
    if (diff > remaining) {
      return {
        over: true,
        reason: 'clinch',
        winner: state.scores[1] > state.scores[2] ? 1 : 2,
        remaining: remaining
      };
    }
    return { over: false, reason: '', winner: 0, remaining: remaining };
  }

  function nextTurn() {
    const candidate = other(state.turn);
    if (allQuestions.some(function (q) { return canSelect(candidate, q); })) return candidate;
    if (allQuestions.some(function (q) { return canSelect(state.turn, q); })) return state.turn;
    return candidate;
  }

  function ensureValidTurn() {
    if (gameStatus().over) return;
    if (allQuestions.some(function (q) { return canSelect(state.turn, q); })) return;
    state.turn = other(state.turn);
  }

  /* ===== ٤) عناصر DOM ===== */
  const $ = function (selector, root) {
    return (root || document).querySelector(selector);
  };

  const homeScreen = $('#homeScreen');
  const gameScreen = $('#gameScreen');
  const questionPage = $('#questionPage');
  const qBrandBtn = $('#btnQBrand');
  const qBrandMenu = $('#qBrandMenu');
  const siteFooter = $('#siteFooter');
  const homeStatus = $('#homeStatus');

  const boardEl = $('#board');
  const score1El = $('#score1');
  const score2El = $('#score2');
  const badge1 = $('#badge1');
  const badge2 = $('#badge2');
  const teamCard1 = $('#teamCard1');
  const teamCard2 = $('#teamCard2');
  const teamName1 = $('#teamName1');
  const teamName2 = $('#teamName2');
  const progress1 = $('#progress1');
  const progress2 = $('#progress2');
  const bar1 = $('#bar1');
  const bar2 = $('#bar2');
  const turnNameEl = $('#turnName');
  const turnLabelEl = $('#turnLabel');
  const swapTurnBtn = $('#btnSwapTurn');
  const remainingPointsEl = $('#remainingPoints');
  const catchupBanner = $('#catchupBanner');
  const catchupText = $('#catchupText');
  const catchupIconUse = $('#catchupIconUse');

  const qDoor = $('#qDoor');
  const qPoints = $('#qPoints');
  const qOwner = $('#qOwner');
  const qText = $('#qText');
  const qMedia = $('#qMedia');
  const qNote = $('#qNote');
  const qBody = $('#qBody');
  const qTimer = $('#qTimer');
  const answerBlock = $('#answerBlock');
  const aText = $('#aText');
  const stageQuestion = $('#stageQuestion');
  const stageAnswer = $('#stageAnswer');
  const awardPts1 = $('#awardPts1');
  const awardPts2 = $('#awardPts2');

  const setupOverlay = $('#setupOverlay');
  const setupName1 = $('#setupName1');
  const setupName2 = $('#setupName2');
  const setupIcons1 = $('#setupIcons1');
  const setupIcons2 = $('#setupIcons2');
  const setupBadge1 = $('#setupBadge1');
  const setupBadge2 = $('#setupBadge2');
  const setupRestartWrap = $('#setupRestartWrap');
  const setupRestartChk = $('#setupRestart');

  const helpOverlay = $('#helpOverlay');
  const endOverlay = $('#endOverlay');
  const endReason = $('#endReason');
  const endTitle = $('#endTitle');
  const endScores = $('#endScores');
  const endNote = $('#endNote');
  const endUndoBtn = $('#btnEndUndo');
  const confirmOverlay = $('#confirmOverlay');
  const confirmTitle = $('#confirmTitle');
  const confirmText = $('#confirmText');
  const confirmYes = $('[data-confirm="yes"]', confirmOverlay);
  const confirmNo = $('[data-confirm="no"]', confirmOverlay);

  const toastEl = $('#toast');
  const toastText = $('#toastText');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SVG_NS = 'http://www.w3.org/2000/svg';

  let currentQuestion = null;
  let revealed = false;
  let currentScreen = 'home';
  let toastTimer = null;
  let endTimer = null;
  let confirmResolve = null;
  let setupDraftIcons = Object.assign({}, DEFAULT_ICONS);
  let counterStart = 0;
  let counterTimer = null;
  const openOverlays = new Set();

  /* ===== ٥) أدوات مساعدة ===== */
  function makeIcon(name) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS(SVG_NS, 'use');
    use.setAttribute('href', '#i-' + name);
    svg.appendChild(use);
    return svg;
  }

  function setIcon(container, name) {
    if (!container) return;
    container.replaceChildren(makeIcon(name));
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function formatNumber(value) {
    return Number(value || 0).toLocaleString('en-US');
  }

  function formatClock(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
  }

  function startCounter(startedAt) {
    stopCounter();
    counterStart = Number(startedAt) > 0 ? Number(startedAt) : Date.now();
    if (qTimer) qTimer.textContent = formatClock(Date.now() - counterStart);
    counterTimer = window.setInterval(function () {
      if (qTimer) qTimer.textContent = formatClock(Date.now() - counterStart);
    }, 250);
  }

  function stopCounter() {
    if (counterTimer) {
      window.clearInterval(counterTimer);
      counterTimer = null;
    }
  }

  function animateScore(node, target) {
    const from = Number(node.dataset.value || 0);
    node.dataset.value = String(target);
    if (reduceMotion || from === target) {
      node.textContent = formatNumber(target);
      return;
    }
    if (node._raf) cancelAnimationFrame(node._raf);
    const started = performance.now();
    const duration = 460;

    function step(now) {
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = formatNumber(Math.round(from + (target - from) * eased));
      if (progress < 1) {
        node._raf = requestAnimationFrame(step);
      } else {
        node.textContent = formatNumber(target);
      }
    }
    node._raf = requestAnimationFrame(step);
  }

  function toastOpen(message) {
    toastText.textContent = message;

    window.clearTimeout(toastTimer);
    toastEl.hidden = false;
    requestAnimationFrame(function () {
      toastEl.classList.add('is-open');
    });
    toastTimer = window.setTimeout(toastClose, 3800);
  }

  function toastClose() {
    window.clearTimeout(toastTimer);
    toastEl.classList.remove('is-open');
    window.setTimeout(function () {
      if (!toastEl.classList.contains('is-open')) toastEl.hidden = true;
    }, 200);
  }

  /* ===== ٦) الشاشات والتوجيه ===== */
  /* لكل صفحة معرّف مستقل في الرابط: #/ للرئيسية، #/board للوحة، #/q/<id> للسؤال */
  const ROUTES = { home: '#/', board: '#/board' };
  let lastRoute = null;

  function safeDecode(value) {
    try {
      return decodeURIComponent(value);
    } catch (err) {
      return value;
    }
  }

  function questionRoute(id) {
    return '#/q/' + encodeURIComponent(id);
  }

  function parseRoute(raw) {
    const path = String(raw || '').replace(/^#/, '');
    if (!path || path === '/') return { name: 'home' };

    const parts = path.split('/').filter(Boolean).map(safeDecode);
    const head = String(parts[0] || '').toLowerCase();

    if (head === 'board' || head === 'game') return { name: 'board' };
    if (head === 'q' || head === 'question') {
      return parts[1] ? { name: 'question', id: parts[1] } : { name: 'home' };
    }
    return { name: 'home' };
  }

  function routeHash(route) {
    if (route.name === 'question' && route.id) return questionRoute(route.id);
    if (route.name === 'board') return ROUTES.board;
    return ROUTES.home;
  }

  /* تغيير عنوان الصفحة فقط؛ الرسم يتم في مكان الاستدعاء */
  function setRoute(hash, mode) {
    lastRoute = hash;
    if ((window.location.hash || '') === hash) return;
    try {
      if (mode === 'replace') window.history.replaceState(null, '', hash);
      else window.history.pushState(null, '', hash);
    } catch (err) {
      /* بعض بيئات file:// تمنع تعديل التاريخ — يبقى التوجيه الداخلي عاملًا */
    }
  }

  /* فتح الصفحة المطابقة للرابط الحالي (عند التحميل أو الرجوع/التقدّم) */
  function applyRoute() {
    const hash = window.location.hash || '';
    const route = parseRoute(hash);
    const canonical = routeHash(route);

    if (hash !== canonical) {
      try {
        window.history.replaceState(null, '', canonical);
      } catch (err) {
        /* تجاهل: يبقى التوجيه الداخلي عاملًا */
      }
    }
    if (canonical === lastRoute) return;
    lastRoute = canonical;
    closeAllOverlays();

    if (route.name === 'question') {
      const q = questionMap.get(route.id);
      if (!q || playedSet.has(q.id) || gameStatus().over) {
        if (currentQuestion) {
          currentQuestion = null;
          revealed = false;
          stopCounter();
        }
        setRoute(ROUTES.board, 'replace');
        showScreen('game');
        return;
      }
      openQuestion(q);
      return;
    }

    if (currentQuestion) {
      currentQuestion = null;
      revealed = false;
      stopCounter();
    }

    if (route.name === 'board') showScreen('game');
    else showScreen('home');
  }

  function showScreen(name) {
    currentScreen = name;
    if (name !== 'question') closeBrandMenu(false);
    homeScreen.hidden = name !== 'home';
    gameScreen.hidden = name !== 'game';
    questionPage.hidden = name !== 'question';
    siteFooter.hidden = name === 'question';
    if (name !== 'question') stopCounter();
    if (name === 'home') updateHomeStatus();
    window.scrollTo(0, 0);
    save();
  }

  function updateHomeStatus() {
    if (!homeStatus) return;
    if (!hasProgress()) {
      homeStatus.hidden = true;
      homeStatus.textContent = '';
      return;
    }
    const status = gameStatus();
    homeStatus.hidden = false;
    homeStatus.textContent = 'لعبة محفوظة — ' + state.names[1] + ': ' + formatNumber(state.scores[1]) +
      ' · ' + state.names[2] + ': ' + formatNumber(state.scores[2]) +
      (status.over ? ' · انتهت' : '');
  }

  function focusables(root) {
    return Array.prototype.slice.call(
      root.querySelectorAll(
        'button:not([disabled]):not([hidden]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter(function (node) {
      return node.offsetParent !== null;
    });
  }

  function openOverlay(overlay, preferredFocus) {
    if (!overlay) return;
    if (overlay.hidden) overlay._returnFocus = document.activeElement;
    overlay.hidden = false;
    openOverlays.add(overlay);
    document.documentElement.classList.add('is-locked');
    void overlay.offsetWidth;
    overlay.classList.add('is-open');

    const dialog = $('.dialog', overlay);
    window.setTimeout(function () {
      const target = preferredFocus || (dialog && focusables(dialog)[0]) || dialog;
      if (target && typeof target.focus === 'function') target.focus({ preventScroll: true });
    }, 40);
  }

  function closeOverlay(overlay) {
    if (!overlay || overlay.hidden) return;
    overlay.classList.remove('is-open');
    openOverlays.delete(overlay);

    const preferred = overlay._returnFocus;
    overlay._returnFocus = null;

    window.setTimeout(function () {
      if (!overlay.classList.contains('is-open')) overlay.hidden = true;
      if (openOverlays.size === 0) document.documentElement.classList.remove('is-locked');
    }, 190);

    if (openOverlays.size === 0) {
      window.setTimeout(function () {
        let target = preferred;
        const visible = target && target.isConnected && target.getClientRects().length > 0;
        if (!visible) target = document.querySelector('.qbtn.is-open') || swapTurnBtn;
        if (target && typeof target.focus === 'function') target.focus({ preventScroll: true });
      }, 200);
    }
  }

  function topOverlay() {
    let top = null;
    openOverlays.forEach(function (overlay) {
      if (!overlay.hidden) top = overlay;
    });
    return top;
  }

  /* عند الانتقال إلى صفحة أخرى تُغلق أي نافذة مفتوحة فوق الصفحة السابقة */
  function closeAllOverlays() {
    if (confirmResolve) resolveConfirm(false);
    Array.from(openOverlays).forEach(function (overlay) {
      if (overlay !== confirmOverlay) closeOverlay(overlay);
    });
  }

  function askConfirm(options) {
    confirmTitle.textContent = options.title || 'تأكيد';
    confirmText.textContent = options.text || '';
    confirmYes.textContent = options.confirmLabel || 'تأكيد';
    openOverlay(confirmOverlay, confirmYes);

    return new Promise(function (resolve) {
      confirmResolve = resolve;
    });
  }

  function resolveConfirm(answer) {
    if (!confirmResolve) return;
    const resolve = confirmResolve;
    confirmResolve = null;
    closeOverlay(confirmOverlay);
    resolve(answer);
  }

  /* ===== ٧) رسم لوحة النتائج ===== */
  function renderTeamBadges() {
    setIcon(badge1, state.icons[1]);
    setIcon(badge2, state.icons[2]);
  }

  function renderScoreboard() {
    const status = gameStatus();

    animateScore(score1El, state.scores[1]);
    animateScore(score2El, state.scores[2]);
    renderTeamBadges();

    teamCard1.classList.toggle('is-active', !status.over && state.turn === 1);
    teamCard2.classList.toggle('is-active', !status.over && state.turn === 2);
    teamCard1.classList.toggle('is-leader', state.scores[1] > state.scores[2]);
    teamCard2.classList.toggle('is-leader', state.scores[2] > state.scores[1]);

    turnLabelEl.textContent = status.over ? 'انتهت المسابقة' : 'الدور الآن';
    turnNameEl.textContent = status.over
      ? (status.winner ? 'الفائز: ' + state.names[status.winner] : 'تعادل الفريقان')
      : state.names[state.turn];

    progress1.textContent = ownPlayed(1) + ' / ' + TOTAL_PER_TEAM + ' سؤال';
    progress2.textContent = ownPlayed(2) + ' / ' + TOTAL_PER_TEAM + ' سؤال';
    bar1.style.width = (TOTAL_PER_TEAM ? (ownPlayed(1) / TOTAL_PER_TEAM) * 100 : 0) + '%';
    bar2.style.width = (TOTAL_PER_TEAM ? (ownPlayed(2) / TOTAL_PER_TEAM) * 100 : 0) + '%';

    remainingPointsEl.textContent = formatNumber(status.remaining);

    const swapLabel = swapTurnBtn.querySelector('span');
    const swapIconUse = swapTurnBtn.querySelector('use');
    if (status.over) {
      swapLabel.textContent = 'النتيجة النهائية';
      swapIconUse.setAttribute('href', '#i-trophy');
      swapTurnBtn.title = 'عرض نتيجة اللعبة';
    } else {
      swapLabel.textContent = 'تبديل الدور';
      swapIconUse.setAttribute('href', '#i-swap');
      swapTurnBtn.title = 'تبديل الدور يدويًا';
    }
  }

  /* ===== ٨) رسم اللوحة ===== */
  function syncTeamNameLabels() {
    TEAM_KEYS.forEach(function (team) {
      Array.prototype.forEach.call(document.querySelectorAll('[data-team-name="' + team + '"]'), function (node) {
        node.textContent = state.names[team];
      });
    });
  }

  function renderBoard() {
    const status = gameStatus();
    const fragment = document.createDocumentFragment();

    DOORS.forEach(function (door) {
      const questions = doorQuestions.get(door.id) || [];
      const playedCount = questions.filter(isPlayed).length;

      const card = el('section', 'door');
      card.dataset.door = door.id;
      if (questions.length && playedCount === questions.length) card.classList.add('is-complete');

      const head = el('header', 'door__head');
      const iconBox = el('span', 'door__icon');
      iconBox.appendChild(makeIcon(door.icon || 'general'));
      head.appendChild(iconBox);
      head.appendChild(el('h2', 'door__title', door.name));
      head.appendChild(el('span', 'door__count', playedCount + ' / ' + questions.length));
      card.appendChild(head);

      const levels = el('div', 'door__levels');

      door.levels.forEach(function (level) {
        TEAM_KEYS.forEach(function (owner) {
          const q = slotMap.get(door.id + '|' + level + '|' + owner);
          const btn = el('button', 'qbtn');
          btn.type = 'button';
          btn.dataset.owner = String(owner);

          if (!q) {
            btn.disabled = true;
            btn.classList.add('is-played');
            btn.textContent = '—';
            btn.setAttribute('aria-label', door.name + ' — سؤال غير متوفر');
            levels.appendChild(btn);
            return;
          }

          btn.dataset.id = q.id;

          const teamDot = el('span', 'qbtn__team');
          teamDot.appendChild(makeIcon(state.icons[owner]));
          const pts = el('span', 'qbtn__pts', formatNumber(q.points));
          btn.appendChild(teamDot);
          btn.appendChild(pts);

          const baseLabel = door.name + ' — ' + formatNumber(q.points) + ' نقطة — سؤال ' + state.names[owner];

          if (isPlayed(q)) {
            btn.classList.add('is-played');
            btn.disabled = true;
            btn.setAttribute('aria-label', baseLabel + ' — لُعب');
          } else if (status.over) {
            btn.classList.add('is-locked');
            btn.disabled = true;
            btn.setAttribute('aria-label', baseLabel + ' — انتهت اللعبة');
          } else if (canSelect(state.turn, q)) {
            btn.classList.add('is-open');
            if (owner === state.turn) btn.classList.add('is-active-team');
            if (owner !== state.turn) {
              btn.classList.add('is-catchup');
              btn.appendChild(el('span', 'qbtn__flag', 'لحاق'));
              btn.setAttribute('aria-label', baseLabel + ' — فرصة لحاق');
            } else {
              btn.setAttribute('aria-label', baseLabel + ' — متاح');
            }
          } else {
            btn.classList.add('is-locked');
            btn.disabled = true;
            btn.setAttribute('aria-label', baseLabel + ' — مقفل الآن');
            btn.title = 'هذا السؤال للفريق الآخر. بدّل الدور أو انتظر فرصة اللحاق.';
          }

          levels.appendChild(btn);
        });
      });

      card.appendChild(levels);
      fragment.appendChild(card);
    });

    boardEl.replaceChildren(fragment);
  }

  /* ===== ٩) شريط اللحاق / النهاية ===== */
  function renderBanner() {
    const status = gameStatus();

    if (status.over) {
      catchupBanner.hidden = false;
      catchupBanner.classList.add('catchup--end');
      if (catchupIconUse) catchupIconUse.setAttribute('href', '#i-trophy');
      catchupText.textContent = 'انتهت المسابقة. اضغط «النتيجة النهائية» في لوحة النتائج لعرض الفائز.';
      return;
    }

    catchupBanner.classList.remove('catchup--end');
    if (catchupIconUse) catchupIconUse.setAttribute('href', '#i-bolt');

    const catchupTeam = TEAM_KEYS.filter(isCatchupActive)[0] || 0;
    if (!catchupTeam) {
      catchupBanner.hidden = true;
      catchupText.textContent = '';
      return;
    }

    catchupBanner.hidden = false;
    catchupText.textContent =
      state.names[catchupTeam] + ' أنهى أسئلته كلها وهو متأخر في النقاط — يُسمح له باختيار أسئلة الفريق الآخر (المعلّمة بـ «لحاق»).';
  }

  function renderAll() {
    renderScoreboard();
    renderBoard();
    renderBanner();
  }

  /* ===== ١٠) بيانات الفريقين ===== */
  function renderSetupIcons() {
    [[setupIcons1, 1], [setupIcons2, 2]].forEach(function (pair) {
      const wrap = pair[0];
      const team = pair[1];
      if (!wrap) return;

      const fragment = document.createDocumentFragment();
      TEAM_ICONS.forEach(function (name) {
        const btn = el('button', 'icon-pick');
        btn.type = 'button';
        btn.dataset.icon = name;
        btn.setAttribute('aria-label', ICON_LABELS[name] || name);
        btn.setAttribute('aria-pressed', setupDraftIcons[team] === name ? 'true' : 'false');
        if (setupDraftIcons[team] === name) btn.classList.add('is-selected');
        btn.appendChild(makeIcon(name));
        fragment.appendChild(btn);
      });
      wrap.replaceChildren(fragment);

      setIcon(team === 1 ? setupBadge1 : setupBadge2, setupDraftIcons[team]);
    });
  }

  function selectSetupIcon(team, icon) {
    if (TEAM_ICONS.indexOf(icon) === -1) return;
    const opponent = other(team);
    if (setupDraftIcons[opponent] === icon) setupDraftIcons[opponent] = setupDraftIcons[team];
    setupDraftIcons[team] = icon;
    renderSetupIcons();
  }

  function openSetup() {
    setupDraftIcons = { 1: state.icons[1], 2: state.icons[2] };
    setupName1.value = state.names[1];
    setupName2.value = state.names[2];
    setupRestartWrap.hidden = !hasProgress();
    setupRestartChk.checked = false;
    renderSetupIcons();
    openOverlay(setupOverlay, setupName1);
  }

  function startGameFromSetup() {
    const restart = !setupRestartWrap.hidden && setupRestartChk.checked;

    state.names = {
      1: cleanName(setupName1.value, 1),
      2: cleanName(setupName2.value, 2)
    };
    state.icons = { 1: setupDraftIcons[1], 2: setupDraftIcons[2] };

    if (restart) {
      resetProgress({ save: false });
      drawNewBoard();
    }
    save();

    teamName1.value = state.names[1];
    teamName2.value = state.names[2];
    syncTeamNameLabels();
    renderAll();

    closeOverlay(setupOverlay);
    setRoute(ROUTES.board);
    showScreen('game');
    toastOpen(restart ? 'لعبة جديدة بتوزيع جديد — بالتوفيق للفريقين!' : 'بدأت اللعبة — بالتوفيق للفريقين!');
  }

  /* ===== ١١) صفحة السؤال ===== */
  function buildMedia(q) {
    let items = [];
    if (Array.isArray(q.images) && q.images.length) {
      items = q.images.slice();
    } else if (q.image) {
      items = [{ src: q.image, alt: q.imageAlt || '', hint: q.hint || '' }];
    } else if (q.type === 'image' || q.type === 'images') {
      items = [{ src: '', alt: q.imageAlt || '', hint: q.hint || '' }];
    }

    qMedia.replaceChildren();
    if (!items.length) {
      qMedia.hidden = true;
      delete qMedia.dataset.count;
      return;
    }

    qMedia.hidden = false;
    qMedia.dataset.count = String(items.length);

    items.forEach(function (item) {
      const tile = el('div', 'media');
      const placeholder = el('div', 'media__placeholder');
      placeholder.appendChild(makeIcon('image'));
      if (item.hint) placeholder.appendChild(el('span', 'media__hint', item.hint));
      placeholder.appendChild(el('span', 'media__caption', item.src ? 'الصورة غير متاحة حاليًا' : 'مكان الصورة'));
      tile.appendChild(placeholder);

      if (item.src) {
        const img = document.createElement('img');
        img.className = 'media__img';
        img.alt = item.alt || '';
        img.loading = 'lazy';
        img.decoding = 'async';
        img.addEventListener('load', function () {
          tile.classList.add('is-loaded');
        });
        img.addEventListener('error', function () {
          img.remove();
        });
        img.src = item.src;
        tile.insertBefore(img, placeholder);
      }

      qMedia.appendChild(tile);
    });
  }

  function openQuestion(q) {
    if (!q) return;
    currentQuestion = q;
    revealed = false;

    qDoor.textContent = q.doorName;
    qPoints.textContent = formatNumber(q.points) + ' نقطة';
    qOwner.textContent = 'سؤال ' + state.names[q.owner];
    qOwner.dataset.owner = String(q.owner);
    qText.textContent = q.question;

    qNote.hidden = !q.hint || q.type === 'image';
    qNote.textContent = q.hint || '';

    buildMedia(q);

    answerBlock.hidden = true;
    aText.textContent = '';
    stageQuestion.hidden = false;
    stageAnswer.hidden = true;
    awardPts1.textContent = '+' + formatNumber(q.points);
    awardPts2.textContent = '+' + formatNumber(q.points);

    setRoute(questionRoute(q.id));
    if (qBody) qBody.scrollTop = 0;

    showScreen('question');
    startCounter(Date.now());

    window.setTimeout(function () {
      const revealBtn = $('#btnReveal');
      if (revealBtn) revealBtn.focus({ preventScroll: true });
    }, 60);
  }

  function revealAnswer() {
    if (!currentQuestion || revealed) return;
    revealed = true;
    aText.textContent = currentQuestion.answer;
    answerBlock.hidden = false;
    stageQuestion.hidden = true;
    stageAnswer.hidden = false;

    requestAnimationFrame(function () {
      answerBlock.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
    });
    window.setTimeout(function () {
      if (questionPage) questionPage.focus({ preventScroll: true });
    }, 30);
  }

  function finishQuestionView() {
    currentQuestion = null;
    revealed = false;
    stopCounter();
    showScreen('game');
  }

  function closeQuestion() {
    if (!currentQuestion) return;
    const id = currentQuestion.id;
    finishQuestionView();
    setRoute(ROUTES.board, 'replace');
    const btn = boardEl.querySelector('.qbtn[data-id="' + id + '"]');
    window.setTimeout(function () {
      if (btn && !btn.disabled) btn.focus({ preventScroll: true });
      else if (swapTurnBtn) swapTurnBtn.focus({ preventScroll: true });
    }, 60);
  }

  /* ===== ١١-ب) قائمة الشعار في صفحة السؤال ===== */
  function openBrandMenu() {
    if (!qBrandBtn || !qBrandMenu) return;
    qBrandMenu.hidden = false;
    qBrandBtn.setAttribute('aria-expanded', 'true');
    const first = focusables(qBrandMenu)[0];
    if (first) first.focus({ preventScroll: true });
  }

  function closeBrandMenu(restoreFocus) {
    if (!qBrandMenu || qBrandMenu.hidden) return;
    qBrandMenu.hidden = true;
    if (qBrandBtn) qBrandBtn.setAttribute('aria-expanded', 'false');
    if (restoreFocus && qBrandBtn && qBrandBtn.isConnected &&
        typeof qBrandBtn.focus === 'function' && qBrandBtn.getClientRects().length > 0) {
      qBrandBtn.focus({ preventScroll: true });
    }
  }

  function toggleBrandMenu() {
    if (!qBrandBtn || !qBrandMenu) return;
    if (qBrandMenu.hidden) openBrandMenu();
    else closeBrandMenu(true);
  }

  function handleBrandMenuAction(action) {
    closeBrandMenu(false);
    if (action === 'board') {
      if (currentQuestion) closeQuestion();
      else {
        setRoute(ROUTES.board, 'replace');
        showScreen('game');
      }
    } else if (action === 'help') {
      openOverlay(helpOverlay, $('.dialog--help .btn--primary'));
    } else if (action === 'home') {
      goHome();
    }
  }

  /* ===== ١٢) الإسناد والتراجع ===== */
  function snapshot() {
    return {
      scores: { 1: state.scores[1], 2: state.scores[2] },
      played: Array.from(playedSet),
      turn: state.turn
    };
  }

  function restore(snap) {
    state.scores = { 1: snap.scores[1], 2: snap.scores[2] };
    playedSet = new Set(snap.played.filter(function (id) { return questionMap.has(id); }));
    state.played = Array.from(playedSet);
    state.turn = snap.turn === 2 ? 2 : 1;
  }

  function undoLast() {
    if (!lastSnapshot) return;
    window.clearTimeout(endTimer);
    endTimer = null;
    restore(lastSnapshot);
    lastSnapshot = null;
    ensureValidTurn();
    save();
    closeOverlay(endOverlay);
    renderAll();
    toastOpen('تم التراجع عن آخر إسناد.');
  }

  function award(answer) {
    if (!currentQuestion || !revealed) return;
    const q = currentQuestion;
    if (isPlayed(q)) return;

    const winner = answer === '1' ? 1 : answer === '2' ? 2 : 0;
    lastSnapshot = snapshot();

    if (winner) state.scores[winner] += q.points;
    playedSet.add(q.id);
    state.played = Array.from(playedSet);

    state.turn = nextTurn();
    save();

    finishQuestionView();
    setRoute(ROUTES.board, 'replace');
    renderAll();

    const message = winner
      ? 'أُضيفت ' + formatNumber(q.points) + ' نقطة إلى ' + state.names[winner] + ' — ' + q.doorName
      : 'لم تُمنح نقاط في سؤال ' + q.doorName;

    toastOpen(message);

    const status = gameStatus();
    if (status.over) {
      window.clearTimeout(endTimer);
      endTimer = window.setTimeout(showEnd, 520);
    }
  }

  /* ===== ١٣) نهاية اللعبة ===== */
  function showEnd() {
    const result = gameStatus();
    if (!result.over) {
      window.clearTimeout(endTimer);
      endTimer = null;
      return;
    }
    const names = state.names;

    toastClose();
    renderScoreboard();
    if (endUndoBtn) endUndoBtn.hidden = !lastSnapshot;

    endReason.textContent = result.reason === 'clinch'
      ? 'حسم مبكر — الفارق أكبر من النقاط المتبقية'
      : 'لُعبت كل أسئلة اللوحة';

    if (result.winner) {
      endTitle.textContent = 'الفائز: ' + names[result.winner];
    } else {
      endTitle.textContent = 'تعادل الفريقان';
    }

    endScores.replaceChildren();
    TEAM_KEYS.forEach(function (team) {
      const card = el('div', 'end__team');
      card.dataset.team = String(team);
      if (result.winner === team) card.classList.add('is-winner');

      const head = el('span', 'end__team-head');
      const iconBox = el('span', 'end__team-icon');
      iconBox.appendChild(makeIcon(state.icons[team]));
      head.appendChild(iconBox);
      head.appendChild(el('span', 'end__team-name', names[team]));
      card.appendChild(head);
      card.appendChild(el('span', 'end__team-score', formatNumber(state.scores[team])));
      endScores.appendChild(card);
    });

    const diff = Math.abs(state.scores[1] - state.scores[2]);
    if (result.reason === 'clinch') {
      endNote.textContent = 'الفارق ' + formatNumber(diff) + ' نقطة، والمتبقي على اللوحة ' +
        formatNumber(result.remaining) + ' نقطة فقط، لذا لا يمكن تعويض الفارق.';
    } else if (result.winner) {
      endNote.textContent = 'اكتملت كل أسئلة اللوحة بفارق ' + formatNumber(diff) + ' نقطة.';
    } else {
      endNote.textContent = 'اكتملت كل أسئلة اللوحة بالتعادل.';
    }

    openOverlay(endOverlay);
  }

  /* ===== ١٤) لعبة جديدة ===== */
  function resetProgress(options) {
    state.scores = { 1: 0, 2: 0 };
    playedSet = new Set();
    state.played = [];
    state.turn = 1;
    lastSnapshot = null;
    window.clearTimeout(endTimer);
    endTimer = null;
    closeOverlay(endOverlay);
    if (!options || options.save !== false) save();
  }

  async function newGame() {
    const confirmed = await askConfirm({
      title: 'لعبة جديدة',
      text: 'سيتم صفر النقاط وإعادة فتح كل الأبواب. أسماء الفريقين وأيقوناتهما ستبقى كما هي.',
      confirmLabel: 'ابدأ من جديد'
    });
    if (!confirmed) return;

    resetProgress({ save: false });
    drawNewBoard();
    save();
    ensureValidTurn();
    teamName1.value = state.names[1];
    teamName2.value = state.names[2];
    syncTeamNameLabels();
    renderAll();
    toastOpen('لعبة جديدة بتوزيع جديد — بالتوفيق للفريقين!');
  }

  /* ===== ١٥) تبديل الدور والانتقال ===== */
  function handleSwapTurn() {
    const status = gameStatus();
    if (status.over) {
      showEnd();
      return;
    }

    const target = other(state.turn);
    if (!allQuestions.some(function (q) { return canSelect(target, q); })) {
      toastOpen('لا توجد أسئلة متاحة لهذا الفريق الآن — أكمل السؤال الحالي.');
      return;
    }

    state.turn = target;
    save();
    renderAll();
    toastOpen('الدور الآن: ' + state.names[state.turn]);
  }

  function goHome() {
    if (currentQuestion) finishQuestionView();
    setRoute(ROUTES.home);
    updateHomeStatus();
    showScreen('home');
  }

  /* ===== ١٦) الأحداث ===== */
  function bindEvents() {
    $('#btnStart').addEventListener('click', openSetup);
    $('#btnHowTo').addEventListener('click', function () {
      openOverlay(helpOverlay, $('.dialog--help .btn--primary'));
    });

    boardEl.addEventListener('click', function (event) {
      const btn = event.target.closest('.qbtn');
      if (!btn || btn.disabled) return;
      const q = questionMap.get(btn.dataset.id);
      if (q) openQuestion(q);
    });

    $('#btnReveal').addEventListener('click', revealAnswer);

    stageAnswer.addEventListener('click', function (event) {
      const btn = event.target.closest('[data-award]');
      if (!btn) return;
      award(btn.dataset.award);
    });

    swapTurnBtn.addEventListener('click', handleSwapTurn);
    $('#btnHome').addEventListener('click', goHome);

    if (qBrandBtn && qBrandMenu) {
      qBrandBtn.addEventListener('click', function (event) {
        event.stopPropagation();
        toggleBrandMenu();
      });

      qBrandMenu.addEventListener('click', function (event) {
        const item = event.target.closest('[data-qmenu]');
        if (!item) return;
        handleBrandMenuAction(item.dataset.qmenu);
      });

      qBrandMenu.addEventListener('keydown', function (event) {
        const items = focusables(qBrandMenu);
        if (!items.length) return;
        const index = items.indexOf(document.activeElement);

        if (event.key === 'ArrowDown') {
          event.preventDefault();
          items[(index + 1) % items.length].focus();
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          items[(index - 1 + items.length) % items.length].focus();
        } else if (event.key === 'Home') {
          event.preventDefault();
          items[0].focus();
        } else if (event.key === 'End') {
          event.preventDefault();
          items[items.length - 1].focus();
        } else if (event.key === 'Tab') {
          closeBrandMenu(false);
        }
      });

      document.addEventListener('click', function (event) {
        if (qBrandMenu.hidden) return;
        if (qBrandMenu.contains(event.target) || qBrandBtn.contains(event.target)) return;
        closeBrandMenu(false);
      });
    }

    $('#btnHelp').addEventListener('click', function () {
      openOverlay(helpOverlay, $('.dialog--help .btn--primary'));
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-close-help]'), function (btn) {
      btn.addEventListener('click', function () { closeOverlay(helpOverlay); });
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-close-end]'), function (btn) {
      btn.addEventListener('click', function () { closeOverlay(endOverlay); });
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-close-setup]'), function (btn) {
      btn.addEventListener('click', function () { closeOverlay(setupOverlay); });
    });

    [setupIcons1, setupIcons2].forEach(function (grid, index) {
      const team = index === 0 ? 1 : 2;
      grid.addEventListener('click', function (event) {
        const btn = event.target.closest('[data-icon]');
        if (btn) selectSetupIcon(team, btn.dataset.icon);
      });
    });

    $('#btnSetupStart').addEventListener('click', startGameFromSetup);
    [setupName1, setupName2].forEach(function (input) {
      input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          startGameFromSetup();
        }
      });
    });

    $('#btnNewGame').addEventListener('click', newGame);
    $('#btnEndNewGame').addEventListener('click', newGame);
    if (endUndoBtn) endUndoBtn.addEventListener('click', undoLast);

    confirmYes.addEventListener('click', function () { resolveConfirm(true); });
    confirmNo.addEventListener('click', function () { resolveConfirm(false); });
    confirmOverlay.addEventListener('click', function (event) {
      if (event.target === confirmOverlay) resolveConfirm(false);
    });

    helpOverlay.addEventListener('click', function (event) {
      if (event.target === helpOverlay) closeOverlay(helpOverlay);
    });
    endOverlay.addEventListener('click', function (event) {
      if (event.target === endOverlay) closeOverlay(endOverlay);
    });
    setupOverlay.addEventListener('click', function (event) {
      if (event.target === setupOverlay) closeOverlay(setupOverlay);
    });

    /* أسماء الفريقين من لوحة النتائج */
    [[teamName1, 1], [teamName2, 2]].forEach(function (pair) {
      const input = pair[0];
      const team = pair[1];

      input.addEventListener('input', function () {
        state.names[team] = cleanName(input.value, team);
        save();
        syncTeamNameLabels();
        if (!gameStatus().over) {
          turnNameEl.textContent = state.names[state.turn];
        }
      });

      input.addEventListener('blur', function () {
        input.value = state.names[team];
        renderScoreboard();
        renderBoard();
      });

      input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          input.blur();
        }
      });
    });

    /* ملء الشاشة */
    const fullscreenBtn = $('#btnFullscreen');
    if (!document.documentElement.requestFullscreen) {
      fullscreenBtn.hidden = true;
    } else {
      fullscreenBtn.addEventListener('click', function () {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(function () {});
        } else {
          document.documentElement.requestFullscreen().catch(function () {});
        }
      });
      document.addEventListener('fullscreenchange', function () {
        fullscreenBtn.setAttribute('aria-pressed', document.fullscreenElement ? 'true' : 'false');
        fullscreenBtn.setAttribute('aria-label', document.fullscreenElement ? 'إنهاء ملء الشاشة' : 'ملء الشاشة');
      });
    }

    /* شعار المطور الاختياري */
    const devLogo = $('#devLogo');
    if (devLogo) {
      const wrap = devLogo.closest('.footer__avatar');
      devLogo.addEventListener('error', function () {
        if (wrap) wrap.classList.add('is-fallback');
        devLogo.remove();
      });
      if (devLogo.complete && devLogo.naturalWidth === 0) {
        if (wrap) wrap.classList.add('is-fallback');
        devLogo.remove();
      }
    }

    /* لوحة المفاتيح */
    document.addEventListener('keydown', function (event) {
      const top = topOverlay();

      if (event.key === 'Escape' && qBrandMenu && !qBrandMenu.hidden) {
        event.preventDefault();
        closeBrandMenu(true);
        return;
      }

      if (event.key === 'Escape') {
        if (top) {
          event.preventDefault();
          if (top === endOverlay) {
            closeOverlay(endOverlay);
          } else if (top === helpOverlay) {
            closeOverlay(helpOverlay);
          } else if (top === confirmOverlay) {
            resolveConfirm(false);
          } else if (top === setupOverlay) {
            closeOverlay(setupOverlay);
          }
          return;
        }
        if (currentScreen === 'question') {
          event.preventDefault();
          closeQuestion();
        }
        return;
      }

      if (event.key === 'Tab' && top) {
        const dialog = $('.dialog', top);
        if (!dialog) return;
        const list = focusables(dialog);
        if (!list.length) {
          event.preventDefault();
          dialog.focus();
          return;
        }
        const first = list[0];
        const last = list[list.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }

      if ((event.key === 'Enter' || event.key === ' ') && currentScreen === 'question' && currentQuestion && !revealed) {
        const active = document.activeElement;
        if (active === document.body || active === questionPage) {
          event.preventDefault();
          revealAnswer();
        }
      }
    });
  }

  /* ===== ١٧) تهيئة ===== */
  function validateData() {
    const seen = new Set();

    allQuestions.forEach(function (q) {
      if (!q.id || seen.has(q.id)) {
        console.warn('[جيم] معرّف سؤال مكرر أو ناقص في اللوحة الحالية:', q);
      }
      seen.add(q.id);
      if (!q.question || !q.answer) {
        console.warn('[جيم] سؤال بلا نص أو إجابة:', q.id);
      }
    });

    DOORS.forEach(function (door) {
      const expected = door.levels.length * SLOT_OWNERS.length;
      const list = doorQuestions.get(door.id) || [];
      if (list.length !== expected) {
        console.warn('[جيم] الباب «' + door.name + '» يحتوي ' + list.length +
          ' سؤالًا على اللوحة بدلًا من ' + expected + '.');
      }

      door.levels.forEach(function (points) {
        const pool = pools.get(door.id + '|' + points) || [];
        if (pool.length < SLOT_OWNERS.length) {
          console.warn('[جيم] الباب «' + door.name + '» يحتاج سؤالين على الأقل في مستوى ' +
            points + ' نقطة، والمتوفر ' + pool.length + '.');
        }
      });
    });

    console.info('[جيم] بنك الأسئلة: ' + bankQuestions.length + ' سؤالًا موزعة على ' +
      DOORS.length + ' أبواب، واللوحة تعرض ' + allQuestions.length + ' سؤالًا.');
  }

  function init() {
    if (!DOORS.length) {
      boardEl.innerHTML = '<p class="empty">لم يتم العثور على بيانات الأبواب. تأكد من تحميل ملفات مجلد data/.</p>';
      setRoute(ROUTES.home, 'replace');
      showScreen('home');
      return;
    }

    validateData();

    teamName1.value = state.names[1];
    teamName2.value = state.names[2];
    setupName1.value = state.names[1];
    setupName2.value = state.names[2];
    setupDraftIcons = { 1: state.icons[1], 2: state.icons[2] };
    syncTeamNameLabels();
    renderSetupIcons();

    score1El.dataset.value = String(state.scores[1]);
    score2El.dataset.value = String(state.scores[2]);
    score1El.textContent = formatNumber(state.scores[1]);
    score2El.textContent = formatNumber(state.scores[2]);

    ensureValidTurn();
    bindEvents();
    window.addEventListener('popstate', applyRoute);
    window.addEventListener('hashchange', applyRoute);
    renderAll();
    applyRoute();

    /* بعد تحديث بنك الأسئلة: نُبلغ المذيع بأن اللوحة أُعيد توزيعها */
    if (migrated) {
      window.setTimeout(function () {
        toastOpen('تم تحديث بنك الأسئلة وتوزيع لوحة جديدة تلقائيًا.');
      }, 500);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
