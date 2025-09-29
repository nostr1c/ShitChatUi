import "./scss/ConfirmationModal.scss";

function ConfirmationModal({ title, subTitle, yesText, noText, onConfirm, onCancel, children }) {
  return (
    <div className="Confirm">
      <h3>{title}</h3>
      <p>{subTitle}</p>
      
      {children}

      <div className="Confirm--Actions">
        <button
          className="Confirm--Actions--Yes"
          onClick={onConfirm}
        >
          {yesText ?? "Yes"}
        </button>
        <button
          className="Confirm--Actions--No"
          onClick={onCancel}
        >
          {noText ?? "No"}
        </button>
      </div>
    </div>
  );
}

export default ConfirmationModal;