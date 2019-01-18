var objData;
objData={}
var fd;
fd = new FormData();
var vm=new Vue({
        el:"#root",
        data:{
            guid:'',
            validate:'validate',
            author:'gzcllc1',
            validaTetable:'validaTetable',
            items:[],
            fj:'',
            fieIdCode:'',
            task:[],
            field:'',
            id:'',
            taskid:'',
            performer:[],
            select:'',
            getLogin:'',
            claim:null,
            fd:[],
            acnys:false,
            gender:''

        },
        methods:{
            gettask:function(){
                var obj={}
                var _this=this
                obj.taskId=String(this.taskid)
                obj.creator=String(this.getLogin)
                plus.nativeUI.showWaiting( '正在加载' )
                mui.ajax("http://127.0.0.1:10332/itsm/rest/api/v2/itsm/tickets/claim",{
                            dataType:'json',
                            type:'post',
                            data:JSON.stringify(obj),
                            success:function(res){
                                if(res.success==true){
                                     _this.claim=false

                                }else{
                                   mui.alert("提交失败")
                                }
                            },
                            error:function(xhr,type,errorThrown){
                             plus.nativeUI.closeWaiting()
                                alert("与大厅连接中断,请退出APP重新进入大厅唤醒")
                            },
                            complete :function(){
                                setTimeout(function(){
                                    plus.nativeUI.closeWaiting()
                                },500)
                            }
                        })
            },
            commint:function(item){
           // alert(JSON.stringify(item))
                var wat=plus.nativeUI.showWaiting('提交中...')
                mui.ajax('http://127.0.0.1:10332/itsm/rest/api/v2/itsm/tickets/progressing',{
                data:item,
                dataType:'json',
                type:'POST',
                timeout:12000,
                headers:{'Content-Type':'application/json'},
                success:function(data){

                    mui.back = function() {
                       var list = plus.webview.getWebviewById('commissionListview')||plus.webview.getLaunchWebview();
                        //触发列表界面的自定义事件（refresh）,从而进行数据刷新
                        //alert(JSON.stringify(list))
//                        fd.delete('file')
//                        fd.delete('objId')
//                        fd.delete('field')
                            vm.fd=[]
                       mui.fire(list,'refresh');
                       plus.webview.currentWebview().hide("auto", 300);
                       var self = plus.webview.currentWebview();
                       confirm()
                       self.addEventListener("hide",function (e) {
                           vm.guid='',
                           vm.author='',
                           vm.items=[],
                           vm.task=[]
                       },false);
                   }
                     if(data.success==true){

                        if(vm.fd.length>0){
                            wat.setTitle("正在上传附件请稍后...")
                           for(var i=0;i<vm.fd.length;i++){

                                mui.ajax('http://127.0.0.1:10332/itsm/rest/api/v2/itsm/tickets/upload',{
                                data:vm.fd[i],
                                type:'post',
                                processData: false,
                                contentType: false,
                                success:function(data){
                                    var datas=JSON.parse(data)

                                    if(datas.success==true){
                                        vm.acnys=true
//                                        mui.alert("附件上传成功")
                                        wat.close()
                                       mui.back()

                                    }else{
                                        vm.acnys=false

//                                        mui.alert("附件上传失败")
                                        wat.close()
                                         mui.back()
                                    }
                                },
                                error:function(xhr,type,errorThrown){
                                    //异常处理；
                                    alert("与大厅连接中断,请退出APP重新进入大厅唤醒");
                                }
                            })
                           }


                          /* if(this.acnys==true){
                                mui.alert("附件上传成功")
                               wat.close()
                              mui.back()
                           }else{
                                mui.alert("附件上传失败")
                                wat.close()
                                 mui.back()
                           }*/
                        }else{

                          wat.close()
                            plus.nativeUI.toast( "工单提交成功")
                            mui.back()
                        }

                    }else{
                         plus.nativeUI.toast( "工单提交失败");
                         wat.close()
                         mui.back()
                    }
                   // mui.back()
                       //plus.nativeUI.closeWaiting()
                     //  mui.back()
                },
                error:function(xhr,type,errorThrown){
                    //异常处理；
                    alert("与大厅连接中断,请退出APP重新进入大厅唤醒");
                }
            })
            },
            getTask: function(item){
                var obj={};
                var checkArr;
                var yjbzgl=false;
                objData.processId=this.id,
                objData.transitionId=item.id,
                objData.taskId=String(this.taskid),
                objData.creator=vm.getLogin,
                objData.bizObj={};
                var input=document.querySelectorAll('#form1 .text ')
                for(var i=0;i<input.length;i++){
                    objData.bizObj[input[i].name]=input[i].value
                }
//                  var person=document.querySelectorAll('#form1 .person ')
//                for(var i=0;i<person.length;i++){
//                    objData.bizObj[person[i].name]=person[i].getAttribute('data-id')
//                }
                var checked=document.querySelectorAll('#form1 .checked ')
                var checkedradio=document.querySelectorAll('#form1 .checkedradio ')
                for(var i=0;i<checkedradio.length;i++){

                    if(checkedradio[i].checked){
console.log(checkedradio[i].value)
                          if(objData.bizObj.hasOwnProperty(checkedradio[i].name)){

                            objData.bizObj[checkedradio[i].name] += ',' + checkedradio[i].getAttribute('mode');
                          }else{
                            objData.bizObj[checkedradio[i].name] = checkedradio[i].getAttribute('mode');
                          }
                    }
                }

                for(var i=0;i<checked.length;i++){
                    if(checked[i].checked){

                          if(objData.bizObj.hasOwnProperty(checked[i].name)){
                            objData.bizObj[checked[i].name] += ',' + checked[i].value;
                          }else{
                            objData.bizObj[checked[i].name] = checked[i].value;
                          }
                    }
                }
      console.log(objData)
                var select=document.querySelectorAll('#form1 select ')
                for(var i=0;i<select.length;i++){
                    select[i].disabled=false
                     objData.bizObj[select[i].name]=select[i].value
                }
                var textare=document.querySelectorAll('#form1 textarea ')
                for(var i=0;i<textare.length;i++){
                     objData.bizObj[textare[i].name]=textare[i].value
                }

               var a = false;
               var b = false;

               mui("#form1 .validaTetable").each(function(i) {
                        a = true;
                        //若当前input为空，则alert提醒
                        console.log(i)
                        if(!this.value || this.value.trim() == "") {
                            var label = this.previousElementSibling;
                            mui.alert("必填项不允许为空");
                            checkArr = false;
                            return;
                        }else{
                            checkArr=true
                        }
               }); //校验通过，继续执行业务逻辑
                     var check = [];
                     var count = 0;
                    var v = document.querySelectorAll(".radiogroup");
                    for(var i=0,len=v.length;i<len;i++){
                       check[i] = v[i].querySelectorAll(".checked").length>0?v[i].querySelectorAll(".checked"):v[i].querySelectorAll(".checkedradio");

                        for(var j=0,length=check[i].length;j<length;j++){

                            if(check[i][j].checked==true){
                                count++;
                                b = true;
                            }
                        }
                    }
                    console.log(count,v.length)
                    if(v.length==count||v.length<=count){
                        yjbzgl=true
                    }else{
                        mui.alert("必填项不允许为空");
                        yjbzgl=false;
                        return;
                    }
                    console.log(yjbzgl)
                    console.log(checkArr)
                    console.log(a,b)
                    if(a && b){
                        if(yjbzgl&&checkArr){
                      // alert('都执行')
                           this.commintData(item);

                        }
                    }else if(a){
                       if(checkArr){
                        //alert('执行文本')
                               this.commintData(item)
                       }
                    }else if(b){
                        if(yjbzgl){
                         //alert('执行复选')
                                this.commintData(item)
                        }
                     }


                      //this.commintData()

                   /* function commintData(){
    if(this.author=='jjbgl'){
        if(item.name=='交班'){
            showone();
        }else{
            this.commint(objData)

        }
    }else{

        this.commint(objData)

     }
}*/
            },
            getTaskTwo: function(item){
                            var obj={};
                            var checkArr;
                            var yjbzgl=false;
                            objData.processId=this.id,
                            objData.transitionId=item.id,
                            objData.taskId=String(this.taskid),
                            objData.creator=vm.getLogin,
                            objData.bizObj={};
                            var input=document.querySelectorAll('#form1 .text ')
                            for(var i=0;i<input.length;i++){
                                objData.bizObj[input[i].name]=input[i].value
                            }
            //                  var person=document.querySelectorAll('#form1 .person ')
            //                for(var i=0;i<person.length;i++){
            //                    objData.bizObj[person[i].name]=person[i].getAttribute('data-id')
            //                }
                            var checked=document.querySelectorAll('#form1 .checked ')

                            for(var i=0;i<checked.length;i++){
                                if(checked[i].checked){
                                      if(objData.bizObj.hasOwnProperty(checked[i].name)){
                                        objData.bizObj[checked[i].name] += '$?$' + checked[i].value;
                                      }else{
                                        objData.bizObj[checked[i].name] = checked[i].value;
                                      }
                                }
                            }

                            var select=document.querySelectorAll('#form1 select ')
                            for(var i=0;i<select.length;i++){
                                select[i].disabled=false
                                 objData.bizObj[select[i].name]=select[i].value
                            }
                            var textare=document.querySelectorAll('#form1 textarea ')
                            for(var i=0;i<textare.length;i++){
                                 objData.bizObj[textare[i].name]=textare[i].value
                            }
                           var a = false;
                           var b = false;
                            console.log(objData)
                           mui("#form1 .validaTetable").each(function(i) {
                                    a = true;
                                    //若当前input为空，则alert提醒
                                    console.log(i)
                                    if(!this.value || this.value.trim() == "") {
                                        var label = this.previousElementSibling;
                                        mui.alert("必填项不允许为空");
                                        checkArr = false;
                                        return;
                                    }else{
                                        checkArr=true
                                    }
                           }); //校验通过，继续执行业务逻辑
                           this.commintData(item)
                               /*  var check = [];
                                 var count = 0;
                                var v = document.querySelectorAll(".radiogroup");
                                for(var i=0,len=v.length;i<len;i++){
                                   check[i] = v[i].querySelectorAll(".checked");
                                    for(var j=0,length=check[i].length;j<length;j++){
                                        if(check[i][j].checked==true){
                                            count++;
                                            b = true;
                                        }
                                    }
                                }
                                if(v.length==count||v.length<=count){
                                    yjbzgl=true
                                }else{
                                    mui.alert("必填项不允许为空");
                                    yjbzgl=false;
                                    return;
                                }
                                console.log(yjbzgl)
                                console.log(checkArr)
                                console.log(a,b)
                                if(a && b){
                                    if(yjbzgl&&checkArr){
                                   alert('都执行')
                                       this.commintData(item);

                                    }
                                }else if(a){
                                   if(checkArr){
                                    alert('执行文本')
                                           this.commintData(item)
                                   }
                                }else if(b){
                                    if(yjbzgl){
                                     alert('执行复选')
                                            this.commintData(item)
                                    }
                                 }
            */

                                  //this.commintData()

                               /* function commintData(){
                if(this.author=='jjbgl'){
                    if(item.name=='交班'){
                        showone();
                    }else{
                        this.commint(objData)

                    }
                }else{

                    this.commint(objData)

                 }
            }*/
                        },
            commintData:function(item){


                if(this.author=='jjbgl'){
                    if(item.name=='交班'){
                        showone();
                    }else{
                        this.commint(objData)
                    }
                }else if(this.author=='xcjszclc'){
                     if(item.name=='提交审批'){
                            showone();
                        }else if(item.name=='指派工程师'){
                            showone();
                        }else{

                            if(objData.hasOwnProperty('allocated')){

                                delete objData.allocated
                            }


                         this.commint(objData)
                        }
                 }else{

                 this.commint(objData)
                 }
            },
            Download: function(obj){
                var path=obj.uri.replace(/http:\/\/11.55.0.68:8890/gi,'http:\/\/127.0.0.1:10332');
                var watiting=plus.nativeUI.showWaiting("下载中。。。请稍后");
                //alert(JSON.stringify(decodeURIComponent(path+"&encoding=UTF8")));
                var dtask = plus.downloader.createDownload(path+"&encoding=UTF8", {
                       method: 'get',
                       filename: '_downloads/'
                   }, function(d, status) {
                   if(status == 200) {
                        watiting.setTitle("下载成功"+ decodeURIComponent(d.filename))
                        plus.runtime.openFile( d.filename, {}, function ( e ) {//调用第三方应用打开文件
                            alert('打开失败');
                        })

                       setTimeout(function(){
                            watiting.close()
                       },2000)

                   } else {
                        watiting.setTitle("下载失败")
                        watiting.close()
                   }
                });
                           dtask.start();
            },
            Gareth:function(obj){
                this.fj=obj.bizField
                mui('#popover').popover('show');
            },

            onUploadChange(e){
                var fd =new FormData()
                fd.append("field",vm.field+e.target.name)
                fd.append("objId",vm.id)
                for(var i=0;i<e.target.files.length;i++){
                    fd.append('file',e.target.files[i])
                    var p=document.createElement('p')
                    p.className="form-control doenload";
                    p.style.marginBottom=15+'px';
                    p.style.position='relative';
                    p.innerHTML=e.target.files[0].name;
                    e.target.parentNode.parentNode.appendChild(p);
                    e.target.parentNode.parentNode.querySelector('.mui-btn.mui-btn-danger').style.display='block';

                }

                vm.fd.push(fd)
               /* var form = document.getElementById("form2");
                var fd = new FormData(form);
                fd.append("objId",vm.id)
                fd.append("field",vm.field)
                fd.append("file",e.target.files[0])
                var watiting=plus.nativeUI.showWaiting("上传中...请稍后");
                mui.ajax('http://127.0.0.1:10261/itsm/rest/api/v2/itsm/tickets/upload',{
                    data:fd,
                    type:'post',
                    processData: false,
                    contentType: false,
                    success:function(data){
                        var data=JSON.parse(data)
                        alert(typeof data.success)
                        if(data.success){
                            mui.alert("上传成功")
                            watiting.close()
                            alert(vm.id)
                            getAjax()
                        }else{
                            mui.alert("上传失败")
                            watiting.close()
                        }
                    },
                    error:function(xhr,type,errorThrown){
                        //异常处理；
                        alert(2332);
                    }
                })*/
            },
             remove(e){
                        var p=e.target.parentNode.parentNode.querySelectorAll('p')
                        console.log(e.target.parentNode.parentNode.querySelectorAll('p'))
                        for (var i = 0; i<p.length; i++){
                            e.target.parentNode.parentNode.removeChild(p[i])
                        }
                        vm.fd=[]
                       // fd.delete('file')
                        //alert(JSON.stringify(fd.getAll('file')))
                        e.target.style.display='none'
                     },
            test(){
                alert()
                 plus.runtime.openFile( "/1.png",{},function(e){
                        alert(e)
                 } )

            }
        }
    })

mui.plusReady(function(){
    window.addEventListener('get_detail',function(event){
        vm.guid=event.detail.guid;
        vm.id=event.detail.id
        vm.author=event.detail.author;
        vm.field=event.detail.field;
        vm.getLogin=event.detail.getLogin
        plus.nativeUI.showWaiting( '正在加载' )
       getAjax()
    })
    function getAjax(){
        mui.ajax("http://127.0.0.1:10332/itsm/rest/api/v2/itsm/tickets/queryByForm?userId="+vm.getLogin+"&processId="+vm.id,{
            dataType:'json',
            type:'get',
            success:function(res){


           /*var res={
                       "result": {
                           "success": true
                       },
                       "ticket": {
                           "id": "72adff7d-8055-4384-94f1-8a9e35098d2f",
                           "data": [
                               {
                                   "id": "a1481032-3d5d-4c52-a788-ee7ae1c204e3",
                                   "row": 1,
                                   "col": 1,
                                   "title": "故障申告表单",
                                   "type": "group",
                                   "item": [
                                       {
                                           "id": "3be56851-6971-4a80-b7be-5088a115bf72",
                                           "row": 1,
                                           "col": 1,
                                           "type": "group",
                                           "item": [
                                               {
                                                   "id": "1f1af13c-ed12-4b94-bc41-332cc5dad5fb",
                                                   "row": 1,
                                                   "col": 1,
                                                   "title": "标题",
                                                   "bizClass": "gzcllc",
                                                   "bizField": "title",
                                                   "displayType": "readonly",
                                                   "readonly": "false",
                                                   "type": "element",
                                                   "bzType": "text",
                                                   "value": "中国石油天然气集团公司-车载卫星天线子系统-后[2018-05-18 15:14]"
                                               }
                                           ]
                                       },
                                       {
                                           "id": "7e0dbebd-7fc3-4dfd-922b-dbcad6d2c5c0",
                                           "row": 2,
                                           "col": 1,
                                           "type": "group",
                                           "item": [
                                               {
                                                   "id": "7c7b120c-8ddc-4342-96ef-24ff8466dc73",
                                                   "row": 1,
                                                   "col": 1,
                                                   "title": "故障申告人",
                                                   "bizClass": "gzcllc",
                                                   "bizField": "gzsgr",
                                                   "displayType": "readonly",
                                                   "readonly": "false",
                                                   "type": "element",
                                                   "bzType": "text",
                                                   "value": "tx_gjl"
                                               },
                                               {
                                                   "id": "474248fc-b5c8-41d7-a5b4-ea8dee548425",
                                                   "row": 1,
                                                   "col": 2,
                                                   "title": "申告人单位",
                                                   "bizClass": "gzcllc",
                                                   "bizField": "sgrdw",
                                                   "displayType": "readonly",
                                                   "readonly": "false",
                                                   "type": "element",
                                                   "bzType": "text",
                                                   "value": "中国石油天然气集团公司"
                                               }
                                           ]
                                       },
                                       {
                                           "id": "dbefda48-cf35-44bb-b8e5-791f7562207d",
                                           "row": 3,
                                           "col": 1,
                                           "type": "group",
                                           "item": [
                                               {
                                                   "id": "32d581c6-9d17-4b8a-b66c-7a7c508a1794",
                                                   "row": 1,
                                                   "col": 1,
                                                   "title": "申告人部门",
                                                   "bizClass": "gzcllc",
                                                   "bizField": "sgrbm",
                                                   "displayType": "readonly",
                                                   "readonly": "false",
                                                   "type": "element",
                                                   "bzType": "text",
                                                   "value": "应急通信保障中心"
                                               },
                                               {
                                                   "id": "6ea55702-e7d1-48f0-a3df-87d6006911d6",
                                                   "row": 1,
                                                   "col": 2,
                                                   "title": "联系方式",
                                                   "bizClass": "gzcllc",
                                                   "bizField": "lxfs",
                                                   "displayType": "readonly",
                                                   "readonly": "false",
                                                   "type": "element",
                                                   "bzType": "text",
                                                   "value": "13703160513"
                                               }
                                           ]
                                       },
                                       {
                                           "id": "da9b8ba3-420e-4139-b554-8598102483db",
                                           "row": 4,
                                           "col": 1,
                                           "type": "group",
                                           "item": [
                                               {
                                                   "id": "3f815942-73c5-4dbb-bc60-a20ae315a4af",
                                                   "row": 1,
                                                   "col": 1,
                                                   "title": "故障申告时间",
                                                   "bizClass": "gzcllc",
                                                   "bizField": "gzsgsj",
                                                   "displayType": "readonly",
                                                   "readonly": "false",
                                                   "type": "element",
                                                   "bzType": "date",
                                                   "value": "2018-05-18 15:14",
                                                   "dataType": "Date",
                                                   "dataFormat": "yyyy-MM-dd HH:mm"
                                               }
                                           ]
                                       },
                                       {
                                           "id": "78fa189b-7ada-4855-988c-a80d51de31aa",
                                           "row": 5,
                                           "col": 1,
                                           "type": "group",
                                           "item": [
                                               {
                                                   "id": "bc3019f5-48f6-46c4-98f0-13252b8920aa",
                                                   "row": 1,
                                                   "col": 1,
                                                   "title": "故障设备类别",
                                                   "bizClass": "gzcllc",
                                                   "bizField": "gzsblb",
                                                   "displayType": "readonly",
                                                   "readonly": "false",
                                                   "type": "element",
                                                   "bzType": "select",
                                                   "defaultValue": "车载卫星天线子系统$^$车载卫星天线子系统$?$综合接入子系统$^$综合接入子系统$?$视频子系统$^$视频子系统$?$发电子系统$^$发电子系统$?$辅助子系统$^$辅助子系统$?$音频子系统$^$音频子系统$?$其他通信设备$^$其他通信设备$?$其它$^$其它",
                                                   "value": "车载卫星天线子系统"
                                               }
                                           ]
                                       },
                                       {
                                           "id": "21c5d153-e1e4-489b-b1de-5121ac664a07",
                                           "row": 6,
                                           "col": 1,
                                           "type": "group",
                                           "item": [
                                               {
                                                   "id": "df1d60a9-f26c-4b0d-a09c-b1ebedc91d44",
                                                   "row": 1,
                                                   "col": 1,
                                                   "title": "故障设备名称",
                                                   "bizClass": "gzcllc",
                                                   "bizField": "gzsbmc",
                                                   "displayType": "readonly",
                                                   "readonly": "false",
                                                   "type": "element",
                                                   "bzType": "text",
                                                   "value": "后"
                                               }
                                           ]
                                       },
                                       {
                                           "id": "772ecde6-89ac-40cd-9fc5-7f2322b29553",
                                           "row": 7,
                                           "col": 1,
                                           "type": "group",
                                           "item": [
                                               {
                                                   "id": "16fb55d4-e2ba-4817-b266-e3bb8e162e02",
                                                   "row": 1,
                                                   "col": 1,
                                                   "title": "故障现象",
                                                   "bizClass": "gzcllc",
                                                   "bizField": "gzxx",
                                                   "displayType": "readonly",
                                                   "readonly": "false",
                                                   "type": "element",
                                                   "bzType": "textarea",
                                                   "value": "破"
                                               }
                                           ]
                                       },
                                       {
                                           "id": "10a00e42-353f-4c7d-9da8-bd38943b97a9",
                                           "row": 8,
                                           "col": 1,
                                           "type": "group",
                                           "item": [
                                               {
                                                   "id": "9fcfd59e-a8c5-40ba-8123-a27c27768597",
                                                   "row": 1,
                                                   "col": 1,
                                                   "title": "附件",
                                                   "bizClass": "gzcllc",
                                                   "bizField": "fj",
                                                   "displayType": "readonly",
                                                   "readonly": "false",
                                                   "type": "element",
                                                   "bzType": "attachFile",
                                                   "value": []
                                               }
                                           ]
                                       }
                                   ]
                               },
                               {
                                   "id": "e426f17f-47d7-4e97-9292-e982689512cd",
                                   "row": 2,
                                   "col": 1,
                                   "type": "group",
                                   "item": [
                                       {
                                           "id": "55f501f4-80c0-453d-9e76-2f72a5390b13",
                                           "row": 1,
                                           "col": 1,
                                           "title": "保障中心处置",
                                           "type": "group",
                                           "item": [
                                               {
                                                   "id": "c6698638-b896-4abd-a197-af5fffd625a9",
                                                   "row": 1,
                                                   "col": 1,
                                                   "type": "group",
                                                   "item": [
                                                       {
                                                           "id": "b1fc3cb6-88b8-46d8-9dd8-e30121f3f522",
                                                           "row": 1,
                                                           "col": 1,
                                                           "title": "处置人",
                                                           "bizClass": "gzcllc",
                                                           "bizField": "bzzxczr",
                                                           "displayType": "readonly",
                                                           "readonly": "false",
                                                           "type": "element",
                                                           "bzType": "text"
                                                       },
                                                       {
                                                           "id": "33028087-c8ad-4f52-9311-d7ec75c369fc",
                                                           "row": 1,
                                                           "col": 2,
                                                           "title": "部门",
                                                           "bizClass": "gzcllc",
                                                           "bizField": "bzzxczbm",
                                                           "displayType": "readonly",
                                                           "readonly": "false",
                                                           "type": "element",
                                                           "bzType": "text"
                                                       },
                                                       {
                                                           "id": "e047df18-97e4-4564-b319-5e43315bbf72",
                                                           "row": 1,
                                                           "col": 3,
                                                           "title": "时间",
                                                           "bizClass": "gzcllc",
                                                           "bizField": "bzzxczsj",
                                                           "displayType": "readonly",
                                                           "readonly": "false",
                                                           "type": "element",
                                                           "bzType": "date"
                                                       }
                                                   ]
                                               },
                                               {
                                                   "id": "e4f495fb-f2b0-4131-9402-79248aa6ff0f",
                                                   "row": 2,
                                                   "col": 1,
                                                   "type": "group",
                                                   "item": [
                                                       {
                                                           "id": "7a48dd0f-560a-477c-8457-ed73e874097b",
                                                           "row": 1,
                                                           "col": 1,
                                                           "title": "是否返厂",
                                                           "bizClass": "gzcllc",
                                                           "bizField": "fc",
                                                           "displayType": "required",
                                                           "readonly": "false",
                                                           "type": "element",
                                                           "bzType": "radiogroup",
                                                           "defaultValue": "0$^$返厂维修$?$1$^$不返厂维修"
                                                       }
                                                   ]
                                               },
                                               {
                                                   "id": "06943968-6a0a-4428-bfcb-f1745f82af93",
                                                   "row": 3,
                                                   "col": 1,
                                                   "type": "group",
                                                   "item": [
                                                       {
                                                           "id": "98849faa-6de9-424f-90b2-15e1db846633",
                                                           "row": 1,
                                                           "col": 1,
                                                           "title": "故障处理意见",
                                                           "bizClass": "gzcllc",
                                                           "bizField": "clyj",
                                                           "displayType": "required",
                                                           "readonly": "false",
                                                           "type": "element",
                                                           "bzType": "textarea"
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
                               "id": 49378,
                               "name": "保障中心-故障受理",
                               "action": [
                                   {
                                       "id": "Link_1",
                                       "name": "返厂维修"
                                   },
                                   {
                                       "id": "Link_2",
                                       "name": "不返厂维修"
                                   }
                               ],
                               "claim": false
                           }
                       ]
                   }*/
            if(res.message=='工单查询出错 null'){
                mui.alert('数据有误，请返回')
                 plus.nativeUI.closeWaiting()

            }
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
                            defaultValue:item.item[i].defaultValue,
                            dispValue:item.item[i].dispValue
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
            //console.log("=="+sValue+"==");
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
console.log(re_str)
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
                    /*if((t[n].value).indexOf('$?$') >= 0){
                        var strs = new Array();
                        strs = (t[n].value).split('$?$');
                        var return_strs = new Array();
                        for(var i = 1; i < strs.length; i++){
                            return_strs.push(strs[i].trim());
                        }
                        t[n].value = return_strs;
                    }
                    if((t[n].value).indexOf(',') >= 0){
                        var strs = new Array();
                        strs = (t[n].value).split(',');
                        var return_strs = new Array();
                        for(var i = 0; i < strs.length; i++){
                            return_strs.push(strs[i].trim());
                        }
                        t[n].value = return_strs;
                    }*/
                    if(t[n].bzType=='checkbox'){
                        if((t[n].value).indexOf('$?$') >= 0){
                            var strs = new Array();
                            strs = (t[n].value).split('$?$');
                            var return_strs = new Array();
                            for(var i = 1; i < strs.length; i++){
                                return_strs.push(strs[i].trim());
                            }
                            t[n].value = return_strs;
                        }else if((t[n].value).indexOf(',') >= 0){
                            var strs = new Array();
                            strs = (t[n].value).split(',')||t[n].value;
                            var return_strs = new Array();
                            for(var i = 0; i < strs.length; i++){
                                return_strs.push(strs[i].trim());
                            }
                            t[n].value = return_strs;

                        }else{
                            var str=new Array()
                            str.push(t[n].value)
                            t[n].value=str
                            //console.log(t[n].value)
                        }


                    }else{

                            if((t[n].value).indexOf('$?$') >= 0){
                                var strs = new Array();
                                strs = (t[n].value).split('$?$');
                                var return_strs = new Array();
                                for(var i = 1; i < strs.length; i++){
                                    return_strs.push(strs[i].trim());
                                }
                                t[n].value = return_strs;
                        }
                        if((t[n].value).indexOf(',') >= 0){
                            var strs = new Array();
                            strs = (t[n].value).split(',')||t[n].value;
                            var return_strs = new Array();
                            for(var i = 0; i < strs.length; i++){
                                return_strs.push(strs[i].trim());
                            }
                            t[n].value = return_strs;
                        }


                    }

                }
            }
console.log(GetChinese(t[n].defaultValue,t[n].value))
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
    for(var i=0;i<vm.items.length;i++){
        if(vm.items[i].title.indexOf("附件")>=0){

               vm.fieIdCode=vm.items[i].bizField
        }
    }

    var task=res.task[0];
        if(task.claim!=undefined){
             vm.claim=task.claim
        }else{
            vm.claim=false
        }

    //alert(vm.claim)

    for(var n in task.action){
        vm.task.push(task.action[n])
        if(task.action[n].hasOwnProperty("performer")&&Array.isArray(task.action[n].performer)&&task.action[n].name==='交班'){
            for(var j in task.action[n].performer){
                vm.performer.push({
                    text:task.action[n].performer[j].name,
                    id:task.action[n].performer[j].id,
                    account:task.action[n].performer[j].iaccount,
                    orgId:task.action[n].performer[j].orgId,
                    deptId:task.action[n].performer[j].deptId,
                })
                console.log(task.action[n].performer[j])
            }
        }
    }
       // alert(JSON.stringify(vm.performer))

        vm.taskid=task.id

       },
            error:function(xhr,type,errorThrown){
             plus.nativeUI.closeWaiting()
                alert("与大厅连接中断,请退出APP重新进入大厅唤醒")
            },
            complete :function(){
                //setTimeout(function(){
                    plus.nativeUI.closeWaiting()
                //},500)
            }
        })
        mui.back = function() {
                   plus.webview.currentWebview().hide("auto", 300);
//                   fd.delete('file')
//                      fd.delete('objId')
//                      fd.delete('field')
                    vm.fd=[]
                   var self = plus.webview.currentWebview();
                   close()
                   closeOne()
                   self.addEventListener("hide",function (e) {
                       vm.guid='',
                       vm.author='',
                       vm.items=[],
                       vm.task=[]
                   },false);
               }
    }

      getPerson('danwei','bumen','jianchar');
      getPersonOne('danweione','bumenone','jiancharone');
function getPerson(obj,bumen,jianchar){
    var showUserPickerButton = document.getElementById(obj);
    showUserPickerButton.addEventListener('tap', function(event) {
        var evt=event ||window.event
        evt.stopPropagation()
        document.getElementById('bumen').value=""
        document.getElementById('jianchar').value=""
        var userPicker = new mui.PopPicker();
        mui.ajax("http://127.0.0.1:10332/itsm/rest/api/v2/acm/user/org",{
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
                alert("与大厅连接中断,请退出APP重新进入大厅唤醒")
            }
        })
    }, false);
    var bumen = document.getElementById(bumen);
    var danwei =showUserPickerButton// document.getElementById('danwei');
    bumen.addEventListener('tap', function(event) {
    var evt=event ||window.event
    evt.stopPropagation()
    document.getElementById('jianchar').value=""
        var user = new mui.PopPicker();
        if(danwei.getAttribute('data')==null){
                return false;
        }else{
             mui.ajax("http://127.0.0.1:10332/itsm/rest/api/v2/acm/user/dept?orgId="+danwei.getAttribute('data'),{
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
                    alert("与大厅连接中断,请退出APP重新进入大厅唤醒")
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
    var jianchar = document.getElementById(jianchar);
    jianchar.addEventListener('tap', function(event) {
    var evt=event ||window.event
        evt.stopPropagation()
        var user = new mui.PopPicker();
        if(bumen.getAttribute('data')==null){
                return false;
        }else{
            mui.ajax("http://127.0.0.1:10332/itsm/rest/api/v2/acm/user/?deptId="+bumen.getAttribute('data'),{
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
                    alert("与大厅连接中断,请退出APP重新进入大厅唤醒")
                }
            })
            user.show(function(items) {
                jianchar.value = items[0].text;
                document.getElementById('jianchar').setAttribute('data',items[0].id)
                //返回 false 可以阻止选择框的关闭
                //return false;
                user.dispose()
            });
        }
    }, false);
}
function getPersonOne(obj,bumen,jianchar){
     var showUserPickerButton = document.getElementById(obj);
     showUserPickerButton.addEventListener('tap', function(event) {
         var evt=event ||window.event
         evt.stopPropagation()
         document.getElementById('bumenone').value=""
         document.getElementById('jiancharone').value=""
         var userPicker = new mui.PopPicker();
         mui.ajax("http://127.0.0.1:10332/itsm/rest/api/v2/acm/user/org",{
             dataType:'json',
             type:'get',
             success:function(res){
                 var ni=[]
                 if(vm.guid=='值班日志'){
                    for(var n in res.data){
                      ni.push({
                          text:res.data[n].name,
                          id:res.data[n].id
                      })
                    }
                 }else{
                      ni.push({
                           text:res.data[0].name,
                           id:res.data[0].id
                       })
                 }
              /*   */

                 userPicker.setData(ni);
                 userPicker.show(function(items) {
                     showUserPickerButton.value = items[0].text;
                     document.getElementById('danweione').setAttribute('data',items[0].id)
                     //返回 false 可以阻止选择框的关闭
                     //return false;
                     userPicker.dispose()
                 });
             },
             error:function(xhr,type,errorThrown){
                 plus.nativeUI.closeWaiting();
                 alert("与大厅连接中断,请退出APP重新进入大厅唤醒")
             }
         })
     }, false);
     var bumen = document.getElementById(bumen);
     var danwei =document.getElementById('danweione');
     bumen.addEventListener('tap', function(event) {

     var evt=event ||window.event
     evt.stopPropagation()
     document.getElementById('jiancharone').value=""
         var user = new mui.PopPicker();
         if(danwei.getAttribute('data')==null||danwei.getAttribute('data')==''){
                 return false;
         }else{
              mui.ajax("http://127.0.0.1:10332/itsm/rest/api/v2/acm/user/dept?orgId="+danwei.getAttribute('data'),{
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
                     alert("与大厅连接中断,请退出APP重新进入大厅唤醒")
                 }
             })
              user.show(function(items) {

                    if(items[0].text==undefined){
                          bumen.value = ''
                          return false;
                      }else{
                      bumen.value = items[0].text;

                      }

                     document.getElementById('bumenone').setAttribute('data',items[0].id)
                     //返回 false 可以阻止选择框的关闭
                     //return false;
                     user.dispose()
                 });
         }
     }, false);
     var jianchar = document.getElementById(jianchar);
     jianchar.addEventListener('tap', function(event) {
     var evt=event ||window.event
         evt.stopPropagation()
         var user = new mui.PopPicker();
         if(bumen.getAttribute('data')==null){
                 return false;
         }else{
             mui.ajax("http://127.0.0.1:10332/itsm/rest/api/v2/acm/user/?deptId="+bumen.getAttribute('data'),{
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
                     alert("与大厅连接中断,请退出APP重新进入大厅唤醒")
                 }
             })
             user.show(function(items) {
                 if(items[0].text==undefined){
                    jianchar.value = ''
                }else{
                jianchar.value = items[0].text;
                }
                // jianchar.value = items[0].text;
                 document.getElementById('jiancharone').setAttribute('data',items[0].id)
                 //返回 false 可以阻止选择框的关闭
                 //return false;
                 user.dispose()
             });
         }
     }, false);
 }

    })
/*function Gareth(){
    mui('#popover').popover('show');
}*/


// 从相册中选择多张图片
function galleryImgs(){
	// 从相册中选择图片

	console.log("从相册中选择多张图片:");

    plus.gallery.pick( function(path){
    var task = plus.uploader.createUpload( "http://127.0.0.1:10332/itsm/rest/api/v2/itsm/tickets/upload",
    		{ method:"POST" },
    		function ( t, status ) {
    			if ( status == 200 ) {
    				alert(JSON.stringify(status))
                    alert(JSON.stringify(t))
    			} else {
    				alert(JSON.stringify(status+'1'))
                  alert(JSON.stringify(t+'1'))
    			}
    		}
    	);
    	task.addFile(path, {key:"fj"} );
    	//task.addData( "name", "string_value" );
    	task.addData("objId",vm.id)
         task.addData("field",vm.field)
task.start();


    	mui('#popover').popover('hide');
    }, function ( e ) {
    	alert( "取消选择图片" );
    	mui('#popover').popover('hide');
    },{system:true});
}


// 拍照
function getImage(){
	var cmr = plus.camera.getCamera();
	cmr.captureImage(function(path){
		plus.gallery.save(path, function(){
			console.log("file://"+plus.io.convertLocalFileSystemURL(path))
			mui('#popover').popover('hide');
		}, function(e){
			console.log('保存失败: '+JSON.stringify(e))
			mui('#popover').popover('hide');
		});
	}, function(e){
		console.log('取消拍照')
		mui('#popover').popover('hide');
	}, {filename:'_doc/gallery/',index:1});
}

// 录像
function getVideo(){
	var cmr = plus.camera.getCamera();
	cmr.startVideoCapture(function(path){
		console.log("file://"+plus.io.convertLocalFileSystemURL(path))
		mui('#popover').popover('hide');
	}, function(e){
		console.log(e.Message)
			mui('#popover').popover('hide');
	}, {filename:'_doc/camera/',index:1});
}


function close(){
    document.getElementById('mui-backdrop').style.display='none';
    document.getElementById('bumen').value="";
    document.getElementById('jianchar').value="";
    document.getElementById('danwei').value="";
}
function closeOne(){
    document.getElementById('mui-backdropone').style.display='none';
        document.getElementById('bumenone').value="";
        document.getElementById('jiancharone').value="";
        document.getElementById('danweione').value="";
}
function show(){
    document.getElementById('mui-backdrop').style.display='block';
}
function showone(){
    document.getElementById('mui-backdropone').style.display='block';
}
function confirm(){
    if(document.getElementById('jianchar').value==""){
        return false
    }else{
        document.querySelector('.obj').value=document.getElementById('jianchar').value
        document.querySelector('.obj').setAttribute('data-id',document.getElementById('jianchar').getAttribute('data'))
        document.getElementById('mui-backdrop').style.display='none';
        document.getElementById('bumen').value="";
        document.getElementById('jianchar').value="";
        document.getElementById('danwei').value="";
    }

}
function confirmone(){

    if(document.getElementById('jiancharone').value==""){
        return false
    }else{
        document.getElementById('mui-backdropone').style.display='none';
        objData.allocated=document.getElementById('jiancharone').getAttribute('data')
        document.getElementById('bumenone').value="";
        document.getElementById('jiancharone').value="";
        document.getElementById('danweione').value="";
        //alert(JSON.stringify(objData))
          mui.ajax('http://127.0.0.1:10332/itsm/rest/api/v2/itsm/tickets/progressing',{
            data:objData,
            dataType:'json',
            type:'post',
            headers:{'Content-Type':'application/json'},
            success:function(data){
                //alert(JSON.stringify(data))
               // mui.back()
               mui.back = function() {
                       var list = plus.webview.getWebviewById('commissionListview')||plus.webview.getLaunchWebview();
                   //触发列表界面的自定义事件（refresh）,从而进行数据刷新
                  // alert(JSON.stringify(list))
                       mui.fire(list,'refresh');
                       plus.webview.currentWebview().hide("auto", 300);
                       var self = plus.webview.currentWebview();
                       confirm()
                       self.addEventListener("hide",function (e) {
                           vm.guid='',
                           vm.author='',
                           vm.items=[],
                           vm.task=[]
                       },false);
                   }
                   plus.nativeUI.closeWaiting()
                   mui.back()
            },
            error:function(xhr,type,errorThrown){
                //异常处理；
                alert("与大厅连接中断,请退出APP重新进入大厅唤醒");
            }
        })
    }

}
