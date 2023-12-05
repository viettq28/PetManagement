'use strict'

import { saveToStorage, getFromStorage } from './storage.js';
import { User } from '../models/User.js';

const loginModal = document.getElementById('login-modal');
const logoutModal = document.getElementById('logout-modal');
const welcomeMsg = document.getElementById('welcome-message');
const logoutBtn = document.getElementById('btn-logout');

const curUser = getFromStorage('CURRENT_USER') || {};
console.log(curUser);
// Nếu có CURRENT_USER thì hiện log out và welcome message, còn chưa thì hiện register và loggin
if (Object.entries(curUser).length === 0) {
    loginModal.classList.remove('hide');
    logoutModal.classList.add('hide');
}else {
    loginModal.classList.add('hide');
    logoutModal.classList.remove('hide');
    welcomeMsg.textContent = `Welcome ${curUser.userName}`;
}
// Bấm nút Log out sẽ xóa CURRENT_USER khỏi localStorage
logoutBtn.addEventListener('click', function(){
    localStorage.removeItem('CURRENT_USER');
    window.location.href = './pages/login.html';
})