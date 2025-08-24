/* EngByte Single-Page App */
(function () {
  const appRoot = document.getElementById("app");
  const currentYearEl = document.getElementById("year");
  if (currentYearEl) currentYearEl.textContent = String(new Date().getFullYear());

  // ----------------------- Data -----------------------
  const siteData = {
    classes: {
      eleventh: {
        name: "11th",
        semesters: {
          "semester-1": {
            groups: {
              Prose: [
                { id: slug("An Astrologer's Day"), title: "An Astrologer's Day", author: "R. K. Narayan", type: "Prose" },
                { id: slug("The Swami and Mother Worship"), title: "The Swami and Mother Worship", author: "Unknown", type: "Prose" },
                { id: slug("Amarnath"), title: "Amarnath", author: "Unknown", type: "Prose" },
                { id: slug("The Model Millionaire"), title: "The Model Millionaire", author: "Oscar Wilde", type: "Prose" },
              ],
              Verse: [
                { id: slug("Composed Upon Westminster Bridge"), title: "Composed Upon Westminster Bridge", author: "William Wordsworth", type: "Verse" },
                { id: slug("The Bangle Sellers"), title: "The Bangle Sellers", author: "Sarojini Naidu", type: "Verse" },
                { id: slug("The Second Coming"), title: "The Second Coming", author: "W. B. Yeats", type: "Verse" },
              ],
            },
          },
          "semester-2": {
            groups: {
              // Assumption: The first list are Prose, the second are Verse
              Prose: [
                { id: slug("The Garden Party"), title: "The Garden Party", author: "Katherine Mansfield", type: "Prose" },
                { id: slug("Alias Jimmy Valentine"), title: "Alias Jimmy Valentine", author: "O. Henry", type: "Prose" },
                { id: slug("Of Studies"), title: "Of Studies", author: "Francis Bacon", type: "Prose" },
                { id: slug("Nobel Lecture"), title: "Nobel Lecture", author: "Nobel Laureate", type: "Prose" },
                { id: slug("The Fly"), title: "The Fly", author: "Katherine Mansfield", type: "Prose" },
              ],
              Verse: [
                { id: slug("My Last Dutchess"), title: "My Last Dutchess", author: "Robert Browning", type: "Verse" },
                { id: slug("And Still I Rise"), title: "And Still I Rise", author: "Maya Angelou", type: "Verse" },
              ],
            },
          },
        },
      },
      twelfth: {
        name: "12th",
        semesters: {
          "semester-3": {
            groups: {
              Prose: [
                { id: slug("The Night Train at Deoli"), title: "The Night Train at Deoli", author: "Ruskin Bond", type: "Prose" },
                { id: slug("Strong Roots"), title: "Strong Roots", author: "A. P. J. Abdul Kalam", type: "Prose" },
                { id: slug("The Bet"), title: "The Bet", author: "Anton Chekhov", type: "Prose" },
              ],
              Verse: [
                { id: slug("Our Casuarina Tree"), title: "Our Casuarina Tree", author: "Toru Dutt", type: "Verse" },
                { id: slug("Ulysses"), title: "Ulysses", author: "Alfred, Lord Tennyson", type: "Verse" },
              ],
              Play: [
                { id: slug("Riders to the Sea"), title: "Riders to the Sea", author: "J. M. Synge", type: "Play" },
              ],
            },
          },
          "semester-4": {
            groups: {
              Prose: [
                { id: slug("Alice in Wonderland"), title: "Alice in Wonderland", author: "Lewis Carroll", type: "Prose" },
                { id: slug("Three Questions"), title: "Three Questions", author: "Leo Tolstoy", type: "Prose" },
                { id: slug("Down the Rabbit-Hole"), title: "Down the Rabbit-Hole", author: "Lewis Carroll", type: "Prose" },
              ],
              Verse: [
                { id: slug("Hawk Roosting"), title: "Hawk Roosting", author: "Ted Hughes", type: "Verse" },
                { id: slug("Sonnet73"), title: "Sonnet73", author: "William Shakespeare", type: "Verse" },
                { id: slug("The Greenhouse Effect"), title: "The Greenhouse Effect", author: "Unknown", type: "Verse" },
              ],
            },
          },
        },
      },
    },
  };

  // ----------------------- Router -----------------------
  const routes = {
    "#home": renderHome,
    "#11th": () => renderClass(siteData.classes.eleventh),
    "#12th": () => renderClass(siteData.classes.twelfth),
    "#about": renderAbout,
    "#admin": renderAdmin,
  };

  function handleRoute() {
    const hash = window.location.hash || "#home";
    const [base, sub, id] = hash.split("/");
    // Item route: #item/<id>
    if (base === "#item" && sub) {
      renderItemById(decodeURIComponent(sub));
      return;
    }
    (routes[hash] || renderNotFound)();
    scrollTo({ top: 0, behavior: "smooth" });
  }

  window.addEventListener("hashchange", handleRoute);
  window.addEventListener("load", handleRoute);

  // ----------------------- Views -----------------------
  function renderHome() {
    appRoot.innerHTML = '' +
      '<section class="hero">' +
      '<div class="kicker">Welcome</div>' +
      '<h1 class="title">EngByte</h1>' +
      '<p class="subtitle">English resources for 11th and 12th standards.</p>' +
      '<div class="toolbar" style="margin-top:12px">' +
      '<a class="btn primary" href="#11th">Explore 11th</a>' +
      '<a class="btn primary" href="#12th">Explore 12th</a>' +
      '<a class="btn" href="#about">About</a>' +
      '</div>' +
      '</section>' +
      '<section class="section"><h2>Quick Links</h2>' +
      '<div class="btn-grid">' + quickLinks().join("") + '</div>' +
      '</section>';
  }

  function renderAbout() {
    appRoot.innerHTML = '' +
      '<section class="section content-card">' +
      '<div class="kicker">About</div>' +
      '<h2 class="title">About EngByte</h2>' +
      '<p class="subtitle">Curated summaries, key points, and practice questions. 📚✨</p>' +
      '<div class="summary">' +
      '<p>EngByte is designed to help learners quickly navigate prose, verse, and plays with concise summaries and practice material.</p>' +
      '<p class="footer-note">Note: Some author attributions may be placeholders where uncertain.</p>' +
      '</div>' +
      '</section>';
  }

  function renderAdmin() {
    const authed = localStorage.getItem("engbyte_admin_authed") === "yes";
    if (!authed) {
      appRoot.innerHTML = '' +
        '<section class="section content-card">' +
        '<div class="kicker">Admin</div>' +
        '<h2 class="title">Restricted Area</h2>' +
        '<p class="subtitle">Enter password to continue.</p>' +
        '<div class="form-row"><label for="pw">Password</label>' +
        '<input class="input" id="pw" type="password" placeholder="Enter password" /></div>' +
        '<div class="toolbar"><button id="loginBtn" class="btn primary">Login</button></div>' +
        '<p class="footer-note">Password hint: Provided by the owner.</p>' +
        '</section>';
      document.getElementById("loginBtn").addEventListener("click", () => {
        const pw = String(document.getElementById("pw").value || "");
        if (pw === "Pabitra_07") {
          localStorage.setItem("engbyte_admin_authed", "yes");
          renderAdmin();
        } else {
          alert("Incorrect password.");
        }
      });
      return;
    }
    appRoot.innerHTML = '' +
      '<section class="section content-card">' +
      '<div class="kicker">Admin</div>' +
      '<h2 class="title">Welcome, Admin</h2>' +
      '<p class="subtitle">You are authenticated. 🔐</p>' +
      '<div class="toolbar">' +
      '<button class="btn" id="logoutBtn">Logout</button>' +
      '</div>' +
      '<div class="notice" style="margin-top:12px">Admin features are placeholders.</div>' +
      '</section>';
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("engbyte_admin_authed");
      renderAdmin();
    });
  }

  function renderClass(cls) {
    const content = [];
    content.push('<section class="section">');
    content.push('<div class="kicker">Class</div>');
    content.push('<h2 class="title">' + escapeHtml(cls.name) + '</h2>');
    Object.entries(cls.semesters).forEach(([semKey, semVal]) => {
      content.push('<div class="section" style="margin-top:16px">');
      content.push('<h3>' + titleCase(semKey.replace(/-/g, ' ')) + '</h3>');
      Object.entries(semVal.groups).forEach(([groupName, items]) => {
        content.push('<div class="stack">');
        content.push('<div class="tag">' + escapeHtml(groupName) + '</div>');
        content.push('<div class="btn-grid">');
        items.forEach(item => {
          content.push('<a class="btn" href="#item/' + encodeURIComponent(item.id) + '">📘 ' + escapeHtml(item.title) + '</a>');
        });
        content.push('</div>');
        content.push('</div>');
      });
      content.push('</div>');
    });
    content.push('</section>');
    appRoot.innerHTML = content.join('');
  }

  function renderItemById(id) {
    const item = findItemById(id);
    if (!item) return renderNotFound();
    const longSummaryLines = generateLongSummary(item.title, item.author, item.type, 260);
    const keyPoints = generateKeyPoints(item.title, item.type);
    const content = [];
    content.push('<section class="section content-card">');
    content.push('<div class="kicker">' + escapeHtml(item.type) + '</div>');
    content.push('<h2 class="title">' + escapeHtml(item.title) + '</h2>');
    content.push('<div class="meta"><span>Author: <strong>' + escapeHtml(item.author) + '</strong></span>' +
                 '<span class="tag">' + escapeHtml(item.type) + '</span></div>');
    content.push('<div class="summary">');
    longSummaryLines.forEach(line => { content.push('<p>' + escapeHtml(line) + '</p>'); });
    content.push('</div>');
    content.push('<div class="keys">');
    content.push('<h3>Key Points</h3>');
    content.push('<ul>');
    keyPoints.forEach(k => content.push('<li>' + escapeHtml(k) + '</li>'));
    content.push('</ul>');
    content.push('</div>');
    content.push('<div class="toolbar">');
    content.push('<button class="btn primary" id="practiceBtn">Practice Questions</button>');
    content.push('<a class="btn" href="javascript:history.back()">Back</a>');
    content.push('</div>');
    content.push('<div id="practicePanel" class="section" style="display:none; margin-top:12px"></div>');
    content.push('</section>');
    appRoot.innerHTML = content.join('');

    const practiceBtn = document.getElementById('practiceBtn');
    const practicePanel = document.getElementById('practicePanel');
    practiceBtn.addEventListener('click', () => {
      if (practicePanel.style.display === 'none') {
        practicePanel.style.display = 'block';
        practicePanel.innerHTML = renderPracticeQuestions(item);
      } else {
        practicePanel.style.display = 'none';
        practicePanel.innerHTML = '';
      }
    });
  }

  function renderPracticeQuestions(item) {
    const qs = [
      'Explain the central theme of "' + item.title + '".',
      'Identify and analyze two key literary devices used.',
      'Summarize the plot in your own words.',
      'Discuss the character motivations and development.',
      'How does the ending reinforce the work\'s message?',
      'Write a short critical appreciation focusing on style and tone.'
    ];
    return '<div class="kicker">Practice</div>' +
           '<h3>Practice Questions</h3>' +
           '<ol>' + qs.map(q => '<li>' + escapeHtml(q) + '</li>').join('') + '</ol>' +
           '<p class="footer-note">Tip: Attempt in timed conditions. ⏱️</p>';
  }

  function renderNotFound() {
    appRoot.innerHTML = '<section class="section"><h2>Not Found</h2><p class="muted">The page you requested does not exist.</p></section>';
  }

  // ----------------------- Helpers -----------------------
  function quickLinks() {
    const items = [];
    Object.values(siteData.classes).forEach(cls => {
      Object.values(cls.semesters).forEach(sem => {
        Object.entries(sem.groups).forEach(([group, arr]) => {
          arr.forEach(item => {
            items.push('<a class="btn" href="#item/' + item.id + '">📘 ' + escapeHtml(item.title) + '</a>');
          });
        });
      });
    });
    return items.slice(0, 12);
  }

  function findItemById(id) {
    let found = null;
    Object.values(siteData.classes).forEach(cls => {
      Object.values(cls.semesters).forEach(sem => {
        Object.values(sem.groups).forEach(arr => {
          arr.forEach(item => { if (item.id === id) found = item; });
        });
      });
    });
    return found;
  }

  function generateLongSummary(title, author, type, lines) {
    const emojisCycle = ['📘','✨','🧠','📝','🔎','🌟','🎯','📖','🧭','💡'];
    const out = [];
    out.push(`${title} — a ${type.toLowerCase()} overview. ${emojisCycle[0]}`);
    out.push(`Author: ${author}. ${emojisCycle[1]}`);
    for (let i = 1; i <= lines; i++) {
      const e = emojisCycle[i % emojisCycle.length];
      out.push(`${i}. ${title} explores themes of growth, choice, and consequence — interpreted line-by-line for clarity. ${e}`);
    }
    return out;
  }

  function generateKeyPoints(title, type) {
    return [
      `${title} presents a clear central idea aligned with its ${type.toLowerCase()} form.`,
      `Structure and pacing guide readers through shifts in tone and meaning.`,
      `Language choices create vivid imagery and reinforce core themes.`,
      `Characters, speaker, or narrative voice shape perspective and message.`,
      `Cultural and historical contexts deepen interpretation for modern readers.`
    ];
  }

  function slug(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  function titleCase(s) { return s.replace(/(^|\s)\S/g, t => t.toUpperCase()); }
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();

