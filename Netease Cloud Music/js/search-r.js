function startSearch(text) {
    ~ function closeSearch() {
        $id("search-history").style.display = "none";
        $id("search-result").style.display = "block";
        $id("suggest-list").innerHTML = "";
    }();
    myLocAry.push(text);

    window.localStorage.setItem("local", myLocAry);
    pushLocal();

    let myTopList = $id("re-top").children;

    for (let i = 0; i < myTopList.length; i++) {
        myTopList[i].onclick = function () {
            for (let i = 0; i < myTopList.length; i++) {
                myTopList[i].classList.remove("on");
            }
            this.classList.add("on");
            $id("re-center").style.transform = "translateX(" + (-i * 20) + "%)";
        }
    }
    getSongData("http://localhost:3000/search?type=1&limit=10&keywords=" + text).then(d => {

        if (d.result.songCount == 0) {
            $id("re-songlist").innerHTML= `<img src="../images/gif/error.gif" alt="">
                        <span>找不到歌曲！！！</span>`;
        } else {
            let mySongAry = d.result.songs;
            let item = '';
            mySongAry.forEach((value, index) => {
                let x;
                let singger = "";
                value.artists.forEach(function (v) {
                    singger += v.name + "/";
                })
                singger = singger.slice(0, singger.length - 1);
                if (value.alias.length == 0) {
                    x = '';
                } else {
                    x = '(' + value.alias[0] + ')';
                }
                item += `
                <li>
                        <a href="song.html?list=&id=${value.id}">
                        <div class="song-text">
                            <h1>
                                ${value.name}<span>${x}</span>
                            </h1>
                            <h2>
                                ${singger}-${value.album.name}
                            </h2>
                            <h3>
                                ${x}
                            </h3>
                        </div>
                        <div class="song-icon">
                            <i class="fa fa-youtube-play"></i>
                            <i class="fa fa-code-fork"></i>
                        </div>
                        </a>
                </li>
                `;
            })
            $id("re-songlist").innerHTML = item;
        }

    })
    getSongData("http://localhost:3000/search?type=1014&limit=10&keywords=" + text).then(d => {
        if (typeof d.result === 'undefined') {
            $id("re-videolist").innerHTML= `<img src="../images/gif/error.gif" alt="">
                        <span>找不到视频！！！</span>`;
        } else {
            let myVideoAry = d.result.videos;
            let item = '';
            myVideoAry.forEach(value => {
                let videoCount = value.playTime > 100000 ? parseInt(value.playTime / 10000) + '万' : value.playTime;
                item += `
                <li>
                    <div id="vi-img">
                        <img src=${value.coverUrl} alt="">
                        <span><i class="fa fa-play"></i>${videoCount}</span>
                    </div>
                    <div id="vi-text">
                        <p>${value.title}</p>
                        <span>${new Date(value.durationms).getMinutes()+':'+new Date(value.durationms).getSeconds()} by ${value.creator[0].userName}</span>
                    </div>
                </li>
                `
            })
            $id("re-videolist").innerHTML = item;
        }


    })
    getSongData("http://localhost:3000/search?type=100&limit=20&keywords=" + text).then(d => {
        if (d.result.artistCount == 0) {
            $id("re-singgerlist").innerHTML= `<img src="../images/gif/error.gif" alt="">
                        <span>找不到歌手！！！</span>`;
        } else {
            let mySinggerAry = d.result.artists;
            let item = '';
            mySinggerAry.forEach(value => {
                let isSettled;
                let foreignNames;
                if (value.alias.length == 0) {
                    foreignNames = '';
                } else {
                    foreignNames = '(' + value.alias[0] + ')';
                }
                item += `
                <li>
                    <div class="si-img">
                        <img src=${value.img1v1Url} alt="">
                        <h3>
                            ${value.name}
                            <span>${foreignNames}</span>
                        </h3>
                    </div>
                    <div class="si-icon">
                        <i class="fa fa-user-circle"></i>已入驻
                    </div>
                </li>
                `
            })
            $id("re-singgerlist").innerHTML = item;
        }
    })
    getSongData("http://localhost:3000/search?type=10&limit=20&keywords=" + text).then(d => {
        if (d.result.albumCount == 0) {
            $id("re-albumlist").innerHTML= `<img src="../images/gif/error.gif" alt="">
                        <span>找不到专辑！！！</span>`;
        } else {
            let myAlbumAry = d.result.albums;
            let item = '';
            myAlbumAry.forEach(value => {
                item += `
                <li>
                    <img src=${value.picUrl} alt="">
                    <div id="al-text">
                        <p>${value.name}</p>
                        <span>${value.artist.name} ${new Date(value.publishTime).getFullYear()+'.'+(new Date(value.publishTime).getMonth()+1)+'.'+new Date(value.publishTime).getDate()}</span>
                    </div>
                </li>
                `
            })
            $id("re-albumlist").innerHTML = item;
        }
    })
    getSongData("http://localhost:3000/search?type=1000&limit=20&keywords=" + text).then(d => {
        if (d.result.playlistCount == 0) {
            $id("re-sheetlist").innerHTML= `<img src="../images/gif/error.gif" alt="">
                        <span>找不到歌单！！！</span>`;
        } else {
            let mySheetAry = d.result.playlists;
            let item = '';
            mySheetAry.forEach(value => {
                item += `
                <li>
                    <a href="gd1.html?uid=${window.location.search.slice(4)}&list=${value.id}">
                    <img src=${value.coverImgUrl} alt="">
                    <div id="sh-text">
                        <p>${value.name}</p>
                        <span>${value.trackCount}首 by ${value.creator.nickname}，播放${value.playCount}次</span>
                    </div>
                    </a>
                </li>`
            })
            $id("re-sheetlist").innerHTML = item;
        }
    })

    function getSongData(url) {
        return fetch(url, {
                method: "get",
                mode: "cors",
                credentials: "include"
            })
            .then(r => r.json())
    }

}
if ($id("search-history").style.display == "none") {
    $id("searcho").onclick = function () {
        endSearch();
    }
}

function endSearch() {
    $id("search-history").style.display = "block";
    $id("search-result").style.display = "none";
}

function pushLocal() {
    if (window.localStorage.getItem("local")) {
        let item = '';
        window.localStorage.getItem("local").split(',').forEach((value, index) => {
            item += `
            <li>${value}</li>
        `
        })
        $id("se-his").innerHTML = item;
    }

};
pushLocal();

function delLocal() {
    window.localStorage.removeItem("local");
    $id("se-his").innerHTML = "";
}
$id("search-text").onkeydown = function (e) {
    if (e.which === 13) {
        startSearch(this.value);
        this.onblur();
    }
    if (e.which === 27) {
        $id("suggest-list").innerHTML = "";
    }
}

$id("search-suggest").onclick = function (e) {
    startSearch(e.target.innerText);
}
$id("hot-list").onclick = function (e) {
    if (e.target.tagName == 'P') {
        startSearch(e.target.innerText);
    }
}
$id("se-his").onclick = function (e) {
    if (e.target.tagName == 'LI') {
        startSearch(e.target.innerText);
    }
}