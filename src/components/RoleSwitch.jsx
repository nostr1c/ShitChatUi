import { useState } from "react";
import Switch from "react-switch"
import "./scss/RoleSwitch.scss"

function RoleSwitch({ label, ...props }) {

  return (
    <label className="RoleSwitch">
      <span>{label}</span>
      <Switch
        {...props}
        handleDiameter={28}
        offColor="#915353"
        onColor="#577D57"
        offHandleColor="#C79387"
        onHandleColor="#7AB877"
        height={40}
        width={70}
        borderRadius={6}
        uncheckedIcon={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              fontSize: 15,
              color: "lightgrey",
              paddingRight: 2
            }}
          >
            No
          </div>
        }
        checkedIcon={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              fontSize: 15,
              color: "white",
              paddingRight: 2
            }}
          >
            Yes
          </div>
        }
      />
    </label>
  );
}

export default RoleSwitch