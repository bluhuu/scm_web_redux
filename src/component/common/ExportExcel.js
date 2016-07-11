import Util from './Util.js';
function ExportExcel(params,columns,url,title){
    let cols = [];
    //---shim---
    for(let i=0,len=columns.length;i<len;i++){
        if(columns[i].dataIndex){
            let tmp = {};
            tmp.id=columns[i].dataIndex;
            tmp.name=columns[i].title;
            tmp.width=columns[i].width;
            cols.push(tmp);
        }
    }
    //---
    params.columns=JSON.stringify(cols);
    params.title = title;
    var _self = this;
    $.ajax({
        url: url,
        data: params,
        dataType: "json",
        async: false,
        success: function(result) {
            Util.downloadFile("/elink_scm_web/appAction/downfile.do?targetFile="+result.file);
        },
        error: function(){
            console.log("出错：获取表单数据失败！ about: ",url);
        },
    });
}
export default ExportExcel;
