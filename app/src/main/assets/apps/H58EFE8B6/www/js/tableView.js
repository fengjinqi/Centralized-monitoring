
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
            getLogin:''

        },
        methods:{
            getTask: function(item){
                var obj={};
                  var check;
                obj.processId=this.id,
                obj.transitionId=item.id,
                obj.taskId=String(this.taskid),
                obj.creator=vm.getLogin,
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
                       // alert(JSON.stringify(obj))
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
                             mui.ajax('http://127.0.0.1:10332/itsm/rest/api/v2/itsm/tickets/progressing',{
                                                data:obj,
                                                dataType:'json',
                                                type:'post',
                                                headers:{'Content-Type':'application/json'},
                                                success:function(data){
                                                    //alert(JSON.stringify(data))
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
                var path=obj.uri.replace(/http:\/\/11.55.0.68:8890/gi,'http:\/\/127.0.0.1:10332');
                var watiting=plus.nativeUI.showWaiting("下载中。。。请稍后");
                //alert(JSON.stringify(decodeURIComponent(path+"&encoding=UTF8")));
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
        vm.getLogin=event.detail.getLogin
        plus.nativeUI.showWaiting( '正在加载' )
        mui.ajax("http://127.0.0.1:10332/itsm/rest/api/v2/itsm/tickets/queryByForm?userId="+vm.getLogin+"&processId="+vm.id,{
            dataType:'json',
            type:'get',
            success:function(res){
/*var res={
            "result": {
                "success": true
            },
            "ticket": {
                "id": "917c1bc6-3255-499a-9ff7-b30ea269ace2",
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
                                        "displayType": "readonly",
                                        "readonly": "false",
                                        "type": "element",
                                        "bzType": "text",
                                        "value": "测试"
                                    }
                                ]
                            },
                            {
                                "id": "556ca7fc-4a84-450b-8338-3d22fb0cff1b",
                                "row": 2,
                                "col": 1,
                                "type": "group",
                                "item": [
                                    {
                                        "id": "a3f3f115-ed07-481a-a957-24af2a31280e",
                                        "row": 1,
                                        "col": 1,
                                        "title": "申请人",
                                        "bizClass": "yjbz",
                                        "bizField": "sqr",
                                        "displayType": "readonly",
                                        "readonly": "false",
                                        "type": "element",
                                        "bzType": "text",
                                        "value": "tx_peixf"
                                    },
                                    {
                                        "id": "81b7f1eb-c406-4060-94a7-6dbfb2e5fbe1",
                                        "row": 1,
                                        "col": 2,
                                        "title": "单位名称",
                                        "bizClass": "yjbz",
                                        "bizField": "dw",
                                        "displayType": "readonly",
                                        "readonly": "false",
                                        "type": "element",
                                        "bzType": "text",
                                        "value": "兰州石化"
                                    }
                                ]
                            },
                            {
                                "id": "25f1f953-5852-4638-af6e-7a40da9b376d",
                                "row": 3,
                                "col": 1,
                                "type": "group",
                                "item": [
                                    {
                                        "id": "eb678c0f-3df2-4e3e-b6bf-cb067c69e2d3",
                                        "row": 1,
                                        "col": 1,
                                        "title": "部门名称",
                                        "bizClass": "yjbz",
                                        "bizField": "bm",
                                        "displayType": "readonly",
                                        "readonly": "false",
                                        "type": "element",
                                        "bzType": "text",
                                        "value": "安全处"
                                    },
                                    {
                                        "id": "6551873b-f065-4373-8837-e2fde7151943",
                                        "row": 1,
                                        "col": 2,
                                        "title": "联系方式",
                                        "bizClass": "yjbz",
                                        "bizField": "lxfs",
                                        "displayType": "readonly",
                                        "readonly": "false",
                                        "type": "element",
                                        "bzType": "text"
                                    }
                                ]
                            },
                            {
                                "id": "a7058a65-7afe-4bc3-b07a-2125b1aa355e",
                                "row": 4,
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
                                        "displayType": "readonly",
                                        "readonly": "false",
                                        "type": "element",
                                        "bzType": "date",
                                        "value": "2018-05-09 09:43",
                                        "dataType": "Date",
                                        "dataFormat": "yyyy-MM-dd HH:mm"
                                    },
                                    {
                                        "id": "e4b42b37-cb25-4854-9a0b-0a7e8562298c",
                                        "row": 1,
                                        "col": 2,
                                        "title": "事件发生地点",
                                        "bizClass": "yjbz",
                                        "bizField": "sjfsdd",
                                        "displayType": "readonly",
                                        "readonly": "false",
                                        "type": "element",
                                        "bzType": "text",
                                        "value": "测试"
                                    }
                                ]
                            },
                            {
                                "id": "fe33e89f-6967-45d8-ba57-52c425b6e5a2",
                                "row": 5,
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
                                        "displayType": "readonly",
                                        "readonly": "false",
                                        "type": "element",
                                        "bzType": "text",
                                        "value": "测试"
                                    }
                                ]
                            },
                            {
                                "id": "68c877b5-05b9-4b1a-8868-500e4a574c60",
                                "row": 6,
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
                                        "displayType": "readonly",
                                        "readonly": "false",
                                        "type": "element",
                                        "bzType": "text",
                                        "value": "测试"
                                    }
                                ]
                            },
                            {
                                "id": "c3dfece2-9093-45bd-b8cb-e795203e6217",
                                "row": 7,
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
                                        "displayType": "readonly",
                                        "readonly": "false",
                                        "type": "element",
                                        "bzType": "select",
                                        "defaultValue": "集团级:default$^$集团级$?$企业级$^$企业级",
                                        "value": "集团级"
                                    }
                                ]
                            },
                            {
                                "id": "5b0db857-ff64-45cc-a9a3-ea4b61cad7e6",
                                "row": 8,
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
                                        "displayType": "readonly",
                                        "readonly": "false",
                                        "type": "element",
                                        "bzType": "textarea",
                                        "value": "测试"
                                    }
                                ]
                            },
                            {
                                "id": "a0037a89-50a9-4ce5-b34d-10cc9d8ad747",
                                "row": 9,
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
                                        "displayType": "readonly",
                                        "readonly": "false",
                                        "type": "element",
                                        "bzType": "textarea",
                                        "value": "测试"
                                    }
                                ]
                            },
                            {
                                "id": "86a047a0-0d53-40c7-98a4-61f4697c2e6b",
                                "row": 10,
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
                        "id": "6584f9f7-c679-44f8-8cb4-e195bfe09e8f",
                        "row": 2,
                        "col": 1,
                        "type": "group",
                        "item": [
                            {
                                "id": "f6ebca82-0175-4a1b-9191-57c0eb03e070",
                                "row": 1,
                                "col": 1,
                                "title": "保障中心审批",
                                "type": "group",
                                "item": [
                                    {
                                        "id": "d0a49b15-357c-400d-a74e-db76d7676701",
                                        "row": 1,
                                        "col": 1,
                                        "type": "group",
                                        "item": [
                                            {
                                                "id": "e343d84f-fe63-46a8-93ac-3122a6e092af",
                                                "row": 1,
                                                "col": 1,
                                                "title": "审批人",
                                                "bizClass": "yjbz",
                                                "bizField": "spr",
                                                "displayType": "readonly",
                                                "readonly": "false",
                                                "type": "element",
                                                "bzType": "text",
                                                "value": "tx_cxb"
                                            },
                                            {
                                                "id": "c0aeee5a-c05b-46a5-bf3f-5efba2d06dc6",
                                                "row": 1,
                                                "col": 2,
                                                "title": "审批部门",
                                                "bizClass": "yjbz",
                                                "bizField": "spbm",
                                                "displayType": "readonly",
                                                "readonly": "false",
                                                "type": "element",
                                                "bzType": "text",
                                                "value": "应急通信保障中心"
                                            },
                                            {
                                                "id": "9b288aaf-71f5-4e3c-bf2d-4542a813ba24",
                                                "row": 1,
                                                "col": 3,
                                                "title": "审批时间",
                                                "bizClass": "yjbz",
                                                "bizField": "sptime",
                                                "displayType": "readonly",
                                                "readonly": "false",
                                                "type": "element",
                                                "bzType": "date",
                                                "value": "2018-05-09 09:42",
                                                "dataType": "Date",
                                                "dataFormat": "yyyy-MM-dd HH:mm"
                                            }
                                        ]
                                    },
                                    {
                                        "id": "d8b33bb4-a768-4237-8437-e08ca6cb197b",
                                        "row": 2,
                                        "col": 1,
                                        "type": "group",
                                        "item": [
                                            {
                                                "id": "17d572b6-9b65-4590-af6d-77df2333670a",
                                                "row": 1,
                                                "col": 1,
                                                "title": "审批意见",
                                                "bizClass": "yjbz",
                                                "bizField": "spyj",
                                                "displayType": "readonly",
                                                "readonly": "false",
                                                "type": "element",
                                                "bzType": "textarea",
                                                "value": "aggGDSGg"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "id": "f19dcfae-7413-4c20-b851-f31365a88858",
                        "row": 3,
                        "col": 1,
                        "type": "group",
                        "item": [
                            {
                                "id": "20b73a3d-798f-4535-aef3-12e031f648ac",
                                "row": 1,
                                "col": 1,
                                "title": "地区公司总结",
                                "type": "group",
                                "item": [
                                    {
                                        "id": "c830962c-80e6-49ab-806c-5bd27cf176ed",
                                        "row": 1,
                                        "col": 1,
                                        "type": "group",
                                        "item": [
                                            {
                                                "id": "bf8447e1-95d6-4820-9eda-cf5daebad3c3",
                                                "row": 1,
                                                "col": 1,
                                                "title": "处理人",
                                                "bizClass": "yjbz",
                                                "bizField": "dqgsclr",
                                                "displayType": "readonly",
                                                "readonly": "false",
                                                "type": "element",
                                                "bzType": "text",
                                                "value": "tx_peixf"
                                            },
                                            {
                                                "id": "761011e4-0292-47db-802b-542913384ece",
                                                "row": 1,
                                                "col": 2,
                                                "title": "单位",
                                                "bizClass": "yjbz",
                                                "bizField": "dqgsclrdw",
                                                "displayType": "readonly",
                                                "readonly": "false",
                                                "type": "element",
                                                "bzType": "text",
                                                "value": "兰州石化"
                                            },
                                            {
                                                "id": "422ee0cf-49cf-4254-bf9e-79abc4f49578",
                                                "row": 1,
                                                "col": 3,
                                                "title": "时间",
                                                "bizClass": "yjbz",
                                                "bizField": "dqgsclsj",
                                                "displayType": "readonly",
                                                "readonly": "false",
                                                "type": "element",
                                                "bzType": "date",
                                                "value": "2018-05-09 09:43",
                                                "dataType": "Date",
                                                "dataFormat": "yyyy-MM-dd HH:mm"
                                            }
                                        ]
                                    },
                                    {
                                        "id": "c97d1d41-833c-4b65-af39-e5e9687ab520",
                                        "row": 2,
                                        "col": 1,
                                        "type": "group",
                                        "item": [
                                            {
                                                "id": "3ac24543-6908-4ad5-a000-96a8341726e1",
                                                "row": 1,
                                                "col": 1,
                                                "title": "应急保障任务完成情况",
                                                "bizClass": "yjbz",
                                                "bizField": "yjbzrwwcqk",
                                                "displayType": "readonly",
                                                "readonly": "false",
                                                "type": "element",
                                                "bzType": "select",
                                                "defaultValue": "0$^$任务完成$?$1$^$任务未完成",
                                                "value": "0",
                                                "dispValue": "任务完成"
                                            },
                                            {
                                                "id": "4a183761-68e4-463a-b465-edab98c2e469",
                                                "row": 1,
                                                "col": 2,
                                                "title": "事件结束时间",
                                                "bizClass": "yjbz",
                                                "bizField": "sjjssj",
                                                "displayType": "readonly",
                                                "readonly": "false",
                                                "type": "element",
                                                "bzType": "date",
                                                "value": "2018-05-09 09:43",
                                                "dataType": "Date",
                                                "dataFormat": "yyyy-MM-dd HH:mm"
                                            }
                                        ]
                                    },
                                    {
                                        "id": "bef97e93-bcf4-4987-a672-5e7125802805",
                                        "row": 3,
                                        "col": 1,
                                        "type": "group",
                                        "item": [
                                            {
                                                "id": "39670329-e1eb-4bfa-8abf-2993ff4ea7d7",
                                                "row": 1,
                                                "col": 1,
                                                "title": "应急事件总结",
                                                "bizClass": "yjbz",
                                                "bizField": "dqgsyjsjzj",
                                                "displayType": "readonly",
                                                "readonly": "false",
                                                "type": "element",
                                                "bzType": "textarea",
                                                "value": "测试"
                                            }
                                        ]
                                    },
                                    {
                                        "id": "6c371f01-49e8-41a9-9553-7b0488a87ae5",
                                        "row": 4,
                                        "col": 1,
                                        "type": "group",
                                        "item": [
                                            {
                                                "id": "b503f4cc-41a2-4e15-aee6-f7b6ed9bc541",
                                                "row": 1,
                                                "col": 1,
                                                "title": "附件",
                                                "bizClass": "yjbz",
                                                "bizField": "fj1",
                                                "displayType": "readonly",
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
                    },
                    {
                        "id": "b81e496b-64a0-4ce7-a9b0-323e67179cc6",
                        "row": 4,
                        "col": 1,
                        "type": "group",
                        "item": [
                            {
                                "id": "bc675d18-368f-4f2d-beee-7efaffaeaa16",
                                "row": 1,
                                "col": 1,
                                "title": "保障中心归档",
                                "type": "group",
                                "item": [
                                    {
                                        "id": "c03b8769-65cd-4c44-90b0-2c04ee210ecf",
                                        "row": 1,
                                        "col": 1,
                                        "type": "group",
                                        "item": [
                                            {
                                                "id": "0ed9b00b-3462-408a-8192-1ffc870b9162",
                                                "row": 1,
                                                "col": 1,
                                                "title": "归档人",
                                                "bizClass": "yjbz",
                                                "bizField": "gdr",
                                                "displayType": "readonly",
                                                "readonly": "false",
                                                "type": "element",
                                                "bzType": "text",
                                                "value": "tx_cxb"
                                            },
                                            {
                                                "id": "eda49f6e-cc4c-4009-922e-2a576556a366",
                                                "row": 1,
                                                "col": 2,
                                                "title": "部门",
                                                "bizClass": "yjbz",
                                                "bizField": "gdbm",
                                                "displayType": "readonly",
                                                "readonly": "false",
                                                "type": "element",
                                                "bzType": "text",
                                                "value": "应急通信保障中心"
                                            },
                                            {
                                                "id": "300c3f12-ccd0-4eaf-af56-6917923e6613",
                                                "row": 1,
                                                "col": 3,
                                                "title": "时间",
                                                "bizClass": "yjbz",
                                                "bizField": "gdsj",
                                                "displayType": "readonly",
                                                "readonly": "false",
                                                "type": "element",
                                                "bzType": "date",
                                                "value": "2018-05-09 09:43",
                                                "dataType": "Date",
                                                "dataFormat": "yyyy-MM-dd HH:mm"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "id": "80390574-5d46-494d-9e30-7a528faf18f4",
                        "row": 5,
                        "col": 1,
                        "title": "流程信息",
                        "type": "group",
                        "item": [
                            {
                                "id": "f0cc48d7-edf6-4b14-bafa-d1e2f65d878a",
                                "row": 1,
                                "col": 1,
                                "type": "group",
                                "item": [
                                    {
                                        "id": "c3230c57-cca1-420a-9473-0782dfd1fcb3",
                                        "row": 1,
                                        "col": 1,
                                        "title": "流程记录",
                                        "bizClass": "processObject",
                                        "bizField": "processRecord",
                                        "displayType": "readonly",
                                        "readonly": "true",
                                        "type": "element",
                                        "bzType": "processObject"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            "task": []
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
                    //console.log("=="+st[0]+"==");
                    if(st[0].endWith(":default")){

                        if(contains(sValue, st[0].trim().substring(0,(st[0].length - 8)))){
                            re_str = '{"value" : "' + st[0].substring(0,(st[0].length - 8)) + '","name" : "' + st[1] + '","default" : true,"selected" : true}';
                        }else{
                            re_str = '{"value" : "' + st[0].substring(0,(st[0].length - 8)) + '","name" : "' + st[1] + '","default" : true,"selected" : false}';
                        }
                    }else{

                       // if(t[n].bzType=='radiogroup'){
                         // re_str = '{"value" : "' + st[0] + '","name" : "' + st[1] + '","default" : false,"selected" : true}';

                       // }else{
                            if(contains(sValue, st[0].trim())){

                                re_str = '{"value" : "' + st[0] + '","name" : "' + st[1] + '","default" : false,"selected" : true}';
                            }else{

                                re_str = '{"value" : "' + st[0] + '","name" : "' + st[1] + '","default" : false,"selected" : false}';
                            }
                      //  }

                    }
                    re_str = eval('(' + re_str + ')');

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
                plus.nativeUI.closeWaiting()



           /* var task=res.task[0];
            for(var n in task.action){
        vm.task.push(task.action[n])
        if(task.action[n].hasOwnProperty("performer")&&Array.isArray(task.action[n].performer)&&task.action[n].name==='交班'){
            for(var j in task.action[n].performer){
                console.log(task.action[n].performer[j])
            }
        }
    }*/
            vm.taskid=task.id

           },
            error:function(xhr,type,errorThrown){
               mui.alert("网络错误")
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

  /*
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
                mui.alert("网络错误")
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
                    mui.alert("网络错误")
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
                    mui.alert("网络错误")
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

}*/