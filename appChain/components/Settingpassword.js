/*
    用户密码修改
        需要填写旧密码，然后输入新密码两次
        修改之后2s会跳转到用户信息界面
        修改成功或者失败都会有信息提示
*/
import React from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TextInput,
    StatusBar,
    ActivityIndicator,
    Alert
} from 'react-native';
//css样式文件
import assets from '../style/assets'
//css样式文件
import styles from '../style/style'
//字体图标文件
import Icon from 'react-native-vector-icons/Ionicons'
//下拉选择框组件
import Picker from './picker'
//公共按钮组件
import TouchableButton from './button'
//引入字体自适应文件
//由于iphone屏幕尺寸不同，需要根据尺寸调整字体大小
import fontsize from './plug/fontSize'
//后台接口请求地址
let fentchUrl = 'http://140.143.202.114:8080'
export default class Settingpassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username:'',//用户名
            showActionLoading:false,
            errorMsg:'',//错误信息提示
            oldPassword:'',//旧密码
            password:'',//新密码
            rePassword:'',//重复新密码
        }
    };
    static navigationOptions = ({navigation,screenProps})=>({
        title:'修改密码',
        headerTitleStyle: {
            fontSize:fontsize(17),
            color:'#000'
        },
        headerBackTitleStyle: {
            fontSize:fontsize(17),
        },
    })
    /*
    确认修改密码
    */
    onButtonPress(){
        //初始化密码正则验证
        var rePwd = /^[a-zA-Z0-9_]{6,18}$/
        //正则匹配失败提示信息
        var itemArr = [{value:this.state.oldPassword,msg:'请输入旧密码'},
                      {value:this.state.password,msg:'请输入新密码'},
                      {value:this.state.rePassword,msg:'请再次输入密码'},]

        //将表单的每一项都进行非空验证
        
        var result = itemArr.every((item)=>{
          if(item.value==''){
            this.setState({
              errorMsg:item.msg, //提示输入对应的某一个表单
            })
          }
            return item.value!=''
        })
        /*
        将表单的每一项都进行正则验证
        */
        if(!result){
          return;
        }else if(!rePwd.test(this.state.password)){
          //正则验证密码--6-18位数字字母下划线
          this.setState({
            errorMsg:'请输入6-18位数字字母下划线组成的密码',
          })
        }else if(this.state.password!=this.state.rePassword){
          //两次密码输入不一致
          this.setState({
            errorMsg:'两次输入密码不一致',
          })
        }else{
          //密码正则验证通过，发起修改密码请求
          this.setState({
            errorMsg:'',//错误信息提示清空
            showActionLoading:true, //修改密码请求中，button隐藏不可点击，显示loading
          })
          var formData = new FormData();
          formData.append('password',this.state.oldPassword) //旧密码
          formData.append('newpassword',this.state.password) //新密码
          fetch(fentchUrl+'/api/chain_user/modify/',
          {
            method:'POST',
            body:formData,
          })
          .then((response) => {return response.json()})  
          .then((responseJson) => {
            // alert(JSON.stringify(responseJson))
            if(responseJson.code==200){
              //修改成功
              this.setState({
                errorMsg:responseJson.message, 
              })
            }else if(responseJson.code==210){
                //登录超时
                Alert.alert(
                  '登录超时',
                  '',
                  [
                    {text: '请重新登录', 
                    onPress: () => {
                      const {navigate} = this.props.navigation
                      navigate('Login',{})
                    }}
                  ],
                  { cancelable: false }
                )
        
              }else{
                //发生错误
                this.setState({
                    errorMsg:responseJson.message,//提示发生错误的原因
                    showActionLoading:false,//修改button显示
                })
            }
            //不管是否修改成功，都返回用户信息界面
            setTimeout(()=>{
              this.setState({
                  errorMsg:'',
                })
                //回到账户设置界面
                const {navigate} = this.props.navigation
                navigate('Settingusermsg',{})
            },2000)
          })
          .catch((error)=>{
            //错误
            this.setState({
              errorMsg:'服务器繁忙，请稍后重试~',
              showActionLoading:false //修改button显示
            })
          })
        }
    }
   
    componentWillMount(){
        this.setState({
            username:this.props.navigation.state.params.username, //从Home组件传递的参数，最终回到Home页还是传递回去
        })
    }
    componentDidMount(){
        
    }
    
    render() {
        return (
            <ScrollView style={styles.usrSetCover}>
            {/* StatusBar:是app状态栏的颜色 默认白底黑字*/}
            {/*barStyle={'light-content'} 是app设置的底色，白色字体  */}
            <StatusBar barStyle={'default'} />
                <View style={assets.addAssetsOptionBox}>
                    <Text style={assets.addAssetsTitleFont}>旧密码</Text>
                    <TextInput style={styles.usrMsgIpt} secureTextEntry={true} returnKeyType='done'
                    onChangeText = {(oldPassword) => this.setState({oldPassword})}
                    value = {this.state.oldPassword}></TextInput>
                </View>
                <View style={assets.addAssetsOptionBox}>
                    <Text style={assets.addAssetsTitleFont}>新密码</Text>
                    <TextInput style={styles.usrMsgIpt} secureTextEntry={true} returnKeyType='done'
                    onChangeText = {(password) => this.setState({password})}
                    value = {this.state.password}></TextInput>
                </View>
                <View style={assets.addAssetsOptionBox}>
                    <Text style={assets.addAssetsTitleFont}>再次输入新密码</Text>
                    <TextInput style={styles.usrMsgIpt} secureTextEntry={true} returnKeyType='done'
                    onChangeText = {(rePassword) => this.setState({rePassword})}
                    value = {this.state.rePassword}></TextInput>
                </View>
                {
                    this.state.showActionLoading &&
                    <View style={styles.actionLoading}>
                        <ActivityIndicator color='#F28321'/>
                    </View>
                    
                }
                {
                    !this.state.showActionLoading &&
                    <View style={assets.createAssetsBtn}>
                        <TouchableButton title='确认修改密码' onButtonPress = {this.onButtonPress.bind(this)}/>
                    </View>
                }
                
                <View style={assets.addAssetsErr}>
                    <Text style={styles.errorMsg}>{this.state.errorMsg}</Text>
                </View>
                
                
            </ScrollView>
           
        );
    }
}
