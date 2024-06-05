import React, {
  useEffect,
  useState,
  FC,
  PropsWithChildren,
  useRef,
} from "react";

export const Popup: FC<PropsWithChildren<{ popupKey: string }>> = ({
  popupKey,
  children,
}) => {
  const overlay = document.getElementById("overlay");

  function closePopup(id: any) {
    overlay!.style.display = "none";
    document.getElementById(id)!.style.display = "none";
  }
    debugger;

  return (
    <div className="popup" id={popupKey}>
      <div className="popupcontrols">
        <button className="popupclose" onClick={() => closePopup(popupKey)}>
          X
        </button>
      </div>
      <div className="popupcontent">
        <span className="val">{children}</span>
      </div>
    </div>
  );
};
