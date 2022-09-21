const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const connection = require("./db");
const math = require("mathjs");

let incitedData = {
  resname: " ",
  children: [],
};
let outcitedData = {
  resname: " ",
  children: [],
};

let citedData = {
  resname: " ",
  children: [],
};
let coAuthorsData = {
  resname: " ",
  children: [],
};
resid = " ";

const citedobject = {
  resId: resid,
  citeddata: citedData,
  coauthors: coAuthorsData,
};

const createincitedlist = (resdata) => {
  let k = 13;
  let incitedids = [];
  for (
    let i = resdata.incitedids.length - 14;
    i < resdata.incitedids.length;
    i++
  ) {
    resdata.incitedids[i] === undefined
      ? console.log()
      : incitedids.push(resdata.incitedids[i + k]);
    k -= 2;
  }
  incitedData.resname = resdata.name;
  incitedData.resid = resdata.resid;
  incitedData.children = incitedids;
  return incitedData;
};

const createoutcitedlist = (resdata) => {
  let k = 13;
  outcitedData.resname = resdata.name;
  outcitedData.resid = resdata.resid;
  let outcitedids = [];
  for (
    let i = resdata.outcitedids.length - 14;
    i < resdata.outcitedids.length;
    i++
  ) {
    resdata.outcitedids[i] === undefined
      ? console.log()
      : outcitedids.push(resdata.outcitedids[i + k]);
    k -= 2;
  }
  outcitedData.children = outcitedids;
  return outcitedData;
};

const createcitedlist = (resdata) => {
  let count = 0;
  let indexOfIncited = 0;
  let indexOfOutcited = 0;
  let citedlist = [];

  incitedData = createincitedlist(resdata);
  outcitedData = createoutcitedlist(resdata);
  citedData.resname = resdata.name;
  citedData.resid = resdata.resid;
  while (count != 28) {
    if (count % 2 === 0) {
      citedlist.push(outcitedData.children[indexOfOutcited]);
      indexOfOutcited += 1;

      // if (incitedData.children[indexOfIncited] === undefined) {
      //   indexOfIncited += 1;
      // } else {
      //   citedlist.push(incitedData.children[indexOfIncited]);
      //   indexOfIncited += 1;
      // }
    } else {
      citedlist.push(incitedData.children[indexOfIncited]);
      indexOfIncited += 1;
      // if (outcitedData.children[indexOfOutcited] === undefined) {
      //   indexOfOutcited += 1;
      // } else {
      //   citedlist.push(outcitedData.children[indexOfOutcited]);
      //   indexOfOutcited += 1;
      // }
    }
    count += 1;
  }

  citedData.children = citedlist;

  return citedData;
};

const createcoAuthors = (resdata) => {
  let k = 27;
  coAuthorsData.resname = resdata.name;
  coAuthorsData.resid = resdata.resid;
  let coauthors = [];
  for (
    let i = resdata.co_authors.length - 28;
    i < resdata.co_authors.length;
    i++
  ) {
    resdata.co_authors[i + k] === undefined
      ? console.log("")
      : coauthors.push(resdata.co_authors[i + k]);
    k -= 2;
  }
  if (coauthors.length % 2 !== 0) {
    coauthors.pop();
  }
  coAuthorsData.children = coauthors;
  return coAuthorsData;
};
connection
  .connect()
  .then(() => console.log("Conntected succesfully"))
  .catch((e) => console.log(e))
  .finally();
app.use(cors());
app.use(bodyParser.json());

// const saQuery = `select * from md where j->>'resid' like '%${req.body.resId}%'`;
app.post("/selectresearch", (req, res) => {
  citedobject.resId = req.body.resId;
  const selectQuery = `select * from md where j->>'resid' like '%${citedobject.resId}%'`;
  connection.query(selectQuery, (err, res) => {
    if (err) console.log(err);
    else {
      citedobject.citeddata = createcitedlist(res.rows[0].j);
      citedobject.coauthors = createcoAuthors(res.rows[0].j);
    }
  });
});

app.get("/researchers", (req, res) => {
  function myStopFunction() {
    clearTimeout(myTimeout);
  }
  const myTimeout = setTimeout(() => {
    res.send(citedobject);

    myStopFunction();
  }, 350);
});

app.listen(4000, () => {
  console.log("running on port 4000");
});
