import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  Button,
  Image,
} from 'react-native';
import {StackNavigator,TabNavigator,TabBarBottom} from 'react-navigation'; 
import SplashScreen from 'react-native-splash-screen'
import $ from 'jquery'
import Login from './Login'
import Home from './Home'
import AssetsDetail from './AssetDetail' 
import UserList from './UserList'
import AssetsHistory from './AssetsHistory'
import AddNewAssets from './AddNewAssets'
import TransAssets from './TransAssets'
import Picker from './picker'
import Register from './Register'
import Settingusermsg from './Settingusermsg'
import Settingpassword from './Settingpassword'
import SearchAssets from './SearchAssets'
export const Navigator = StackNavigator(
  {
    Login:{
      screen:Login,
      navigationOptions:{
        header:null
      }
    },
    Register:{
      screen:Register,
      navigationOptions:{
      }
    },
    Home:{
      screen:Home,
      navigationOptions:{
        // header:null
      }
    },
    AssetsDetail:{
      screen:AssetsDetail,
      navigationOptions:{

      }
    },
    SearchAssets:{
      screen:SearchAssets,
      navigationOptions:{

      }
    },
    AssetsHistory:{
      screen:AssetsHistory,
      navigationOptions:{
        
      }
    },
    AddNewAssets:{
      screen:AddNewAssets,
      navigationOptions:{
        
      }
    },
    TransAssets:{
      screen:TransAssets,
      navigationOptions:{

      }
    },
    UserList:{
      screen:UserList,
      navigationOptions:{

      }
    },
    Settingusermsg:{
      screen:Settingusermsg,
      navigationOptions:{
        
      }
    },
    Settingpassword:{
      screen:Settingpassword,
      navigationOptions:{
        
      }
    },
  },

  {navigationOptions:{  
    headerBackTitle:'返回',
    headerTintColor:'#F28321',
    showIcon:true,  
    swipeEnabled:false,  
    animationEnabled:false,
  },  
})
export default class App extends Component{
  
  componentDidMount(){
    SplashScreen.hide();//关闭启动屏幕
}
  render() {
    return (
      <Navigator />
    );
  }
}
