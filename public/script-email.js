const input = document.getElementsByTagName("input")[0]
let err = document.querySelector(".err")

const respond = (json) => {
    if (json.email) {
        if (!json.exists) {
            document.querySelector(".sign").style.visibility = "visible"
        }
        else if (!json.valid) {
            err.innerHTML = "Email Not Found"
            err.style.visibility = "visible"
        }
        else {
            input.value = ""
            window.open("/verification/otp", '_self')
        }
    }
    document.getElementById("submit").disabled = false
}


document.getElementById("submit").addEventListener("click", async () => {
    document.getElementById("submit").disabled = true
    const email = input.value
    console.log(!email);
    let json = {
        email: email.trim(),
    }
    if (!input.value) {
        err.innerHTML = "Field must not be empty"
        err.style.visibility = "visible"
        json = { email: false }
    }
    await fetch("/verification/email", {
        method: "POST",
        body: JSON.stringify(json),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(response => response.json())
        .then(respond);
})

input.addEventListener("focus", (e) => {
    err.style.visibility = "hidden"
})

window.addEventListener("keydown", (e) => {
    if (e.key == 'Enter') document.getElementById("submit").click()
},
    true
);
