import express from "express";
import axios from "axios";
import ejs from "ejs";
import bodyParser from "body-parser";
import DetectLanguage from "detectlanguage";

const app = express();
const port = 3000;
const API_URL = "https://ws.detectlanguage.com/0.2/detect?";
const API_KEY = "0406a448633a08682da4abca1c76c359";

const detectlanguage = new DetectLanguage(API_KEY); // use DetectLanguage to create detectlanguage object

app.use(bodyParser.urlencoded({ extended: true }));

function fetchData(word) {
  return new Promise((resolve, reject) => {
    const myPromise = detectlanguage.detect(word); // output: [object Promise]
    console.log(`myPromise: ${myPromise}`);

    myPromise.then((result) => {
      console.log(`Result: ${JSON.stringify(result)}`); // 
      console.log(`Result: ${result}`); // 

      let finalResult = {
        wordEval: result,
        firstResult: result[0],
        languageResult: result[0].language,
        confidenceResult: result[0].confidence
      };

      let langugageTranslation = translateLanguage(finalResult.languageResult); // returns a Promise object
      console.log(`this is the languageTranslation variable: ${langugageTranslation}`);

      resolve(result);
    }).catch((error) => {
      console.error(`Error: ${error}`);
      reject(error);
    });
  });
}

function translateLanguage(language) {
  JSON.stringify(language);

  return new Promise((resolve, reject) => {
    detectlanguage.languages().then(function(result) {
      const matchingLanguage = result.find(obj => obj.code === language);
      if (matchingLanguage) {
        console.log(`The language is: ${matchingLanguage.name}`);
        resolve(language);
      } else {
        reject("No matching language was found in list. Promise rejected.");
      }
    }).catch(error => {
      console.error("Error occurred:", error);
      reject(error);
    });
  })
};

app.get("/", (req, res) => {
  try {
    res.render("index.ejs");
  } catch(error) {
    console.error("Error:", error.message);
  }
});


app.post("/detect-language", async (req, res) => {
  let postBody = req.body['user-input']; // get user input from client side
  fetchData(postBody)
    .then((result) => {
      let finalResult = {
        wordEval: result,
      };
      res.render("index.ejs", {data: finalResult});

    }).catch((error) => {
      console.error(`Error occurred: ${error}`);
      res.status(500).send("An error occurred"); // Send an error response if promise is rejected
    });
  });

app.listen(port, () => {
  console.log(`Successfully listening on port: ${port}`);
})