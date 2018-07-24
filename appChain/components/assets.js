/*
    资产列表单公共组件
        多条资产交易组成交易列表，
    资产证实状态有三种：
        创建资产之后，资产证实需要一段时间（几秒到几分钟不等），此为第一种界面；
        证实成功；
        证实失败；

*/
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableHighlight,
    Alert
} from 'react-native';
//css样式文件
import assets from '../style/assets'
//字体图标插件
import Icon from 'react-native-vector-icons/Ionicons'
//后台接口请求地址
let fentchUrl = 'http://140.143.202.114:8080'
export default class AssetsList extends React.Component {
    
    render() {
        return (
            <View>
                {
                this.props.assetsListData && 
                    this.props.assetsListData.map((data,index)=>{
                        return(
                            <View key={index}>
                            {
                                data.confirm_status == 0 &&
                                <TouchableHighlight style={assets.assetsContent}  activeOpacity={1}> 
                                    <View style={assets.assetsDetails}>
                                        <View style={assets.detailsView}>
                                        <Image style={assets.userPhoto}
                                            source={require('../image/loading.gif')}>
                                        </Image>
                                        <Text style={[assets.assetsOwener,assets.asset_confirm]}>该资产正在证实，稍后您可通过刷新页面查看证实情况。</Text>
                                    </View>
                                        
                                    </View>
                                </TouchableHighlight>
                            }
                            {
                                data.confirm_status != 0 &&
                                <TouchableHighlight style={assets.assetsContent} 
                                    onPress = {this.props.showDealHistory.bind(this,
                                    //考虑到资产有证实的过程，所以新建资产之后获取不到相关的资产信息，传入的参数默认为空
                                    data.asset||'',//资产内容
                                    data.type, //资产类型
                                    data.username||'', //资产拥有者
                                    data.filename||'',//资产附件
                                    data.time,//资产创建时间
                                    data.asset_id,//资产id
                                    data.tx_id||null,//资产交易id
                                    data.enable_trans||false,//资产是否可以转移
                                    data.photo||null,//资产拥有者头像
                                    data.job||'',//资产拥有者工作
                                    data.confirm_status //资产证实状态
                                    )} activeOpacity={1}> 
                                    <View style={assets.assetsDetails}>
                                    <View style={[assets.detailsView,assets.detailTitle]}>
                                        <Text style={assets.detailAssetsBar}>资产内容</Text>
                                        <View style={assets.detailAssetsFile}>
                                                <Icon name='ios-link' size={14}/> 
                                                <Text style={assets.AssetsFile}>{(data.filename==''||!data.filename)?' 暂无附件':' 一个附件'}</Text>
                                            </View>
                                        
                                        
                                    </View>
                                    <Text style={assets.detailsAssetsContent} numberOfLines={2}>{data.asset}</Text>
                                    <View style={assets.detailsView}>
                                        <Image style={assets.userPhoto}
                                            source={data.photo==null?require('../image/Avatar.png'):{uri:fentchUrl+data.photo}}>
                                        </Image>
                                        <Text style={assets.assetsOwener}>{data.username}</Text>
                                        <Text style={assets.assetsTime}>{data.time}</Text>
                                    </View>
                                    </View>
                                </TouchableHighlight>
                            }
                            </View>
                        )
                    })
                }
            </View>
           
            
        );
    }
}

