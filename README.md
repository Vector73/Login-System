
# Web login system

This is a full-stack web project which implements fully functional Login system with 2-step verification. It majorly uses node.js with express.js for backend development and mongo db for database management with mongoose as wrapper. Handlebars are used for server-side rendering. 


## Setup Email-ID
Add your email-id and app password in router.js 
Example:
```javascript
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "xyz@gmail.com",
    pass: "hjdgsfajfegjkgsu"
  }
}, {
  from: "xyz@gmail.com",
});
```


## Run Locally

Clone the project

```bash
  git clone https://github.com/Vector73/Login-System
```

Go to the project directory

```bash
  cd <Project_name>
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  node .\index.js
```


## Authors

- [@Vector73](https://www.github.com/Vector73)

