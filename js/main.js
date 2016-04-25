/**
 * Created by Administrator on 16-3-22.
 */


var ref=new Wilddog("https://device-info.wilddogio.com/");
var userRef=new Wilddog("https://device-info.wilddogio.com/DebugInfo/");
var counter={index:0,online:0,key:"",id:""};
var authData;
var infoID=10000;
var infoID_IN=20000;
var infoID_OUT=30000;
var IN=true;
var OUT=true;
var ALL=true;
var historyCounter =new Array();;
var dataShowById=new Array();
//---------------------用户登录认证---------------------------//
function signIn(){
    Email=$("#inputEmail").val();
    Password=$("#inputPassword").val();

    ref.authWithPassword({email:Email,password:Password},
        function(err,data){
            if(err==null){
                console.log("auth success!",data);
                self.location="./info.html";

//                form.submit();
            }else{
                console.log("auth failed,msg:",err);
                alert("邮箱或密码错误",err);
            }
        })
}


//---------------------监听数据显示快照---------------------------//
function devOnlineShow(){

    ref.child("DebugInfo").on("child_changed",function(snapshot){
//
        devKEY=snapshot.key();
        devID=snapshot.child("devID").val();
        devINDEX=snapshot.child("index").val();
        devONLINE=snapshot.child("Online").val();

        counter={index:devINDEX,online:devONLINE,key:devKEY,id:devID};
        //devDIVStr="<div id='"+devKEY+"'>"+"</div>";
        dataShowById[devINDEX]=devKEY;
        devDIVStr="<div class='list-group' id='"+devKEY+"'>"+"</div>";
        divId=$("#"+devKEY);



        if(divId.length>0){
            divId.text(devID+" "+devONLINE);

        }else{
            $("#devOnlineShow").append(devDIVStr);
                    historyCounter[devINDEX]=devONLINE;
            var e = document.createElement("input");
            e.type = "button";
            e.id = "dataBtn";
            e.class = devKEY;
            //e.value = ukeystr;
            e.value = ">";
            $("#"+devKEY).after((e));
            //------为按钮创建样式------------
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML="#dataBtn";
            document.getElementsByTagName('HEAD').item(0).appendChild(style);
        }
    });

//    authData=ref.getAuth();
}
function userInfoShow(){
    ref.child("userInfo").once("value",function(snapshot){
        snapshot.forEach(function(snap){
            ukeystr=snap.key();
            //console.log(ukeystr);
            uvalues = snap.val();
//    userRef.on("child_changed",function(snapshot){
//        uKEY=snapshot.key();

        uCompanyStr="<li>"+"客户名称："+uvalues.company+"</li>";
        uSoftStr="<li>"+"软件版本："+uvalues.soft+"</li>";
        userInfoStr=uCompanyStr+uSoftStr;

        $("#userInfoShow").append(userInfoStr)
    })
    });
//    authData=ref.getAuth();
}
function valCompare(){

        if(counter.online<=historyCounter[counter.index]){
            console.log(counter.index+'设备已离线');
            $("#"+counter.key).css("color","gray");
            counter.online=0;
            historyCounter[counter.index]=0;
        }else{
            historyCounter[counter.index] = counter.online;

            console.log(counter.index+'设备已上线');
            $("#"+counter.key).css("color","red");
        }

}
function dataShowByID(dataKey){
    for(var i=0;i<dataShowById.length;i++){
        if(dataShowById[i]!==dataKey){
            ref.child("DebugInfo/"+dataShowById[i]).off("value");

        }
    }
    ref.child("DebugInfo/"+dataKey).on("value",function(snapshot) {

        devKEY = snapshot.key();
        devID = snapshot.child("devID").val();
        devINDEX = snapshot.child("index").val();
        devONLINE = snapshot.child("Online").val();
        dataFLAG = snapshot.child("dataFlag").val();

        counter={index:devINDEX,online:devONLINE,key:devKEY,id:devID};
        //devDIVStr="<div id='"+devKEY+"'>"+"</div>";
        devStr_IN="<div id='" + infoID_IN + "'>"+"<p>"+"dataFlage: "+dataFLAG+" " +"</p>"+"<p>"+ devID+"</p>"+"<p>"+devKEY+"</p>"+"<p>"+devONLINE+"</p>"+"</div>";
        devStr_OUT="<div id='" + infoID_OUT + "'>"+"<p>"+"dataFlage: "+dataFLAG+" " +"</p>"+"<p>"+ devID+"</p>"+"<p>"+devKEY+"</p>"+"<p>"+devONLINE+"</p>"+"</div>";
        devStr="<div id='" + infoID + "'>"+"<p>"+"dataFlage: "+dataFLAG+" " +"</p>"+"<p>"+ devID+"</p>"+"<p>"+devKEY+"</p>"+"<p>"+devONLINE+"</p>"+"</div>";

        devDIVStr="<div  name='#"+devKEY+"' id='"+devID+"'>"+"</div>";

        devId=$("#"+devID);
        devIndex=$("#"+devINDEX);
        //if(devKEY==dataKey){
            if(dataFLAG==1&&IN){
                $("#dataShow").prepend(devStr_IN);
                $("#"+infoID_IN).css("color","#E74C3C");
                infoID_IN++;

            }else if(dataFLAG==2&&OUT){
                $("#dataShow").prepend(devStr_OUT);

                $("#"+infoID_OUT).css("color","#2980B9");
                infoID_OUT++;
            }else if(dataFLAG==3&&ALL){
                $("#dataShow").prepend(devStr);
                $("#"+infoID).css("color","#27AE60");
            }
            infoID++;

    })
}


$(document).ready(function(){

    //------------------------------表单验证---------------------------//
    $('#signInForm').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {

            email: {
                validators: {
                    emailAddress: {
                        message: '输入不是有效的电子邮件地址'
                    },
                    notEmpty: {
                        message: '邮箱地址不能为空'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    }
                }
            }
        }
    });

    //Validate the form manually------点击按钮验证表单，实现用户登录
    $("#signIn-btn").click(function() {
        $('#signInForm').bootstrapValidator('validate');
        signIn()
    });
    authData=ref.getAuth();
    if(authData) {

        userInfoShow();
        devOnlineShow();
        //dataShow();
        /*$("").click(function(){
         dataShowByID();

         });*/
        $(document).delegate('#dataBtn', 'click', function () {
            dataKey = this.class;
            console.log(dataKey);
            dataShowByID(dataKey)
        });
        //$("#"+devKEY).click(function(){
        //    dataShow();
        //});

        $("#btnIn").click(function () {
            IN = true;
            OUT = false;
            ALL = false;
        });
        $("#btnOut").click(function () {
            OUT = true;
            IN = false;
            ALL = false;
        });
        $("#btnAll").click(function () {
            OUT = true;
            IN = true;
            ALL = true;
        });

    }else{
        history.forward(1);
    }
    //------------------------------点击按钮，用户退出登录
    $("#signOff-btn").click(function(){
        ref.unauth(function(err,data){
            if(err==null){
                console.log(err);
                alert("您已退出登录！");
                self.location="./signin.html"
            }
            else{
                console.log(data)
            }
        });
    });

});