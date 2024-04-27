import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useParams, useNavigate, Link } from "react-router-dom";
import Error from "../Components/Error";
import Spinner from "../Components/Spinner";
import { findCountryName } from "../Components/CountryCodes";
import "../Styles/CountryDetails.css";

function CountryDetails() {

  const navigate = useNavigate();
  const { country } = useParams();
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNativeNames = (name) =>
    Object.values(name.nativeName).map((language) => language.common);

  const fetchCurrencies = (name) =>
    Object.values(name).map(
      (currencies) => `${currencies.name} (${currencies.symbol})`
    );

  useEffect(() => {
 
    setLoading(true);
    setError(null);

    let isMounted = true;
    const fetchUrl =
      country.length === 3
        ? `https://restcountries.com/v3.1/alpha/${country}`
        : `https://restcountries.com/v3.1/name/${country}?fullText=true`;

    fetch(fetchUrl)
      .then((response) => {
        if (!response.ok)
          throw new Error(`Ошибка HTPP! Status: ${response.status}`);

        return response.json();
      })
      .then((data) => {
        if (isMounted) {
          setApiData(data[0]);
          setLoading(false);
        }
      })
      .catch((error) => {
        if (isMounted) {
          if (error.message === "Failed to fetch") {
            setError("No internet connection. Please check your network.");
          } else {
            setError("An error occurred while fetching data from the API.");
          }
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [country]);

  return (
    <section className="country-details-section">
      <div className="back-btn-container" data-aos="fade-right">
        <button
          type="button"
          onClick={() => {
            navigate("/");
          }}
        >
          <IoArrowBack /> Back
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <Error error={error} />
      ) : (
        <div className="countryInfoSection">
          <div className="countryFlag-container" data-aos="fade-right">
            <img src={apiData.flags.png} alt={`${apiData.name.common} Flag`} title={`${apiData.name.common} Flag`} />
          </div>

          <div className="countryStats-container" data-aos="fade-left">
            <p className="country-title">{apiData.name.common}</p>

            <div className="country-details">
              <div>
                <p>
                  <strong>Native Names: </strong>
                  {apiData.name ? (
                    fetchNativeNames(apiData.name).map((names) => `${names}`).join(", ")
                  ) : (
                    <span>--</span>
                  )}
                </p>
                <p>
                  <strong>Population: </strong>
                  {apiData.population ? (
                    apiData.population.toLocaleString()
                  ) : (
                    <span>--</span>
                  )}
                </p>
                <p>
                  <strong>Регион: </strong>
                  {apiData.region ? apiData.region : <span>--</span>}
                </p>
                <p>
                  <strong>Столица: </strong>
                  {apiData.subregion ? apiData.subregion : <span>--</span>}
                </p>
                <p>
                  <strong>Капитал: </strong>
                  {apiData.capital && typeof apiData.capital === "object" ? (
                    apiData.capital.map((record) => `${record}`).join(", ")
                  ) : (
                    <span>--</span>
                  )}
                </p>
              </div>

              <div>
                <p>
                  <strong>Валюта: </strong>
                  {apiData.currencies ? (
                    fetchCurrencies(apiData.currencies).map((record) => `${record}`).join(", ")
                  ) : (
                    <span>--</span>
                  )}
                </p>
                <p>
                  <strong>Языки: </strong>
                  {apiData.languages ? (
                    Object.values(apiData.languages).map((record) => `${record}`).join(", ")
                  ) : (
                    <span>--</span>
                  )}
                </p>
              </div>
            </div>

            <div className="country-border">
              {apiData.borders && (
                <p>
                  <strong>Границы: </strong>
                </p>
              )}
              {apiData.borders ? (
                apiData.borders.map((record, index) => {
                  const countryName = findCountryName(record);
                  return (
                    <Link to={`/${record}`} key={index} title={countryName}>
                      <span className="country-border-name">{countryName}</span>
                    </Link>
                  );
                })
              ) : (
                <span className="no-countries">
                  У него нет соседних стран, имеющих общую границу.
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default CountryDetails;
