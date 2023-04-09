const inputs = document.getElementsByTagName("input")
let err = document.querySelectorAll(".err")

const respond = (json) => {
    console.log(json);
    if(json.email) {
        if (!json.exists) {
            document.querySelector(".sign").style.visibility = "visible"
        }
        else if(!json.pass){
            const span = document.querySelector(".err.i2")
            console.log(span);
            span.innerHTML = "Password don't match"
            span.style.visibility = "visible"
        }
        else if (!json.valid) {
            err[0].innerHTML = "Email Not Found"
            err[0].style.visibility = "visible"
        }
        else {
            Array.from(inputs).forEach(input => input.value = "");
            window.open("/verification/otp", '_self')
        }
    }
    document.getElementById("submit").disabled = false
}


document.getElementById("submit").addEventListener("click",async ()=>{
    document.getElementById("submit").disabled = true
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    let json = {
        email: email.trim(),
        password: password
    }
    let a = 0
    let empty = false
    Array.from(inputs).forEach(input => {
        if (!input.value && !empty) {
            err[a].innerHTML = "Field must not be empty"
            err[a].style.visibility = "visible"
            json = {email:false}
            empty = true
        }
        a++;
    });
    await fetch("/login", {
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
    input.addEventListener("focus",(e) => {
        input.previousSibling.style.visibility = "hidden"
    })
})

window.addEventListener("keydown",(e) => {
    if (e.key == 'Enter') document.getElementById("submit").click()
  },
  true
);
