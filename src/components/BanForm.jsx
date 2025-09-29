import { useState } from "react";
import "./scss/BanForm.scss"

function BanForm({ onChange }) {
  const [reason, setReason] = useState("");

  const handleReasonChange = (e) => {
    setReason(e.target.value);
    onChange(e.target.value);
  }

  return (
    <div className="BanForm">
      <label>
        Ban Reason
        <input 
          type="text"
          value={reason}
          onChange={handleReasonChange}
          placeholder="Enter ban reason"
        />
      </label>
    </div>
  );
}

export default BanForm;