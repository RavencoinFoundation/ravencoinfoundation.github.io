/* ==========================================================================
   Ravencoin Foundation — shared site script
   No build step, no framework. Every page includes this file and gets the
   header, footer, theme toggle, and whatever data-driven blocks it asks for.
   ========================================================================== */
(function () {
  "use strict";

  var REPO = "RavencoinFoundation/ravencoinfoundation.github.io";

  /* --- Site configuration ------------------------------------------------ */
  /* Edit NAV to change the top menu. Edit FOOTER_COLUMNS for the footer.    */
  var NAV = [
    { text: "Home", href: "/" },
    { text: "Resources", href: "/links/" },
    { text: "Proposals", href: "/proposals/" },
    { text: "Documents", href: "/documents/" },
    { text: "Meetup at Sea", href: "/meetup/" },
    { text: "Contact", href: "/contact/" }
  ];

  var FOOTER_COLUMNS = [
    {
      title: "Foundation",
      links: [
        { text: "Resources", href: "/links/" },
        { text: "Proposals & Bounties", href: "/proposals/" },
        { text: "Proposal Descriptions", href: "/proposal_desc/" },
        { text: "Documents", href: "/documents/" },
        { text: "Accounting", href: "/accounting/" },
        { text: "Contact", href: "/contact/" }
      ]
    },
    {
      title: "Ravencoin",
      links: [
        { text: "Downloads", href: "/downloads/" },
        { text: "Whitepaper", href: "/whitepaper/" },
        { text: "Community", href: "/community/" },
        { text: "Ravencoin.org", href: "https://ravencoin.org/" },
        { text: "Source (GitHub)", href: "https://github.com/RavenProject/Ravencoin" }
      ]
    },
    {
      title: "Stay in touch",
      links: [
        { text: "Email updates", href: "/getupdates/" },
        { text: "Blog", href: "/blog/" },
        { text: "Discord", href: "https://discord.com/invite/jn6uhur" },
        { text: "Telegram", href: "https://t.me/RavencoinDev" },
        { text: "Foundation GitHub", href: "https://github.com/RavencoinFoundation" },
        { text: "Privacy", href: "/privacy/" }
      ]
    }
  ];

  var DONATION_ADDRESS = "RVM93VRB9jn6FXps9mMu4iftxt7BpGexGM";

  /* --- Tiny helpers ------------------------------------------------------ */
  function el(sel, root) {
    return (root || document).querySelector(sel);
  }
  function els(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function isExternal(href) {
    return /^https?:\/\//i.test(href) && href.indexOf("ravencoin.foundation") === -1;
  }
  function samePath(href) {
    var here = location.pathname.replace(/index\.html$/, "");
    var there = String(href).replace(/index\.html$/, "");
    if (there === "/") return here === "/";
    return here === there || here === there.replace(/\/$/, "");
  }
  function json(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(url + " → " + r.status);
      return r.json();
    });
  }

  /* --- Icons (simple geometry only, so they render predictably) ---------- */
  var ICONS = {
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    sun:
      '<circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.6M12 19.4V22M2 12h2.6M19.4 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/>',
    moon: '<path d="M20.5 14.6A8.6 8.6 0 019.4 3.5a8.6 8.6 0 1011.1 11.1z"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    external: '<path d="M14 4h6v6M20 4l-8.5 8.5M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/>',
    download: '<path d="M12 3v12M7 11l5 5 5-5M4 20h16"/>',
    wallet:
      '<rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 10h18M16.5 14.5h.01"/>',
    assets: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/>',
    people:
      '<circle cx="9" cy="8" r="3.4"/><path d="M2.5 20a6.5 6.5 0 0113 0"/><path d="M16 5.2a3.4 3.4 0 010 5.8M17.5 20a6.6 6.6 0 00-2-4.7"/>',
    buy: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5A2.5 2.5 0 0112 8h1.5M14.5 14.5A2.5 2.5 0 0112 16h-1.5"/>',
    trade: '<path d="M4 17l5-6 4 3 7-8"/><path d="M20 6h-4.5M20 6v4.5"/>',
    swap: '<path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5"/>',
    mining: '<path d="M4 20l8-8M9 7l8 8M6.5 4.5l3 3M17 15l3 3"/><rect x="12" y="3" width="8" height="8" rx="2"/>',
    globe:
      '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 3 2.6 15 0 18M12 3c-2.6 3-2.6 15 0 18"/>',
    nft: '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M4 17l5-4.5 4 3.5 3-2.5 4 3.5"/>',
    book: '<path d="M4 4.5A2.5 2.5 0 016.5 2H20v16H6.5A2.5 2.5 0 004 20.5z"/><path d="M4 20.5A2.5 2.5 0 016.5 18H20v4H6.5A2.5 2.5 0 014 19.5z"/>',
    code: '<path d="M9 17l-5-5 5-5M15 7l5 5-5 5"/>',
    megaphone: '<path d="M4 10v4a1 1 0 001 1h2l7 4V5L7 9H5a1 1 0 00-1 1z"/><path d="M17.5 8.5a5 5 0 010 7"/>',
    file: '<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/><path d="M14 3v5h5"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0112 8a4.1 4.1 0 017.5 2.6C19.5 15.4 12 20 12 20z"/>',
    ship: '<path d="M3 18c1.8 0 1.8 1.5 3.5 1.5S8.3 18 10 18s1.8 1.5 3.5 1.5S15.3 18 17 18s1.8 1.5 3.5 1.5"/><path d="M5 15l1.5-5h11L19 15"/><path d="M12 10V5h4"/>',
    doc: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h7M9 16h7"/>',
    shield: '<path d="M12 3l7 3v6c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6z"/><path d="M9 12l2 2 4-4"/>'
  };

  function icon(name, cls) {
    var d = ICONS[name];
    if (!d) return "";
    return (
      '<svg class="' +
      (cls || "") +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      d +
      "</svg>"
    );
  }

  /* --- Theme ------------------------------------------------------------- */
  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") || "light";
  }
  function setTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem("rvnf-theme", t);
    } catch (e) {
      /* private mode — theme just won't persist */
    }
  }

  /* --- Header / footer --------------------------------------------------- */
  function renderChrome() {
    var header = el("#site-header");
    if (header) {
      header.className = "site-header";
      header.innerHTML =
        '<div class="wrap site-header__inner">' +
        '<a class="brand" href="/">' +
        '<img src="/assets/img/raven-bird.svg" alt="" width="26" height="40">' +
        "<span>Ravencoin<small>Foundation</small></span>" +
        "</a>" +
        '<button class="icon-btn theme-toggle" type="button" aria-label="Toggle dark mode">' +
        icon("moon", "moon") +
        icon("sun", "sun") +
        "</button>" +
        '<button class="icon-btn nav-toggle" type="button" aria-label="Menu" aria-expanded="false">' +
        icon("menu") +
        "</button>" +
        '<nav class="nav" aria-label="Main">' +
        NAV.map(function (n) {
          return (
            '<a href="' +
            esc(n.href) +
            '"' +
            (samePath(n.href) ? ' aria-current="page"' : "") +
            ">" +
            esc(n.text) +
            "</a>"
          );
        }).join("") +
        "</nav>" +
        "</div>";

      el(".theme-toggle", header).addEventListener("click", function () {
        setTheme(currentTheme() === "dark" ? "light" : "dark");
      });
      var toggle = el(".nav-toggle", header);
      toggle.addEventListener("click", function () {
        var inner = el(".site-header__inner", header);
        var open = inner.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
        toggle.innerHTML = open ? icon("close") : icon("menu");
      });
    }

    var footer = el("#site-footer");
    if (footer) {
      footer.className = "site-footer";
      footer.innerHTML =
        '<div class="wrap">' +
        '<div class="site-footer__top">' +
        '<div class="site-footer__brand">' +
        '<img src="/assets/img/raven-bird.svg" alt="Ravencoin" width="30" height="46">' +
        "<h4>Ravencoin Foundation</h4>" +
        "<p>A non-profit that supports the Ravencoin open-source project and the people who " +
        "build with it. Ravencoin itself is not a company — it is technology, source code, " +
        "and the network that emerges from it.</p>" +
        "</div>" +
        FOOTER_COLUMNS.map(function (col) {
          return (
            "<div><h4>" +
            esc(col.title) +
            "</h4><ul>" +
            col.links
              .map(function (l) {
                return (
                  "<li><a href=" +
                  '"' +
                  esc(l.href) +
                  '"' +
                  (isExternal(l.href) ? ' target="_blank" rel="noopener noreferrer"' : "") +
                  ">" +
                  esc(l.text) +
                  "</a></li>"
                );
              })
              .join("") +
            "</ul></div>"
          );
        }).join("") +
        "</div>" +
        '<div class="site-footer__bottom">' +
        "<span>© " +
        new Date().getFullYear() +
        " Ravencoin Foundation</span>" +
        "<span>Donate: <code>" +
        DONATION_ADDRESS +
        "</code></span>" +
        "</div>" +
        "</div>";
    }
  }

  /* --- Copy-to-clipboard buttons ----------------------------------------- */
  function wireCopyButtons() {
    els("[data-copy]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var text = btn.getAttribute("data-copy");
        var done = function () {
          var old = btn.textContent;
          btn.textContent = "Copied";
          setTimeout(function () {
            btn.textContent = old;
          }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () {});
        } else {
          var ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          try {
            document.execCommand("copy");
            done();
          } catch (e) {
            /* nothing we can do */
          }
          document.body.removeChild(ta);
        }
      });
    });
  }

  /* --- Resource link directory ------------------------------------------- */
  function renderLinks(container) {
    var searchBox = el("#link-search");
    var chipBox = el("#link-chips");
    container.innerHTML = '<p class="loading">Loading resources…</p>';

    json("/data/links.json").then(
      function (data) {
        var meta = data._categories || {};
        // data-only="Download,Learn" limits the block to those categories.
        var only = (container.getAttribute("data-only") || "")
          .split(",")
          .map(function (s) {
            return s.trim();
          })
          .filter(Boolean);
        var categories = Object.keys(data).filter(function (k) {
          if (k.charAt(0) === "_" || !Array.isArray(data[k])) return false;
          return !only.length || only.indexOf(k) !== -1;
        });

        container.innerHTML = categories
          .map(function (cat) {
            var info = meta[cat] || {};
            var links = data[cat];
            return (
              '<section class="linkcat" data-cat="' +
              esc(cat) +
              '" id="cat-' +
              esc(cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")) +
              '">' +
              '<div class="linkcat__head">' +
              '<span class="card__icon">' +
              icon(info.icon || "globe") +
              "</span>" +
              "<h3>" +
              esc(cat) +
              "</h3>" +
              '<span class="linkcat__count">' +
              links.length +
              "</span>" +
              "</div>" +
              (info.blurb ? '<p class="linkcat__blurb">' + esc(info.blurb) + "</p>" : "") +
              "<ul>" +
              links
                .map(function (l) {
                  var ext = isExternal(l.link);
                  return (
                    '<li data-text="' +
                    esc(l.text.toLowerCase()) +
                    '"><a href="' +
                    esc(l.link) +
                    '"' +
                    (ext ? ' target="_blank" rel="noopener noreferrer"' : "") +
                    "><span>" +
                    esc(l.text) +
                    "</span>" +
                    (ext ? icon("external", "ext") : "") +
                    "</a></li>"
                  );
                })
                .join("") +
              "</ul>" +
              "</section>"
            );
          })
          .join("") + '<p class="empty-state is-hidden" id="link-empty">No resources match that search.</p>';

        if (chipBox) {
          chipBox.innerHTML =
            '<button class="chip is-active" data-filter="">All</button>' +
            categories
              .map(function (cat) {
                return '<button class="chip" data-filter="' + esc(cat) + '">' + esc(cat) + "</button>";
              })
              .join("");
        }

        var activeCat = "";
        function apply() {
          var q = (searchBox ? searchBox.value : "").trim().toLowerCase();
          var anyVisible = false;
          els(".linkcat", container).forEach(function (sec) {
            var catOk = !activeCat || sec.getAttribute("data-cat") === activeCat;
            var shown = 0;
            els("li", sec).forEach(function (li) {
              var hit =
                catOk &&
                (!q ||
                  li.getAttribute("data-text").indexOf(q) !== -1 ||
                  sec.getAttribute("data-cat").toLowerCase().indexOf(q) !== -1);
              li.classList.toggle("is-hidden", !hit);
              if (hit) shown++;
            });
            sec.classList.toggle("is-hidden", shown === 0);
            if (shown) anyVisible = true;
          });
          var empty = el("#link-empty");
          if (empty) empty.classList.toggle("is-hidden", anyVisible);
        }

        if (searchBox) {
          searchBox.addEventListener("input", apply);
          searchBox.removeAttribute("disabled");
        }
        if (chipBox) {
          chipBox.addEventListener("click", function (e) {
            var chip = e.target.closest(".chip");
            if (!chip) return;
            activeCat = chip.getAttribute("data-filter");
            els(".chip", chipBox).forEach(function (c) {
              c.classList.toggle("is-active", c === chip);
            });
            apply();
          });
        }

        // "/" focuses the search box, like a good directory should.
        document.addEventListener("keydown", function (e) {
          if (e.key === "/" && searchBox && document.activeElement !== searchBox) {
            e.preventDefault();
            searchBox.focus();
          }
        });
      },
      function (err) {
        container.innerHTML =
          '<p class="empty-state">Could not load the resource list. ' +
          '<a href="/data/links.json">View the raw data</a>.</p>';
        console.error(err);
      }
    );
  }

  /* --- Folder-driven document lists -------------------------------------- */
  /* Drop a PDF into the folder in the repo and it shows up here. The GitHub
     contents API is tried first (instant, no rebuild); if it is unreachable
     or rate-limited we fall back to a committed manifest.                   */
  function renderDocs(container) {
    var path = container.getAttribute("data-folder");
    var exts = (container.getAttribute("data-ext") || "pdf").split(",");
    container.innerHTML = '<p class="loading">Loading…</p>';

    function keep(name) {
      var e = name.split(".").pop().toLowerCase();
      return exts.indexOf(e) !== -1;
    }

    function paint(names) {
      if (!names.length) {
        container.innerHTML = '<p class="empty-state">Nothing here yet.</p>';
        return;
      }
      names.sort(function (a, b) {
        return b.localeCompare(a, undefined, { numeric: true });
      });
      var html = "";
      var lastYear = null;
      names.forEach(function (name) {
        var m = name.match(/(19|20)\d{2}/);
        var year = m ? m[0] : "Other";
        if (year !== lastYear) {
          html += '<li class="year-head">' + esc(year) + "</li>";
          lastYear = year;
        }
        var label = name.replace(/\.[^.]+$/, "");
        html +=
          '<li><a href="/' +
          path.split("/").map(encodeURIComponent).join("/") +
          "/" +
          encodeURIComponent(name) +
          '">' +
          icon("file") +
          "<span>" +
          esc(label) +
          "</span></a></li>";
      });
      container.innerHTML = html;
      container.className = "doclist";
    }

    fetch("https://api.github.com/repos/" + REPO + "/contents/" + encodeURI(path))
      .then(function (r) {
        if (!r.ok) throw new Error("github " + r.status);
        return r.json();
      })
      .then(function (files) {
        paint(
          files
            .filter(function (f) {
              return f.type === "file" && keep(f.name);
            })
            .map(function (f) {
              return f.name;
            })
        );
      })
      .catch(function () {
        var slug = path.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        return json("/data/manifests/" + slug + ".json").then(
          function (names) {
            paint(names.filter(keep));
          },
          function () {
            container.innerHTML =
              '<p class="empty-state">Could not load this list. ' +
              '<a href="https://github.com/' +
              REPO +
              "/tree/main/" +
              encodeURI(path) +
              '">Browse the folder on GitHub</a>.</p>';
          }
        );
      });
  }

  /* --- People directory --------------------------------------------------- */
  var SOCIAL_LABELS = {
    x: "X",
    twitter: "X",
    facebook: "Facebook",
    linkedin: "LinkedIn",
    github: "GitHub",
    gitlab: "GitLab",
    email: "Email",
    website: "Website",
    telegram: "Telegram",
    discord: "Discord",
    medium: "Medium",
    youtube: "YouTube",
    instagram: "Instagram",
    reddit: "Reddit",
    mastodon: "Mastodon",
    bluesky: "Bluesky",
    keybase: "Keybase",
    twitch: "Twitch",
    tiktok: "TikTok"
  };

  function socialHref(key, value) {
    if (/^https?:\/\//i.test(value)) return value;
    if (key === "email" || value.indexOf("@") > 0) {
      if (key === "email") return "mailto:" + value;
    }
    if (key === "discord") return null; // handles are not links
    return "https://" + value.replace(/^\/+/, "");
  }

  function initials(name) {
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map(function (w) {
        return w.charAt(0).toUpperCase();
      })
      .join("");
  }

  function personCard(p) {
    var links = p.links || {};
    var socials = Object.keys(links)
      .filter(function (k) {
        return links[k];
      })
      .map(function (k) {
        var label = SOCIAL_LABELS[k] || k.charAt(0).toUpperCase() + k.slice(1);
        var href = socialHref(k, String(links[k]));
        if (!href) {
          return (
            '<span class="social social--text" title="' +
            esc(label) +
            '">' +
            esc(links[k]) +
            "</span>"
          );
        }
        return (
          '<a class="social social--text" href="' +
          esc(href) +
          '"' +
          (href.indexOf("mailto:") === 0 ? "" : ' target="_blank" rel="noopener noreferrer"') +
          ">" +
          esc(label) +
          "</a>"
        );
      })
      .join("");

    return (
      '<article class="person" data-search="' +
      esc(
        [p.name, p.alias, p.role, (p.strengths || []).join(" "), p.location]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
      ) +
      '">' +
      '<div class="person__top">' +
      (p.photo
        ? '<img class="person__avatar" src="' + esc(p.photo) + '" alt="' + esc(p.name) + '">'
        : '<div class="person__avatar" aria-hidden="true">' + esc(initials(p.name)) + "</div>") +
      "<div>" +
      '<h3 class="person__name">' +
      esc(p.name) +
      "</h3>" +
      (p.alias ? '<div class="person__alias">' + esc(p.alias) + "</div>" : "") +
      "</div>" +
      "</div>" +
      (p.role ? '<p class="person__role">' + esc(p.role) + "</p>" : "") +
      (p.bio ? '<p class="person__bio">' + esc(p.bio) + "</p>" : "") +
      (p.strengths && p.strengths.length
        ? '<ul class="tags">' +
          p.strengths
            .map(function (s) {
              return '<li class="tag">' + esc(s) + "</li>";
            })
            .join("") +
          "</ul>"
        : "") +
      (socials ? '<div class="socials">' + socials + "</div>" : "") +
      "</article>"
    );
  }

  function renderPeople(container) {
    var searchBox = el("#people-search");
    container.innerHTML = '<p class="loading">Loading…</p>';

    json("/data/people.json").then(
      function (data) {
        var people = (data.people || []).filter(function (p) {
          return p && p.name;
        });
        var groups = data.groups && data.groups.length ? data.groups : [{ name: "Community" }];
        var fallback = groups[groups.length - 1].name;

        if (!people.length) {
          container.innerHTML =
            '<p class="empty-state">No contacts listed yet. Add people to ' +
            '<a href="/data/people.json">data/people.json</a>.</p>';
          return;
        }

        container.innerHTML = groups
          .map(function (g) {
            var mine = people.filter(function (p) {
              var grp = p.group || fallback;
              var known = groups.some(function (x) {
                return x.name === grp;
              });
              return (known ? grp : fallback) === g.name;
            });
            if (!mine.length) return "";
            return (
              '<section class="section--tight" data-group="' +
              esc(g.name) +
              '">' +
              '<div class="section-head"><h2>' +
              esc(g.name) +
              "</h2>" +
              (g.blurb ? "<p>" + esc(g.blurb) + "</p>" : "") +
              "</div>" +
              '<div class="people-grid">' +
              mine.map(personCard).join("") +
              "</div></section>"
            );
          })
          .join("") +
          '<p class="empty-state is-hidden" id="people-empty">Nobody matches that search.</p>';

        if (searchBox) {
          searchBox.removeAttribute("disabled");
          searchBox.addEventListener("input", function () {
            var q = searchBox.value.trim().toLowerCase();
            var any = false;
            els("[data-group]", container).forEach(function (sec) {
              var shown = 0;
              els(".person", sec).forEach(function (card) {
                var hit = !q || card.getAttribute("data-search").indexOf(q) !== -1;
                card.classList.toggle("is-hidden", !hit);
                if (hit) shown++;
              });
              sec.classList.toggle("is-hidden", shown === 0);
              if (shown) any = true;
            });
            el("#people-empty").classList.toggle("is-hidden", any);
          });
        }
      },
      function (err) {
        container.innerHTML = '<p class="empty-state">Could not load the contact list.</p>';
        console.error(err);
      }
    );
  }

  /* --- Boot --------------------------------------------------------------- */
  function boot() {
    renderChrome();
    wireCopyButtons();
    els("[data-icon]").forEach(function (n) {
      n.innerHTML = icon(n.getAttribute("data-icon"));
    });
    var linksEl = el("#links-directory");
    if (linksEl) renderLinks(linksEl);
    els("[data-folder]").forEach(renderDocs);
    var peopleEl = el("#people-directory");
    if (peopleEl) renderPeople(peopleEl);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
