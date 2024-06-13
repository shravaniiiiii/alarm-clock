document.addEventListener('DOMContentLoaded', () => {
    const setAlarmButton = document.getElementById('set-alarm-time-btn');

    setAlarmButton.addEventListener('click', () => {
        const alarmDate = document.getElementById('alarm-date').value;
        const alarmTime = document.getElementById('alarm-time').value;
        const alarmTone = document.getElementById('alarm-tone').value;

        if (alarmDate && alarmTime) {
            let alarms = JSON.parse(localStorage.getItem('alarms')) || [];
            const id = alarms.length > 0 ? alarms[alarms.length - 1].id + 1 : 1;
            const alarm = { id, date: alarmDate, time: alarmTime, tone: alarmTone, rang: false };

            alarms.push(alarm);
            localStorage.setItem('alarms', JSON.stringify(alarms));

            window.location.href = 'alarm.html';
        } else {
            alert('Please set both date and time for the alarm.');
        }
    });

    const editAlarm = JSON.parse(localStorage.getItem('editAlarm'));
    if (editAlarm) {
        document.getElementById('alarm-date').value = editAlarm.date;
        document.getElementById('alarm-time').value = editAlarm.time;
        document.getElementById('alarm-tone').value = editAlarm.tone;
        localStorage.removeItem('editAlarm');
    }
});
