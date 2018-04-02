var objData;
objData={}
var fd;
fd = new FormData();
var vm=new Vue({
        el:"#root",
        data:{
            guid:'',
            validate:'validate',
            author:'dqgsTest',
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
            getLogin:''

        },
        methods:{
            commint:function(item){
                //alert(fd.has('file'))
                //alert(JSON.stringify(item))
                var wat=plus.nativeUI.showWaiting('提交中...')
                mui.ajax('http://127.0.0.1:10261/itsm/rest/api/v2/itsm/tickets/progressing',{
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
                        fd.delete('file')
                        fd.delete('objId')
                        fd.delete('field')
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
                    // alert(JSON.stringify(data))

                     if(data.success==true){
                        //alert(fd.has("file"))
                        if(fd.getAll("file").length>0){
                          //  alert("进入file")
                            this.id=data.id
                            fd.append("objId",vm.id)
                            fd.append("field",vm.field+vm.fieIdCode)
                           // alert(JSON.stringify(fd.getAll('file')))
                            //alert(JSON.stringify(this.id)+"--"+JSON.stringify(fd.get('file').name)+"--"+JSON.stringify(vm.field))
                            console.log(JSON.stringify(fd.get('file').name))
                            wat.setTitle("正在上传附件请稍后...")
                            mui.ajax('http://127.0.0.1:10261/itsm/rest/api/v2/itsm/tickets/upload',{
                                data:fd,
                                type:'post',
                                processData: false,
                                contentType: false,
                                success:function(data){
                                    var data=JSON.parse(data)
                                    //alert(JSON.stringify(data))
                                    if(data.success){
                                        mui.alert("附件上传成功")
                                        wat.close()
                                       mui.back()
                                    }else{
                                        mui.alert("附件上传失败")
                                        wat.close()
                                         mui.back()
                                    }
                                },
                                error:function(xhr,type,errorThrown){
                                    //异常处理；
                                    alert(2332);
                                }
                            })
                        }else{
                        //alert("没有file")
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
                    alert(2332);
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
                  var person=document.querySelectorAll('#form1 .person ')
                for(var i=0;i<person.length;i++){
                    objData.bizObj[person[i].name]=person[i].getAttribute('data-id')
                }
                var checked=document.querySelectorAll('#form1 .checked ')

                for(var i=0;i<checked.length;i++){
                    if(checked[i].checked){
                          if(objData.bizObj.hasOwnProperty(checked[i].name)){
                            objData.bizObj[checked[i].name] += ',' + checked[i].value;
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

                    if(a && b){
                        if(yjbzgl&&checkArr){
                       // alert('都执行')
                           this.commintData();

                        }
                    }else if(a){
                       if(checkArr){
                        //alert('执行文本')
                               this.commintData()
                       }
                    }else if(b){
                        if(yjbzgl){
                         //alert('执行复选')
                                this.commintData()
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
            commintData:function(){

                if(this.author=='jjbgl'){
                        if(item.name=='交班'){
                            showone();
                        }else{
                            this.commint(objData)
                        }
                    }else{
                        this.commint(objData)
                     }
            },
            Download: function(obj){
                var path=obj.uri.replace(/http:\/\/11.55.0.81:8890/gi,'http:\/\/127.0.0.1:10261');
                var watiting=plus.nativeUI.showWaiting("下载中。。。请稍后");
                //alert(JSON.stringify(decodeURIComponent(path+"&encoding=UTF8")));
                var dtask = plus.downloader.createDownload(path+"&encoding=UTF8", {
                       method: 'post',
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
                 var form = document.getElementById("form2");
                for(var i=0;i<e.target.files.length;i++){
                   // this.fileArray.push(e.target.files[0])
                    fd.append('file',e.target.files[0])
                    var p=document.createElement('p')
                    /*var span=document.createElement('span')
                    span.className='mui-icon mui-icon-close remove';
                    span.style.position='absolute';
                    span.style.top=0+'px';
                    span.style.right=0+'px';
                    span.style.color='red';*/
                    p.className=" form-control doenload";
                    p.style.marginBottom=15+'px';
                    p.style.position='relative';
                    p.innerHTML=e.target.files[0].name;
                    e.target.parentNode.parentNode.appendChild(p);
                    document.querySelectorAll('.mui-btn.mui-btn-danger')[0].style.display='block';
                    //p.appendChild(span)
                //console.log(JSON.stringify(fd.get('file').name)+'--'+JSON.stringify(fd.get('objId')))
                }
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
                        fd.delete('file')
                        //alert(JSON.stringify(fd.getAll('file')))
                        e.target.style.display='none'
                     },
            test(){
                alert()
                 plus.runtime.openFile( "/1.png",{},function(e){
                        alert(e)
                 } )
                /* plus.io.requestFileSystem(plus.io.PUBLIC_DOWNLOADS, function( fs ) {
                        // 可通过fs操作PRIVATE_WWW文件系统

                          var directoryReader = fs.root.createReader();
                                 directoryReader.readEntries( function( entries )  //遍历该文件夹下的文件
                                          {
                                     var i;
                                     for( i=0; i < entries.length; i++ )
                                                  {
                                         alert( entries[i].name );  //获得文件名称

                                     }

                                 }, function ( e )
                                           {
                                     alert( "Read entries failed: " + e.message );
                                 } );
                    }, function ( e ) {
                        alert( "Request file system failed: " + e.message );
                    })*/
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
        mui.ajax("http://127.0.0.1:10261/itsm/rest/api/v2/itsm/tickets/queryByForm?userId="+vm.getLogin+"&processId="+vm.id,{
            dataType:'json',
            type:'get',
            success:function(res){

                //alert(JSON.stringify(res))

          /* var res={
                     "result": {
                       "success": true
                     },
                     "ticket": {
                       "id": "8ecd0ef0-6f17-4f5e-8906-d0973c7dccdf",
                       "data": [
                         {
                           "id": "954ca47b-cfe2-4cb1-8988-da464c101fc1",
                           "row": 1,
                           "col": 1,
                           "title": "地区公司测试记录",
                           "type": "group",
                           "item": [
                             {
                               "id": "6a1c78d7-7844-47f7-a9df-47277799e2f6",
                               "row": 1,
                               "col": 1,
                               "type": "group",
                               "item": [
                                 {
                                   "id": "85265b19-1b56-486e-a8bc-0cbb38929b07",
                                   "row": 1,
                                   "col": 1,
                                   "title": "填写人",
                                   "bizClass": "dqgscs",
                                   "bizField": "txr",
                                   "displayType": "readonly",
                                   "readonly": "false",
                                   "type": "element",
                                   "bzType": "userSelect",
                                   "value": {
                                     "id": "fe9f0e70-e461-49fa-8600-16493c4ea982",
                                     "name": "王伟东",
                                     "dept": "生产科",
                                     "email": "lzwangweidong@petrochina.com.cn",
                                     "mobile": "18089315218"
                                   }
                                 }
                               ]
                             },
                             {
                               "id": "f7a10905-4cc9-4121-bca1-ae188d133b9e",
                               "row": 2,
                               "col": 1,
                               "type": "group",
                               "item": [
                                 {
                                   "id": "82272be4-6db8-43d9-bf5c-ad4bcaa4dfbd",
                                   "row": 1,
                                   "col": 1,
                                   "title": "地区公司测试人员",
                                   "bizClass": "dqgscs",
                                   "bizField": "dqgscsy",
                                   "displayType": "readonly",
                                   "readonly": "false",
                                   "type": "element",
                                   "bzType": "text",
                                   "value": "看见没看"
                                 },
                                 {
                                   "id": "fa4469ca-b154-433f-8734-930d359c0df1",
                                   "row": 1,
                                   "col": 2,
                                   "title": "测试开始时间",
                                   "bizClass": "dqgscs",
                                   "bizField": "Time_Start",
                                   "displayType": "readonly",
                                   "readonly": "false",
                                   "type": "element",
                                   "bzType": "date",
                                   "value": "2018-03-25 11:22",
                                   "dataType": "Date",
                                   "dataFormat": "yyyy-MM-dd HH:mm"
                                 }
                               ]
                             },
                             {
                               "id": "ef263246-e091-41f9-8de7-943e416e92c4",
                               "row": 3,
                               "col": 1,
                               "type": "group",
                               "item": [
                                 {
                                   "id": "30069600-5431-413b-8824-e6be4e648305",
                                   "row": 1,
                                   "col": 1,
                                   "title": "测试内容",
                                   "bizClass": "dqgscs",
                                   "bizField": "csnr",
                                   "displayType": "readonly",
                                   "readonly": "false",
                                   "type": "element",
                                   "bzType": "textarea",
                                   "value": "携家带口"
                                 },
                                 {
                                   "id": "7f844c59-afb1-4958-a3a4-6b9f4275081d",
                                   "row": 2,
                                   "col": 1,
                                   "title": "测试车辆",
                                   "bizClass": "dqgscs",
                                   "bizField": "cscl",
                                   "displayType": "readonly",
                                   "readonly": "false",
                                   "type": "element",
                                   "bzType": "textarea",
                                   "value": "小寂寞的"
                                 }
                               ]
                             }
                           ]
                         },
                         {
                           "id": "1e964d2c-c4c9-497e-9343-f155bcceb447",
                           "row": 2,
                           "col": 1,
                           "title": "审批意见",
                           "type": "group",
                           "item": [
                             {
                               "id": "be2ec02b-21ce-46f8-82fd-cf5ca76fa70f",
                               "row": 1,
                               "col": 1,
                               "type": "group",
                               "item": [
                                 {
                                   "id": "ccf9c7f1-de38-418b-93ed-69bb1c7a34db",
                                   "row": 1,
                                   "col": 1,
                                   "title": "审批人",
                                   "bizClass": "dqgscs",
                                   "bizField": "sprname",
                                   "displayType": "readonly",
                                   "readonly": "false",
                                   "type": "element",
                                   "bzType": "text",
                                   "value": "肖健"
                                 },
                                 {
                                   "id": "662d2105-74d9-4796-9585-0da3236a9217",
                                   "row": 1,
                                   "col": 2,
                                   "title": "审批时间",
                                   "bizClass": "dqgscs",
                                   "bizField": "spsj",
                                   "displayType": "readonly",
                                   "readonly": "false",
                                   "type": "element",
                                   "bzType": "date",
                                   "value": "2018-03-25 11:23",
                                   "dataType": "Date",
                                   "dataFormat": "yyyy-MM-dd HH:mm"
                                 }
                               ]
                             },
                             {
                               "id": "10b296a0-24a7-4a5b-bdaa-5bf9574c3e37",
                               "row": 2,
                               "col": 1,
                               "type": "group",
                               "item": [
                                 {
                                   "id": "743cd475-9752-4bb2-a388-f9142bfb4bfd",
                                   "row": 1,
                                   "col": 1,
                                   "title": "审批意见",
                                   "bizClass": "dqgscs",
                                   "bizField": "spyj",
                                   "displayType": "readonly",
                                   "readonly": "false",
                                   "type": "element",
                                   "bzType": "textarea",
                                   "value": "同意"
                                 }
                               ]
                             }
                           ]
                         },
                         {
                           "id": "400dea46-c4b3-46b0-81b1-7c906a0e0b51",
                           "row": 4,
                           "col": 1,
                           "type": "group",
                           "item": [
                             {
                               "id": "16792b89-92a1-42c1-90ff-973df27dd117",
                               "row": 1,
                               "col": 1,
                               "title": "测试项:网络延时",
                               "type": "group",
                               "item": [
                                 {
                                   "id": "9b255fb4-1745-4453-8029-80e64fff9e4c",
                                   "row": 1,
                                   "col": 1,
                                   "type": "group",
                                   "item": [
                                     {
                                       "id": "1d896ca4-9251-4327-a2e7-37495a446d7e",
                                       "row": 1,
                                       "col": 1,
                                       "title": "测试结果",
                                       "bizClass": "dqgscs",
                                       "bizField": "wlys",
                                       "displayType": "required",
                                       "readonly": "false",
                                       "type": "element",
                                       "bzType": "radiogroup",
                                       "defaultValue": "1$^$正常$?$0$^$异常$?$2$^$未测试"
                                     },
                                     {
                                       "id": "bf52406d-d550-4576-ad8e-fbc9fdcef526",
                                       "row": 1,
                                       "col": 2,
                                       "title": "问题描述",
                                       "bizClass": "dqgscs",
                                       "bizField": "wtms1",
                                       "displayType": "opitonal",
                                       "readonly": "false",
                                       "type": "element",
                                       "bzType": "textarea"
                                     }
                                   ]
                                 }
                               ]
                             }
                           ]
                         },
                         {
                           "id": "5f569f56-9e41-4363-8f90-8baa17b1bf0c",
                           "row": 5,
                           "col": 1,
                           "type": "group",
                           "item": [
                             {
                               "id": "ac88a2a5-12d5-4626-aa4d-56644d8fa77c",
                               "row": 1,
                               "col": 1,
                               "title": "测试项:视频会议",
                               "type": "group",
                               "item": [
                                 {
                                   "id": "a7de8bfb-1ab8-46c6-af56-fdb41e36c1a9",
                                   "row": 1,
                                   "col": 1,
                                   "type": "group",
                                   "item": [
                                     {
                                       "id": "edc9773b-10bd-458a-8f56-703d47f8cf97",
                                       "row": 1,
                                       "col": 1,
                                       "title": "测试结果",
                                       "bizClass": "dqgscs",
                                       "bizField": "sphy",
                                       "displayType": "required",
                                       "readonly": "false",
                                       "type": "element",
                                       "bzType": "radiogroup",
                                       "defaultValue": "1$^$正常$?$0$^$异常$?$2$^$未测试$?$3$^$无此设备"
                                     },
                                     {
                                       "id": "812b7833-f75b-4680-b32a-97dedcfafa78",
                                       "row": 1,
                                       "col": 2,
                                       "title": "问题描述",
                                       "bizClass": "dqgscs",
                                       "bizField": "wtms2",
                                       "displayType": "opitonal",
                                       "readonly": "false",
                                       "type": "element",
                                       "bzType": "textarea"
                                     }
                                   ]
                                 }
                               ]
                             }
                           ]
                         },
                         {
                           "id": "86647306-a7d3-4d12-9af4-e3b57251a203",
                           "row": 6,
                           "col": 1,
                           "type": "group",
                           "item": [
                             {
                               "id": "afde3fc5-7cc9-4d1a-8942-654cb30f53cf",
                               "row": 1,
                               "col": 1,
                               "title": "测试项:车顶图像",
                               "type": "group",
                               "item": [
                                 {
                                   "id": "838d7b02-672d-4f13-aede-7e580908c479",
                                   "row": 1,
                                   "col": 1,
                                   "type": "group",
                                   "item": [
                                     {
                                       "id": "dd737af6-4d52-4863-9d65-027166c33955",
                                       "row": 1,
                                       "col": 1,
                                       "title": "测试结果",
                                       "bizClass": "dqgscs",
                                       "bizField": "cdtx",
                                       "displayType": "required",
                                       "readonly": "false",
                                       "type": "element",
                                       "bzType": "radiogroup",
                                       "defaultValue": "1$^$正常$?$0$^$异常$?$2$^$未测试$?$3$^$无此设备"
                                     },
                                     {
                                       "id": "9c050212-12a6-45f2-9483-ab8fa7fcf701",
                                       "row": 1,
                                       "col": 2,
                                       "title": "问题描述",
                                       "bizClass": "dqgscs",
                                       "bizField": "wtms3",
                                       "displayType": "opitonal",
                                       "readonly": "false",
                                       "type": "element",
                                       "bzType": "textarea"
                                     }
                                   ]
                                 }
                               ]
                             }
                           ]
                         },
                         {
                           "id": "fbcfd5ae-e0e1-476b-b4b2-2ff2f3b06109",
                           "row": 7,
                           "col": 1,
                           "type": "group",
                           "item": [
                             {
                               "id": "428eb9de-1986-420b-bce6-a69cab0db7c0",
                               "row": 1,
                               "col": 1,
                               "title": "测试项:单兵图像",
                               "type": "group",
                               "item": [
                                 {
                                   "id": "86202170-bcac-4cad-b3c3-03a994bbdf9b",
                                   "row": 1,
                                   "col": 1,
                                   "type": "group",
                                   "item": [
                                     {
                                       "id": "dad8df50-9a9d-4b58-8dde-496b807e77ee",
                                       "row": 1,
                                       "col": 1,
                                       "title": "测试结果",
                                       "bizClass": "dqgscs",
                                       "bizField": "dbtx",
                                       "displayType": "required",
                                       "readonly": "false",
                                       "type": "element",
                                       "bzType": "radiogroup",
                                       "defaultValue": "1$^$正常$?$0$^$异常$?$2$^$未测试$?$3$^$无此设备"
                                     },
                                     {
                                       "id": "e52bf127-8973-465a-bd99-0e24c0a61882",
                                       "row": 1,
                                       "col": 2,
                                       "title": "问题描述",
                                       "bizClass": "dqgscs",
                                       "bizField": "wtms4",
                                       "displayType": "opitonal",
                                       "readonly": "false",
                                       "type": "element",
                                       "bzType": "textarea"
                                     }
                                   ]
                                 }
                               ]
                             }
                           ]
                         },
                         {
                           "id": "c0ab94cd-7e30-4e59-94f3-4d24aeb2553a",
                           "row": 8,
                           "col": 1,
                           "type": "group",
                           "item": [
                             {
                               "id": "0c9d5c14-a258-456e-8f53-5397f10dfe1e",
                               "row": 1,
                               "col": 1,
                               "title": "测试项:车载电话",
                               "type": "group",
                               "item": [
                                 {
                                   "id": "6682157c-5e32-49a7-be74-a6c5f6bfab47",
                                   "row": 1,
                                   "col": 1,
                                   "type": "group",
                                   "item": [
                                     {
                                       "id": "307f93fe-04fb-49e8-a848-ff9b1960e11d",
                                       "row": 1,
                                       "col": 1,
                                       "title": "测试结果",
                                       "bizClass": "dqgscs",
                                       "bizField": "czdh",
                                       "displayType": "required",
                                       "readonly": "false",
                                       "type": "element",
                                       "bzType": "radiogroup",
                                       "defaultValue": "1$^$正常$?$0$^$异常$?$2$^$未测试$?$3$^$无此设备"
                                     },
                                     {
                                       "id": "198bde5d-2069-4c4d-b471-2b0c1ea78f29",
                                       "row": 1,
                                       "col": 2,
                                       "title": "问题描述",
                                       "bizClass": "dqgscs",
                                       "bizField": "wtms5",
                                       "displayType": "opitonal",
                                       "readonly": "false",
                                       "type": "element",
                                       "bzType": "textarea"
                                     }
                                   ]
                                 }
                               ]
                             }
                           ]
                         },
                         {
                           "id": "9fa447b2-d20d-4d01-bd71-fd25c967ff0c",
                           "row": 9,
                           "col": 1,
                           "type": "group",
                           "item": [
                             {
                               "id": "7c82b933-f961-41d2-9fae-c5b3a2c5825b",
                               "row": 1,
                               "col": 1,
                               "title": "测试项:对讲机",
                               "type": "group",
                               "item": [
                                 {
                                   "id": "863c594a-903d-4c1f-986a-01d188e89994",
                                   "row": 1,
                                   "col": 1,
                                   "type": "group",
                                   "item": [
                                     {
                                       "id": "266a5dbf-5410-4783-8e21-8015554dd9ff",
                                       "row": 1,
                                       "col": 1,
                                       "title": "测试结果",
                                       "bizClass": "dqgscs",
                                       "bizField": "djj",
                                       "displayType": "required",
                                       "readonly": "false",
                                       "type": "element",
                                       "bzType": "radiogroup",
                                       "defaultValue": "1$^$正常$?$0$^$异常$?$2$^$未测试$?$3$^$无此设备"
                                     },
                                     {
                                       "id": "12680ead-6c50-45f6-885a-f3f1f4488798",
                                       "row": 1,
                                       "col": 2,
                                       "title": "问题描述",
                                       "bizClass": "dqgscs",
                                       "bizField": "wtms6",
                                       "displayType": "opitonal",
                                       "readonly": "false",
                                       "type": "element",
                                       "bzType": "textarea"
                                     }
                                   ]
                                 }
                               ]
                             }
                           ]
                         },
                         {
                           "id": "c9ca3b0b-4f4c-4ba2-a8d9-c9d52416eb49",
                           "row": 10,
                           "col": 1,
                           "type": "group",
                           "item": [
                             {
                               "id": "682b8e1a-3ce2-4755-a873-3a3e39e133c8",
                               "row": 1,
                               "col": 1,
                               "title": "测试项:PBX防爆手机",
                               "type": "group",
                               "item": [
                                 {
                                   "id": "cdd9ec85-ff28-4415-8b80-a488acd6ef29",
                                   "row": 1,
                                   "col": 1,
                                   "type": "group",
                                   "item": [
                                     {
                                       "id": "a4751702-611a-4d57-8315-5cc809e73aa6",
                                       "row": 1,
                                       "col": 1,
                                       "title": "测试结果",
                                       "bizClass": "dqgscs",
                                       "bizField": "PBXFBSJ",
                                       "displayType": "required",
                                       "readonly": "false",
                                       "type": "element",
                                       "bzType": "radiogroup",
                                       "defaultValue": "1$^$正常$?$0$^$异常$?$2$^$未测试$?$3$^$无此设备"
                                     },
                                     {
                                       "id": "03724a0f-5c09-4cd4-99eb-f4f525d70e4e",
                                       "row": 1,
                                       "col": 2,
                                       "title": "问题描述",
                                       "bizClass": "dqgscs",
                                       "bizField": "wtms7",
                                       "displayType": "opitonal",
                                       "readonly": "false",
                                       "type": "element",
                                       "bzType": "textarea"
                                     }
                                   ]
                                 }
                               ]
                             }
                           ]
                         },
                         {
                           "id": "f5011a43-cf73-40fe-ba70-6bbf6b798fda",
                           "row": 11,
                           "col": 1,
                           "type": "group",
                           "item": [
                             {
                               "id": "5b7df1e3-e430-44ad-81ce-892dc3ac57fa",
                               "row": 1,
                               "col": 1,
                               "title": "测试项:北斗数据",
                               "type": "group",
                               "item": [
                                 {
                                   "id": "3a783959-2a13-4ccc-ab0e-17e6a47c952c",
                                   "row": 1,
                                   "col": 1,
                                   "type": "group",
                                   "item": [
                                     {
                                       "id": "e08630d0-625d-4bd1-b031-e6477ef6df20",
                                       "row": 1,
                                       "col": 1,
                                       "title": "测试结果",
                                       "bizClass": "dqgscs",
                                       "bizField": "bdsj",
                                       "displayType": "required",
                                       "readonly": "false",
                                       "type": "element",
                                       "bzType": "radiogroup",
                                       "defaultValue": "1$^$正常$?$0$^$异常$?$2$^$未测试$?$3$^$无此设备"
                                     },
                                     {
                                       "id": "d1042139-017b-431e-9a5f-4ee62ed55ea3",
                                       "row": 1,
                                       "col": 2,
                                       "title": "问题描述",
                                       "bizClass": "dqgscs",
                                       "bizField": "wtms8",
                                       "displayType": "opitonal",
                                       "readonly": "false",
                                       "type": "element",
                                       "bzType": "textarea"
                                     }
                                   ]
                                 }
                               ]
                             }
                           ]
                         },
                         {
                           "id": "85f4bcb1-50ed-4d9b-9458-c726042ce5a1",
                           "row": 12,
                           "col": 1,
                           "type": "group",
                           "item": [
                             {
                               "id": "9a0efdaa-f63f-4e1a-bae4-b8921dbab16f",
                               "row": 1,
                               "col": 1,
                               "title": "测试项:集中监控单元",
                               "type": "group",
                               "item": [
                                 {
                                   "id": "8ddd4f71-1254-452c-b7af-d4063f9c551a",
                                   "row": 1,
                                   "col": 1,
                                   "type": "group",
                                   "item": [
                                     {
                                       "id": "7289b7ba-8722-4d50-a5f7-f03ef1bb4eda",
                                       "row": 1,
                                       "col": 1,
                                       "title": "测试结果",
                                       "bizClass": "dqgscs",
                                       "bizField": "jzjkdy",
                                       "displayType": "required",
                                       "readonly": "false",
                                       "type": "element",
                                       "bzType": "radiogroup",
                                       "defaultValue": "1$^$正常$?$0$^$异常$?$2$^$未测试$?$3$^$无此设备"
                                     },
                                     {
                                       "id": "1d4ddc18-d621-46d2-b1b4-e7c0128be425",
                                       "row": 1,
                                       "col": 2,
                                       "title": "问题描述",
                                       "bizClass": "dqgscs",
                                       "bizField": "wtms9",
                                       "displayType": "opitonal",
                                       "readonly": "false",
                                       "type": "element",
                                       "bzType": "textarea"
                                     }
                                   ]
                                 }
                               ]
                             }
                           ]
                         },
                         {
                           "id": "10b54ffc-c411-4b17-8bee-dfcf8c3b750a",
                           "row": 13,
                           "col": 1,
                           "type": "group",
                           "item": [
                             {
                               "id": "6d7f3746-35fa-4044-a74b-51b1296a3c89",
                               "row": 1,
                               "col": 1,
                               "title": "测试项:激光夜视仪",
                               "type": "group",
                               "item": [
                                 {
                                   "id": "de87604a-253a-431d-be93-bdbe47113348",
                                   "row": 1,
                                   "col": 1,
                                   "type": "group",
                                   "item": [
                                     {
                                       "id": "22d34699-dc60-4583-9380-c980a8015c35",
                                       "row": 1,
                                       "col": 1,
                                       "title": "测试结果",
                                       "bizClass": "dqgscs",
                                       "bizField": "jgysy",
                                       "displayType": "required",
                                       "readonly": "false",
                                       "type": "element",
                                       "bzType": "radiogroup",
                                       "defaultValue": "1$^$正常$?$0$^$异常$?$2$^$未测试$?$3$^$无此设备"
                                     },
                                     {
                                       "id": "b20587ec-09fd-4826-b854-849809733786",
                                       "row": 1,
                                       "col": 2,
                                       "title": "问题描述",
                                       "bizClass": "dqgscs",
                                       "bizField": "wtms10",
                                       "displayType": "opitonal",
                                       "readonly": "false",
                                       "type": "element",
                                       "bzType": "textarea"
                                     }
                                   ]
                                 }
                               ]
                             }
                           ]
                         },
                         {
                           "id": "efab858a-3614-429e-931c-7b7f1b64d392",
                           "row": 14,
                           "col": 1,
                           "type": "group",
                           "item": [
                             {
                               "id": "a4bb61ed-9337-482b-b059-a4fb831b179b",
                               "row": 1,
                               "col": 1,
                               "title": "测试项:调度台",
                               "type": "group",
                               "item": [
                                 {
                                   "id": "bdc9f195-d422-4f93-b0c0-9bdf5fc1e1c7",
                                   "row": 1,
                                   "col": 1,
                                   "type": "group",
                                   "item": [
                                     {
                                       "id": "440d9287-c6e4-46e9-8445-1170345c4ee6",
                                       "row": 1,
                                       "col": 1,
                                       "title": "测试结果",
                                       "bizClass": "dqgscs",
                                       "bizField": "ddt",
                                       "displayType": "required",
                                       "readonly": "false",
                                       "type": "element",
                                       "bzType": "radiogroup",
                                       "defaultValue": "1$^$正常$?$0$^$异常$?$2$^$未测试$?$3$^$无此设备"
                                     },
                                     {
                                       "id": "c6148379-cddb-4270-9ac2-d0071743c55c",
                                       "row": 1,
                                       "col": 2,
                                       "title": "问题描述",
                                       "bizClass": "dqgscs",
                                       "bizField": "wtms11",
                                       "displayType": "opitonal",
                                       "readonly": "false",
                                       "type": "element",
                                       "bzType": "textarea"
                                     }
                                   ]
                                 }
                               ]
                             }
                           ]
                         },
                         {
                           "id": "48731752-da7d-43ed-ad4c-0c2719d499f4",
                           "row": 15,
                           "col": 1,
                           "type": "group",
                           "item": [
                             {
                               "id": "978720cf-4f5a-49e8-8f07-d15657c68d37",
                               "row": 1,
                               "col": 1,
                               "title": "测试项:其它",
                               "type": "group",
                               "item": [
                                 {
                                   "id": "6c76c9c8-6d25-4608-a16a-4de22f011571",
                                   "row": 1,
                                   "col": 1,
                                   "type": "group",
                                   "item": [
                                     {
                                       "id": "83371f95-94b5-4bed-bc67-9ddba7226880",
                                       "row": 1,
                                       "col": 1,
                                       "title": "测试内容",
                                       "bizClass": "dqgscs",
                                       "bizField": "dqgsqtnr",
                                       "displayType": "opitonal",
                                       "readonly": "false",
                                       "type": "element",
                                       "bzType": "textarea"
                                     }
                                   ]
                                 },
                                 {
                                   "id": "4b9bae48-9215-49d4-a568-b01e7b1572ed",
                                   "row": 2,
                                   "col": 1,
                                   "type": "group",
                                   "item": [
                                     {
                                       "id": "1c8b46dc-3e75-4bf4-827d-d52b71054338",
                                       "row": 1,
                                       "col": 1,
                                       "title": "测试结果",
                                       "bizClass": "dqgscs",
                                       "bizField": "qt",
                                       "displayType": "opitonal",
                                       "readonly": "false",
                                       "type": "element",
                                       "bzType": "radiogroup",
                                       "defaultValue": "1$^$正常$?$0$^$异常$?$2$^$未测试$?$3$^$无此设备"
                                     },
                                     {
                                       "id": "11b015dc-193f-4747-9c1e-e521c1e318cf",
                                       "row": 1,
                                       "col": 2,
                                       "title": "问题描述",
                                       "bizClass": "dqgscs",
                                       "bizField": "wtms12",
                                       "displayType": "opitonal",
                                       "readonly": "false",
                                       "type": "element",
                                       "bzType": "textarea"
                                     }
                                   ]
                                 }
                               ]
                             }
                           ]
                         },
                         {
                           "id": "51af2986-9483-42ad-9e9a-fcff69e7ad07",
                           "row": 16,
                           "col": 1,
                           "type": "group",
                           "item": [
                             {
                               "id": "16ad9f6c-976d-421f-a294-ea208e1751f8",
                               "row": 1,
                               "col": 1,
                               "title": "附件",
                               "type": "group",
                               "item": [
                                 {
                                   "id": "c2baa399-0f8b-4718-8219-949baa935300",
                                   "row": 1,
                                   "col": 1,
                                   "type": "group",
                                   "item": [
                                     {
                                       "id": "b7687918-d5ee-4dea-99a5-3f0044123bb0",
                                       "row": 1,
                                       "col": 1,
                                       "title": "附件",
                                       "bizClass": "dqgscs",
                                       "bizField": "dqgsfj",
                                       "displayType": "opitonal",
                                       "readonly": "false",
                                       "type": "element",
                                       "bzType": "attachFile",
                                       "value": []
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
                         "id": 45274,
                         "name": "地区公司测试报告填写",
                         "action": [
                           {
                             "id": "Link_4",
                             "name": "测试反馈"
                           }
                         ]
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
                            console.log(t[n].value)
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
                alert('错误'+xhr.status+type+errorThrown)
            },
            complete :function(){
                setTimeout(function(){
                    plus.nativeUI.closeWaiting()
                },500)
            }
        })
        mui.back = function() {
                   plus.webview.currentWebview().hide("auto", 300);
                   fd.delete('file')
                      fd.delete('objId')
                      fd.delete('field')
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
    var jianchar = document.getElementById(jianchar);
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
                     document.getElementById('danweione').setAttribute('data',items[0].id)
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
     var bumen = document.getElementById(bumen);
     var danwei =document.getElementById('danweione');
     bumen.addEventListener('tap', function(event) {
     var evt=event ||window.event
     evt.stopPropagation()
     document.getElementById('jiancharone').value=""
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
    var task = plus.uploader.createUpload( "http://127.0.0.1:10261/itsm/rest/api/v2/itsm/tickets/upload",
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
        alert(JSON.stringify(objData))
          mui.ajax('http://127.0.0.1:10261/itsm/rest/api/v2/itsm/tickets/progressing',{
            data:objData,
            dataType:'json',
            type:'post',
            headers:{'Content-Type':'application/json'},
            success:function(data){
                alert(JSON.stringify(data))
               // mui.back()
               mui.back = function() {
                       var list = plus.webview.getWebviewById('commissionListview')||plus.webview.getLaunchWebview();
                   //触发列表界面的自定义事件（refresh）,从而进行数据刷新
                   alert(JSON.stringify(list))
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
                alert(2332);
            }
        })
    }

}
