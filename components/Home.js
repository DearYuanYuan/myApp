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
  FlatList,
  ScrollView,
  RefreshControl,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import styles from '../style/style'
import TouchableButton from './button'
import AssetsList from './Assets'
import Icon from 'react-native-vector-icons/Ionicons'

let fentchUrl = 'http://139.196.253.89:8080'
export default class Home extends Component{
  constructor(props) {
    super(props);
    this.state = {
      assetsListData:false, //交易列表数据
      isRefreshing:false, //下拉刷新
      loadMore:false, //上拉加载
      pageNum:1, //请求的当前页码
      dataListAllPage:1, //交易列表的总页码
      username:'',//当前登陆用户名
      typeAssets:[],//新建资产的资产类型
      userJob:'',
      userDep:'',
      userPhone:'',
      userEmail:'',
      userPhoto:'',
      create_counts:'',
      tran_counts:'',
      owner_counts:'',
      userAssetsJob:'',
    }
  };
  /*
  新建资产点击--后台请求
  username：传入用户名，可供新建资产页码点击后退时使用
  typeAssets：传入资产类型
  */
  addNewAssets(){
    const {navigate} = this.props.navigation
    navigate('AddNewAssets',{typeAssets:this.state.typeAssets})
  }
  /*
  搜索资产
  */
  searchAssets(){
    // alert('search')
    const {navigate} = this.props.navigation
    navigate('SearchAssets',{typeAssets:this.state.typeAssets})
  }
  //动态设置头部按钮点击事件
  static navigationOptions = ({navigation,screenProps})=>({
      headerLeft: <TouchableOpacity onPress={()=>{navigation.state.params.searchAssets()}}>
      <Icon name='ios-search' size={30} style={styles.navBarIcon}/>
      </TouchableOpacity>,
      headerRight: <TouchableOpacity onPress={() =>{navigation.state.params.addNewAssets()}} >
      <Icon name='ios-add-circle-outline' size={30} style={styles.navBarIcon}/>
      </TouchableOpacity>,
      headerBackTitle:'区块链主页',
      headerTitleStyle: {
      // backgroundColor:'#ccc',
      },
      gesturesEnabled:false,
      headerStyle: {
        backgroundColor: '#F28321',// 设置导航栏的背景颜色,headerTintColor设置无效
        borderBottomColor: '#F28321',
        paddingLeft: 10,
        paddingRight: 10,
      },
  })
  /*
  todo  资产交易列表点击显示资产信息
  asset,type,username,filename,time,asset_id,tx_id,enable_trans,job参数是从组件Assets.js传递来的
  */
  showDealHistory(asset,type,username,filename,time,asset_id,tx_id,enable_trans,photo,job){
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
            userAssetsJob:job,
            errorMsg:''
          })
  }
  /*
  加载资产交易列表
  pageNum:请求的页码数,
  pageSize：每一页的列表数 默认10
  */
assetsLoad(pageNum,pageSize){
    var formData = new FormData();
    formData.append('page',pageNum)
    formData.append('page_size',pageSize)
    fetch(fentchUrl+'/api/chain_trans/query_list/',
    {
      method:'POST',
      body:formData,
    })
    .then((response) => {return response.json()})  
    .then((responseJson) => {
      // alert(JSON.stringify(responseJson))
      if(responseJson.code==200){
        var pages = parseInt(responseJson.count/10)+((responseJson.count%10)!=0?1:0)
        // alert(JSON.stringify(responseJson.data))
        var listData
        if(this.state.assetsListData){
            listData = this.state.assetsListData
            listData.push.apply( listData, responseJson.data);
        }else{
          var listData = responseJson.data
        }
        this.setState({
          assetsListData:listData,
          dataListAllPage:pages==0?1:pages, //当无交易资产时，把page设置为1，防止下拉上滑刷新
          isRefreshing: false,
          loadMore:false,
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
          isRefreshing: false,
          loadMore:false,
          errorMsg:responseJson.message
        })
        return;
      }
    })
    .catch((error)=>{
      this.setState({
        assetsListData:[],
        isRefreshing: false,
        loadMore:false,
        errorMsg:'服务器繁忙，请稍后重试~'
      })
    })
   
}
  /*
  获取资产类型列表
  */
loadAssetsType(){
    fetch(fentchUrl+'/api/chain_trans/query_tran_types/',
    {
      method:'POST',
    })
    .then((response) => {return response.json()})  
    .then((responseJson) => {
      // alert(JSON.stringify(responseJson.results))
      if(responseJson.code==200){
        this.setState({
            typeAssets:responseJson.results //资产类型
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
      
    })
}
/*
下拉刷新 -- 加载交易列表第一页
*/
_onRefresh(){
    this.setState({isRefreshing: true});
    //加载交易列表第一页
    var formData = new FormData();
    formData.append('page',1)
    formData.append('page_size',10)
    fetch(fentchUrl+'/api/chain_trans/query_list/',
    {
      method:'POST',
      body:formData,
    })
    .then((response) => {return response.json()})  
    .then((responseJson) => {
      // alert(JSON.stringify(responseJson))
      if(responseJson.code==200){
        var pages = parseInt(responseJson.count/10)+((responseJson.count%10)!=0?1:0)
        // alert(JSON.stringify(responseJson.data))
        this.setState({
          assetsListData:responseJson.data,
          dataListAllPage:pages==0?1:pages,
          isRefreshing: false,
          loadMore:false,
          pageNum:1,
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
          isRefreshing: false,
          loadMore:false,
          errorMsg:responseJson.message
        })
        return;
      }
    })
    .catch((error)=>{
      this.setState({
        assetsListData:[],
        isRefreshing: false,
        loadMore:false,
        errorMsg:'服务器繁忙，请稍后重试~'
      })
    })
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
用户信息修改
*/
settingUsrMsg(){
  const {navigate} = this.props.navigation
  navigate('Settingusermsg',{})
  // alert('修改用户')
}
/*
获取用户信息
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
          userJob:responseJson.user_detail.job,
          userDep:responseJson.user_detail.department,
          userPhone:responseJson.user_detail.phone,
          userEmail:responseJson.user_detail.email,
          username:responseJson.user_detail.username,
          userPhoto:responseJson.user_detail.photo
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
//请求获取用户资产创建转移拥有数量
getUsrAssetsNum(){
  fetch(fentchUrl+'/api/chain_trans/query_tran_counts/',
  {
    method:'POST',
  })
  .then((response) => {return response.json()})  
  .then((responseJson) => {
    // alert(JSON.stringify(responseJson))
    if(responseJson.code==200){
      this.setState({
        create_counts:responseJson.counts.create_counts,
        tran_counts:responseJson.counts.tran_counts,
        owner_counts:responseJson.counts.owner_counts
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
componentWillMount(){
    //加载个人信息
    this.loadUsrCurrentMsg();
    //加载交易列表第一页
    this.assetsLoad(1,10);
    //加载资产类型
    this.loadAssetsType();
    //加载用户资产创建、转移、拥有数目详情
    this.getUsrAssetsNum();
   
}
componentDidMount(){
    //设置导航栏点击新建资产事件
    this.props.navigation.setParams({
      addNewAssets:()=>{ return this.addNewAssets()},
      searchAssets:()=>{ return this.searchAssets()}
    })
}
  render() {
    return (
        <ScrollView style={styles.scrollView}
        scrollsToTop={true}
        onScroll = {this._onScroll.bind(this)}
        scrollEventThrottle={5}
        //下拉刷新
          refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this._onRefresh.bind(this)}
            tintColor="#F28321"
          />
        }
        >
        <StatusBar barStyle={'light-content'} />
          <View style={styles.homeHeadCover}>
              <View style={styles.homeHeadBlank}></View>
              <View style={styles.headTopHome}>
                <View style={styles.leftUserImg}>
                  <Image style={styles.userPhoto}
                    source={this.state.userPhoto==null?require('../image/Avatar.png'):{uri:fentchUrl+this.state.userPhoto}}>
                  </Image>
                </View>
                
                <View style={styles.middleUserMsg}>
                  <Text style={styles.homeUsername}>
                      {this.state.username}
                  </Text>
                  <Text style={styles.homeDepartment}>
                      {this.state.userJob}
                  </Text>
                </View>
                <Icon name='ios-settings-outline' size={40} style={[styles.navBarIcon,styles.rightUserSet]}
                  onPress={this.settingUsrMsg.bind(this)}/>
              </View>
          </View>
          {/* <View style={styles.userMsgAll}>
            <View style={styles.userMsgList}>
              <Text style={styles.userMsgIcon}><Icon name='md-call' size={16} /> 手机</Text>
              <Text style={styles.userMsgFont}>{this.state.userPhone}</Text>
            </View>
            <View style={styles.userMsgList}>
              <Text style={styles.userMsgIcon}><Icon name='ios-mail' size={16} /> 邮箱</Text>
              <Text style={styles.userMsgFont}>{this.state.userEmail}</Text>
            </View>
            <View style={styles.userMsgListRight}>
              <Text style={styles.userMsgIcon}><Icon name='ios-card' size={16} /> 部门</Text>
              <Text style={styles.userMsgFont}>{this.state.userDep}</Text>
            </View>
          </View> */}
          <View style={styles.userAssetsAll}>
            <View style={styles.assetsList}>
              <Text style={styles.assetsFont}>创建资产</Text>
              <Text style={styles.assetsIcon}><Icon name='ios-star' size={16} /> {this.state.create_counts}</Text>
            </View>
            <View style={styles.assetsList}>
              <Text style={styles.assetsFont}>当前资产</Text>
              <Text style={styles.assetsIcon}><Icon name='ios-stats' size={16} /> {this.state.owner_counts}</Text>
            </View>
            <View style={styles.assetsListRight}>
              <Text style={styles.assetsFont}>交易资产</Text>
              <Text style={styles.assetsIcon}><Icon name='md-repeat' size={16} /> {this.state.tran_counts}</Text>
            </View>
          </View>
          <View style={styles.ListCover}>
              <View style={styles.listTopGaps}></View>
          {
            this.state.assetsListData &&
            <AssetsList 
            assetsListData = {this.state.assetsListData} 
            showDealHistory = {this.showDealHistory.bind(this)}
            />
          }
          {
            !this.state.assetsListData &&
            <ActivityIndicator color='#F28321' />
          }
          {
            this.state.loadMore &&
            <View style={styles.loadingIcon}>
              <Text>
                <Image style={styles.loadingMore} 
                  source={require('../image/loading.gif')}>
                </Image>
              </Text>
                
            </View>
            
          }
          </View>
          
        </ScrollView>
      
    );
  }
}

