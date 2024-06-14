import React, { FC, PropsWithChildren } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

const Popup: FC<
  PropsWithChildren<{ popupKey: string; popupTitle: string, color: string | undefined, icon: string }>
> = ({ popupTitle, popupKey, color, icon,children }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      {icon === "" && (
        <FontAwesomeIcon
          onClick={onOpen}
          icon={faCircleInfo}
          style={{ color: color }}
        />
      )}
      {icon !== "" && (
        <i
          className={`wi wi-main ${icon}`}
          onClick={onOpen}
          style={{ color: color }}
        ></i>
      )}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size={"5xl"}
        scrollBehavior="inside"
        backdrop="blur"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#545454] text-[#a8b0d3]",
          header: "border-b-[1px] border-[#292f46] text-[#e5e5e5]",
          footer: "border-t-[1px] border-[#292f46] text-[#e5e5e5]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {popupTitle}
              </ModalHeader>
              <ModalBody>{children}</ModalBody>
              <ModalFooter>
                <Button className="p-[3px] relative" onPress={onClose}>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                  <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                    Close
                  </div>
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Popup;
