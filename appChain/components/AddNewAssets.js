/*
    新建资产界面
    需要选择资产类型、填写资产内容或者上传附件
    点击创建资产，创建成功后跳转到资产列表首页
*/

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
//资产首页资产列表单条资产组件
import assets from '../style/assets' 
//css样式文件
import styles from '../style/style'
//字体图标插件
import Icon from 'react-native-vector-icons/Ionicons'
//下拉框选择组件
import Picker from './picker'
//公共按钮组件
import TouchableButton from './button'
//引入字体自适应文件
//由于iphone屏幕尺寸不同，需要根据尺寸调整字体大小
import fontsize from './plug/fontSize'
//后台接口请求地址
let fentchUrl = 'http://140.143.202.114:8080'

//图片选择器
var ImagePicker = require('react-native-image-picker');

//图片选择器参数设置
var options = {
    title: '选择附件', 
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '',//是否可以拍照 
    chooseFromLibraryButtonTitle: '相册', 
    cameraType: '返回',
    mediaType: 'mixed',
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
export default class AddNewAssets extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            typeAssets:false,//资产类型 
            optionValue:'', //后台传参
            selectOption:'', //页面显示的文字
            showPickerBox:false,//是否显示下拉框
            assetsContent:'',//资产内容
            errorMsg:'',//错误提示
            showActionLoading:false,//显示loading
            fileName:false,//显示上传的图片名称
            avatarSource: null,//用户上传新头像的图片显示
            fileSize:false,//新上传头像的大小
            dataName:'', //传入picker组件---下拉列表对象的属性名，不同的后台接口返回的参数不同
            dataKey:''//传入picker组件---下拉列表对象的属性名，不同的后台接口返回的参数不同
        }
    };
    static navigationOptions = ({navigation,screenProps})=>({
        title:'新建资产',
        headerLeft:<Text style={{ paddingLeft: 10,color: '#F28321',fontSize:fontsize(18)}} 
                    onPress={() =>{navigation.state.params.cancleAdd()}} suppressHighlighting={true}>取消</Text>,
        headerTitleStyle: {
            fontSize:fontsize(17),
            color:'#000'
        },
        headerBackTitleStyle: {
            fontSize:fontsize(17),
        },
    })
    
    /*
    取消新增资产
    */
    cancleAdd(){
        const {navigate} = this.props.navigation
        navigate('Home',{})
    }
    /*
    点击下拉框
    */
    
    showSelectPicker(){
        this.setState({
            showPickerBox:!this.state.showPickerBox,//是否显示下拉框
            dataName:'name', //传入picker组件---下拉列表对象的属性名，不同的后台接口返回的参数不同
            dataKey:'key'//传入picker组件---下拉列表对象的属性名，不同的后台接口返回的参数不同
        })
    }
    /*
    选择下拉框某一条
    :key,//后台需要的参数
    :name, //页面下拉框显示的文字
    */
    pickerValue(name,key){
        this.setState({
            optionValue:key,//后台需要的参数
            selectOption:name, //页面下拉框显示的文字
            showPickerBox:false,
        })

    }
    /*
    点击新建资产
    */
    onButtonPress(){
        //先判断资产类型、内容是否为空
        if(this.state.optionValue==''){
            this.setState({
                errorMsg:'请选择资产类型'
            })
        }else if(this.state.assetsContent==''&&!this.state.avatarSource){
            this.setState({
                errorMsg:'请填写资产内容'
            })
        }else {
            //发起后端请求时，显示loading
            this.setState({
                showActionLoading:true,
                errorMsg:'',
            })
            var formData = new FormData();
            /*发起新建资产请求
            type：资产类型
            asset：资产内容
            file：附件（ios暂无附件下载功能）
            */
            //判断若有附件上传，则想后端传入file参数
            if(this.state.avatarSource){
                let file = {uri: this.state.avatarSource.uri, type: 'multipart/form-data', name: this.state.fileName}; 
                formData.append('file',file)
            }
            
            formData.append('type',this.state.optionValue)
            formData.append('asset',this.state.assetsContent)
            formData.append('file','')
            fetch(fentchUrl+'/api/chain_trans/create/',
            {
              method:'POST',
              body:formData,
            })
            .then((response) => {return response.json()})  
            .then((responseJson) => {
            //   alert(JSON.stringify(responseJson))
              if(responseJson.code==200){
                const {navigate} = this.props.navigation
                navigate('Home',{})
              }else if(responseJson.code==210){
                //登录超时，弹出弹框，并提示重新登录
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
                //请求错误时，提示后台返回的错误信息
                this.setState({
                    errorMsg:responseJson.message,
                    showActionLoading:false,
                })
              }
            })
            .catch((error)=>{
                //若发生错误，则提示服务器繁忙
                this.setState({
                    errorMsg:'服务器繁忙，请稍后重试',
                    showActionLoading:false,
                })
            })
        }
        
    }
    /*
    上传附件
    */
    uploadBtn(){
        ImagePicker.showImagePicker(options, (response) => {
            // console.log('Response = ', response);
            if (response.error) {
            //发生未知错误
              Alert.alert('服务器繁忙','服务器繁忙，请稍后重试~',[{ text: '确定',}],{ cancelable: false })
            }
            else {
              let source = { uri: response.uri };
              // You can also display the image using data: 转为二进制流
            //   let source = { uri: 'data:image/jpeg;base64,' + response.data };
              //获取选择文件的大小
              let size = response.fileSize;
              //获取选择文件的名字
              let fileName = response.fileName
              //当图片大于10M

              if(size/(1024*1024)>10){
                this.setState({
                    fileSize:'文件大小为'+parseInt(size/(1024*1024))+'M,请选择10M以内的文件',
                  });
              }else{
                this.setState({
                    avatarSource: source, //文件
                    fileSize:false,
                    fileName:fileName
                  });
              }
             
              
            }
        });
    }
    componentWillMount(){
        this.setState({
            typeAssets:this.props.navigation.state.params.typeAssets,//从Home组件传递的参数，最终回到Home页还是传递回去
        })
    }
    componentDidMount(){
        //取消新建资产
        this.props.navigation.setParams({
            cancleAdd:()=>{ return this.cancleAdd()}
          })
    }
    
    render() {
        return (
            <ScrollView style={assets.addNewCover}>
                {/* StatusBar:是app状态栏的颜色 默认白底黑字*/}
            <StatusBar barStyle={'default'} />
                <View style={assets.addAssetsOptionBox}>
                    <Text style={assets.addAssetsTitleFont}>资产类型</Text>
                    <Picker 
                    dataName = {this.state.dataName} //传入picker组件---下拉列表对象的属性名，不同的后台接口返回的参数不同
                    dataKey = {this.state.dataKey} //传入picker组件---下拉列表对象的属性名，不同的后台接口返回的参数不同
                    pickerList = {this.state.typeAssets} //传入的下拉框数组
                    selectOption = {this.state.selectOption} //下拉框页面显示的文件
                    showPickerBox = {this.state.showPickerBox} //是否显示下拉框
                    pickerValue = {this.pickerValue.bind(this)} //下拉框选项点击选中事件
                    showSelectPicker = {this.showSelectPicker.bind(this)} //点击显示/隐藏下拉框
                /> 
                </View>
                <View style={assets.addAssetsOptionBox}>
                    <Text style={assets.addAssetsTitleFont}>资产内容</Text>
                    <TextInput style={assets.addAssetsIpt} multiline={true} blurOnSubmit={true} returnKeyType='done'
                    onChangeText = {(assetsContent) => this.setState({assetsContent})}
                    value = {this.state.assetsContent}></TextInput>
                </View>
                <View style={assets.addAssetsOptionBox}>
                    <Text style={assets.addAssetsTitleFont}>附件</Text>
                    {
                        this.state.fileName &&
                        <View style={assets.fileNameBox}>
                            <Text style={assets.fileNameText}><Icon name='ios-link' size={20}/> {this.state.fileName}</Text>
                        </View>
                    }
                    <TouchableHighlight style={styles.changePwdBtn}>
                        <Text style={styles.changePwd} onPress={this.uploadBtn.bind(this)} suppressHighlighting={true}>
                        <Icon name="md-add-circle" size={20} style={styles.changePwdIcon}></Icon> 上传附件</Text>
                    </TouchableHighlight>
                </View>
                
                <Text style={assets.addAssetsTitleFont}>{this.state.fileSize}</Text>
                {
                    this.state.showActionLoading &&
                    <View style={styles.actionLoading}>
                        <ActivityIndicator color='#F28321'/>
                    </View>
                    
                }
                {
                    !this.state.showActionLoading &&
                    <View style={assets.createAssetsBtn}>
                        <TouchableButton title='创建资产' onButtonPress = {this.onButtonPress.bind(this)}/>
                    </View>
                    
                }
                
                <View style={assets.addAssetsErr}>
                    <Text style={styles.errorMsg}>{this.state.errorMsg}</Text>
                </View>
                
            </ScrollView>
           
        );
    }
}
