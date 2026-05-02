// --- Глобальные переменные ---

let tasks = [

    {

        id: 1,

        title: "Разработка макетов UI",

        desc: "Создать главные экраны: Главная, Профиль, Календарь",

        deadline: "2023-10-25",

        status: "В процессе",

        color: "#ff6b00",

        tags: ["Дизайн"],

        subtasks: ["Экран входа", "Экран задач"],

        pinned: false // Новое поле для закрепления

    }

];



// Текущая дата для календаря

let currentDate = new Date();



// --- Инициализация ---

document.addEventListener('DOMContentLoaded', () => {

    renderTasks();

    renderCalendar(currentDate); // Начинаем с текущей даты

    

    document.getElementById('task-form').addEventListener('submit', (e) => {

        e.preventDefault();

        saveTask();

    });

});



// --- Функции отрисовки ---



// Отрисовка списка задач

function renderTasks() {

    const list = document.getElementById('tasks-list');

    list.innerHTML = '';



    // Разделяем задачи на закрепленные и обычные

    const pinnedTasks = tasks.filter(task => task.pinned);

    const otherTasks = tasks.filter(task => !task.pinned);



    // Объединяем, закрепленные идут первыми

    const sortedTasks = [...pinnedTasks, ...otherTasks];



    sortedTasks.forEach(task => {

        const div = document.createElement('div');

        div.className = `task-card ${task.pinned ? 'pinned' : ''}`; // Добавляем класс pinned

        div.style.borderLeftColor = task.color;

        

        // Клик по карточке открывает детали, но не если кликнули по чекбоксу, пину или крестику

        div.onclick = () => showTaskDetails(task.id);



        div.innerHTML = `

            <div class="task-title-wrapper">

                <input type="checkbox" class="task-checkbox" 

                    ${task.status === 'Готов' ? 'checked' : ''} 

                    onclick="event.stopPropagation(); toggleTaskStatus(${task.id})">

                

                <i class="fas fa-thumbtack pin-task-icon ${task.pinned ? 'pinned' : ''}" 

                   onclick="event.stopPropagation(); togglePinTask(${task.id})"></i>

                

                <span class="task-title-text ${task.status === 'Готов' ? 'completed' : ''}">${task.title}</span>

            </div>

            

            <div class="task-actions-right">

                <div class="task-deadline-display">${task.deadline}</div>

                <div class="task-status-display">${task.status}</div>

                

                <i class="fas fa-times delete-task-icon" onclick="event.stopPropagation(); deleteTask(${task.id})"></i>

            </div>

        `;

        list.appendChild(div);

    });

}



// Отрисовка календаря (теперь на месяц) (Пункт 1 и 2)

function renderCalendar(date) {

    const calendarGrid = document.getElementById('calendar-week');

    const monthEl = document.getElementById('current-month');

    

    // Очищаем предыдущие дни, оставляя кнопки навигации

    const headerElements = document.querySelectorAll('.calendar-header > *');

    calendarGrid.innerHTML = ''; // Очищаем сетку

    headerElements.forEach(el => document.querySelector('.calendar-header').appendChild(el)); // Возвращаем кнопки



    const year = date.getFullYear();

    const month = date.getMonth(); // 0 = Январь, 11 = Декабрь



    monthEl.innerText = `${date.toLocaleString('ru', { month: 'long', year: 'numeric' })} г.`;



    const firstDayOfMonth = new Date(year, month, 1);

    const lastDayOfMonth = new Date(year, month + 1, 0); // 0-й день следующего месяца = последний день текущего

    const daysInMonth = lastDayOfMonth.getDate();

    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Воскресенье, 1 = Понедельник ... 6 = Суббота



    // Добавляем названия дней недели (если их нет)

    if (!document.querySelector('.day-name')) {

        const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

        dayNames.forEach(name => {

            const dayNameEl = document.createElement('div');

            dayNameEl.className = 'day-name';

            dayNameEl.innerText = name;

            calendarGrid.prepend(dayNameEl); // Добавляем в начало, чтобы были перед числами

        });

    }

    

    // Добавляем пустые ячейки до первого дня месяца

    const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

    // Корректируем стартовый день, если воскресенье = 0, а нам нужно, чтобы понедельник был первым

    const adjustedStartingDayOfWeek = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1; // 0 -> 6, 1 -> 0, 2 -> 1 ...

    for (let i = 0; i < adjustedStartingDayOfWeek; i++) {

        const emptyCell = document.createElement('div');

        emptyCell.className = 'day-cell';

        calendarGrid.appendChild(emptyCell);

    }



    // Добавляем дни месяца

    for (let i = 1; i <= daysInMonth; i++) {

        const dayCell = document.createElement('div');

        const dayDate = new Date(year, month, i);

        const dayISO = dayDate.toISOString().split('T')[0];

        const isToday = dayDate.toDateString() === new Date().toDateString();



        dayCell.className = `day-cell ${isToday ? 'today' : ''}`;

        dayCell.innerHTML = `<span>${i}</span>`;



        // Добавляем цветные точки задач

        const dotsContainer = document.createElement('div');

        dotsContainer.className = 'dots-container';

        

        const dayTasks = tasks.filter(t => t.deadline === dayISO);

        dayTasks.forEach(t => {

            const dot = document.createElement('span');

            dot.className = 'dot';

            dot.style.backgroundColor = t.color;

            dotsContainer.appendChild(dot);

        });



        dayCell.appendChild(dotsContainer);

        calendarGrid.appendChild(dayCell);

    }

}



// --- Функции управления задачами ---



// Переключение статуса задачи (Готов/В процессе)

function toggleTaskStatus(id) {

    const task = tasks.find(t => t.id === id);

    if (task) {

        task.status = task.status === 'Готов' ? 'В процессе' : 'Готов';

        renderTasks();

        // Не перерисовываем календарь, т.к. дата не меняется

    }

}



// Удаление задачи (Пункт 3)

function deleteTask(id) {

    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {

        tasks = tasks.filter(task => task.id !== id);

        renderTasks();

        renderCalendar(currentDate); // Перерисовываем календарь, чтобы убрать точки

    }

}



// Закрепление/открепление задачи (Пункт 4)

function togglePinTask(id) {

    const task = tasks.find(t => t.id === id);

    if (task) {

        task.pinned = !task.pinned;

        renderTasks(); // Перерисовываем список задач, чтобы обновить порядок и стили

    }

}



// --- Функции календаря ---



// Переход на предыдущий месяц (Пункт 2)

function prevMonth() {

    currentDate.setMonth(currentDate.getMonth() - 1);

    renderCalendar(currentDate);

}



// Переход на следующий месяц (Пункт 2)

function nextMonth() {

    currentDate.setMonth(currentDate.getMonth() + 1);

    renderCalendar(currentDate);

}



// --- Функции модального окна создания задачи ---

function openModal(id) { document.getElementById(id).style.display = 'flex'; }

function closeModal(id) { document.getElementById(id).style.display = 'none'; }



function addSubtaskInput() {

    const container = document.getElementById('subtasks-list-input');

    const input = document.createElement('input');

    input.type = 'text';

    input.placeholder = 'Название подзадачи';

    input.className = 'subtask-item';

    container.appendChild(input);

}



function saveTask() {

    const title = document.getElementById('task-name').value;

    const desc = document.getElementById('task-desc').value;

    const deadline = document.getElementById('task-deadline').value;

    const status = document.getElementById('task-status').value;

    const color = document.getElementById('task-color').value;

    const tags = document.getElementById('task-tags').value.split(',').map(t => t.trim()).filter(t => t !== ''); // Фильтруем пустые теги

    

    const subtaskInputs = document.querySelectorAll('.subtask-item');

    const subtasks = Array.from(subtaskInputs).map(i => i.value).filter(v => v !== '');



    const newTask = {

        id: Date.now(),

        title, desc, deadline, status, color, tags, subtasks,

        pinned: false // Новая задача не закреплена по умолчанию

    };



    tasks.push(newTask);

    renderTasks();

    renderCalendar(currentDate); // Перерисовываем календарь, чтобы отобразить новые точки

    closeModal('createTaskModal');

    document.getElementById('task-form').reset();

    document.getElementById('subtasks-list-input').innerHTML = '';

}



// --- Функции страницы деталей задачи ---

function showTaskDetails(id) {

    const task = tasks.find(t => t.id === id);

    const container = document.getElementById('full-task-content');

    

    container.innerHTML = `

        <div class="details-card">

            <div class="edit-form-group">

                <label>Название задачи</label>

                <input type="text" id="edit-title" value="${task.title}" onchange="updateTaskField(${task.id}, 'title', this.value)">

            </div>

            

            <div class="form-row">

                <div class="edit-form-group">

                    <label>Дедлайн</label>

                    <input type="date" id="edit-deadline" value="${task.deadline}" onchange="updateTaskField(${task.id}, 'deadline', this.value)">

                </div>

                <div class="edit-form-group">

                    <label>Статус</label>

                    <select id="edit-status" onchange="updateTaskField(${task.id}, 'status', this.value)">

                        <option value="В процессе" ${task.status === 'В процессе' ? 'selected' : ''}>В процессе</option>

                        <option value="Готов" ${task.status === 'Готов' ? 'selected' : ''}>Готов</option>

                        <option value="Заморожен" ${task.status === 'Заморожен' ? 'selected' : ''}>Заморожен</option>

                    </select>

                </div>

                <div class="edit-form-group">

                    <label>Цвет</label>

                    <input type="color" value="${task.color}" onchange="updateTaskField(${task.id}, 'color', this.value)">

                </div>

            </div>



            <div class="edit-form-group">

                <label>Описание</label>

                <textarea id="edit-desc" rows="4" onchange="updateTaskField(${task.id}, 'desc', this.value)">${task.desc}</textarea>

            </div>



            <h3>Подзадачи</h3>

            <ul id="details-subtasks">

                ${task.subtasks.map((s, index) => `<li><input type="checkbox" onchange="updateSubtaskStatus(${task.id}, ${index}, this.checked)"> ${s}</li>`).join('')}

            </ul>

            

            <button class="btn-save" onclick="saveAndExitTaskDetails(${task.id})" style="margin-top:20px">Сохранить и выйти</button>

        </div>

    `;

    showView('details');

}



// Функция для мгновенного обновления данных задачи (Пункт 4)

function updateTaskField(id, field, value) {

    const task = tasks.find(t => t.id === id);

    if (task) {

        task[field] = value;

        renderTasks(); // Обновляем главный экран в фоне

    }

}



// Функция для обновления статуса подзадачи

function updateSubtaskStatus(taskId, subtaskIndex, isChecked) {

    const task = tasks.find(t => t.id === taskId);

    // Здесь логика обновления статуса подзадачи (пока просто перерисовываем, т.к. в макете нет хранения статусов подзадач)

    // Для полного функционала понадобится массив статусов для каждой подзадачи.

    renderTasks(); // Перерисовываем, чтобы отразить изменения (если они будут)

}



// Сохранить и выйти из режима редактирования задачи

function saveAndExitTaskDetails(id) {

    // По факту, все изменения сохраняются мгновенно через onchange.

    // Эта функция просто возвращает на главный экран.

    showView('dashboard');

}
