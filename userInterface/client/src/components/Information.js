import React, { Fragment } from "react";
import classes from "./Information.module.css";
const Information = (props) => {
  const isCited = props.isCited;
  const isCoAuthor = props.isCoAuthor;
  return (
    <React.Fragment>
      {isCited && (
        <div className={classes.info}>
          <p className={classes.incitation}>Incited Authors</p>
          <p className={classes.outcitation}>OutCited Authors</p>
        </div>
      )}
      {isCoAuthor && (
        <div className={classes.info}>
          <p className={classes.coauthors}>CoAuthors</p>

          <p></p>
        </div>
      )}
    </React.Fragment>
  );
};

export default Information;
