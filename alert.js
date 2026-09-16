window.CareAlert = (function () {
  var ctx = null;
  var seen = {};
  var lastItems = [];

  function typeIcon(type) {
    type = type || '';
    if (type.indexOf('紧急') >= 0) return '🚨';
    if (type.indexOf('痛') >= 0 || type.indexOf('疼') >= 0) return '😣';
    if (type.indexOf('喝水') >= 0) return '💧';
    if (type.indexOf('翻身') >= 0) return '🔄';
    if (type.indexOf('冷') >= 0 || type.indexOf('热') >= 0) return '🌡️';
    if (type.indexOf('便') >= 0 || type.indexOf('如厕') >= 0) return '🚽';
    if (type.indexOf('胃管') >= 0) return '🩺';
    if (type.indexOf('家人') >= 0) return '👨‍👩‍👧';
    return '📢';
  }

  function enable() {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      if (window.Notification && Notification.permission === 'default') Notification.requestPermission();
      var b = document.getElementById('enableAlert');
      if (b) { b.innerText = '声音已开启'; b.style.background = '#2e7d32'; }
      beep();
      check(lastItems, true);
    } catch (e) {
      alert('声音开启失败，请再点一次');
    }
  }

  function beep() {
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    var now = ctx.currentTime;
    [0, 0.4, 0.8, 1.2].forEach(function (off) {
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.type = 'square';
      o.frequency.value = off % 0.8 === 0 ? 880 : 620;
      g.gain.setValueAtTime(0.0001, now + off);
      g.gain.exponentialRampToValueAtTime(0.28, now + off + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + off + 0.3);
      o.connect(g); g.connect(ctx.destination);
      o.start(now + off); o.stop(now + off + 0.32);
    });
    if (navigator.vibrate) navigator.vibrate([400, 100, 400, 100, 600]);
  }

  function showOverlay(need) {
    var old = document.getElementById('alertOverlay');
    if (old) old.remove();
    var el = document.createElement('div');
    el.id = 'alertOverlay';
    el.style.cssText = 'position:fixed;inset:0;background:#b71c1c;color:#fff;z-index:99;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;';
    el.innerHTML = '<div style="font-size:96px;line-height:1;">' + typeIcon(need.type) + '</div>' +
      '<div style="font-size:28px;font-weight:700;margin:16px 0 8px;">' + (need.elder_name || '老人') + '</div>' +
      '<div style="font-size:32px;font-weight:700;">' + (need.type || '新需求') + '</div>' +
      '<div style="margin-top:16px;">请马上查看</div>' +
      '<button id="closeAlert" style="margin-top:28px;padding:14px 28px;font-size:18px;border:none;border-radius:12px;background:#fff;color:#c62828;">知道了</button>';
    document.body.appendChild(el);
    document.getElementById('closeAlert').onclick = function () { el.remove(); };
  }

  function notifyNew(need) {
    showOverlay(need);
    beep();
    if (window.Notification && Notification.permission === 'granted') {
      try { new Notification((need.elder_name || '老人') + '需要帮助', { body: need.type || '新需求' }); } catch (e) {}
    }
  }

  function check(items, forceRecent) {
    lastItems = items || [];
    var now = Date.now();
    lastItems.filter(function (n) { return n.status === 'pending'; }).forEach(function (n) {
      var key = n.id || String(n.created_at);
      var recent = !n.created_at || (now - n.created_at < 10 * 60 * 1000);
      if (!seen[key] && (forceRecent ? recent : true)) {
        if (forceRecent && !recent) { seen[key] = true; return; }
        seen[key] = true;
        if (forceRecent || recent) notifyNew(n);
      } else if (!seen[key]) {
        seen[key] = true;
      }
    });
  }

  return { enable: enable, check: check, typeIcon: typeIcon };
})();
