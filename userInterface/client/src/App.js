import React, { useState } from "react";
import TreeChart from "./components/TreeChart";
import "./App.css";
import classes from "./App.module.css";
import SearchBar from "./components/SearchBar";
import resData from "./jsons/Authors.json";
import ButtonGroup from "./components/ButtonGroup";
import axios from "axios";
import Information from "./components/Information";
import TreeChart2 from "./components/TreeChart2";
import TreeChart3 from "./components/TreeChart3";

const citedData = {
  name: " ",
  children: [],
};

const coAuthorsData = {
  name: " ",
  children: [],
};

function App() {
  const [citeddata, setCitations] = useState(citedData);
  const [coAuthorsdata, setCoAuthors] = useState(coAuthorsData);
  const [isEnteredId, issetEnteredId] = useState(true);
  const [resId, setResId] = useState("");
  const [isCited, setisCited] = useState(false);
  const [isIncited, setIsIncited] = useState(true);
  const [isOutCited, setIsOutCited] = useState(true);
  const [isCoAuthor, setIsCoAuthor] = useState(false);

  const getCitedLists = () => {
    const controlOutCitations = (citeddata) => {
      let updatedauthor = {};
      let updateddatas = [];
      updatedauthor.resname = citeddata.resname;
      updatedauthor.resid = citeddata.resid;
      for (let count = 0; count < citeddata.children.length; count++) {
        if (count % 2 === 1) {
          if (citeddata.children[count] === undefined) {
            console.log();
          } else {
            updateddatas.push(citeddata.children[count]);
          }
        }
      }

      updatedauthor.children = updateddatas;
      return updatedauthor;
    };

    const controlInCitations = (citeddata) => {
      let updatedauthor = {};
      let updateddatas = [];
      updatedauthor.resname = citeddata.resname;
      updatedauthor.resid = citeddata.resid;
      for (let count = 0; count < citeddata.children.length; count++) {
        if (count % 2 === 0) {
          if (citeddata.children[count] === undefined) {
            console.log();
          } else {
            updateddatas.push(citeddata.children[count]);
          }
        }
      }

      updatedauthor.children = updateddatas;
      return updatedauthor;
    };

    const controlUndefinedDatas = (citeddata) => {
      let updatedauthor = {};
      let updateddatas = [];
      updatedauthor.resname = citeddata.resname;
      updatedauthor.resid = citeddata.resid;
      let count = 0;
      while (count != citeddata.length) {
        if (citeddata.children[count] === null) {
          break;
        } else if (citeddata.children[count] === undefined) {
          break;
        }
        updateddatas.push(citeddata.children[count]);
        count += 1;
      }
      if (updateddatas.length % 2 === 1) {
        updateddatas.pop();
      }
      updatedauthor.children = updateddatas;
      return updatedauthor;
    };
    let updatedauthor = {};
    axios
      .get("http://localhost:4000/researchers")
      .then((response) => response.data)
      .then((response) => {
        const authorlist = response.citeddata;

        if (
          authorlist.children[1] === null &&
          authorlist.children[0] !== null
        ) {
          updatedauthor = controlInCitations(authorlist);
          setIsOutCited(true);
          setIsIncited(false);
        } else if (
          authorlist.children[0] === null &&
          authorlist.children[1] === null
        ) {
          updatedauthor = {
            resname: authorlist.resname,
            resid: response.resid,
            children: [],
          };

          setIsOutCited(true);
          setIsIncited(true);
        } else if (
          authorlist.children[0] === null &&
          authorlist.children[1] !== null
        ) {
          updatedauthor = controlOutCitations(authorlist);
          setIsOutCited(false);
          setIsIncited(true);
        } else if (
          authorlist.children[0] !== null &&
          authorlist.children[1] !== null
        ) {
          updatedauthor = controlUndefinedDatas(authorlist);
          setIsOutCited(true);
          setIsIncited(true);
        }
        setCitations(updatedauthor);
        setCoAuthors(response.coauthors);
      });
  };

  const selectResearcherHandler = (searchedname) => {
    const resId = resData
      .filter((value) => {
        return value.researcher === String(searchedname);
      })
      .map((value) => {
        return value.semanticscholarid;
      })[0];
    issetEnteredId(false);
    setisCited(true);
    setResId(resId);
    axios.post("http://localhost:4000/selectresearch", { resId });
    getCitedLists();
  };

  const searchHandler = () => {
    setisCited(false);
    setIsCoAuthor(false);
    issetEnteredId(true);
  };

  const citationHandler = () => {
    setisCited(true);
    setIsCoAuthor(false);
    issetEnteredId(false);
  };
  const coAuthorsHandler = () => {
    setisCited(false);
    setIsCoAuthor(true);
    issetEnteredId(false);
  };

  return (
    <React.Fragment>
      {isEnteredId && (
        <SearchBar
          datas={{ placeholder: "Enter author name...", data: [...resData] }}
          onSelect={selectResearcherHandler}
        />
      )}
      <div className={classes.treeChart}>
        {isCited && <Information isCited={isCited} isCoAuthor={isCoAuthor} />}
        {isCoAuthor && (
          <Information isCited={isCited} isCoAuthor={isCoAuthor} />
        )}
        {isCited && isIncited && isOutCited && <TreeChart data={citeddata} />}
        {isOutCited && isCited && !isIncited && <TreeChart2 data={citeddata} />}
        {!isOutCited && isCited && isIncited && <TreeChart3 data={citeddata} />}
        {isCoAuthor && <TreeChart data={coAuthorsdata} />}
        {!isEnteredId && (
          <ButtonGroup
            datas={{
              isCited: isCited,
              isCoAuthor: isCoAuthor,
            }}
            onClickSearch={searchHandler}
            onClickCitation={citationHandler}
            onClickCoAuthors={coAuthorsHandler}
          />
        )}
      </div>
    </React.Fragment>
  );
}

export default App;
