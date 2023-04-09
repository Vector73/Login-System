const inputs = document.getElementsByTagName("input")
let err = document.querySelectorAll(".err")

const respond = (json) => {
    console.log(json.password);
    if (json.password) {
        window.open("/dashboard", "_self")
    }
    document.getElementById("submit").disabled = false
}


document.getElementById("submit").addEventListener("click", async () => {
    document.getElementById("submit").disabled = true
    const pass = document.getElementById("new").value
    const confirm = document.getElementById("confirm").value
    if (pass !== confirm) {
        err[1].innerHTML = "Password don't match"
        err[1].style.visibility = "visible"
    }
    let json = {
        password: pass,
        confirm: confirm
    }
    let a = 0
    let empty = false
    Array.from(inputs).forEach(input => {
        if (!input.value && !empty) {
            err[a].innerHTML = "Field must not be empty"
            err[a].style.visibility = "visible"
            json = { email: false }
            empty = true
        }
        a++;
    });
    await fetch("/change/password", {
        method: "PUT",
        body: JSON.stringify(json),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(response => response.json())
        .then(respond);
})

let a = 0

inputs[0].addEventListener("input", (e) => {
    const password = inputs[0].value
    if (password.length < 8 && password.length) {
        err[0].innerHTML = "Password should be of atleast 8 characters"
        err[0].style.visibility = "visible"
    }
    else err[0].style.visibility = "hidden"
})

window.addEventListener("keydown", (e) => {
    if (e.key == 'Enter') document.getElementById("submit").click()
},
    true
);
