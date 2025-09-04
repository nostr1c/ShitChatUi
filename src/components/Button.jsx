import "./scss/Button.scss";


function Button({ onClick, children, isCreate, ...props }) {

  const classes = ["Button"]

  if (isCreate)
    classes.push("Create")

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