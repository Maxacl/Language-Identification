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

async function fetchData(word) {
  try {
    const detectionResult = await detectlanguage.detect(word);
    const detectedLanguage = detectionResult[0].language;
    const confidenceResult = detectionResult[0].confidence;
    const translationResult = await translateLanguage(detectedLanguage);
    const finalTranslation = translationResult;

    const langObj = {
      detectedLanguage: finalTranslation,
      confidenceResult: confidenceResult
    }
    return langObj;
  } catch (error) {
    throw error;
  }
}

async function translateLanguage(languageCode) {
  try {
    const languageArray = await detectlanguage.languages();
    const matchingLanguage = languageArray.find(obj => obj.code === languageCode);
    if (matchingLanguage) {
      console.log(`The language is: ${matchingLanguage.name}`);
    }
    return matchingLanguage.name;
  }    
  catch (error) {
    throw error;
  }
};

app.get("/", (req, res) => {
  try {
    res.render("index.ejs");
  } catch(error) {
    console.error("Error:", error.message);
  }
});

app.post("/detect-language", async (req, res) => {
  try {
    let postBody = req.body['user-input']; // get user input from client side
    const languageObject = await fetchData(postBody);
    console.log(languageObject);

    res.render("index.ejs", {data: languageObject});
  }
  catch (error) {
      res.status(500).send("An error occurred"); // Send an error response if promise is rejected
      throw error;
  }
});

app.listen(port, () => {
  console.log(`Successfully listening on port: ${port}`);
})