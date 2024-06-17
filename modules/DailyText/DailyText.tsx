"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const DailyText = () => {
  const [data, setData] = useState("");

  const handleData = useCallback(() => {
    console.write(data);
    //parse html
  }, [data]);

  async function logMovies() {
    debugger;
  const response = await fetch("https://wol.jw.org/en/wol/h/r1/lp-e");
  const movies = await response.json();
  console.log(movies);
}


  useEffect(() => {
const config = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  },
};

axios
  .get("https://wol.jw.org/en/wol/h/r1/lp-e", config)
  .then(({ data }) => {
    debugger;
    console.log(data);
  })
  .catch((dataFetchError) => {
    debugger;
    console.error("Unable to fetch data from CodeStats.net", dataFetchError);
  });


    // axios
    //   .get("https://wol.jw.org/en/wol/h/r1/lp-e")
    //   .then((response) => {
    //     setData(response.data);
    //     handleData();
    //   })
    //   .catch((dataFetchError) => {
    //     console.error(
    //       "Unable to fetch data from CodeStats.net",
    //       dataFetchError
    //     );
    //   });
  }, [handleData]);

  return (
    <div className="code-stats-wrapper">
      <div className="user-meta">
        <div className="user-info-wrap">
          <p className="username">CodeQuake</p>
        </div>
      </div>
    </div>
  );
};

export default DailyText;
