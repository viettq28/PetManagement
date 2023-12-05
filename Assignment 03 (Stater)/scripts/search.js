'use strict';

import { getFromStorage } from './storage.js';
// import { User } from '../models/User.js';

const cardContainer = document.querySelector('#news-container>.card');
const navPage = document.getElementById('nav-page-num');
const pagination = document.querySelector('.pagination');
const prevBtn = document.getElementById('btn-prev').closest('.page-item');
const nextBtn = document.getElementById('btn-next').closest('.page-item');
const submitBtn = document.getElementById('btn-submit');
const newsContainer = document.querySelector('#news-container>.card');
const queryInput = document.getElementById('input-query');

const curUser = getFromStorage('CURRENT_USER') || {};
// Lấy setting từ người dùng hiện tại
const curSetting = getFromStorage('USER_SETTING')?.find(
    (setting) => setting.userName === curUser.userName
);
const pageSize = Number(curSetting?.pageSize ?? 5);
const category = !curSetting?.category
    ? ''
    : `&category=${curSetting.category}`;
let curPage = 1,
    articles,
    lastPage;
// Url dùng để fetch
let url =
    'https://newsapi.org/v2/top-headlines?' +
    'country=us&' +
    'pageSize=100&' +
    'apiKey=ad07b1c5a07c478c821a9f9e776c8be4' +
    category;

// -----------------------Validate Function--------------------------
// Hàm kiểm tra các nội dung nhận được từ API
const validateData = (data) => {
    // Nếu có description hoặc description chứa các ký tự đặc biệt thì hiển thị 'No description'
    console.log(data);
    const checkDescription = () => {
        if (
            !data?.description ||
            data.description.includes('"', '<', '>', '$', '#')
        ) {
            data.description = 'No description';
            return false;
        } else return true;
    };
    // Nếu không có content thì lấy description, nếu không có description thì hiển thị 'No content'
    if (!data?.content) {
        if (checkDescription()) data.content = data.description;
        else data.content = 'No content';
    }
    // Không có src image thì lấy src url của image 'No preview image'
    data.urlToImage ||
        (data.urlToImage =
            'https://upload.wikimedia.org/wikipedia/commons/d/dc/No_Preview_image_2.png');
};

// Hàm kiểm tra dữ liệu input
const validateInput = input => !input && 'Please input something';

// -----------------------Pagination Control-------------------------------
// Hàm tạo các page đánh số
const createListPage = function () {
    const listPage = document.createElement('li');
    listPage.classList.add('page-item');
    return listPage;
};

//  Reset Pagination
const resetPagination = () => {
    const pageList = document.querySelectorAll('a.page-link');
    pageList.forEach((page) => page.closest('li').remove());
};
resetPagination();

// Hàm điều khiển Pagination
const pagCtrl = function (curPage) {
    // Reset .active
    pagination?.querySelector('.active')?.classList.remove('active');
    // Thêm .active vào curPage
    const curPageEl = document
        .getElementById(`page-num-${curPage}`)
        .closest('.page-item');
    curPageEl.classList.add('active');
    // Nếu curPage == 1 thì hide nút Previous. nếu curPage == lastPage thì hide nút Next
    if (curPage === 1) {
        prevBtn.classList.add('hide');
    } else prevBtn.classList.remove('hide');
    if (curPage === lastPage) {
        nextBtn.classList.add('hide');
    } else nextBtn.classList.remove('hide');
};

// Hàm tạo Pagination
const createPagination = function (totalNews, newsPerPage) {
    // Không có kết quả tìm kiếm thì không hiện pagination
    if (totalNews == 0) navPage.classList.add('hide');
    // Lấy số page đồng thời cũng == lastPage từ tồng News trả về và số lượng news mỗi page
    lastPage = Math.ceil(totalNews / newsPerPage);
    // Gọi hàm createListPage để thêm page đánh số
    for (let i = lastPage; i >= 1; i--) {
        const html = `<li class="page-item">
                    <a class="page-link" id="page-num-${i}">${i}</a>
                </li>`;
        const pageItem = (createListPage().innerHTML = html);
        prevBtn.insertAdjacentHTML('afterend', pageItem);
    }
    // Đưa active cho page 1
    pagCtrl(curPage);
};

// -----------------------------UI Generate-------------------------------
// Hàm tạo các card
const addCard = function (html) {
    const newsCard = document.createElement('div');
    newsCard.classList.add('card', 'mb-3');
    newsCard.innerHTML = `<div class="row no-gutters">
    ${html}
    </div>`;
    cardContainer.append(newsCard);
};

// Hàm tạo giao diện
const showDOM = function () {
    // Lấy index của news đầu tiên mỗi page từ articles, nếu không có articles thì kết thúc hàm. Reset newsContainer innerHTML    
    const firstNews = (curPage - 1) * pageSize;
    if (!articles) return;
    newsContainer.innerHTML = '';
    // console.log(articles);
    // Tiến hành tải các news cho mỗi page
    for (let i = firstNews; i < firstNews + pageSize; i++) {
        if(!articles[i]) return;
        // Kiểm tra các nội dung nhận được từ API        
        validateData(articles[i]);
        // Tạo html từ data API xong dùng hàm Add card để thêm vào giao diện
        const html = `<div class="col-md-4">
                                        <img
                                            src="${articles[i].urlToImage}"
                                            class="card-img"
                                            alt="${articles[i].description}"
                                        />
                                    </div>
                                    <div class="col-md-8">
                                        <div class="card-body">
                                            <h5 class="card-title">
                                                ${articles[i].title}
                                            </h5>
                                            <p class="card-text">
                                                ${articles[i].content}
                                            </p>
                                            <a
                                                href="${articles[i].url}"
                                                class="btn btn-primary"
                                                >View</a
                                            >
                                        </div>
                                    </div>
            `;
        addCard(html);
    }
};

// --------------------------FetchAPI--------------------------------
// Hàm bất đồng bộ lấy dữ liệu từ API
const getNews = async function (url) {
    try {
        // Lấy giá trị sau khi fetch, throw error nếu có
        const res = await fetch(url);
        if (!res.ok) throw new Error('Error fetch');
        const result = await res.json();
        // Tạo pagination từ tổng result trả về và page size từ setting người dùng
        createPagination(result.totalResults, pageSize);
        // Lấy các bài báo
        articles = result.articles;
        // console.log(articles);
    } catch (err) {
        console.error(err);
        // Async function không tự thoát nếu gặp lỗi như 404,... vậy phải throw err lại ở đây
        throw err;
    }
};

//---------------------------UI Interact--------------------------------
// Hàm click vào pagination
pagination.addEventListener('click', function (e) {
    // Không click vào page-item nào thì không xãy ra event
    if (!e.target.closest('.page-item')) return;
    // Nếu click vào Previous hay Next btn thì curPage giảm hoặc tăng tương ứng, còn nếu click vào page-id số mấy thì gán curPage bằng số tương ứng
    const target = e.target.id;
    if (target.includes('btn')) {
        target === 'btn-prev' && curPage > 1 && curPage--;
        target === 'btn-next' && curPage < lastPage && curPage++;
    } else [, , curPage] = target.split('-');
    // Gán active và tải giao diện
    pagCtrl(Number(curPage));
    showDOM();
})

// Hàm search
submitBtn.addEventListener('click', function () {
    // Kiểm tra input, nếu có vấn đề thì alert
    if(!validateInput(queryInput.value)){
        // Đặt query = giá trị input, xong gán vào url để fetch API và tạo giao diện, đặt lại và hiển thị pagination
        const query = `&q=${queryInput.value}`;
        const searchUrl = url + query;
        getNews(searchUrl).then(() => showDOM());
        resetPagination();
        navPage.classList.remove('hide');
    }else {
        alert(validateInput(queryInput.value))
    }
});
