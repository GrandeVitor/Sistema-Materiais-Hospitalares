function showTab(tabId, btn) {
    const tabs = document.querySelectorAll(".tab-content");
    tabs.forEach((tab) => tab.classList.remove("active"));

    const buttons = document.querySelectorAll(".tab-btn");
    buttons.forEach((b) => b.classList.remove("active"));

    document.getElementById(tabId).classList.add("active");
    btn.classList.add("active");
}