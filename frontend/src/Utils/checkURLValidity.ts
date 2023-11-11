import axios from "axios";
import { PORT } from "./endpoint";

export const isValidUrl = async (inputURL: string) => {
  try {
    // Parsing the inputURL to create a URL object
    const newURL = new URL(inputURL);

    // Checking the protocol and hostname of the URL
    if (newURL.protocol === 'http:' || newURL.protocol === 'https:') {
      // Making an API call to my server to validate the domain
      const response = await axios.get(`http://localhost:${PORT}/validate-domain`, {
        params: {
          url: newURL.hostname
        }
      });

      // Checking if the URL is reachable (status code 200)
      if (response.status === 200) {
        // If the URL is reachable, return a positive status
        return {
          status: true
        };
      }
    }
  } catch (error) {
    // Handling errors during URL validation
    return {
      status: false,
      message: "Invalid URL. Please enter a valid URL."
    };
  }
};