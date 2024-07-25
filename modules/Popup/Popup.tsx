import React, {
  FC,
  PropsWithChildren,
  memo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@nextui-org/react";

interface IPopupProps {
  popupKey: string;
  popupTitle: string;
  color?: string;
  icon: string;
}

const Popup: FC<PropsWithChildren<IPopupProps>> = memo(
  ({ popupTitle, color, icon, children }) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const openDialog = useCallback(() => {
      if (dialogRef.current) {
        dialogRef.current.showModal();
      }
    }, []);

    const closeDialog = useCallback(() => {
      if (dialogRef.current) {
        dialogRef.current.close();
      }
    }, []);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
          openDialog();
        }
      },
      [openDialog]
    );

    useEffect(() => {
      const dialog = dialogRef.current;
      if (dialog) {
        const handleClick = (event: MouseEvent) => {
          const rect = dialog.getBoundingClientRect();
          const isInDialog =
            rect.top <= event.clientY &&
            event.clientY <= rect.top + rect.height &&
            rect.left <= event.clientX &&
            event.clientX <= rect.left + rect.width;
          if (!isInDialog) {
            dialog.close();
          }
        };
        dialog.addEventListener("click", handleClick);
        return () => {
          dialog.removeEventListener("click", handleClick);
        };
      }
    }, []);

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
        <dialog ref={dialogRef} id="dialog" className="dialog">
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
