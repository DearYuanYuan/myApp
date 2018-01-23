import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableHighlight,
    Alert
} from 'react-native';
import assets from '../style/assets'
import Icon from 'react-native-vector-icons/Ionicons'
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
                                    data.asset||'',
                                    data.type,
                                    data.username||'',
                                    data.filename||'',
                                    data.time,
                                    data.asset_id,
                                    data.tx_id||null,
                                    data.enable_trans||false,
                                    data.photo||null,
                                    data.job||'',
                                    data.confirm_status)} activeOpacity={1}> 
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

