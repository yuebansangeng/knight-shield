
import React, { Component } from 'react'
import './index.scss'
// import {  getBSGlobal } from '&/helper/index.js';
import Selecte from "./Selecte"; 
import fetchData from './takeData'
// import ProjectListss from './projectList/index';
let goUp=[],progressNum=[];
export default class AssessProject extends Component {

    static displayTitle = "测评项目"
    constructor(props){
        super(props);
        this.state = {
            showList : false,
            currentOption:"全部项目",
            up: ["150px", "150px", "150px"],
            progress:[0,0,0],
            transition:"3s",
            isFetching: true
        }
    };
    
    async handleFetchData(tag, count) {
        let response = await fetchData({
            url: '/Index/GetHomeDisplayProjectInfo',
            params: { tag,count }
        });
        response = JSON.parse(response)
        
        this.setState({
            projectData: response,
            transition:"0s",
            up: ["164px","164px","164px"],
            isFetching: false,
            progress: [0, 0, 0]
        })
        setTimeout(() => { 
            this.setState({
                transition: "3s",
                up: goUp
            })
        }, 10);
        this.rollNum();
    }
    componentDidMount() {
        this.handleFetchData(3,3);
    }


    rollNum = ()=>{
        let upNum = [0, 0, 0], stop = [], flag = 0;
        let interval = setInterval(() => {
            this.state.progress.map((item, index) => {
                let num = (item * 100 + 300) / 100;
                if (num > progressNum[index]) {
                    progressNum[index] == 100 ? num=100: num = parseFloat(progressNum[index]);
                    if (stop[index] !== 101) {
                        flag += 1
                    }
                    stop[index] = 101;
                }
                switch (num) {
                    case 100:
                        upNum[index] = 100
                        break;
                    case 0:
                        upNum[index] = 0
                        break;
                    default:
                        upNum[index] = num.toFixed(2)
                        break;
                }
                if (flag == progressNum.length) {
                    clearInterval(interval)
                }
            })
            this.setState({
                progress: upNum
            })
        }, 50)
    }
    componentWillMount(){
      
    };
    showList = (e)=>{
        this.setState({
            showList:true
        })
        e.stopPropagation();
    };
    selected = ( index,item,e)=>{
        e.stopPropagation();
        const { currentOption } = this.state;
        if (item == currentOption){
            this.setState({
                showList: false
            })
            return;
        }else{
            this.setState({
                showList: false,
                currentOption:item
            })
        } ;
        let tag;
        switch (index) {
            case 0:
                tag = 3
                break;
            case 1:
                tag = 1
                break;
            default:
                tag = 2
                break;
        }
        this.handleFetchData(tag,3);
    }
    closeSelecte =()=>{
        const { showList} =this.state;
        if(showList){
            this.setState({
                showList: false
            })
        }
    }
    getProgress = (item,index)=>{
        let sum = item.inviteNumber, completed = item.completeNumber;
        let progress = completed / sum * 100;
        if (sum == 0) progress=0;
        if (completed % sum !== 0) {
            progress = progress.toFixed(2)
        }
        let upNum = (100-14) - progress+"%";
        if (sum == 0 || completed == 0) upNum = "150px";
        goUp[index]=upNum;
        progressNum[index] = progress;
        return progress;
    }
    getBGC = (progress,num)=>{
        let bgc ="";
        if (progress < 20) {
            bgc = " bgc20"
        } else if (20 <= progress && progress < 50) {
            bgc = " bgc50"
        } else if (50 <= progress && progress < num) {
            bgc = " bgc"+num
        } else if (num <= progress && progress <= 100) {
            bgc = " bgc100"
        };     
        return bgc;
    }
    render() {
        const { isFetching,showList, currentOption, projectData, transition} = this.state;
        const list = ["全部项目", "最近的项目","我创建的项目"];
        if (isFetching) {
            return (<div></div>)
        }
        if (!projectData.projectinfolist || (projectData.projectinfolist.length == 0 && currentOption == "全部项目" )) {
            return (<div className='assess-project' >
                <div className="header">
                    <p className="text">测评项目</p>
                </div>
                <div className="noting" style={{"marginTop":"146px"}}></div>
            </div>)
        }
        if (!projectData.projectinfolist || projectData.projectinfolist.length==0){
            return (<div className='assess-project' onClick={() => { this.closeSelecte() }} >
                        <div className="header">
                            <p className="text">测评项目</p>
                        </div>
                        <Selecte showList={showList} showDiv={this.showList.bind(this)} 
                    currentOption={currentOption} list={list} selected={this.selected.bind(this)} />
                        <div className="noting"></div>
                    </div>)
        }
        return (<div className='assess-project' onClick={()=>{this.closeSelecte()}} >
            <div className="header">   
                <p className="text">测评项目</p>    
            </div>
            <Selecte showList={showList} showDiv={this.showList.bind(this)}
                currentOption={currentOption} list={list} selected={this.selected.bind(this)} />
            <div className="project-list">
                 { 
                   
                    projectData.projectinfolist.map((item,index)=>{
                        let progress = this.getProgress(item,index);
                        let up=this.state.up[index];
                        
                        let bgc = this.getBGC(progress,80);
                        let numBgc = this.getBGC(progress, 56);
                        let sploosh1 = "sploosh1 common " + bgc, sploosh2 = "sploosh2 common " + bgc;
                        let textColor ;
                        progress < 70 ? textColor = "black" : textColor="#fff";
                      
                        // let projectName =item.name.length > 13 ? item.name.slice(0,12) + "..." : item.name;

                        return(
                            <a href={item.particularsUrl} target="_blank" key={index} className="project-item">
                                <div className={item.state == 2 ? "state" : "state finish"}>{item.state == 2 ? "进行中" : "已结束"}</div>
                                <div className="project-name"  dangerouslySetInnerHTML={{__html:item.name}}></div> 
                                <div className="time-person">
                                    <span className="time common">{item.createDate.slice(0,10)}</span>
                                    <span className="person common">{item.createBy.length > 9 ? item.createBy.slice(0, 8) + "..." : item.createBy}</span>
                                </div>
                                <div className={"progress"+bgc}>
                                    <div className="per100" style={{ display: 80 <= progress ? 'block' : 'none'}} ></div>
                                    <div className={"number" + numBgc} >{this.state.progress[index]}<span style={{"fontSize":"14px"}}>%</span></div>
                                    <div className="text" style={{ color: progress > 45 ? "#ffffff" :"#4b5f6a"}}>完成度</div>
                                    <div className={sploosh1} style={{ top: up, transition: transition}}></div>
                                    <div className={sploosh2} style={{ top: up, transition: transition}}></div>
                                </div>
                                <div className="showNum">
                                    <div className="conpleted">
                                        <object>
                                            <a href={item.participantsUrl} target="_blank" className="img"></a>
                                            <a href={item.participantsUrl} target="_blank" className="content">
                                                <div className="text">完成人次</div>
                                                <span  className="num">{item.completeNumber}</span> 
                                            </a>
                                        </object>
                                    </div>
                                    <div className="invited diff">
                                        <object>
                                            <a href={item.participantsUrl} target="_blank" className="img"></a>
                                            <a href={item.participantsUrl} target="_blank" className="content">
                                                <div className="text">总人次</div>
                                                    <span className="num">{item.inviteNumber}</span>
                                            </a>
                                        </object>
                                    </div>
                                </div>
                            </a>
                        )
                    })
                 }
            </div>
            <div className="bottomURL"/* style={{ display: projectData.projectNum > 3 ? "black" : "none" }}*/>
                <object>
                    <a href={projectData.listUrl} target="_self" className="text">查看更多
                         <span className="bttom-icon"></span> 
                    </a>                    
                </object>
            </div>
        </div>)
    }
}
