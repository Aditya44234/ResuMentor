import pdfToText from "react-pdftotext";

 async function parseResume(file) {
  try {
    const text = await pdfToText(file);
    return text;
  } catch (error) {
    throw new Error("Failed to extract text from PDF.");
  }
}


export default parseResume;