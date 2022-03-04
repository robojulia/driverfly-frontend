import axios from 'axios';

export default function handler(req, res) {
    console.log('fsdafasfas', req.body)
    axios.post('http://localhost:4000/auth/login', {
        "email": "test1@test.com",
        "password": "password"
    })
        .then(function (response) {
            // handle success
            // res = response;
            console.log("handle success", response.data);
            res.json(response.data)
        })
        .catch(function (error) {
            // handle error
            // res = error;
            console.log("handle error", error);
            // res.json(error)
        })
        .then(function () {
            // always executed
            console.log("always executed");
            // res.json(response.data)
            // res.json({ name: 'John Doe' })
        });
        return res;
}