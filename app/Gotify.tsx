"use client";
import React, { useState, useEffect } from "react";
import  singleton  from "./WebSocketStore";

const Gotify = () => {

  useEffect(() => {
    singleton.listen((msg) => {
        debugger;
        console.log(msg);
    });

  }, []);

  return (
    <div>
        Hi There
    </div>
  );
};

export default Gotify;
