/*!

 @Title: layui.webupload 单文件上传 - 全浏览器兼容版
 @Author: Lee
 @License：LGPL

 */
 
layui.define(['jquery', 'layer'], function(exports){
  var $ = layui.jquery, layer = layui.layer;
  var webuploader = layui.cache.dir + 'lay/lib/webuploader/webuploader.min.js';
  var oHead = document.getElementsByTagName('HEAD').item(0); 
  var oScript = document.createElement('script');
  oScript.async = true;
  oScript.src = webuploader;
  oHead.appendChild( oScript); 
  //console.log('load javascript', webuploader);
  
  exports('webupload', function(options){
    options = options || {};

    options.check = options.check || 'images';
	
	//console.log(options.url, layui.cache.dir);
	// 实例化
	var uploader = WebUploader.create({
		auto: true, //自动上传
		swf: layui.cache.dir + 'lay/lib/webuploader/Uploader.swf', //SWF路径
		server: options.url, //上传地址
		pick: {
			id: options.check === 'images' ? '#layim-send-image' : '#layim-send-file',
			multiple: false
		},
		accept: {
			/*title: 'Images',*/
			extensions: options.filetypes ? options.filetypes : '*'
			/*mimeTypes: 'image/*'*/
		},
		formData: {
			'DelFilePath': '' //定义参数
		},
		fileVal: 'file', //上传域的名称
		fileSingleSizeLimit: options.filesize * 1024 * 1024 //文件大小 M 
	});
	setTimeout(function(){
		//$('.webuploader-pick').siblings().resize();
		$('.webuploader-pick').siblings().css({'width':$('.webuploader-pick').css('width'),'height':$('.webuploader-pick').css('height')});
	},500);

	//console.log(uploader);
	
	//当validate不通过时，会以派送错误事件的形式通知
	uploader.on('error', function (type) {
		switch (type) {
			case 'Q_EXCEED_NUM_LIMIT':
				layer.alert("上传文件数量过多！");
				break;
			case 'Q_EXCEED_SIZE_LIMIT':
				layer.alert("文件总大小超出限制！");
				break;
			case 'F_EXCEED_SIZE':
				layer.alert("文件大小超出限制！");
				break;
			case 'Q_TYPE_DENIED':
				layer.alert("暂不支持此类型文件。");
				break;
			case 'F_DUPLICATE':
				layer.alert("请勿重复上传该文件！");
				break;
			default:
				layer.alert('错误代码：' + type);
				break;
		}
	});
	
	uploader.on('fileQueued', function (file) {
		//console.log('fileQueued',file);
		typeof options.addQueued === 'function' && options.addQueued(file);
	});
	
	//当文件上传出错时触发
    uploader.on('uploadError', function (file, reason) {
		console.log('uploadError',file, reason);
        this.removeFile(file); //从队列中移除
		layer.msg(IML(reason||'上传失败'));
		typeof options.uploadError === 'function' && options.uploadError(file, reason);
    });
	
	uploader.on('uploadSuccess', function(file, res){
		//console.log('uploadSuccess',file, res);
		this.removeFile(file); //从队列中移除
		typeof options.success === 'function' && options.success(res);
		
	});
  });
});