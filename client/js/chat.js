/**
 * Created by Lee on 2016-10-9.
 */
var IMlanguage = {
    '人': ' person',
    '聊天记录': 'Chat record',
    '发送': 'Send',
    '关闭': 'Close',
    '按Enter键发送消息': 'Send by Enter',
    '按Ctrl+Enter键发送消息': 'Send by Ctrl+Enter',
    '与 ': 'With ',
    ' 的聊天记录': ' chat record',
    '图片格式不对': 'Picture format wrong',
    '上传失败': 'Upload failed',
    '下载文件': 'Download File',
    '没有文件上传': 'No file upload',
    '钉一下': 'Ding',
    '全选': 'All select',
    '请选择要钉的人': 'Please choose the person you want to nail.',
    '此消息发送至对方注册手机或注册邮箱': 'This message is sent to the other side of the registered mobile phone or registered mail.',
    '确定': 'Confirm',
    '钉成功': 'Ding success.'
};
window.IML = function(word){
    if(typeof CONFIG.language != 'undefined' && CONFIG.language == 'en'){
        return IMlanguage[word]?IMlanguage[word]:word;
    }
    return word;
};
var loginStatus = false;
var serviceList = {sList:['unreadMessage']};
//var socket = io.connect(CONFIG.url, {transports:['jsonp-polling']});
var socket = io.connect(CONFIG.url);
//console.log(socket);
socket.on('connect', function(){
    socket.emit('login', {username: username, password: password});
});

function getUnreadMessage(){
    if(loginStatus){
        socket.emit('unreadMessage', null);
    }
}

// 把信息显示到div上
socket.on('login', function (data) {
    //console.log(data);
    if(data.status){
        loginStatus = true;
        getUnreadMessage();
    }else{
        socket.emit('disconnect', null);
        console.log(data.msg);
    }
});

socket.on('unreadMessage', function (data) {
    //console.log(data);
    if(typeof setGroupUnreadCount != 'undefined'){
        setGroupUnreadCount(data.sessList);
    }
    if(typeof setUnreadCount != 'undefined'){
        setUnreadCount(data.unreadNum);
    }
});

layui.use('layim', function(layim){
    //基础配置
    layim.config({
        //初始化接口
        init: {
            //url: './json/getList.json'
            url: CONFIG.url+'/chat/sessList/'+username
            ,data: {}
        }
        //简约模式（不显示主面板）
        //,brief: true
        //查看群员接口
        ,members: {
            //url: './json/getMembers.json'
            url: CONFIG.url+'/chat/memberList'
            ,data: {}
        }
        ,uploadImage: {
            url: CONFIG.url+'/file-upload' //（返回的数据格式见下文）
            ,type: '' //默认post
        }
        ,uploadFile: {
            url: CONFIG.url+'/file-upload' //（返回的数据格式见下文）
            ,type: '' //默认post
        }
        ,dingSwitch: typeof CONFIG.dingSwitch == 'undefined' ? false : CONFIG.dingSwitch
        ,dingURL: CONFIG.url+'/ding'
        //,skin: ['aaa.jpg'] //新增皮肤
        ,isfriend: false //是否开启好友
        //,isgroup: false //是否开启群组
        //,min: false //是否始终最小化主面板（默认false）
        ,hide: true //是否始终隐藏主面板（默认false）
        ,chatLog: CONFIG.url+'/chat/history'
        // ,chatLog: './demo/chatlog.html' //聊天记录地址
        ,find: './demo/find.html'
        //,copyright: true //是否授权
    });
    //监听发送消息
    layim.on('sendMessage', function(data){
        var To = data.to;
        //console.log(data);
        //发送消息
        var message = {username:data.mine.username,sessId:To.id,content:data.mine.content};
        socket.emit('sendMessage', message);
    });
    //监听在线状态的切换事件
    layim.on('online', function(data){
        console.log(data);
    });
    //layim建立就绪
    layim.on('ready', function(res){
        var groupList = layim.cache().group;
        window.initCallback && window.initCallback(groupList);
    });
    //监听查看群员
    layim.on('members', function(data){
        //console.log(data);
    });
    //监听聊天窗口的切换
    layim.on('chatChange', function(data){
        console.log('chatChange');
        socket.emit('setCurrSession', {sessId:data.data.id});
    });

    //监听收到的聊天消息
    socket.on('instantMessage', function(messList){
        //console.log(messList);
        messList.forEach(function(mess){
            var obj = {
                username: mess.userInfo.username
                ,avatar: mess.userInfo.avatar
                ,id: mess.sessId
                ,type: 'group'
                ,mine: mess.mine
                ,timestamp: mess.sendTime
                ,content: mess.content
            };
            //if(!obj.mine){
            layim.getMessage(obj);
            //}
        });
    });

    layim.on('closeThisChat',function(data){
        console.log('closeThisChat');
        socket.emit('emptyCurrSession', null);
    });

    function getGroupInfo(id){
        var groupList = layim.cache().group;
        for(var i in groupList){
            if(id == groupList[i].id){
                return groupList[i];
            }
        }
        return;
    }

    $(document).delegate('.layui-layer-close','click',function(){
        console.log('cancelIM');
        socket.emit('emptyCurrSession', null);
    });

    $(document).delegate("#showHistoryBox",'click',function(){
        var id = $(this).attr('qunId');
        var sessname = $(this).attr('sessname');
        var data = {id: id, name:sessname}
        layim.showHistoryLog(data);
    });

    $(document).delegate(imIdClass,'click',function(){
        var id = $(this).find('.qunUnreadNum').attr('qunId');
        //var _sesionId = '57c8f0aba0ea35c42646f300';
        var groupInfo = getGroupInfo(id);
        if(groupInfo) {
            layim.chat({
                name: groupInfo.groupname
                , type: 'group' //群组类型
                , avatar: groupInfo.avatar
                , id: groupInfo.id //定义唯一的id方便你处理信息
            });
        }else if(username == superUser){
            $.ajax({
                type: 'POST',
                url: CONFIG.url+'/chat/addSession',
                dataType: "json",
                timeout: 20000,
                data: {username:username,sessid:id,nickname:'PM'},
                beforeSend: function(XMLHttpRequest) {
                },
                success: function(data, textStatus) {
                    if(data.status){
                        layim.addDataList(data.data);
                        groupInfo = getGroupInfo(id);
                        layim.chat({
                            name: groupInfo.groupname
                            ,type: 'group' //群组类型
                            ,avatar: groupInfo.avatar
                            ,id: groupInfo.id //定义唯一的id方便你处理信息
                        });
                    }
                }
            });
        }
    });
});