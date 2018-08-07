import React, { Component } from 'react';

const Selecte = (props) => {
    const { showDiv, showList, list, currentOption, selected} = props;
    return (<div className={showList ? "selected bgc" : "selected"}
        /* style={{display : projectData.projectNum >3? "black" :"none" }} */
        onClick={showDiv}>
        <span className="show">{currentOption}
            <span className="icon"></span>
        </span>
        <div className="list" style={{ 'display': (showList) ? 'block' : 'none' }}>
            <ul>
                {
                    list.map((item, index) => {
                        return (
                            <li key={index}
                                onClick={selected.bind(this,index,item)}>{item}</li>
                        )
                    })
                }
            </ul>
        </div>
    </div>)
}

export default Selecte;
