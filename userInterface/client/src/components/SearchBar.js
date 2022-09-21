import React, { useState } from "react";
import classes from "./SearchBar.module.css";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const SearchBar = (props) => {
  const placeholder = props.datas.placeholder;
  const data = props.datas.data;
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  const [resname, setResname] = useState("");
  // program to convert first letter of a string to uppercase

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = data.filter((value) => {
      return value.researcher.toLowerCase().includes(searchWord.toLowerCase());
    });
    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  const searchHandler = () => {
    console.log("a");
  };

  const clearInput = () => {
    setFilteredData([]);
  };

  const selectHandler = (event) => {
    const resname = event.target.innerText;
    props.onSelect(resname);
  };

  return (
    <div className={classes.search}>
      <form className={classes.searchInputs}>
        <input
          type="text"
          placeholder={placeholder}
          value={wordEntered}
          onChange={handleFilter}
        />
        <div
          className={classes.searchIcon}
          onClick={filteredData.length !== 0 ? clearInput : searchHandler}
        >
          {filteredData.length === 0 ? (
            <SearchIcon onClick={searchHandler} />
          ) : (
            <CloseIcon className={classes.clearBtn} />
          )}
        </div>
      </form>
      {filteredData.length != 0 && (
        <div className={classes.dataResult}>
          {filteredData.slice(0, 15).map((value, key) => {
            return (
              <button
                key={key}
                className={classes.dataItem}
                onClick={selectHandler}
              >
                <p>{value.researcher}</p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
