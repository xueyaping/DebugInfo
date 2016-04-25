
/**
 * Created by Administrator on 16-3-23.
 */


var ref = new Wilddog("https://device-info.wilddogio.com/");
$(document).ready(function(){
    $("#regForm").validate({
        rules:{
            email:{
                required:true,
                email:true
            },
            password:{
                required:true,
                minlength:6,
                maxlength:16
            },
            confirm_password: {
                required: true,
                minlength: 6,
                maxlength:16,
                equalTo: "#password"
            }

        },
        message:{
            email:{
                required:"必填字段",
                email:"请正确填写邮箱及密码"
            },
            password:{
                required:"必填字段",
                minlength:"最小长度为6",
                maxlength:"最小长度为16"
            },
            confirm_password: {
                required: "请再次输入密码",
                minlength: "请输入长度为6-12位的密码",
                equalTo: "请输入相同的密码"
            }
        }
    });
    authData=getUsertId();
    $("#tip-push").show().text();
    //---------------------------------点击上按钮，向服务器推送用户输入数据
    $("#btn-push").click(function(){
            kh=$("#kh").val();
            bh=$("#bh").val();
            sb=$("#sb").val();
            so=$("#so").val();
            co=$("#co").val();
            po=$("#po").val();
            ph=$("#ph").val();
            dt=getTime();
            if((kh.length==0)&&(sb.length==0)){
                $("#tip-push").show().text("输入字符不能为空");
                return;
            }
            var authData=ref.getAuth();
            if(authData){
                c_ref = ref.child("deviceInfo").push({
                    company:kh,contact:co,position:po,phone:ph,email:authData.password.email,id:bh,model:sb,soft:so,date:dt
                },function(err1){
                    if(err1==null){
                        c_ref.update({"key_id":c_ref.key()})
                        ///to do
                    }
                });

            }
        }

    );

    showInfo();//调用数据显示函数

    //--------------------------------点击按钮，用户登录
    $("#regboxBtn").click(function(){
        $("#login").hide();
        $("#regbox").show(1000);

    });
    $("#closeBtn").click(function(){
        $("#regbox").hide();
        $("#login").show();
    });
    $("#loginBtn").click(function(){
        uemail=$("#userName").val();
        upw=$("#passWord").val();
        ref.authWithPassword({email:uemail,password:upw},
            function(err,data){
                if(err==null){
                    alert("您已登陆!");
                    self.location.reload();
                    $("#login").hide();
                    $("#pop").show(1000);
                    $("#userInfo").text("欢迎"+uemail+"用户登入系统!");
                }else if(uemail==null||uemail==""){
                    alert("输入字符不能为空!");
                }else if(upw==null||upw==""){
                    alert("密码不能为空!");
                }else{
                    alert("邮箱或密码有误!");
                }

            })
    });
    //------------------------------点击按钮，用户注册
    $("#regBtn").click(function(){

        remail=$("#ruserName").val();
        rpw=$("#rpassWord").val();
        if (remail.length==0||rpw.length==0) {
            alert("输入字符不能为空");
            return;

        }
        // ref.onAuth(authDataCallback);
        ref.createUser({email:remail,password:rpw},function(error,data){
            console.log(rpw);

            if(error==null){
                console.log("欢迎" );
                alert('注册成功！'+'<br>'+remail);
                setTimeout(backlog(),1000);
                ref.child("users").push({email:remail,name:rpw});
            }
            else{
                switch(error.code){
                    case "authentication_disabled":
                        console.log("指定的认证方式在当前WildDog应用下被禁用。");
                        break;
                    case "email_taken":
                        alert("无法注册用户，因为Email已经被使用。");
                        break;
                    case "invalid_arguments":
                        console.log("参数错误");
                        break;
                    case "invalid_credentials":
                        console.log("提供用于OAuth认证的credential错误。可能是格式错误或已过期");
                        break;

                    case "invalid_email":
                        alert("Email地址或密码不合法");
                        break;
                    case "invalid_origin":
                        console.log("请求的来源域名不在白名单中。这是一个安全错误");
                        break;
                    case "provider_error":
                        console.log("第三方平台错误");
                        break;
                    default:
                        console.log("Error logging user in:", error);
                        alert("请正确填写邮箱及密码",error);
                }

            }
        });

    });

    //------------------------------点击按钮，用户退出登录
    $("#logout").click(function(){
        ref.unauth(function(err,data){
            if(err==null){
                console.log(err);
                alert("您已退出登录！");
                $("#pop").hide();
                $("#login").show();
            }
            else{
                console.log(data)
            }
        });
    });

});
