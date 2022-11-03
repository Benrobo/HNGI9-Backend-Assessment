## HNGI9 First Assignment.

This is just a basic `nodejs` assignment for the `backend` section in `HNGI9`.

### Created using 
- Nodejs
- Expressjs

### Deployed to Railway.app

[Live URL](https://hng-task1-s07a.onrender.com/user)

### Setting up.

### Step 1

clone the repo
```sh
git clone  https://github.com/Benrobo/HNGI9-Backend-Assessment.git
```

### Step 2
Install all dependencies. 
> Note:- before doing that, make sure you have `nodejs` and `npm` installed locally.

```sh
npm install
```


### Step 3
Start the local server
```sh
npm start
```

You should get the following result in the terminal

```sh
server started at http://localhost:5000
```

### Step 4

visit `http://localhost:5000/user` to see the below response.

```json
{
"slackUsername":"benrobo",
"backend": true,
"age":20,
"bio":"....."
}
```

### Task 2
Making some calculations.
visit `http://localhost:5000/compute` and pass in a payload in the below format.

```js
{
    "operation_type": "multiplication",
    "x": "5",
    "y": "5"
}
```
Result should be
```js
{
  "slackUsername": "Benrobo",
  "operation_type": "multiplication",
  "result": 25
}
```

open the link in browser and you should be greeted with a text called `Hello World`
