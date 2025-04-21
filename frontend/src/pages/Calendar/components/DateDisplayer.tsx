import React, { useRef } from "react";
import { format, addDays, subDays, addMonths, subMonths, addYears, subYears } from "date-fns";

import { useCalendarContext } from "../../../context/CalendarContext"

function DateDisplayer() {
  const { refDate, setRefDate } = useCalendarContext();
  const dateInputRef = useRef(null);

  const changeDate = (type, direction) => {
    let newDate;
    if (type === "day") {
      newDate = direction === "up" ? addDays(refDate, 1) : subDays(refDate, 1);
    } else if (type === "month") {
      newDate = direction === "up" ? addMonths(refDate, 1) : subMonths(refDate, 1);
    } else if (type === "year") {
      newDate = direction === "up" ? addYears(refDate, 1) : subYears(refDate, 1);
    }
    setRefDate(newDate);
  };

  const openDatePicker = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  const handleDateChange = (e) => {
    const [year, month, day] = e.target.value.split("-").map(Number);
    const selectedDate = new Date(Date.UTC(year, month - 1, day));
    if (!isNaN(selectedDate)) {
      setRefDate(new Date(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate()));
    }
  };

  return (
    <div className="container-datedisplayer">

      {/*HIDDEN DATE PICKER*/}
      <input
        type="date"
        ref={dateInputRef}
        style={{ display: "none" }}
        value={format(refDate, "yyyy-MM-dd")}
        onChange={handleDateChange}
      />


      {["day", "month", "year"].map((type) => {
        let value;
        if (type === "day") value = format(refDate, "dd");
        if (type === "month") value = format(refDate, "MM");
        if (type === "year") value = format(refDate, "yy");

        return (
          <div key={type} className="dmy">

            <div className="arrow-button" onClick={() => changeDate(type, "up")}>
              ▲
            </div>

            <div className="dmy-label" onClick={openDatePicker}>
              {value}
            </div>

            <div className="arrow-button" onClick={() => changeDate(type, "down")}>
              ▼
            </div>

          </div>
        );
      })}
    </div>
  );
}

export default DateDisplayer;
