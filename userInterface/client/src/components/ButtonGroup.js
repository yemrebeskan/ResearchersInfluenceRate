import React from "react";
import classes from "./ButtonGroup.module.css";
const ButtonGroup = (props) => {
  const isCited = props.datas.isCited;

  const isCoAuthor = props.datas.isCoAuthor;
  return (
    <div className={classes.btnGroup}>
      <button className={classes.Btn} onClick={props.onClickSearch}>
        Search
      </button>
      <button
        className={
          isCited ? classes.btnActive + " " + classes.Btn : classes.Btn
        }
        onClick={props.onClickCitation}
      >
        Citation
      </button>

      <button
        className={
          isCoAuthor ? classes.btnActive + " " + classes.Btn : classes.Btn
        }
        onClick={props.onClickCoAuthors}
      >
        CoAuthors
      </button>
    </div>
  );
};

export default ButtonGroup;
