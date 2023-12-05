'use strict';
import { saveToStorage, getFromStorage } from './storage.js';
import { User } from '../models/User.js';
// localStorage.removeItem('USER_SETTING');
console.log(getFromStorage('USER_SETTING'));

const pageSizeInput = document.getElementById('input-page-size');
const categoryInput = document.getElementById('input-category');
const submitBtn = document.getElementById('btn-submit');

const curUser = getFromStorage('CURRENT_USER') || {};
const userSetting = getFromStorage('USER_SETTING') || [];
// Tạo User mới từ curUser
const curUserInstance = new User(...Object.values(curUser));
let curSettingIndex;
// Tìm curUserSetting index
let curUserSetting = userSetting.find((setting, i) => {
    if (setting.userName === curUser.userName) {
        curSettingIndex = i;
        return true;
    }
});
// Apply curUserSetting vào input nếu có
if (curUserSetting) {
    pageSizeInput.value = curUserSetting.pageSize;
    categoryInput.value = curUserSetting.category;
} else curUserSetting = {};

// Kiểm tra data
const validateData = function (data) {
    if (!data.pageSize) return 'Please input News per page';
    if (data.pageSize < 1) return 'Page size must be greater than 0';
};

// Lưu setting của current user
submitBtn.addEventListener('click', function () {
    const data = {
        pageSize: pageSizeInput.value,
        category: categoryInput.value,
    };
    // Kiểm tra data từ input, alert ra nếu validateData có giá trị trả về
    if (!validateData(data)) {
        // dùng method setSetting của user để lưu setting cho current User
        curUserInstance.setSetting(...Object.values(data));
        [
            curUserSetting.userName,
            curUserSetting.pageSize,
            curUserSetting.category,
        ] = curUserInstance.userSetting;
        // Nếu tồn tại current user trong USER_SETTING thì xóa đi và thêm mới
        if (isFinite(curSettingIndex)) userSetting.splice(curSettingIndex, 1);
        userSetting.push(curUserSetting);
        // console.log(userSetting);
        saveToStorage('USER_SETTING', JSON.stringify(userSetting));
        // Đặt lại vị trí của curUserSetting trong mảng userSetting
        curSettingIndex = userSetting.length - 1;
        console.log('Setting updated successfully');
    } else alert(validateData(data));
});
