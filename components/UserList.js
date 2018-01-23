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
import fontsize from './plug/fontSize'
import Icon from 'react-native-vector-icons/Ionicons'
import styles from '../style/style'
import { NavigationActions } from 'react-navigation'
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
            errorMsg:''
        }
    };
    /*
    确认选取某个用户转移资产
    */
    confirmSelect(){
        const {navigate} = this.props.navigation
        navigate('TransAssets',{
            transOwner:this.state.transOwner,
            transOwnerId:this.state.transOwnerId,
            asset:this.props.navigation.state.params.asset,
            type:this.props.navigation.state.params.type,
            username:this.props.navigation.state.params.username,
            filename:this.props.navigation.state.params.filename,
            photo:this.props.navigation.state.params.photo,
            tx_id:this.props.navigation.state.params.tx_id})
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
            this.setState({
                usrList:false,
                errorMsg:responseJson.message
            })
            return;
          }
        })
        .catch((error)=>{
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
            var len = nameList.length;
            var selectNameList = [];
            for(var i = 0;i<len;i++){
                if(nameList[i].username.indexOf(transOwner)>=0){
                    selectNameList.push(nameList[i])
                }
            }
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