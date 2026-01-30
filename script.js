function uniq(arr) {
  return [...new Set(arr)].sort((a, b) => a.localeCompare(b));
}

function getAllTags() {
  const courses = [...document.querySelectorAll(".course")];
  const tags = courses.flatMap(c => (c.dataset.tags || "")
    .split(",")
    .map(t => t.trim())
    .filter(Boolean));
  return uniq(tags);
}

function populateTagFilter() {
  const select = document.getElementById("tagFilter");
  const tags = getAllTags();
  for (const t of tags) {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    select.appendChild(opt);
  }
}

function matchesSearch(courseEl, q) {
  if (!q) return true;
  const text = courseEl.innerText.toLowerCase();
  return text.includes(q.toLowerCase());
}

function matchesTag(courseEl, tag) {
  if (!tag) return true;
  const tags = (courseEl.dataset.tags || "").split(",").map(t => t.trim());
  return tags.includes(tag);
}

function applyFilters() {
  const q = document.getElementById("search").value.trim();
  const tag = document.getElementById("tagFilter").value;
  const courses = [...document.querySelectorAll(".course")];

  for (const c of courses) {
    const ok = matchesSearch(c, q) && matchesTag(c, tag);
    c.style.display = ok ? "" : "none";
    if (!ok) c.removeAttribute("open");
  }
}

function setupCopyButtons() {
  const buttons = [...document.querySelectorAll(".copy-btn")];
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const courseName = btn.dataset.copy || "COURSE";
      const template = `<!-- COURSE: ${courseName} -->
<details class="course" data-course="${courseName}" data-tags="tag1,tag2,tag3">
  <summary>
    <div class="summary-left">
      <h2>${courseName}</h2>
      <p class="meta">Short description here</p>
    </div>
    <div class="summary-right">
      <span class="tag">tag1</span>
      <span class="tag">tag2</span>
      <span class="tag">tag3</span>
    </div>
  </summary>

  <div class="course-body">
    <div class="grid">
      <div class="card">
        <h3>Curriculum</h3>
        <div class="img-slot"><div class="img-placeholder">Add curriculum image here</div></div>
        <ul>
          <li>Topic 1</li>
          <li>Topic 2</li>
        </ul>
      </div>

      <div class="card">
        <h3>Prerequisites</h3>
        <div class="img-slot"><div class="img-placeholder">Add prerequisites image here</div></div>
        <ul>
          <li>Prereq 1</li>
          <li>Prereq 2</li>
        </ul>
      </div>

      <div class="card">
        <h3>Hardware & Resources Provided</h3>
        <div class="img-slot"><div class="img-placeholder">Add resources image here</div></div>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </div>

      <div class="card">
        <h3>Final Projects</h3>
        <div class="img-slot"><div class="img-placeholder">Add final projects collage here</div></div>
        <ul class="projects">
          <li class="project">
            <div class="project-title">
              <a href="#" target="_blank" rel="noreferrer">Project Title</a>
              <span class="mini">Team / Quarter</span>
            </div>
            <p class="project-desc">1–2 line description.</p>
            <div class="project-tags">
              <span class="tag small">tagA</span>
              <span class="tag small">tagB</span>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="footer-row">
      <button class="copy-btn" data-copy="${courseName}">Copy template block</button>
    </div>
  </div>
</details>`;

      navigator.clipboard.writeText(template).then(() => {
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = "Copy template block"), 1200);
      }).catch(() => {
        alert("Could not copy automatically. Select and copy manually.");
      });
    });
  });
}

populateTagFilter();
setupCopyButtons();

document.getElementById("search").addEventListener("input", applyFilters);
document.getElementById("tagFilter").addEventListener("change", applyFilters);
