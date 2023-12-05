'use strict'

export const saveToStorage = (key, value) => {
    localStorage.setItem(key, value);
};

export const getFromStorage = (key) => {
    return JSON.parse(localStorage.getItem(key));
}

