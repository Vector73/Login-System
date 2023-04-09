const inputs = document.getElementsByTagName("input")
let err = document.querySelectorAll(".err")

const respond = (json) => {
    console.log(json);
    if (json.email) {
        if (json.exists) {
            document.querySelector(".sign").style.visibility = "visible"
        }
        else if (!json.len);
        else if (!json.valid) {
            err[2].innerHTML = "Email Not Found"
            err[2].style.visibility = "visible"
        }
        else {
            Array.from(inputs).forEach(input => input.value = "");
            window.open("/verification/otp", '_self')
        }
    }
    document.getElementById("submit").disabled = false
}


document.getElementById("submit").addEventListener("click", async () => {
    document.getElementById("submit").disabled = true
    const first = document.getElementById("first").value
    const last = document.getElementById("last").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    let json = {
        firstname: first.trim(),
        lastname: last.trim(),
        email: email.trim(),
        password: password
    }
    let a = 0
    let empty = false
    Array.from(inputs).forEach(input => {
        if (!input.value && !empty) {
            if (a === 2) err[a].innerHTML = "Field must not be empty"
            err[a].style.visibility = "visible"
            json = { email: false }
            empty = true
        }
        a++;
    });
    await fetch("/sign-up", {
        method: "POST",
        body: JSON.stringify(json),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(response => response.json())
        .then(respond);
})

let a = 0
Array.from(inputs).forEach(input => {
    input.addEventListener("focus", (e) => {
        input.previousSibling.style.visibility = "hidden"
    })
})

inputs[3].addEventListener("input", (e) => {
    const password = inputs[3].value
    if (password.length < 8 && password.length) {
        err[3].innerHTML = "Password should be of atleast 8 characters"
        err[3].style.visibility = "visible"
    }
    else err[3].style.visibility = "hidden"
})

window.addEventListener("keydown", (e) => {
    if (e.key == 'Enter') document.getElementById("submit").click()
},
    true
);
