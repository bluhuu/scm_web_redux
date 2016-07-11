let Util = {
    getType:function(src){
        return Object.prototype.toString.call(src).slice(8,-1);
    },
    cloneObject:function(src){
        if(src===null)return null;
        if(src===undefined)return undefined;
        var key,result,srcClass = this.getType(src);
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
            if(this.getType(attr)==='object'){
                result[key]=arguments.callee(attr);
            }else if(this.getType(attr)==='Array'){
                result[key].arguments.callee(attr);
            }else{
                result[key]=src[key];
            }
        }
        return result;
    },
    cloneObj: function(obj){
        var str, newobj = obj.constructor === Array ? [] : {};
        if(typeof obj !== 'object'){
            return;
        } else if(window.JSON){
            str = JSON.stringify(obj), //系列化对象
            newobj = JSON.parse(str); //还原
        } else {
            for(var i in obj){
                newobj[i] = typeof obj[i] === 'object' ?
                this.cloneObj(obj[i]) : obj[i];
            }
        }
        return newobj;
    },
    /**
    * 下载文件
    */
    downloadFile: function(url) {
      try {
        var elemIF = document.createElement("iframe");
        elemIF.src = url;
        elemIF.style.display = "none";
        document.body.appendChild(elemIF);
      } catch (e) {
        console.log("出错：下载出错！ ",url);
      }
    },
    /**
     * 获取上一个月
     *
     * @date 格式为yyyy-mm-dd的日期，如：2014-01-25
     */
    getPreMonth: function(date) {
        var arr = date.split('-');
        var year = arr[0]; //获取当前日期的年份
        var month = arr[1]; //获取当前日期的月份
        var day = arr[2]; //获取当前日期的日
        var days = new Date(year, month, 0);
        days = days.getDate(); //获取当前日期中月的天数
        var year2 = year;
        var month2 = parseInt(month) - 1;
        if (month2 == 0) {
            year2 = parseInt(year2) - 1;
            month2 = 12;
        }
        var day2 = day;
        var days2 = new Date(year2, month2, 0);
        days2 = days2.getDate();
        if (day2 > days2) {
            day2 = days2;
        }
        if (month2 < 10) {
            month2 = '0' + month2;
        }
        var t2 = year2 + '-' + month2 + '-' + day2;
        return t2;
    },

    /**
     * 获取下一个月
     *
     * @date 格式为yyyy-mm-dd的日期，如：2014-01-25
     */
    getNextMonth: function(date) {
        var arr = date.split('-');
        var year = arr[0]; //获取当前日期的年份
        var month = arr[1]; //获取当前日期的月份
        var day = arr[2]; //获取当前日期的日
        var days = new Date(year, month, 0);
        days = days.getDate(); //获取当前日期中的月的天数
        var year2 = year;
        var month2 = parseInt(month) + 1;
        if (month2 == 13) {
            year2 = parseInt(year2) + 1;
            month2 = 1;
        }
        var day2 = day;
        var days2 = new Date(year2, month2, 0);
        days2 = days2.getDate();
        if (day2 > days2) {
            day2 = days2;
        }
        if (month2 < 10) {
            month2 = '0' + month2;
        }

        var t2 = year2 + '-' + month2 + '-' + day2;
        return t2;
    },
    /**
    * 对象属性拷贝
    */
    copyProperties: function(inSrcObj,inDestObj,inOverride){
        if(inDestObj==null){
            return inSrcObj;
            }
        var prop;
        for(prop in inSrcObj){
            if(inOverride||!inDestObj[prop]){//先判断是否重写
                inDestObj[prop]=inSrcObj[prop];
                }
            }
        return inDestObj;
        }
}
export default Util;
