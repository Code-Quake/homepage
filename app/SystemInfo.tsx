import React from "react";
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
  let ni: any[] = [];

  for (let k in networkInterfaces) {
    let net_data = k;

    let net_info = networkInterfaces[k];

    console.log(net_info!.length);

    if(net_info!.length > 2) {
        net_data += ": " + net_info![2].address;
    }
    else{
        net_data += ": " + net_info![1].address;
    }

    ni.push(net_data);
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
        <p className="system">CPU Cores {no_of_logical_core}</p>
      </div>
      <div className="some-info">
        <p className="system">Total Memory {memory.total} GB</p>
        <p className="system">Free Memory {memory.free} GB</p>
        <p className="system">Free Percent {memory.freePercent}%</p>
      </div>
      <div className="some-info">
        {ni.map((element) => {
          return <p className="system" key={element}>{element}</p>;
        })}
      </div>
    </div>
  );
};

export default SystemInfoWidget;
