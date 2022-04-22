require("dotenv").config();
const express = require("express");
const https = require("https");
const url = require("url");

const app = express();


// Defines a folder where static information is stored (css, images, etc)

app.use(express.static("public"));

//bodyParser deprecated and no longer needed, express.urlencoded substitutes it.

app.use(express.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

// Post request fetching data from signup.html form (ex: req.body.fName).

app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    //mailchimp API configurations

     const data = {
         members: [
             {
                email_address: email,
                 status: "subscribed",
                 merge_fields: {
                    FNAME: firstName,
                     LNAME: lastName
                 }
             }
         ]
     };

     const jsonData = JSON.stringify(data);


    var url = `https://${process.env.API_SERVER}.api.mailchimp.com/3.0/lists/${process.env.LIST_ID}/`
    var options = {
        method: "POST",
        auth: `anystring:${process.env.API_KEY}`,
    };


    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
         
     })

    request.write(jsonData);
    request.end();

});

//redirects

app.post("/failure", function (req, res) {
    res.redirect("/");

})



//Listens to dynamic port on Heroku or on local system

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000");
});
