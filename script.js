/* ============================================================
   جيم — مسابقة الأبواب الخمسة
   منطق اللعبة (Vanilla JS، بلا أي خادم)
   ============================================================ */
(function () {
  'use strict';

  /* ===== ١) البيانات ===== */
  const DOORS = Array.isArray(window.JEEM_DOORS) ? window.JEEM_DOORS.slice() : [];
  const STORAGE_KEY = 'jeem.quiz.state.v1';
  const TEAM_KEYS = [1, 2];
  const DEFAULT_NAMES = { 1: 'الفريق الأول', 2: 'الفريق الثاني' };

  const allQuestions = [];
  const questionMap = new Map();
  const doorQuestions = new Map();
  const slotMap = new Map();

  DOORS.forEach(function (door) {
    door.levels = Array.isArray(door.levels) && door.levels.length ? door.levels : [100, 200, 300];
    door.questions = Array.isArray(door.questions) ? door.questions : [];

    door.questions.forEach(function (q) {
      q.doorId = door.id;
      q.doorName = door.name;
      q.points = Number(q.points) || 0;
      q.owner = Number(q.owner) === 2 ? 2 : 1;
      allQuestions.push(q);
      questionMap.set(q.id, q);
      slotMap.set(door.id + '|' + q.points + '|' + q.owner, q);
    });

    doorQuestions.set(
      door.id,
      door.questions.slice().sort(function (a, b) {
        return a.points - b.points || a.owner - b.owner;
      })
    );
  });

  const TOTAL_QUESTIONS = allQuestions.length;
  const TOTAL_PER_TEAM = allQuestions.filter(function (q) { return q.owner === 1; }).length;
  const FULL_BOARD_POINTS = allQuestions.reduce(function (sum, q) { return sum + q.points; }, 0);

  /* ===== ٢) الحالة ===== */
  function defaultState() {
    return {
      v: 1,
      names: Object.assign({}, DEFAULT_NAMES),
      scores: { 1: 0, 2: 0 },
      played: [],
      turn: 1
    };
  }

  function cleanName(value, team) {
    const name = String(value == null ? '' : value).replace(/\s+/g, ' ').trim().slice(0, 20);
    return name || DEFAULT_NAMES[team];
  }

  function loadState() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;

      const next = defaultState();
      next.names[1] = cleanName(parsed.names && parsed.names[1], 1);
      next.names[2] = cleanName(parsed.names && parsed.names[2], 2);
      next.scores[1] = Math.max(0, Math.floor(Number(parsed.scores && parsed.scores[1]) || 0));
      next.scores[2] = Math.max(0, Math.floor(Number(parsed.scores && parsed.scores[2]) || 0));
      next.turn = Number(parsed.turn) === 2 ? 2 : 1;

      const seen = new Set();
      (Array.isArray(parsed.played) ? parsed.played : []).forEach(function (id) {
        if (questionMap.has(id) && !seen.has(id)) {
          seen.add(id);
          next.played.push(id);
        }
      });

      /* حماية من ملف محفوظ غير متوافق مع بيانات معدّلة لاحقًا */
      if (next.scores[1] + next.scores[2] > FULL_BOARD_POINTS) {
        next.scores[1] = 0;
        next.scores[2] = 0;
        next.played = [];
      }

      return next;
    } catch (err) {
      return null;
    }
  }

  let state = loadState() || defaultState();
  let playedSet = new Set(state.played);
  let lastSnapshot = null;

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

  const boardEl = $('#board');
  const score1El = $('#score1');
  const score2El = $('#score2');
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

  const questionOverlay = $('#questionOverlay');
  const questionDialog = $('.dialog--question', questionOverlay);
  const qDoor = $('#qDoor');
  const qPoints = $('#qPoints');
  const qOwner = $('#qOwner');
  const qText = $('#qText');
  const qMedia = $('#qMedia');
  const qNote = $('#qNote');
  const answerBlock = $('#answerBlock');
  const aText = $('#aText');
  const stageQuestion = $('#stageQuestion');
  const stageAnswer = $('#stageAnswer');
  const awardPts1 = $('#awardPts1');
  const awardPts2 = $('#awardPts2');

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
  const toastAction = $('#toastAction');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SVG_NS = 'http://www.w3.org/2000/svg';

  let currentQuestion = null;
  let revealed = false;
  let toastTimer = null;
  let endTimer = null;
  let confirmResolve = null;
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

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function formatNumber(value) {
    return Number(value || 0).toLocaleString('en-US');
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

  function toastOpen(message, options) {
    const opts = options || {};
    toastText.textContent = message;

    if (opts.action && typeof opts.action === 'function') {
      toastAction.hidden = false;
      toastAction.textContent = opts.actionLabel || 'تراجع';
      toastAction.onclick = function () {
        toastClose();
        opts.action();
      };
    } else {
      toastAction.hidden = true;
      toastAction.onclick = null;
    }

    window.clearTimeout(toastTimer);
    toastEl.hidden = false;
    requestAnimationFrame(function () {
      toastEl.classList.add('is-open');
    });
    toastTimer = window.setTimeout(toastClose, opts.action ? 6500 : 3800);
  }

  function toastClose() {
    window.clearTimeout(toastTimer);
    toastEl.classList.remove('is-open');
    window.setTimeout(function () {
      if (!toastEl.classList.contains('is-open')) toastEl.hidden = true;
    }, 200);
  }

  /* ===== ٦) النوافذ ===== */
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
  function renderScoreboard() {
    const status = gameStatus();

    animateScore(score1El, state.scores[1]);
    animateScore(score2El, state.scores[2]);

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

          const teamDot = el('span', 'qbtn__team', owner === 1 ? '١' : '٢');
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

  /* ===== ١٠) نافذة السؤال ===== */
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

    const body = $('#qBody');
    if (body) body.scrollTop = 0;

    openOverlay(questionOverlay, questionDialog);
  }

  function revealAnswer() {
    if (!currentQuestion || revealed) return;
    revealed = true;
    aText.textContent = currentQuestion.answer;
    answerBlock.hidden = false;
    stageQuestion.hidden = true;
    stageAnswer.hidden = false;

    const body = $('#qBody');
    if (body) {
      requestAnimationFrame(function () {
        body.scrollTo({ top: body.scrollHeight, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    }
    window.setTimeout(function () {
      if (questionDialog) questionDialog.focus({ preventScroll: true });
    }, 30);
  }

  function closeQuestion() {
    closeOverlay(questionOverlay);
    currentQuestion = null;
    revealed = false;
  }

  /* ===== ١١) الإسناد والتراجع ===== */
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

    closeQuestion();
    renderAll();

    const message = winner
      ? 'أُضيفت ' + formatNumber(q.points) + ' نقطة إلى ' + state.names[winner] + ' — ' + q.doorName
      : 'لم تُمنح نقاط في سؤال ' + q.doorName;

    toastOpen(message, { action: undoLast, actionLabel: 'تراجع' });

    const status = gameStatus();
    if (status.over) {
      window.clearTimeout(endTimer);
      endTimer = window.setTimeout(showEnd, 520);
    }
  }

  /* ===== ١٢) نهاية اللعبة ===== */
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
      card.appendChild(el('span', 'end__team-name', names[team]));
      card.appendChild(el('span', 'end__team-score', formatNumber(state.scores[team])));
      endScores.appendChild(card);
    });

    const diff = Math.abs(state.scores[1] - state.scores[2]);
    if (result.reason === 'clinch') {
      endNote.textContent = 'الفارق ' + formatNumber(diff) + ' نقطة، والمتبقي على اللوحة ' +
        formatNumber(result.remaining) + ' نقطة فقط، لذا لا يمكن تعويض الفارق.';
    } else if (result.winner) {
      endNote.textContent = 'اكتملت الأسئلة الستة في الأبواب الخمسة بفارق ' + formatNumber(diff) + ' نقطة.';
    } else {
      endNote.textContent = 'اكتملت الأسئلة الستة في الأبواب الخمسة بالتعادل.';
    }

    openOverlay(endOverlay);
  }

  /* ===== ١٣) لعبة جديدة ===== */
  async function newGame() {
    const confirmed = await askConfirm({
      title: 'لعبة جديدة',
      text: 'سيتم صفر النقاط وإعادة فتح كل الأبواب. أسماء الفريقين ستبقى كما هي.',
      confirmLabel: 'ابدأ من جديد'
    });
    if (!confirmed) return;

    const names = { 1: state.names[1], 2: state.names[2] };
    state = defaultState();
    state.names = names;
    playedSet = new Set();
    lastSnapshot = null;
    window.clearTimeout(endTimer);
    endTimer = null;
    save();
    closeOverlay(endOverlay);
    closeOverlay(questionOverlay);
    syncTeamNameLabels();
    renderAll();
    toastOpen('لعبة جديدة جاهزة — بالتوفيق للفريقين!');
  }

  /* ===== ١٤) تبديل الدور ===== */
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

  /* ===== ١٥) الأحداث ===== */
  function bindEvents() {
    boardEl.addEventListener('click', function (event) {
      const btn = event.target.closest('.qbtn');
      if (!btn || btn.disabled) return;
      const q = questionMap.get(btn.dataset.id);
      if (q) openQuestion(q);
    });

    $('#btnReveal').addEventListener('click', revealAnswer);

    $('#btnCancel').addEventListener('click', closeQuestion);
    $('#qClose').addEventListener('click', closeQuestion);

    stageAnswer.addEventListener('click', function (event) {
      const btn = event.target.closest('[data-award]');
      if (!btn) return;
      award(btn.dataset.award);
    });

    swapTurnBtn.addEventListener('click', handleSwapTurn);

    $('#btnHelp').addEventListener('click', function () {
      openOverlay(helpOverlay, $('.dialog--help .btn--primary'));
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-close-help]'), function (btn) {
      btn.addEventListener('click', function () { closeOverlay(helpOverlay); });
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-close-end]'), function (btn) {
      btn.addEventListener('click', function () { closeOverlay(endOverlay); });
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

    /* أسماء الفريقين */
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

      if (event.key === 'Escape') {
        if (!top) return;
        event.preventDefault();
        if (top === questionOverlay) {
          closeQuestion();
        } else if (top === endOverlay) {
          closeOverlay(endOverlay);
        } else if (top === helpOverlay) {
          closeOverlay(helpOverlay);
        } else if (top === confirmOverlay) {
          resolveConfirm(false);
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

      if ((event.key === 'Enter' || event.key === ' ') && top === questionOverlay && currentQuestion && !revealed) {
        const active = document.activeElement;
        if (active === questionDialog || active === document.body) {
          event.preventDefault();
          revealAnswer();
        }
      }
    });

    /* حفظ إضافي عند إغلاق الصفحة */
    window.addEventListener('beforeunload', save);
  }

  /* ===== ١٦) تهيئة ===== */
  function validateData() {
    const seen = new Set();
    allQuestions.forEach(function (q) {
      if (!q.id || seen.has(q.id)) {
        console.warn('[جيم] معرّف سؤال مكرر أو ناقص:', q);
      }
      seen.add(q.id);
      if (!q.question || !q.answer) {
        console.warn('[جيم] سؤال بلا نص أو إجابة:', q.id);
      }
    });
    DOORS.forEach(function (door) {
      const list = doorQuestions.get(door.id) || [];
      if (list.length !== 6) {
        console.warn('[جيم] الباب «' + door.name + '» يحتوي ' + list.length + ' أسئلة بدلًا من ٦.');
      }
    });
  }

  function init() {
    if (!DOORS.length) {
      boardEl.innerHTML = '<p class="empty">لم يتم العثور على بيانات الأبواب. تأكد من تحميل ملفات مجلد data/.</p>';
      return;
    }

    validateData();

    teamName1.value = state.names[1];
    teamName2.value = state.names[2];
    syncTeamNameLabels();
    score1El.dataset.value = String(state.scores[1]);
    score2El.dataset.value = String(state.scores[2]);
    score1El.textContent = formatNumber(state.scores[1]);
    score2El.textContent = formatNumber(state.scores[2]);

    if (questionDialog) questionDialog.tabIndex = -1;

    ensureValidTurn();
    bindEvents();
    renderAll();

    /* نافذة الترحيب للفتح الأول فقط */
    try {
      const welcomed = window.localStorage.getItem(STORAGE_KEY + '.welcomed');
      if (!welcomed) {
        window.localStorage.setItem(STORAGE_KEY + '.welcomed', '1');
        openOverlay(helpOverlay, $('.dialog--help .btn--primary'));
      }
    } catch (err) { /* تجاهل */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
