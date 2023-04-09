input = document.getElementById("otp")
err = document.getElementsByClassName("err")[0]
var link = document.getElementsByClassName("link")[0]
var time = document.querySelector(".sign.time")
time.style.visibility = "hidden"

respond = (json) => {
    if (!json.otp);
    else if (!json.verified) {
        err.innerHTML = "Invalid OTP"
        err.style.visibility = "visible"
    }
    else if (json.forgot) {
        window.open("/change/password", "_self")
    }
    else window.open("/dashboard", "_self")
    document.getElementById("submit").disabled = false
}
const wait = (n) => {
    var i = n
    link.href = "URL:void(0)"
    time.style.visibility = "visible"
    link.style.color = 'gray';
    const f = setInterval(() => {
        time.innerHTML = "&nbsp;in " + --i
        if (i <= 0) {
            link.href = "/resend"
            time.style.visibility = "hidden"
            link.style.color = 'white';
            clearInterval(f)
        }
    }, 1000)
}
link.addEventListener("mousedown", (e) => {
    if (link.href === "URL:void(0)") link.style.color = 'gray';
})
link.addEventListener("mouseup", (e) => {
    if (link.href === "URL:void(0)") link.style.color = 'gray';
})
wait(20)

document.getElementById("submit").addEventListener("click", async () => {
    document.getElementById("submit").disabled = true
    const otp = input.value
    let json = {
        otp: otp.trim(),
    }
    await fetch("/verification/otp", {
        method: "POST",
        body: JSON.stringify(json),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(response => response.json())
        .then(respond);
})

input.addEventListener("input", (e) => {
    if (input.value.length !== 5 && input.value.length !== 0) {
        err.innerHTML = "OTP must be of 5 characters"
        err.style.visibility = "visible"
    }
    else err.style.visibility = "hidden"
})

window.addEventListener("keydown", (e) => {
    if (e.key == 'Enter') document.getElementById("submit").click()
},
    true
);
