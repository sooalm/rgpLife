import React from "react";

import { v4 as uuidv4 } from "uuid";
import "../../styles/GraphCon.css";
import { useSelector, useDispatch } from "react-redux";

const GraphCon = () => {
  const calculateStart = () => {
    const currentYear = new Date().getFullYear();
    const startDay = new Date(currentYear, 0, 1).getDay();

    if (new Date(currentYear, 1, 29).getDate() == 29) {
      return { startDay, days: 366 };
    }

    return { startDay, days: 365 };
  };
  const daysArr = calculateStart();

  const activeDays = useSelector((state) => state.tasks.activeDays);

  return (
    <>
      <div className="graph-table">
        <div className="months">
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((month, index) => (
            <div key={index} className="month">
              {month}
            </div>
          ))}
        </div>
        <div className="days">
          {[
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ].map((d, index) => (
            <span key={uuidv4()} className="weekDay">
              {d}
            </span>
          ))}
          {Array.from({ length: daysArr.startDay }).map((_, index) => (
            <div key={uuidv4()} className="day day--notVisible"></div>
          ))}
          {Array.from({ length: daysArr.days }).map((_, index) => {
            return index + 1 in activeDays ? (
              <div
                key={index}
                className="day"
                style={{
                  backgroundColor: `rgb(108,${
                    10 * activeDays[index + 1] <= 255
                      ? 255 - 10 * activeDays[index + 1]
                      : 0
                  },150)`,
                }}
              ></div>
            ) : (
              <div key={index} className="day"></div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default GraphCon;
