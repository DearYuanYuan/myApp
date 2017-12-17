import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    PickerIOS,
    PickerItemIOS,
    TouchableHighlight,
    ScrollView,
    TextInput,
    StatusBar,
    ActivityIndicator,
    Alert
} from 'react-native';
import assets from '../style/assets'
import styles from '../style/style'
import Icon from 'react-native-vector-icons/Ionicons'
import Picker from './picker'
import TouchableButton from './button'
import fontsize from './plug/fontSize'
let fentchUrl = 'http://139.196.253.89:8080'
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
        var rePwd = /^[a-zA-Z0-9_]{6,18}$/
        var itemArr = [{value:this.state.oldPassword,msg:'请输入旧密码'},
                      {value:this.state.password,msg:'请输入新密码'},
                      {value:this.state.rePassword,msg:'请再次输入密码'},]
        var result = itemArr.every((item)=>{
          if(item.value==''){
            this.setState({
              errorMsg:item.msg,
            })
          }
            return item.value!=''
        })
        if(!result){
          return;
        }else if(!rePwd.test(this.state.password)){
          this.setState({
            errorMsg:'请输入6-18位数字字母下划线组成的密码',
          })
        }else if(this.state.password!=this.state.rePassword){
          this.setState({
            errorMsg:'两次输入密码不一致',
          })
        }else{
          this.setState({
            errorMsg:'',
            showActionLoading:true,
          })
          var formData = new FormData();
          formData.append('password',this.state.oldPassword)
          formData.append('newpassword',this.state.password)
          fetch(fentchUrl+'/api/chain_user/modify/',
          {
            method:'POST',
            body:formData,
          })
          .then((response) => {return response.json()})  
          .then((responseJson) => {
            // alert(JSON.stringify(responseJson))
            if(responseJson.code==200){
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
              this.setState({
                errorMsg:responseJson.message,
                showActionLoading:false,
              })
            }
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
            this.setState({
              errorMsg:'服务器繁忙，请稍后重试~',
              showActionLoading:false
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
