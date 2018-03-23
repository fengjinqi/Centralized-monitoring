function getPerson(){
  var userPicker = new mui.PopPicker();
    userPicker.setData();
    var showUserPickerButton = document.getElementById("danwei");
    showUserPickerButton.addEventListener('click', function(event) {
                     document.getElementById('bumen').value=""
                     document.getElementById('jianchar').value=""
                      userPicker.show(function(items) {
                          showUserPickerButton.value = items[0].text;
                          document.getElementById("danwei").setAttribute('data',items[0].id)
                          //返回 false 可以阻止选择框的关闭
                          return false;
                          userPicker.dispose()
                      });

                     /*mui.ajax("http://127.0.0.1:10261/itsm/rest/api/v2/acm/user/org",{
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
                                 document.getElementById("danwei").setAttribute('data',items[0].id)
                                 //返回 false 可以阻止选择框的关闭
                                 //return false;
                                 userPicker.dispose()
                             });
                         },
                         error:function(xhr,type,errorThrown){
                             plus.nativeUI.closeWaiting();
                             alert('错误'+xhr.status+type+errorThrown)
                         }
                     })*/
                 }, false);

}