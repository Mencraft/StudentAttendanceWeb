const functions = require('firebase-functions');
const axios = require('axios').default;
//const FormData = require('form-data');
const convertObjectToFormData = require('js-to-formdata');

const cors = require('cors')({
    origin: true
});

const baseURL = "https://api-us.faceplusplus.com/facepp/v3/detect";
const api_key = "m73Fv6ikNDXkfOtjvDAc_x2HZ2JduWzt";
const api_secret = "OckzeZqcX5piOrxUycN97QtI8IEy9zdz";



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.detectface = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        if (req.method !== 'POST') {
            // Return a "method not allowed" error
            return res.status(405).end();
        } else {
            console.log(req.body);
            const image_file = req.body.image_file
            const originalObject = {
                api_key: api_key,
                api_secret: api_secret,
                image_file: image_file
            };


            const formData = convertObjectToFormData(originalObject);
            axios.post(baseURL, formData)
                .then(function(response) {
                    console.log(response);
                    res.send(response);
                    return response
                })
                .catch(function(error) {
                    console.log(error);

                    res.send(error);
                    return error;
                });
            // res.send(200);
        }


    })
})