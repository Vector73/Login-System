var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const path = require('path')
const nodemailer = require('nodemailer')
const validator = require('deep-email-validator')


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: your_email_id,
    pass: app_password_for_email_id
  }
}, {
  from: your_email - id,
});

verifier = async (email) => {
  const { valid } = await validator.validate(email)
  if (!valid) return false
  const otp = Math.floor(Math.random() * 90000 + 10000).toString()
  await transporter.sendMail({
    to: email,
    subject: "OTP Verification",
    text: otp
  });
  return otp
}

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/database');
}

var signupInfo = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String
})

credential = mongoose.model("credential", signupInfo)





router.get("/logout", (req, res) => {
  req.session.user = undefined
  req.session.forgot = false
  res.redirect("/")


})
router.get("/verification/otp", (req, res) => {
  if (req.session.otp) res.sendFile(path.join(__dirname, "public", "otp.html"))
  else res.status(404).send("<pre>Not Found</pre>")


})
router.post('/sign-up', async (req, res) => {
  let data = req.body;
  req.session.forgot = false
  if (data.email) {

    if (data.password.length < 8) {
      data.len = false
      return res.json(data)
    }
    else data.len = true

    const info = await credential.find({ email: data.email })
    data.exists = info.length !== 0
    if (!data.exists) {
      let otp1 = await verifier(data.email)
      req.session.otp = otp1
      console.log(req.session);
      if (!req.session.otp) {
        data.valid = false
        return res.json(data)
      }
      data.valid = true
      req.session.info = data
    }
  }
  res.json(data)


})
router.get('/email', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "email.html"))


})
router.put('/change/password', async (req, res) => {
  const pass = req.body.password
  if (req.session.forgot && req.session.user && pass.length >= 8 && req.body.confirm === pass) {
    req.session.forgot = false
    await credential.findOneAndUpdate({ email: req.session.user }, { password: pass })
    return res.json(req.body)
  }
  return res.json({ password: false })
})



router.get('/change/password', (req, res) => {
  if (req.session.forgot && req.session.user) {
    return res.sendFile(path.join(__dirname, "public", "change.html"))
  }
  res.status(404).send("<pre>Not Found</pre>")
})



router.post("/verification/otp", async (req, res) => {
  data = req.body
  console.log(req.session.otp);
  if (req.session.otp) {
    if (data.otp === req.session.otp) {
      data.verified = true
      if (req.session.forgot) {
        data.forgot = true
        req.session.user = req.session.info.email
        req.session.otp = false
        return res.json(data)
      }
      data.forgot = false
      const docs = await credential.find({ email: req.session.info.email })
      if (!docs.length) {
        const doc = new credential(req.session.info);
        await doc.save()
      }
      req.session.user = req.session.info.email
      req.session.otp = false
      return res.json(data)
    }
    data.verified = false
    return res.json(data)
  }
  return res.json({ verified: false })
})



router.post('/login', async (req, res) => {
  let data = req.body;
  req.session.forgot = false
  if (data.email) {
    const info = await credential.find({ email: data.email })
    data.exists = info.length !== 0
    if (data.exists) {
      if (info[0].password === data.password) {
        otp = await verifier(data.email)
        if (!otp) {
          data.valid = false
          return res.json(data)
        }
        data.valid = true
        req.session.otp = otp
        req.session.info = data
        data.pass = true
      }
      else {
        data.pass = false
      }
    }
  }
  res.json(data)
})



router.post('/verification/email', async (req, res) => {
  let email = req.body.email;
  let data = req.body
  if (email) {
    const info = await credential.find({ email: email })
    data.exists = info.length !== 0
    if (data.exists) {
      otp = await verifier(email)
      if (!otp) {
        data.valid = false
        return res.json(data)
      }
      data.valid = true
      req.session.otp = otp
      req.session.info = data
      req.session.forgot = true
    }
  }
  res.json(data)
})



router.get('/dashboard', async (req, res) => {
  const info = await credential.find({ email: req.session.user })
  console.log(info);
  if (req.session.user) {
    const { firstname, lastname } = info[0]
    console.log(req.session.user + " --LOGGED IN");
    res.render('main', { layout: 'index', firstname: firstname, lastname: lastname })
  }
  else res.status(401).send("<pre>UNAUTHORISED ACCESS !!</pre>")
})



router.get("/resend", async (req, res) => {
  if (req.session.otp && req.session.info) {
    const otp = await verifier(req.session.info.email)
    if (otp) {
      req.session.otp = otp
      res.redirect('/verification/otp')
    }
    else res.status(404).send("<pre>Not Found</pre>")
  }
  else res.status(404).send("<pre>Not Found</pre>")
})

module.exports = router