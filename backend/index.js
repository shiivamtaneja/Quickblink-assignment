const express = require('express');

const cors = require('cors');

const app = express();

const dnsPromises = require('dns').promises;
const https = require('https');

const rateLimit = require('express-rate-limit');

app.use(cors());

const PORT = 3000;

const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes in milliseconds
  max: 3, // Limit each IP to 3 requests per windowMs
  message: 'Too many requests, please try again later.',
});

/**
 * @desc Validates the domain of a provided URL using internal server and proxy endpoint
 * @route GET /validate-domain
 * @access public
 */
app.get('/validate-domain', async (req, res) => {
  const { url } = req.query;

  try {
    const validationResponse = await fetch(`http://localhost:${PORT}/validate-url?url=${url}`);

    if (validationResponse.status == 200) {
      res.status(200).send('Valid Domain.')
    } else {
      res.status(400).send('Invalid Domain.')
    }

  } catch (error) {
    console.log(error);
  }
});

/**
 * @desc Validates the domain name of the provided URL (Internal Use)
 * @route GET /validate-url
 * @access private
 */
app.get('/validate-url', async (req, res) => {
  const { url } = req.query;

  try {
    await dnsPromises.lookup(url);
    res.status(200).send("Valid URL.");

  } catch (error) {
    res.status(400).send("Invalid URL.");
  }
});

/**
 * @desc Checks the HTTP status of a provided URL
 * @route GET /check-200-status
 * @access public
 */
app.get('/check-200-status', apiLimiter, async (req, res) => {
  const { url } = req.query;

  try {
    const response = await fetch(url);

    if (response.status === 200) {

      res.status(200).send('URL returns a 200 status.');
    } else if (response.status === 429) {

      res.status(429).send('Too many requests, please try again later.');
    } else {

      res.status(response.status).send(response.statusText);
    }

  } catch (error) {
    console.log(error);
  }
});

/**
 * @desc Checks SSL certification status for a provided URL
 * @route GET /checkSSL
 * @access public
 */
app.get('/checkSSL', apiLimiter, (req, res) => {
  const { url } = req.query;

  https.get(url, (response) => {
    res.send({
      status: response.statusCode,
      validSSL: response.socket.authorized
    });
  })
    .on('error', (error) => {
      res.status(500).send("Error: ", error.message);
    });
});

/**
 * @desc Checks the existence of 'robots.txt' for a provided URL
 * @route GET /check-robots-txt
 * @access public
 */
app.get('/check-robots-txt', apiLimiter, async (req, res) => {
  const { url } = req.query;

  try {
    const robotsTxtUrl = new URL(url);

    // Appending robots.txt to the URL
    robotsTxtUrl.pathname = '/robots.txt';

    const response = await fetch(robotsTxtUrl);

    if (response.status === 200) {
      res.status(200).send('robots.txt exists at this URL.');
    } else {
      res.status(404).send('robots.txt does not exist at this URL.');
    }
  } catch (error) {
    res.status(400).send('Error checking robots.txt existence.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})