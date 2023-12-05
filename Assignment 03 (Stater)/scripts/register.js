'use strict'
import { saveToStorage, getFromStorage } from './storage.js';
import { User } from '../models/User.js';
// localStorage.removeItem('USER_SETTING');
console.log(localStorage);

const unameInput = document.getElementById('input-username');
const fnameInput = document.getElementById('input-firstname');
const lnameInput = document.getElementById('input-lastname');
const pwordInput = document.getElementById('input-password');
const cfmPwInput = document.getElementById('input-password-confirm');
const submitBtn = document.getElementById('btn-submit');

const KEY = "USER_ARRAY";
const userArr = getFromStorage(KEY) || [];
console.log(userArr);

// Hàm kiểm tra input
const validateForm = function (data) {
    let text = '';
    // Kiểm tra các người dùng đã input hết các field chưa nếu chưa sẽ trả về text 'Input must be filled'
    if (
        data.uname === '' ||
        data.fname === '' ||
        data.lname === '' ||
        data.pword === '' ||
        data.cfmPw === '' 
    )
        text = 'All input must be filled';
    // Sau đó kiểm tra tính hợp lệ của nội dung từng field và đưa ra text tương ứng
    else {
        userArr.forEach(user => user.userName === data.uname && (text += 'Username must be unique!\n'));
        data.pword !== data.cfmPw &&
            (text += 'Confirmed Password must be similar with input Password!\n');
        data.pword.length <= 8  && (text += 'Password must have more than 8 characters!\n');
    }
    return text;
};

// Thiết lập nút bấm submit
submitBtn.addEventListener('click', function (e) {
    // Gán các giá trị input vào object data
    const data = {
        uname: unameInput.value,
        fname: fnameInput.value,
        lname: lnameInput.value,
        pword: pwordInput.value,
        cfmPw: cfmPwInput.value
    };

    // Gọi validateForm để kiểm tra data, nếu trả về '' thì hợp lệ và thực hiên push data vào userArr, chuyển sang trang login
    if (validateForm(data) === '') {
        const newUser = new User(data.fname, data.lname, data.uname, data.pword);
        userArr.push(newUser);
        saveToStorage(KEY, JSON.stringify(userArr));
        // console.log(userArr);
        window.location.href = '../pages/login.html';
        // console.log(localStorage);

        // Nếu validateForm trả lại gì khác thì alert và ngăn event này thực hiện
    } else {
        window.alert(validateForm(data));
        // e.preventDefault();
    }
});

