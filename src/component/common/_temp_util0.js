function isArray(arr){
    return Object.prototype.toString.call(arr)==='[object Array]';
}

function isFunction(fn){
    return Object.prototype.toString.call(fn)==='[object Function]';
}


function getType(src){
    return Object.prototype.toString.call(src).slice(8,-1);
}

function cloneObject(src){
    if(src===null)return null;
    if(src===undefined)return undefined;
    var key,
        result,
        srcClass = getType(src);
        if(srcClass==='Object'){
            result={};
        }else if(srcClass==='Array'){
            result=[];
        }else if(srcClass==='Date'){
            return new Date(+src);
        }else if(srcClass==='number'||srcClass==='String'||srcClass==='Boolean'){
            return src;
        }
        for(key in src){
            var attr=src[key];
            if(getType(attr)==='object'){
                result[key]=arguments.callee(attr);
            }else if(getType(attr)==='Array'){
                result[key].arguments.callee(attr);
            }else{
                result[key]=src[key];
            }
        }
        return result;
}


/*数组去重*/
function uniqArray(arr){
    var result=[],
        judObj={};
    for(var i=0,len=arr.length;i<len;i++){
        var item=arr[i];

        if(!judObj[item]){
            result.push(item);
            judObj[item]=true;
        }

    }
    return result;
}

// 对字符串头尾进行空格字符的去除、包括全角半角空格、Tab等，返回一个字符串
function trim(str){
    if(str===null) return null;
    if(str===undefined) return undefined;

    return str.replace(/(^[\s\uFEFF\xA0]+)|([\s\uFEFF\xA0]+$)/g,"");
}

// 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数
function each(arr,fn){
    for(var i=0,len=arr.length;i<len;i++){
        fn.call(arr,i,arr[i]);
    }
}

function isEmail(emailStr){
    var mailReg=/^([\w\d])+\@([\w\d])+(\.([\w\d]{2,4}))+$/;
    return mailReg.test(emailStr);
}

function isMobilePhone(phone) {
  var phoneReg = /^(\d{3,5}\-)?(\d{8,11})(\-\d{3,5})?$/;
  return phoneReg.test(phone);
}

//检测dom是否具有名字为className的class
function hasClass(element,className){
    if(!className|| !element|| !element.className) return false;
    classNames=element.className.split(/\s+/);
    for(var i=0,len=classNames.length;i<ien;i++){
        if(classNames[i]===className){
            return true;
        }
    }
    return false;
}
// 为dom增加一个样式名为newClassName的新样式
function addClass(element,newClassName){
    if(!newClassName||!element)return;
    if(!element.className){
        element.className=newClassName;
    }else if(！hasClass(element,newClassName)){
        element.className=[element.className,newClassName].join(" ");
    }

}
// 移除dom中的样式oldClassName
function removeClass(element,oldClassName){
    if(!oldClassName||!element||!element.className)return;
    if(oldClassName==="*")return element.className='';
    var classNames=element.className.split(/\s+/);
    for(var i=0,len=classNames.length;i<len;i++){
        if(classNames[i]===oldClassName){
            classNames.splice(i,1);
        }
    }
    element.className=classNames.join(' ');
}

// toggleClass
function toggleClass(element,className){
    if(hasClass(element,className))removeClass(element,className);
    else addClass(element,className);
}
// 判断siblingNode和dom是否为同一个父元素下的同一级的元素，返回bool值
function isSiblingNode(element,siblingNode){
    if(!siblingNode||!element)return false;
    return element.parentNode===siblingNode.parentNode;
}

// 获取dom相对于浏览器窗口的位置，返回一个对象
function getPosition(element){
    if(!element) return undefined;
    var box =element.getBoundingClientRect();
    return box;
}

// 给一个dom绑定一个针对event事件的响应，响应函数为listener
function addEvent(element,event,listener){
    if(!listener||!event||!element)return;
    element[event+'Events']=element[event+'Events']||[];    [[{raw:listener,wrap:_listener}],[],[]]
    var _listenner=undefined;
    if(element.addEventListener){
        _listenner=listener;
        element[event+'Events'].push({
        raw:listener,
        wrap:_listenner
     });
      element.addEventListener(event,_listenner,false);
    }else if(element.attachEvent){
        _listenner=function(){
            listener.call(element);
        }
        element[event+'Events'].push({
            raw:listener,
            wrap:_listenner
        });
        element.attachEvent('on'+event,_listenner);
    }

}
// 移除dom对象对于event事件发生时执行listener的响应，当listener为空时，移除所有响应函数
function removeEvent(element,event,listener){        [[{raw:listener,wrap:_listener}],[],[]]
    if(!event||!element)return;
    if(event.removeEventListener){
        if(!listener){
            for(var i=0;i<element[event+'Events'].length;i++){
                element.removeEventListener(event,element[event+'Events'][i].wrap,false);
            }
            return;
        }
        if(!element[event+'Events']){
            element.removeEventListener(event,listener,false);
        }else{
            element.removeEventListener(event,findWrapEvent(element,event,listener),false);
        }
    }else if(element.detachEvent){
        if(!listener){
            for(var i=0;i<element[event+'Events'].length;i++){
                element.detachEvent("on"+event,element[event+'Events'][i].wrap);
            }
            return;
        }
        if(!element[event+'Events']){
            element.detachEvent('on'+event,listener);
        }else{
            element.detachEvent('on'+event,findWrapEvent(element,event,listener));
        }

    }
}

//事件委托
function delegateEvent(element,tag,event,listener){
      if(!listener || !event || !tag || !element) return;
      var _listenner=function(event){
          event=event||window.event;
          var target=event.target||event.srcElement;
          if(target.tagName===tag.toUpperCase()||target==='*'){
              listener.call(target,event);
          }
      }
      addEvent(element,event,_listener);
}
// 实现对click事件的绑定
function addClickEvent(element,listener){
    if(!listener||!element)return;
    addEvent(element,'click',listener);
}
// 实现对于按Enter键时的事件绑定
function addEnterEvent(element,listener){
    if(!listener||!element)return;
    var _listener=function(event){
        event=event||window.event;
        var keyCode=event.which||event.keyCode;    //监听键盘
        if(keyCode==13){                           //如果按下的是enter
            listener.call(element,event);
        }
    }
    addEvent(element,'keyup',_listener);
}

$.on=function(selector,event,listener){
    return addEvent($(selector),event,listener);
}
$.click = function(selector, listener) {
  return addClickEvent($(selector),listener);
}
$.un = function(selector, event, listener) {
  return removeEvent($(selector),event,listener);
}
$.delegate = function(selector, tag, event, listener) {
  return delegateEvent($(selector),tag,event,listener);
}


function ajax(url,options){
    var getXMLrequest=(function(){
        if(typeof XMLHttpRequest!=undefined){
            return function(){
                return new XMLHttpRequest();
            }
        }
        else{
            return function(){
                var xmlhttp=null;
                var versions= ["MSXML2.XMLHttp2.0","MSXML2.XMLHttp3.0","MSXML2.XMLHttp4.0","MSXML2.XMLHttp5.0"
          ,"MSXML2.XMLHttp6.0","MSXML2.XMLHttp","Miscrosoft.XMLHTTP"];
          for(var i=0;i<versions.length;i++){
              try{
                  xmlhttp=new ActiveXObject(versions[i]);
                  return xmlhttp;
              }catch(ex){
                  continue;
              }
          }
          return null;
            }
        }
    })();

    var xhr=getXMLrequest();
    options=options||{};
    var type=options.type||'GET';
    var data=options.data||{};

    xhr.onreadystatechange=function(){
        if(xhr.readyState==4&&xhr.status==200){
            if(options.onsuccess){
                options.onsuccess(xhr.responseText,xhr);
            }
        }else if(xhr.readyState==4&&xhr.status==404){
            if(options.onfail){
                options.onfail(xhr.responseText,xhr);
            }
        }
    }

    if(type.toUpperCase()=='GET'){
        var str='?';
        for(var i in options.data){
            var obj=options.data[i];
            str+=i+'=';
            if(getType(obj)==='Object'){
                str+=getAttr(obj)+'&';
            }else{
                str+=obj+'&';
            }
        }
        str=str.substring(0,str.length-1);
        xhr.open('GET',url+str,true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(null);
    }

    else{
        var str='';
        for(var i in options.data){
            var obj=options.data[i];
            str+=i+'=';
            if(getType(obj)==='Object'){
                str+=getAttr(obj) + '&';
            }else{
                str+=obj+'&';
            }
        }
        str = str.substring(0,str.length-1);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.open("POST",url,true);
        xhr.send(str);

    }

    function getAttr(obj){
        var str='{',
            type=getType(obj);
        if(type!=='Object'){
            return obj;
        }
        for(var i in obj){
            str+=i+':';
            if(getType(obj[i])==='Object'){
                str+='{';
                str+=arguments.callee(obj[i]);
                str+='},';
            }else{
                str+=obj[i]+',';
            }
        }
        str=str.substring(0,str.length-1)+'}';
        return str;
    }

}