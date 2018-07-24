/*
    资产转移
        转移需要选择转移的目标人
        点击选择框会跳转到用户列表
*/
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TextInput,
    StatusBar,
    TouchableHighlight,
    ActivityIndicator,
    Alert
} from 'react-native';
//字体图标文件
import Icon from 'react-native-vector-icons/Ionicons'
//公共按钮组件
import TouchableButton from './button'
//下拉框选择组件
import Picker from './picker'
//css样式文件
import assets from '../style/assets'
//css样式文件
import styles from '../style/style'
//引入字体自适应文件
//由于iphone屏幕尺寸不同，需要根据尺寸调整字体大小
import fontsize from './plug/fontSize'
//后台接口请求地址
let fentchUrl = 'http://140.143.202.114:8080'
export default class TransAssets extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            usrList:[],//用户list
            transOwner:'', //资产转移到某用户的用户名
            errorMsg:'',//错误提示
            tx_id:'',//资产id
            transOwnerId:'', //转移到用户的用户id
            userTransList:false,//用户列表
            showActionLoading:false,//转移资产操作loading
        }
      };
    static navigationOptions = {
        title:'转移资产',
        headerTitleStyle: {
            fontSize:fontsize(17),
            color:'#000'
        },
        headerBackTitleStyle: {
            fontSize:fontsize(17),
        },
    }
    /*
    点击选择转移到目标用户
    */
    showSelectPicker(){
        const {navigate} = this.props.navigation
        navigate('UserList',
           {userList:this.state.usrList, //所有的用户列表
            asset:this.props.navigation.state.params.asset, //转移的资产内容
            type:this.props.navigation.state.params.type,//转移的资产类型
            username:this.props.navigation.state.params.username,//资产拥有者
            filename:this.props.navigation.state.params.filename,//资产附件
            photo:this.props.navigation.state.params.photo,//资产拥有者头像
            tx_id:this.state.tx_id}) //交易id
    }
    /*确认转移资产
    tx_id：资产交易id
    next_user_id：转移到某用户的id
    */ 
    onButtonPress(){
        if(this.state.transOwner==''){
            //未选择用户
            this.setState({
                errorMsg:'请选择要转移的用户'
            })
        }else{
            this.setState({
                showActionLoading:true, //转移资产button隐藏，显示loading
            })
            var formData = new FormData();
            formData.append('tx_id',this.state.tx_id)
            formData.append('next_user_id',this.state.transOwnerId)
            fetch(fentchUrl+'/api/chain_trans/transfer/',
            {
              method:'POST',
              body:formData,
            })
            .then((response) => {return response.json()})  
            .then((responseJson) => {
              // alert(JSON.stringify(responseJson))
              if(responseJson.code==200){
                //成功，跳转到资产首页
                const {navigate} = this.props.navigation
                navigate('Home',{username:this.props.navigation.state.params.username})
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
                //失败
                this.setState({
                    errorMsg:responseJson.message,
                    showActionLoading:false,
                })
                return;
              }
            })
            .catch((error)=>{
                //发生错误
                this.setState({
                    errorMsg:'服务器繁忙，请稍后重试',
                    showActionLoading:false,
                })
            })
        }
        
       
    }
    
    
    /*
    
    */
    componentWillMount(){
        this.setState({
            tx_id:this.props.navigation.state.params.tx_id,//tx_id : 资产id（从资产详情页传递来的）
            transOwnerId:this.props.navigation.state.params.transOwnerId,//转移到某用户的id
            transOwner:this.props.navigation.state.params.transOwner||'',//转移到某用户的用户名
        })
    }
    render() {
        return (
            <ScrollView style={assetsDetail.assetsList}> 
                {/* StatusBar:是app状态栏的颜色 默认白底黑字*/}
                {/*barStyle={'light-content'} 是app设置的底色，白色字体  */}
                <StatusBar barStyle={'default'} />
                <View style={assetsDetail.assetsRowList}>
                    <Text style={assetsDetail.assetsLeftTitle}>目标用户</Text>
                    
                    <View style={assetsDetail.assetsRightIpt}>
                    <TouchableHighlight onPress={this.showSelectPicker.bind(this)} activeOpacity={1} underlayColor='#fff'>
                        <View style={styles.selectOtherCover}>
                            <Text style={styles.selectOtherIpt}
                            >{this.state.transOwner}</Text>
                            <Icon name='ios-arrow-forward-outline' size={20} />
                        </View>
                    </TouchableHighlight>
                    </View>
                    
                </View>
                <View style={assetsDetail.assetsRowList}>
                    <Text style={assetsDetail.assetsLeftTitle}>资产详情</Text>
                    <Text style={assetsDetail.assetsRightContent}>{this.props.navigation.state.params.asset}</Text>
                </View>
                <View style={assetsDetail.assetsRowList}>
                    <Text style={assetsDetail.assetsLeftTitle}>资产类型</Text>
                    <Text style={assetsDetail.assetsRightContent}>{this.props.navigation.state.params.type}</Text>
                </View>
                <View style={assetsDetail.assetsRowList}>
                    <Text style={assetsDetail.assetsLeftTitle}>当前所有者</Text>
                    <View style={assetsDetail.assetsOwner}>
                        <Image source={this.props.navigation.state.params.photo==null?require('../image/Avatar.png'):{uri:fentchUrl+this.props.navigation.state.params.photo}} style={assetsDetail.assetsOwnerPhoto}></Image>
                        <Text style={assetsDetail.assetsRightContent}>{this.props.navigation.state.params.username}</Text>
                    </View>
                </View>
                <View style={assetsDetail.assetsRowList}>
                    <Text style={assetsDetail.assetsLeftTitle}>附件</Text>
                    {
                        this.props.navigation.state.params.filename !='' &&
                        <Text style={[assetsDetail.assetsRightContent,assetsDetail.assetsFile]}>
                            {this.props.navigation.state.params.filename} &nbsp;
                            {/* <Icon name="md-download" size={16}/> */}
                        </Text>
                    }
                    
                </View>
                {
                    this.state.showActionLoading &&
                    <View style={styles.actionLoading}>
                        <ActivityIndicator color='#F28321'/>
                    </View>
                    
                }
                {
                    !this.state.showActionLoading &&
                    <View style={assetsDetail.assetsButton}>
                        <TouchableButton title='确认转移资产' onButtonPress = {this.onButtonPress.bind(this)}/>
                    </View>
                }
                
                <View style={assets.addAssetsErr}>
                    <Text style={styles.errorMsg}>{this.state.errorMsg}</Text>
                </View>
            </ScrollView>
           
        );
    }
}

const assetsDetail = StyleSheet.create({
    assetsList:{
        backgroundColor:'#fff',
        height:800,
    },
    assetsRowList:{
        flexDirection:'row',
        margin:10,
        borderBottomColor:'#DEDEDE',
        borderBottomWidth:0.5,
        paddingBottom: 10,
    },
    assetsLeftTitle:{
        color:'#7F8A98',
        width:120,
        lineHeight:fontsize(20),
        fontSize: fontsize(14),
        flex:1,
    },
    assetsRightContent:{
        flex: 3,
        lineHeight:fontsize(24),
        fontSize: fontsize(16),
    },
    assetsRightIpt:{
        flex: 3,
        
    },
    selectOtherIpt:{
        lineHeight:fontsize(24),
        fontSize: fontsize(16),
    },
    assetsOwner:{
        flex: 3,
        flexDirection:'row',
        alignItems: 'center',
    },
    assetsOwnerPhoto:{
        width: 40,
        height:40,
        borderRadius: 20,
        marginRight: 10,
        borderColor:'#7F8A98',
        borderWidth:1,
    },
    assetsFile:{
        // color: '#7F8A98',
    },
    assetsRightShowHistory:{
        flex: 3,
    },
    showMoreHistory:{
        fontSize: fontsize(18),
        fontWeight: 'bold',
        marginTop: 10,
        color:'#F28321',
    },
    assetsButton:{
        alignItems: 'center',
        marginTop: 20,
    },

})

/**/
//写了css样式
//注释
//注释
//注释
//注释
//注释
//注释
//注释
//注释
//注释
//注释
//注释
//注释
//注释
//注释
