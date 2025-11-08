import { useSelector } from "react-redux";
import "./scss/ValidationErrorList.scss";

function ValidationErrorList({ errors }) {
  if (!errors || errors.length === 0) return null;

  const translations = useSelector((state) => state.translations.english);
  return (
    <ul className="ErrorList">
      {errors.map((error, i) => (
        <li key={i}>{translations[error]}</li>
      ))}
    </ul>
  )
}

export default ValidationErrorList;