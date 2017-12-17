import React from 'react';
import {
  StyleSheet
} from 'react-native';
import fontsize from '../components/plug/fontSize'
var styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        backgroundColor: '#213144',
    },
    loginTitleContainer:{
         flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginBtnActionCover:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title:{
        fontSize:fontsize(15),
        textAlign:'center',
        color:'#7F8A98',
        height:40,
        marginTop:12,
    },
    welcome: {
        fontSize: fontsize(20),
        textAlign: 'center',
        margin: 10,
        color:'#07a1ec',
    },
    logo:{
        width:100,
        height:34,
    },
    icon:{
        width: 50, 
        height: 50,
    },
    loginContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#18283B',
    },
    LoginTip:{
        width:280,
        fontSize:fontsize(13),
        color:'#7F8A98',
        textAlign:'left',
        marginBottom:10,
    },
    loginInput:{
        width:300,
        height:30,
        fontSize: fontsize(16),
        lineHeight:24,
        borderBottomWidth: 1,
        borderBottomColor: '#0F1E30',
        color:'#2E4663',
        marginBottom:20,
    },
    applyAccountLink:{
        // marginTop: 20,
        fontSize: fontsize(15),
        color: '#7F8A98',
    },
    scrollView:{
        backgroundColor: '#fff',
        height:1000,
    },
    homeHeadCover:{
        
    },
    homeHeadBlank:{
        height:110,
        backgroundColor: '#F28321',
    },
    headTopHome:{
        // marginTop:-20,
        flexDirection:'row',
        paddingLeft: 20,
        paddingRight: 20,
        position: 'relative',
    },
    errorMsg:{
        color: '#F28321',
        textAlign: 'center',
    },
    navBarIcon:{
        color: '#fff',
    },
    leftUserImg:{
        position: 'absolute',
        top:-20,
        left:20,
        width:100,
        height:100,
        borderRadius:50,
        backgroundColor:'#FFF',
        alignItems: 'center',
        justifyContent: 'center'
    },
    middleUserMsg:{
        flex: 5,
        paddingLeft:120,
        paddingTop: 14,
    },
    rightUserSet:{
        flex: 1,
        color: '#999',
        paddingTop: 20,
    },
    homeUsername:{
        fontSize: fontsize(16),
        marginBottom: 8,
    },
    homeDepartment:{
        fontSize: fontsize(16),
        color: '#7F8A98',
    },
    userAssetsAll:{
        flexDirection:'row',
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 30,
        borderBottomColor:'#7F8A98',
        borderBottomWidth:0.5,
        paddingBottom: 20,
    },
    assetsList:{
        flex: 1,
        marginTop: 8,
        borderRightColor:'#DEDEDE',
        borderRightWidth:1,
        paddingLeft: 12,
    },
    assetsListRight:{
        flex: 1,
        marginTop: 8,
        paddingLeft: 12,
    },
    assetsFont:{
        fontSize: fontsize(13),
        lineHeight:24,
        // textAlign: 'center',
        // marginBottom: 8,
    },
    assetsIcon:{
        color: '#F28321',
        fontSize: fontsize(24),
        // textAlign: 'center',
    },
    userMsgAll:{
        // flexDirection:'row',
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 30,
        borderBottomColor:'#7F8A98',
        borderBottomWidth:0.5,
        paddingBottom: 20,
    },
    userMsgList:{
        flexDirection:'row',
        alignItems: 'center',
        // justifyContent: 'center',
        flex: 1,
        marginTop: 8,
        // borderRightColor:'#DEDEDE',
        // borderRightWidth:1,
        paddingLeft: 12,
    },
    userMsgListRight:{
        flexDirection:'row',
        alignItems: 'center',
        flex: 1,
        marginTop: 8,
        paddingLeft: 12,
    },
    userMsgFont:{
        flex: 3,
        fontSize: fontsize(13),
        lineHeight:24,
        // textAlign: 'center',
        // marginBottom: 8,
    },
    userMsgIcon:{
        color: '#7F8A98',
        fontSize: fontsize(15),
        flex: 1,
        marginLeft: 30,
        // textAlign: 'center',
    },
    assetsContent:{
        paddingTop: 10,
        backgroundColor: '#eee',
    },
    userPhoto:{
        width:96,
        height:96,
        borderRadius:48,
    },
    loadingIcon:{
        height:40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    loadingMore:{
        width:40,
        height:40,
    },
    //下拉选择框
    pickerCover:{
    },
    pickerIconClick:{
        flexDirection:'row',
        height:40,
        borderColor:'#dedede',
        backgroundColor:'#f5f5f5',
        borderWidth:1,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 10,
        paddingLeft: 10,
    },
    pickerValue:{
        flex:4,
    },
    pickerListCover:{
        backgroundColor: '#f5f5f5',
        paddingLeft:20,
        height:160,
        
    },
    pickerList:{
        lineHeight:30,
        fontSize: fontsize(14),
        lineHeight:30,
    },
    actionLoading:{
        // height:600,
        // top:-380,
        // backgroundColor: '#FFFFFF',
        // opacity:0.5,
        paddingBottom: 20,
    },
    selectOtherCover:{
        flexDirection:'row',
        height:40,
        borderColor:'#dedede',
        backgroundColor:'#f5f5f5',
        borderWidth:1,
        borderRadius: 4,
        paddingRight: 10,
        paddingLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectOtherIpt:{
        flex: 3,
    },
    
    //注册
    registerStep:{
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepBox:{
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
        paddingTop: 20,
    },
    stepIcon:{
        width: 24,
        height:24,
        borderRadius: 24,
        backgroundColor: '#7f8a98',
        position: 'relative',
        marginBottom: 10,
    },
    stepIconActive:{
        backgroundColor: '#F28321',
    },
    stepNum:{
        position: 'absolute',
        top:4,
        left:8,
        zIndex:999,
        color: '#FFFFFF',
        fontSize: fontsize(13),
    },
    stepTips:{
        fontSize: fontsize(13),
        color: '#fff',
    },
    stepTipsActive:{
        color: '#F28321',
    },
    stepLine:{
        width:60,
        height:2,
        marginTop: -20,
        backgroundColor:'#6c7683',
    },
    registerTip:{
        fontSize: fontsize(16),
        color: '#FFFFFF',
        lineHeight:30,
        marginBottom: 40,
    },
    registerContainer:{
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#18283B',
        paddingTop: 20,
        paddingBottom: 20,
    },
    registerStepFirstBox:{
        height:200,
        // marginLeft: 20,
        marginBottom: 20,
    },
    //用户信息修改
    usrSetCover:{
        height:900,
        padding:20,
        backgroundColor: '#FFFFFF',
    },
    setUsrIconCover:{
        // justifyContent: 'center',
        alignItems: 'center',
    },
    usrMsgIpt:{
        backgroundColor: '#f5f5f5',
        borderColor: '#dedede',
        borderWidth:1,
        borderRadius: 6,
        height:40,
        lineHeight:42,
        fontSize: fontsize(14),
        padding: 10,
    },
    setUsrIcon:{
        width:100,
        height:100,
        borderRadius:50,
        borderColor:'#7F8A98',
        borderWidth:2,
        
    },
    changeIconBtn:{
        color: '#F28321',
        fontSize: fontsize(16),
        marginTop: 10,
        marginBottom: 10,
    },
    changePwdBtn:{
        backgroundColor: '#f5f5f5',
        borderColor: '#dedede',
        borderWidth:1,
        borderRadius: 6,
        height:40,
        // padding: 10,

    },
    changePwdIcon:{
        color: '#F28321',
        lineHeight:37,
    },
    changePwd:{
        fontSize: fontsize(16),
        lineHeight:37,
        textAlign: 'center',
        color: '#F28321',
    },
    listTopGaps:{
        height:12,
        backgroundColor: '#eee',
    },
});

module.exports = styles;