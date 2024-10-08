import React, { memo } from "react";
import Collapse from "../Collapsable/Collabsable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleUp,
  faChevronCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import { Card, CardBody } from "@nextui-org/react";
import { ExpandableSectionProps } from "./WeatherInterfaces";

export const ExpandableSection: React.FC<ExpandableSectionProps> = memo(
  ({ title, count, isExpanded, onToggle, displayTable, children }) => (
    <>
      <Card className="mx-2.5 mb-1.5 bg-gradient-to-t from-[var(--dark-blue)] to-[var(--accent-blue)]">
        <CardBody>
          <div className="text-[var(--primary-fuchsia)] text-xl flex justify-between items-center">
            <span className="pr-2.5">
              {title} {count !== undefined && `(${count})`}
            </span>
            {displayTable && (
              <button onClick={onToggle} aria-label={`Toggle ${title}`}>
                <FontAwesomeIcon
                  icon={isExpanded ? faChevronCircleUp : faChevronCircleDown}
                />
              </button>
            )}
          </div>
        </CardBody>
      </Card>
      {displayTable && <Collapse isExpanded={isExpanded}>{children}</Collapse>}
    </>
  )
);

ExpandableSection.displayName = "ExpandableSection";

export default ExpandableSection;