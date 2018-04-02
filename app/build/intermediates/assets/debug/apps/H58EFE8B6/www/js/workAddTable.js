function getTime(obj){
    var picker = new mui.DtPicker({
             "type": "datatime",
             beginDate: new Date(1990, 04, 25),//设置开始日期
            endDate: new Date(2099, 04, 25),//设置结束日期
        });
        picker.show(function(rs) {
           // alert(rs.y.value+"-"+rs.m.value+"-"+rs.d.value+' '+rs.h.value+':'+rs.i.value)
            /*
             * rs.value 拼合后的 value
             * rs.text 拼合后的 text
             * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
             * rs.m 月，用法同年
             * rs.d 日，用法同年
             * rs.h 时，用法同年
             * rs.i 分（minutes 的第二个字母），用法同年
             */
            obj.value =rs.y.value+"-"+rs.m.value+"-"+rs.d.value+' '+rs.h.value+':'+rs.i.value;
            /*
             * 返回 false 可以阻止选择框的关闭
             * return false;
             */
            /*
             * 释放组件资源，释放后将将不能再操作组件
             * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
             * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
             * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
             */
            picker.dispose();
        });
}

// 从相册中选择多张图片
function galleryImgs(){
	// 从相册中选择图片
	console.log("从相册中选择多张图片:");
    plus.gallery.pick( function(e){
    	console.log(e)
    	for(var i in e.files){
	    	console.log(e.files[i]);
    	}
    	mui('#popover').popover('hide');
    }, function ( e ) {
    	console.log( "取消选择图片" );
    	mui('#popover').popover('hide');
    },{filter:"none", system:true,multiple:false});
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

var fd;
fd = new FormData();
var objData;
objData={}
var vm=new Vue({
    el:'#root',
    data:{
        dataType:'yjbzgl',
        guid:'',
        validate:'validate',
        author:'zxgd',
        validaTetable:'validaTetable',
        items:[],
        task:[],
        fileArray:[],
        id:'',
        cover:'',
        bizClass:'',
        field:'',
        fieIdCode:'',
        getLogin:''
    },
     methods:{
         commintData:function(item){
            var watiting=plus.nativeUI.showWaiting('提交中...')
            mui.ajax('http://127.0.0.1:10261/itsm/rest/api/v2/itsm/tickets/create',{
                 data:item,
                 dataType:'json',
                 type:'post',
                 headers:{'Content-Type':'application/json'},
                 success:function(data){
                     if(data.success==true){
                         if(fd.getAll('file').length>0){
                             this.id=data.id
                             fd.append("objId",this.id)
                             fd.append("field",vm.field+vm.fieIdCode)
                             //alert(JSON.stringify(fd.getAll('file')))
                             //alert(JSON.stringify(this.id)+"--"+JSON.stringify(this.field)+"--"+JSON.stringify(vm.field))
                             console.log(JSON.stringify(fd.get('file').name))
                             watiting.setTitle("正在上传附件请稍后...")
                             mui.ajax('http://127.0.0.1:10261/itsm/rest/api/v2/itsm/tickets/upload',{
                                 data:fd,
                                 type:'post',
                                 processData: false,
                                 contentType: false,
                                 success:function(data){
                                     var data=JSON.parse(data)
                                    // alert(JSON.stringify(data))
                                     if(data.success){
                                         mui.alert("附件上传成功")
                                         watiting.close()
                                        mui.back()
                                     }else{
                                         mui.alert("附件上传失败")
                                         watiting.close()
                                          mui.back()
                                     }
                                 },
                                 error:function(xhr,type,errorThrown){
                                     //异常处理；
                                     alert(2332);
                                 }
                             })

                         }else{
                             plus.nativeUI.toast( "工单创建成功")
                             watiting.close()
                             mui.back()
                         }
                        /* if(document.querySelectorAll('.uploadfj').length>0){
                             var uploadfj=document.querySelectorAll('.uploadfj');
                             for(var i=0;i<uploadfj.length;i++){
                                 alert(JSON.stringify(uploadfj[i].files[0]))
                                 if(uploadfj[i].files[0]!=undefined){
                                     this.id=data.id
                                     fd.append("objId",this.id)
                                     fd.append("field",vm.field)
                                     alert(JSON.stringify(fd.getAll('file')))
                                     alert(JSON.stringify(this.id)+"--"+JSON.stringify(this.field)+"--"+JSON.stringify(vm.field))
                                     console.log(JSON.stringify(fd.get('file').name))
                                     watiting.setTitle("正在上传附件请稍后...")
                                     mui.ajax('http://127.0.0.1:10261/itsm/rest/api/v2/itsm/tickets/upload',{
                                         data:fd,
                                         type:'post',
                                         processData: false,
                                         contentType: false,
                                         success:function(data){
                                             var data=JSON.parse(data)
                                             alert(JSON.stringify(data))
                                             if(data.success){
                                                 mui.alert("附件上传成功")
                                                 watiting.close()
                                                mui.back()
                                             }else{
                                                 mui.alert("附件上传失败")
                                                 watiting.close()
                                                  mui.back()
                                             }
                                         },
                                         error:function(xhr,type,errorThrown){
                                             //异常处理；
                                             alert(2332);
                                         }
                                     })
                                 }else{
                                     plus.nativeUI.toast( "工单创建成功")
                                     watiting.close()
                                     mui.back()
                                 }
                             }
                         }else{
                         alert("554")
                              plus.nativeUI.toast( "工单创建成功")
                              watiting.close()
                              mui.back()
                         }*/
                     }else{
                          plus.nativeUI.toast( "工单创建失败");
                          watiting.close()
                          mui.back()
                     }
                     //alert(JSON.stringify(data))

                    mui.back = function() {
                            plus.webview.currentWebview().hide("auto", 300);
                            var self = plus.webview.currentWebview();
                            //confirm()
                            self.addEventListener("hide",function (e) {
                                vm.dataType='',
                                vm.cover='',
                                vm.guid="",
                                vm.items=[],
                                vm.task=[],
                                fd.delete('objId'),
                                fd.delete('field'),
                                fd.delete('file')

                            },false);
                        }

                 },
                 error:function(xhr,type,errorThrown){
                     //异常处理；
                     alert(2332);
                 }
             })

         },
         getTask: function(item){
            var obj={};
            var check;
            var checkArr;
            var yjbzgl=false;
            objData.moduleId=vm.dataType,
            objData.processName=vm.cover,
            objData.bizClass=vm.bizClass,
            objData.transitionId=item.id,
            objData.startNodeId="Start",
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

                    //alert(JSON.stringify(objData))
                    var a = false;
                     var b = false;
           mui("#form1 .validaTetable").each(function() {
                //若当前input为空，则alert提醒
                 a = true;
                if(!this.value || this.value.trim() == "") {
                    var label = this.previousElementSibling;
                    mui.alert("必填项不允许为空");
                    checkArr = false;
                    return false;
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
            if(v.length==count){
                yjbzgl=true
            }else{
                mui.alert("必填项不允许为空");
                yjbzgl=false;
                return;
            }
            console.log(yjbzgl)
            console.log(checkArr)
            console.log(a)
            console.log(b)
            if(a && b){
                if(yjbzgl&&checkArr){
                //alert('都执行')
                   this.commintData(objData);

                }
            }else if(a){
               if(checkArr){
                //alert('执行文本')
                       this.commintData(objData)
               }
            }else if(b){
                if(yjbzgl){
                // alert('执行复选')
                        this.commintData(objData)
                }
             }
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
         }
      }
})



function Gareth(){
    mui('#popover').popover('show');
}

window.onload=function(){
    if(document.getElementById('openPopover')){
       document.getElementById('openPopover').addEventListener('click',function(evt){
       	    var evt=window.event||evt
               evt.stopPropagation()
       		mui('#popover').popover('show');
       	})
    }
	if(document.getElementById('pover')){
	    document.getElementById('pover').addEventListener('click',function(evt){
            var evt=window.event||evt
            evt.stopPropagation()
    		mui('#popover').popover('show');
    	})
	}


  /*  document.querySelector('.Album').addEventListener('tap',function(evt){
        var evt=window.event||evt
                evt.stopPropagation()
        galleryImgs()
    })
    document.querySelector('.Photograph').addEventListener('tap',function(evt){
           var evt=window.event||evt
           evt.stopPropagation()
           getImage()
    })
    document.querySelector('.video').addEventListener('tap',function(evt){
           var evt=window.event||evt
           evt.stopPropagation()
           getVideo()
     })*/
}


window.addEventListener('get_detail',function(event){

  vm.guid= event.detail.guid;
  vm.dataType=event.detail.author;
  vm.cover=event.detail.cover;
  vm.bizClass=event.detail.bizClass,
 vm.getLogin=event.detail.getLogin
 //alert(vm.getLogin)
    //alert(vm.guid)
    //alert(vm.dataType)
  vm.field=event.detail.field
  plus.nativeUI.showWaiting( '正在加载' )
  mui.ajax("http://127.0.0.1:10261/itsm/rest/api/v2/itsm/tickets/getTicketForm?userId="+vm.getLogin+"&processName="+vm.cover+"&startNodeId=Start",{
    dataType:'json',
    type:'get',
    success:function(res){
    alert(JSON.stringify(res))
    if(res.success==false){
        mui.alert('未查询到用户')
         plus.nativeUI.closeWaiting()
    }
     /* var res={
                "result": {
                  "success": true
                },
                "ticket": {
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
                              "type": "text"
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
                              "type": "userSelect"
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
                              "type": "date"
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
                              "type": "text"
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
                              "type": "text"
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
                              "type": "text"
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
                              "type": "select",
                              "defaultValue": "集团级:default$^$集团级$?$企业级$^$企业级"
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
                              "type": "textarea"
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
                              "type": "attachFile"
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
                              "type": "textarea"
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
                                  "type": "text"
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
                                  "type": "date"
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
                                  "type": "textarea"
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                "action": [
                  {
                    "id": "Link_3",
                    "name": "保存"
                  },
                  {
                    "id": "Link_5",
                    "name": "提交"
                  }
                ]
              }*/
//处理数据格式
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
                    bzType:item.item[i].type,
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
//解决&？&
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
            if((t[n].value).indexOf(',') >= 0){
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
    for(var i=0;i<vm.items.length;i++){

            if(vm.items[i].title.indexOf("附件")>=0){
                   vm.fieIdCode=vm.items[i].bizField
            }
        }
    //alert(JSON.stringify(vm.items))
    console.log(vm.items)
    //var task=res.task[0];
    vm.task=res.action
    /* for(var n in task.action){
    vm.task.push(task.action[n])
    if(task.action[n].hasOwnProperty("performer")&&Array.isArray(task.action[n].performer)&&task.action[n].name==='交班'){
        for(var j in task.action[n].performer){
            console.log(task.action[n].performer[j])
        }
    }
    }
    vm.taskid=task.id*/
   // alert(JSON.stringify(vm.items))



   },
    error:function(xhr,type,errorThrown){
        alert('错误'+xhr.status+type+errorThrown)
    },
 complete :function(){
     setTimeout(function(){
         plus.nativeUI.closeWaiting()
     },1000)
 }
})

})

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
            document.querySelector('.obj').value=document.getElementById('jianchar').value;
            document.querySelector('.obj').setAttribute('data-id',document.getElementById('jianchar').getAttribute('data'))
            document.getElementById('mui-backdrop').style.display='none';
            document.getElementById('bumen').value="";
            document.getElementById('jianchar').value="";
            document.getElementById('danwei').value="";
        }

    }



mui.back = function() {
				plus.webview.currentWebview().hide("auto", 300);
				var self = plus.webview.currentWebview();
				close()
				self.addEventListener("hide",function (e) {
				    vm.items='',
                    vm.task='',
                    fd.delete('objId'),
                   fd.delete('field'),
                   fd.delete('file')
				},false);
			}