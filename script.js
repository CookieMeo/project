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



document.addEventListener('DOMContentLoaded', () => {

    renderTasks();

    renderCalendar();

    

    document.getElementById('task-form').addEventListener('submit', (e) => {

        e.preventDefault();

        saveTask();

    });

});



// Рендер списка задач

function renderTasks() {

    const list = document.getElementById('tasks-list');

    list.innerHTML = '';



    tasks.forEach(task => {

        const div = document.createElement('div');

        div.className = 'task-card';

        div.style.borderLeftColor = task.color;

        

        // Клик по всей карточке открывает детали

        div.onclick = () => showTaskDetails(task.id);



        div.innerHTML = `

            <div class="task-info">

                <!-- Остановка всплытия (stopPropagation), чтобы при клике на чекбокс не открывалась задача (Пункт 3) -->

                <input type="checkbox" class="task-checkbox" 

                    ${task.status === 'Готов' ? 'checked' : ''} 

                    onclick="event.stopPropagation(); toggleTaskStatus(${task.id})">

                <strong style="${task.status === 'Готов' ? 'text-decoration: line-through; color: gray;' : ''}">${task.title}</strong>

                <span class="tag" style="background: ${task.color}22; color: ${task.color}">${task.tags[0] || ''}</span>

            </div>

            <div class="task-deadline-display">${task.deadline}</div>

            <div class="task-status-display">${task.status}</div>

        `;

        list.appendChild(div);

    });

    renderCalendar();

}



// Автоматическая смена статуса при нажатии на чекбокс (Пункт 3)

function toggleTaskStatus(id) {

    const task = tasks.find(t => t.id === id);

    if (task) {

        task.status = task.status === 'Готов' ? 'В процессе' : 'Готов';

        renderTasks();

    }

}



// Страница деталей задачи с возможностью редактирования (Пункт 4)

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

                ${task.subtasks.map(s => `<li><input type="checkbox"> ${s}</li>`).join('')}

            </ul>

            

            <button class="btn-save" onclick="showView('dashboard')" style="margin-top:20px">Сохранить и выйти</button>

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



// --- Остальные функции без изменений ---



function showView(viewId) {

    document.getElementById('dashboard-view').style.display = viewId === 'dashboard' ? 'block' : 'none';

    document.getElementById('task-details-view').style.display = viewId === 'details' ? 'block' : 'none';

}



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



function renderCalendar() {

    const calendarWeek = document.getElementById('calendar-week');

    const monthEl = document.getElementById('current-month');

    const dayNames = calendarWeek.querySelectorAll('.day-name');

    calendarWeek.innerHTML = '';

    dayNames.forEach(dn => calendarWeek.appendChild(dn));



    const today = new Date();

    monthEl.innerText = today.toLocaleString('ru', { month: 'long', year: 'numeric' });



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
