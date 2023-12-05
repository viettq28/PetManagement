'use strict';

import { saveToStorage, getFromStorage } from './storage.js';

const unameInput = document.getElementById('input-username');
const pwordInput = document.getElementById('input-password');
const submitBtn = document.getElementById('btn-submit');

const KEY = 'USER_ARRAY';
const userArr = getFromStorage(KEY) || [];
let curUser = getFromStorage('CURRENT_USER') || {};
console.log(curUser);

// Hàm kiểm tra input
const validateForm = function (data) {
    let text = '';
    // Kiểm tra các người dùng đã input hết các field chưa nếu chưa sẽ trả về text 'Input must be filled'
    if (data.uname === '' || data.pword === '')
        text = 'All input must be filled';
    // Sau đó kiểm tra tính hợp lệ của nội dung từng field và đưa ra text tương ứng
    return text;
};

// Thiết lập nút bấm submit
submitBtn.addEventListener('click', function (e) {
    // Gán các giá trị input vào object data
    const data = {
        uname: unameInput.value,
        pword: pwordInput.value,
    };

    // Gọi validateForm để kiểm tra data, nếu trả về '' thì hợp lệ và thực hiên push data vào userArr
    if (validateForm(data) === '') {
        curUser = userArr.find(
            (user) =>
                data.uname === user.userName && data.pword === user.password
        );
        if (!curUser) {
            alert('Check your username and password and try again');
            return;
        }
        saveToStorage('CURRENT_USER', JSON.stringify(curUser));
        window.location.href = '../index.html';

        // Nếu validateForm trả lại gì khác thì alert và ngăn event này thực hiện
    } else {
        window.alert(validateForm(data));
        // e.preventDefault();
    }
});
