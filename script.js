// Хранилище задач (в реальном проекте тут был бы API или LocalStorage)

let tasks = [

    {

        id: 1,

        title: "Разработка макетов UI",

        desc: "Создать главные экраны: Главная, Профиль, Календарь",

        deadline: "2023-10-25",

        status: "В процессе",

        color: "#ff6b00",

        tags: ["Дизайн"],

        subtasks: ["Экран входа", "Экран задач"]

    }

];



// Инициализация

document.addEventListener('DOMContentLoaded', () => {

    renderTasks();

    renderCalendar();

    

    // Обработка формы

    document.getElementById('task-form').addEventListener('submit', (e) => {

        e.preventDefault();

        saveTask();

    });

});



// Рендер списка задач на главном экране

function renderTasks() {

    const list = document.getElementById('tasks-list');

    list.innerHTML = '';



    tasks.forEach(task => {

        const div = document.createElement('div');

        div.className = 'task-card';

        div.style.borderLeftColor = task.color;

        div.onclick = () => showTaskDetails(task.id);



        div.innerHTML = `

            <div class="task-info">

                <input type="checkbox">

                <strong>${task.title}</strong>

                <span class="tag" style="background: ${task.color}22; color: ${task.color}">${task.tags[0] || ''}</span>

            </div>

            <div style="color: #888; font-size: 14px;">${task.deadline}</div>

            <div class="status">${task.status}</div>

        `;

        list.appendChild(div);

    });

    renderCalendar(); // Перерисовываем точки в календаре

}



// Календарь на неделю

function renderCalendar() {

    const calendarWeek = document.getElementById('calendar-week');

    const monthEl = document.getElementById('current-month');

    

    // Удаляем старые даты (оставляем только заголовки дней недели)

    const dayNames = calendarWeek.querySelectorAll('.day-name');

    calendarWeek.innerHTML = '';

    dayNames.forEach(dn => calendarWeek.appendChild(dn));



    const today = new Date();

    monthEl.innerText = today.toLocaleString('ru', { month: 'long', year: 'numeric' });



    // Находим начало текущей недели (понедельник)

    const startOfWeek = new Date(today);

    const day = today.getDay();

    const diff = today.getDate() - day + (day === 0 ? -6 : 1); 

    startOfWeek.setDate(diff);



    for (let i = 0; i < 7; i++) {

        const date = new Date(startOfWeek);

        date.setDate(startOfWeek.getDate() + i);



        const dateISO = date.toISOString().split('T')[0];

        const isToday = date.toDateString() === today.toDateString();



        const dayCell = document.createElement('div');

        dayCell.className = `day-cell ${isToday ? 'today' : ''}`;

        dayCell.innerHTML = `<span>${date.getDate()}</span>`;



        // Добавляем цветные точки задач

        const dotsContainer = document.createElement('div');

        dotsContainer.className = 'dots-container';

        

        const dayTasks = tasks.filter(t => t.deadline === dateISO);

        dayTasks.forEach(t => {

            const dot = document.createElement('span');

            dot.className = 'dot';

            dot.style.backgroundColor = t.color;

            dotsContainer.appendChild(dot);

        });



        dayCell.appendChild(dotsContainer);

        calendarWeek.appendChild(dayCell);

    }

}



// Переключение видов (Дашборд / Детали задачи)

function showView(viewId) {

    document.getElementById('dashboard-view').style.display = viewId === 'dashboard' ? 'block' : 'none';

    document.getElementById('task-details-view').style.display = viewId === 'details' ? 'block' : 'none';

}



function showTaskDetails(id) {

    const task = tasks.find(t => t.id === id);

    const container = document.getElementById('full-task-content');

    

    container.innerHTML = `

        <div class="details-card">

            <h1 style="border-left: 10px solid ${task.color}; padding-left: 20px;">${task.title}</h1>

            <div class="form-row">

                <p><strong>Срок:</strong> ${task.deadline}</p>

                <p><strong>Статус:</strong> ${task.status}</p>

            </div>

            <p><strong>Описание:</strong><br>${task.desc}</p>

            <h3>Подзадачи</h3>

            <ul id="details-subtasks">

                ${task.subtasks.map(s => `<li><input type="checkbox"> ${s}</li>`).join('')}

            </ul>

            <div style="margin-top: 20px;">

                ${task.tags.map(t => `<span class="tag">${t}</span>`).join(' ')}

            </div>

        </div>

    `;

    showView('details');

}



// Функции модального окна

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

    const tags = document.getElementById('task-tags').value.split(',').map(t => t.trim());

    

    const subtaskInputs = document.querySelectorAll('.subtask-item');

    const subtasks = Array.from(subtaskInputs).map(i => i.value).filter(v => v !== '');



    const newTask = {

        id: Date.now(),

        title, desc, deadline, status, color, tags, subtasks

    };



    tasks.push(newTask);

    renderTasks();

    closeModal('createTaskModal');

    document.getElementById('task-form').reset();

    document.getElementById('subtasks-list-input').innerHTML = '';

}
