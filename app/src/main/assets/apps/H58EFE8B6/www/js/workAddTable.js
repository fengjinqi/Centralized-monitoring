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
        dataType:'sbxjjl1',
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
        getLogin:'',
        nameId:'',
        names:''
    },
     methods:{
         commintData:function(item){
            var watiting=plus.nativeUI.showWaiting('提交中...')
            alert(JSON.stringify(item))
            mui.ajax('http://127.0.0.1:10332/itsm/rest/api/v2/itsm/tickets/create',{
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
                             mui.ajax('http://127.0.0.1:10332/itsm/rest/api/v2/itsm/tickets/upload',{
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
                     alert(JSON.stringify(data))
                          plus.nativeUI.toast( data.message=='权限不足!'?data.message:'工单创建失败');
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

                     alert("与大厅连接中断,请退出APP重新进入大厅唤醒")
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
            objData.creator=vm.nameId,//vm.getLogin,
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
                        objData.bizObj[checked[i].name] += '$?$' + checked[i].value;
                      }else{
                        objData.bizObj[checked[i].name] = '$?$' + checked[i].value;
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
                    console.log(check[i][j])
                        count++;
                        b = true;
                    }
                }
            }
            console.log(v.length)
            console.log(count)
            if(v.length==count||v.length<=count){
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
 var n=event.detail.getLogin.substring(5)
 //alert(vm.getLogin)
    //alert(vm.guid)
    //alert(vm.dataType)
  vm.field=event.detail.field
  plus.nativeUI.showWaiting( '正在加载' )

  mui.ajax("http://127.0.0.1:10332/itsm/rest/api/v2/acm/user/getOrgByUser?userId="+vm.getLogin,{

    dataType:'json',
    type:'get',
    success:function(res){

        mui.ajax("http://127.0.0.1:10332/itsm/rest/api/v2/acm/user/?deptId="+res.data.DEPTID,{

            dataType:'json',
            type:'get',
            success:function(data){

            for(var i=0;i<data.data.length;i++){

                if(data.data[i].account.indexOf(n)>-1){
                    vm.nameId=data.data[i].id
                    vm.names=data.data[i].name
                }
            }


            },
            error:function(err){

            }
          })
    },
    error:function(err){

    }
  })

  mui.ajax("http://127.0.0.1:10332/itsm/rest/api/v2/itsm/tickets/getTicketForm?userId="+vm.getLogin+"&processName="+vm.cover+"&startNodeId=Start",{
    dataType:'json',
    type:'get',
    success:function(res){

        if(res.success==false){
            mui.alert('未查询到用户')
             plus.nativeUI.closeWaiting()
        }
//      var res={
//                  "result": {
//                      "success": true
//                  },
//                  "ticket": {
//                      "data": [
//                          {
//                              "id": "d5dcc577-69b6-4128-b257-c1aacbbcdd8a",
//                              "row": 1,
//                              "col": 1,
//                              "type": "group",
//                              "item": [
//                                  {
//                                      "id": "3945c088-d849-4205-a082-0ac827198b40",
//                                      "row": 1,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "dfd23b1b-6d1b-4b09-a7d2-4fcf3fb6cd22",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "创建人",
//                                              "bizClass": "processObject",
//                                              "bizField": "creatorId",
//                                              "displayType": "readonly",
//                                              "readonly": "true",
//                                              "type": "userSelect"
//                                          },
//                                          {
//                                              "id": "1d97fcec-e0e7-4cb9-b913-df7102bf3276",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "创建时间",
//                                              "bizClass": "processObject",
//                                              "bizField": "createTime",
//                                              "displayType": "readonly",
//                                              "readonly": "true",
//                                              "type": "date"
//                                          },
//                                          {
//                                              "id": "f11b8e24-c590-4c83-b399-904f11291dc7",
//                                              "row": 1,
//                                              "col": 3,
//                                              "title": "当前处理人",
//                                              "bizClass": "processObject",
//                                              "bizField": "currentActors",
//                                              "displayType": "readonly",
//                                              "readonly": "true",
//                                              "type": "text"
//                                          }
//                                      ]
//                                  }
//                              ]
//                          },
//                          {
//                              "id": "644b8640-9d18-44ec-9145-8683c2b62637",
//                              "row": 2,
//                              "col": 1,
//                              "title": "基本信息",
//                              "type": "group",
//                              "item": [
//                                  {
//                                      "id": "6ef7117d-7566-41b6-8b12-2aa02b60a6bc",
//                                      "row": 1,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "96518611-af22-4bd3-ae17-5da6773014f0",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "检查人员",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcry",
//                                              "displayType": "readonly",
//                                              "readonly": "false",
//                                              "type": "text"
//                                          },
//                                          {
//                                              "id": "4aa00a7a-e144-45eb-8c93-de61fc90f916",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "单位名称",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "dw",
//                                              "displayType": "readonly",
//                                              "readonly": "false",
//                                              "type": "text"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "71d49c41-eefe-4c59-861a-19fb663494f0",
//                                      "row": 2,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "ebf52d92-082e-4c55-b51c-1972625bab6e",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "部门名称",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "bm",
//                                              "displayType": "readonly",
//                                              "readonly": "false",
//                                              "type": "text"
//                                          },
//                                          {
//                                              "id": "948889c7-496e-40ec-b968-54d4ef81f935",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "联系方式",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "lxfs",
//                                              "displayType": "readonly",
//                                              "readonly": "false",
//                                              "type": "text"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "f091a8d8-4863-4da4-8654-320451aab7b5",
//                                      "row": 3,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "4c1773ef-2efe-4f07-a5ca-284bd6b5d696",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "检查地点",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcdd",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "text"
//                                          },
//                                          {
//                                              "id": "1ca07359-4183-41c9-862c-9121a50cefdf",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "检查日期",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcrq",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "date"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "93dc54a1-032f-43d6-b4c7-9c24245bb8d1",
//                                      "row": 4,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "51acae93-0058-4f53-a63d-c7aa6ebe5871",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "检查车辆",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jccl",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "text"
//                                          }
//                                      ]
//                                  }
//                              ]
//                          },
//                          {
//                              "id": "da9aaea7-83d0-46ff-b830-02b5b65c4296",
//                              "row": 3,
//                              "col": 1,
//                              "title": "车载卫星天线子系统",
//                              "type": "group",
//                              "item": [
//                                  {
//                                      "id": "6ad37a1f-2020-40d6-a5dc-a1752398f824",
//                                      "row": 1,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "a2c90e20-d52a-41be-a6ab-8ce33be0d4d7",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "1.2米静中通卫星天线检查项目：收藏操作状态",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm1",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "3a9f8312-8e36-4245-9296-b39b4509f1f0",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "d4ea776c-0d55-4c70-9cf5-0cd7f7028eda",
//                                      "row": 2,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "b053660c-5f51-4bf2-a52a-7286f2baab9e",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "天线控制器检查项目：设备工作与显示数值是否正常",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm2",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "d8c670a7-9085-4f99-a4bb-153013f417aa",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms2",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "25161782-dde0-4c0f-ad24-5aa38eb9f24b",
//                                      "row": 3,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "24339655-d7e6-4651-9609-fc6a3d26421f",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "功率放大器检查项目：工作运行状态",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm3",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "df48214a-5f40-40b8-be8c-a59d81c190cb",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms3",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "2ca109e9-6c97-44a3-9a49-81e7b281c2bd",
//                                      "row": 4,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "9a61ff75-b67e-4055-86f1-c60ab60d4a4e",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "LNB检查项目：接收数值是否正常",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm4",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "5099b586-092c-40e0-837e-8da90f7bed3e",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms4",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "bb337030-f14b-4f0a-b52f-9a827ecfbe38",
//                                      "row": 5,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "94cc37e8-2551-42a6-816d-2a270b5f854e",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "卫星调制解调器（iDirect）检查项目：各指示灯工作状态",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm5",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "be3e1e64-284e-4534-a029-691a1f027ba3",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms5",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "509f8fc6-969b-4ca7-900b-e25086415df9",
//                                      "row": 6,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "67995574-f2bc-409f-9318-04c8fb9b82fd",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "卫星调制解调器（Linkstar）检查项目：各指示灯工作状态",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm6",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "c315b6cb-2749-4a40-a5d5-905029c5ad71",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms6",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  }
//                              ]
//                          },
//                          {
//                              "id": "5ec55668-518d-4ed9-80be-c0251ea499a6",
//                              "row": 4,
//                              "col": 1,
//                              "title": "综合接入子系统",
//                              "type": "group",
//                              "item": [
//                                  {
//                                      "id": "8e716b33-6a8b-4366-a4a6-41100faa478a",
//                                      "row": 1,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "78029d32-b5a2-4c7c-9fab-f59e55a3ccba",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "FA300语音网关检查项目：各指示灯工作状态",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm7",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "b3de2208-c2ad-41ff-99dd-8495be5112d9",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms7",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "e5a9b23f-c8d7-4aa7-8711-e5fbef6e4289",
//                                      "row": 2,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "49cc67a3-bbc7-47a4-8216-b795decc7356",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "FA300编码器检查项目：各指示灯工作状态",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm8",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "ee5d6f14-9f9c-4669-92c0-b4219390ad93",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms8",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "fbc26cd6-b9f4-47df-8926-8a99028c9424",
//                                      "row": 3,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "24a3b595-37e1-4af1-85bd-b6edba8c3894",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "FA300无线AP检查项目：各指示灯工作状态",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm9",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "17a8fd9a-d8a1-4be3-bdea-0cbe8bbed44d",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms9",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  }
//                              ]
//                          },
//                          {
//                              "id": "b83e472a-10bc-4999-882d-c8e7a2d69b21",
//                              "row": 5,
//                              "col": 1,
//                              "title": "视频子系统",
//                              "type": "group",
//                              "item": [
//                                  {
//                                      "id": "855aef2e-ded9-4ae5-9c6e-459121e828b7",
//                                      "row": 1,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "13d09aae-d83e-48af-802f-caf602f37405",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "视频会议设备检查项目：工作是否正常",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm10",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "810b808c-8ab7-45f4-9786-aa4cc196ee74",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms10",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "7142bcd1-a28b-41bd-ae7c-2a22ad7db34d",
//                                      "row": 2,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "a4be6bf7-7c98-4252-a36a-851a57ea80cc",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "高清视频编码器检查项目：工作是否正常",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm11",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "9f5d730b-fed9-4c85-ab7a-325f0829feb6",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms11",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "38917398-ed25-42a5-9256-9042da5b0d9b",
//                                      "row": 3,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "d0518233-253f-44ec-bfd2-3f10837dfb08",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "硬盘录像机检查项目：工作是否正常",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm12",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "519f455b-0253-4525-b834-6af78ab06300",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms12",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "4de27ece-5874-4879-8deb-a78de9e06db3",
//                                      "row": 4,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "5394bb0c-4284-436f-99ff-fd07a707734d",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "标清发射机检查项目：设备运行情况",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm13",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "6d1f924c-07c9-4157-9ed8-223fdbc78c57",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms13",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "4af46f1a-11ca-49c1-a894-4cc445200c21",
//                                      "row": 5,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "f3d0ced7-5fe2-4ef9-b180-c05653253826",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "标清接收机检查项目：图像接收情况",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm14",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "5d4492ba-2c36-4eb9-b797-94ecca3af472",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms14",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "21d9dca6-9e78-4eaf-9db7-cf8ffd25eeb9",
//                                      "row": 6,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "0456beb0-e19d-4fde-b943-1d2e2c84535a",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "高清发射机检查项目：设备运行情况",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm15",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "18776d96-7efc-4b39-bf70-5f00e1346ef1",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms15",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "6f83f0e4-9a2c-4c8d-b68e-af36fd135512",
//                                      "row": 7,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "06ed6a36-212c-4fc6-8110-a2337e1941be",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "高清接收机检查项目：图像接收情况",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm16",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "5e874cff-4c7f-46b9-9390-478f326a06ab",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms16",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  }
//                              ]
//                          },
//                          {
//                              "id": "de927d94-696d-4ab7-af12-4ecb06d152a5",
//                              "row": 6,
//                              "col": 1,
//                              "title": "发电子系统",
//                              "type": "group",
//                              "item": [
//                                  {
//                                      "id": "2df8fbe8-0fd3-4c60-8e8d-e1a3f327cd05",
//                                      "row": 1,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "790f4609-f4eb-4888-9a84-c39b47452ce3",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "取力发电机检查项目：设备运行情况",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm17",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "583966bf-c645-4434-993a-1a00139b162a",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms17",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "06c9389b-d6de-4765-b304-f222b87b163d",
//                                      "row": 2,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "af18a251-b4a2-4843-945f-9e08af7639a6",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "柴油发电机检查项目：设备运行情况",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm18",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "605a01c2-7582-49bd-bc47-a9397568f7e6",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms18",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  }
//                              ]
//                          },
//                          {
//                              "id": "bfdf925b-0da6-4857-813e-0dff3b2cc1e5",
//                              "row": 7,
//                              "col": 1,
//                              "title": "辅助子系统",
//                              "type": "group",
//                              "item": [
//                                  {
//                                      "id": "eff9c11e-b113-4097-99f8-0d36b4eb2703",
//                                      "row": 1,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "f8863202-1cd1-40d9-a747-cae7e0fb04a9",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "单兵防爆摄像机检查项目：摄像功能情况",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm19",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "5ac2817c-5bb0-4973-b134-d7ccb8765766",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms19",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "79a24fc5-c9c4-4b07-bb60-35f403fd1299",
//                                      "row": 2,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "2ae949bd-144b-4019-bc21-bdb63fcdca04",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "车顶摄像机检查项目：设备运行情况",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm20",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "698457d2-df19-405a-a7f7-13575a84274a",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms20",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "9a895ed4-95b8-4629-a3ff-361767ade548",
//                                      "row": 3,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "9a219937-29eb-47f2-898a-6ed6bd3a9f9e",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "激光夜视仪检查项目：设备运行情况",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm21",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "a9ff869d-29f6-4f9c-889f-62960375c15c",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms21",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "0ee10eea-585a-4516-9907-b109ec611c49",
//                                      "row": 4,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "2ac44d3c-d4a2-4e8c-9db0-463befc5b0b8",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "四联屏监视器检查项目：指示灯与图像显示是否正常",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm22",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "16c11448-6d64-486b-ba46-1479e325e1e5",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms22",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "eadbeb78-0fd1-4388-93b7-b168e6b91549",
//                                      "row": 5,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "f4415f6a-bcdf-419c-bfd0-1ac246d2cc4c",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "32寸三星液晶显示器检查项目：图像显示情况",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm23",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "67f9691c-8d5f-4d2e-9fa4-5b899671643d",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms23",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "150384b4-c7c2-4d22-ac83-9b22a2781cce",
//                                      "row": 6,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "a7b126bb-2af3-4755-9f83-238584cbaeb6",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "15寸工业电视监视器（2个）检查项目：图像显示情况",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm24",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "247555de-e1ef-4915-a128-9332e7ecf57d",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms24",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "795051d3-3090-4766-9229-536022cd1ab3",
//                                      "row": 7,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "a9982ec1-727e-4450-b8cd-61c5eaedca83",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "折叠屏检查项目：图像显示情况",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm25",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "15c4b67c-7926-444b-8b3f-d5ad612cd475",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms25",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "ea7f85c6-2185-46f1-8442-abb99efaeaa3",
//                                      "row": 8,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "313984a3-ff7f-43e0-8d14-45f03f65de59",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "音视频矩阵检查项目：音视频切换功能情况",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm26",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "d204874f-d13b-408f-9e05-78bba6780474",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms26",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "baf44757-862e-487c-b454-f0c242c9b494",
//                                      "row": 9,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "b75e86bb-a443-4bf7-a62a-57834ea5a180",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "高清矩阵检查项目：视频切换功能情况",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm27",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "55073d42-7391-46e9-a97a-5f00fdeb34fa",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms27",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "2874f8a7-467f-44a2-944f-f0b4066fb81a",
//                                      "row": 10,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "0039fbcf-92b9-4570-86cb-779588e87eee",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "主副驾驶头枕屏检查项目：图像显示情况",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm28",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "89f67007-a493-45a4-aeb2-12d329cae4c8",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms28",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "2afd4617-3765-4a2d-95c6-1e472123d3e3",
//                                      "row": 11,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "390e1533-c962-4cd2-b60c-db44b6c9ff45",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "高清混合矩阵检查项目：视频切换功能情况",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm29",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "96ca6045-ef9f-4812-82cc-46504b9380d7",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms29",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  }
//                              ]
//                          },
//                          {
//                              "id": "0a6a6b35-02a9-412f-865b-95ba4f962338",
//                              "row": 8,
//                              "col": 1,
//                              "title": "音频子系统",
//                              "type": "group",
//                              "item": [
//                                  {
//                                      "id": "61599103-e41d-49bd-9893-51290f5a7bbc",
//                                      "row": 1,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "d807c89c-83fc-4344-8ee0-39a25ca87bad",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "多功能传真一体机检查项目：复印打印功能运行情况",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm30",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "9ab092fd-3231-4f0e-87ec-262f7430bcdb",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms30",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "913ac112-b333-4d9c-823f-a2a689527d03",
//                                      "row": 2,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "eee4667a-0cf4-42e5-8795-ebe3ccea441e",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "防爆对讲机检查项目：通话测试情况",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm31",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "1e214009-c9a9-4e44-9e40-dc0bd0ce9879",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms31",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "19ac0b28-1d90-4bf6-8bfc-4621073cb9f5",
//                                      "row": 3,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "a24beff8-f827-4c80-afa3-7af77402c33e",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "中继台检查项目：设备运行情况",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm32",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "9abc518b-9826-4261-ac50-91a55a840567",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms32",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "a254a13f-f9d1-44c7-84be-c0a436ccbd90",
//                                      "row": 4,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "fc887658-b02b-44e2-bc4b-8e4fa85b605b",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "电台控制器（接驳器）检查项目：设备运行情况",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm33",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "262a0d33-748a-41c1-a5b5-51d42248f7f1",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms33",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "5296f37a-a3e5-40bc-89dd-f874701789a4",
//                                      "row": 5,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "19fa739f-8d03-436c-b9ea-1aea19c86f5b",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "防爆手机检查项目：通话是否正常",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm34",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "b57cbbfb-cf05-4fb8-b7ae-23a6c5459f67",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms34",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "e6a39ae1-be8f-42ce-b9f7-67082463d6c7",
//                                      "row": 6,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "639153f9-4463-465e-8766-166502098a27",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "基站PBX300检查项目：指示灯/配置情况",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm35",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "197ea739-3f63-415a-b56a-063984465d1a",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms35",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "bfcad64e-d0cc-4036-b3cf-7c77f119789e",
//                                      "row": 7,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "a6b83ac6-90f5-41d3-b23f-0f84977793c9",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "工控机操作系统与管理软件检查项目：配置情况",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm36",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "cf16dab4-3b19-4320-9c04-f2ff7da51586",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms36",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "e74ae4dc-fde7-4276-9626-0698f9fce877",
//                                      "row": 8,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "2b50d595-23c9-40e4-8cdb-d6ce83883bb7",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "扩音设备检查项目：设备运行是否正常",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm37",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "f57f8371-214c-4de6-b072-d0fdee4e8909",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms37",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "fc3e20f4-60f8-4353-b4af-11430d0a88c9",
//                                      "row": 9,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "4f87095c-1619-41b4-8d3d-33c5e858499e",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "无线话筒检查项目：设备运行是否正常",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm38",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "90a8421f-6b07-4c12-a414-12d9ef786fe6",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms38",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  }
//                              ]
//                          },
//                          {
//                              "id": "506b0073-c781-4962-baae-b44ecd086556",
//                              "row": 9,
//                              "col": 1,
//                              "title": "其他通信设备",
//                              "type": "group",
//                              "item": [
//                                  {
//                                      "id": "8ade7545-13d3-4077-917a-e19be0fd4cdd",
//                                      "row": 1,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "cdde6414-74fd-484a-a772-9baef40e75fa",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "海事卫星电话检查项目：拨打电话功能是否正常",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm39",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "f3534a1a-e688-45cf-bee5-24b48e030dda",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms39",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "c4343934-1776-4418-9628-5aab4d396f62",
//                                      "row": 2,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "aeaebc94-7443-4e2d-aeda-898489966c6d",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "以太网交换机检查项目：设备运行是否正常",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm40",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "46a32231-965e-4bfe-bfd9-70fdd283e123",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms40",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "78a19d12-e0af-4386-b31e-20ae3470783c",
//                                      "row": 3,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "1833a818-0a58-4709-a04c-505f262a736f",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "GPS/北斗双模终端检查项目：定位导航是否正常",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm41",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "bc821e6b-5b28-4a94-b22e-4c60a3b34fab",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms41",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "4a43565f-60d0-462c-9cf3-b2f37d401670",
//                                      "row": 4,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "a228c050-b87d-451c-b7d8-7a1b16f246ce",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "便携坚固计算机检查项目：计算机系统与应用软件是否运行正常",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm42",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "2207488a-4d59-44f1-a5c0-1f1e5b0afbc5",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms42",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "af17f571-11d3-416c-a486-de083a0d53c6",
//                                      "row": 5,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "d689435b-666d-4eeb-afe3-bba4ce836d39",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "集中监控单元检查项目：监控设备功能是否正常",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm43",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "a9d54e20-7752-4542-8b9d-b94dc5801efc",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms43",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "88adbc2f-6f7d-4bfa-9d37-d27570c3ca69",
//                                      "row": 6,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "f8bfed88-ab22-4e03-997b-c5bdf0dd5621",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "低压配电设备检查项目：电流电压表与空开是否正常",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm44",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "cd100c4c-3c79-4b8e-add8-2c887d7b16c0",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms44",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "3d385b06-37c7-46c3-90c9-3a8f87c22a13",
//                                      "row": 7,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "87dbb844-a027-4ce5-9509-2e29aca23716",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "UPS电源检查项目：各指示灯运行状态及供电情况",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "jcxm45",
//                                              "displayType": "required",
//                                              "readonly": "false",
//                                              "type": "radiogroup",
//                                              "defaultValue": "1$^$正常$?$0$^$异常$?$-1$^$无此设备"
//                                          },
//                                          {
//                                              "id": "d39f5b82-d2a6-4b7a-9f2b-b6070dc059f5",
//                                              "row": 1,
//                                              "col": 2,
//                                              "title": "问题描述",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "wtms45",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  }
//                              ]
//                          },
//                          {
//                              "id": "2995acbb-c3b2-41b5-90dc-045cec3bb83f",
//                              "row": 10,
//                              "col": 1,
//                              "type": "group",
//                              "item": [
//                                  {
//                                      "id": "110c4164-89bf-4ebe-bcff-a12b5964d438",
//                                      "row": 1,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "514a4bf8-f4c7-4954-bb21-ac8bf9e958fb",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "其它",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "qt",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          },
//                                          {
//                                              "id": "77174e97-51d6-4321-be94-adc5c5e17cbd",
//                                              "row": 2,
//                                              "col": 1,
//                                              "title": "处理结果",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "cljg",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "textarea"
//                                          }
//                                      ]
//                                  },
//                                  {
//                                      "id": "6cdaa57d-c691-4a6b-ab72-9f09cecc1889",
//                                      "row": 2,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "014eb13f-65fa-4dfc-a7c8-f50dafe85bde",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "附件",
//                                              "bizClass": "sbxjjl",
//                                              "bizField": "fj",
//                                              "displayType": "opitonal",
//                                              "readonly": "false",
//                                              "type": "attachFile"
//                                          }
//                                      ]
//                                  }
//                              ]
//                          },
//                          {
//                              "id": "35abeeec-e309-4aaa-b902-89affde97d27",
//                              "row": 11,
//                              "col": 1,
//                              "title": "流程信息",
//                              "type": "group",
//                              "item": [
//                                  {
//                                      "id": "3681d6b4-4c7f-43e9-9dca-4cfd0ee8ddb1",
//                                      "row": 1,
//                                      "col": 1,
//                                      "type": "group",
//                                      "item": [
//                                          {
//                                              "id": "107bf3fa-44f9-4c09-8468-acf8e7d61fdb",
//                                              "row": 1,
//                                              "col": 1,
//                                              "title": "流程记录",
//                                              "bizClass": "processObject",
//                                              "bizField": "processRecord",
//                                              "displayType": "readonly",
//                                              "readonly": "true",
//                                              "type": "processRecord"
//                                          }
//                                      ]
//                                  }
//                              ]
//                          }
//                      ]
//                  },
//                  "action": [
//                      {
//                          "id": "Link_2",
//                          "name": "保存"
//                      },
//                      {
//                          "id": "Link_1",
//                          "name": "关闭"
//                      }
//                  ]
//              }
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
        mui.alert("网络错误")
    },
 complete :function(){
     setTimeout(function(){
         plus.nativeUI.closeWaiting()
     },100)
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