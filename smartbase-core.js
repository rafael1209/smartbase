/* ==========================================================================
   Smart Base Core Logic (smartbase-core.js)
   Handles state management (LocalStorage), dynamic UI updates, and profile edit modal
   ========================================================================== */

// Helper to format Date string YYYY-MM-DD into DD.MM.YY Hebrew format
function formatDateToHebrew(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const year = parts[0].substring(2);
    const month = parts[1];
    const day = parts[2];
    return `${day}.${month}.${year}`;
}

// Default Data Model matching the user's structure
const DEFAULT_DATA = {
    id: "6257383",
    baseName: "563078",
    visitorId: "215555756",
    visitorName: "רפאל חסמן",
    visitorPhone: "0545888550",
    startDate: "2026-05-04",
    endDate: "2028-05-31",
    referenceNumber: "652649"
};

// Retrieve data from localStorage or fallback to defaults
function getSavedData() {
    const saved = localStorage.getItem('smartbase_data');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            return DEFAULT_DATA;
        }
    }
    return null;
}

// Save data to localStorage
function saveDetails(data) {
    localStorage.setItem('smartbase_data', JSON.stringify(data));
}

// Build and Inject the Setup / Profile Editing Modal
function injectModal() {
    const modalHTML = `
        <div id="sb-modal" class="sb-modal-overlay">
            <div class="sb-modal-card">
                <div class="sb-modal-header">
                    <h3 class="sb-modal-title">הזנת פרטי משתמש (בסיס חכם)</h3>
                    <button class="sb-modal-close" id="sb-modal-close-btn">&times;</button>
                </div>
                <form id="sb-modal-form">
                    <div class="sb-form-group">
                        <label class="sb-form-label">שם מלא (מבקר / יוצר)</label>
                        <input type="text" id="input-visitorName" class="sb-form-input" required placeholder="לדוגמה: רפאל חסמן">
                    </div>
                    <div class="sb-form-row">
                        <div class="sb-form-group">
                            <label class="sb-form-label">תעודת זהות</label>
                            <input type="text" id="input-visitorId" class="sb-form-input" required placeholder="לדוגמה: 215555756">
                        </div>
                        <div class="sb-form-group">
                            <label class="sb-form-label">מספר מחנה / בסיס</label>
                            <input type="text" id="input-baseName" class="sb-form-input" required placeholder="לדוגמה: 563078">
                        </div>
                    </div>
                    <div class="sb-form-row">
                        <div class="sb-form-group">
                            <label class="sb-form-label">מספר פנייה / מזהה</label>
                            <input type="text" id="input-id" class="sb-form-input" required placeholder="לדוגמה: 6257383">
                        </div>
                        <div class="sb-form-group">
                            <label class="sb-form-label">קוד אישור</label>
                            <input type="text" id="input-referenceNumber" class="sb-form-input" required placeholder="לדוגמה: 652649">
                        </div>
                    </div>
                    <div class="sb-form-group">
                        <label class="sb-form-label">מספר טלפון</label>
                        <input type="text" id="input-visitorPhone" class="sb-form-input" required placeholder="לדוגמה: 0545888550">
                    </div>
                    <div class="sb-form-row">
                        <div class="sb-form-group">
                            <label class="sb-form-label">תאריך התחלה</label>
                            <input type="date" id="input-startDate" class="sb-form-input" required>
                        </div>
                        <div class="sb-form-group">
                            <label class="sb-form-label">תאריך סיום</label>
                            <input type="date" id="input-endDate" class="sb-form-input" required>
                        </div>
                    </div>
                    <button type="submit" class="sb-btn-save">שמור פרטים והצג</button>
                </form>
            </div>
        </div>
    `;

    const div = document.createElement('div');
    div.innerHTML = modalHTML;
    document.body.appendChild(div.firstElementChild);
}

// Show the Modal
function openModal(data) {
    const modal = document.getElementById('sb-modal');
    if (!modal) return;
    
    // Pre-populate fields
    const currentData = data || DEFAULT_DATA;
    document.getElementById('input-visitorName').value = currentData.visitorName || '';
    document.getElementById('input-visitorId').value = currentData.visitorId || '';
    document.getElementById('input-baseName').value = currentData.baseName || '';
    document.getElementById('input-id').value = currentData.id || '';
    document.getElementById('input-referenceNumber').value = currentData.referenceNumber || '';
    document.getElementById('input-visitorPhone').value = currentData.visitorPhone || '';
    document.getElementById('input-startDate').value = currentData.startDate || '';
    document.getElementById('input-endDate').value = currentData.endDate || '';

    // Handle close button visibility (hide if first entrance)
    const closeBtn = document.getElementById('sb-modal-close-btn');
    if (!getSavedData()) {
        closeBtn.style.display = 'none';
    } else {
        closeBtn.style.display = 'flex';
    }

    modal.classList.add('active');
}

// Close the Modal
function closeModal() {
    const modal = document.getElementById('sb-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Dynamically Update Page Content based on LocalStorage Data
function updatePageUI(data) {
    if (!data) return;

    const formattedStart = formatDateToHebrew(data.startDate);
    const formattedEnd = formatDateToHebrew(data.endDate);

    // ==========================================
    // INDEX PAGE POPULATION (index.html)
    // ==========================================
    const cardTitle = document.getElementById('baseName');
    if (cardTitle) {
        cardTitle.innerHTML = `<text>אישור כניסה ל${data.baseName}</text>`;
    }
    
    const dateSpan = document.getElementById('date');
    if (dateSpan) {
        dateSpan.innerText = `${formattedStart} - ${formattedEnd}`;
    }

    const permitNumberSpan = document.getElementById('permitNumber');
    if (permitNumberSpan) {
        permitNumberSpan.innerText = data.id;
    }

    const confNumberB = document.getElementById('entry_permits_updates_card_confirmation_number');
    if (confNumberB) {
        confNumberB.innerHTML = ` ${data.referenceNumber}`;
    }

    // ==========================================
    // DETAILS PAGE POPULATION (Smart Base (2).html)
    // ==========================================
    const headerTitle = document.querySelector('.jss149');
    if (headerTitle) {
        headerTitle.innerText = `אישור כניסה - ${data.id}`;
    }

    const nameDiv = document.getElementById('שם מלא');
    if (nameDiv) {
        nameDiv.innerText = data.visitorName;
    }

    const idDiv = document.getElementById('תעודת זהות');
    if (idDiv) {
        idDiv.innerText = data.visitorId;
    }

    const baseDiv = document.getElementById('מחנה');
    if (baseDiv) {
        baseDiv.innerText = data.baseName;
    }
}

// Initialize Everything
document.addEventListener("DOMContentLoaded", () => {
    // 1. Inject custom modal
    injectModal();

    // 2. Attach listeners
    const modalForm = document.getElementById('sb-modal-form');
    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                visitorName: document.getElementById('input-visitorName').value,
                visitorId: document.getElementById('input-visitorId').value,
                baseName: document.getElementById('input-baseName').value,
                id: document.getElementById('input-id').value,
                referenceNumber: document.getElementById('input-referenceNumber').value,
                visitorPhone: document.getElementById('input-visitorPhone').value,
                startDate: document.getElementById('input-startDate').value,
                endDate: document.getElementById('input-endDate').value
            };

            saveDetails(formData);
            updatePageUI(formData);
            closeModal();
            console.log("Smart Base user data updated and saved successfully!");
        });
    }

    const closeBtn = document.getElementById('sb-modal-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeModal();
        });
    }

    // 3. Handle first load setup check
    const savedData = getSavedData();
    if (!savedData) {
        // First entry: show modal immediately
        setTimeout(() => {
            openModal(DEFAULT_DATA);
        }, 300);
    } else {
        // Subsequent entry: populate directly
        updatePageUI(savedData);
    }

    // 4. Hook the "Profile" tab to open the editor
    setTimeout(() => {
        const profileTab = document.getElementById('profile_tab');
        if (profileTab) {
            profileTab.removeAttribute('href'); // Prevent external redirect
            profileTab.style.cursor = 'pointer';
            profileTab.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openModal(getSavedData() || DEFAULT_DATA);
            });
            console.log("Successfully hooked profile tab to editor!");
        }
    }, 600);

    // ==========================================
    // BIND FLAT NAVIGATION EVENTS (NO ANIMATIONS)
    // ==========================================
    setTimeout(() => {
        // Page 1 Card Click Handler
        const card = document.querySelector('.muirtl-s18byi');
        if (card) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                window.location.href = 'Smart Base (2).html';
            });
        }

        // Page 2 Back Arrow Handler (completely flat, no transform transitions)
        const backBtn = document.querySelector('[data-testid="arrowRightBack"]');
        if (backBtn) {
            const clickTarget = backBtn.closest('div') || backBtn;
            clickTarget.style.cursor = 'pointer';
            // Flat hover opacity change
            clickTarget.addEventListener('mouseenter', () => {
                clickTarget.style.opacity = '0.6';
            });
            clickTarget.addEventListener('mouseleave', () => {
                clickTarget.style.opacity = '1';
            });
            clickTarget.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
            console.log("Attached flat back button navigation.");
        }
    }, 500);
});
