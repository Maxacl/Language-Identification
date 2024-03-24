import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import {fetchData, translateLanguage} from "./public/languageUtils.js";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  try {
    res.render("index.ejs");
  } catch(error) {
    console.error("Error:", error.message);
  }
});

app.post("/language-detected", async (req, res) => {
  try {
    let postBody = req.body['user-input']; // get user input from client side
    const languageObject = await fetchData(postBody);
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