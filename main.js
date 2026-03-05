(function () {
  const STORAGE_KEY = "promptLibrary_v1";
  const THEME_KEY = "promptLibrary_theme";
  const VIEW_KEY = "promptLibrary_view";

  // Edit mode state
  let editingIndex = null;

  // Modal state
  let modalState = {
    isOpen: false,
    mode: "create", // 'create' | 'edit' | 'view'
    promptIndex: null,
  };

  // View state
  let currentView = "cards";
  let sortColumn = "createdAt";
  let sortDirection = "desc";
  let searchQuery = "";
  let expandedRows = new Set();

  /* ══════════════════════════════════════════════════════════════
   * THEME SYSTEM
   * ══════════════════════════════════════════════════════════════ */

  /**
   * Gets the effective theme based on preference and system settings
   * @param {string} preference - User preference: 'light', 'dark', or 'system'
   * @returns {string} - Effective theme: 'light' or 'dark'
   */
  function getEffectiveTheme(preference) {
    if (preference === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return preference;
  }

  /**
   * Applies the theme to the document
   * @param {string} theme - Theme to apply: 'light' or 'dark'
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  /**
   * Updates the active state of theme buttons
   * @param {string} preference - Current theme preference
   */
  function updateThemeButtons(preference) {
    document.querySelectorAll(".theme-btn").forEach((btn) => {
      if (btn.dataset.theme === preference) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  /**
   * Sets the theme preference and applies it
   * @param {string} preference - Theme preference: 'light', 'dark', or 'system'
   */
  window.setTheme = function (preference) {
    localStorage.setItem(THEME_KEY, preference);
    const effectiveTheme = getEffectiveTheme(preference);
    applyTheme(effectiveTheme);
    updateThemeButtons(preference);
  };

  /**
   * Initializes the theme system
   */
  function initTheme() {
    const savedPreference = localStorage.getItem(THEME_KEY) || "system";
    const effectiveTheme = getEffectiveTheme(savedPreference);
    applyTheme(effectiveTheme);
    updateThemeButtons(savedPreference);

    // Listen for system theme changes when in system mode
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        const currentPreference = localStorage.getItem(THEME_KEY);
        if (currentPreference === "system") {
          applyTheme(e.matches ? "dark" : "light");
        }
      });
  }

  /* ══════════════════════════════════════════════════════════════
   * END THEME SYSTEM
   * ══════════════════════════════════════════════════════════════ */

  /* ══════════════════════════════════════════════════════════════
   * VIEW MANAGEMENT SYSTEM
   * ══════════════════════════════════════════════════════════════ */

  /**
   * Loads view preference from localStorage
   * @returns {string} - View preference: 'cards' or 'table'
   */
  function loadViewPreference() {
    return localStorage.getItem(VIEW_KEY) || "cards";
  }

  /**
   * Saves view preference to localStorage
   * @param {string} view - View to save
   */
  function saveViewPreference(view) {
    localStorage.setItem(VIEW_KEY, view);
  }

  /**
   * Toggles between card and table view
   * @param {string} view - View to switch to: 'cards' or 'table'
   */
  window.toggleView = function (view) {
    currentView = view;
    saveViewPreference(view);
    updateViewButtons();
    render();
  };

  /**
   * Updates the active state of view buttons
   */
  function updateViewButtons() {
    document.querySelectorAll(".view-btn").forEach((btn) => {
      if (btn.dataset.view === currentView) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  /**
   * Sorts prompts by column
   * @param {string} column - Column to sort by
   */
  window.sortBy = function (column) {
    if (sortColumn === column) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortColumn = column;
      sortDirection = "desc";
    }
    render();
  };

  /**
   * Sorts prompts array
   * @param {Array} prompts - Array of prompts
   * @param {string} column - Column to sort by
   * @param {string} direction - Sort direction: 'asc' or 'desc'
   * @returns {Array} - Sorted prompts
   */
  function sortPrompts(prompts, column, direction) {
    return [...prompts].sort((a, b) => {
      let aVal, bVal;

      switch (column) {
        case "title":
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case "rating":
          aVal = a.rating || 0;
          bVal = b.rating || 0;
          break;
        case "model":
          aVal = a.metadata?.model || "";
          bVal = b.metadata?.model || "";
          break;
        case "createdAt":
          aVal = a.metadata?.createdAt
            ? new Date(a.metadata.createdAt).getTime()
            : a.createdAt;
          bVal = b.metadata?.createdAt
            ? new Date(b.metadata.createdAt).getTime()
            : b.createdAt;
          break;
        default:
          return 0;
      }

      if (direction === "asc") {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });
  }

  /**
   * Gets sort icon for column
   * @param {string} column - Column name
   * @returns {string} - HTML for sort icon
   */
  function getSortIcon(column) {
    if (sortColumn !== column) {
      return '<span class="sort-icon">↕</span>';
    }
    return sortDirection === "asc"
      ? '<span class="sort-icon active">↑</span>'
      : '<span class="sort-icon active">↓</span>';
  }

  /**
   * Filters prompts by search query
   * @param {Array} prompts - Array of prompts
   * @param {string} query - Search query
   * @returns {Array} - Filtered prompts
   */
  function filterPrompts(prompts, query) {
    if (!query) return prompts;
    const lowerQuery = query.toLowerCase();
    return prompts.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.content.toLowerCase().includes(lowerQuery) ||
        (p.metadata?.model || "").toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Handles search input
   */
  window.handleSearch = function () {
    const input = document.getElementById("searchInput");
    searchQuery = input.value.trim();

    const clearBtn = document.getElementById("clearSearchBtn");
    if (searchQuery) {
      clearBtn.classList.add("show");
    } else {
      clearBtn.classList.remove("show");
    }

    render();
  };

  /**
   * Clears search
   */
  window.clearSearch = function () {
    document.getElementById("searchInput").value = "";
    searchQuery = "";
    document.getElementById("clearSearchBtn").classList.remove("show");
    render();
  };

  /* ══════════════════════════════════════════════════════════════
   * END VIEW MANAGEMENT SYSTEM
   * ══════════════════════════════════════════════════════════════ */

  /* ══════════════════════════════════════════════════════════════
   * METADATA TRACKING SYSTEM
   * ══════════════════════════════════════════════════════════════ */

  /**
   * Validates ISO 8601 date string
   * @param {string} dateStr - ISO 8601 date string
   * @returns {boolean} - True if valid
   */
  function isValidISO8601(dateStr) {
    if (typeof dateStr !== "string") return false;
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) && date.toISOString() === dateStr;
  }

  /**
   * Estimates token count from text
   * @param {string} text - Text to analyze
   * @param {boolean} isCode - Whether the text is code
   * @returns {Object} - Token estimate with min, max, confidence
   * @throws {Error} - If text is not a string
   */
  function estimateTokens(text, isCode = false) {
    try {
      if (typeof text !== "string") {
        throw new Error("Text must be a string");
      }

      // Count words and characters
      const words = text
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0);
      const wordCount = words.length;
      const charCount = text.length;

      // Base calculation
      let min = Math.ceil(wordCount * 0.75);
      let max = Math.ceil(charCount * 0.25);

      // Apply code multiplier
      if (isCode) {
        min = Math.ceil(min * 1.3);
        max = Math.ceil(max * 1.3);
      }

      // Determine confidence based on token range
      const avgTokens = (min + max) / 2;
      let confidence;
      if (avgTokens < 1000) {
        confidence = "high";
      } else if (avgTokens <= 5000) {
        confidence = "medium";
      } else {
        confidence = "low";
      }

      return { min, max, confidence };
    } catch (error) {
      throw new Error(`Token estimation failed: ${error.message}`);
    }
  }

  /**
   * Creates metadata object for a prompt
   * @param {string} modelName - Name of the AI model
   * @param {string} content - Prompt content
   * @param {boolean} isCode - Whether content is code
   * @returns {Object} - Metadata object
   * @throws {Error} - If validation fails
   */
  function trackModel(modelName, content, isCode = false) {
    try {
      // Validate model name
      if (typeof modelName !== "string" || modelName.trim() === "") {
        throw new Error("Model name must be a non-empty string");
      }
      if (modelName.length > 100) {
        throw new Error("Model name must not exceed 100 characters");
      }

      // Validate content
      if (typeof content !== "string") {
        throw new Error("Content must be a string");
      }

      const now = new Date().toISOString();
      const tokenEstimate = estimateTokens(content, isCode);

      return {
        model: modelName.trim(),
        createdAt: now,
        updatedAt: now,
        tokenEstimate,
      };
    } catch (error) {
      throw new Error(`Metadata tracking failed: ${error.message}`);
    }
  }

  /**
   * Updates timestamps in metadata object
   * @param {Object} metadata - Existing metadata object
   * @returns {Object} - Updated metadata object
   * @throws {Error} - If validation fails
   */
  function updateTimestamps(metadata) {
    try {
      if (!metadata || typeof metadata !== "object") {
        throw new Error("Metadata must be an object");
      }

      if (!isValidISO8601(metadata.createdAt)) {
        throw new Error("Invalid createdAt timestamp");
      }

      const now = new Date().toISOString();
      const createdDate = new Date(metadata.createdAt);
      const updatedDate = new Date(now);

      if (updatedDate < createdDate) {
        throw new Error("updatedAt cannot be earlier than createdAt");
      }

      return {
        ...metadata,
        updatedAt: now,
      };
    } catch (error) {
      throw new Error(`Timestamp update failed: ${error.message}`);
    }
  }

  /**
   * Formats ISO timestamp to human-readable format
   * @param {string} isoString - ISO 8601 date string
   * @returns {string} - Formatted date string
   */
  function formatMetadataDate(isoString) {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid date";
    }
  }

  /* ══════════════════════════════════════════════════════════════
   * END METADATA TRACKING SYSTEM
   * ══════════════════════════════════════════════════════════════ */

  /* ── helpers ── */
  function load() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  }
  function persist(arr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  }

  function formatDate(ts) {
    return new Date(ts).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  /* ── toast ── */
  let toastTimer = null;
  function showToast(msg, type) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.className =
      "toast show" +
      (type === "error"
        ? " toast-error"
        : type === "success"
        ? " toast-success"
        : "");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.className = "toast";
    }, 2800);
  }

  /* ── validation ── */
  function validatePromptSchema(data) {
    if (!Array.isArray(data)) return false;
    return data.every(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof item.title === "string" &&
        typeof item.content === "string" &&
        typeof item.createdAt === "number"
    );
  }

  /* ── migrate old data ── */
  function migratePrompts(data) {
    return data.map((item) => ({
      ...item,
      rating: typeof item.rating === "number" ? item.rating : 0,
      notes: Array.isArray(item.notes) ? item.notes : [],
      metadata: item.metadata || null,
    }));
  }

  /* ── notes storage ── */
  // Notes are stored as an array within each prompt:
  // prompt.notes = [{ id, content, lastEdited, isEditing }]

  function generateNoteId() {
    return "note_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  /* ── export backup ── */
  window.exportBackup = function () {
    const prompts = load();
    if (prompts.length === 0) {
      showToast("No prompts to export.", "error");
      return;
    }

    const now = new Date();
    const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const filename = `prompts-backup-${dateStr}.json`;

    const dataStr = JSON.stringify(prompts, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(
      `Exported ${prompts.length} prompt${prompts.length !== 1 ? "s" : ""}.`,
      "success"
    );
  };

  /* ── import state ── */
  let pendingImportData = null;

  /* ── file select handler ── */
  window.handleFileSelect = function (event) {
    const file = event.target.files[0];
    if (!file) return;

    // Reset file input
    event.target.value = "";

    processFile(file);
  };

  /* ── process file ── */
  function processFile(file) {
    if (!file.name.endsWith(".json")) {
      showToast("Please select a .json file.", "error");
      return;
    }

    showLoading(true);

    const reader = new FileReader();

    reader.onload = function (e) {
      setTimeout(() => {
        // Simulate processing time for visual feedback
        try {
          const importedData = JSON.parse(e.target.result);

          if (!validatePromptSchema(importedData)) {
            showLoading(false);
            showToast("Invalid backup file format.", "error");
            return;
          }

          // Migrate old prompts to ensure they have all required fields
          const migratedData = migratePrompts(importedData);

          const currentPrompts = load();

          if (currentPrompts.length === 0) {
            // No conflict, directly import
            persist(migratedData);
            render();
            showLoading(false);
            showToast(
              `Import complete: ${migratedData.length} prompt${
                migratedData.length !== 1 ? "s" : ""
              } added.`,
              "success"
            );
          } else {
            // Conflict detected, show modal
            showLoading(false);
            pendingImportData = migratedData;
            showModal(currentPrompts.length, migratedData.length);
          }
        } catch (err) {
          showLoading(false);
          showToast("Failed to parse JSON file.", "error");
          console.error("Import error:", err);
        }
      }, 600); // Minimum loading time for UX
    };

    reader.onerror = function () {
      showLoading(false);
      showToast("Failed to read file.", "error");
    };

    reader.readAsText(file);
  }

  /* ── loading state ── */
  function showLoading(show) {
    document
      .getElementById("dropZone")
      .querySelector(".drop-zone-content").style.display = show
      ? "none"
      : "block";
    document.getElementById("dropLoading").style.display = show
      ? "flex"
      : "none";
  }

  /* ── modal ── */
  function showModal(currentCount, importCount) {
    document.getElementById("modalCurrentCount").textContent = currentCount;
    document.getElementById("modalImportCount").textContent = importCount;
    document.getElementById("modalOverlay").classList.add("show");
  }

  function hideModal() {
    document.getElementById("modalOverlay").classList.remove("show");
  }

  /* ── resolve import ── */
  window.resolveImport = function (mode) {
    if (!pendingImportData) return;

    const currentPrompts = load();
    let finalPrompts;
    let message;

    if (mode === "merge") {
      finalPrompts = [...currentPrompts, ...pendingImportData];
      message = `Merged ${pendingImportData.length} new prompt${
        pendingImportData.length !== 1 ? "s" : ""
      }.`;
    } else {
      // overwrite
      finalPrompts = pendingImportData;
      message = `Replaced library with ${pendingImportData.length} prompt${
        pendingImportData.length !== 1 ? "s" : ""
      }.`;
    }

    persist(finalPrompts);
    render();
    hideModal();
    pendingImportData = null;

    showToast(message, "success");
  };

  /* ── drag and drop ── */
  const dropZone = document.getElementById("dropZone");

  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropZone.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ["dragenter", "dragover"].forEach((eventName) => {
    dropZone.addEventListener(
      eventName,
      () => {
        dropZone.classList.add("drag-over");
      },
      false
    );
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropZone.addEventListener(
      eventName,
      () => {
        dropZone.classList.remove("drag-over");
      },
      false
    );
  });

  dropZone.addEventListener(
    "drop",
    (e) => {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        processFile(files[0]);
      }
    },
    false
  );

  /* ── render ── */
  function render() {
    const prompts = load();
    const container = document.getElementById("promptsContainer");

    // Update prompt count
    document.getElementById("promptCount").textContent =
      prompts.length +
      " prompt" +
      (prompts.length !== 1 ? "s" : "") +
      " stored";

    // Apply search filter
    const filteredPrompts = filterPrompts(prompts, searchQuery);

    // Update search results count
    const resultsCount = document.getElementById("searchResultsCount");
    if (searchQuery && filteredPrompts.length !== prompts.length) {
      resultsCount.textContent = `Showing ${filteredPrompts.length} of ${prompts.length}`;
    } else {
      resultsCount.textContent = "";
    }

    if (filteredPrompts.length === 0) {
      container.innerHTML = `
  <div class="empty-state">
    <div class="empty-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </div>
    <p>${
      searchQuery
        ? "No prompts match your search."
        : "No prompts yet — create your first one above."
    }</p>
  </div>`;
      return;
    }

    // Render based on current view
    if (currentView === "table") {
      renderTableView(filteredPrompts, prompts);
    } else {
      renderCardsView(filteredPrompts, prompts);
    }
  }

  /* ── render cards view ── */
  function renderCardsView(filteredPrompts, allPrompts) {
    const container = document.getElementById("promptsContainer");

    // Sort by createdAt descending (newest first) for cards
    const sortedPrompts = [...filteredPrompts].sort((a, b) => {
      const aTime = a.metadata?.createdAt
        ? new Date(a.metadata.createdAt).getTime()
        : a.createdAt;
      const bTime = b.metadata?.createdAt
        ? new Date(b.metadata.createdAt).getTime()
        : b.createdAt;
      return bTime - aTime;
    });

    container.innerHTML =
      '<div class="cards-grid">' +
      sortedPrompts
        .map(
          (p, i) => `
  <div class="prompt-card" onclick="openViewModal(${allPrompts.indexOf(
    p
  )})" style="animation-delay:${i * 40}ms; cursor: pointer;">
    <div class="card-header">
      <span class="card-index">#${String(i + 1).padStart(2, "0")}</span>
      <span class="card-title">${escapeHtml(p.title)}</span>
      ${
        p.rating > 0
          ? `<span class="rating-badge">★ ${p.rating}.0</span>`
          : '<span class="rating-badge unrated">—</span>'
      }
    </div>
    <p class="card-preview">${escapeHtml(p.content)}</p>
    ${renderMetadata(p)}
    <div class="rating-container">
      <div class="rating-stars">
        ${[5, 4, 3, 2, 1]
          .map(
            (star) =>
              `<button class="star-btn ${
                star <= (p.rating || 0) ? "filled" : ""
              }" onclick="event.stopPropagation(); setRating(${allPrompts.indexOf(
                p
              )}, ${star})" title="${star} star${
                star !== 1 ? "s" : ""
              }" tabindex="0">★</button>`
          )
          .join("")}
      </div>
    </div>
    ${renderNotes(p, allPrompts.indexOf(p))}
    <div class="card-footer">
      <span class="card-date">${formatDate(p.createdAt)}</span>
      <div class="card-actions">
        <button class="btn-icon btn-edit" onclick="event.stopPropagation(); openEditModal(${allPrompts.indexOf(
          p
        )})" title="Edit prompt" tabindex="0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button class="btn-icon btn-copy" onclick="event.stopPropagation(); copyPrompt(${allPrompts.indexOf(
          p
        )})" title="Copy prompt" tabindex="0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        </button>
        <button class="btn-icon btn-delete" onclick="event.stopPropagation(); deletePrompt(${allPrompts.indexOf(
          p
        )})" title="Delete prompt" tabindex="0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
`
        )
        .join("") +
      "</div>";
  }

  /* ── render table view ── */
  function renderTableView(filteredPrompts, allPrompts) {
    const container = document.getElementById("promptsContainer");
    const sorted = sortPrompts(filteredPrompts, sortColumn, sortDirection);

    container.innerHTML = `
<div class="table-container">
  <table class="prompts-table">
    <thead>
      <tr>
        <th style="width: 60px;">#</th>
        <th onclick="sortBy('title')" style="cursor: pointer;">Title ${getSortIcon(
          "title"
        )}</th>
        <th onclick="sortBy('model')" style="cursor: pointer; width: 140px;">Model ${getSortIcon(
          "model"
        )}</th>
        <th onclick="sortBy('rating')" style="cursor: pointer; width: 90px;">Rating ${getSortIcon(
          "rating"
        )}</th>
        <th onclick="sortBy('createdAt')" style="cursor: pointer; width: 120px;">Date ${getSortIcon(
          "createdAt"
        )}</th>
        <th style="width: 110px;">Tokens</th>
        <th style="width: 180px;">Actions</th>
      </tr>
    </thead>
    <tbody>
      ${sorted.map((p) => renderTableRow(p, allPrompts.indexOf(p))).join("")}
    </tbody>
  </table>
</div>
`;
  }

  /* ── render table row ── */
  function renderTableRow(prompt, index) {
    const tokens = prompt.metadata?.tokenEstimate
      ? `${prompt.metadata.tokenEstimate.min.toLocaleString()}–${prompt.metadata.tokenEstimate.max.toLocaleString()}`
      : "—";

    return `
<tr class="table-row" onclick="openViewModal(${index})" data-prompt-index="${index}" style="cursor: pointer;">
  <td class="col-index">#${String(index + 1).padStart(2, "0")}</td>
  <td class="col-title">${escapeHtml(prompt.title)}</td>
  <td class="col-model">${
    prompt.metadata?.model ? escapeHtml(prompt.metadata.model) : "—"
  }</td>
  <td class="col-rating">${
    prompt.rating > 0 ? "★ " + prompt.rating + ".0" : "—"
  }</td>
  <td class="col-date">${formatDate(prompt.createdAt)}</td>
  <td class="col-tokens">${tokens}</td>
  <td class="col-actions">
    <div class="table-actions">
      <button class="btn-icon-sm btn-edit" onclick="event.stopPropagation(); openEditModal(${index})" title="Edit prompt">Edit</button>
      <button class="btn-icon-sm btn-copy" onclick="event.stopPropagation(); copyPrompt(${index})" title="Copy prompt">Copy</button>
      <button class="btn-icon-sm btn-delete" onclick="event.stopPropagation(); deletePrompt(${index})" title="Delete prompt">Delete</button>
    </div>
  </td>
</tr>
`;
  }

  /* ── render metadata section ── */
  function renderMetadata(prompt) {
    if (!prompt.metadata) {
      return "";
    }

    const meta = prompt.metadata;
    const { min, max, confidence } = meta.tokenEstimate;

    return `
<div class="metadata-container">
  <div class="metadata-header">Metadata</div>
  <div class="metadata-grid">
    <div class="metadata-row">
      <span class="metadata-label">Model:</span>
      <span class="metadata-model">${escapeHtml(meta.model)}</span>
    </div>
    <div class="metadata-row">
      <span class="metadata-label">Created:</span>
      <span class="metadata-timestamp">${formatMetadataDate(
        meta.createdAt
      )}</span>
    </div>
    ${
      meta.updatedAt !== meta.createdAt
        ? `
    <div class="metadata-row">
      <span class="metadata-label">Updated:</span>
      <span class="metadata-timestamp">${formatMetadataDate(
        meta.updatedAt
      )}</span>
    </div>
    `
        : ""
    }
    <div class="metadata-row">
      <span class="metadata-label">Tokens:</span>
      <div class="token-estimate">
        <span class="token-range">${min.toLocaleString()}–${max.toLocaleString()}</span>
        <span class="confidence-badge confidence-${confidence}">${confidence}</span>
      </div>
    </div>
  </div>
</div>
`;
  }

  /* ── render notes section ── */
  function renderNotes(prompt, promptIndex) {
    const notes = prompt.notes || [];

    return `
<div class="notes-container">
  <div class="notes-header">
    <span class="notes-label">Notes</span>
    <button class="btn-add-note" onclick="addNote(${promptIndex})" title="Add a new note" tabindex="0">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      Add Note
    </button>
  </div>
  ${notes.length === 0 ? '<div class="note-empty">No notes yet</div>' : ""}
  ${notes.map((note) => renderNoteCard(note, promptIndex)).join("")}
</div>
`;
  }

  /* ── render individual note card ── */
  function renderNoteCard(note, promptIndex) {
    if (note.isEditing) {
      return `
  <div class="note-card editing">
    <textarea 
      class="note-textarea" 
      data-note-id="${note.id}"
      placeholder="Write your note here..."
      tabindex="0"
    >${escapeHtml(note.content)}</textarea>
    <div class="note-footer">
      <span class="note-timestamp">${
        note.content
          ? "Last edited " + formatTimestamp(note.lastEdited)
          : "New note"
      }</span>
      <div class="note-actions">
        <button class="note-btn btn-save" onclick="saveNote(${promptIndex}, '${
        note.id
      }')" title="Save note" tabindex="0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Save
        </button>
        <button class="note-btn btn-cancel" onclick="cancelNote(${promptIndex}, '${
        note.id
      }')" title="Cancel editing" tabindex="0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Cancel
        </button>
      </div>
    </div>
  </div>
`;
    }

    return `
<div class="note-card">
  <div class="note-content">${escapeHtml(note.content)}</div>
  <div class="note-footer">
    <span class="note-timestamp">Last edited ${formatTimestamp(
      note.lastEdited
    )}</span>
    <div class="note-actions">
      <button class="note-btn" onclick="editNote(${promptIndex}, '${
      note.id
    }')" title="Edit note" tabindex="0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        Edit
      </button>
      <button class="note-btn btn-delete" onclick="deleteNote(${promptIndex}, '${
      note.id
    }')" title="Delete note" tabindex="0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/>
        </svg>
        Delete
      </button>
    </div>
  </div>
</div>
`;
  }

  /* ── escape ── */
  function escapeHtml(str) {
    const d = document.createElement("div");
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
  }

  /**
   * Saves prompt from modal (create or edit mode)
   */
  window.savePromptFromModal = function () {
    const titleEl = document.getElementById("promptTitle");
    const contentEl = document.getElementById("promptContent");
    const modelEl = document.getElementById("promptModel");
    const typeEl = document.getElementById("promptType");

    const title = titleEl.value.trim();
    const content = contentEl.value.trim();
    const modelName = modelEl.value.trim();
    const isCode = typeEl.value === "code";

    if (!title || !content) {
      showToast("Both title and content are required.", "error");
      return;
    }

    const prompts = load();

    if (modalState.mode === "edit" && modalState.promptIndex !== null) {
      // Update existing prompt
      const existingPrompt = prompts[modalState.promptIndex];

      let metadata = existingPrompt.metadata;
      if (modelName) {
        try {
          if (metadata) {
            metadata = {
              ...metadata,
              model: modelName,
              tokenEstimate: estimateTokens(content, isCode),
            };
            metadata = updateTimestamps(metadata);
          } else {
            metadata = trackModel(modelName, content, isCode);
          }
        } catch (error) {
          showToast(error.message, "error");
          return;
        }
      } else {
        metadata = null;
      }

      prompts[modalState.promptIndex] = {
        ...existingPrompt,
        title,
        content,
        metadata,
      };

      persist(prompts);
      closeModal();
      render();
      showToast("Prompt updated successfully.", "success");
    } else {
      // Create new prompt
      let metadata = null;
      if (modelName) {
        try {
          metadata = trackModel(modelName, content, isCode);
        } catch (error) {
          showToast(error.message, "error");
          return;
        }
      }

      prompts.unshift({
        title,
        content,
        createdAt: Date.now(),
        rating: 0,
        notes: [],
        metadata,
      });

      persist(prompts);
      closeModal();
      render();
      showToast("Prompt saved successfully.", "success");
    }
  };

  /* ── save (legacy - kept for backward compatibility) ── */
  window.savePrompt = function () {
    const titleEl = document.getElementById("promptTitle");
    const contentEl = document.getElementById("promptContent");
    const modelEl = document.getElementById("promptModel");
    const typeEl = document.getElementById("promptType");

    const title = titleEl.value.trim();
    const content = contentEl.value.trim();
    const modelName = modelEl.value.trim();
    const isCode = typeEl.value === "code";

    if (!title || !content) {
      showToast("Both title and content are required.", "error");
      return;
    }

    const prompts = load();

    // Check if we're editing an existing prompt
    if (editingIndex !== null) {
      // Update existing prompt
      const existingPrompt = prompts[editingIndex];

      // Create or update metadata
      let metadata = existingPrompt.metadata;
      if (modelName) {
        try {
          if (metadata) {
            // Update existing metadata
            metadata = {
              ...metadata,
              model: modelName,
              tokenEstimate: estimateTokens(content, isCode),
            };
            metadata = updateTimestamps(metadata);
          } else {
            // Create new metadata
            metadata = trackModel(modelName, content, isCode);
          }
        } catch (error) {
          showToast(error.message, "error");
          return;
        }
      } else {
        // If model name is cleared, remove metadata
        metadata = null;
      }

      prompts[editingIndex] = {
        ...existingPrompt,
        title,
        content,
        metadata,
      };

      persist(prompts);
      clearForm();
      render();
      showToast("Prompt updated successfully.", "success");

      // Scroll to the updated prompt
      setTimeout(() => {
        const cards = document.querySelectorAll(".prompt-card");
        if (cards[editingIndex]) {
          cards[editingIndex].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          // Brief highlight effect
          cards[editingIndex].style.transform = "scale(1.02)";
          setTimeout(() => {
            cards[editingIndex].style.transform = "";
          }, 300);
        }
      }, 100);
    } else {
      // Create new prompt
      let metadata = null;
      if (modelName) {
        try {
          metadata = trackModel(modelName, content, isCode);
        } catch (error) {
          showToast(error.message, "error");
          return;
        }
      }

      prompts.unshift({
        title,
        content,
        createdAt: Date.now(),
        rating: 0,
        notes: [],
        metadata,
      });

      persist(prompts);
      clearForm();
      render();
      showToast("Prompt saved successfully.", "success");
    }
  };

  /* ── clear form ── */
  function clearForm() {
    document.getElementById("promptTitle").value = "";
    document.getElementById("promptContent").value = "";
    document.getElementById("promptModel").value = "";
    document.getElementById("promptType").value = "text";
    exitEditMode();
  }

  /* ══════════════════════════════════════════════════════════════
   * MODAL FUNCTIONS
   * ══════════════════════════════════════════════════════════════ */

  /**
   * Shows the modal dialog
   */
  function showModal() {
    const modal = document.getElementById("promptModal");
    modal.classList.add("show");
    document.body.style.overflow = "hidden";

    if (modalState.mode !== "view") {
      setTimeout(() => document.getElementById("promptTitle")?.focus(), 100);
    }
  }

  /**
   * Hides the modal dialog
   */
  function hideModal() {
    const modal = document.getElementById("promptModal");
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }

  /**
   * Closes the modal and resets state
   */
  window.closeModal = function () {
    modalState = { isOpen: false, mode: "create", promptIndex: null };
    hideModal();
    clearForm();
  };

  /**
   * Renders modal content based on current mode
   */
  function renderModalContent() {
    const title = document.getElementById("modalTitle");
    const formContent = document.getElementById("modalFormContent");
    const viewContent = document.getElementById("modalViewContent");
    const footer = document.getElementById("modalFooter");
    const modal = document.querySelector(".modal-form");

    if (modalState.mode === "create") {
      title.textContent = "New Prompt";
      formContent.style.display = "block";
      viewContent.style.display = "none";
      modal.classList.remove("view-mode");
      footer.innerHTML = `
        <button class="modal-btn modal-btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="modal-btn modal-btn-primary" onclick="savePromptFromModal()">Save Prompt</button>
      `;
    } else if (modalState.mode === "edit") {
      title.textContent = "Edit Prompt";
      formContent.style.display = "block";
      viewContent.style.display = "none";
      modal.classList.remove("view-mode");
      footer.innerHTML = `
        <button class="modal-btn modal-btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="modal-btn modal-btn-primary" onclick="savePromptFromModal()">Update Prompt</button>
      `;
    } else if (modalState.mode === "view") {
      const prompts = load();
      const prompt = prompts[modalState.promptIndex];
      title.textContent = escapeHtml(prompt.title);
      formContent.style.display = "none";
      viewContent.style.display = "block";
      modal.classList.add("view-mode");

      viewContent.innerHTML = renderViewModeContent(
        prompt,
        modalState.promptIndex
      );

      footer.innerHTML = `
        <button class="modal-btn modal-btn-secondary" onclick="closeModal()">Close</button>
        <button class="modal-btn modal-btn-primary" onclick="switchToEditMode()">Edit Prompt</button>
      `;
    }
  }

  /**
   * Opens modal in create mode
   */
  window.openCreateModal = function () {
    modalState = { isOpen: true, mode: "create", promptIndex: null };
    clearForm();
    renderModalContent();
    showModal();
  };

  /**
   * Opens modal in edit mode
   */
  window.openEditModal = function (index) {
    modalState = { isOpen: true, mode: "edit", promptIndex: index };
    const prompts = load();
    const prompt = prompts[index];

    document.getElementById("promptTitle").value = prompt.title;
    document.getElementById("promptContent").value = prompt.content;
    document.getElementById("promptModel").value = prompt.metadata?.model || "";
    document.getElementById("promptType").value = prompt.metadata?.isCode
      ? "code"
      : "text";

    renderModalContent();
    showModal();
  };

  /**
   * Opens modal in view mode
   */
  window.openViewModal = function (index) {
    modalState = { isOpen: true, mode: "view", promptIndex: index };
    renderModalContent();
    showModal();
  };

  /**
   * Switches from view mode to edit mode
   */
  window.switchToEditMode = function () {
    modalState.mode = "edit";
    const prompts = load();
    const prompt = prompts[modalState.promptIndex];

    document.getElementById("promptTitle").value = prompt.title;
    document.getElementById("promptContent").value = prompt.content;
    document.getElementById("promptModel").value = prompt.metadata?.model || "";
    document.getElementById("promptType").value = prompt.metadata?.isCode
      ? "code"
      : "text";

    renderModalContent();
  };

  /**
   * Renders view mode content
   */
  function renderViewModeContent(prompt, index) {
    return `
      <div class="view-content">
        <div class="view-section">
          <label class="view-label">Prompt Content</label>
          <div class="view-prompt-content">${escapeHtml(prompt.content)}</div>
        </div>
        
        ${renderMetadata(prompt)}
        
        <div class="view-section">
          <label class="view-label">Rating</label>
          <div class="rating-stars">
            ${[5, 4, 3, 2, 1]
              .map(
                (star) =>
                  `<button class="star-btn ${
                    star <= (prompt.rating || 0) ? "filled" : ""
                  }" 
                       onclick="setRating(${index}, ${star}); renderModalContent();">★</button>`
              )
              .join("")}
          </div>
        </div>
        
        ${renderNotes(prompt, index)}
      </div>
    `;
  }

  /* ── edit mode ── */
  window.editPrompt = function (index) {
    const prompts = load();
    const prompt = prompts[index];

    if (!prompt) return;

    // Store the editing index
    editingIndex = index;

    // Populate form
    document.getElementById("promptTitle").value = prompt.title;
    document.getElementById("promptContent").value = prompt.content;
    document.getElementById("promptModel").value = prompt.metadata
      ? prompt.metadata.model
      : "";
    document.getElementById("promptType").value = prompt.metadata?.tokenEstimate
      ? "code"
      : "text";

    // Update UI to edit mode
    enterEditMode();

    // Scroll to form
    document.getElementById("formCard").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    // Focus title field
    setTimeout(() => {
      document.getElementById("promptTitle").focus();
    }, 300);
  };

  /* ── cancel edit ── */
  window.cancelEdit = function () {
    clearForm();
    showToast("Edit cancelled.");
  };

  /* ── enter edit mode ── */
  function enterEditMode() {
    const formCard = document.getElementById("formCard");
    const banner = document.getElementById("editModeBanner");
    const saveBtn = document.getElementById("saveBtn");
    const saveBtnText = document.getElementById("saveBtnText");

    formCard.classList.add("editing");
    banner.style.display = "flex";
    saveBtn.classList.add("update-mode");

    // Update button icon and text
    saveBtn.querySelector("svg").innerHTML = `
      <polyline points="20 6 9 17 4 12"/>
    `;
    saveBtnText.textContent = "Update Prompt";
  }

  /* ── exit edit mode ── */
  function exitEditMode() {
    const formCard = document.getElementById("formCard");
    const banner = document.getElementById("editModeBanner");
    const saveBtn = document.getElementById("saveBtn");
    const saveBtnText = document.getElementById("saveBtnText");

    formCard.classList.remove("editing");
    banner.style.display = "none";
    saveBtn.classList.remove("update-mode");

    // Reset button icon and text
    saveBtn.querySelector("svg").innerHTML = `
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    `;
    saveBtnText.textContent = "Save Prompt";

    editingIndex = null;
  }

  /* ── delete ── */
  window.deletePrompt = function (index) {
    const prompts = load();
    prompts.splice(index, 1);
    persist(prompts);
    render();
    showToast("Prompt deleted.");
  };

  /* ── copy ── */
  window.copyPrompt = function (index) {
    const prompts = load();
    navigator.clipboard.writeText(prompts[index].content).then(function () {
      showToast("Prompt copied to clipboard.");
    });
  };

  /* ── rating ── */
  window.setRating = function (index, stars) {
    const prompts = load();
    prompts[index].rating = stars;
    persist(prompts);
    render();
    showToast(`Rated ${stars} star${stars !== 1 ? "s" : ""}.`);
  };

  /* ── notes ── */
  window.addNote = function (promptIndex) {
    const prompts = load();
    const newNote = {
      id: generateNoteId(),
      content: "",
      lastEdited: Date.now(),
      isEditing: true,
    };

    if (!prompts[promptIndex].notes) {
      prompts[promptIndex].notes = [];
    }

    prompts[promptIndex].notes.push(newNote);
    persist(prompts);
    render();
  };

  window.editNote = function (promptIndex, noteId) {
    const prompts = load();
    const note = prompts[promptIndex].notes.find((n) => n.id === noteId);
    if (note) {
      note.isEditing = true;
      persist(prompts);
      render();
      // Focus the textarea after render
      setTimeout(() => {
        const textarea = document.querySelector(
          `textarea[data-note-id="${noteId}"]`
        );
        if (textarea) textarea.focus();
      }, 0);
    }
  };

  window.saveNote = function (promptIndex, noteId) {
    const prompts = load();
    const note = prompts[promptIndex].notes.find((n) => n.id === noteId);

    if (!note) return;

    const textarea = document.querySelector(
      `textarea[data-note-id="${noteId}"]`
    );
    const content = textarea ? textarea.value.trim() : "";

    // Validate: prevent empty notes
    if (!content) {
      const card = textarea?.closest(".note-card");
      if (card) {
        card.classList.add("error");
        setTimeout(() => card.classList.remove("error"), 300);
      }
      showToast("Note cannot be empty.", "error");
      return;
    }

    note.content = content;
    note.lastEdited = Date.now();
    note.isEditing = false;

    persist(prompts);
    render();
    showToast("Note saved.", "success");
  };

  window.cancelNote = function (promptIndex, noteId) {
    const prompts = load();
    const noteIndex = prompts[promptIndex].notes.findIndex(
      (n) => n.id === noteId
    );

    if (noteIndex === -1) return;

    const note = prompts[promptIndex].notes[noteIndex];

    // If this is a new unsaved note (empty content), remove it
    if (!note.content) {
      prompts[promptIndex].notes.splice(noteIndex, 1);
    } else {
      // Otherwise just exit editing mode
      note.isEditing = false;
    }

    persist(prompts);
    render();
  };

  window.deleteNote = function (promptIndex, noteId) {
    const prompts = load();
    const noteIndex = prompts[promptIndex].notes.findIndex(
      (n) => n.id === noteId
    );

    if (noteIndex !== -1) {
      prompts[promptIndex].notes.splice(noteIndex, 1);
      persist(prompts);
      render();
      showToast("Note deleted.");
    }
  };

  /* ── keyboard shortcuts ── */
  document
    .getElementById("promptTitle")
    .addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        document.getElementById("promptContent").focus();
      }
      // Escape to cancel edit
      if (e.key === "Escape" && editingIndex !== null) {
        cancelEdit();
      }
    });

  document
    .getElementById("promptContent")
    .addEventListener("keydown", function (e) {
      // Ctrl+Enter or Cmd+Enter to save
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        savePrompt();
      }
      // Escape to cancel edit
      if (e.key === "Escape" && editingIndex !== null) {
        cancelEdit();
      }
    });

  /* ── modal keyboard shortcuts ── */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modalState.isOpen) {
      closeModal();
    }
  });

  // Backdrop click to close modal
  document.addEventListener("click", function (e) {
    if (e.target.id === "promptModal" && modalState.isOpen) {
      closeModal();
    }
  });

  /* ══════════════════════════════════════════════════════════════
   * METADATA TESTING & VALIDATION (Development Only)
   * ══════════════════════════════════════════════════════════════ */

  // Expose functions for testing in console
  window.metadataAPI = {
    trackModel,
    updateTimestamps,
    estimateTokens,
    formatMetadataDate,

    // Run comprehensive tests
    runTests: function () {
      console.group("🧪 Metadata Tracking System Tests");

      let passed = 0;
      let failed = 0;

      // Test 1: trackModel with valid inputs
      try {
        const meta1 = trackModel(
          "gpt-4",
          "This is a test prompt for validation"
        );
        console.assert(
          meta1.model === "gpt-4",
          "✓ Model name stored correctly"
        );
        console.assert(
          typeof meta1.createdAt === "string",
          "✓ CreatedAt is string"
        );
        console.assert(
          typeof meta1.updatedAt === "string",
          "✓ UpdatedAt is string"
        );
        console.assert(
          meta1.tokenEstimate.confidence === "high",
          "✓ Token confidence calculated"
        );
        passed += 4;
      } catch (e) {
        console.error("✗ Test 1 failed:", e.message);
        failed++;
      }

      // Test 2: trackModel with empty model name
      try {
        trackModel("", "content");
        console.error("✗ Should have thrown error for empty model name");
        failed++;
      } catch (e) {
        console.assert(
          e.message.includes("non-empty"),
          "✓ Rejects empty model name"
        );
        passed++;
      }

      // Test 3: trackModel with long model name
      try {
        trackModel("a".repeat(101), "content");
        console.error("✗ Should have thrown error for long model name");
        failed++;
      } catch (e) {
        console.assert(
          e.message.includes("100 characters"),
          "✓ Rejects model name > 100 chars"
        );
        passed++;
      }

      // Test 4: estimateTokens for text
      try {
        const tokens = estimateTokens("Hello world this is a test", false);
        console.assert(tokens.min > 0, "✓ Min tokens calculated");
        console.assert(tokens.max > 0, "✓ Max tokens calculated");
        console.assert(
          tokens.confidence === "high",
          "✓ Confidence for small text is high"
        );
        passed += 3;
      } catch (e) {
        console.error("✗ Test 4 failed:", e.message);
        failed++;
      }

      // Test 5: estimateTokens for code (should be 1.3x)
      try {
        const textTokens = estimateTokens(
          "function test() { return true; }",
          false
        );
        const codeTokens = estimateTokens(
          "function test() { return true; }",
          true
        );
        console.assert(
          codeTokens.min > textTokens.min,
          "✓ Code tokens higher than text"
        );
        console.assert(
          Math.abs(codeTokens.min / textTokens.min - 1.3) < 0.01,
          "✓ Code multiplier is 1.3x"
        );
        passed += 2;
      } catch (e) {
        console.error("✗ Test 5 failed:", e.message);
        failed++;
      }

      // Test 6: Confidence levels
      try {
        const shortText = "a ".repeat(100);
        const mediumText = "a ".repeat(2000);
        const longText = "a ".repeat(10000);

        const shortTokens = estimateTokens(shortText, false);
        const mediumTokens = estimateTokens(mediumText, false);
        const longTokens = estimateTokens(longText, false);

        console.assert(
          shortTokens.confidence === "high",
          "✓ <1000 tokens = high confidence"
        );
        console.assert(
          mediumTokens.confidence === "medium",
          "✓ 1000-5000 tokens = medium confidence"
        );
        console.assert(
          longTokens.confidence === "low",
          "✓ >5000 tokens = low confidence"
        );
        passed += 3;
      } catch (e) {
        console.error("✗ Test 6 failed:", e.message);
        failed++;
      }

      // Test 7: updateTimestamps
      try {
        const meta = trackModel("claude-3", "test content");
        // Wait a tiny bit to ensure different timestamp
        setTimeout(() => {
          const updated = updateTimestamps(meta);
          console.assert(
            updated.updatedAt !== meta.updatedAt,
            "✓ UpdatedAt timestamp changed"
          );
          console.assert(
            updated.createdAt === meta.createdAt,
            "✓ CreatedAt unchanged"
          );
          console.assert(
            new Date(updated.updatedAt) >= new Date(updated.createdAt),
            "✓ UpdatedAt >= CreatedAt"
          );
          passed += 3;
        }, 10);
      } catch (e) {
        console.error("✗ Test 7 failed:", e.message);
        failed++;
      }

      // Test 8: Invalid timestamp validation
      try {
        updateTimestamps({ createdAt: "invalid-date" });
        console.error("✗ Should have thrown error for invalid timestamp");
        failed++;
      } catch (e) {
        console.assert(
          e.message.includes("Invalid"),
          "✓ Rejects invalid timestamps"
        );
        passed++;
      }

      // Test 9: ISO 8601 validation
      try {
        const validISO = "2026-02-09T12:00:00.000Z";
        const invalidISO = "2026-02-09";
        console.assert(isValidISO8601(validISO), "✓ Accepts valid ISO 8601");
        console.assert(
          !isValidISO8601(invalidISO),
          "✓ Rejects invalid ISO 8601"
        );
        passed += 2;
      } catch (e) {
        console.error("✗ Test 9 failed:", e.message);
        failed++;
      }

      // Test 10: Format metadata date
      try {
        const formatted = formatMetadataDate("2026-02-09T12:00:00.000Z");
        console.assert(formatted.includes("Feb"), "✓ Date formatting works");
        passed++;
      } catch (e) {
        console.error("✗ Test 10 failed:", e.message);
        failed++;
      }

      console.groupEnd();
      console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);

      if (failed === 0) {
        console.log("✅ All tests passed!");
      } else {
        console.warn("⚠️ Some tests failed. Check implementation.");
      }

      return { passed, failed };
    },
  };

  // Log API availability
  console.log("📦 Metadata API available at window.metadataAPI");
  console.log("Run window.metadataAPI.runTests() to test the system");

  /* ══════════════════════════════════════════════════════════════
   * END METADATA TESTING
   * ══════════════════════════════════════════════════════════════ */

  /* ── init ── */
  initTheme();
  currentView = loadViewPreference();
  updateViewButtons();
  render();
})();
