import React, { Component } from 'react';
import {
  AppRegistry,
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  Button,
  Image,
  StatusBar,
  TextInput,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styles from '../style/style'
import TouchableButton from './button'
import Icon from 'react-native-vector-icons/Ionicons';
let fentchUrl = 'http://139.196.253.89:8080'

export default class Login extends Component{
  constructor(props) {
    super(props);
    this.state = {
      errorMsg:'', //错误提示
      username:'', //用户名
      password:'',//密码
      showLoginLoading:false,//loading加载动画
    }
  };
  //动态设置头部按钮点击事件
  static navigationOptions = ({navigation,screenProps})=>({
    gesturesEnabled:false,
  })
  /*
  登陆按钮点击-后台请求接口
  */
  onButtonPress(){
    /*
    const {navigate} = this.props.navigation
    navigate('Home',{username:'umm',department:'开发工程师'})
    */
    /**/
    if(this.state.username==''||this.state.password==''){
      //判断用户名密码是否为空
      this.setState({
        errorMsg:'请填写用户名密码'
      })
    }else{
      this.setState({
        errorMsg:'',
        showLoginLoading:true,
      })
      var formData = new FormData();
      formData.append('username',this.state.username)
      formData.append('password',this.state.password)
      fetch(fentchUrl+'/api/login/',
      {
        method:'POST',
        body:formData,
      })
      .then((response) => {return response.json()})  
      .then((responseJson) => {
        // alert(JSON.stringify(responseJson))
        if(responseJson.code==200){
          const {navigate} = this.props.navigation
          navigate('Home',{username:this.state.username})
        }else{
          this.setState({
            errorMsg:responseJson.message,
            showLoginLoading:false,
          })
        }
      })
      .catch((error)=>{
        this.setState({
          errorMsg:'服务器繁忙，请稍后重试~',
          showLoginLoading:false,
        })
      })
    }
    
    
  }
  /*
  注册
  */
  register(){
    const {navigate} = this.props.navigation
    navigate('Register')
  }
  render() {
    return (
      <KeyboardAwareScrollView
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={styles.container}
      scrollEnabled={false}>
      <StatusBar barStyle={'light-content'} />
          <View style={styles.loginTitleContainer}>
            <Image
              style = {styles.logo}
              source={require('../image/logo.png')}>
            </Image>
            <Text style={styles.title}>
              区块链用户端
            </Text>
          </View>
         <View style = {styles.loginContainer}>
            <View>
              <Text style={styles.LoginTip}>用户名</Text>
              <TextInput style={styles.loginInput} placeholderTextColor='#2E4663' returnKeyType='done'
                placeholder={'用户名'} onChangeText = {(username) => this.setState({username})}
                value={this.state.username} 
              ></TextInput>
            </View>
            <View>
              <Text style={styles.LoginTip}>密码</Text>
              <TextInput style={styles.loginInput} placeholderTextColor='#2E4663' returnKeyType='done'
                  secureTextEntry={true} placeholder={'密码'} onChangeText = {(password) => this.setState({password})}
                  value = {this.state.password}
              ></TextInput>
            </View>
            <Text style={styles.errorMsg}>{this.state.errorMsg}</Text>
        </View>
        <View style={styles.loginBtnActionCover}>
        {
          this.state.showLoginLoading &&
          <View style={styles.actionLoading}>
            <ActivityIndicator color='#F28321'/>
          </View>
          
        }
                {
          !this.state.showLoginLoading &&
          <TouchableButton title='登录' onButtonPress = {this.onButtonPress.bind(this)}/>
        }
          
           <Text style={styles.applyAccountLink} onPress={this.register.bind(this)}>还没有账号，申请权限 > </Text> 
           
        </View> 

       
      </KeyboardAwareScrollView>
    );
  }
}

