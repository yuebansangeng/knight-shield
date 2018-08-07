import ReactDom from 'react-dom'
import React from 'react'

const Context={
    //获取cookie
    getCookie(c_name){
        if (document.cookie.length>0)
        {
        let c_start=document.cookie.indexOf(c_name + "=")
        if (c_start!=-1)
            { 
                c_start=c_start + c_name.length+1;
                let c_end=document.cookie.indexOf(";",c_start);
                if (c_end==-1) c_end=document.cookie.length
                return unescape(document.cookie.substring(c_start,c_end))
            } 
      }
        return ""
    }
    //设置cookie
    ,setCookie(c_name,value,expiredays){
        let exdate=new Date();
        exdate.setDate(exdate.getDate()+expiredays)
        document.cookie=c_name+ "=" +escape(value)+
        ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
    }
    ,getGuid(){
		function S4(){
            return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1)
        }
        return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()
    }
    //弹出自己的弹框
    /*
    *@Cmp参数代表需要弹出的那个弹框组件名
    *@popCmps代表弹框里所需要盛放的组件们
    *@callBackEvents代表回调参数，目前暂支持确定和取消的回调
    调用方法如：Context.popWin(DemoPop,[SolutionDetail,ExamList],cancelCallBack)
    */
    ,popWin(Cmp,props,popCmps=[],callBackEvents,className){
        const body=document.body;
        const container=document.createElement("div");
        container.className='customPop '+className;
        body.style['overflow']='hidden';
        body.appendChild(container);
        //定义弹窗关闭方法及可能需要的回调
        const close=(props,...args)=>{
            body.style['overflow']='auto';
            if(props.Stay&&args[0]){
                args[0]()
            }else{
                ReactDom.unmountComponentAtNode(container);
                body.removeChild(container);
                args[0]&&args[0]()
            }  
        }
        ReactDom.render(
            <Cmp onClose={close} popCmps={popCmps} {...props} sureCallBack={callBackEvents['sureCallBack']}/>,
            container
        )
    }
    //监听更新事件方法
    /*
    *@param:type字段存放监听的事件类型
    *@callback:代表事件回调
    调用方法如：Context.listenRegister({type:'cloud_saveform_datasucess'},self.props.refreshPage)
    */
    ,listenRegister(param,callback){
        window.iTalentSDK.unregister(param.type);
        window.iTalentSDK.register({
          listenEvent:param.type,
          cb: function(data) {
            const { res = {} } = data;
            if (res && res.code === 200||res.code===1000) {
                callback() 
            }
          }
        });
    }
    //简单转译HTML
    ,unescapeHTML (str) {
        if(!str){
            return ''
        }
        str = "" + str;
        return str.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#39;/g,"'");
    }
    // 富文本转译html,富文本转译完成后使用dangerouslySetInnerHTML即可
    ,richTextUnescapeHTML(str){
        //多层转换
        let result =str;
        if(result){
            result=result.replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&apos;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            while(result.includes('&amp;')){
                result=result.replace(/&amp;/g, '&')
            }
            return result
        }else{
            return ''
        }
    }
    ,paramSerializa (params){
        let paramArray=[];
        for(let key in params){
            paramArray.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
        }
        return paramArray.join('&');
    }
    ,updateSMSCount(tempHtml) {
        try {
            // let tempStr=tempHtml ? tempHtml : $('#tinymce-SMS').val();
            let data = tempHtml.replace(/\<\%.*?%\>/g, function (s) {
                switch (s) {
                    case "\<\% username \%\>":
                        return "";
                    case "\<\% loginurl \%\>":
                        return '<%:ViewData["loginurl"] %>';
                    case "\<\% testurl \%\>":
                        return '12345678901234567890123456789';
                    case "\<\% useremail \%\>":
                        return "";
                    case "\<\% serialnumber \%\>":
                        return "1234567890123";
                    case "\<\% endtime \%\>":
                        return "2013年07月10日 16:32";
                    default:
                        return s;
                }
            });
            return data;
            
        } catch (e) {

        }
    }
    ,calculation(data){
        let l = $("<div></div>").html(data).text().length;
        l = l + "[人才管理]".length;
        let count = l % 67 > 0 ? (parseInt(l / 67) + 1) : parseInt(l / 67);
        $(".SMSsum a").text(l + "/" + count + "条");
    }

    ,contains(root,n) {
        let node = n
        while(node) {
            if(node === root) {
                return true
            }
            node = node.parentNode
        }
        return false
    }

}

export default Context;