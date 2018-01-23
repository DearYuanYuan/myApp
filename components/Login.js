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

import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';

let fentchUrl = 'http://140.143.202.114:8080'

var storage = new Storage({
  // 最大容量，默认值1000条数据循环存储
  size: 10,

  // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
  // 如果不指定则数据只会保存在内存中，重启后即丢失
  storageBackend: AsyncStorage,
    
  // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
  defaultExpires: null,
    
  // 读写时在内存中缓存数据。默认启用。
  enableCache: true,
    
  // 如果storage中没有相应数据，或数据已过期，
  // 则会调用相应的sync方法，无缝返回最新数据。
  // sync方法的具体说明会在后文提到
  // 你可以在构造函数这里就写好sync的方法
  // 或是在任何时候，直接对storage.sync进行赋值修改
  // 或是写到另一个文件里，这里require引入
  // sync: require('你可以另外写一个文件专门处理sync')  
  	
})  

export default class Login extends Component{
  constructor(props) {
    super(props);
    this.state = {
      errorMsg:'', //错误提示
      username:'yuanyuan', //用户名
      password:'111111',//密码
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
        // showLoginLoading:true,
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
        // 使用key和id来保存数据，一般是保存同类别（key）的大量数据。
        // 所有这些"key-id"数据共有一个保存上限（无论是否相同key）
        // 即在初始化storage时传入的size参数。
        // 在默认上限参数下，第1001个数据会覆盖第1个数据。
        // 覆盖之后，再读取第1个数据，会返回catch或是相应的sync方法。
        var userMsg = {
          username: this.state.username,
          password: this.state.password,
        };
        if(responseJson.code==200){
          storage.save({
            key: 'user',  // 注意:请不要在key中使用_下划线符号!
            data: userMsg,
            id: '11', 
            // 如果不指定过期时间，则会使用defaultExpires参数
            // 如果设为null，则永不过期
            expires: null
          });
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
  componentDidMount(){
    //load 读取用户账户密码信息
    storage.load({
      key: 'user',
      id: '11'
    }).then(ret => {
      // 如果找到数据，则在then方法中返回
      this.setState({
        username:ret.username,
        password:ret.password
      })
    }).catch(err => {
      // 如果没有找到数据且没有sync方法，
      // 或者有其他异常，则在catch中返回
      this.setState({
        username:'',
        password:'',
      })
    })
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

