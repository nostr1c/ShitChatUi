import "./scss/Button.scss";

function Button({ onClick, children, isCreate, isDelete, ...props }) {

  const classes = ["Button"]

  if (isCreate)
    classes.push("Create")

  if (isDelete)
    classes.push ("Delete")

  return (
    <button
      className={classes.join(" ")}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button;