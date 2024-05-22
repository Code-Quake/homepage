// import React, { useState, useEffect } from "react";
// import { widgetApiEndpoints } from "@/utils/defaults";
// import axios from "axios";

// const WeatherWidget = ({ options }) => {
//   const [loading, setLoading] = useState(true);
//   const [icon, setIcon] = useState(null);
//   const [description, setDescription] = useState(null);
//   const [temp, setTemp] = useState(null);
//   const [showDetails, setShowDetails] = useState(false);
//   const [weatherDetails, setWeatherDetails] = useState([]);
//   const [data, setData] = useState<IData>({} as IData);

//   useEffect(() => {
//     checkProps();
//   }, []);

//   const endpoint = `${widgetApiEndpoints.weather}`;

//   const tempDisplayUnits = (() => {
//         return "°F";
//   })();

//   const speedDisplayUnits = (() => {
//         return "mph";
//   })();

//   const processTemp = (temp: number) => {
//     return `${Math.round(temp)}${tempDisplayUnits}`;
//   };


//     useEffect(() => {
//       axios
//         .get(`${widgetApiEndpoints.codeStats}/api/users/codequake`)
//         .then((response) => {
//           setData(response.data);
//           handleData();
//         })
//         .catch((dataFetchError) => {
//           console.error(
//             "Unable to fetch data from CodeStats.net",
//             dataFetchError
//           );
//         });
//     }, [handleData]);


//   const processData = (data) => {
//     setIcon(data.weather[0].icon);
//     setDescription(data.weather[0].description);
//     setTemp(processTemp(data.main.temp));
//     if (!options.hideDetails) {
//       makeWeatherData(data);
//     }
//   };

//   const makeWeatherData = (data) => {
//     setWeatherDetails([
//       [
//         { label: "Min Temp", value: processTemp(data.main.temp_min) },
//         { label: "Max Temp", value: processTemp(data.main.temp_max) },
//         { label: "Feels Like", value: processTemp(data.main.feels_like) },
//       ],
//       [
//         { label: "Pressure", value: `${data.main.pressure}hPa` },
//         { label: "Humidity", value: `${data.main.humidity}%` },
//         { label: "visibility", value: data.visibility },
//         { label: "wind", value: `${data.wind.speed}${speedDisplayUnits}` },
//         { label: "clouds", value: `${data.clouds.all}%` },
//       ],
//     ]);
//   };

//   const toggleDetails = () => {
//     setShowDetails(!showDetails);
//   };

//   const checkProps = () => {
//     const ops = options;
//     if (!ops.apiKey) error("Missing API key for OpenWeatherMap");

//     if ((!ops.lat || !ops.lon) && !ops.city) {
//       error("A city name or lat + lon is required to fetch weather");
//     }

//     if (ops.units && ops.units !== "metric" && ops.units !== "imperial") {
//       error("Invalid units specified, must be either 'metric' or 'imperial'");
//     }
//   };

//   return (
//     <div className="weather">
//       <div className="intro">
//         <p className="temp">{temp}</p>
//         <i className={`owi owi-${icon}`}></i>
//       </div>
//       <p className="description">{description}</p>
//       {showDetails && weatherDetails.length > 0 && (
//         <div className="details">
//           {weatherDetails.map((section, indx) => (
//             <div className="info-wrap" key={indx}>
//               {section.map((weather) => (
//                 <p className="info-line" key={weather.label}>
//                   <span className="lbl">{weather.label}</span>
//                   <span className="val">{weather.value}</span>
//                 </p>
//               ))}
//             </div>
//           ))}
//         </div>
//       )}
//       {weatherDetails.length > 0 && (
//         <p className="more-details-btn" onClick={toggleDetails}>
//           {showDetails ? "Show Less" : "Show More"}
//         </p>
//       )}
//     </div>
//   );
// };

// export default WeatherWidget;
