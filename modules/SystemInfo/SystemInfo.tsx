import React from "react";
import os from "os";
import { CardBody, CardContainer, CardItem } from "../ui/3dCard";

const SystemInfoWidget = () => {
  const { uptime, hostname, userInfo, version, arch, release } = os;
  const cpu = os.cpus();
  const { totalmem, freemem } = os;
  const networkInterfaces = os.networkInterfaces();

  const memory = {
    total: Math.round(totalmem() / (1024 * 1024 * 1024)),
    free: Math.round(freemem() / (1024 * 1024 * 1024)),
    freePercent: Math.floor((freemem() / totalmem()) * 100),
  };

  const networkInfo = Object.entries(networkInterfaces).reduce(
    (acc: any, [k, net_info]) => {
      if (net_info!.length > 2) {
        acc.push({ key: k, address: net_info![2].address });
      } else {
        acc.push({ key: k, address: net_info![1].address });
      }
      return acc;
    },
    []
  );

  const uptimeInSeconds = uptime();
  const uptimeInHours = (uptimeInSeconds / 3600).toFixed(2);

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
              {hostname()} ({userInfo().username})
            </p>
            <p className="system">
              {version()} ({arch()} - {release()})<span className="gap">|</span>
              Uptime: {uptimeInHours} Hour(s)
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
              <span className="system">{cpu.length}</span>
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
        </CardItem>
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          <div className="some-info">
            {networkInfo.map(
              ({ key, address }: { key: string; address: string }) => (
                <div key={key}>
                  <span className="system-header">{key}: </span>
                  <span className="system">{address}</span>
                </div>
              )
            )}
          </div>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
};

export default SystemInfoWidget;
