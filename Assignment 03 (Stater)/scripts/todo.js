'use strict';

import { saveToStorage, getFromStorage } from './storage.js';
// localStorage.removeItem('USER_TASK');

const todoList = document.getElementById('todo-list');
const taskInput = document.getElementById('input-task');
const addBtn = document.getElementById('btn-add');
const curUser = getFromStorage('CURRENT_USER') || {};
const taskArr = getFromStorage('USER_TASK') || [];
// Class Task, khi tạo một instance sẽ tự set random Id, có các method lấy Id và thay đổi giá trị isDone
class Task {
    #id;
    constructor(owner, task, isDone) {
        this.owner = owner;
        this.task = task;
        this.isDone = isDone;
        this._generateId();
    }
    _generateId() {
        this.#id = ('00000' + Math.floor(Math.random() * 999999)).slice(-7, -1);
    }
    _getId() {
        return this.#id;
    }
    _toggleIsDone() {
        this.isDone = !this.isDone;
    }
}

// Lấy các task có owner trùng với curUser.userName rồi biến chúng thành instance của Task, cùng với các task khác, map vào curUserTask
const curUserTask = taskArr.map((task) => {
    if (task.owner === curUser.userName) {
        task = new Task(task.owner, task.task, task.isDone);
    }
    return task;
});
// console.log(curUserTask);



// Tạo UI danh sách các task của curUser
(function () {
    todoList.innerHTML = '';
    curUserTask.forEach((task) => {
        if (task instanceof Task) {
            todoList.append(createListItem(task));
        }
    });
})();

// Sự kiện xãy ra khi người dùng tương tác với giao diện
// prettier-ignore
// Xóa task
const removeTaskItem = (task) => task.closest('li').remove();
// Toggle checked
const toggleCheck = (task) => task.closest('li').classList.toggle('checked');
// Hàm tạo 'li' chứa todo
const createListItem = function (task) {
    const listItem = document.createElement('li');
    // Kiểm tra isDone để thêm class checked, lấy id được generate để gán vào data-id
    task.isDone && listItem.classList.add('checked');
    listItem.dataset.id = task._getId();
    listItem.innerHTML = `${task.task}<span class="close">×</span>`;
    return listItem;
};

// Tạo sự kiện thêm mới task, và add task vào localStorage
addBtn.addEventListener('click', () => {
    const newTask = new Task(curUser.userName, taskInput.value, false);
    todoList.append(createListItem(newTask));
    curUserTask.push(newTask);
    // console.log(curUserTask);
});

// Tạo event khi người dùng click vào todo list
todoList.addEventListener('click', (e) => {
    // Lấy target khi người dùng clíck vào phạm vi todoList, tìm vị trí của task tương ứng trong curUserTask
    const tgt = e.target;
    const taskId = tgt.closest('li').dataset.id;
    const index = curUserTask.findIndex((task) => task._getId?.() === taskId);
    // Nếu click '.close' thì xóa khỏi giao diện và arr
    if (tgt.classList.contains('close')) {
        removeTaskItem(tgt);
        curUserTask.splice(index, 1);
        // console.log(curUserTask);
    // Click vào chỗ khác thì check task toggle isDone cho task tương ứng
    } else {
        toggleCheck(tgt);
        curUserTask[index]._toggleIsDone();
        // console.log(curUserTask);
    }
});

// Khi page unload sẽ lưu dữ liệu vào localStorage
window.addEventListener('unload', function(e){
    saveToStorage('USER_TASK', JSON.stringify(curUserTask));
})

