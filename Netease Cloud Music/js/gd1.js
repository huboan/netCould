let mysong = document.getElementById("mysong");

let promise = new Promise(function (reslove) {
    fetch("http://localhost:3000/playlist/detail?id="+window.location.search.substring(window.location.search.indexOf('list')+5), {
            method: "GET",
            mode: "cors",
            credentials: "include"
        })
        .then(r => r.json())
        .then(d => {
            reslove(d);
            console.log(d);
            $id("bgimg").src = d.playlist.coverImgUrl;
            $id("gdimg").src = d.playlist.coverImgUrl;
            $id("playCount").innerHTML = `<i class="fa fa-play"></i>${parseInt(d.playlist.playCount/10000)}万`
            $id("list-Title").innerHTML = d.playlist.name;
            $id("list-creator").children[0].src = d.playlist.creator.avatarUrl;
            $id("list-creator").children[1].innerHTML = d.playlist.creator.nickname;
            $id("list-details").innerHTML = d.playlist.description;
            $id("commentCount").innerHTML = d.playlist.commentCount;
            $id("shareCount").innerHTML = d.playlist.shareCount;
            $id("songCount").innerHTML = '(共' + d.privileges.length + '首)';
            
            reslove(d.playlist.tracks);
        })
})




function $id(x) {
    return document.getElementById(x);
}
window.onscroll = function () {
    document.querySelector("nav").style.background = "rgba(255,255,255," + document.documentElement.scrollTop / 300 + ")";
    if (document.documentElement.scrollTop > document.querySelector(".top").offsetHeight) {
        document.querySelector("nav").style.background = "";
        promise.then(h => {
            document.querySelector("nav img").src = h.playlist.coverImgUrl;
            document.querySelector("nav h3").innerHTML = h.playlist.name;
        })
        document.getElementById("song-ti").style = "position: fixed;top:" + document.querySelector("nav").offsetHeight + "px";
    } else {
        document.querySelector("nav img").src = "";
        document.querySelector("nav h3").innerHTML = "歌单";
        document.getElementById("song-ti").style = "";
    }
    if (document.documentElement.scrollTop === 0) {
        document.querySelector("nav").style.background = "";
    }
}
promise.then(g => {
    let songAry = g.playlist.tracks;
    let item="";
    console.log(g);
    songAry.forEach(function (value, index, ary) {
        console.log(g.playlist.trackIds[index].id);
        let songindex = index+1;
        let songname = value.name;
        let songalia="";
        let singger = "";
        if (value.alia.length!==0) {
            songalia = "("+value.alia[0]+")";
        }
        value.ar.forEach(function (v) {
            singger += v.name + "/";
        })
        singger = singger.slice(0, singger.length - 1);
        singger += "-"+value.al.name;
        item+=` 
            <li>
                <a href="song.html?uid=${window.location.search.match(/(?<=\?uid=)\d*/)[0]}&list=${g.playlist.id}&id=${g.playlist.trackIds[index].id}">
                <div class="song-text">
                    <span>${songindex}</span>
                    <h3>
                        <p>${songname}<i>${songalia}</i></p>
                        <span>${singger}</span>
                    </h3>
                </div>
                <div class="song-icon">
                    <i class="fa fa-youtube-play"></i>
                    <i class="fa fa-code-fork"></i>
                </div>
                </a>
            </li>`
    })
    mysong.innerHTML+=item;
    if (!g.playlist.subscribed) {
        console.log($id("mysub"));
        $id("mysub").onclick = function () {
            
            //http://localhost:3000/playlist/subscribe?t=1&id=2139305008
            fetch("http://localhost:3000/playlist/subscribe?", {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: new Headers({
                    'Content-Type': 'application/x-www-form-urlencoded'
                }),
                body: "t=1&id="+window.location.search.substring(window.location.search.indexOf('list')+5)
            })
            this.classList.add("unsub");
            this.innerHTML = "已收藏";
            
        }
    } else {
        $id("mysub").classList.add("unsub");
        $id("mysub").innerHTML = "已收藏";

    }
})