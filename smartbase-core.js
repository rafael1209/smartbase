/* ==========================================================================
   Smart Base Core Logic (smartbase-core.js)
   Handles state management (LocalStorage), dynamic UI updates, profile edit modal,
   and custom iOS rubber-band elastic scroll bounce effect
   ========================================================================== */

// Helper to format Date YYYY-MM-DD into DD.MM.YY Hebrew format
function formatDateToHebrew(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const year = parts[0].substring(2);
    const month = parts[1];
    const day = parts[2];
    return `${day}.${month}.${year}`;
}

// Actual Default Original Data Model (Fallback if everything is missing)
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

// Generic MOCK / Fake Data Model (Shown in the form fields on first load)
const MOCK_DATA = {
    id: "1234567",
    baseName: "100000",
    visitorId: "999999999",
    visitorName: "ישראל ישראלי",
    visitorPhone: "0501234567",
    startDate: "2026-05-01",
    endDate: "2028-05-01",
    referenceNumber: "999999"
};

// Retrieve data from localStorage or fallback to null
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
                        <input type="text" id="input-visitorName" class="sb-form-input" required placeholder="לדוגמה: ישראל ישראלי">
                    </div>
                    <div class="sb-form-row">
                        <div class="sb-form-group">
                            <label class="sb-form-label">תעודת זהות</label>
                            <input type="text" id="input-visitorId" class="sb-form-input" required placeholder="לדוגמה: 999999999">
                        </div>
                        <div class="sb-form-group">
                            <label class="sb-form-label">מספר מחנה / בסיס</label>
                            <input type="text" id="input-baseName" class="sb-form-input" required placeholder="לדוגמה: 100000">
                        </div>
                    </div>
                    <div class="sb-form-row">
                        <div class="sb-form-group">
                            <label class="sb-form-label">מספר פנייה / מזהה</label>
                            <input type="text" id="input-id" class="sb-form-input" required placeholder="לדוגמה: 1234567">
                        </div>
                        <div class="sb-form-group">
                            <label class="sb-form-label">קוד אישור</label>
                            <input type="text" id="input-referenceNumber" class="sb-form-input" required placeholder="לדוגמה: 999999">
                        </div>
                    </div>
                    <div class="sb-form-group">
                        <label class="sb-form-label">מספר טלפון</label>
                        <input type="text" id="input-visitorPhone" class="sb-form-input" required placeholder="לדוגמה: 0501234567">
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
    
    const currentData = data || DEFAULT_DATA;
    document.getElementById('input-visitorName').value = currentData.visitorName || '';
    document.getElementById('input-visitorId').value = currentData.visitorId || '';
    document.getElementById('input-baseName').value = currentData.baseName || '';
    document.getElementById('input-id').value = currentData.id || '';
    document.getElementById('input-referenceNumber').value = currentData.referenceNumber || '';
    document.getElementById('input-visitorPhone').value = currentData.visitorPhone || '';
    document.getElementById('input-startDate').value = currentData.startDate || '';
    document.getElementById('input-endDate').value = currentData.endDate || '';

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

    // INDEX PAGE POPULATION (index.html)
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

    // DETAILS PAGE POPULATION (Smart Base (2).html)
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

// Premium iOS-style elastic rubber-band bounce scroll effect for both desktop & mobile
function enableIOSRubberBandScroll() {
    const scrollContainer = document.querySelector('.jss17') || document.querySelector('.jss18');
    if (!scrollContainer) return;
    
    // We will apply the transform to the direct child wrapper inside the scroll container
    const content = scrollContainer.firstElementChild;
    if (!content) return;
    
    content.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    let isOverscrolling = false;
    
    // Touch Events
    scrollContainer.addEventListener('touchstart', (e) => {
        startY = e.touches[0].pageY;
        content.style.transition = 'none'; // Disable transition during drag
        isDragging = true;
    }, { passive: true });
    
    scrollContainer.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentY = e.touches[0].pageY;
        let deltaY = currentY - startY;
        
        const scrollTop = scrollContainer.scrollTop;
        const scrollHeight = scrollContainer.scrollHeight;
        const clientHeight = scrollContainer.clientHeight;
        const maxScroll = scrollHeight - clientHeight;
        
        if (scrollTop === 0 && deltaY > 0) {
            // Dragging down at top boundary
            isOverscrolling = true;
            // Logarithmic spring physics
            const offset = Math.pow(deltaY, 0.73);
            content.style.transform = `translateY(${offset}px)`;
        } else if (scrollTop >= maxScroll - 2 && deltaY < 0) {
            // Dragging up at bottom boundary
            isOverscrolling = true;
            const offset = -Math.pow(-deltaY, 0.73);
            content.style.transform = `translateY(${offset}px)`;
        } else {
            isOverscrolling = false;
        }
    }, { passive: true });
    
    const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        if (isOverscrolling) {
            content.style.transition = 'transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.22)'; // Spring bounce-back ease
            content.style.transform = 'translateY(0)';
            isOverscrolling = false;
        }
    };
    
    scrollContainer.addEventListener('touchend', endDrag);
    scrollContainer.addEventListener('touchcancel', endDrag);
    
    // Desktop Mouse Drag Events (to support interactive bouncing on PC Chrome/DevTools!)
    let isMouseDown = false;
    
    scrollContainer.addEventListener('mousedown', (e) => {
        // Do not drag if clicking form controls or modals
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.closest('#sb-modal')) return;
        isMouseDown = true;
        startY = e.pageY;
        content.style.transition = 'none';
    });
    
    window.addEventListener('mousemove', (e) => {
        if (!isMouseDown) return;
        currentY = e.pageY;
        let deltaY = currentY - startY;
        
        const scrollTop = scrollContainer.scrollTop;
        const scrollHeight = scrollContainer.scrollHeight;
        const clientHeight = scrollContainer.clientHeight;
        const maxScroll = scrollHeight - clientHeight;
        
        if (scrollTop === 0 && deltaY > 0) {
            isOverscrolling = true;
            const offset = Math.pow(deltaY, 0.73);
            content.style.transform = `translateY(${offset}px)`;
        } else if (scrollTop >= maxScroll - 2 && deltaY < 0) {
            isOverscrolling = true;
            const offset = -Math.pow(-deltaY, 0.73);
            content.style.transform = `translateY(${offset}px)`;
        }
    });
    
    window.addEventListener('mouseup', () => {
        if (!isMouseDown) return;
        isMouseDown = false;
        if (isOverscrolling) {
            content.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.2)';
            content.style.transform = 'translateY(0)';
            isOverscrolling = false;
        }
    });
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
        setTimeout(() => {
            openModal(MOCK_DATA);
        }, 300);
    } else {
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

        // Page 2 Back Arrow Handler (completely flat)
        const backBtn = document.querySelector('[data-testid="arrowRightBack"]');
        if (backBtn) {
            const clickTarget = backBtn.closest('div') || backBtn;
            clickTarget.style.cursor = 'pointer';
            clickTarget.addEventListener('mouseenter', () => {
                clickTarget.style.opacity = '0.6';
            });
            clickTarget.addEventListener('mouseleave', () => {
                clickTarget.style.opacity = '1';
            });
            clickTarget.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }

        // 5. Initialize the Premium iOS rubber-band bounce scroll effect!
        enableIOSRubberBandScroll();
    }, 500);
});
