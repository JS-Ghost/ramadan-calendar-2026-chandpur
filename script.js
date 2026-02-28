// Ramadan 2026 prayer times for Chandpur, Bangladesh (Fiqh: Jafria) - Final adjusted times
const ramadanTimesBase = [
    { sehri: "5:11 AM", iftar: "5:55 PM" },  // Feb 19
    { sehri: "5:10 AM", iftar: "5:56 PM" },  // Feb 20
    { sehri: "5:10 AM", iftar: "5:56 PM" },  // Feb 21
    { sehri: "5:09 AM", iftar: "5:57 PM" },  // Feb 22
    { sehri: "5:08 AM", iftar: "5:57 PM" },  // Feb 23
    { sehri: "5:08 AM", iftar: "5:58 PM" },  // Feb 24
    { sehri: "5:07 AM", iftar: "5:58 PM" },  // Feb 25
    { sehri: "5:06 AM", iftar: "5:59 PM" },  // Feb 26
    { sehri: "5:05 AM", iftar: "5:59 PM" },  // Feb 27
    { sehri: "5:04 AM", iftar: "6:00 PM" },  // Feb 28
    { sehri: "5:04 AM", iftar: "6:00 PM" },  // Mar 01
    { sehri: "5:03 AM", iftar: "6:01 PM" },  // Mar 02
    { sehri: "5:02 AM", iftar: "6:01 PM" },  // Mar 03
    { sehri: "5:02 AM", iftar: "6:01 PM" },  // Mar 04
    { sehri: "5:01 AM", iftar: "6:02 PM" },  // Mar 05
    { sehri: "4:59 AM", iftar: "6:02 PM" },  // Mar 06
    { sehri: "4:58 AM", iftar: "6:03 PM" },  // Mar 07
    { sehri: "4:58 AM", iftar: "6:03 PM" },  // Mar 08
    { sehri: "4:57 AM", iftar: "6:04 PM" },  // Mar 09
    { sehri: "4:56 AM", iftar: "6:04 PM" },  // Mar 10
    { sehri: "4:55 AM", iftar: "6:05 PM" },  // Mar 11
    { sehri: "4:54 AM", iftar: "6:05 PM" },  // Mar 12
    { sehri: "4:53 AM", iftar: "6:05 PM" },  // Mar 13
    { sehri: "4:52 AM", iftar: "6:06 PM" },  // Mar 14
    { sehri: "4:51 AM", iftar: "6:06 PM" },  // Mar 15
    { sehri: "4:50 AM", iftar: "6:07 PM" },  // Mar 16
    { sehri: "4:49 AM", iftar: "6:07 PM" },  // Mar 17
    { sehri: "4:48 AM", iftar: "6:07 PM" },  // Mar 18
    { sehri: "4:47 AM", iftar: "6:08 PM" },  // Mar 19
    { sehri: "4:46 AM", iftar: "6:08 PM" }   // Mar 20
];

// Time adjustments for Jafria fiqh (already applied above, set to 0 for no further adjustment)
const TIME_ADJUSTMENTS = {
    SEHRI_OFFSET_MINUTES: 0,    // Times are already adjusted
    IFTAR_OFFSET_MINUTES: 0     // Times are already adjusted
};

// Apply Jafria adjustments to prayer times
const ramadanTimes = ramadanTimesBase.map(time => ({
    sehri: adjustTime(time.sehri, TIME_ADJUSTMENTS.SEHRI_OFFSET_MINUTES),
    iftar: adjustTime(time.iftar, TIME_ADJUSTMENTS.IFTAR_OFFSET_MINUTES)
}));

const RAMADAN_START = new Date(2026, 1, 19);
const BASE_MONTH = 1;
const BASE_YEAR = 2026;

// Adjust prayer times by adding/subtracting minutes (centralized time adjustment logic)
function adjustTime(timeStr, offsetMinutes) {
    const [time, period] = timeStr.split(" ");
    const [hourStr, minuteStr] = time.split(":");
    let hours = Number(hourStr);
    let minutes = Number(minuteStr);

    // convert input to 24-hour before applying offset
    if (period === "PM" && hours !== 12) {
        hours += 12;
    }
    if (period === "AM" && hours === 12) {
        hours = 0;
    }

    // Apply offset
    minutes += offsetMinutes;

    // Handle minute overflow/underflow
    while (minutes < 0) {
        hours -= 1;
        minutes += 60;
    }
    while (minutes >= 60) {
        hours += 1;
        minutes -= 60;
    }

    // Handle 24-hour wrap for hours
    if (hours < 0) hours += 24;
    if (hours >= 24) hours -= 24;

    // Convert back to 12-hour format
    const adjustedPeriod = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours === 0 ? 12 : (hours > 12 ? hours - 12 : hours);

    return `${adjustedHours}:${String(minutes).padStart(2, "0")} ${adjustedPeriod}`;
}

const state = {
    selectedDate: null,
    ramadanData: [],
    calendarCells: [],
    currentMonth: 1,          // Month index (0=Jan, 1=Feb, ..., 11=Dec)
    currentYear: 2026         // Year for multi-year support
};

const calendarGrid = document.getElementById("calendarGrid");
const monthLabel = document.getElementById("monthLabel");
const mobileCards = document.getElementById("mobileCards");
const liveClock = document.getElementById("liveClock");
const iftarBadge = document.getElementById("iftarBadge");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const todayBtn = document.getElementById("todayBtn");
const clearSelectionBtn = document.getElementById("clearSelectionBtn");
const prevDayBtn = document.getElementById("prevDayBtn");
const nextDayBtn = document.getElementById("nextDayBtn");
const prevMonthBtn = document.getElementById("prevMonthBtn");
const nextMonthBtn = document.getElementById("nextMonthBtn");

const detailDay = document.getElementById("detailDay");
const detailDate = document.getElementById("detailDate");
const detailWeekday = document.getElementById("detailWeekday");
const detailStatus = document.getElementById("detailStatus");
const detailSehri = document.getElementById("detailSehri");
const detailIftar = document.getElementById("detailIftar");
const detailCountdownLabel = document.getElementById("detailCountdownLabel");
const detailCountdown = document.getElementById("detailCountdown");
const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");
const progressNote = document.getElementById("progressNote");
const detailPanel = document.getElementById("detailPanel");
const detailCloseBtn = document.getElementById("detailCloseBtn");

function init() {
    // Initialize current month/year from constants
    state.currentMonth = BASE_MONTH;
    state.currentYear = BASE_YEAR;

    state.ramadanData = buildRamadanData();
    state.calendarCells = buildCalendarCells(state.currentYear, state.currentMonth);
    updateMonthLabel();
    initTheme();
    restoreSelection();
    renderMobileCards();
    bindEvents();
    updateClock();
    updateCountdowns();
    setInterval(() => {
        updateClock();
        updateCountdowns();
    }, 1000);
}

function buildRamadanData() {
    // Create 30 Ramadan days from base start date with corresponding prayer times
    return ramadanTimes.map((time, index) => {
        const date = new Date(RAMADAN_START);
        date.setDate(RAMADAN_START.getDate() + index);  // Increment day by day
        return {
            day: index + 1,  // Ramadan day number (1-30)
            date,
            iso: toISODate(date),
            sehri: time.sehri,  // Adjusted for Jafria (-10 min)
            iftar: time.iftar   // Adjusted for Jafria (+10 min)
        };
    });
}

function buildCalendarCells(year, month) {
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();  // Day of week (0=Sunday)
    // Start grid from previous month to fill first week
    const gridStart = new Date(year, month, 1 - startOffset);
    const cells = [];

    // Create 42 cells (6 weeks × 7 days) for calendar grid
    for (let i = 0; i < 42; i += 1) {
        const date = new Date(gridStart);
        date.setDate(gridStart.getDate() + i);
        cells.push({
            date,
            iso: toISODate(date),
            inMonth: date.getMonth() === month  // Flag to gray out non-current month dates
        });
    }

    return cells;
}

function renderCalendar() {
    calendarGrid.innerHTML = "";
    const todayIso = toISODate(new Date());

    state.calendarCells.forEach((cell) => {
        const ramadanInfo = getRamadanInfo(cell.iso);
        const element = document.createElement("div");
        element.className = "calendar-cell";
        if (!cell.inMonth) element.classList.add("is-outside");
        if (cell.iso === todayIso) element.classList.add("is-today");
        if (cell.iso === state.selectedDate) element.classList.add("is-selected");
        if (cell.date.getDay() === 5) element.classList.add("is-friday");
        if (ramadanInfo && ramadanInfo.day === 27) element.classList.add("is-golden");

        // highlight first/middle/last 10 days
        if (ramadanInfo) {
            if (ramadanInfo.day <= 10) element.classList.add("first-decade");
            else if (ramadanInfo.day <= 20) element.classList.add("middle-decade");
            else element.classList.add("last-decade");
        }

        element.innerHTML = `
            <div class="date-number">${cell.date.getDate()}</div>
            ${ramadanInfo ? `
                <div class="ramadan-pill">
                    <strong>Ramadan Day ${ramadanInfo.day}</strong>
                    <span>Sehri ${ramadanInfo.sehri}</span>
                    <span>Iftar ${ramadanInfo.iftar}</span>
                </div>
            ` : ""}
        `;

        element.addEventListener("click", () => {
            selectDate(cell.iso);
        });

        calendarGrid.appendChild(element);
    });
}

function renderMobileCards() {
    mobileCards.innerHTML = "";
    state.ramadanData.forEach((day) => {
        const card = document.createElement("div");
        card.className = "mobile-card";
        // apply decade class for color coding
        if (day.day <= 10) card.classList.add("first-decade");
        else if (day.day <= 20) card.classList.add("middle-decade");
        else card.classList.add("last-decade");
        card.innerHTML = `
            <strong>Ramadan Day ${day.day}</strong>
            <span>${formatLongDate(day.date)}</span>
            <span>Sehri: ${day.sehri}</span>
            <span>Iftar: ${day.iftar}</span>
        `;
        card.addEventListener("click", () => selectDate(day.iso));
        mobileCards.appendChild(card);
    });
}

// Update month label to show current month only (prevents confusion with next month)
function updateMonthLabel() {
    const monthName = formatMonth(state.currentYear, state.currentMonth);
    monthLabel.textContent = `${monthName} ${state.currentYear}`;
}

// Navigate to previous month
function prevMonth() {
    state.currentMonth -= 1;
    if (state.currentMonth < 0) {
        state.currentMonth = 11;
        state.currentYear -= 1;
    }
    refreshMonthView();
}

// Navigate to next month
function nextMonth() {
    state.currentMonth += 1;
    if (state.currentMonth > 11) {
        state.currentMonth = 0;
        state.currentYear += 1;
    }
    refreshMonthView();
}

// Refresh the entire month view after month change
function refreshMonthView() {
    state.calendarCells = buildCalendarCells(state.currentYear, state.currentMonth);
    updateMonthLabel();
    renderCalendar();
    // Clear selection when month changes for cleaner UX
    state.selectedDate = null;
    updateDetailPanel();
}

function selectDate(iso) {
    state.selectedDate = iso;
    localStorage.setItem("selectedDate", iso);
    renderCalendar();
    updateDetailPanel();
    // show bottom sheet on narrow screens
    if (window.innerWidth <= 768 && detailPanel) {
        showDetailPanel();
    }
}

/* MOBILE OPTIMIZATION: detail panel helpers */
function showDetailPanel() {
    if (!detailPanel) return;
    detailPanel.classList.add('open');
}
function hideDetailPanel() {
    if (!detailPanel) return;
    detailPanel.classList.remove('open');
} 

function updateDetailPanel() {
    const info = getRamadanInfo(state.selectedDate);
    const date = info ? info.date : parseISO(state.selectedDate);
    if (!date) return;

    detailDay.textContent = info ? `Ramadan Day ${info.day}` : "Not in Ramadan";
    detailDate.textContent = formatLongDate(date);
    detailWeekday.textContent = formatWeekday(date);
    detailSehri.textContent = info ? info.sehri : "-";
    detailIftar.textContent = info ? info.iftar : "-";
    updateCountdowns();
}

function updateClock() {
    const now = new Date();
    liveClock.textContent = now.toLocaleTimeString("en-US");
}

function updateCountdowns() {
    const now = new Date();
    const todayInfo = getRamadanInfo(toISODate(now));
    updateHeaderBadge(now, todayInfo);
    updateDetailCountdown(now);
}

function updateHeaderBadge(now, todayInfo) {
    // Ramadan is 29 or 30 days. Most commonly observed as 30 days.
    const RAMADAN_DAYS = 30;
    const ramadanEnd = addDays(RAMADAN_START, RAMADAN_DAYS - 1);  // Last day of Ramadan

    if (now < RAMADAN_START) {
        iftarBadge.textContent = `Ramadan starts in ${formatCountdown(RAMADAN_START - now)}`;
        return;
    }

    if (now > ramadanEnd) {
        iftarBadge.textContent = "Ramadan has ended";
        return;
    }

    if (!todayInfo) return;

    const todayDate = stripTime(now);
    const sehriTime = parseTime(todayInfo.sehri, todayDate);
    const iftarTime = parseTime(todayInfo.iftar, todayDate);
    let target = iftarTime;
    let label = "Next Iftar in";

    // If past iftar, show next day's sehri countdown
    if (now > iftarTime) {
        const nextInfo = getRamadanInfo(toISODate(addDays(todayDate, 1)));
        if (nextInfo) {
            target = parseTime(nextInfo.sehri, addDays(todayDate, 1));
            label = "Next Sehri in";
        }
    }

    iftarBadge.textContent = `${label} ${formatCountdown(target - now)}`;
}

function updateDetailCountdown(now) {
    const selected = state.selectedDate;
    if (!selected) return;
    const info = getRamadanInfo(selected);

    // If selected date is not in Ramadan, show default state
    if (!info) {
        detailCountdownLabel.textContent = "Not in Ramadan";
        detailCountdown.textContent = "--:--:--";
        progressFill.style.width = "0%";
        progressPercent.textContent = "0%";
        progressNote.textContent = "";
        detailStatus.textContent = "";
        return;
    }

    const dayDate = stripTime(info.date);
    const nowDate = stripTime(now);
    const sehriTime = parseTime(info.sehri, dayDate);
    const iftarTime = parseTime(info.iftar, dayDate);

    // Case 1: Selected date is in the future
    if (nowDate < dayDate) {
        detailCountdownLabel.textContent = "Countdown to Sehri";
        detailCountdown.textContent = formatCountdown(sehriTime - now);
        detailStatus.textContent = "Upcoming";
        updateProgress(0, false);
        return;
    }

    // Case 2: Selected date is in the past
    if (nowDate > dayDate) {
        detailCountdownLabel.textContent = "Day Complete";
        detailCountdown.textContent = "00:00:00";
        detailStatus.textContent = "Completed";
        updateProgress(100, false);
        return;
    }

    // Case 3: Selected date is today - check time of day
    if (now < sehriTime) {
        // Before sehri
        detailCountdownLabel.textContent = "Countdown to Sehri";
        detailCountdown.textContent = formatCountdown(sehriTime - now);
        detailStatus.textContent = "Upcoming";
        updateProgress(0, true);
        return;
    }

    if (now >= sehriTime && now <= iftarTime) {
        // During fasting period - show live progress
        detailCountdownLabel.textContent = "Countdown to Iftar";
        detailCountdown.textContent = formatCountdown(iftarTime - now);
        detailStatus.textContent = "Fasting";
        const percent = ((now - sehriTime) / (iftarTime - sehriTime)) * 100;
        updateProgress(percent, true);
        return;
    }

    // After iftar
    detailCountdownLabel.textContent = "Next Sehri";
    detailCountdown.textContent = "00:00:00";
    detailStatus.textContent = "Completed";
    updateProgress(100, true);
}

function updateProgress(value, isToday) {
    const safeValue = Math.min(100, Math.max(0, value));
    progressFill.style.width = `${safeValue.toFixed(0)}%`;
    progressPercent.textContent = `${safeValue.toFixed(0)}%`;
    progressNote.textContent = isToday ? "Live progress for today." : "Select today to see live progress.";
}

function getRamadanInfo(iso) {
    return state.ramadanData.find((day) => day.iso === iso) || null;
}

function formatMonth(year, month) {
    const date = new Date(year, month, 1);
    return date.toLocaleDateString("en-US", { month: "long" });
}

function formatLongDate(date) {
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });
}

function formatWeekday(date) {
    return date.toLocaleDateString("en-US", { weekday: "long" });
}

function parseTime(timeStr, baseDate) {
    // Parse "HH:MM AM/PM" string and convert to Date object on given base date
    const [time, period] = timeStr.split(" ");
    const [hourStr, minuteStr] = time.split(":");
    let hours = Number(hourStr);
    const minutes = Number(minuteStr);

    // Convert 12-hour format to 24-hour format
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    const date = new Date(baseDate);
    date.setHours(hours, minutes, 0, 0);
    return date;
}

function formatCountdown(ms) {
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor((totalSeconds / 3600) % 24)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds / 60) % 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

function toISODate(date) {
    // Convert Date object to ISO string format (YYYY-MM-DD) for consistent comparison
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function parseISO(iso) {
    // Parse ISO date string (YYYY-MM-DD) to Date object
    if (!iso) return null;
    const [year, month, day] = iso.split("-").map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
}

function stripTime(date) {
    // Remove time component from Date, keeping only year/month/day (midnight local time)
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, amount) {
    // Add days to a Date and return new Date object
    const next = new Date(date);
    next.setDate(date.getDate() + amount);
    return next;
}

function initTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
        document.body.classList.add("dark");
    }
    updateThemeLabel();
}

function toggleTheme() {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
    updateThemeLabel();
}

function updateThemeLabel() {
    const isDark = document.body.classList.contains("dark");
    themeIcon.textContent = isDark ? "☀️" : "🌙";
}

function restoreSelection() {
    const saved = localStorage.getItem("selectedDate");
    if (saved) {
        state.selectedDate = saved;
    } else {
        const todayIso = toISODate(new Date());
        state.selectedDate = getRamadanInfo(todayIso) ? todayIso : state.ramadanData[0].iso;
    }
    updateDetailPanel();
    renderCalendar();
}

function shiftSelection(step) {
    const current = getRamadanInfo(state.selectedDate);
    if (!current) return;
    const nextIndex = current.day - 1 + step;
    if (nextIndex < 0 || nextIndex >= state.ramadanData.length) return;
    selectDate(state.ramadanData[nextIndex].iso);
}

function bindEvents() {
    themeToggle.addEventListener("click", toggleTheme);
    todayBtn.addEventListener("click", () => {
        const todayIso = toISODate(new Date());
        if (getRamadanInfo(todayIso)) {
            selectDate(todayIso);
        }
    });
    clearSelectionBtn.addEventListener("click", () => {
        state.selectedDate = null;
        localStorage.removeItem("selectedDate");
        restoreSelection();
        renderCalendar();
    });
    prevDayBtn.addEventListener("click", () => shiftSelection(-1));
    nextDayBtn.addEventListener("click", () => shiftSelection(1));
    prevMonthBtn.addEventListener("click", prevMonth);
    nextMonthBtn.addEventListener("click", nextMonth);

    // bottom navigation (duplicate) for easy access after scrolling
    const prevBottom = document.getElementById("prevMonthBtnBottom");
    const nextBottom = document.getElementById("nextMonthBtnBottom");
    if (prevBottom) prevBottom.addEventListener("click", prevMonth);
    if (nextBottom) nextBottom.addEventListener("click", nextMonth);

    document.querySelectorAll(".ripple").forEach((button) => {
        button.addEventListener("click", createRipple);
    });

    // close button for mobile detail panel
    if (detailCloseBtn) {
        detailCloseBtn.addEventListener('click', hideDetailPanel);
    }
    // also hide panel when tapping outside on narrow screens
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && detailPanel && detailPanel.classList.contains('open')) {
            if (!detailPanel.contains(e.target) && !e.target.closest('.calendar-cell') && !e.target.closest('.mobile-card')) {
                hideDetailPanel();
            }
        }
    });
}

function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = `${diameter}px`;
    circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple-effect");

    const existing = button.querySelector(".ripple-effect");
    if (existing) existing.remove();
    button.appendChild(circle);
}

window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && detailPanel) {
        hideDetailPanel();
    }
});

document.addEventListener("DOMContentLoaded", init);