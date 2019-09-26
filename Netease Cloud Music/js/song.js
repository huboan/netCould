var currentLine = 0; //当前播放到哪一句了
var currentTime; //当前播放的时间
var step; //保存ul的translateY值
var previewly;
var lrcTime = [];
let regx = /(?<=\?list=)\d*/;

let userId = '';
if (window.location.search.match(/(?<=\?uid=)\d*/)) {
    userId = window.location.search.match(/(?<=\?uid=)\d*/)[0];
}
let songId = window.location.search.match(/(?<=\&id=)\d*/)[0];
let songListId = '';

if (window.location.search.match(/(?<=\&list=)\d*/)) {
    songListId = window.location.search.match(/(?<=\&list=)\d*/)[0];
}
// 待完善。还需获取用户的喜欢歌单判断是否有此歌id。。。
function getLovecon() {
    let promise = new Promise((reslove,reject)=>{
        fetch ('http://localhost:3000/likelist?uid='+userId,{
            method:"get",
            mode:"cors",
            credentials:"include"
        })
        .then(r=>{
            d=r.json();
            reslove(d);
        })
    })
    return promise;
}
getLovecon().then(x=> {
    console.log(x);
    let myLoveList = x.ids;
    if (myLoveList.indexOf(Number (songId))>0) {
        $id("love-heart").classList.remove("fa-heart-o");
        $id("love-heart").classList.add("fa-heart");
        $id("love-heart").style.color = "red";
        
    }
    else {
        $id("love-heart").classList.remove("fa-heart");
        $id("love-heart").classList.add("fa-heart-o");
        $id("love-heart").style.color = "#fff";
    }
})
$id("love-heart").onclick = function () {

    if (this.classList.contains("fa-heart-o")) {
        $id("liked").src = "../images/gif/like.gif";
        setTimeout(function () {
            $id("liked").src = "";
        }, 1500)
        this.classList.remove("fa-heart-o");
        this.classList.add("fa-heart");
        this.style.color = "red";
        fetch("http://localhost:3000/like?", {
                method: "post",
                mode: "cors",
                credentials: "include",
                headers: new Headers({
                    'Content-Type': 'application/x-www-form-urlencoded'
                }),
                body: "id=" + songId
            })
            .then(r => r.json())
            .then(d => {
                console.log(d);
            })

    } else {
        fetch("http://localhost:3000/like?", {
                method: "post",
                mode: "cors",
                credentials: "include",
                headers: new Headers({
                    'Content-Type': 'application/x-www-form-urlencoded'
                }),
                body: "id=" + songId+"&like=false"
            })
            .then(r => r.json())
            .then(d => {
                console.log(d);
            })
        this.classList.remove("fa-heart");
        this.classList.add("fa-heart-o");
        this.style.color = "#fff";

    }
}
fetch("http://localhost:3000/comment/music?id=" + songId, {
        method: "get",
        mode: "cors",
        credentials: "include"
    })
    .then(r => r.json())
    .then(d => {

        //  评论数： d.total
        let item = d.total;
        if (d.total >= 1000 && d.total < 10000) {
            item = "999+";
        } else if (d.total > 10000 && d.total < 100000) {
            item = "1w+";
        } else if (d.total >= 10000) {
            item = "10w+";
        }

        $id("talks").innerHTML = item;

    })
fetch("http://localhost:3000/song/detail?ids=" + songId, {
        method: "get",
        mode: "cors",
        credentials: "include"
    })
    .then(r => r.json())
    .then(d => {
        
        let infoObj = d.songs[0];
        // 歌名 infoObj.name    歌手  (一个或多个，需要做判断)       封面   infoObj.al.picUrl

        let singger = "";
        infoObj.ar.forEach(function (v) {
            singger += v.name + "/";
        })
        singger = singger.slice(0, singger.length - 1);
        singger += '>';
        $id("song-name").innerHTML = infoObj.name;
        let span = document.createElement("span");
        span.innerHTML = singger;
        $id("song-name").appendChild(span);
        $id("round-img").src = infoObj.al.picUrl;
        $id("song-bg").src = infoObj.al.picUrl;


    })
fetch("http://localhost:3000/song/url?id=" + songId, {
        method: "get",
        mode: "cors",
        credentials: "include"
    })
    .then(r => r.json())
    .then(d => {
        
        $id("myaudio").src = d.data[0].url;


        // $id("time-end").innerHTML = $id("myaudio");
    })
let flag = true;

$id("song-play").onclick = function () {
    $id("myaudio").play();
    if (flag) {
        $id("round-img").style.animationPlayState = "running";
        $id("shadow-big").style.animationName = "sploosh-b";
        $id("shadow-small").style.animationName = "sploosh-s";
        $id("myaudio").play();
        this.classList.remove("fa-play-circle-o");
        this.classList.add("fa-pause-circle-o");

    } else {
        $id("round-img").style.animationPlayState = "paused";
        $id("shadow-big").style.animationName = "";
        $id("shadow-small").style.animationName = "";
        $id("myaudio").pause();
        this.classList.remove("fa-pause-circle-o");
        this.classList.add("fa-play-circle-o");

    }
    flag = !flag;

}
// audio时间改变事件
// $id("myaudio").ontimeupdate = function () {
//     if (this.currentTime === 0) {
//         return;
//     }
//     $id("time-start").innerHTML = songTime(this, 1);

//     $id("rr").value = (100 * $id("myaudio").currentTime) / $id("myaudio").duration;
//     $id("rr").style.background = 'linear-gradient(to right, skyblue,#9c9a96 ' + $id("rr").value + '%, #9c9a96)';
// }
// 进度条改变事件

$id("myaudio").ondurationchange = function () {
    $id("time-end").innerHTML = songTime(this, 0);

}
$id("Wave").onclick = function (e) {

    if (e.target === this) {
        this.style.display = "none";
        $id("Lyric").style.display = "block";
    }
}
$id("Lyric").onclick = function (e) {

    if (e.target !== $id("Lyric-main") && e.target !== $id("myvoice")) {
        this.style.display = "none";
        $id("Wave").style.display = "block";
    }
}

function $id(e) {
    return document.getElementById(e);
}
let promise = new Promise(function (reslove) {
    fetch("http://localhost:3000/lyric?id=" + songId, {
            method: "get",
            mode: "cors",
            credentials: "include"
        })
        .then(r => r.json())
        .then(d => {
            let lyric;
            if (d.nolyric) {
                lyric = `[00:00.000] 纯音乐 请欣赏`;
                
            } else {
                lyric = d.lrc.lyric;
            }

            let rtime = /(?=\[).*(?<=\])/g;
            let rtext = /(?<=\]).*/g;
            let rx = /(?<=\[)\d*(?=\:)/g;
            let ry = /(?<=\:)\d*(?=\.)/g;
            let rz = /(?<=\.)\d*(?=\])/g;
            let songTimer = [];
            let songText = [];
            let timer = 0;

            // let x = parseInt(lyric.match(rx))*60*1000 + parseInt(lyric.match(ry))*1000 + parseInt(lyric.match(rz));
            lyric.match(rtime).forEach(function (value, index) {
                timer = parseInt(value.match(rx)) * 60 * 1000 + parseInt(value.match(ry)) * 1000 + parseInt(value.match(rz));
                songTimer.push(timer);
            })
            lyric.match(rtext).forEach(function (value, index) {
                $id("my-Lyric").innerHTML += `
                <li>${value}</li>
            `
            })
            reslove(songTimer);
            // songTimer[songTimer.length] = songTimer[songTimer.length - 1];

        })
})
promise.then(r => {
    //lrcTime[lrcTime.length] = lrcTime[lrcTime.length-1] + 3
    let songTimer = r;
    songTimer[songTimer.length] = songTimer[songTimer.length - 1] + 40000;
    $id("rr").oninput = function () {

        $id("myaudio").currentTime = this.value * $id("myaudio").duration / 100;

    }
    $id("myaudio").ontimeupdate = function () {
        
        if (this.currentTime === 0) {
            return;
        }
        $id("time-start").innerHTML = songTime(this, 1);
        $id("rr").value = (100 * $id("myaudio").currentTime) / $id("myaudio").duration;
        $id("rr").style.background = 'linear-gradient(to right, skyblue,#9c9a96 ' + $id("rr").value + '%, #9c9a96)';
        currentTime = this.currentTime * 1000;
        if (songTimer.length === 2) {
            return
        }
        for (j = currentLine, len = songTimer.length; j < len; j++) {
            for (let i = 0; i < songTimer.length - 1; i++) {

                $id("my-Lyric").children[i].className = "";
            }
            if (currentTime < songTimer[j + 1] && currentTime > songTimer[j]) {
                // 判断是否存在歌词
                
                currentLine = j;
                step = 250 - currentLine * 50 + 'px';
                $id("my-Lyric").style.top = step;
                if (currentLine == 0) {
                    $id("my-Lyric").children[currentLine].className = "on";
                } else {

                    $id("my-Lyric").children[currentLine].className = "on";
                }

                break;
            }

        }
    }

    $id("myaudio").onseeked = function () {
        currentTime = this.currentTime;

        for (k = 0, len = songTimer.length; k < len; k++) {
            if ($id("my-Lyric").children[k]) {
                $id("my-Lyric").children[k].className = "";
            }
            if (currentTime <= songTimer[k + 1] && currentTime <= songTimer[k]) {
                currentLine = k;
                break;
            }

        }


    }
})
// 判断是否获取歌曲列表
if (songListId) {
    let listPromise = new Promise(function (reslove) {
        fetch("http://localhost:3000/playlist/detail?id=" + songListId, {
                method: "get",
                mode: "cors",
                credentials: "include"
            })
            .then(r => r.json())
            .then(d => {
                reslove(d);


            })
    })

    listPromise.then(x => {
        let item = "";
        let myIndex;

        x.playlist.trackIds.forEach((value, index) => {
            if (value.id === Number(songId)) {
                myIndex = index;
            }
        })
        let allList = x.playlist.tracks;
        $id("song-items").innerHTML = `顺序播放(${allList.length})<i class="fa fa-angle-double-down" id="cl-list"></i>`;
        allList.forEach(value => {
            let singger = "";
            value.ar.forEach(function (v) {
                singger += v.name + "/";
            })
            // http://127.0.0.1:5501/html/song.html?list=758133740&id=28285910
            singger = singger.slice(0, singger.length - 1);
            let name = value.name;
            item += `
                <li>
                    <a href="song.html?uid=${userId}&list=${songListId}&id=${value.id}">
                    <i class="fa fa-volume-up"></i>
                    ${name}
                    <span>-${singger}</span>
                    </a>
                </li>
            `
        })
        $id("all-list").innerHTML = item;
        $id("all-list").children[myIndex].className = "on";
        if (myIndex > 3) {
            $id("all-song").scrollTop = (myIndex - 3) * 50;
        }
        $id("cl-list").onclick = function () {
            $id("all-song").style.height = 0;
        }
        $id("op-list").onclick = function () {
            $id("all-song").style.height = '60%';
        }
    })
    listPromise.then(g => {
        var mysongList = [];
        g.playlist.trackIds.forEach(value => {
            mysongList.push(value.id);
        })

        let nowIndex = mysongList.indexOf(Number(songId));
        let nextIndex = 0;
        let previousIndex = 0;
        if (nowIndex === 0) {
            previousIndex = mysongList.length - 1;
        } else {
            previousIndex = nowIndex - 1;
        }
        if (nowIndex === mysongList.length - 1) {
            nextIndex = 0;
        } else {
            nextIndex = nowIndex + 1;
        }
        $id("song-previous").onclick = function () {
            //?list=2849937207&id=482999247
            window.location.href = "song.html?uid="+userId+"&list=" + songListId + "&id=" + mysongList[previousIndex];

        }
        $id("song-next").onclick = function () {
            window.location.href = "song.html?uid="+userId+"&list="+ songListId + "&id=" + mysongList[nextIndex];
        }
        $id("myaudio").onended = function () {
            window.location.href = "song.html?uid="+userId+"&list=" + songListId + "&id=" + mysongList[nextIndex];
        }
    })
}


function songTime(obj, x) {
    if (x == 0) {
        let time = obj.duration;
        //分钟
        let minute = time / 60;
        let minutes = parseInt(minute);
        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        //秒
        let second = time % 60;
        let seconds = parseInt(second);
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return (minutes + ":" + seconds);
    }
    if (x == 1) {
        let time = obj.currentTime;
        //分钟
        let minute = time / 60;
        let minutes = parseInt(minute);
        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        //秒
        let second = time % 60;
        let seconds = parseInt(second);
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return (minutes + ":" + seconds);
    }

}
$id("myvolume").oninput = function () {
    $id("myaudio").volume = this.value / 10;
    this.style.background = 'linear-gradient(to right, pink,#9c9a96 ' + this.value * 10 + '%, #9c9a96)';

}
$id("myvoice").onclick = function () {
    if (this.classList.contains("fa-volume-up")) {
        this.classList.remove("fa-volume-up");
        this.classList.add("fa-volume-off");
        $id("myvolume").value = 0;
        $id("myaudio").volume = 0;
        $id("myvolume").style.background = 'linear-gradient(to right, pink,#9c9a96 0%, #9c9a96)';
    } else {
        this.classList.remove("fa-volume-off");
        this.classList.add("fa-volume-up");
        $id("myvolume").value = 5;
        $id("myaudio").volume = 0.5;
        $id("myvolume").style.background = 'linear-gradient(to right, pink,#9c9a96 50%, #9c9a96)';
    }
}
$id("usertalks").onclick = function () {
    window.location.href = "comment.html?id=" + songId;
}
$id("song-play").onkeypress = function (e) {
    // if (e.which === 38) {
    //     console.log(123456);
    // }
    console.log(e);
}