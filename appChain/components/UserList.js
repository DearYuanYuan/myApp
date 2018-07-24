/*
    用户选择列表
        可输入搜索的关键字搜索相关用户
        搜索用户为模糊查询，输入关键字，页面即可显示相关用户列表

*/
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    TextInput,
    ActivityIndicator,
    StatusBar,
    Alert
} from 'react-native';
//引入字体自适应文件
//由于iphone屏幕尺寸不同，需要根据尺寸调整字体大小
import fontsize from './plug/fontSize'
//字体图标插件
import Icon from 'react-native-vector-icons/Ionicons'
//css样式文件
import styles from '../style/style'
//后台接口请求
let fentchUrl = 'http://140.143.202.114:8080'
export default class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            usrList:false,//用户列表
            transOwner:'',//选择的用户的用户名
            transOwnerId:'',//选择的用户的用户id
            checkUsrNum:-1,//操作点击选择用户的index（第几个）
            userTransList:false,//模糊查询的用户列表
            errorMsg:''//错误信息提示
        }
    };
    /*
    确认选取某个用户转移资产
    */
    confirmSelect(){
        const {navigate} = this.props.navigation
        navigate('TransAssets',{
            transOwner:this.state.transOwner,//选择的用户的用户名
            transOwnerId:this.state.transOwnerId,//选择的用户的用户id
            asset:this.props.navigation.state.params.asset,//转移的资产
            type:this.props.navigation.state.params.type,//转移的资产类型
            username:this.props.navigation.state.params.username,//资产拥有者用户名
            filename:this.props.navigation.state.params.filename,//资产附件
            photo:this.props.navigation.state.params.photo,//资产拥有者头像
            tx_id:this.props.navigation.state.params.tx_id})//资产id
    }
    static navigationOptions = ({navigation,screenProps})=>({
        title:'目标用户',
        headerRight:<Text style={{ paddingRight: 10,color: '#F28321',fontSize:fontsize(18)}} 
        onPress={() =>{navigation.state.params.confirmSelect()}} suppressHighlighting={true}>{navigation.state.params.selectBtn}</Text>,
        headerTitleStyle: {
            fontSize:fontsize(17),
            color:'#000',
        },
        headerBackTitleStyle: {
            fontSize:fontsize(17),
        },
    })
    /*
    加载用户列表
    */
    loadUsrList(){
        fetch(fentchUrl+'/api/chain_user/query_all/',
        {
          method:'POST',
        })
        .then((response) => {return response.json()})  
        .then((responseJson) => {
          if(responseJson.code==200){
            //成功
            this.setState({
                usrList:responseJson.list,
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
            //失败
            this.setState({
                usrList:false,
                errorMsg:responseJson.message
            })
            return;
          }
        })
        .catch((error)=>{
            //发生错误
            this.setState({
                usrList:false,
                errorMsg:'服务器繁忙，请稍后重试~'
            })
        })
    }
   
    /*
    选择转移的用户
    //id : 转移到某个用户的id
    //username:转移到某个用户的用户名
    //index : 为点击选择用户的唯一序号
    */
    pickerValue(id,username,index){
        this.setState({
            transOwner:username,
            transOwnerId:id,
            checkUsrNum:index,
        })
        //设置导航栏右侧的选取按钮，提示用户选择完用户确定选取某一个用户作为资产被转移者
        this.props.navigation.setParams({
            selectBtn:'选取'
        })
        
    }
    /*
    搜索栏输入搜索内容
    1、将搜索的内容赋值给transOwner
    2、做模糊查询
    */
    handleUserOwner(transOwner){
        //当搜索栏获取焦点可输入的情况下，将导航栏右侧的选取按钮置为空
        this.props.navigation.setParams({
            selectBtn:''
        })
        //将搜索的内容赋值给transOwner
        this.setState({
            transOwner:transOwner,
        })
        //做模糊查询
        //初始化nameList，并把获取的用户列表遍历放到nameList中
        var nameList = []
        this.state.usrList.map((list,index)=>{
            nameList.push(list)
        })
        //若搜索内容为空
        if(transOwner==''){
            this.setState({
                userTransList:nameList,
            })
            
        }else{
            //搜索不为空，则判断搜索的内容是否可以在nameList数组中找到
            //整个用户列表长度
            var len = nameList.length;
            //初始化搜索用户列表
            var selectNameList = [];
            for(var i = 0;i<len;i++){
                if(nameList[i].username.indexOf(transOwner)>=0){
                    //搜索到相关内容，将此用户加到用户列表中
                    selectNameList.push(nameList[i])
                }
            }
            //将包含相关搜索内容的用户列表更新到界面中
            this.setState({
                userTransList:selectNameList
            })
            
        }
        
    }
    componentWillMount(){
        //加载用户列表
        this.loadUsrList()
    }
    componentDidMount(){
        //选取用户
        this.props.navigation.setParams({
            confirmSelect:()=>{ return this.confirmSelect()}
        })
    }
    render() {
        return (
            <View style={selectUser.userSelectContainer}>
            {/* StatusBar:是app状态栏的颜色 默认白底黑字*/}
            {/*barStyle={'light-content'} 是app设置的底色，白色字体  */}
            <StatusBar barStyle={'default'} />
            <View style={selectUser.topSearch}>
                <TextInput style={selectUser.searchForUsr} placeholder={'搜索用户'} 
                value={this.state.transOwner} returnKeyType='done'
                onChangeText = {this.handleUserOwner.bind(this)}></TextInput>
            </View>
            <ScrollView style={selectUser.assetsList}> 
            {
                !this.state.usrList && 
                <ActivityIndicator color='#F28321' />
            }
            <Text style={styles.errorMsg}>{this.state.errorMsg}</Text>
            {
                this.state.usrList && 
                (this.state.userTransList||this.state.usrList).map((data,index)=>{
                    return (
                        <TouchableOpacity style={selectUser.assetsRowList} key={index} onPress={this.pickerValue.bind(this,data.id,data.username,index)}>
                            <View style={selectUser.assetsOwner} >
                                <Image source={data.photo==null?require('../image/Avatar.png'):{uri:fentchUrl+data.photo}} style={selectUser.assetsOwnerPhoto}></Image>
                                {/* <Image source={require('../image/Avatar.png')} style={selectUser.assetsOwnerPhoto}></Image> */}
                                <View style={selectUser.selectUserMsg}>
                                    <Text style={selectUser.transUsrName}>{data.username}</Text>
                                    <Text style={selectUser.transUsrDev}>{data.job}</Text>
                                </View>
                                <View style={selectUser.selelectIcon}>
                                    {
                                        this.state.checkUsrNum == index &&
                                        <Icon name='md-checkmark' size={24} color='#F28321'/>
                                    }
                                    
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                    
                })
            }
                
                            
            </ScrollView>
            </View>
        );
    }
}

const selectUser = StyleSheet.create({
    userSelectContainer:{
        flex: 1,
    },
    topSearch:{
        flex: 0.1,
        backgroundColor: '#FFFFFF',
    },
    selectAction:{
        marginRight: 10,
        fontSize: fontsize(17),
        color: '#F28321',
    },
    assetsList:{
        backgroundColor:'#fff',
        height:800,
        flex: 1,
    },
    assetsRowList:{
        flexDirection:'row',
        margin:10,
        borderBottomColor:'#DEDEDE',
        borderBottomWidth:0.5,
        paddingBottom: 10,
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
    transUsrName:{
        fontSize: fontsize(16),
    },
    transUsrDev:{
        fontSize: fontsize(15),
        color: '#7F8A98',
    },
    selectUserMsg:{
        flex: 4,
    },
    selelectIcon:{
        flex: 1,
    },
    searchForUsr:{
        height:36,
        borderRadius:10,
        borderColor:'#f5f5f5',
        margin:10,
        borderWidth:1,
        backgroundColor:'#f5f5f5',
        paddingLeft: 10,
        fontSize: fontsize(13),
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