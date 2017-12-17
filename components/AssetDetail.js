import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    StatusBar,
    Alert,
    CameraRoll,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import TouchableButton from './button'
import fontsize from './plug/fontSize'
import styles from '../style/style'
let fentchUrl = 'http://139.196.253.89:8080'
/*
下列参数都是从Assets.js组件传递来的
具体的调用要使用 this.props.navigation.state.params+参数名 eg：this.props.navigation.state.params.asset
asset:asset, //资产
type:type, //资产类型
username:username, //资产拥有者
filename:filename, //资产附件
time:time, //交易时间
asset_id:asset_id, //资产id
tx_id:tx_id,//交易id
enable_trans:enable_trans, //是否可以转移
*/ 
export default class AssetsDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assetsTransDetail:[],
        }
      };
    static navigationOptions = {
        title:'资产信息',
        headerBackTitle:'资产信息',
        headerTitleStyle: {
            fontSize:fontsize(17),
            color:'#000'
        },
        // headerTintColor:'#000',
        headerBackTitleStyle: {
            fontSize:fontsize(17),
            
        },
    }
    /*
    点击展开显示资产交易历史
    asset_id: 资产id
    */
    dealHistoryList(asset_id){
        const {navigate} = this.props.navigation
        navigate('AssetsHistory',
                {asset_id:asset_id,
        })
    }
    /*
    点击转移资产
    */
    onButtonPress(){
        const {navigate} = this.props.navigation
        navigate('TransAssets',
           {asset:this.props.navigation.state.params.asset, //资产内容
            type:this.props.navigation.state.params.type, //资产类型
            username:this.props.navigation.state.params.username, //用户名
            filename:this.props.navigation.state.params.filename, //附件名
            tx_id:this.props.navigation.state.params.tx_id, //交易id
            photo:this.props.navigation.state.params.photo,//头像
          })
    }
    download(asset_id){
        fetch(fentchUrl+'/api/chain_trans/down_tran_att/?asset_id='+asset_id,
        {
          method:'GET',
        })
        .then((response) => {return response.json()})  
        .then((responseJson) => {
            // alert(JSON.stringify(responseJson))
            var promise = CameraRoll.saveToCameraRoll(responseJson.url);
            promise.then(function(result) {
                Alert.alert(
                    '下载成功',
                    '',
                    [
                    { text: '确定', 
                    //   onPress: () => {
                    //     const {navigate} = this.props.navigation
                    //     navigate('Login',{})
                    //   }
                    }
                    ],
                    { cancelable: false }
                  )
            }).catch(function(error) {
                Alert.alert(
                    '下载失败',
                    '',
                    [
                    { text: '确定', 
                    //   onPress: () => {
                    //     const {navigate} = this.props.navigation
                    //     navigate('Login',{})
                    //   }
                    }
                    ],
                    { cancelable: false }
                  )
            });
        })
        .catch((error)=>{
            // alert(JSON.stringify(error))
        })
    }
    render() {
        return (
            <ScrollView style={assetsDetail.assetsList}> 
            <StatusBar barStyle={'default'} />
                <View style={assetsDetail.assetsListContainer}>
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
                        <View>
                            <Text style={assetsDetail.assetsRightMsg}>{this.props.navigation.state.params.username}</Text>
                            <Text style={assetsDetail.assetsRightMsg}>{this.props.navigation.state.params.userAssetsJob}</Text>
                        </View>
                    </View>
                </View>
                <View style={assetsDetail.assetsRowList}>
                    <Text style={assetsDetail.assetsLeftTitle}>附件</Text>
                    <Text style={[assetsDetail.assetsRightContent,assetsDetail.assetsFile]}>
                        {/* <Icon name='md-document' size={20} style={{color:'#F28321'}}/> */}
                            {this.props.navigation.state.params.filename==''?' 无附件': ' '+this.props.navigation.state.params.filename+' '} 
                            {
                                this.props.navigation.state.params.filename!=''&&
                                <Icon name='md-cloud-download' size={20} style={{color:'#F28321'}} onPress={this.download.bind(this,this.props.navigation.state.params.asset_id)}/>
                            }
                            
                    </Text>
                    {/* todo 下载附件 */}
                    {/* <Text >下载</Text> */}
                </View>
                <View style={assetsDetail.assetsRowList}>
                    <Text style={assetsDetail.assetsLeftTitle}>创建时间</Text>
                    <View style={assetsDetail.assetsRightShowHistory}>
                        <Text style={assetsDetail.assetsRightContent}>{this.props.navigation.state.params.time}</Text>
                        <Text style={assetsDetail.showMoreHistory} suppressHighlighting={true}
                        onPress = {this.dealHistoryList.bind(this,this.props.navigation.state.params.asset_id)}>查看交易历史 <Icon name="ios-arrow-forward-outline" size={16}/></Text>
                    </View>
                </View>
                {
                    this.props.navigation.state.params.enable_trans && 
                    <View style={assetsDetail.assetsButton}>
                        <TouchableButton title='转移资产' onButtonPress = {this.onButtonPress.bind(this)}/>
                    </View>
                }
                
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
    assetsListContainer:{
        marginBottom: 100,
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
        lineHeight:24,
        fontSize: fontsize(13),
        flex:1,
        // marginTop: 4,
    },
    assetsRightContent:{
        flex: 3,
        fontSize: fontsize(16),
        lineHeight:fontsize(24),
        marginBottom: 12,
    },
    assetsRightMsg:{
        flex: 3,
        fontSize: fontsize(16),
        lineHeight:fontsize(20),
    },
    assetsOwner:{
        flex: 3,
        flexDirection:'row',
        alignItems: 'center',
    },
    assetsOwnerPhoto:{
        width: 50,
        height:50,
        borderRadius: 25,
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
        fontSize: fontsize(17),
        fontWeight: 'bold',
        // marginTop: 6,
        color:'#F28321',
    },
    assetsButton:{
        alignItems: 'center',
        marginTop: 20,
    },

})