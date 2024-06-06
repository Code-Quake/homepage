import React, { FC, PropsWithChildren, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import styles from "./Popup.module.css";

export const Popup: FC<PropsWithChildren<{ popupKey: string; popupTitle: string }>> =
  ({ popupTitle, popupKey, children }) => {
    const closePopup = useCallback(
      (id: string) => {
        const overlay = document.getElementById("overlay");
        overlay!.style.display = "none";
        const popup = document.getElementById(id);
        popup!.style.display = "none";
      },
      []
    );

    return (
      <div className={styles.popup} id={popupKey}>
        <div className={styles.popupheader}>
          <div className={styles.popupcontrols}>
            <span>{popupTitle}</span>
            <button
              className={styles.popupclose}
              onClick={() => closePopup(popupKey)}
            >
              <FontAwesomeIcon icon={faClose} />
            </button>
          </div>
        </div>
        <div className={styles.popupcontent}>
          <span className="val">{children}</span>
        </div>
      </div>
    );
  };
