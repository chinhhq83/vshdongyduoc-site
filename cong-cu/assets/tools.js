/* Bộ công cụ tự đánh giá — phần giao diện (DOM). Logic tính điểm nằm trong bmi.js và findrisc.js.
   Dữ liệu chỉ lưu trên máy người dùng: localStorage "vsh.tool.<id>.history" (tối đa 12 lần/công cụ),
   sessionStorage "vsh.tool.bridge" để chuyển số đo từ công cụ 03 sang 02. Không gửi số đo đi đâu. */
(function () {
  "use strict";
  var PREFIX = "vsh.tool.";
  var MAX = 12;
  var $ = function (sel, el) { return (el || document).querySelector(sel); };
  var $$ = function (sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); };

  function today() {
    var d = new Date();
    return ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear();
  }
  function num(v) {
    if (v === null || v === undefined) return NaN;
    return Number(String(v).replace(",", "."));
  }
  function el(tag, text, cls) {
    var e = document.createElement(tag);
    if (text !== undefined && text !== null) e.textContent = text;
    if (cls) e.className = cls;
    return e;
  }

  // ---------- lịch sử
  var history = {
    load: function (id) { try { return JSON.parse(localStorage.getItem(PREFIX + id + ".history") || "[]"); } catch (e) { return []; } },
    save: function (id, entry) {
      var list = history.load(id);
      list.push(entry);
      try { localStorage.setItem(PREFIX + id + ".history", JSON.stringify(list.slice(-MAX))); return true; } catch (e) { return false; }
    },
    clear: function (id) { try { localStorage.removeItem(PREFIX + id + ".history"); } catch (e) {} },
  };
  function renderHistory(id, cols) {
    var box = $("#history");
    if (!box) return;
    var list = history.load(id);
    box.hidden = list.length === 0;
    var tb = $("#history tbody");
    tb.textContent = "";
    list.slice().reverse().forEach(function (r) {
      var tr = document.createElement("tr");
      [r.date].concat(cols.map(function (c) { return r[c] === undefined || r[c] === null || r[c] === "" ? "—" : r[c]; })).forEach(function (v) { tr.appendChild(el("td", String(v))); });
      tb.appendChild(tr);
    });
  }

  // ---------- cầu nối 03 -> 02
  var bridge = {
    set: function (data) { try { sessionStorage.setItem(PREFIX + "bridge", JSON.stringify(data)); } catch (e) {} },
    get: function () { try { return JSON.parse(sessionStorage.getItem(PREFIX + "bridge") || "null"); } catch (e) { return null; } },
  };

  // ---------- bản tóm tắt
  function summaryText() {
    var box = $("#print-summary");
    var lines = [];
    $$("[data-line]", box).forEach(function (n) {
      if (n.hidden) return;
      var t = n.textContent.replace(/\s+/g, " ").trim();
      if (t) lines.push(t);
    });
    return lines.join("\n");
  }
  function wireSummary(toolCode) {
    var copyBtn = $("#copy-summary");
    copyBtn.addEventListener("click", function () {
      var text = summaryText();
      var done = function () { copyBtn.textContent = "Đã sao chép"; setTimeout(function () { copyBtn.textContent = "Sao chép tóm tắt"; }, 2000); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else fallback();
      function fallback() {
        var ta = $("#summary-fallback");
        ta.hidden = false;
        ta.value = text;
        ta.focus();
        ta.select();
      }
    });
    $("#print-btn").addEventListener("click", function () { window.print(); });
    // Khi in (nút In hoặc Ctrl+P): chép tóm tắt ra một khối ngay dưới <body>, CSS in chỉ hiện khối đó.
    window.addEventListener("beforeprint", function () {
      if ($("#result").hidden) return;
      var root = document.getElementById("print-root") || document.body.appendChild(document.createElement("div"));
      root.id = "print-root";
      var box = $("#print-summary").cloneNode(true);
      box.removeAttribute("id");
      $$("[id]", box).forEach(function (n) { n.removeAttribute("id"); });
      $$("[hidden]", box).forEach(function (n) { n.parentNode.removeChild(n); });
      root.innerHTML = "";
      root.appendChild(box);
      document.documentElement.classList.add("has-print-root");
    });
    window.addEventListener("afterprint", function () {
      document.documentElement.classList.remove("has-print-root");
    });
    $("#download-btn").addEventListener("click", function () {
      var box = $("#print-summary").cloneNode(true);
      $$("[hidden]", box).forEach(function (n) { n.parentNode.removeChild(n); });
      var html = "<!DOCTYPE html><html lang=\"vi\"><head><meta charset=\"UTF-8\"><title>Tóm tắt tự đánh giá — " + toolCode + "</title>" +
        "<style>body{font:15px/1.55 system-ui,sans-serif;color:#222;max-width:720px;margin:24px auto;padding:0 16px}h2{font-size:19px}.notes div{border-bottom:1px solid #999;height:28px}</style></head><body>" +
        box.innerHTML + "</body></html>";
      var a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([html], { type: "text/html" }));
      a.download = "tom-tat-" + toolCode.toLowerCase() + "-" + today().replace(/\//g, "-") + ".html";
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    });
  }
  function setLine(id, text) {
    var n = document.getElementById(id);
    if (!n) return;
    n.hidden = !text;
    n.textContent = text || "";
  }
  function fill(listEl, lines) {
    listEl.textContent = "";
    lines.filter(Boolean).forEach(function (t) { listEl.appendChild(el("p", t)); });
  }
  function showResult() {
    var res = $("#result");
    var first = res.hidden;
    res.hidden = false;
    if (first) res.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function radio(form, name) {
    var r = form.querySelector('input[name="' + name + '"]:checked');
    return r ? r.value : null;
  }

  // ---------- công cụ 03
  function initBmi() {
    var form = $("#tool-form");
    var B = window.VSHBmi;
    form.hidden = false;
    wireSummary("VSH-03");
    renderHistory("bmi", ["bmi", "nhom", "eo"]);
    var last = null;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var a = {
        sex: radio(form, "sex"),
        heightCm: num(form.height.value),
        weightKg: num(form.weight.value),
        waistCm: num(form.waist.value),
        age: form.age.value === "" ? null : num(form.age.value),
        pregnant: form.pregnant.checked,
      };
      var r = B.evaluate(a);
      var stop = $("#stop-msg");
      if (!r.ok) {
        $("#result").hidden = true;
        stop.hidden = false;
        stop.textContent = r.message;
        stop.focus();
        return;
      }
      stop.hidden = true;
      $("#r-main").textContent = r.main;
      fill($("#r-next"), [r.next]);
      $("#r-waist").textContent = r.waistText;
      setLine("r-muscle", r.muscleNote);
      $("#r-range").textContent = "Khoảng cân tham chiếu với chiều cao của bạn (BMI 18,5 đến 22,9): " + B.fmt(r.range.low) + " – " + B.fmt(r.range.high) + " kg. Đây là hai mốc tham chiếu, không phải một cân nặng lý tưởng.";
      // Đỏ: nhóm mà disclaimer khuyên đến cơ sở y tế (BMI ≥ 25 châu Á). Hổ phách: thừa cân, thiếu cân, hoặc vòng eo vượt mốc.
      var red = r.group.key === "bp1" || r.group.key === "bp2";
      $("#result").classList.toggle("is-red", red);
      $("#result").classList.toggle("is-amber", !red && (r.group.key === "thua" || r.group.key === "thieu" || r.waistHigh === true));

      // tóm tắt
      $("#s-date").textContent = "Ngày tạo: " + today();
      $("#s-input").textContent = "Số liệu đã nhập: " + (a.sex === "nam" ? "Nam" : "Nữ") + (a.age ? ", " + a.age + " tuổi" : "") + ", cao " + B.fmt(a.heightCm) + " cm, nặng " + B.fmt(a.weightKg) + " kg" + (r.waist ? ", vòng eo " + B.fmt(r.waist) + " cm" : ", chưa nhập vòng eo") + ".";
      $("#s-result").textContent = "Kết quả: BMI " + B.fmt(r.bmi) + " kg/m² — " + r.group.label + " (bảng QĐ 2892/QĐ-BYT)." + (r.waist ? (r.waistHigh ? " Vòng eo thuộc mức vòng bụng tăng (nam ≥ 90 cm, nữ ≥ 80 cm)." : " Vòng eo chưa đạt mốc vòng bụng tăng.") : "");
      showResult();

      last = { date: today(), bmi: B.fmt(r.bmi), nhom: r.group.label, eo: r.waist ? B.fmt(r.waist) + " cm" : "" };
      bridge.set({ from: "bmi", sex: a.sex, age: a.age, heightCm: a.heightCm, weightKg: a.weightKg, bmi: r.bmi, waistCm: r.waist });
    });
    $("#save-btn").addEventListener("click", function () {
      if (!last) return;
      $("#save-note").textContent = history.save("bmi", last) ? "Đã lưu trên máy này." : "Trình duyệt đang chặn lưu trữ.";
      renderHistory("bmi", ["bmi", "nhom", "eo"]);
    });
    $("#clear-history").addEventListener("click", function () { history.clear("bmi"); renderHistory("bmi", ["bmi", "nhom", "eo"]); });
  }

  // ---------- công cụ 02
  function initFindrisc() {
    var form = $("#tool-form");
    var F = window.VSHFindrisc;
    form.hidden = false;
    wireSummary("VSH-02");
    renderHistory("findrisc", ["diem", "nhom"]);
    var last = null;

    var br = bridge.get();
    if (br && br.from === "bmi") {
      if (br.sex) form.querySelector('input[name="sex"][value="' + br.sex + '"]').checked = true;
      if (br.age) form.age.value = br.age;
      if (br.heightCm) form.height.value = br.heightCm;
      if (br.weightKg) form.weight.value = br.weightKg;
      if (br.waistCm) form.waist.value = br.waistCm;
      $("#bridge-note").hidden = false;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var yes = function (n) { var v = radio(form, n); return v === null ? null : v === "co"; };
      var a = {
        diagnosed: form.diagnosed.checked,
        sex: radio(form, "sex"),
        age: num(form.age.value),
        heightCm: num(form.height.value),
        weightKg: num(form.weight.value),
        waistCm: num(form.waist.value),
        active: yes("active"),
        vegDaily: yes("veg"),
        bpMeds: yes("bp"),
        highGlucose: yes("glucose"),
        family: radio(form, "family"),
      };
      var r = F.evaluate(a);
      var stop = $("#stop-msg");
      if (!r.ok) {
        $("#result").hidden = true;
        stop.hidden = false;
        stop.textContent = r.message;
        stop.focus();
        return;
      }
      stop.hidden = true;
      $("#r-score").textContent = r.score + " / 26 điểm";
      $("#r-label").textContent = r.band.label;
      $("#r-ref").textContent = "Tham chiếu: " + r.band.ref + ". " + r.refNote;
      fill($("#r-next"), [r.band.next]);
      $("#r-always").textContent = r.always;
      setLine("r-waistnote", r.waistNote);
      $("#result").classList.toggle("is-red", r.score > 20);
      $("#result").classList.toggle("is-amber", r.score >= 12 && r.score <= 20);

      var p = r.parts;
      $("#s-date").textContent = "Ngày tạo: " + today();
      $("#s-input").textContent = "Số liệu đã nhập: " + (a.sex === "nam" ? "Nam" : "Nữ") + ", " + a.age + " tuổi, BMI " + String(r.bmi).replace(".", ",") + (a.waistCm > 0 ? ", vòng eo " + String(a.waistCm).replace(".", ",") + " cm" : ", chưa nhập vòng eo") +
        "; vận động 30 phút/ngày: " + (a.active ? "có" : "không") + "; ăn rau/quả mọi ngày: " + (a.vegDaily ? "có" : "không") + "; từng uống thuốc huyết áp: " + (a.bpMeds ? "có" : "không") +
        "; từng được báo đường huyết cao: " + (a.highGlucose ? "có" : "không") + "; người thân: " + ({ khong: "không", xa: "họ hàng", gan: "bố/mẹ/anh chị em ruột/con" })[a.family] + ".";
      $("#s-result").textContent = "Kết quả: " + r.score + "/26 điểm — " + r.band.label + " (ModAsian FINDRISC). Điểm thành phần: tuổi " + p.tuoi + ", BMI " + p.bmi + ", vòng eo " + (r.waistMissing ? "chưa có" : p.vongEo) + ", vận động " + p.vanDong + ", rau quả " + p.rauQua + ", thuốc huyết áp " + p.thuocHuyetAp + ", đường huyết cao " + p.duongHuyetCao + ", người thân " + p.nguoiThan + "." + (r.waistMissing ? " Kết quả có thể thấp hơn thực tế vì thiếu vòng eo." : "");
      showResult();
      last = { date: today(), diem: r.score + "/26", nhom: r.band.label };
    });
    $("#save-btn").addEventListener("click", function () {
      if (!last) return;
      $("#save-note").textContent = history.save("findrisc", last) ? "Đã lưu trên máy này." : "Trình duyệt đang chặn lưu trữ.";
      renderHistory("findrisc", ["diem", "nhom"]);
    });
    $("#clear-history").addEventListener("click", function () { history.clear("findrisc"); renderHistory("findrisc", ["diem", "nhom"]); });
  }

  window.VSHTools = { initBmi: initBmi, initFindrisc: initFindrisc, history: history, bridge: bridge };
  document.addEventListener("DOMContentLoaded", function () {
    var t = document.body.getAttribute("data-tool");
    if (t === "bmi") initBmi();
    if (t === "findrisc") initFindrisc();
  });
})();
