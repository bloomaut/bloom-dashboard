import { useState, useEffect } from "react";

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const useFormattedDate = (timestamp: number): string => {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setFormattedDate(formatDate(timestamp));
  }, [timestamp]);

  return formattedDate;
};

export default useFormattedDate;
