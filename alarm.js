document.addEventListener('DOMContentLoaded', () => {
    const currentTimeElement = document.getElementById('current-time');
    const currentDateElement = document.getElementById('current-date');
    const alarmAudio = new Audio();
    const alarmListElement = document.getElementById('alarm-list');
    const alarmModal = document.getElementById('alarm-modal');
    const snoozeButton = document.getElementById('snooze-btn');
    const dismissButton = document.getElementById('dismiss-btn');

    let alarms = JSON.parse(localStorage.getItem('alarms')) || [];

    function updateTime() {
        const now = new Date();
        currentTimeElement.textContent = now.toLocaleTimeString();
        currentDateElement.textContent = now.toLocaleDateString();

        alarms.forEach(alarm => {
            const alarmDate = new Date(`${alarm.date}T${alarm.time}`);
            if (alarmDate.getTime() <= now.getTime() && !alarm.rang) {
                alarmAudio.src = `sounds/${alarm.tone}.mp3`;
                alarmAudio.play();
                alarm.rang = true;
                showAlarmModal(alarm);
                updateLocalStorage();
            }
        });
    }

    function showAlarmModal(alarm) {
        alarmModal.classList.remove('hide');
        snoozeButton.onclick = () => snoozeAlarm(alarm);
        dismissButton.onclick = () => dismissAlarm(alarm);
    }

    function hideAlarmModal() {
        alarmModal.classList.add('hide');
    }

    function addAlarmToList(alarm) {
        const li = document.createElement('li');
        li.innerHTML = `
            ${alarm.date} ${alarm.time} - ${alarm.tone}
            <button class="button" onclick="editAlarm(${alarm.id})">Edit</button>
            <button class="button" onclick="deleteAlarm(${alarm.id})">Delete</button>
        `;
        alarmListElement.appendChild(li);
    }

    window.editAlarm = (id) => {
        const alarm = alarms.find(alarm => alarm.id === id);
        if (alarm) {
            localStorage.setItem('editAlarm', JSON.stringify(alarm));
            deleteAlarm(id);
            window.location.href = 'set_alarm.html';
        }
    };

    window.deleteAlarm = (id) => {
        alarms = alarms.filter(alarm => alarm.id !== id);
        updateLocalStorage();
        updateAlarmList();
    };

    function snoozeAlarm(alarm) {
        hideAlarmModal();
        alarmAudio.pause();
        alarmAudio.currentTime = 0;
        const snoozeTime = new Date();
        snoozeTime.setMinutes(snoozeTime.getMinutes() + 5);
        alarm.time = snoozeTime.toTimeString().slice(0, 5);
        alarm.rang = false;
        updateLocalStorage();
        updateAlarmList();
    }

    function dismissAlarm(alarm) {
        hideAlarmModal();
        alarmAudio.pause();
        alarmAudio.currentTime = 0;
        alarm.rang = true;
        updateLocalStorage();
    }

    function updateLocalStorage() {
        localStorage.setItem('alarms', JSON.stringify(alarms));
    }

    function updateAlarmList() {
        alarmListElement.innerHTML = '';
        alarms.forEach(addAlarmToList);
    }

    setInterval(updateTime, 1000);
    updateTime();
    updateAlarmList();
});
