mui.plusReady(function(){
		mui.back = function() {
				plus.webview.currentWebview().hide("auto", 300);
				var self = plus.webview.currentWebview();
				self.addEventListener("hide",function (e) {
					
					vm.id='';
					vm.isAppend=true
				},false);
			}
})