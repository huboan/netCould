let source;
let songId = window.location.search.match(/(?<=\?id=)\d*/)[0];
//评论
let commentPro = new Promise(reslove => {
    fetch("http://localhost:3000/comment/music?id="+songId+'&limit=5', {
            method: "get",
            mode: "cors",
            credentials: "include"
        })
        .then(r => r.json())
        .then(d => {
            reslove(d)
        })
})
// 歌曲资料
fetch("http://localhost:3000/song/detail?ids="+songId, {
        method: "get",
        mode: "cors",
        credentials: "include"
    })
    .then(r => r.json())
    .then(d => {
        console.log(d);
        let songObj = d.songs[0];
        let singger = "";
        songObj.ar.forEach(function (v) {
            singger += v.name + "/";
        })
        singger = singger.slice(0, singger.length - 1);
        $id("song-img").src = songObj.al.picUrl;
        $id("song-name").innerHTML = songObj.name;
        $id("singger").innerHTML = singger;
    })
commentPro.then(m => {
    let myCom = m;
    console.log(m);
    let hotitem = "";
    let hotCom = m.hotComments;
    hotCom.forEach((value, index) => {
        let date = new Date(value.time);
        let dateTime = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
        if (value.user.vipType !== 0) {
            hotitem += `
        <li class="talks">
            <div class="talk-top">
                <img src="${value.user.avatarUrl}" alt="">
                <p>
                    ${value.user.nickname}<img src="../images/test/vip.png" alt="">
                    <span>${dateTime}</span>
                </p>
                <h3>
                    ${value.likedCount}
                    <i class="fa fa-thumbs-o-up"></i>
                </h3>
            </div>
            <textarea class="talk-text"  readonly>${value.content}</textarea>
        <a href="javascript:;" id="reply"></a>
        </li>
        `;
        } else {
            hotitem += `
            <li class="talks">
                <div class="talk-top">
                    <img src="${value.user.avatarUrl}" alt="">
                    <p>
                        ${value.user.nickname}
                        <span>${dateTime}</span>
                    </p>
                    <h3>
                        ${value.likedCount}
                        <i class="fa fa-thumbs-o-up"></i>
                    </h3>
                </div>
                <textarea class="talk-text"  readonly>${value.content}</textarea>
            <a href="javascript:;" id="reply"></a>
            </li>
            `;
        }

    })

    $id("hot").innerHTML = hotitem;
    let newitem = "";
    let newCom = m.comments;
    newCom.forEach((value, index) => {
        let date = new Date(value.time);
        let dateTime = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
        if (value.user.vipType !== 0) {
            newitem += `
        <li class="talks">
            <div class="talk-top">
                <img src="${value.user.avatarUrl}" alt="">
                <p>
                    ${value.user.nickname}<img src="../images/test/vip.png" alt="">
                    <span>${dateTime}</span>
                </p>
                <h3>
                    ${value.likedCount}
                    <i class="fa fa-thumbs-o-up"></i>
                </h3>
            </div>
            <textarea class="talk-text"  readonly>${value.content}</textarea>
        <a href="javascript:;" id="reply"></a>
        </li>
        `;
        } else {
            newitem += `
            <li class="talks">
                <div class="talk-top">
                    <img src="${value.user.avatarUrl}" alt="">
                    <p>
                        ${value.user.nickname}
                        <span>${dateTime}</span>
                    </p>
                    <h3>
                        ${value.likedCount}
                        <i class="fa fa-thumbs-o-up"></i>
                    </h3>
                </div>
                <textarea class="talk-text"  readonly>${value.content}</textarea>
                   
            <a href="javascript:;" id="reply"></a>
            </li>
            `;
        }

    })
    $id("new").innerHTML = newitem;
    source = m.total;
    $id("total").innerHTML = source;
    $(function () {

        $('textarea').autoHeight();

    });
    document.querySelectorAll(".talks").forEach(value => {
        value.onclick = function (e) {
            if (e.target.className === 'talk-text') {
                console.log(123);
                $id("tips").style.zIndex = 9999;
                $id("showbl").style.zIndex = 8888;
                $id("copy").onclick = function () {
                    e.target.select(); // 选择对象
                    document.execCommand("Copy");
                    $id("hasd").select();
                    $id("tips").style.zIndex = -9;
                    $id("showbl").style.zIndex = -8;
                }
            }
        }
    })
})


function $id(e) {
    return document.getElementById(e);
}
$id("talk-text")
jQuery.fn.extend({

    autoHeight: function () {

        return this.each(function () {

            var $this = jQuery(this);

            if (!$this.attr('_initAdjustHeight')) {

                $this.attr('_initAdjustHeight', $this.outerHeight());

            }

            _adjustH(this).on('input', function () {

                _adjustH(this);

            });

        });

        /**

         * 重置高度 

         * @param {Object} elem

         */

        function _adjustH(elem) {

            var $obj = jQuery(elem);

            return $obj.css({
                    height: $obj.attr('_initAdjustHeight'),
                    'overflow-y': 'hidden'
                })

                .height(elem.scrollHeight);

        }

    }

});
///comment?t=1&type=1&id=5436712&content=test
// 't=1&type=0&id=' + 191528 + '&content=' + $id("mytalk").value
///comment?t=1&type=1&id=5436712&content=test
$id("push").onclick = function () {
    if ($id("mytalk").value.length !== 0 && $id("mytalk").value !== "") {
        fetch("http://localhost:3000/comment?", {
                method: "post",
                mode: "cors",
                credentials: "include",
                headers: new Headers({
                    // 'Content-Type': 'application/x-www-form-urlencoded'
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8'
                }),
                body: JSON.stringify({
                    t: 1,
                    type: 0,
                    id: songId,
                    content: $id("mytalk").value
                })
            })
            .then(r => r.json())
            .then(d => {
                console.log(d);
            })
    } else {
        console.log("输入不能为空");
    }

}

// 使用