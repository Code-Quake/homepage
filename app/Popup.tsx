import React, { FC, PropsWithChildren } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

export const Popup: FC<
  PropsWithChildren<{ popupKey: string; popupTitle: string }>
> = ({ popupTitle, popupKey, children }) => {
  const overlay = document.getElementById("overlay");

  function closePopup(id: any) {
    overlay!.style.display = "none";
    document.getElementById(id)!.style.display = "none";
  }

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
