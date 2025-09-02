import React, { createContext, useState } from "react";

// Создаем контекст
export const TimeContext = createContext(`wihtout provider`);

export const TimeContextProvider = ({ children }) => {
  const [sharedDataTime, setSharedDataTime] = useState(false);

  return (
    <TimeContext.Provider value={{ sharedDataTime, setSharedDataTime }}>
      {children}
    </TimeContext.Provider>
  );
};
