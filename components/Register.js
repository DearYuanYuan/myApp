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
  TextInput,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styles from '../style/style'
import TouchableButton from './button'
import Icon from 'react-native-vector-icons/Ionicons';
import fontsize from './plug/fontSize'
let fentchUrl = 'http://140.143.202.114:8080'
export default class Register extends Component{
  constructor(props) {
    super(props);
    this.state = {
      stepIndex:1,//用户注册当前走到哪一步，默认是第一步
      errorMsg:'',
      userRealname:'',
      username:'',
      userJob:'',
      userPhone:'',
      userEmail:'',
      password:'',
      rePassword:'',
    }
  };
  static navigationOptions = {
    title:'填写个人信息',
    gesturesEnabled:false,
    headerTitleStyle: {
      // backgroundColor:'#ccc',
      color: '#fff',
      },
      headerTitleStyle: {
        fontSize:fontsize(17),
        color:'#fff'
      },
      headerBackTitleStyle: {
        fontSize:fontsize(17),
      },
      headerStyle: {
        backgroundColor: '#18283B',// 设置导航栏的背景颜色,headerTintColor设置无效
        borderBottomColor: '#18283B',
        paddingLeft: 10,
        paddingRight: 10,
      },
  }
  //点击
  onButtonPress(){
    //当在第一个步骤时点击下一步
    if(this.state.stepIndex==1){
      var itemArr = [{value:this.state.userRealname,regexp:/^[\u4e00-\u9fa5a-zA-Z]{2,20}$/,errorMsg:'请输入姓名：2-20位字母或汉字'},
                    {value:this.state.username,regexp:/^[_a-zA-Z0-9]{2,20}$/,errorMsg:'请输入用户名：2-20位字母数字下划线'},
                    {value:this.state.userJob,regexp:/^[\u4e00-\u9fa5a-zA-Z]{1,20}$/,errorMsg:'请输入职位：1-20位字母或汉字'},
                    {value:this.state.userPhone,regexp:/^((\+?86)|(\(\+86\)))?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/,errorMsg:'请输入手机号码：例如：13812344321或者+8613812344321'},
                    {value:this.state.userEmail,regexp:/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,errorMsg:'请输入邮箱：xxx@xxx.xxx'},]
                  
      var regexp = itemArr.every((item)=>{
        if(!item.regexp.test(item.value)){
          this.setState({
            errorMsg:item.errorMsg,
          })
        }
          return item.regexp.test(item.value)
      })
      if(!regexp){
        return;
      }else{
        this.setState({
          stepIndex:this.state.stepIndex+1,
          errorMsg:'',
        })
      }
    }
    //当在第二个步骤时点击下一步
    else if(this.state.stepIndex==2){
      var rePwd = /^[a-zA-Z0-9_]{6,18}$/
      var itemArr = [{value:this.state.password,msg:'请输入密码'},
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
          stepIndex:this.state.stepIndex+1,
          errorMsg:'',
        })
      }
    }
    //当在第三个步骤时点击申请
    else{
      this.setState({
        stepIndex:false,
        errorMsg:'提交申请中，请等待'
      })
      var formData = new FormData();
      formData.append('name',this.state.userRealname)
      formData.append('username',this.state.username)
      formData.append('phone',this.state.userPhone)
      formData.append('email',this.state.userEmail)
      formData.append('job',this.state.userJob)
      formData.append('password',this.state.password)
      fetch(fentchUrl+'/api/register/',
      {
        method:'POST',
        body:formData,
      })
      .then((response) => {return response.json()})  
      .then((responseJson) => {
        // alert(JSON.stringify(responseJson))
        if(responseJson.code==200){
          this.setState({
            errorMsg:responseJson.message+'，两秒后跳转到登陆界面',
          })
          setTimeout(()=>{
            const {navigate} = this.props.navigation
            navigate('Login')
          },2000)
          
        }else{
          this.setState({
            errorMsg:responseJson.message,
          })
        }
      })
      .catch((error)=>{
        this.setState({
          errorMsg:'服务器繁忙，请稍后重试~',
        })
      })
    }
    
  }
  render() {
    return (
      <KeyboardAwareScrollView style={{backgroundColor:'#213144'}}
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={styles.container}
      scrollEnabled={true}>
      <StatusBar barStyle={'light-content'} />
        {
          this.state.stepIndex && 
          <View style={styles.registerStep}>
          
             <View style={styles.stepBox}>
               <View style={this.state.stepIndex==1?[styles.stepIcon,styles.stepIconActive]:[styles.stepIcon]}><Text style={styles.stepNum}>1</Text></View>
               <Text style={this.state.stepIndex==1?[styles.stepTips,styles.stepTipsActive]:[styles.stepTips]}>填写个人信息</Text>
             </View>
             <View style={styles.stepLine}></View>
             <View style={styles.stepBox}>
             <View style={this.state.stepIndex==2?[styles.stepIcon,styles.stepIconActive]:[styles.stepIcon]}><Text style={styles.stepNum}>2</Text></View>
               <Text style={this.state.stepIndex==2?[styles.stepTips,styles.stepTipsActive]:[styles.stepTips]}>设置密码</Text>
             </View>
             <View style={styles.stepLine}></View>
             <View style={styles.stepBox}>
             <View style={this.state.stepIndex==3?[styles.stepIcon,styles.stepIconActive]:[styles.stepIcon]}><Text style={styles.stepNum}>3</Text></View>
               <Text style={this.state.stepIndex==3?[styles.stepTips,styles.stepTipsActive]:[styles.stepTips]}>提交审核</Text>
             </View>
             
          </View>
        }
         
         {
           this.state.stepIndex==1 &&
           <View style = {styles.registerContainer}>
            <ScrollView style={styles.registerStepFirstBox} showsVerticalScrollIndicator={true}>
              <View>
                <Text style={styles.LoginTip}>姓名</Text>
                <TextInput style={styles.loginInput} placeholderTextColor='#2E4663' returnKeyType='done'
                  placeholder={'姓名'} onChangeText = {(userRealname) => this.setState({userRealname})}
                  value={this.state.userRealname} 
                ></TextInput>
              </View>
              <View>
                <Text style={styles.LoginTip}>用户名</Text>
                <TextInput style={styles.loginInput} placeholderTextColor='#2E4663' returnKeyType='done'
                  placeholder={'用户名'} onChangeText = {(username) => this.setState({username})}
                  value={this.state.username} 
                ></TextInput>
              </View>
              <View>
                <Text style={styles.LoginTip}>职位</Text>
                <TextInput style={styles.loginInput} placeholderTextColor='#2E4663' returnKeyType='done'
                  placeholder={'职位'} onChangeText = {(userJob) => this.setState({userJob})}
                  value={this.state.userJob} 
                ></TextInput>
              </View>
              <View>
                <Text style={styles.LoginTip}>电话</Text>
                <TextInput style={styles.loginInput} placeholderTextColor='#2E4663' returnKeyType='done'
                  placeholder={'手机号码'} onChangeText = {(userPhone) => this.setState({userPhone})}
                  value={this.state.userPhone} 
                ></TextInput>
              </View>
              <View>
                <Text style={styles.LoginTip}>邮箱</Text>
                <TextInput style={styles.loginInput} placeholderTextColor='#2E4663' returnKeyType='done'
                  placeholder={'电子邮箱'} onChangeText = {(userEmail) => this.setState({userEmail})}
                  value={this.state.userEmail} 
                ></TextInput>
              </View>
              
              <TouchableButton title='下一步' onButtonPress = {this.onButtonPress.bind(this)}/>
              <Text style={styles.errorMsg}>{this.state.errorMsg}</Text>
              </ScrollView>
           </View>
         }
         {
           this.state.stepIndex==2 &&
           <View style = {styles.registerContainer}>
              <View>
                <Text style={styles.LoginTip}>密码</Text>
                <TextInput style={styles.loginInput} secureTextEntry={true} placeholderTextColor='#2E4663'
                  placeholder={'密码'} onChangeText = {(password) => this.setState({password})}
                  value={this.state.password} returnKeyType='done'
                ></TextInput>
              </View>
              <View>
                <Text style={styles.LoginTip}>重复输入密码</Text>
                <TextInput style={styles.loginInput} secureTextEntry={true} placeholderTextColor='#2E4663'
                  placeholder={'重复密码'} onChangeText = {(rePassword) => this.setState({rePassword})}
                  value={this.state.rePassword} returnKeyType='done'
                ></TextInput>
              </View>
              <TouchableButton title='下一步' onButtonPress = {this.onButtonPress.bind(this)}/>
              <Text style={styles.errorMsg}>{this.state.errorMsg}</Text>
           </View>
         }
         {
           this.state.stepIndex==3 &&
           <View style = {styles.registerContainer}>
              
              <View>
                <Text style={styles.LoginTip}>注意事项</Text>
                <Text style={styles.registerTip}>点击申请权限后，您填写的资料将发送给管理员审核，请耐心等待。审核通过后，您就可以使用您设定的用户名和密码登陆系统了</Text>
              </View>
              <TouchableButton title='申请权限' onButtonPress = {this.onButtonPress.bind(this)} />
           </View>
         }
         {
           this.state.stepIndex == false && 
           <View>
             <ActivityIndicator color='#F28321' style={{marginBottom:20}}/>
             <Text style={styles.errorMsg}>{this.state.errorMsg}</Text>
           </View>
           
         }
      </KeyboardAwareScrollView>
    );
  }
}

