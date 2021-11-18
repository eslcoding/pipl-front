import React from "react";
import "../App.css";
import Swal from "sweetalert2";

import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
//Explore more Monday React Components here: https://style.monday.com/
import AttentionBox from "monday-ui-react-core/dist/AttentionBox.js";
import mondayService from "../services/mondayService";
import AddColumn from "../cmps/AddColumn";
import ResetPrefix from "../cmps/ResetPrefix";
const monday = mondaySdk();
const KEY = "BOARD_KEY";
class Home extends React.Component {
  // Default state
  state = {
    settings: {
      background: "#e2445c",
      attentionBoxTitle: "Hey",
      attentionBoxType: "danger",
    },
    name: "",
    nextNum: null,
    columns: null,
    selectedColumn: null,
    prefixMap: null,
    isFirst: true,
    prefixKeys: null,
  };

  async componentDidMount() {
    // mondayService.authorization()
    var query;
    this.setPrefixKeys();
    await monday.listen("context", async (res) => {
      const boardId = res.data.boardIds[0];
      // let prefixMap = await mondayService.getPrefixMapByBoardId(boardId)
      // const isFirst = !!prefixMap

      // const { id: boardId } = res.data.boards[0]
      this.setState({ ...this.state, boardId });

      query = `query {boards (ids:${this.state.boardId}){
        columns {
          id
          title
          type
        }
      }}`;
      res = await monday.api(query);
      let { columns } = res.data.boards[0];
      columns = columns.filter(
        (col) => col.type === "color" || col.type === "text"
      );
      // columns = columns.filter(col => col.type === 'text') // new prod - yuval
      this.setState({ columns });
    });
  }

  getItemsIds = async (boardId) => {
    const query = `
    query 
      { boards (ids:${boardId}) 
        { items {
           id
      
          }
        }
      }`;
    const { data } = await monday.api(query);
    const { items } = data.boards[0];
    return items.map((item) => item.id);
  };

  createColumn = async (srcColId) => {
    try {
      Swal.showLoading();

      const { boardId } = this.state;
      let prefixMap = await mondayService.getPrefixMapByBoardId(boardId);
      let prefixMapAll = await mondayService.getPrefixMapAll(boardId);
      /* reconstract prefixmap to match what we did before */
      prefixMapAll = { map: prefixMapAll[0] };
      if (prefixMap) {
        const { isConfirmed } = await Swal.fire({
          title: "You Already have an ID Column",
          text: "Are you sure you want to create another one?",
          icon: "warning",
          confirmButtonText: "yes",
          showDenyButton: "true",
          denyButtonText: "no",
        });
        if (!isConfirmed) return;
      }

      var query = `mutation {
        create_column(board_id: ${boardId}, title: "PERSISTENT ID", column_type: text) {
          id
        }
      }`;
      let res = await monday.api(query);
      // let res = await mondayService.addColumnBack(query)

      const {
        create_column: { id: targetColId },
      } = res.data;
      const colPrefixs = await this.getColPrefixs(srcColId, boardId);
      const itemsIds = await this.getItemsIds(boardId);

      prefixMap = prefixMap || { map: {}, boardId };
      itemsIds.forEach(async (itemId, idx) => {
        const currPrefix = colPrefixs[idx];
        let text = "";
        if (currPrefix) {
          const count = await this.getPrefixCount(currPrefix, prefixMapAll);
          text = currPrefix + "-" + count;
        }
        text = JSON.stringify(text);
        query = ` mutation {
          change_simple_column_value (board_id: ${boardId}, item_id: ${itemId}, column_id: "${targetColId}", value: ${text}) {
            id
          }
        }`;
        await monday.api(query);
      });

      await this.savePrefixMap(prefixMap, prefixMapAll, srcColId, targetColId);
      Swal.close();

      Swal.fire({
        icon: "success",
        title: "Column Added Successfully",
        text: "Please refresh to continue",
      });
    } catch (error) {
      console.log("error: ", error);
    } finally {
    }
    // window.parent.location.reload();
  };

  getColPrefixs = async (srcColId, boardId) => {
    const query = `query
                     {  boards (ids:${boardId}) 
                         { items {
                           column_values {
                             id
                             text
                            }
                         }
                       }
                     }`;

    let res = await monday.api(query);
    const {
      data: { boards },
    } = res;
    const { items } = boards[0];
    return items.map((itemColVals) => {
      const { column_values: colVals } = itemColVals;
      const srcColVal = colVals.find((col) => col.id === srcColId);
      return srcColVal.text;
    });
  };

  getPrefixCount = async (prefix, prefixMap) => {
    if (prefix === "null") return "";
    prefixMap.map[prefix] = prefixMap.map[prefix]
      ? prefixMap.map[prefix] + 1
      : 1;
    return prefixMap.map[prefix];
  };

  savePrefixMap = async (prefixMap, prefixMapAll, srcColId, targetColId) => {
    prefixMap.targetColId = targetColId;
    prefixMap.srcColId = srcColId;
    const newPrefixMap = await mondayService.updatePrefixMap(prefixMap);
    await mondayService.updatePrefixMapAll(prefixMapAll);
  };

  // apiCallTest = () => {
  //   const query = ``
  // }

  setSelectedColumn = (selectedColumn) => {
    this.setState({ selectedColumn });
  };

  authMonday = () => {
    mondayService.authMonday();
  };

  setPrefixKeys = async () => {
    const prefixeMapArr = await mondayService.getPrefixMapAll();
    let prefixKeys = Object.keys(prefixeMapArr[0])
      .filter((key) => key !== "_id")
      .map((key) => ({ value: key, label: key }));
    this.setState({ prefixKeys });
    console.log("setPrefixKeys= -> prefixKeys", prefixKeys);
  };

  resetPrefix = async (prefix) => {
    const { isConfirmed } = await Swal.fire({
      title: "",
      text: `Are you sure you want to reset "${prefix}"?`,
      icon: "warning",
      confirmButtonText: "yes",
      showDenyButton: "true",
      denyButtonText: "no",
    });
    if (!isConfirmed) return;

    try {
      await mondayService.resetPrefix(prefix);
      Swal.fire({
        icon: "success",
        title: `The prefix "${prefix}" is now reset`,
        // text: 'Please refresh to continue',
      });
    } catch (err) {}
  };

  render() {
    const { columns, prefixKeys } = this.state;
    if (!columns) return <div>Loading..</div>;
    return (
      <div className="container">
        <AddColumn
          setSelectedColumn={this.setSelectedColumn}
          columns={columns}
          createColumn={this.createColumn}
        />
        {prefixKeys && (
          <ResetPrefix resetPrefix={this.resetPrefix} prefixKeys={prefixKeys} />
        )}
        {/* <button onClick={this.authMonday}></button> */}
      </div>
    );
  }
}

export default Home;
