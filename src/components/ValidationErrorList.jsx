import "./scss/ValidationErrorList.scss";

function ValidationErrorList({ errors }) {
  if (!errors || errors.length === 0) return null;

  return (
    <ul className="ErrorList">
      {errors.map((error, i) => (
        <li key={i}>{error}</li>
      ))}
    </ul>
  )
}

export default ValidationErrorList;