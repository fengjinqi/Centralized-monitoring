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
        id:'',
        cover:'',
        bizClass:''
    },
     methods:{
         getTask: function(item){
            var obj={};
              var check;
            obj.moduleId=vm.dataType,
            obj.processName=vm.cover,
            obj.bizClass=vm.bizClass,
            obj.transitionId=item.id,
            obj.startNodeId="Start",
            obj.creator='admin',
            obj.bizObj={};
            var input=document.querySelectorAll('#form1 .text ')
            for(var i=0;i<input.length;i++){
                obj.bizObj[input[i].name]=input[i].value
            }
            var person=document.querySelectorAll('#form1 .person ')
            for(var i=0;i<person.length;i++){
                obj.bizObj[person[i].name]=person[i].getAttribute('data-id')
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
 plus.nativeUI.showWaiting('提交中。。。')
                         mui.ajax('http://127.0.0.1:10261/itsm/rest/api/v2/itsm/tickets/create',{
                                data:obj,
                                dataType:'json',
                                type:'post',
                                headers:{'Content-Type':'application/json'},
                                success:function(data){
                                    if(vm.dataType=='yjbzgl'||vm.dataType=='gzcllc1'||vm.dataType=='TestPro'||vm.dataType=='zxgd'){
                                        alert()
                                    }

                                   // mui.back()
                                   mui.back = function() {
                                           plus.webview.currentWebview().hide("auto", 300);
                                           var self = plus.webview.currentWebview();
                                           //confirm()
                                           self.addEventListener("hide",function (e) {
                                               vm.dataType='',
                                               vm.cover='',
                                               vm.guid="",
                                               vm.items=[],
                                               vm.task=[]
                                           },false);
                                       }
                                       plus.nativeUI.toast( "创建成功");
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
			  vm.bizClass=event.detail.bizClass
				//alert(vm.guid)
				//alert(vm.dataType)
				//alert(vm.cover)
				 plus.nativeUI.showWaiting( '正在加载' )
				  mui.ajax("http://127.0.0.1:10261/itsm/rest/api/v2/itsm/tickets/getTicketForm?userId=admin&processName="+vm.cover+"&startNodeId=Start",{
                dataType:'json',
                type:'get',
                success:function(res){
                /*
var res={
          "result": {
            "success": true
          },
          "ticket": {
            "data": [
              {
                "id": "c3fbe75b-bb1c-414c-9cc4-32c1fe77f01a",
                "row": 1,
                "col": 1,
                "title": "业务咨询",
                "type": "group",
                "item": [
                  {
                    "id": "187366bd-9a0d-4d66-8126-15cc990c3bf2",
                    "row": 1,
                    "col": 1,
                    "type": "group",
                    "item": [
                      {
                        "id": "5756ec72-c4c5-4b50-9466-ce04b96014d2",
                        "row": 1,
                        "col": 1,
                        "title": "保障中心记录人",
                        "bizClass": "zxbd",
                        "bizField": "bzzxjlr",
                        "displayType": "required",
                        "readonly": "false",
                        "type": "userSelect"
                      }
                    ]
                  },
                  {
                    "id": "a334021d-fccc-4903-86d2-46575370f8a3",
                    "row": 2,
                    "col": 1,
                    "type": "group",
                    "item": [
                      {
                        "id": "2529a996-69e0-4004-8ea4-b1a3ec58b0c5",
                        "row": 1,
                        "col": 1,
                        "title": "记录时间",
                        "bizClass": "zxbd",
                        "bizField": "jlsj1",
                        "displayType": "required",
                        "readonly": "false",
                        "type": "date"
                      }
                    ]
                  },
                  {
                    "id": "7dc2911a-d422-48dd-8ac7-504d28b8a4d7",
                    "row": 3,
                    "col": 1,
                    "type": "group",
                    "item": [
                      {
                        "id": "128dd412-3c4c-4595-9c82-a4a508d16700",
                        "row": 1,
                        "col": 1,
                        "title": "咨询单位",
                        "bizClass": "zxbd",
                        "bizField": "zxdw1",
                        "displayType": "required",
                        "readonly": "false",
                        "type": "text"
                      },
                      {
                        "id": "1ff8db87-78ec-4fe2-9653-4347c9c81974",
                        "row": 1,
                        "col": 2,
                        "title": "咨询人员",
                        "bizClass": "zxbd",
                        "bizField": "zxry1",
                        "displayType": "required",
                        "readonly": "false",
                        "type": "text"
                      }
                    ]
                  },
                  {
                    "id": "b1765114-af6d-46db-a06a-91765683da40",
                    "row": 4,
                    "col": 1,
                    "type": "group",
                    "item": [
                      {
                        "id": "2e07e28e-da8b-41e7-9c2a-3ad49502360b",
                        "row": 1,
                        "col": 1,
                        "title": "咨询时间",
                        "bizClass": "zxbd",
                        "bizField": "zusj1",
                        "displayType": "required",
                        "readonly": "false",
                        "type": "date"
                      }
                    ]
                  },
                  {
                    "id": "698e1c41-223a-4829-97c2-c6ffea565e26",
                    "row": 5,
                    "col": 1,
                    "type": "group",
                    "item": [
                      {
                        "id": "3ba0ead3-cf51-4cdc-a4ff-a22dfd1e85ed",
                        "row": 1,
                        "col": 1,
                        "title": "咨询方式",
                        "bizClass": "zxbd",
                        "bizField": "zxfs",
                        "displayType": "required",
                        "readonly": "false",
                        "type": "select",
                        "defaultValue": "1$^$电话$?$2$^$QQ/微信/E-mail$?$3$^$日常测试$?$4$^$其他"
                      },
                      {
                        "id": "338bf285-1797-44bb-86c9-f37118a6185c",
                        "row": 2,
                        "col": 1,
                        "title": "业务咨询类别",
                        "bizClass": "zxbd",
                        "bizField": "ywzxlb",
                        "displayType": "required",
                        "readonly": "false",
                        "type": "select",
                        "defaultValue": "1$^$制度管理类$?$2$^$人员管理类$?$3$^$日常运维类$?$4$^$通信保障类$?$5$^$演练测试类$?$6$^$安全保密类$?$7$^$文件报表类$?$8$^$培训考核类$?$9$^$其它类"
                      },
                      {
                        "id": "173284c3-1404-45de-b369-cdb5f330ab43",
                        "row": 3,
                        "col": 1,
                        "title": "咨询内容描述",
                        "bizClass": "zxbd",
                        "bizField": "zxnrms",
                        "displayType": "required",
                        "readonly": "false",
                        "type": "textarea"
                      },
                      {
                        "id": "f1b7a37c-564d-4352-9fe2-279604f0a057",
                        "row": 4,
                        "col": 1,
                        "title": "附件",
                        "bizClass": "zxbd",
                        "bizField": "fj",
                        "displayType": "opitonal",
                        "readonly": "false",
                        "type": "attachFile"
                      }
                    ]
                  },
                  {
                    "id": "40746b15-f51a-461d-ab94-b22509c8a201",
                    "row": 6,
                    "col": 1,
                    "type": "group",
                    "item": [
                      {
                        "id": "094cb65c-ce45-4ff4-b87c-404dfe47c06e",
                        "row": 1,
                        "col": 1,
                        "title": "处理结果",
                        "bizClass": "zxbd",
                        "bizField": "cljg",
                        "displayType": "required",
                        "readonly": "false",
                        "type": "radiogroup",
                        "defaultValue": "1$^$已完成$?$2$^$任务改派"
                      }
                    ]
                  },
                  {
                    "id": "b06fa0fb-e099-46f6-9df4-52a4d91dcb1d",
                    "row": 7,
                    "col": 1,
                    "type": "group",
                    "item": [
                      {
                        "id": "e6dc42d6-292c-4217-9f7d-a79c65c2eb7c",
                        "row": 1,
                        "col": 1,
                        "title": "改派人",
                        "bizClass": "zxbd",
                        "bizField": "gpr",
                        "displayType": "opitonal",
                        "readonly": "false",
                        "type": "text"
                      }
                    ]
                  },
                  {
                    "id": "3b9c48f6-0824-4c36-bf19-0d49a37877b2",
                    "row": 8,
                    "col": 1,
                    "type": "group",
                    "item": [
                      {
                        "id": "760df5d3-d206-4a26-b6a8-77499215a104",
                        "row": 1,
                        "col": 1,
                        "title": "处理内容及结果",
                        "bizClass": "zxbd",
                        "bizField": "gphcljg",
                        "displayType": "opitonal",
                        "readonly": "false",
                        "type": "textarea"
                      }
                    ]
                  }
                ]
              },
              {
                "id": "cbf4c119-8a57-42c5-910f-308cb1b06b49",
                "row": 2,
                "col": 1,
                "title": "流程信息",
                "type": "group",
                "item": [
                  {
                    "id": "22b15af4-13f0-4e91-8a17-8604089d2ba6",
                    "row": 1,
                    "col": 1,
                    "type": "group",
                    "item": [
                      {
                        "id": "310b06b1-2fec-4155-9c57-ad9d3e470397",
                        "row": 1,
                        "col": 1,
                        "title": "流程记录",
                        "bizClass": "processObject",
                        "bizField": "processRecord",
                        "displayType": "readonly",
                        "readonly": "true",
                        "type": "processRecord"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          "action": [
            {
              "id": "Link_2",
              "name": "保存"
            },
            {
              "id": "Link_1",
              "name": "关闭"
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
       // alert(JSON.stringify(vm.items))
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
                      /*setTimeout(function(){
                            plus.nativeUI.closeWaiting()
                        },800)*/
                        var btnArray = ['否', '是']; //弹框消息确认是否打开附件
                                            plus.nativeUI.confirm('是否上传附件?',  function(e) {
                                                if(e.index == 1) { //打开附件
                                                    Gareth()
                                                }
                                            },'',btnArray);

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
                jianchar.value = items[0].text;
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
                    vm.task=''
				},false);
			}