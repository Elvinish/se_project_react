import { useContext } from "react";
import CurrentTemperatureUnitContext from "../../utils/contexts/CurrentTemperatureUnitContext";
import "./ToggleSwitch.css";

export default function ToggleSwitch() {
  const { handleToggleSwitchChange, currentTemperatureUnit } = useContext(
    CurrentTemperatureUnitContext
  );

  return (
    <label className="toggle-switch">
      <input
        onChange={handleToggleSwitchChange}
        type="checkbox"
        className="toggle-switch__checkbox"
      />
      <span className="toggle-switch_circle"></span>
      <span
        style={{ color: `${currentTemperatureUnit === "F" ? "white" : ""}` }}
        className={"toggle-switch_text toggle-switch_text_F"}
      >
        F
      </span>
      <span
        style={{ color: `${currentTemperatureUnit === "C" ? "white" : ""}` }}
        className={"toggle-switch_text toggle-switch_text_C"}
      >
        C
      </span>
    </label>
  );
}
