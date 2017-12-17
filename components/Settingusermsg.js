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
    ActivityIndicator,
    StatusBar,
    Alert
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import assets from '../style/assets'
import styles from '../style/style'
import Icon from 'react-native-vector-icons/Ionicons'
import Picker from './picker'
import TouchableButton from './button'
import fontsize from './plug/fontSize'
let fentchUrl = 'http://139.196.253.89:8080'
//图片选择器
var ImagePicker = require('react-native-image-picker');

//图片选择器参数设置
var options = {
    title: '选择图片', 
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',//是否可以拍照 
    chooseFromLibraryButtonTitle: '相册', 
    cameraType: '返回',
    mediaType: '相册',
    // videoQuality: 'high', 
    // durationLimit: 10,
    // maxWidth: 600,
    // maxHeight: 600,
    // aspectX: 2, 
    // aspectY: 1,
    // quality: 0.8,
    // angle: 0,
    allowsEditing: false,
    noData: false,
    storageOptions: { 
        skipBackup: true, 
        path: 'images'
    }
};
export default class Settingusermsg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showActionLoading:false,//发起请求loading显示
            errorMsg:'',//错误信息提示
            userRealname:'',//用户名的真实姓名
            userJob:'',//用户职位
            userDep:'',//用户部门
            userPhone:'',//用户手机号
            userEmail:'',//用户邮箱
            userPhoto:'',//用户头像
            password:'',//密码
            rePassword:'',//再次输入密码
            avatarSource: null,//用户上传新头像的图片显示
            fileSize:false,//新上传头像的大小
        }
    };
    static navigationOptions = ({navigation,screenProps})=>({
        title:'修改个人信息',
        headerLeft:<Text style={{ paddingLeft: 10,color: '#F28321',fontSize:18}} suppressHighlighting={true}
                    onPress={() =>{navigation.state.params.cancleAdd()}}>取消</Text>,
        headerTitleStyle: {
            fontSize:fontsize(17),
            color:'#000'
        },
        headerBackTitleStyle: {
            fontSize:fontsize(17),
        },
    })
    /*
    加载当前的个人信息
    */
    loadUsrCurrentMsg(){
        fetch(fentchUrl+'/api/chain_user/query_detail/',
        {
          method:'POST',
        })
        .then((response) => {return response.json()})  
        .then((responseJson) => {
        //   alert(JSON.stringify(responseJson))
          if(responseJson.code==200){
            this.setState({
                userRealname:responseJson.user_detail.name,
                userJob:responseJson.user_detail.job,
                userDep:responseJson.user_detail.department,
                userPhone:responseJson.user_detail.phone,
                userEmail:responseJson.user_detail.email,
                userPhoto:responseJson.user_detail.photo,
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
            return;
          }
        })
        .catch((error)=>{
          return;
        })
    }
    /*
    取消修改个人信息
    */
    cancleAdd(){
        const {navigate} = this.props.navigation
        navigate('Home',{})
    }
    /*
    确认修改信息
    */
    onButtonPress(){
        var itemArr = [{value:this.state.userRealname,regexp:/^[\u4e00-\u9fa5a-zA-Z]{2,20}$/,errorMsg:'请输入姓名：2-20位字母或汉字'},
        {value:this.state.userJob,regexp:/^[\u4e00-\u9fa5a-zA-Z]{1,20}$/,errorMsg:'请输入职位：1-20位字母或汉字'},
        {value:this.state.userDep,regexp:/^[\u4e00-\u9fa5a-zA-Z]{1,20}$/,errorMsg:'请输入部门：1-20位字母或汉字'},
        {value:this.state.userPhone,regexp:/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/,errorMsg:'请输入手机号码：例如：13812344321'},
        {value:this.state.userEmail,regexp:/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,errorMsg:'请输入邮箱：xxx@xxx.com'},]

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
              errorMsg:'',
              showActionLoading:true,
            })
            var formData = new FormData();
            //判断若有头像修改，则想后端传入file参数
            if(this.state.avatarSource){
                let file = {uri: this.state.avatarSource.uri, type: 'multipart/form-data', name: 'image.jpg'}; 
                formData.append('file',file)
            }
            
            formData.append('name',this.state.userRealname)
            formData.append('phone',this.state.userPhone)
            formData.append('email',this.state.userEmail)
            formData.append('job',this.state.userJob)
            formData.append('department',this.state.userDep)
         
            fetch(fentchUrl+'/api/chain_user/modify/',
            {
              method:'POST',
              body:formData,
            })
            .then((response) => {return response.json()})  
            .then((responseJson) => {
            //   alert(JSON.stringify(responseJson))
              if(responseJson.code==200){
                this.setState({
                  errorMsg:responseJson.message,
                })
                this.loadUsrCurrentMsg()
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
              //用户信息修改成功后，1秒后跳转到首页
              setTimeout(()=>{
                this.setState({
                    errorMsg:'',
                  })
                  const {navigate} = this.props.navigation
                  navigate('Home',{})
              },1000)
            })
            .catch((error)=>{
              this.setState({
                errorMsg:'服务器繁忙，请稍后重试~',
                showActionLoading:false,
              })
            })
        }
    }
    /*
    修改密码
    */
    changePwdScreen(){
        const {navigate} = this.props.navigation
        navigate('Settingpassword',{})
    }
    /*
    注销
    */
    logout(){
        fetch(fentchUrl+'/api/logout/',
        {
          method:'POST',
        })
        .then((response) => {return response.json()})  
        .then((responseJson) => {
            const {navigate} = this.props.navigation
            navigate('Login',{})
        })
        .catch((error)=>{
            const {navigate} = this.props.navigation
            navigate('Login',{})
        })
        
    }
    componentWillMount(){
        //获取个人信息
        this.loadUsrCurrentMsg();
    }
    componentDidMount(){
        //取消修改个人信息
        this.props.navigation.setParams({
            cancleAdd:()=>{ return this.cancleAdd()}
          })
    }
    /*
    选择手机相册里的图片
    */
    selectPhoto(){
        ImagePicker.showImagePicker(options, (response) => {
            // console.log('Response = ', response);
            if (response.error) {
              alert("ImagePicker发生错误：" + response.error);
            }
            else {
            //   let source = { uri: response.uri };
              // You can also display the image using data: 转为二进制流
              let source = { uri: 'data:image/jpeg;base64,' + response.data };
              let size = response.fileSize;
              //当图片大于250kb
              if(response.fileSize/1024>250){
                this.setState({
                    fileSize:'头像大小为'+parseInt(response.fileSize/1024)+'kb,请选择250kb以内的头像',
                  });
              }else{
                this.setState({
                    avatarSource: source,
                    fileSize:false,
                  });
              }
             
              
            }
        });
    }
    
    render() {
        return (
            <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={styles.usrSetCover}
            scrollEnabled={true}>
            <StatusBar barStyle={'default'} />
                <View style={styles.setUsrIconCover}>
                    <View style={styles.setUsrIcon}>
                        <Image style={styles.userPhoto}
                            source={this.state.avatarSource?this.state.avatarSource:this.state.userPhoto==null?require('../image/Avatar.png'):{uri:fentchUrl+this.state.userPhoto}}>
                        </Image>
                    </View>
                    {/* todo  更换头像 */}
                    <Text style={styles.changeIconBtn} onPress={this.selectPhoto.bind(this)}>更换头像</Text>
                    {
                        this.state.fileSize &&
                        <Text style={styles.errorMsg}>{this.state.fileSize}</Text>
                    }
                </View>
                
                <View style={assets.addAssetsOptionBox}>
                    <Text style={assets.addAssetsTitleFont}>姓名</Text>
                    <TextInput style={styles.usrMsgIpt} returnKeyType='done'
                    onChangeText = {(userRealname) => this.setState({userRealname})}
                    value = {this.state.userRealname}></TextInput>
                </View>
                <View style={assets.addAssetsOptionBox}>
                    <Text style={assets.addAssetsTitleFont}>职位</Text>
                    <TextInput style={styles.usrMsgIpt} returnKeyType='done'
                    onChangeText = {(userJob) => this.setState({userJob})}
                    value = {this.state.userJob}></TextInput>
                </View>
                <View style={assets.addAssetsOptionBox}>
                    <Text style={assets.addAssetsTitleFont}>部门</Text>
                    <TextInput style={styles.usrMsgIpt} returnKeyType='done'
                    onChangeText = {(userDep) => this.setState({userDep})}
                    value = {this.state.userDep}></TextInput>
                </View>
                <View style={assets.addAssetsOptionBox}>
                    <Text style={assets.addAssetsTitleFont}>电话</Text>
                    <TextInput style={styles.usrMsgIpt}  returnKeyType='done'
                    onChangeText = {(userPhone) => this.setState({userPhone})}
                    value = {this.state.userPhone}></TextInput>
                </View>
                <View style={assets.addAssetsOptionBox}>
                    <Text style={assets.addAssetsTitleFont}>邮箱</Text>
                    <TextInput style={styles.usrMsgIpt} returnKeyType='done'
                    onChangeText = {(userEmail) => this.setState({userEmail})}
                    value = {this.state.userEmail}></TextInput>
                </View>
                <View style={assets.addAssetsOptionBox}>
                    <Text style={assets.addAssetsTitleFont}>密码</Text>
                    <TouchableHighlight style={styles.changePwdBtn}>
                        <Text style={styles.changePwd} onPress={this.changePwdScreen.bind(this)} suppressHighlighting={true}>
                        <Icon name="md-lock" size={20} style={styles.changePwdIcon}></Icon> 修改密码</Text>
                    </TouchableHighlight>
                </View>
                {
                    this.state.showActionLoading &&
                    <View style={styles.actionLoading}>
                        <ActivityIndicator color='#F28321'/>
                    </View>
                    
                }
                
                <Text style={styles.errorMsg}>{this.state.errorMsg}</Text>
                {
                    !this.state.showActionLoading &&
                    <View style={assets.createAssetsBtn}>
                        <TouchableButton title='更新信息' onButtonPress = {this.onButtonPress.bind(this)}/>
                    </View>
                }
               
                <View style={assets.addAssetsErr}>
                    <Text  style={styles.changePwd} onPress = {this.logout.bind(this)}>账户注销</Text>
                </View>
                
                
                
            </KeyboardAwareScrollView>
           
        );
    }
}
