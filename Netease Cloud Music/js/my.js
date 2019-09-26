// login.style.height = window.screen.height + "px";
let wrap = document.getElementById("wrap");
let login = document.getElementById("login");
setTimeout(function () {
    wrap.removeChild(wrap.children[0])
}, 1);
let myLocAry = [];
let select = document.getElementById("select");

let topSelect = document.querySelector(".fa.fa-bars");
let main = document.getElementById("main");
topSelect.onclick = function () {
    // select.classList.add("selection");
    Moveu(select, 50, 0);

}

let selBack = document.getElementById("sel-back").children[0];
selBack.onclick = function () {
    Moveu(select, -50, -1000);
}

function Moveu(obj, speet, target) {
    let mytimer = setInterval(Moveme, 17);

    function Moveme() {
        obj.style.left = parseInt(window.getComputedStyle(obj).left) + speet + "px";
        if (parseInt(obj.style.left) == target) {
            clearInterval(mytimer);
        }
    }
}

let mytop = document.getElementById("mytop");

let tab = document.getElementById("tabul");
// main.style.top=mytop.offsetHeight+"px";
main.onclick = function () {
    select.classList.remove("selection");
}
let navList = mytop.children[0].children;
let lastIndex = 1;
for (let i = 1; i < navList.length - 1; i++) {
    navList[i].onclick = function () {
        navList[lastIndex].classList.remove("l-select");
        this.classList.add("l-select");
        tab.style.transform = "translate(" + (i - 1) * -25 + "%)";
        lastIndex = i;
    }
}

let finnalIndex = 0;
let timerUl = setInterval(changeUl, 3000);
let banImg = document.getElementById("banner-img");
banImg.onmouseover = function () {
    clearInterval(timerUl);
}
banImg.onmouseout = function () {
    timerUl = setInterval(changeUl, 1500);
}
let x = 0;
let banLi = document.getElementById("banner-li").children;
for (let i = 0; i < banLi.length; i++) {
    banLi[i].onclick = function () {

        for (let f = 0; f < banLi.length; f++) {
            banLi[f].classList.remove("active");
        }
        this.classList.add("active");
        banImg.style.transform = "translateX(" + -i * 12.5 + "%)";
        x = i;
    }
}


function changeUl() {

    banLi[x].classList.remove("active");
    x = (x + 1) % 8;
    banImg.style.transform = "translateX(" + -x * 12.5 + "%)";
    banLi[x].classList.add("active");
}
let songIndex = 0;
let songChange = document.querySelectorAll(".song-top h3 span");
let songSpan = document.querySelector(".new-song .song-top>span");
let songContent = document.querySelectorAll(".new-song .song-content ul li")
for (let i = 0; i < songChange.length; i++) {
    songChange[i].onclick = function () {
        songChange[songIndex].classList.remove("active");
        this.classList.add("active");
        songIndex = i;

        if (i == 0) {
            songSpan.innerHTML = "更多新碟";
            songContent[0].children[0].src = "../images/xd1.jpg";
            songContent[0].children[1].innerHTML = "逆流而上";
            songContent[0].children[2].innerHTML = "罗云熙";
            songContent[1].children[0].src = "../images/xd2.jpg";
            songContent[1].children[1].innerHTML = "追风";
            songContent[1].children[2].innerHTML = "颜中人";
            songContent[2].children[0].src = "../images/xd3.jpg";
            songContent[2].children[1].innerHTML = "超喜欢你";
            songContent[2].children[2].innerHTML = "深以诚";

        } else {
            songSpan.innerHTML = "新歌推荐";
            songContent[0].children[0].src = "../images/xg1.jpg";
            songContent[0].children[1].innerHTML = "表白";
            songContent[0].children[2].innerHTML = "周星星";
            songContent[1].children[0].src = "../images/xg2.jpg";
            songContent[1].children[1].innerHTML = "无名之辈";
            songContent[1].children[2].innerHTML = "陈雪燃";
            songContent[2].children[0].src = "../images/xg3.jpg";
            songContent[2].children[1].innerHTML = "离岸";
            songContent[2].children[2].innerHTML = "苏晗";
        }
    }
}
let talkIndex = 0;
let talkNav = document.querySelectorAll(".talk-nav a");
for (let i = 0; i < talkNav.length; i++) {
    talkNav[i].onclick = function () {
        talkNav[talkIndex].classList.remove("active");
        this.classList.add("active");
        talkIndex = i;
    }
}
let flag = 1;
let mod = document.getElementById("mod");
mod.onclick = function () {
    if (flag == 1) {
        wrap.classList.add("night");
        flag = 0;
        this.children[0].classList.remove("fa-moon-o");
        this.children[0].classList.add("fa-sun-o");
        this.children[1].innerHTML = "日间模式";
    } else if (flag == 0) {
        wrap.classList.remove("night");
        this.children[0].classList.remove("fa-sun-o");
        this.children[0].classList.add("fa-moon-o");
        this.children[1].innerHTML = "夜间模式";
        flag = 1;
    }
}


let del = document.querySelector(".fa-trash-o");

del.onclick = function() {
    delLocal();
}

let searIco = document.querySelector(".fa-search");
let searchLeft = document.querySelector(".m-search");
searIco.onclick = function () {
    searchLeft.style.right = 0 + "px";
}
let searicoA = document.getElementById("searcho");
searicoA.onclick = function () {
    if ($id("search-history").style.display=="none") {
       this.onclick = function () {
            endSearch();
        }
    }
    else {
        searchLeft.style.right = "100%";
    }
    
}

function $id(e) {
    return document.getElementById(e);
}

function getDate(url) {
    return fetch(url, {
            method: "GET",
            mode: "cors",
            //使用登录时在游览器下缓存的cookie
            credentials: 'include'
        })
        .then(r => r.json())
}
if (location.search === "") {
    getDate("http://localhost:3000/personalized").then(b => rendDaySheet(b));
} else {
    getDate("http://localhost:3000/recommend/resource").then(b => rendUserSheet(b));
    $id("select-unlogin").innerHTML = "";

    fetch("http://localhost:3000/user/detail?u" + location.search.substring(1), {
            method: "GET",
            mode: "cors",
            credentials: "include"
        })
        .then(r => r.json())
        .then(d => {

            let obj = d.profile;

            $id("select-login").innerHTML = `
            <img src=${obj.avatarUrl} alt="">
            <div>
            <img src=${obj.avatarUrl} alt="">
                <h3>
                    ${obj.nickname} <span>Lv.${d.level}</span>
                </h3>
            </div>
            </div>
            `
            // $id("select-login").style.backgroundImage = "url(" + obj.avatarUrl + ")";
        })
    fetch("http://localhost:3000/user/playlist?u" + location.search.substring(1), {
            method: "GET",
            mode: "cors",
            credentials: "include"
        })
        .then(r => r.json())
        .then(d => {
            console.log(d);
            let item = "";
            let collect = "";
            let mylist = d.playlist;
            let i=0,
                j=0;
            mylist.forEach(value => {
                if (String(value.userId) === location.search.substring(4)) {
                    item += `
                    <li>
                        <a href="gd1.html?uid=${window.location.search.slice(4)}&list=${value.id}">
                        <img src=${value.coverImgUrl} alt="">
                        <h3>
                            ${value.name.substring(value.name.indexOf("喜"))}
                            <span>
                                ${value.trackCount}首
                            </span>
                        </h3>
                        </a>
                    </li>
                    `
                    i++;
                } else {
                    collect += `
                    <li>
                        <a  href="gd1.html?uid=${window.location.search.slice(4)}&list=${value.id}">
                        <img src=${value.coverImgUrl} alt="">
                        <h3>
                            ${value.name.substring(value.name.indexOf("喜"))}
                            <span>
                                ${value.trackCount}首
                            </span>
                        </h3>
                        </a>
                    </li>
                    `
                    j++;
                }
                
                $id("esList").innerHTML = '('+i+')';
                $id("coList").innerHTML = '('+j+')';
                $id("song-list").innerHTML = item;
                $id("song-collect").innerHTML = collect;
            })
        })
}



function rendUserSheet(ary) {
    console.log(ary);
    ary = ary.recommend.slice(0, 6);
    let item = "";
    ary.forEach(function (value, index, arr) {
        item += `
        <li>
        <a href="gd1.html?uid=${window.location.search.slice(4)}&list=${value.id}">
                <img src=${value.picUrl} alt="">
                <p>${value.name}</p>
                <span><i class="fa fa-play"></i>${(value.playcount/10000).toFixed()}万</span>
        </a>
        </li>`
    })
    document.querySelector(".song-content ul").innerHTML = item;
}

function rendDaySheet(ary) {
    ary = ary.result.slice(0, 6);
    let item = "";
    ary.forEach(function (value, index, arr) {
        item += `
        <li>
        <a href="gd1.html?uid=${window.location.search.slice(4)}&list=${value.id}">
                <img src=${value.picUrl} alt="">
                <p>${value.name}</p>
                <span><i class="fa fa-play"></i>${(value.playCount/10000).toFixed()}万</span>
        </a>
        </li>`
    })
    document.querySelector(".song-content ul").innerHTML = item;
}
// 展开和收起
$id("creat-listsong").onclick = function () {
    if (this.className.includes("fa-angle-down")) {
        this.classList.remove("fa-angle-down");
        this.classList.add("fa-angle-right");
        document.getElementsByClassName("tab-main")[0].style = "display: none";
    } else {
        this.classList.remove("fa-angle-right");
        this.classList.add("fa-angle-down");
        document.getElementsByClassName("tab-main")[0].style = "display: block";
    }

}
$id("collect-listsong").onclick = function () {
    if (this.className.includes("fa-angle-down")) {
        this.classList.remove("fa-angle-down");
        this.classList.add("fa-angle-right");
        document.getElementsByClassName("collect-main")[0].style = "display: none";
    } else {
        this.classList.remove("fa-angle-right");
        this.classList.add("fa-angle-down");
        document.getElementsByClassName("collect-main")[0].style = "display: block";
    }
}
fetch("http://localhost:3000/banner?type=1", {
        method: "GET",
        mode: "cors",
        credentials: "include"
    })
    .then(r => r.json())
    .then(d => {
        d = d.banners.slice(0, 8);
        d.forEach(function (value, index) {
            // console.log(value);
            $id("banner-img").children[index].children[0].src = value.pic;
        })
    })
fetch("http://localhost:3000/search/hot/detail", {
        method: "GET",
        mode: "cors",
        credentials: "include"
    })
    .then(r => r.json())
    .then(d => {
        let searchList = d.data;
        let item = "";
        let myurl = "";
        searchList.forEach((value, index) => {
            if (value.iconUrl) {
                myurl = value.iconUrl;
            }
            
            item += `
        <li>
            <span>${index+1}</span>
            <div>
                <h3>
                    <p>${value.searchWord}</p>
                    <span>${value.score}</span>
                    <img src="${myurl}"  alt="">
                </h3>
                <p>
                    ${value.content}
                </p>
            </div>
        </li>
        `
        })
        document.getElementById("hot-list").innerHTML = item;
    })
fetch("http://localhost:3000/search/default", {
        method: "GET",
        mode: "cors",
      
        
    })
    .then(r => r.json())
    .then(d => {
        let hotSong = d.data.showKeyword;
        document.getElementById("search-text").setAttribute("placeholder", hotSong);
    })
$id("search-text").oninput = function () {
    getSearchRusult();
}
$id("search-text").onfocus = function () {
    getSearchRusult();
}
$id("search-text").onblur = function () {
    // $id("suggest-list").innerHTML = "";
}

function getSearchRusult() {
    if ($id("search-text").value != "" || $id("search-text").value.length !== 0) {
        fetch("http://localhost:3000/search/suggest?keywords=" + $id("search-text").value + "&type=mobile", {
                method: "GET",
                mode: "cors",
                credentials: "include"
            })
            .then(r => r.json())
            .then(d => {
                //
                let item = `<li>搜索“${$id("search-text").value}”</li>`;
                //  || typeof d.result.allMatch!=='undefined'

                // 判断两个条件
                if (typeof d.result !== 'undefined' && JSON.stringify(d.result) !== '{}') {
                    d.result.allMatch.forEach((value, index) => {
                        item += `
            <li><i class="fa fa-search"></i>${value.keyword}</li>
            `
                    })
                }
                $id("suggest-list").innerHTML = item;
            })
    } else {
        $id("suggest-list").innerHTML = "";
    }
}
$id("logout").onclick = function () {
    fetch("http://localhost:3000/logout",{
        method:"get",
        mode:"cors",
        credentials:"include"
    })
    .then(r=> {
        console.log("再见");
        setTimeout(function(){
            window.location.search = "";
        },500)
    })
}
