'use strict'

export class User {
    setting;
    constructor(firstName, lastName, userName, password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.userName = userName;
        this.password = password;
    }
    setSetting(newsPerPage, newsCategory) {
        this.setting = {
            pageSize: newsPerPage,
            category: newsCategory
        };
    }
    get userSetting() {
        return [this.userName, this.setting.pageSize, this.setting.category];
    }
}