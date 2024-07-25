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
    const openDialog = useCallback(() => {
      const dialog = document.getElementById("dialog") as HTMLDialogElement;
      dialog.showModal();
    }, []);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
          openDialog();
        }
      },
      [openDialog]
    );

    const renderIcon = () => {
      if (icon === "") {
        return (
          <FontAwesomeIcon
            onClick={openDialog}
            onKeyDown={handleKeyDown}
            icon={faCircleInfo}
            role="button"
            aria-label="Open popup"
            className="pl-2.5"
            style={{ color }}
          />
        );
      }
      return (
        <i
          className={`wi wi-main ${icon}`}
          onClick={openDialog}
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
        <dialog id="dialog" className="dialog">
          <form method="dialog">
            <div className="popupheader pt-3 pr-3 pl-3 text-lg flex justify-center">
              {popupTitle}
            </div>
            <div className="py-6 pl-6 pr-6 weather-data-card">{children}</div>
            <div className="relative fixed bottom-0 popupfooter">
              <Button
                className="p-[3px] mr-2 mb-1 mt-2 relative bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg float-right outline-none"
                type="submit"
              >
                <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
                  Close
                </div>
              </Button>
            </div>
          </form>
        </dialog>
      </>
    );
  }
);

Popup.displayName = "Popup";

export default Popup;
