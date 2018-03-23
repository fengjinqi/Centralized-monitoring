
var vm=new Vue({
        el:"#root",
        data:{
            guid:'',
            validate:'validate',
            author:'yjbzgl',
            validaTetable:'validaTetable',
            items:[],
            task:[],
            id:'',
            taskid:'',
            select:'',

        },
        methods:{
            getTask: function(item){
                var obj={};
                  var check;
                obj.processId=this.id,
                obj.transitionId=item.id,
                obj.taskId=String(this.taskid),
                obj.creator='admin',
                obj.bizObj={};
                var input=document.querySelectorAll('#form1 .text ')
                for(var i=0;i<input.length;i++){
                    obj.bizObj[input[i].name]=input[i].value
                }
                var checked=document.querySelectorAll('#form1 .checked ')

                for(var i=0;i<checked.length;i++){
                    if(checked[i].checked){
                          if(obj.bizObj.hasOwnProperty(checked[i].name)){
                            obj.bizObj[checked[i].name] += ',' + checked[i].value;
                          }else{
                            obj.bizObj[checked[i].name] = checked[i].value;
                          }
                    }
                }

                var select=document.querySelectorAll('#form1 select ')
                for(var i=0;i<select.length;i++){
                    select[i].disabled=false
                     obj.bizObj[select[i].name]=select[i].value
                }
                var textare=document.querySelectorAll('#form1 textarea ')
                for(var i=0;i<textare.length;i++){
                     obj.bizObj[textare[i].name]=textare[i].value
                }
                        alert(JSON.stringify(obj))
               mui("#form1 .validaTetable").each(function() {
                        //若当前input为空，则alert提醒
                        if(!this.value || this.value.trim() == "") {
                            var label = this.previousElementSibling;
                            mui.alert("必填项不允许为空");
                            check = false;
                            return false;
                        }else{
                            check=true
                        }
                        }); //校验通过，继续执行业务逻辑
                        if(check){
                            mui.alert('验证通过!')
                             mui.ajax('http://127.0.0.1:10261/itsm/rest/api/v2/itsm/tickets/progressing',{
                                                data:obj,
                                                dataType:'json',
                                                type:'post',
                                                headers:{'Content-Type':'application/json'},
                                                success:function(data){
                                                    alert(JSON.stringify(data))
                                                    mui.back()
                                                },
                                                error:function(xhr,type,errorThrown){
                                                    //异常处理；
                                                    alert(2332);
                                                }
                                            })
                        }
            },
            Download: function(obj){
                var path=obj.uri.replace(/http:\/\/11.55.0.81:8890/gi,'http:\/\/127.0.0.1:10261');
                var watiting=plus.nativeUI.showWaiting("下载中。。。请稍后");
                alert(JSON.stringify(decodeURIComponent(path+"&encoding=UTF8")));
                var dtask = plus.downloader.createDownload(path+"&encoding=UTF8", {
                       method: 'post',
                       filename: '_downloads/'
                   }, function(d, status) {
                   if(status == 200) {
                        plus.runtime.openFile( d.filename, {}, function ( e ) {//调用第三方应用打开文件
                            alert('打开失败');
                        })
                       watiting.setTitle("下载成功"+ decodeURIComponent(d.filename))
                       setTimeout(function(){
                            watiting.close()
                       },2000)

                   } else {
                        watiting.setTitle("下载失败")
                        watiting.close()
                   }
                });
                           dtask.start();
            }
        }
    })
mui.plusReady(function(){

   window.addEventListener('get_detail',function(event){
        vm.guid=event.detail.guid;
        vm.id=event.detail.id
        vm.author=event.detail.author;
        plus.nativeUI.showWaiting( '正在加载' )
        mui.ajax("http://127.0.0.1:10261/itsm/rest/api/v2/itsm/tickets/queryByForm?userId=admin&processId="+vm.id,{
            dataType:'json',
            type:'get',
            success:function(res){

          /*  var res={
                        "result": {
                            "success": true
                        },
                        "ticket": {
                            "id": "95c10b6a-af4c-4611-9fa3-a7ac931e63eb",
                            "data": [
                                {
                                    "id": "0cde48bc-d074-4b32-b7e1-6400671ab0e0",
                                    "row": 1,
                                    "col": 1,
                                    "title": "应急事件记录单",
                                    "type": "group",
                                    "item": [
                                        {
                                            "id": "6727ced7-888f-473f-ad8c-a4599616e287",
                                            "row": 1,
                                            "col": 1,
                                            "type": "group",
                                            "item": [
                                                {
                                                    "id": "d5db2581-6c37-4390-b2f5-d9af0f7e7322",
                                                    "row": 1,
                                                    "col": 1,
                                                    "title": "应急事件名称",
                                                    "bizClass": "yjbz",
                                                    "bizField": "yjsjmc",
                                                    "displayType": "required",
                                                    "readonly": "false",
                                                    "type": "element",
                                                    "bzType": "text",
                                                    "value": "附件怎么办"
                                                },
                                                {
                                                    "id": "dc734d63-c17f-4f87-a74c-62f39648d5db",
                                                    "row": 2,
                                                    "col": 1,
                                                    "title": "申请人",
                                                    "bizClass": "yjbz",
                                                    "bizField": "sqr",
                                                    "displayType": "required",
                                                    "readonly": "false",
                                                    "type": "element",
                                                    "bzType": "userSelect",
                                                    "value": {
                                                        "id": "admin",
                                                        "name": "顶级管理员",
                                                        "dept": "应急通信保障中心",
                                                        "mobile": "13810855414"
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            "id": "e17bde6b-207d-4ded-b4e1-5214ef9fa815",
                                            "row": 2,
                                            "col": 1,
                                            "type": "group",
                                            "item": [
                                                {
                                                    "id": "f4f347af-1d6a-4ef6-9307-212c7de787eb",
                                                    "row": 1,
                                                    "col": 1,
                                                    "title": "事件发生时间",
                                                    "bizClass": "yjbz",
                                                    "bizField": "sjfssj",
                                                    "displayType": "required",
                                                    "readonly": "false",
                                                    "type": "element",
                                                    "bzType": "date",
                                                    "value": "2018-03-14 15:49",
                                                    "dataType": "Date",
                                                    "dataFormat": "yyyy-MM-dd HH:mm"
                                                },
                                                {
                                                    "id": "5c69c0ba-221c-4d68-a011-513031509c76",
                                                    "row": 1,
                                                    "col": 2,
                                                    "title": "事件发生地点",
                                                    "bizClass": "yjbz",
                                                    "bizField": "sjfsdd",
                                                    "displayType": "required",
                                                    "readonly": "false",
                                                    "type": "element",
                                                    "bzType": "text",
                                                    "value": "天堂"
                                                }
                                            ]
                                        },
                                        {
                                            "id": "fd352408-3258-4294-a87e-01ac111e5ffb",
                                            "row": 3,
                                            "col": 1,
                                            "type": "group",
                                            "item": [
                                                {
                                                    "id": "e39931f5-c0de-4679-bf55-5a4aa0d15a5f",
                                                    "row": 1,
                                                    "col": 1,
                                                    "title": "调派车辆信息",
                                                    "bizClass": "yjbz",
                                                    "bizField": "dpclxx",
                                                    "displayType": "required",
                                                    "readonly": "false",
                                                    "type": "element",
                                                    "bzType": "text",
                                                    "value": "法拉利"
                                                }
                                            ]
                                        },
                                        {
                                            "id": "8900e00c-be36-4ff4-b5df-0db4f005c8c4",
                                            "row": 4,
                                            "col": 1,
                                            "type": "group",
                                            "item": [
                                                {
                                                    "id": "79f15974-a992-41ea-8c12-b25d687027c9",
                                                    "row": 1,
                                                    "col": 1,
                                                    "title": "其他设备调派情况",
                                                    "bizClass": "yjbz",
                                                    "bizField": "qtsbdpqk",
                                                    "displayType": "required",
                                                    "readonly": "false",
                                                    "type": "element",
                                                    "bzType": "text",
                                                    "value": "不知道"
                                                }
                                            ]
                                        },
                                        {
                                            "id": "356d3f64-6674-4530-8eaf-9346862d753f",
                                            "row": 5,
                                            "col": 1,
                                            "type": "group",
                                            "item": [
                                                {
                                                    "id": "910f1885-908b-4d84-9fe8-9ad0245a12e3",
                                                    "row": 1,
                                                    "col": 1,
                                                    "title": "事件级别",
                                                    "bizClass": "yjbz",
                                                    "bizField": "sjjb",
                                                    "displayType": "required",
                                                    "readonly": "false",
                                                    "type": "element",
                                                    "bzType": "select",
                                                    "defaultValue": "集团级:default$^$集团级$?$企业级$^$企业级",
                                                    "value": "企业级"
                                                }
                                            ]
                                        },
                                        {
                                            "id": "968e34bc-0715-41f4-b707-b36c819d096e",
                                            "row": 6,
                                            "col": 1,
                                            "type": "group",
                                            "item": [
                                                {
                                                    "id": "c935fdf4-57db-4cd4-9ad9-5305075bb4e0",
                                                    "row": 1,
                                                    "col": 1,
                                                    "title": "事件描述",
                                                    "bizClass": "yjbz",
                                                    "bizField": "sjms",
                                                    "displayType": "required",
                                                    "readonly": "false",
                                                    "type": "element",
                                                    "bzType": "textarea",
                                                    "value": "不知道"
                                                }
                                            ]
                                        },
                                        {
                                            "id": "a31ca54f-6337-481d-b500-1a1b90634fed",
                                            "row": 7,
                                            "col": 1,
                                            "type": "group",
                                            "item": [
                                                {
                                                    "id": "d751ec17-8da3-4848-9e93-69e167ff6662",
                                                    "row": 1,
                                                    "col": 1,
                                                    "title": "附件",
                                                    "bizClass": "yjbz",
                                                    "bizField": "fj",
                                                    "displayType": "opitonal",
                                                    "readonly": "false",
                                                    "type": "element",
                                                    "bzType": "attachFile",
                                                    "value": [
                                                        {
                                                            "id": "e30048a1-b89c-458d-a443-aa0aa29efac3",
                                                            "name": "Screenshot_2018-03-16-13-05-55-618_petrochina.zj.txc.png",
                                                            "uri": "http://127.0.0.1:10261/itsm//viewFileContentServlet?fileType=yjbz.fj&id=e30048a1-b89c-458d-a443-aa0aa29efac3&fileName=Screenshot_2018-03-16-13-05-55-618_petrochina.zj.txc.png",
                                                            "type": "yjbz.fj",
                                                            "path": "\\attachFileFolder_2017.10.22 11'46'51"
                                                        },
                                                        {
                                                            "id": "9b429167-0261-4bb2-985e-ffe8bf964797",
                                                            "name": "9327d475a523bb04ab8f152ce730485d.jpg",
                                                            "uri": "http://127.0.0.1:10261/itsm//viewFileContentServlet?fileType=yjbz.fj&id=9b429167-0261-4bb2-985e-ffe8bf964797&fileName=9327d475a523bb04ab8f152ce730485d.jpg",
                                                            "type": "yjbz.fj",
                                                            "path": "\\attachFileFolder_2017.10.22 11'46'51"
                                                        },
                                                        {
                                                            "id": "ccd5b7e9-2917-4a21-ba88-6de9c93df97d",
                                                            "name": "死就死吧那些.txt",
                                                            "uri": "http://127.0.0.1:10261/itsm//viewFileContentServlet?fileType=yjbz.fj&id=ccd5b7e9-2917-4a21-ba88-6de9c93df97d&fileName=%E6%AD%BB%E5%B0%B1%E6%AD%BB%E5%90%A7%E9%82%A3%E4%BA%9B.txt",
                                                            "type": "yjbz.fj",
                                                            "path": "\\attachFileFolder_2017.10.22 11'46'51"
                                                        },
                                                        {
                                                            "id": "91796e81-e9f0-4be3-8a29-14f106bb1b80",
                                                            "name": "img-1874b588cf42565088b270a696d78119.jpg",
                                                            "uri": "http://127.0.0.1:10261/itsm//viewFileContentServlet?fileType=yjbz.fj&id=91796e81-e9f0-4be3-8a29-14f106bb1b80&fileName=img-1874b588cf42565088b270a696d78119.jpg",
                                                            "type": "yjbz.fj",
                                                            "path": "\\attachFileFolder_2017.10.22 11'46'51"
                                                        },
                                                        {
                                                            "id": "fcd1afe1-c657-4819-bcdf-046a2bc48d83",
                                                            "name": "3a0",
                                                            "uri": "http://127.0.0.1:10261/itsm//viewFileContentServlet?fileType=yjbz.fj&id=fcd1afe1-c657-4819-bcdf-046a2bc48d83&fileName=3a0",
                                                            "type": "yjbz.fj",
                                                            "path": "\\attachFileFolder_2017.10.22 11'46'51"
                                                        },
                                                        {
                                                            "id": "18102837-abbc-4566-9aac-433718c8d194",
                                                            "name": "5d2383e22c10cffa.jpg",
                                                            "uri": "http://127.0.0.1:10261/itsm//viewFileContentServlet?fileType=yjbz.fj&id=18102837-abbc-4566-9aac-433718c8d194&fileName=5d2383e22c10cffa.jpg",
                                                            "type": "yjbz.fj",
                                                            "path": "\\attachFileFolder_2017.10.22 11'46'51"
                                                        },
                                                        {
                                                            "id": "e136d19c-fae0-4cea-b649-c0c34a3705e6",
                                                            "name": "1070_1000252.png",
                                                            "uri": "http://127.0.0.1:10261/itsm//viewFileContentServlet?fileType=yjbz.fj&id=e136d19c-fae0-4cea-b649-c0c34a3705e6&fileName=1070_1000252.png",
                                                            "type": "yjbz.fj",
                                                            "path": "\\attachFileFolder_2017.10.22 11'46'51"
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "id": "aa69a315-f896-4039-acf6-eeea5f9f6d4c",
                                            "row": 8,
                                            "col": 1,
                                            "type": "group",
                                            "item": [
                                                {
                                                    "id": "45541cbd-7cf1-4e77-b971-172ce382f6ed",
                                                    "row": 1,
                                                    "col": 1,
                                                    "title": "申请事项",
                                                    "bizClass": "yjbz",
                                                    "bizField": "sqsx",
                                                    "displayType": "required",
                                                    "readonly": "false",
                                                    "type": "element",
                                                    "bzType": "textarea",
                                                    "value": "不知道"
                                                }
                                            ]
                                        },
                                        {
                                            "id": "c2e9ced0-d6ea-4e56-a4e4-56252ee14f24",
                                            "row": 9,
                                            "col": 1,
                                            "type": "group"
                                        }
                                    ]
                                },
                                {
                                    "id": "0564593c-cc7d-4b93-9557-6b88023e0493",
                                    "row": 2,
                                    "col": 1,
                                    "type": "group",
                                    "item": [
                                        {
                                            "id": "50c532ea-33c6-4ff0-8f7e-c15f1a1206fa",
                                            "row": 1,
                                            "col": 1,
                                            "title": "保障中心审批",
                                            "type": "group",
                                            "item": [
                                                {
                                                    "id": "dcc6530b-cb7b-441d-8e31-bddc97dfd9a4",
                                                    "row": 1,
                                                    "col": 1,
                                                    "type": "group",
                                                    "item": [
                                                        {
                                                            "id": "38593ea0-9d81-41e8-87f8-ca61485eca07",
                                                            "row": 1,
                                                            "col": 1,
                                                            "title": "保障中心审批人",
                                                            "bizClass": "yjbz",
                                                            "bizField": "spr",
                                                            "displayType": "readonly",
                                                            "readonly": "false",
                                                            "type": "element",
                                                            "bzType": "text",
                                                            "value": "上学那就行"
                                                        },
                                                        {
                                                            "id": "4f494c15-febe-4212-95ac-407c8c97e8ea",
                                                            "row": 1,
                                                            "col": 2,
                                                            "title": "审批时间",
                                                            "bizClass": "yjbz",
                                                            "bizField": "sptime",
                                                            "displayType": "readonly",
                                                            "readonly": "false",
                                                            "type": "element",
                                                            "bzType": "date",
                                                            "value": "2018-03-16 13:54",
                                                            "dataType": "Date",
                                                            "dataFormat": "yyyy-MM-dd HH:mm"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "id": "db7bd523-a444-48bb-8319-305f0eac8935",
                                                    "row": 2,
                                                    "col": 1,
                                                    "type": "group",
                                                    "item": [
                                                        {
                                                            "id": "0ee4ac66-5a33-460c-a66e-da156b2a92ab",
                                                            "row": 1,
                                                            "col": 1,
                                                            "title": "审批意见",
                                                            "bizClass": "yjbz",
                                                            "bizField": "spyj",
                                                            "displayType": "readonly",
                                                            "readonly": "false",
                                                            "type": "element",
                                                            "bzType": "textarea",
                                                            "value": "学姐学妹"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        "task": [
                            {
                                "id": 44614,
                                "name": "应急事件填写",
                                "action": [
                                    {
                                        "id": "Link_6",
                                        "name": "保存"
                                    },
                                    {
                                        "id": "Link_0",
                                        "name": "提交"
                                    }
                                ]
                            }
                        ]
                    }*/
            var ob=[]
            var n=res.ticket.data
            for(var obj in n){
                if(n[obj].hasOwnProperty('item')&& Array.isArray(n[obj].item)){
                    ob.push(Recursion(n[obj]))
                }
            }
            function Recursion(item){
                var m = [];
                for(var i in item.item){
                    if(item.item[i].hasOwnProperty('item') && Array.isArray(item.item[i].item)){
                        m.push(Recursion(item.item[i]))
                    }else{
                        if(item.item[i].title!==undefined){
                            if(item.item[i].value===undefined){
                                item.item[i].value=""
                            }
                            m.push({
                            id: item.item[i].id,
                            title: item.item[i].title,
                            value: item.item[i].value,
                            bizClass:item.item[i].bizClass,
                            bizField:item.item[i].bizField,
                            bzType:item.item[i].bzType,
                            displayType:item.item[i].displayType,
                            defaultValue:item.item[i].defaultValue
                        })
                        }
                    }
                }
                return m;
            }
            var t = [];
           function tran(n){
                for(var i in n){
                    if(Array.isArray(n[i])){
                        tran(n[i])
                    }else{
                        t.push(n[i])
                    }
                }
           }
            tran(ob)
            String.prototype.endWith=function(endStr){
              var d=this.length-endStr.length;
              return (d>=0&&this.lastIndexOf(endStr)==d)
            }
            function GetChinese(strValue,sValue) {
            console.log("=="+sValue+"==");
            if(strValue!= null && strValue!= ""){
                //var reg = /[\u4e00-\u9fa5]/g;
                var return_strs = new Array();
                var strs = new Array();
                strs = strValue.split('$?$');
                for(var i = 0; i < strs.length; i ++){
                    var st = new Array();
                    st = strs[i].split('$^$');
                    var re_str ;
                    console.log("=="+st[0]+"==");
                    if(st[0].endWith(":default")){
                        if(contains(sValue, st[0].trim().substring(0,(st[0].length - 8)))){
                            re_str = '{"value" : "' + st[0].substring(0,(st[0].length - 8)) + '","name" : "' + st[1] + '","default" : true,"selected" : true}';
                        }else{
                            re_str = '{"value" : "' + st[0].substring(0,(st[0].length - 8)) + '","name" : "' + st[1] + '","default" : true,"selected" : false}';
                        }
                    }else{
                        if(contains(sValue, st[0].trim())){
                            re_str = '{"value" : "' + st[0] + '","name" : "' + st[1] + '","default" : false,"selected" : true}';
                        }else{
                            re_str = '{"value" : "' + st[0] + '","name" : "' + st[1] + '","default" : false,"selected" : false}';
                        }
                    }
                    re_str = eval('(' + re_str + ')');
                    //console.log(re_str);
                    return_strs.push(re_str);
                }
                //console.log(strs);
                return return_strs;
            }
            else
                return "";
        }

            for(var n in t){

            if(t[n].value != undefined && t[n].value != "" && t[n].value != null){
                if(typeof(t[n].value) == 'string'){
                    if((t[n].value).indexOf('$?$') >= 0){
                        var strs = new Array();
                        strs = (t[n].value).split('$?$');
                        var return_strs = new Array();
                        for(var i = 1; i < strs.length; i++){
                            return_strs.push(strs[i].trim());
                        }
                        t[n].value = return_strs;
                    }
                    if((t[n].value).indexOf(',') >= 0||t[n].value){
                        var strs = new Array();
                        strs = (t[n].value).split(',');
                        var return_strs = new Array();
                        for(var i = 0; i < strs.length; i++){
                            return_strs.push(strs[i].trim());
                        }
                        t[n].value = return_strs;
                    }
                }
            }

            if(t[n].defaultValue!=undefined){
                t[n].defaultValue = GetChinese(t[n].defaultValue,t[n].value);
            }

        }
            function contains(arr, obj) {
      var i = arr.length;
      while (i--) {
        if (arr[i] === obj) {
          return true;
        }
      }
      return false;
    }
            vm.items=t
            console.log(vm.items)
            //alert(JSON.stringify(res))
            var task=res.task[0];
            for(var n in task.action){
        vm.task.push(task.action[n])
        if(task.action[n].hasOwnProperty("performer")&&Array.isArray(task.action[n].performer)&&task.action[n].name==='交班'){
            for(var j in task.action[n].performer){
                console.log(task.action[n].performer[j])
            }
        }
    }
            vm.taskid=task.id
           },
            error:function(xhr,type,errorThrown){
                alert('错误'+xhr.status+type+errorThrown)
            },
            complete :function(){
                setTimeout(function(){
                    plus.nativeUI.closeWaiting()
                },1500)
            }
        })



    })
})

   mui.back = function() {
       // var list = plus.webview.getWebviewById('commissionListview');
    //触发列表界面的自定义事件（refresh）,从而进行数据刷新
       // mui.fire(list,'refresh');
        plus.webview.currentWebview().hide("auto", 300);
        var self = plus.webview.currentWebview();
        //confirm()
        self.addEventListener("hide",function (e) {
            vm.guid='',
            vm.author='',
            vm.items=[],
            vm.task=[]
        },false);
    }
  var showUserPickerButton = document.getElementById('danwei');
    showUserPickerButton.addEventListener('tap', function(event) {
        var evt=event ||window.event
        evt.stopPropagation()
        document.getElementById('bumen').value=""
        document.getElementById('jianchar').value=""
        var userPicker = new mui.PopPicker();
        mui.ajax("http://127.0.0.1:10261/itsm/rest/api/v2/acm/user/org",{
            dataType:'json',
            type:'get',
            success:function(res){
                var ni=[]
                for(var n in res.data){
                    ni.push({
                        text:res.data[n].name,
                        id:res.data[n].id
                    })
                }
                userPicker.setData(ni);
                userPicker.show(function(items) {
                    showUserPickerButton.value = items[0].text;
                    document.getElementById('danwei').setAttribute('data',items[0].id)
                    //返回 false 可以阻止选择框的关闭
                    //return false;
                    userPicker.dispose()
                });
            },
            error:function(xhr,type,errorThrown){
                plus.nativeUI.closeWaiting();
                alert('错误'+xhr.status+type+errorThrown)
            }
        })
    }, false);
    var bumen = document.getElementById('bumen');
    var danwei = document.getElementById('danwei');
    bumen.addEventListener('tap', function(event) {
    var evt=event ||window.event
    evt.stopPropagation()
    document.getElementById('jianchar').value=""
        var user = new mui.PopPicker();
        if(danwei.getAttribute('data')==null){
                return false;
        }else{
             mui.ajax("http://127.0.0.1:10261/itsm/rest/api/v2/acm/user/dept?orgId="+danwei.getAttribute('data'),{
                dataType:'json',
                type:'get',
                success:function(res){
                    var ni=[]
                    for(var n in res.data){
                        ni.push({
                            text:res.data[n].name,
                            id:res.data[n].id
                        })
                    }
                    user.setData(ni);
                },
                error:function(xhr,type,errorThrown){
                    plus.nativeUI.closeWaiting();
                    alert('错误'+xhr.status+type+errorThrown)
                }
            })
             user.show(function(items) {
                    bumen.value = items[0].text;
                    document.getElementById('bumen').setAttribute('data',items[0].id)
                    //返回 false 可以阻止选择框的关闭
                    //return false;
                    user.dispose()
                });
        }
    }, false);
    var jianchar = document.getElementById('jianchar');
    jianchar.addEventListener('tap', function(event) {
    var evt=event ||window.event
        evt.stopPropagation()
        var user = new mui.PopPicker();
        if(bumen.getAttribute('data')==null){
                return false;
        }else{
            mui.ajax("http://127.0.0.1:10261/itsm/rest/api/v2/acm/user/?deptId="+bumen.getAttribute('data'),{
                dataType:'json',
                type:'get',
                success:function(res){
                    var ni=[]
                    for(var n in res.data){
                        ni.push({
                            text:res.data[n].name,
                            id:res.data[n].id
                        })
                    }
                    user.setData(ni);
                },
                error:function(xhr,type,errorThrown){
                    plus.nativeUI.closeWaiting();
                    alert('错误'+xhr.status+type+errorThrown)
                }
            })
            user.show(function(items) {
             if(items[0].text==undefined){
                    jianchar.value = ''
                }else{
                jianchar.value = items[0].text;
                }
                //jianchar.value = items[0].text;
                document.getElementById('jianchar').setAttribute('data',items[0].id)
                //返回 false 可以阻止选择框的关闭
                //return false;
                user.dispose()
            });
        }
    }, false);
    function gettPerson(obj){

    }


function close(){
    document.getElementById('mui-backdrop').style.display='none';
    document.getElementById('bumen').value="";
    document.getElementById('jianchar').value="";
    document.getElementById('danwei').value="";
}
function show(){
    document.getElementById('mui-backdrop').style.display='block';
}
function confirm(){
    if(document.getElementById('jianchar').value==""){
        return false
    }else{
        document.querySelector('.obj').value=document.getElementById('jianchar').value
        document.getElementById('mui-backdrop').style.display='none';
        document.getElementById('bumen').value="";
        document.getElementById('jianchar').value="";
        document.getElementById('danwei').value="";
    }

}