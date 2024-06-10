import React, { FC, PropsWithChildren, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

const Popup: FC<
  PropsWithChildren<{ popupKey: string; popupTitle: string }>
> = ({ popupTitle, popupKey, children }) => {
  const closePopup = useCallback((id: string) => {
    const overlay = document.getElementById("overlay");
    overlay!.style.display = "none";
    const popup = document.getElementById(id);
    popup!.style.display = "none";
  }, []);

  return (
    <div className="popup" id={popupKey}>
      <div className="popupheader">
        <div className="popupcontrols">
          <span>{popupTitle}</span>
          <button className="popupclose" onClick={() => closePopup(popupKey)}>
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>
      </div>
      <div className="popupcontent">
        <span className="val">{children}</span>
      </div>
    </div>
  );
};

export default Popup;
