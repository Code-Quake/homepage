import React, { useMemo } from "react";
import os from "os";
import { CardBody, CardContainer, CardItem } from "../ui/3dCard";

interface NetworkInfo {
  key: string;
  address: string;
}

const SystemInfoWidget: React.FC = () => {
  const systemInfo = useMemo(() => {
    const {
      uptime,
      hostname,
      userInfo,
      version,
      arch,
      release,
      cpus,
      totalmem,
      freemem,
      networkInterfaces,
    } = os;

    const memory = {
      total: Math.round(totalmem() / (1024 * 1024 * 1024)),
      free: Math.round(freemem() / (1024 * 1024 * 1024)),
      freePercent: Math.floor((freemem() / totalmem()) * 100),
    };

    const networkInfo: NetworkInfo[] = Object.entries(
      networkInterfaces()
    ).reduce((acc: NetworkInfo[], [k, net_info]) => {
      if (net_info && net_info.length > 0) {
        const address = net_info.find((ni) => ni.family === "IPv4")?.address;
        if (address) {
          acc.push({ key: k, address });
        }
      }
      return acc;
    }, []);

    const uptimeInHours = (uptime() / 3600).toFixed(2);

    return {
      hostname: hostname(),
      username: userInfo().username,
      version: version(),
      arch: arch(),
      release: release(),
      uptimeInHours,
      cpuCores: cpus().length,
      memory,
      networkInfo,
    };
  }, []);

  return (
    <CardContainer className="system-info-wrapper">
      <CardBody className="relative group/card dark:bg-[var(--dark-blue)] dark:border-white/[0.2] border-black/[0.1] w-full sm:w-[36rem] h-auto sm:h-[27rem] rounded-xl p-6 border">
        <CardItem
          translateZ="100"
          rotateX={20}
          rotateZ={0}
          className="w-full mt-4"
        >
          <div className="some-info">
            <p className="host">
              {systemInfo.hostname} ({systemInfo.username})
            </p>
            <p className="system">
              {systemInfo.version} ({systemInfo.arch} - {systemInfo.release})
              <span className="gap">|</span>
              Uptime: {systemInfo.uptimeInHours} Hour(s)
            </p>
          </div>
        </CardItem>
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          <div className="some-info">
            <div>
              <span className="system-header">CPU Cores: </span>
              <span className="system">{systemInfo.cpuCores}</span>
            </div>
          </div>
        </CardItem>
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          <div className="some-info">
            <div>
              <span className="system-header">Total Memory: </span>
              <span className="system">{systemInfo.memory.total} GB</span>
            </div>
            <div>
              <span className="system-header">Free Memory: </span>
              <span className="system">{systemInfo.memory.free} GB</span>
            </div>
            <div>
              <span className="system-header">Free Percent: </span>
              <span className="system">{systemInfo.memory.freePercent}%</span>
            </div>
          </div>
        </CardItem>
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          <div className="some-info">
            {systemInfo.networkInfo.map(({ key, address }) => (
              <div key={key}>
                <span className="system-header">{key}: </span>
                <span className="system">{address}</span>
              </div>
            ))}
          </div>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
};

export default SystemInfoWidget;
