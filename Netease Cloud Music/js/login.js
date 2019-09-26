function $id(e) {
    return document.getElementById(e);
}
// $id("mybutton").onclick = function () {
//     window.location.href = "index.html?id=1533325";
// }
$id('mybutton').onclick = function () {
    userLogin();
}
$id("password").onkeydown = function (e) {
    if (e.which === 13) {
        userLogin();
    }
}
function userLogin() {
    fetch("http://localhost:3000/login/cellphone?", {
            credentials: "include",
            method: "POST",
            mode: "cors",
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
                // 'Accept': 'application/json',
                // 'Content-Type': 'application/json;charset=utf-8'
            }),
            body: "phone=" + userphone.value + "&password=" + password.value
        })
        .then(r => {
            if (r.status == 200) {
                showTips("登录成功")
                return r.json();
            }
            if (r.status == 502) {
                showTips("密码错误")
                return;
            }
            if (r.status == 400) {
                showTips("手机号错误")
                return;
            }
        })
        .then(d => {
            if (typeof d !== 'undefined')
                setTimeout(() => {
                    window.location.href = "index.html?id=" + d.account.id;
                }, 1000);

        })
}
$id("go-register").onclick = function () {
    $id("log-number").style.display = "none";
    $id("register").style.display = "block";
    $id("ph-login").style.backgroundImage = 'url(../../images/test/8.jpg)';
}
$id("to-login").onclick = function () {
    $id("log-number").style.display = "block";
    $id("register").style.display = "none";
    $id("ph-login").style.backgroundImage = 'url(../../images/test/7.jpg)';
}
$id("reg-phone").oninput = function () {
    if (this.value.length < 11) {
        $id("phone-tital").className = "orange";
        $id("phone-tital").innerHTML =
            `<i class="fa fa-exclamation-triangle"></i>请输入11位数字`;
    }
    if (this.value.length >= 11) {
        this.value = this.value.slice(0, 11);
        fetch("http://localhost:3000/cellphone/existence/check?phone=" + this.value, {
                method: "get",
                mode: "cors"
            })
            .then(r => r.json())
            .then(d => {
                if (d.exist > 0) {
                    $id("phone-tital").className = "red";
                    $id("phone-tital").innerHTML =
                        `<i class="fa fa-times-circle"></i>该手机号已被注册`;
                } else {
                    $id("phone-tital").className = "green";
                    $id("phone-tital").innerHTML =
                        `<i class="fa fa-check-circle"></i>手机号可用`;

                }
            })
    }
}
$id("phone-message").onclick = function () {
    fetch("http://localhost:3000/captcha/sent?",{
        method:"post",
        mode:"cors",
        headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        }),
        body: 'phone='+$id("reg-phone").value
    })
    .then(r=>r.json())
    .then(d=> {
        console.log(d);
    })
}
$id("reg-verification").oninput = function () {
    if (this.value.length>=4) {
        this.value = this.value.slice(0,4);
        fetch("http://localhost:3000/captcha/verify?",{
            method:"post",
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body: 'phone='+$id("reg-phone").value+'&captcha='+ $id("reg-verification").value
        })
        .then(r=>r.json())
        .then(d=>{
            if (d.code==200) {
                $id("phone-message").style.color="green";
                $id("phone-message").innerHTML="正确";
            }
            else {
                $id("phone-message").style.color="red";
                $id("phone-message").innerHTML="错误";
            }
        })
    }
}
// 注册
$id("reg-username").focus();
$id("reg-button").onclick = function () {
    if  ($id("reg-phone").value=='' ||  $id("reg-verification").value=='' || $id("reg-password").value=='' || $id("reg-username").value=='') {
        showTips('亲，看看哪里没输入哟');
    }
    // /register/cellphone?phone=13xxx&password=xxxxx&captcha=1234&nickname=binary1345
    else {
        fetch("http://localhost:3000/register/cellphone?",{
            credentials: "include",
            method: "POST",
            mode: "cors",
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
                // 'Accept': 'application/json',
                // 'Content-Type': 'application/json;charset=utf-8'
            }),
            body: 'phone='+$id("reg-phone").value+'&password='+$id("reg-password").value+'&captcha='+$id("reg-verification").value+'&nickname='+$id("reg-username").value
        })
        .then(r=>r.json())
        .then(d=> {
            showTips("注册成功");
        })
    }
}
function showTips(str) {
    $id("tips").innerHTML = str;
    $id("tips").style.opacity = 0.8;
    let timerTips = setInterval(function () {
        $id("tips").style.opacity -= 0.004;
        if ($id("tips").style.opacity < 0) {
            clearInterval(timerTips);
            $id("tips").style.opacity = 0;
        }
    }, 17)
}
$id("inPassword").onclick = function () {
    if (this.classList.contains("fa-eye-slash")) {
        $id("password").setAttribute("type", "text");
        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye")
    }else {
        $id("password").setAttribute("type", "password");
        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash")
    }
    
}