/* Smoothvault Moves — small helpers shared by every page (no cookies, no tracking). */
(function () {
  var C = (window.SVM_CONFIG = window.SVM_CONFIG || {});
  function esc(v) {
    return String(v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // Send "Share your experience" to the review page once a review link exists.
  if (!C.reviewUrl && (C.googleReviewUrl || C.trustpilotUrl)) C.reviewUrl = "/review/";

  // Company disclosure line + legal links (used by the home page footer and static pages).
  window.svmLegalHTML = function () {
    var bits = [];
    if (C.registeredIn || C.companyNumber) {
      bits.push(
        "Smoothvault Moves Ltd" +
          (C.registeredIn ? ", registered in " + esc(C.registeredIn) : "") +
          (C.companyNumber ? ", company no. " + esc(C.companyNumber) : "") + "."
      );
    }
    if (C.registeredOffice) bits.push("Registered office: " + esc(C.registeredOffice) + ".");
    bits.push('<a href="/privacy/">Privacy</a> · <a href="/terms/">Booking terms</a>');
    return bits.join(" ");
  };

  // Cookieless analytics (only when a token is set).
  if (C.cfAnalyticsToken) {
    var s = document.createElement("script");
    s.defer = true;
    s.src = "https://static.cloudflareinsights.com/beacon.min.js";
    s.setAttribute("data-cf-beacon", JSON.stringify({ token: C.cfAnalyticsToken }));
    document.head.appendChild(s);
  }

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  ready(function () {
    var q = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };
    q("[data-legal]").forEach(function (el) { el.innerHTML = window.svmLegalHTML(); });
    q("[data-cfg-text]").forEach(function (el) {
      var v = C[el.getAttribute("data-cfg-text")];
      if (v) el.textContent = v;
    });
    q("[data-cfg-show]").forEach(function (el) { el.hidden = !C[el.getAttribute("data-cfg-show")]; });
    q("[data-cfg-href]").forEach(function (el) {
      var v = C[el.getAttribute("data-cfg-href")];
      if (v) { el.href = v; el.hidden = false; } else { el.hidden = true; }
    });
    q("[data-review-fallback]").forEach(function (el) { el.hidden = !!(C.googleReviewUrl || C.trustpilotUrl); });

    // Mobile menu on the static pages (the home page's menu is handled by the app).
    if (document.body.hasAttribute("data-static")) {
      var btn = document.querySelector(".header__menu"), nav = document.getElementById("mobile-nav"),
          hdr = document.querySelector(".header");
      if (btn && nav && hdr) {
        btn.addEventListener("click", function () {
          var open = nav.hidden;
          nav.hidden = !open;
          btn.setAttribute("aria-expanded", String(open));
          btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
          hdr.classList.toggle("is-open", open);
        });
      }
    }
  });
})();
