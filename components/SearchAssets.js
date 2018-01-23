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
import AssetsList from './Assets'
let fentchUrl = 'http://140.143.202.114:8080'
export default class SearchAssets extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assetsListData:[],//返回的符合资产内容的列表
            searchContent:'',//传入搜索资产内容的关键字
            pageNum:1,//当前页码数
            loadMore:false, //loading加载图标
            errorMsg:'', //错误提示
        }
      };
   
    static navigationOptions = ({navigation,screenProps})=>({
        title:'搜索资产列表',
        headerRight:<Text style={{ paddingRight: 10,color: '#F28321',fontSize:fontsize(18)}} 
        onPress={() =>{navigation.state.params.searchGo()}} suppressHighlighting={true}>搜索</Text>,
        headerTitleStyle: {
            fontSize:fontsize(17),
            color:'#000',
        },
        headerBackTitleStyle: {
            fontSize:fontsize(17),
        },
    })
    /*
    加载资产列表
    page：加载的某一个
    pageSize：一页包括的列表数默认10
    asset_search：搜索的资产关键字
    */
    assetsLoad(pageNum,pageSize){
        var formData = new FormData();
        formData.append('page',pageNum)
        formData.append('page_size',pageSize)
        formData.append('asset_search',this.state.searchContent)
        fetch(fentchUrl+'/api/chain_trans/query_list/',
        {
          method:'POST',
          body:formData,
        })
        .then((response) => {return response.json()})  
        .then((responseJson) => {
        //   alert(JSON.stringify(responseJson))
          if(responseJson.code==200){
            var pages = parseInt(responseJson.count/10)+((responseJson.count%10)!=0?1:0)
            if(responseJson.data.length==0){
                //当未匹配到任何资产
                this.setState({
                    errorMsg:'未搜索到匹配资产内容'
                })
            }
            //初始化资产列表
            var listData
            if(this.state.assetsListData){
                //当请求的不是第一个的内容，需要将获取到的本页的列表加到页面已经显示的资产列表数组后面
                listData = this.state.assetsListData
                listData.push.apply( listData, responseJson.data);
            }else{
                //当请求的是第一页内容
                var listData = responseJson.data
            }
            this.setState({
              assetsListData:listData, //把整合后的资产列表赋值给assetsListData，并展示在页面中
              dataListAllPage:pages, //得到的页码数
              loadMore:false, //loading消失
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
              assetsListData:[],
              loadMore:false,
              errorMsg:responseJson.message
            })
            return;
          }
        })
        .catch((error)=>{
            this.setState({
                assetsListData:[],
                loadMore:false,
                errorMsg:'服务器繁忙，请稍后重试~'
              })
        })
    }
    /*
    点击搜索资产内容
    */
    searchGo(){
        this.setState({
            loadMore:true,
            assetsListData:[],
            errorMsg:'',
        })
        this.assetsLoad(1,10);
    }
    /*
上滑刷新 --加载下一页
*/
_onScroll(event) {
    if(this.state.loadMore){
        return;
    }
    let y = event.nativeEvent.contentOffset.y;
    let height = event.nativeEvent.layoutMeasurement.height;
    let contentHeight = event.nativeEvent.contentSize.height;

    if(y+height>=contentHeight-10){
        //判断是否已经加载到最后一页，若最后一页，则不再加载交易列表
        if(this.state.dataListAllPage==this.state.pageNum){
          this.setState({
            pageNum:this.state.dataListAllPage
          });
          return
        }else{
          this.setState({
              loadMore:true,
              pageNum:this.state.pageNum+1
          });
          this.assetsLoad(this.state.pageNum+1,10)
        }
        
    }
}
     /*
     todo  资产交易列表点击显示资产信息
    asset,type,username,filename,time,asset_id,tx_id,enable_trans参数是从组件Assets.js传递来的
    */
    showDealHistory(asset,type,username,filename,time,asset_id,tx_id,enable_trans,photo){
    const {navigate} = this.props.navigation
    navigate('AssetsDetail',
            {asset:asset, //资产
            type:type, //资产类型
            username:username, //资产拥有者
            filename:filename, //资产附件
            time:time, //交易时间
            asset_id:asset_id, //资产id
            tx_id:tx_id,//交易id
            enable_trans:enable_trans, //是否可以转移
            photo:photo,//用户头像
          })
    }
    //搜索框输入时，将输入的内容赋值给searchContent
    searchInput(searchContent){
        this.setState({
            searchContent:searchContent
        })
    }
    componentWillMount(){
       
       
    }
    componentDidMount(){
       //搜索
        this.props.navigation.setParams({
            searchGo:()=>{ return this.searchGo()}
        })
    }
    render() {
        return (
            <View style={selectUser.userSelectContainer}>
            
            <StatusBar barStyle={'default'} />
            <View style={selectUser.topSearch}>
                <TextInput style={selectUser.searchForUsr} placeholder={'搜索资产'} 
                value={this.state.searchContent} returnKeyType='done'
                onChangeText = {this.searchInput.bind(this)}></TextInput>
            </View>
            <ScrollView style={selectUser.assetsList}
                scrollsToTop={true}
                onScroll = {this._onScroll.bind(this)}
                scrollEventThrottle={5}
            > 
            {
                this.state.assetsListData && 
                <AssetsList 
                assetsListData = {this.state.assetsListData} 
                showDealHistory = {this.showDealHistory.bind(this)}/>
            }
            {
                this.state.loadMore && 
                <ActivityIndicator color='#F28321' />
            }
            <Text style={styles.errorMsg}>{this.state.errorMsg}</Text>
                            
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