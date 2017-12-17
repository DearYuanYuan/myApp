import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ActivityIndicator,
    ScrollView,
    StatusBar,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import fontsize from './plug/fontSize'
let fentchUrl = 'http://139.196.253.89:8080'
export default class AssetsHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            asset_id:'',
            assetsTransDetail:false,
            errorMsg:'',
        }
      };
    static navigationOptions = {
        title:'交易历史记录',
        headerTitleStyle: {
            fontSize:fontsize(17),
            color:'#000'
        },
        headerBackTitleStyle: {
            fontSize:fontsize(17),
        },
    }
    /*
    加载资产交易历史
    asset_id：资产id
    */
    loadHistory(){
        var formData = new FormData();
        formData.append('asset_id',this.state.asset_id)
        fetch(fentchUrl+'/api/chain_trans/query_trans_detail/',
        {
          method:'POST',
          body:formData,
        })
        .then((response) => {return response.json()})  
        .then((responseJson) => {
        //   alert(JSON.stringify(responseJson))
        if(responseJson.code==200){
            this.setState({
                assetsTransDetail:responseJson.detail
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
                assetsTransDetail:false,
                errorMsg:responseJson.message
            })
          }
            
        })
        .catch((error)=>{
            this.setState({
                assetsTransDetail:false,
                errorMsg:'服务器繁忙，请稍后重试~'
            })
        })
    }
    componentWillMount(){
        //获取上个屏幕（资产详情界面）传递的资产id
        this.setState({
            asset_id:this.props.navigation.state.params.asset_id,
        })
       
    }
    componentDidMount(){
         //加载资产交易历史
         this.loadHistory()
    }
    render() {
        return (
            <ScrollView style={history.assetsList}> 
            <StatusBar barStyle={'default'} />
            <View style={history.assetsListContainer}>
            {
                this.state.assetsTransDetail && 
                this.state.assetsTransDetail.map((data,index)=>{
                    return (
                        <View style={history.listBox} key={index}>
                        <View style={history.dealTimeCover}>
                            <Icon name="md-calendar" size={20} style={history.dealTimeIcon}></Icon>  
                            <Text style={history.dealTime}>{data.time}</Text>
                        </View>
                        <View style={history.transDealPart}>
                            <View style={history.transDealUsr}>
                                <Image source={data.photo==null?require('../image/Avatar.png'):{uri:fentchUrl+data.photo}} style={history.assetsOwnerPhoto}></Image>
                                {/* <Image source={require('../image/Avatar.png')} style={history.assetsOwnerPhoto}></Image> */}
                                <View style={history.assetsOwnerIntro}>
                                    <Text style={history.assetsOwnerMsg}>{data.username}
                                        <Text style={history.assetsLastOwner}>{index==0?'   (资产拥有者)':''}</Text>
                                    </Text>
                                    <Text style={history.assetsOwnerJob}>{data.job}</Text>
                                </View>
                                
                            </View>
                            
                        </View>
                       
                    </View>
                    )
                })
            }

            <Text style={history.errorMsg}>{this.state.errorMsg}</Text>

            {
                !this.state.assetsTransDetail &&
                <ActivityIndicator color='#F28321'/>
            }
                
            </View>    
            </ScrollView>
           
        );
    }
}

const history = StyleSheet.create({
    assetsList:{
        height:900,
        backgroundColor: '#fff'
    },
    assetsListContainer:{
        paddingBottom: 100,
    },
    listBox:{
        backgroundColor: '#fff',
        padding:10,
    },
    assetsOwnerPhoto:{
        width: 40,
        height:40,
        borderRadius: 20,
        marginRight: 10,
        borderColor:'#7F8A98',
        borderWidth:1,
    },
    dealTimeCover:{
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dealTimeIcon:{
        color: '#7f8a98',
    },
    dealTime:{
        fontSize: fontsize(13),
        marginLeft: 6,
        flex: 5,
        color: '#7f8a98',
    },
    transDealPart:{
        borderColor:'#dedede',
        borderLeftWidth:3,
        paddingBottom: 20,
        marginLeft: 5,
        paddingTop: 10,
    },
    transDealUsr:{
        flexDirection:'row',
        alignItems: 'center',
        borderColor:'#dedede',
        borderWidth:1,
        marginLeft: 16,
        borderRadius: 8,
        padding:12,
    },
    assetsOwnerIntro:{
        
    },
    assetsOwnerMsg:{
        fontSize: fontsize(15),
        lineHeight:30,
    },
    assetsOwnerJob:{
        color: '#7f8a98',
        fontSize: fontsize(15),
    },
    assetsLastOwner:{
        color: '#F28321',
        marginLeft: 10,
        fontSize: fontsize(13),
    },
    errorMsg:{
        color: '#F28321',
        fontSize: fontsize(13),
        textAlign: 'center',
        marginTop: 12,
    },
})