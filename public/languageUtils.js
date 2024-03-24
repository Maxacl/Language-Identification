import DetectLanguage from "detectlanguage";

const API_URL = "https://ws.detectlanguage.com/0.2/detect?";
const API_KEY = "0406a448633a08682da4abca1c76c359";

const detectlanguage = new DetectLanguage(API_KEY); // use DetectLanguage to create detectlanguage object

async function fetchData(userInput) {
  try {
    const detectionResult = await detectlanguage.detect(userInput);
    console.log(detectionResult);
    const detectedLanguage = detectionResult[0].language; // FIXME Convert to titlecase from all Caps
    const confidenceResult = detectionResult[0].confidence;
    const reliabilityResult = detectionResult[0].isReliable;
    const finalTranslation = await translateLanguage(detectedLanguage);
    const translationResult = finalTranslation;

    const languageObject = {
      userText: userInput,
      finalTranslation: translationResult,
      confidenceResult: confidenceResult,
      reliabilityResult: reliabilityResult
    }
    return languageObject;
  } catch (error) {
    throw error;
  }
};

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

export {fetchData, translateLanguage};