/*
    资产详情组件
    界面可以看到：
        资产内容、
        创建时间、
        资产类型、
        资产拥有者、
        附件详情（可下载，ios仅限于图片和视频）、
        交易历史（点击查看）、
        转移资产（点击创建）

*/
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
//字体图标插件
import Icon from 'react-native-vector-icons/Ionicons'
//公共按钮组件
import TouchableButton from './button'
//引入字体自适应文件
//由于iphone屏幕尺寸不同，需要根据尺寸调整字体大小
import fontsize from './plug/fontSize'
//css样式
import styles from '../style/style'
/*
    文件下载插件
    ios是将附件下载到app中
    若需要保存到手机，需要另外的操作，
    另外插件有查看文件的接口，需要可查阅https://github.com/itinance/react-native-fs
*/
import RNFS from 'react-native-fs';
//后台接口请求地址
let fentchUrl = 'http://140.143.202.114:8080'
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
            progressNum:'', //文件下载进度（0-1）
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
    /*
    下载文件
    asset_id：资产id
    */ 
    download(asset_id){
        fetch(fentchUrl+'/api/chain_trans/down_tran_att/?asset_id='+asset_id,
        {
          method:'GET',
        })
        .then((response) => {return response.json()})  
        .then((responseJson) => {
            //匹配图片格式
            var imgTest = /^http.*(png|jpe|jpg|jpeg)$/i
            //匹配视频格式
            var videoTest = /^http.*(mp4|mov|avi|wmv|3gp|mkv|flv|f4v|rmvb|webm|mpeg|mpg|dat|asf|video)$/i
            
            // 视频 、图片下载
            //当文件是图片或者视频时
            if(imgTest.test(responseJson.url)||videoTest.test(responseJson.url)){
                const formUrl = responseJson.url; //文件的服务器地址url
                var downloadDest;//初始化储存到app中的文件名
                var fileType ;//初始化文件类型，在保存文件时传入参数
                if(imgTest.test(formUrl)){
                    downloadDest = `${RNFS.DocumentDirectoryPath}/${((Math.random() * 1000) | 0)}.jpg`;
                    fileType = 'photo'
                }else{
                    downloadDest = `${RNFS.DocumentDirectoryPath}/${((Math.random() * 1000) | 0)}.mp4`;
                    fileType = 'video'
                }
                const options = {
                    fromUrl: formUrl,
                    toFile: downloadDest,
                    background: true,
                    begin: (res) => {
                        //开始下载
                        this.setState({
                            progressNum: 0.01,
                        });
                        // console.log('begin', res);
                        //console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
                    },
                    progress: (res) => {
                        //下载中
                        let pro = res.bytesWritten / res.contentLength;
                        //下载进度
                        //实现显示下载进度，给页面一个反馈
                        this.setState({
                            progressNum: pro, 
                        });
                    }
                };
                try {
                    //文件下载到app之后的操作
                    //将文件保存到app相册
                    const ret = RNFS.downloadFile(options);
                    ret.promise.then(res => {
                        // alert(downloadDest)
                        if(this.state.progressNum==1){
                            //当下载完成后
                            //把文件保存到相册中
                            var promise = CameraRoll.saveToCameraRoll(downloadDest,fileType);
                            promise.then(function(result) {
                                Alert.alert('下载成功','',[{ text: '确定',}],{ cancelable: false })
                            }).catch(function(error) {
                                //失败，提示服务器繁忙
                                Alert.alert('服务器繁忙','服务器繁忙，请稍后重试~',[{ text: '确定',}],{ cancelable: false })
                            }); 
                        }
                    }).catch(err => {
                        //若发生网络等其他错误，提示服务器繁忙
                        Alert.alert('服务器繁忙','服务器繁忙，请稍后重试~',[{ text: '确定',}],{ cancelable: false })
                    });
                }
                catch (e) {
                    //失败，提示服务器繁忙
                    Alert.alert('服务器繁忙','服务器繁忙，请稍后重试~',[{ text: '确定',}],{ cancelable: false })
                }
                
                       
            }else{
                //若是其他文件格式，则提示不支持此文件格式现在
                Alert.alert('此文件格式不支持下载','暂只支持图片、视频下载',[{ text: '确定',}],{ cancelable: false })
            }

        })
        .catch((error)=>{
            //失败，提示服务器繁忙
            Alert.alert('服务器繁忙','',[{ text: '确定',}],{ cancelable: false })
        })
    }
    render() {
        return (
            <ScrollView style={assetsDetail.assetsList}> 
                {/* StatusBar:是app状态栏的颜色 默认白底黑字*/}
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
                    <Text style={assetsDetail.assetsLeftTitle}>资产状态</Text>

                    {/*
                        三种不同的资产状态，对应不同的界面
                      */}

                    {
                        this.props.navigation.state.params.confirm_status==1 &&
                        <View style={assetsDetail.assetsOwner}>
                            <Icon name='ios-checkmark-circle' size={20} color='#075591' style={{marginTop:-6,marginRight: 4}}/>
                            <Text style={assetsDetail.assetsRightContent}>证实成功</Text>
                        </View>
                    }
                    {
                        this.props.navigation.state.params.confirm_status==2 &&
                        <View style={assetsDetail.assetsOwner}>
                            <Icon name='ios-close-circle' size={20} color='#CB4B4B' style={{marginTop:-4,marginRight: 4}}/>
                            <Text style={assetsDetail.assetsRightContent}>证实失败</Text>
                        </View>
                    }
                    {
                        this.props.navigation.state.params.confirm_status==0 &&
                        <View style={assetsDetail.assetsOwner}>
                            <Icon name='ios-information-circle' size={20} color='#CB4B4B' style={{marginTop:-4,marginRight: 4}}/>
                            <Text style={assetsDetail.assetsRightContent}>未证实</Text>
                        </View>
                    }
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
                    <View style={assetsDetail.assetsRightShowHistory}>
                        <Text style={[assetsDetail.assetsRightContent,assetsDetail.assetsFile]}>
                            {/* <Icon name='md-document' size={20} style={{color:'#F28321'}}/> */}
                                {this.props.navigation.state.params.filename==''?' 无附件': ' '+this.props.navigation.state.params.filename+' '} 
                                {
                                    (this.props.navigation.state.params.filename!='' && this.props.navigation.state.params.enable_trans ) &&
                                    <Icon name='md-cloud-download' size={20} style={{color:'#F28321'}} onPress={this.download.bind(this,this.props.navigation.state.params.asset_id)}/>
                                }
                            
                        </Text>
                        {/*
                        开始下载，显示下载进度条
                          */}
                        {
                            this.state.progressNum!='' &&
                            <View style={assetsDetail.progress}>
                                <Text style={{width:this.state.progressNum*100+'%',backgroundColor: '#F28321',height: 4}}></Text>
                            </View>
                        }
                       
                    </View>
                    
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
    progress:{
        flex: 1,
        backgroundColor: '#DEDEDE',
        height: 4,
    }
})
