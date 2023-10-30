import express from "express"

const app = express();

app.listen(3001, () => {
    console.log('app is running on 3001 port');
})