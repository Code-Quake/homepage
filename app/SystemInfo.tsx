import React, { createElement } from "react";
import os from "os";

export const SystemInfoWidget = () => {
  const meta = {
    timestamp: new Date(),
    uptime: os.uptime(),
    hostname: os.hostname(),
    username: os.userInfo().username,
    system: `${os.version()} (${os.arch()} - ${os.release()})`,
  };

  let ut_sec = os.uptime();
  let ut_min = ut_sec / 60;
  let ut_hour = ut_min / 60;

  ut_sec = Math.floor(ut_sec);
  ut_min = Math.floor(ut_min);
  ut_hour = Math.floor(ut_hour);

  ut_hour = ut_hour % 60;
  ut_min = ut_min % 60;
  ut_sec = ut_sec % 60;

  let cpu_s = os.cpus();
  let no_of_logical_core = 0;
  cpu_s.forEach((element) => {
    no_of_logical_core++;
  });

  const memory = {
    total: Math.round(os.totalmem() / (1024 * 1024 * 1024)),
    free: Math.round(os.freemem() / (1024 * 1024 * 1024)),
    freePercent: Math.floor((os.freemem() / os.totalmem()) * 100),
  };

  const networkInterfaces = os.networkInterfaces();
  let ni = [];

  for (let k in networkInterfaces) {
    let net_info = networkInterfaces[k];

    if (net_info!.length > 2) {
      let el = createElement(
        "div",
        { key: k },
        createElement("span", { className: "system-header" }, k + ": "),
        createElement("span", { className: "system" }, net_info![2].address)
      );
      ni.push(el);
    } else {
      let el = createElement(
        "div",
        { key: k },
        createElement("span", { className: "system-header" }, k + ": "),
        createElement("span", { className: "system" }, net_info![1].address)
      );
      ni.push(el);
    }
  }

  return (
    <div className="system-info-wrapper">
      <div className="some-info">
        <p className="host">
          {meta.hostname} ({meta.username})
        </p>
        <p className="system">
          {meta.system}
          <span className="gap">|</span>
          Uptime:{" "}
          {ut_hour +
            " Hour(s) " +
            ut_min +
            " minute(s) and " +
            ut_sec +
            " second(s)"}
        </p>
      </div>
      <div className="some-info">
        <div>
          <span className="system-header">CPU Cores: </span>
          <span className="system">{no_of_logical_core}</span>
        </div>
      </div>
      <div className="some-info">
        <div>
          <span className="system-header">Total Memory: </span>
          <span className="system">{memory.total} GB</span>
        </div>
        <div>
          <span className="system-header">Free Memory: </span>
          <span className="system">{memory.free} GB</span>
        </div>
        <div>
          <span className="system-header">Free Percent: </span>
          <span className="system">{memory.freePercent}%</span>
        </div>
      </div>
      <div className="some-info">
        {ni.map((element) => {
          return element;
        })}
      </div>
    </div>
  );
};

export default SystemInfoWidget;
