import React from 'react';
import style from '../style.css';

export default class AddRound extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
          <div id={style.scheduleRoundAdder}>
              <input type="number" id={style.scheduleRoundAdderNumber} min="1" />
              <select id={style.scheduleRoundAdderStyle} className={style.scheduleEditorSelect}>

              </select>
              <select id={style.scheduleRoundAdderLevel} className={style.scheduleEditorSelect}>

              </select>
              <select id={style.scheduleRoundAdderDance} className={style.scheduleEditorSelect}>

              </select>
              <select id={style.scheduleRoundAdderRound} className={style.scheduleEditorSelect}>

              </select>
              <div id={style.scheduleEditorAddButton}>Add</div>
          </div>
        );
    }
}