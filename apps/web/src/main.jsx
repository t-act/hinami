import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CalendarApp from "./calendar-mock";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CalendarApp />
  </StrictMode>
);
