import React, { FC, PropsWithChildren, memo, useCallback } from "react";
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

interface IPopupProps {
  popupKey: string;
  popupTitle: string;
  color?: string;
  icon: string;
}

const modalClassNames = {
  body: "py-6 weather-data-card",
  backdrop: "backdrop",
  base: "border-[#292f46] bg-[#19172c] dark:bg-[#545454] text-[#a8b0d3]",
  header: "border-b-[1px] border-[#292f46] text-[#e5e5e5] popupheader",
  footer: "border-t-[1px] border-[#292f46] text-[#e5e5e5] popupfooter",
  closeButton: "hover:bg-white/5 active:bg-white/10",
};

const modalMotionProps = {
  variants: {
    enter: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  },
};

const Popup: FC<PropsWithChildren<IPopupProps>> = memo(
  ({ popupTitle, color, icon, children }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
          onOpen();
        }
      },
      [onOpen]
    );

    const renderIcon = () => {
      if (icon === "") {
        return (
          <FontAwesomeIcon
            onClick={onOpen}
            icon={faCircleInfo}
            className="pl-2.5"
            style={{ color }}
          />
        );
      }
      return (
        <i
          className={`wi wi-main ${icon}`}
          onClick={onOpen}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label="Open popup"
          style={{ color }}
        />
      );
    };

    return (
      <>
        {renderIcon()}
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          size="5xl"
          scrollBehavior="inside"
          backdrop="blur"
          motionProps={modalMotionProps}
          classNames={modalClassNames}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {popupTitle}
                </ModalHeader>
                <ModalBody>{children}</ModalBody>
                <ModalFooter>
                  <Button
                    className="p-[3px] relative bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg"
                    onPress={onClose}
                  >
                    <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
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
  }
);

Popup.displayName = "Popup";

export default Popup;
