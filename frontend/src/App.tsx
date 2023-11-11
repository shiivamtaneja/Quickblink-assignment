import { ChangeEvent, useEffect, useState } from "react";

import axios, { AxiosError } from "axios";

import { isValidUrl } from "./Utils/checkURLValidity";
import { PORT } from "./Utils/endpoint";

import Input from "./Components/Input";
import Select from "./Components/Select";

import { RxCross2 } from 'react-icons/rx';
import { TiTickOutline } from 'react-icons/ti';
import { BeatLoader } from 'react-spinners';

function App() {

  const [loading, setLoading] = useState(false);

  const [url, setUrl] = useState<string | null>(null);
  const [checkURLValidity, setCheckURLValidity] = useState(false);

  const [error, setError] = useState(false);
  const [errorDetails, setErrorDetails] = useState('');

  const [sucess, setSucess] = useState(false);
  const [sucessDetails, setSucessDetails] = useState('');

  const [option, setOption] = useState<'1' | '2' | '3'>('1');

  const handleURLChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setSucess(false);
    setLoading(true);

    const newURL = e.currentTarget.value;
    setUrl(newURL);
  };

  const handleOptionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setError(false);
    setSucess(false);

    setOption(e.currentTarget.value as '1' | '2' | '3')
  };

  // URL Validation useEffect
  useEffect(() => {
    // This function will be called after 2 seconds of user inactivity
    const validateURL = async () => {
      // Initiates loading state and clears any existing error flags
      setLoading(true);
      setError(false);

      try {
        // Validates the provided URL using 'isValidUrl' function
        if (url) {
          const validity = await isValidUrl(url);

          if (!validity?.status) {
            // Handles invalid URL by setting error flags and details
            setError(true);
            setCheckURLValidity(false);
            setErrorDetails(validity?.message as string);
          } else {
            // Indicates a valid URL by setting the checkURLValidity state
            setCheckURLValidity(true);
          }

        }
      } catch (error) {
        // Handles and logs errors occurring during URL validation
        console.log("Error during URL validation: ", error);
      } finally {
        // Resets loading state upon completion of the validation process
        setLoading(false);
      }
    };

    // Sets a timer to trigger the URL validation process after a 2-second delay
    const timer = setTimeout(validateURL, 2000);

    // Clears the timer when the component unmounts or when the URL changes before the delay
    return () => clearTimeout(timer);
  }, [url]);

  const handleSubmit = () => {
    // Switch case to handle different options chosen by the user
    switch (option) {
      // Case for option 1: Checking URL status
      case '1':
        checkStatus(url);
        break;

      // Case for option 2: Checking SSL certificate
      case '2':
        checkSSL(url);
        break;

      // Case for option 3: Checking file existence
      case '3':
        checkFileExists(url);
        break;

      // Default case: No specified option or an unrecognized one
      default:
        return; // No action taken for an unrecognized or default option
    }
  };

  const checkStatus = async (websiteURL: typeof url) => {
    // Sets loading state and clears any existing error flags
    setLoading(true);
    setError(false);

    try {
      if (websiteURL) {
        // Marks URL validity before the API call
        setCheckURLValidity(true);

        // API call to check 200 status of the provided URL
        await axios.get(`http://localhost:${PORT}/check-200-status`, {
          params: {
            url: websiteURL
          }
        })
          .then(response => {
            if (response.status === 200) {
              // Handles successful API response
              setError(false);
              setSucess(true);
              setSucessDetails("Sucess! " + response.data);
            } else {
              // Handles unsuccessful API response when URL doesn't return a 200 status
              setError(true);
              setSucess(false);
              setErrorDetails("Error! URL doesn't return a 200 status.");
            }
          });
      }

      // Resets loading state upon API call completion
      setLoading(false);

    } catch (err) {
      // Handles errors during the API call
      const error = err as AxiosError;

      setLoading(false);

      // Retrieves the HTTP status code from the error response
      const status = error.response?.status

      // Checks and manages different error status codes
      if (status === 999 || status === 429) {
        setError(true);
        setSucess(false);
        setErrorDetails("Error! " + error.response?.data);
      }
    }
  };

  const checkSSL = async (websiteURL: typeof url) => {
    // Sets loading state and clears any existing error flags
    setLoading(true);
    setError(false);

    try {
      if (websiteURL) {
        // Marks URL validity before the API call
        setCheckURLValidity(true);

        // API call to check for SSL Certification of the provided URL
        await axios.get(`http://localhost:${PORT}/checkSSL`, {
          params: {
            url: websiteURL
          }
        })
          .then(response => {
            if (response.data.validSSL) {
              // Handles successful API response
              setError(false);
              setSucess(true);
              setSucessDetails('Sucess! The URL has verified SSL Certification.');
            } else {
              // Handles unsuccessful API response when URL doesn't have SSL Certification
              setError(true);
              setSucess(false);
              setErrorDetails("URL doesn't have verified SSL Certification");
            }
          });
      }

      // Resets loading state upon API call completion
      setLoading(false);

    } catch (err) {
      // Handles errors during the API call
      const error = err as AxiosError;

      setLoading(false);

      // Retrieves the HTTP status code from the error response
      const status = error.response?.status

      // Checks and manages different error status codes
      if (status === 999 || status === 429) {
        setError(true);
        setSucess(false);
        setErrorDetails("Error! " + error.response?.data);
      }
    }
  };

  const checkFileExists = async (websiteURL: typeof url) => {
    setLoading(true);
    setError(false);

    try {
      if (websiteURL) {
        setCheckURLValidity(true);

        await axios.get(`http://localhost:${PORT}/check-robots-txt`, {
          params: {
            url: websiteURL
          }
        })
          .then(response => {
            if (response.status === 200) {
              // Handles a successful API response indicating the 'robots.txt' file exists for the provided URL
              setError(false);
              setSucess(true);
              setSucessDetails("Sucess! " + response.data);
            } else {
              // Handles unsuccessful API response indicating the 'robots.txt' file doesn't exists for the provided URL
              setError(true);
              setSucess(false);
              setErrorDetails("Error! " + response.data);
            }
          });
      }

      // Resets loading state upon API call completion
      setLoading(false);

    } catch (err) {
      // Handles errors during the API call
      const error = err as AxiosError;

      setLoading(false);

      // Retrieves the HTTP status code from the error response
      const status = error.response?.status

      // Checks and manages different error status codes
      if (status === 999 || status === 429) {
        setError(true);
        setSucess(false);
        setErrorDetails("Error! " + error.response?.data);
      }
    }
  };

  return (
    <>
      <section className='bg-[#FEFAEF] min-h-screen'>
        <div className='min-h-screen px-4 mx-auto bg-white shadow-2xl max-w-screen-2xl rounded-xl'>
          <div className='flex flex-col items-center gap-12 py-12'>
            <h1 className='text-xl font-bold uppercase'>Assignment</h1>
            <form className="relative space-y-8">
              <Select
                title='Select Option'
                id='options'
                options={[
                  { value: '1', text: 'Check for a 200 Status' },
                  { value: '2', text: 'SSL Certificate Verification' },
                  { value: '3', text: "Content of Robert.txt" }
                ]}
                onChange={handleOptionChange}
                required
              />
              <Input
                name='Enter URL'
                id='url'
                placeholder={url === null ? '' : url}
                required={true}
                moveLabel={url !== null && url !== ''}
                type='text'
                onChange={handleURLChange}
                loading={loading}
              />
              {loading ?
                <>
                  <span className="absolute top-[5.3rem] right-3 bg-white ">
                    <BeatLoader color={'#B06500'} loading={loading} size={8} />
                  </span>
                </> :
                <>
                  {
                    url &&
                    <>
                      {checkURLValidity ?
                        <span className="absolute top-[5.3rem] right-3 text-green-400 text-2xl">
                          <TiTickOutline />
                        </span> :
                        <span className="absolute top-[5.4rem] right-3 text-red-500 text-xl">
                          <RxCross2 />
                        </span>
                      }
                    </>
                  }
                </>
              }
              <button
                type='submit'
                className={` ${!url || error || loading ? "cursor-not-allowed opacity-50" : ''} custom-brown-btn w-full`}
                disabled={!url || error || loading}
                onClick={handleSubmit}
              >
                Submit Result
              </button>
            </form>

            <div className="flex flex-col gap-2 w-72">
              <h2 className='text-xl font-bold uppercase border-b border-gray-500'>
                Result
                {loading &&
                  <>
                    <span className="pl-2 bg-white ">
                      <BeatLoader color={'#B06500'} loading={loading} size={8} />
                    </span>
                  </>
                }
              </h2>
              {error &&
                <div className="flex flex-row justify-between w-full p-4 bg-red-500 rounded-md md:w-72 ">
                  <p className="text-base font-semibold text-gray-50 ">
                    {errorDetails}
                  </p>
                </div>
              }
              {sucess &&
                <div className="flex flex-row justify-between w-full p-4 bg-green-500 rounded-md md:w-72 ">
                  <p className="text-base font-semibold text-gray-50 ">
                    {sucessDetails}
                  </p>
                </div>
              }
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default App
