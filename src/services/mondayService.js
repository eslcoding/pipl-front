const BASE_URL = "/api/test";
const axios = require("axios");
/*PROD*/
const domain = "https://test102-monday-pipl.herokuapp.com";

/*DEV*/
// const domain = 'http://localhost:3030'

// saveToStorage(PREFIX_KEY, {})
// function creatPrefixMap() {
//     var prefixMap

// }
/**
 * queries to monday
 * @param {string} prefix
 * @param {string} targetCol
 * @returns {object} data from monday
 */
async function query(prefix, targetCol) {
  // try {
  //     axios.post('', ())
  // }

  let res = await fetch(domain + "/api/monday/test", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      colData: { prefix, targetCol },
    }),
  });
  res = await res.json();

  return res.data;
}
/**
 *
 * @param {string} query
 * @returns
 */
async function addColumnBack(query) {
  let res = await fetch(domain + "/api/monday/addColumn", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: query,
    }),
  });
  console.log("res: ", res);

  res = await res.json();

  return res;
}
/**
 * authenticates monday user
 * @returns {object} res
 */
async function authMonday() {
  let res = await fetch(domain + "/api/monday/auth", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("res: ", res);

  res = await res.json();

  return res;
}
/**
 * Gets prefix map by id
 * @param {string} boardId
 * @returns {object} prefix map by id
 */
async function getPrefixMapByBoardId(boardId) {
  // try {
  //     axios.post('http://localhost:8302', ())
  // }

  // let res = await fetch(domain+'/api/monday/getPrefixMap/'+boardId, {
  console.log("domain: ", domain);

  let res = await fetch(domain + "/api/monday/getPrefixMap", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      boardId: boardId,
    }),
  });
  res = await res.json();

  return res;
}
/**
 * Gets all prefix map
 * @param {string} boardId
 * @returns {object} all prefix map
 */
async function getPrefixMapAll(boardId) {
  // try {
  //     axios.post('http://localhost:8302', ())
  // }

  // let res = await fetch(domain+'/api/monday/getPrefixMap/'+boardId, {
  console.log("domain: ", domain);

  let res = await fetch(domain + "/api/monday/getPrefixMapAll", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      boardId: boardId,
    }),
  });
  res = await res.json();

  return res;
}

/**
 * Updates prefix maps on monday
 * @param {object} prefixMap
 * @returns {object} new prefix maps
 */
async function updatePrefixMap(prefixMap) {
  // try {
  //     axios.post('http://localhost:8302', ())
  // }

  let res = await fetch(domain + "/api/monday/updatePrefixMap", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prefixMap: prefixMap,
    }),
  });
  res = await res.json();

  return res;
}
async function updatePrefixMapAll(prefixMapAll) {
  // try {
  //     axios.post('http://localhost:8302', ())
  // }

  let res = await fetch(domain + "/api/monday/updatePrefixMapAll", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prefixMapAll: prefixMapAll,
    }),
  });
  res = await res.json();

  return res;
}

async function resetPrefix(prefix) {
  console.log("prefix: ", prefix);

  //     axios.post('http://localhost:8302', ())
  // }
  try {
    let res = await fetch(domain + "/api/monday/resetPrefix", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prefix: prefix,
      }),
    });
    res = await res.json();

    return res;
  } catch (err) {}
}

export default {
  query,
  // getPrefixMap,
  updatePrefixMap,
  updatePrefixMapAll,
  getPrefixMapByBoardId,
  addColumnBack,
  authMonday,
  getPrefixMapAll,
  resetPrefix,
};
