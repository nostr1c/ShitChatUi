import "../pages/scss/Login.scss";

function ValidationErrorList({ errors }) {
  if (!errors || errors.length === 0) return null;

  return (
    <ul className="Errors">
      {errors.map((error, i) => (
        <li key={i}>{error}</li>
      ))}
    </ul>
  )
}

export default ValidationErrorList;