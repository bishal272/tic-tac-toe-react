/* eslint-disable react/prop-types */
const Square = (props) => {
  let classname = "pl";
  if (props.o) {
    classname = "comp";
  }
  return (
    <div className={"square " + classname} {...props}>
      {props.x ? "x" : props.o ? "o" : ""}
    </div>
  );
};

export default Square;
