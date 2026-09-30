/* Công cụ 01 — Giao diện. Câu trả lời và kết quả CHỈ nằm trong bộ nhớ trang (biến JS):
   không localStorage, không sessionStorage, không cookie, không IndexedDB, không gửi mạng, không đưa vào URL,
   không gọi analytics. Tải lại trang là mất. */
(function () {
  "use strict";
  var CFG = window.VSHTool01Config, S = window.VSHTool01Scoring, R = window.VSHTool01Results, Q = window.VSHTool01Questionnaire;
  var GROUP = 5;
  var $ = function (id) { return document.getElementById(id); };
  var el = function (tag, text, cls) { var e = document.createElement(tag); if (text != null) e.textContent = text; if (cls) e.className = cls; return e; };
  var fmt = function (x) { return (Math.round(x * 10) / 10).toFixed(1).replace(".", ","); };
  var today = function () { var d = new Date(); return ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear(); };

  function isLocalDemo() {
    return (location.hostname === "localhost" || location.hostname === "127.0.0.1") && /(^|[?&])demo=1(&|$)/.test(location.search.slice(1));
  }
  function loadFixture(cb) {
    // Chỉ chạy trên máy lập trình viên. Thư mục tests không được deploy nên trên site thật file này không tồn tại.
    var s = document.createElement("script");
    s.src = "/cong-cu/tests/fixtures/tool01-synthetic-items.TEST-FIXTURE.js";
    s.onload = function () { cb(window.VSHTool01Fixture || null); };
    s.onerror = function () { cb(null); };
    document.head.appendChild(s);
  }

  function start(source, demo) {
    var items = source.ITEMS, scale = source.SCALE;
    var answers = {};           // chỉ trong bộ nhớ
    var page = 0, pages = Math.ceil(items.length / GROUP);
    $("t01-locked").hidden = true;
    $("t01-app").hidden = false;
    $("t01-demo-banner").hidden = !demo;
    $("t01-review-banner").hidden = CFG.medicalContentReviewed;

    $("t01-begin").addEventListener("click", function () {
      var err = $("t01-elig-err");
      if (!$("t01-age").checked || !$("t01-ack").checked) {
        err.textContent = "Vui lòng xác nhận bạn từ 18 tuổi trở lên và đã đọc lưu ý trước khi bắt đầu.";
        err.hidden = false;
        return;
      }
      err.hidden = true;
      $("t01-elig").hidden = true;
      $("t01-assess").hidden = false;
      render();
    });

    function render() {
      var box = $("t01-questions");
      box.textContent = "";
      var slice = items.slice(page * GROUP, page * GROUP + GROUP);
      slice.forEach(function (it, i) {
        var fs = el("fieldset");
        var lg = el("legend", (page * GROUP + i + 1) + ". " + it.text);
        lg.id = "t01-lg-" + it.id;
        fs.appendChild(lg);
        var opts = el("div", null, "opts col");
        for (var v = CFG.answerMin; v <= CFG.answerMax; v++) {
          var lab = el("label", null, "opt");
          var inp = document.createElement("input");
          inp.type = "radio"; inp.name = it.id; inp.value = String(v);
          if (answers[it.id] === v) inp.checked = true;
          inp.addEventListener("change", function (e) { answers[e.target.name] = Number(e.target.value); });
          lab.appendChild(inp);
          lab.appendChild(document.createTextNode(" " + (scale ? scale[v - 1] : "Mức " + v)));
          opts.appendChild(lab);
        }
        fs.appendChild(opts);
        box.appendChild(fs);
      });
      var done = Object.keys(answers).length;
      $("t01-progress").max = items.length;
      $("t01-progress").value = done;
      $("t01-progress-text").textContent = "Phần " + (page + 1) + "/" + pages + " · đã trả lời " + done + "/" + items.length + " câu";
      $("t01-back").hidden = page === 0;
      $("t01-next").textContent = page === pages - 1 ? "Xem kết quả" : "Tiếp";
      $("t01-q-err").hidden = true;
      $("t01-assess-title").focus();
    }
    $("t01-back").addEventListener("click", function () { if (page > 0) { page--; render(); } });
    $("t01-next").addEventListener("click", function () {
      var slice = items.slice(page * GROUP, page * GROUP + GROUP);
      var missing = slice.filter(function (it) { return !S.isValidAnswer(answers[it.id]); });
      if (missing.length) {
        var err = $("t01-q-err");
        err.textContent = "Còn " + missing.length + " câu trong phần này chưa trả lời.";
        err.hidden = false;
        var first = document.querySelector('input[name="' + missing[0].id + '"]');
        if (first) first.focus();
        return;
      }
      if (page < pages - 1) { page++; render(); return; }
      finish();
    });

    function finish() {
      var r = S.assess(items.map(function (it) { return { id: it.id, constitution: it.constitution, reverse: it.reverse, answer: answers[it.id] }; }));
      if (!r.ok) { var err = $("t01-q-err"); err.textContent = "Không tính được kết quả. Vui lòng kiểm tra lại các câu trả lời."; err.hidden = false; return; }
      var cls = r.classification;
      $("t01-assess").hidden = true;
      var res = $("t01-result");
      res.hidden = false;
      $("t01-headline").textContent = R.headline(cls);
      var gl = R.groupList(cls), lb = $("t01-list-box"), ul = $("t01-list");
      lb.hidden = !gl; ul.textContent = "";
      $("t01-list-title").textContent = gl ? gl.title : "";
      if (gl) gl.items.forEach(function (t) { ul.appendChild(el("li", t)); });
      var keys = R.contentKeys(cls), box = $("t01-groups");
      box.textContent = "";
      if (keys.length) keys.forEach(function (k) {
        var sec = el("div", null, "r-block");
        sec.appendChild(el("h3", R.RESULTS[k].name));
        sec.appendChild(el("p", R.RESULTS[k].about));
        sec.appendChild(el("p", "Gợi ý lối sống chung:", "r-label"));
        var g = el("ul"); R.RESULTS[k].guidance.forEach(function (t) { g.appendChild(el("li", t)); }); sec.appendChild(g);
        box.appendChild(sec);
      });
      else {
        var sec0 = el("div", null, "r-block");
        sec0.appendChild(el("p", "Gợi ý lối sống chung:", "r-label"));
        var g0 = el("ul"); R.GENERAL.forEach(function (t) { g0.appendChild(el("li", t)); }); sec0.appendChild(g0);
        box.appendChild(sec0);
      }
      var tb = $("t01-scores"); tb.textContent = "";
      CFG.constitutions.forEach(function (c) {
        var tr = el("tr");
        var b = cls.biased.filter(function (x) { return x.constitution === c; })[0];
        var lv = c === "balanced" ? (cls.balanced === "no" ? "—" : R.LEVEL[cls.balanced]) : b.level === "below" ? "—" : R.LEVEL[b.level];
        tr.appendChild(el("td", R.RESULTS[c].name)); tr.appendChild(el("td", fmt(r.scores[c]))); tr.appendChild(el("td", lv));
        tb.appendChild(tr);
      });
      // bản in
      $("t01-s-date").textContent = "Ngày tạo (trên máy của bạn): " + today() + (demo ? " · BẢN THỬ NGHIỆM, câu hỏi giả" : "");
      $("t01-s-result").textContent = "Kết quả: " + R.headline(cls) + (gl ? " " + gl.title + " " + gl.items.join("; ") + "." : "");
      $("t01-s-scores").textContent = "Điểm (0–100): " + CFG.constitutions.map(function (c) { return R.RESULTS[c].name + " " + fmt(r.scores[c]); }).join(" · ") + ".";
      $("t01-s-groups").textContent = keys.map(function (k) { return R.RESULTS[k].name + ": " + R.RESULTS[k].about; }).join(" ");
      res.focus();
    }

    $("t01-print").addEventListener("click", function () { window.print(); });
    $("t01-restart").addEventListener("click", function () {
      answers = {}; page = 0;
      $("t01-result").hidden = true; $("t01-elig").hidden = false;
      $("t01-age").checked = false; $("t01-ack").checked = false;
      $("t01-elig").scrollIntoView({ block: "start" });
    });
    window.addEventListener("beforeprint", function () {
      if ($("t01-result").hidden) return;
      var root = $("print-root") || document.body.appendChild(el("div"));
      root.id = "print-root";
      var box = $("print-summary").cloneNode(true);
      box.removeAttribute("id");
      Array.prototype.forEach.call(box.querySelectorAll("[id]"), function (n) { n.removeAttribute("id"); });
      root.textContent = "";
      root.appendChild(box);
      document.documentElement.classList.add("has-print-root");
    });
    window.addEventListener("afterprint", function () { document.documentElement.classList.remove("has-print-root"); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!CFG || !S || !R || !Q) return;
    // CỔNG: bài tự đánh giá thật chỉ mở khi cả quyền sử dụng lẫn duyệt y khoa đã được con người xác nhận.
    if (CFG.publicAssessmentEnabled && Q.licensed && Q.ITEMS.length) { start(Q, false); return; }
    if (isLocalDemo()) loadFixture(function (fx) { if (fx) start(fx, true); });
    // Còn lại: giữ nguyên thông báo khóa (#t01-locked) có sẵn trong HTML.
  });
})();
