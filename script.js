const ramadanTimes = [
    { sehri: "5:10 AM", iftar: "5:56 PM" },
    { sehri: "5:09 AM", iftar: "5:57 PM" },
    { sehri: "5:08 AM", iftar: "5:58 PM" },
    { sehri: "5:07 AM", iftar: "5:59 PM" },
    { sehri: "5:06 AM", iftar: "6:00 PM" },
    { sehri: "5:05 AM", iftar: "6:01 PM" },
    { sehri: "5:04 AM", iftar: "6:02 PM" },
    { sehri: "5:03 AM", iftar: "6:03 PM" },
    { sehri: "5:02 AM", iftar: "6:05 PM" },
    { sehri: "5:01 AM", iftar: "6:06 PM" },
    { sehri: "5:00 AM", iftar: "6:07 PM" },
    { sehri: "4:59 AM", iftar: "6:08 PM" },
    { sehri: "4:58 AM", iftar: "6:09 PM" },
    { sehri: "4:57 AM", iftar: "6:10 PM" },
    { sehri: "4:56 AM", iftar: "6:11 PM" },
    { sehri: "4:55 AM", iftar: "6:12 PM" },
    { sehri: "4:54 AM", iftar: "6:13 PM" },
    { sehri: "4:52 AM", iftar: "6:14 PM" },
    { sehri: "4:51 AM", iftar: "6:15 PM" },
    { sehri: "4:50 AM", iftar: "6:16 PM" },
    { sehri: "4:49 AM", iftar: "6:17 PM" },
    { sehri: "4:48 AM", iftar: "6:18 PM" },
    { sehri: "4:47 AM", iftar: "6:19 PM" },
    { sehri: "4:46 AM", iftar: "6:20 PM" },
    { sehri: "4:45 AM", iftar: "6:21 PM" },
    { sehri: "4:44 AM", iftar: "6:22 PM" },
    { sehri: "4:43 AM", iftar: "6:23 PM" },
    { sehri: "4:42 AM", iftar: "6:24 PM" },
    { sehri: "4:41 AM", iftar: "6:25 PM" },
    { sehri: "4:40 AM", iftar: "6:26 PM" }
];

const RAMADAN_START = new Date(2026, 1, 19);
const BASE_MONTH = 1;
const BASE_YEAR = 2026;

const state = {
    selectedDate: null,
    ramadanData: [],
    calendarCells: []
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

function init() {
    state.ramadanData = buildRamadanData();
    state.calendarCells = buildCalendarCells(BASE_YEAR, BASE_MONTH);
    monthLabel.textContent = `${formatMonth(BASE_YEAR, BASE_MONTH)} 2026`;
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
    return ramadanTimes.map((time, index) => {
        const date = new Date(RAMADAN_START);
        date.setDate(RAMADAN_START.getDate() + index);
        return {
            day: index + 1,
            date,
            iso: toISODate(date),
            sehri: time.sehri,
            iftar: time.iftar
        };
    });
}

function buildCalendarCells(year, month) {
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const gridStart = new Date(year, month, 1 - startOffset);
    const cells = [];

    for (let i = 0; i < 42; i += 1) {
        const date = new Date(gridStart);
        date.setDate(gridStart.getDate() + i);
        cells.push({
            date,
            iso: toISODate(date),
            inMonth: date.getMonth() === month
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

function selectDate(iso) {
    state.selectedDate = iso;
    localStorage.setItem("selectedDate", iso);
    renderCalendar();
    updateDetailPanel();
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
    const ramadanEnd = addDays(RAMADAN_START, 29);

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

    if (nowDate < dayDate) {
        detailCountdownLabel.textContent = "Countdown to Sehri";
        detailCountdown.textContent = formatCountdown(sehriTime - now);
        detailStatus.textContent = "Upcoming";
        updateProgress(0, false);
        return;
    }

    if (nowDate > dayDate) {
        detailCountdownLabel.textContent = "Day Complete";
        detailCountdown.textContent = "00:00:00";
        detailStatus.textContent = "Completed";
        updateProgress(100, false);
        return;
    }

    if (now < sehriTime) {
        detailCountdownLabel.textContent = "Countdown to Sehri";
        detailCountdown.textContent = formatCountdown(sehriTime - now);
        detailStatus.textContent = "Upcoming";
        updateProgress(0, true);
        return;
    }

    if (now >= sehriTime && now <= iftarTime) {
        detailCountdownLabel.textContent = "Countdown to Iftar";
        detailCountdown.textContent = formatCountdown(iftarTime - now);
        detailStatus.textContent = "Fasting";
        const percent = ((now - sehriTime) / (iftarTime - sehriTime)) * 100;
        updateProgress(percent, true);
        return;
    }

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
    const [time, period] = timeStr.split(" ");
    const [hourStr, minuteStr] = time.split(":");
    let hours = Number(hourStr);
    const minutes = Number(minuteStr);
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
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function parseISO(iso) {
    if (!iso) return null;
    const [year, month, day] = iso.split("-").map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
}

function stripTime(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, amount) {
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
    themeIcon.textContent = document.body.classList.contains("dark") ? "Dark" : "Light";
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

    document.querySelectorAll(".ripple").forEach((button) => {
        button.addEventListener("click", createRipple);
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

document.addEventListener("DOMContentLoaded", init);