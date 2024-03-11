'use strict'
let perPage = 5; //кол-во эл-тов на странице
let currentPage = 1; //текущ стр
let totalPage = 0; //всего страниц
const mainUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/';

const tbody = document.querySelector(".tbody");

function renderOrders(orders) {  //отображение заказов на сайте
    tbody.innerHTML = ''; 
    for (const result of orders) {
        const tr = document.createElement("tr"); 
        tr.id = result.id; 
        const roadName = document.createElement("td"); 
        roadName.textContent = result.name; 
        tr.append(roadName); 
        const description = document.createElement("td"); 
        description.textContent = result.description; 
        tr.append(description); 
        const mainObject = document.createElement("td"); 
        mainObject.textContent = result.mainObject;
        tr.append(mainObject); 
        const changeBtn = document.createElement('button')
        changeBtn.classList.add('changeBtn');
        changeBtn.textContent = "Выбрать";
        changeBtn.addEventListener("click", event => guidsData(tr, event));
        tr.append(changeBtn);
        tbody.appendChild(tr);

    }
}

function renderPagination() { //пагинация
    const blockPagination = document.querySelector('.pagination');
    blockPagination.innerHTML = '';
    const prevBtn = document.createElement("button");
    prevBtn.classList.add('nextBtn');
    prevBtn.textContent = 'Назад';
    prevBtn.style.margin = '2px';
    prevBtn.style.backgroundColor = 'none';
    prevBtn.addEventListener('click', (event) => {
        if (currentPage > 1) {
            currentPage--;
            getOrders();
        }
    });
    blockPagination.append(prevBtn);
    
    for (let i = Math.max(parseInt(currentPage) - 2, 1); i <= Math.min(parseInt(currentPage) + 2, totalPage); i++) {
        const btn = document.createElement('button');
        btn.classList.add('pagBtn')
        btn.textContent = i;
        btn.addEventListener('click', (event)=>{
            const target = event.target;
            currentPage = target.textContent;
            getOrders();
        });
        if (currentPage == i) {
            btn.style.backgroundColor = '#ffff99';
        } else {
            btn.style.backgroundColor = 'none';
        }
        
        blockPagination.append(btn);   }

    const nextBtn = document.createElement("button");
    nextBtn.classList.add('nextBtn');
    nextBtn.textContent = 'Дальше';
    nextBtn.style.margin = '2px';
    nextBtn.style.backgroundColor = 'none';
    nextBtn.addEventListener('click', (event) => {
        if (currentPage < totalPage) {
            currentPage++;
            getOrders();
        }
    });
    blockPagination.append(nextBtn);
    
}

function getOrders() { //получение данных о заказе
    const url = new URL('routes', mainUrl);
    url.searchParams.set('api_key', 'c3b827e6-8fed-4cea-a8d3-1447d85c179d');
    let xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.send();
    xhr.onload = function() {
        const data = JSON.parse(this.response);
        totalPage = Math.ceil(data.length / perPage);
        const start = currentPage * perPage - perPage;
        const end = currentPage * perPage;
        renderOrders(data.slice(start, end)); 
        renderPagination();
    };
    xhr.send();
}

const tbodyguids = document.querySelector(".tbody-guids")

function guidsData(tr, event) { //получение данных о гидах для выбранного маршрута
    tbodyguids.innerHTML = "";
    const guidsRoad = tr.id;
    const guidesUrl = `/api/routes/${guidsRoad}/guides`;
    const xhr = new XMLHttpRequest();
    const newUrl = new URL(guidesUrl, mainUrl);
    newUrl.searchParams.set('api_key', 'c3b827e6-8fed-4cea-a8d3-1447d85c179d');
    xhr.open("get", newUrl);
    xhr.onload = function() {
        const records = JSON.parse(xhr.response);
        console.log(guidesUrl);
        for (const record of records) {
            console.log(record);
            addDataGuids(record);
        }
    };
    xhr.send();
}

function addDataGuids(orders) {  //вывод данных о гидах
    const tr = document.createElement('tr');
    tr.id = orders.id;
    const name = document.createElement('td');
    name.textContent = orders.name;
    tr.append(name);
    const language = document.createElement('td');
    language.textContent = orders.language;
    tr.append(language);
    const workExperience = document.createElement('td');
    workExperience.textContent = orders.workExperience;
    tr.append(workExperience);
    const pricePerHour = document.createElement('td');
    pricePerHour.textContent = `${orders.pricePerHour}₽`;
    tr.append(pricePerHour);
    const gidButton = document.createElement('button')
    gidButton.classList.add('gidButton')
    gidButton.textContent = "Выбрать";
    gidButton.addEventListener("click", event => modal(orders));
    gidButton.setAttribute("data-bs-toggle", "modal")
    gidButton.setAttribute("data-bs-target", "#exampleModal")
    tr.append(gidButton);
    tbodyguids.appendChild(tr)
}

const modalwindow = document.querySelector(".modal-dialog modal-dialog-centered")

function modal(orders) { //отображение данных о гиде в модальном окне
    const fio = document.querySelector('.guidname');
    fio.textContent = `ФИО гида: ${orders.name}`;
}


window.addEventListener('DOMContentLoaded', getOrders);