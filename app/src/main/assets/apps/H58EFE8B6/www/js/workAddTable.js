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
        dataType:'xcjszclc',
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
 //alert(vm.getLogin)
    //alert(vm.guid)
    //alert(vm.dataType)
  vm.field=event.detail.field
  plus.nativeUI.showWaiting( '正在加载' )
  mui.ajax("http://127.0.0.1:10261/itsm/rest/api/v2/itsm/tickets/getTicketForm?userId="+vm.getLogin+"&processName="+vm.cover+"&startNodeId=Start",{
    dataType:'json',
    type:'get',
    success:function(res){
        if(res.success==false){
            mui.alert('未查询到用户')
             plus.nativeUI.closeWaiting()
        }
      /*var res={
                  "result": {
                      "success": true
                  },
                  "ticket": {
                      "data": [
                          {
                              "id": "e807af0a-899f-4922-9555-ffa798442519",
                              "row": 1,
                              "col": 1,
                              "title": "地区公司填写",
                              "type": "group",
                              "item": [
                                  {
                                      "id": "44f8a514-d8a8-4b0d-900e-2965fc1368d8",
                                      "row": 1,
                                      "col": 1,
                                      "type": "group",
                                      "item": [
                                          {
                                              "id": "0d6d0fa1-cdd4-4482-9ba8-c3d7629a7158",
                                              "row": 1,
                                              "col": 1,
                                              "title": "填写人",
                                              "bizClass": "xcjszc",
                                              "bizField": "txr",
                                              "displayType": "required",
                                              "readonly": "false",
                                              "type": "userSelect"
                                          }
                                      ]
                                  },
                                  {
                                      "id": "f66d4774-e2f7-4aef-a1cb-4158d34ff4f6",
                                      "row": 2,
                                      "col": 1,
                                      "type": "group",
                                      "item": [
                                          {
                                              "id": "52e45437-ba3b-49e7-8653-93cb25a175ae",
                                              "row": 1,
                                              "col": 1,
                                              "title": "详细地址",
                                              "bizClass": "xcjszc",
                                              "bizField": "xxdz",
                                              "displayType": "required",
                                              "readonly": "false",
                                              "type": "text"
                                          }
                                      ]
                                  },
                                  {
                                      "id": "639f9b8a-bf8a-45bb-acfd-fb5b70fb5f87",
                                      "row": 3,
                                      "col": 1,
                                      "type": "group",
                                      "item": [
                                          {
                                              "id": "7cf13fe2-fc03-4479-bffb-69c0bdacbfac",
                                              "row": 1,
                                              "col": 1,
                                              "title": "联系人",
                                              "bizClass": "xcjszc",
                                              "bizField": "lxr",
                                              "displayType": "required",
                                              "readonly": "false",
                                              "type": "text"
                                          },
                                          {
                                              "id": "796da686-8ec7-4a87-9f14-3c4846a1bbc4",
                                              "row": 1,
                                              "col": 2,
                                              "title": "联系方式",
                                              "bizClass": "xcjszc",
                                              "bizField": "lxfs",
                                              "displayType": "required",
                                              "readonly": "false",
                                              "type": "text"
                                          }
                                      ]
                                  },
                                  {
                                      "id": "bc3c7ffb-df60-43c3-b0f2-d86ce062aeb6",
                                      "row": 4,
                                      "col": 1,
                                      "type": "group",
                                      "item": [
                                          {
                                              "id": "0a83813b-23b4-469e-91b0-cc824c92caff",
                                              "row": 1,
                                              "col": 1,
                                              "title": "申请事由",
                                              "bizClass": "xcjszc",
                                              "bizField": "sqsy",
                                              "displayType": "required",
                                              "readonly": "false",
                                              "type": "textarea"
                                          },
                                          {
                                              "id": "f3ac6109-d19f-461a-a8b2-33f452febac5",
                                              "row": 2,
                                              "col": 1,
                                              "title": "技术服务形式",
                                              "bizClass": "xcjszc",
                                              "bizField": "jsfwxs",
                                              "displayType": "required",
                                              "readonly": "false",
                                              "type": "checkbox",
                                              "defaultValue": "故障处理 $^$故障处理 $?$现场培训$^$现场培训$?$系统维护$^$系统维护$?$安装调试$^$安装调试$?$需求调研$^$需求调研 $?$技术交流$^$技术交流$?$方案设计$^$方案设计$?$其它$^$其它"
                                          },
                                          {
                                              "id": "0169e8a3-730e-441b-b935-21d73d699af5",
                                              "row": 3,
                                              "col": 1,
                                              "title": "故障设备类别",
                                              "bizClass": "xcjszc",
                                              "bizField": "gzsblb",
                                              "displayType": "required",
                                              "readonly": "false",
                                              "type": "checkbox",
                                              "defaultValue": "车载卫星天线子系统$^$车载卫星天线子系统$?$综合接入子系统$^$综合接入子系统$?$视频子系统$^$视频子系统$?$发电子系统$^$发电子系统$?$辅助子系统$^$辅助子系统$?$音频子系统$^$音频子系统$?$其他通信设备$^$其他通信设备$?$其它$^$其它$?$无$^$无"
                                          }
                                      ]
                                  }
                              ]
                          }
                      ]
                  },
                  "action": [
                      {
                          "id": "Link_0",
                          "name": "提交申请"
                      },
                      {
                          "id": "Link_6",
                          "name": "保存"
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
        mui.alert("网络错误")
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