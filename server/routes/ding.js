module.exports = function ( app ) {
    //钉一下
    app.post("/ding",function(req,res){
        var request = require('request');
        var queryString  = require('querystring');
        //console.log(global.dingURL,req.body);
        var qString = queryString.stringify(req.body);
        //console.log(qString);
        request(global.dingURL+'?'+qString, function (error, response, body) {
            if(typeof body != 'undefined'){
                try{
                    body = JSON.parse(body);
                } catch(e) {
                    console.log('ding api return is not json data.'+e);
                }
            }
            if (!error && response.statusCode == 200 &&　body.success) {
                res.json({status:true});
            }else{
                res.json({status:false});
            }
        })
        //http://10.5.123.199:8080/wetransn/sendMsg?oId=test123&msg=%E8%BF%99%E6%98%AF%E4%B8%80%E4%B8%AA%E6%B5%8B%E8%AF%95%E6%B6%88%E6%81%AF&sender=lee&users=WE16001128CU%2CWE16000013CU
        // request.post(
        //    {
        //        url:global.dingURL,
        //        form:req.body,
        //        encoding:'utf8'
        //    },
        //    function(error, response, body){
        //        console.log(error, response, body);
        //        if(response.statusCode == 200){
        //            console.log(body);
        //            if(body.success){
        //                res.json({status:true,msg:'username has existed'});
        //            }else{
        //                res.json({status:false,msg:'username has existed'});
        //            }
        //        }else{
        //            console.log(response.statusCode);
        //            res.json({status:false,msg:'username has existed'});
        //        }
        //    }
        //);
    });
}