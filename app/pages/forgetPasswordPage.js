/**
 * Created by shiyunjie on 16/12/27.
 */
/**
 * Created by shiyunjie on 16/12/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    ActivityIndicator,
    ActivityIndicatorIOS,
    ProgressBarAndroid,
    Platform,
    NativeAppEventEmitter,
    TouchableOpacity,
    AsyncStorage,
} from 'react-native';

import Button from 'react-native-smart-button';
import constants from  '../constants/constant';
import Icon from 'react-native-vector-icons/Ionicons';
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式
import XhrEnhance from '../lib/XhrEnhance' //http

//import { register_firstStep, check_msg_code, errorXhrMock } from '../mock/xhr-mock'   //mock data

import {getDeviceID,getToken,getRegMsgSerial,getForMsgSerial} from '../lib/User'
import RegisterPage from './registerPage';
import SetPassword from './setPasswordPage';
import Toast from 'react-native-smart-toast'
import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'
import ValidateTextInput from '../components/validateTextInput'

let nextPage;
let secondNum

class ForgetPassword extends Component {
    // 构造
    constructor(props) {
        super(props);
        nextPage = this.props.nextPageIndex;
        // 初始状态
        this.state = {
            phone: '',
            code: '',
            ButtonText:'',
        };
        secondNum=60
       this._phoneValidate=false;
        this._phoneReg = /^1[34578]\d{9}$/;
    }

    componentWillMount() {
        NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
        let currentRoute = this.props.navigator.navigationContext.currentRoute
        this.addAppEventListener(
            this.props.navigator.navigationContext.addListener('willfocus', (event) => {
                console.log(`orderPage willfocus...`)
                console.log(`currentRoute`, currentRoute)
                //console.log(`event.data.route`, event.data.route)
                if (event && currentRoute === event.data.route) {
                    console.log("orderPage willAppear")
                    NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
                } else {
                    console.log("orderPage willDisappear, other willAppear")
                }
                //
            })
        )
    }



    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearInterval(this.timer);
        this._button_3.setState({
            loading: true,
            //disabled: true,
        })
    }

    render() {

        return (
            <View style={{flex:1}}>
                <View style={styles.container}>
                    <ValidateTextInput
                        ref={ component => this._input_phone = component }
                        style={[styles.textInput,{ paddingLeft:10,paddingRight:10,}]}
                        clearButtonMode="while-editing"
                        placeholder='请输入您的手机号'
                        maxLength={20}
                        keyboardType='numeric'
                        underlineColorAndroid='transparent'
                        editable={true}
                        value={this.state.phone}
                        onChangeText={(text) => this.setState({phone:text})}
                        validate={this._phoneValidate}
                        reg={this._phoneReg}/>
                    <View style={[styles.textInput,{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'stretch',
                       }]}>
                        <TextInput style={[{flex:2, paddingLeft:10,paddingRight:10,}]}
                                   clearButtonMode="while-editing"
                                   placeholder='请输入验证码'
                                   keyboardType='numeric'
                                   maxLength={20}
                                   underlineColorAndroid='transparent'
                                   editable={true}
                                   value={this.state.code}
                                   onChangeText={(text) => this.setState({code:text})}/>
                        <Button
                            ref={ component => this._button_3 = component }
                            touchableType={Button.constants.touchableTypes.fadeContent}
                            style={[styles.button,{flex:1,marginRight:10,height:30,alignSelf:'center'}]}
                            textStyle={{fontSize: 15, color: 'white'}}
                            loadingComponent={
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                { /*this._renderActivityIndicator()*/}
                                <Text style={{fontSize: 15, color: 'white', fontWeight: 'bold', fontFamily: '.HelveticaNeueInterface-MediumP4',}}>{this.state.ButtonText}</Text>
                            </View>
                            }
                            onPress={ () => {
                        if(!this._phoneValidate){
                        this._input_phone.setState({
                        backgroundColor:'#ffb5b5',
                        })
                         this._toast.show({
                            position: Toast.constants.gravity.center,
                            duration: 255,
                            children: '手机号码错误'
                        })

                        }else{
                           this.timer = setInterval(
                          () => {
                          secondNum--
                          this.setState({ButtonText:`${secondNum}秒`})

                          if(secondNum<=0){
                          this._button_3.setState({
                            loading: false,
                            //disabled: false
                            })
                         clearInterval(this.timer);
                         secondNum=60
                          this.setState({ButtonText:`${secondNum}秒`})
                          }
                           },
                          1000
                        );
                         this._button_3.setState({
                            loading: true,
                            //disabled: true,
                        })

                         this._fetchData_code()
                        /*setTimeout( () => {
                           /!* this._button_3.setState({
                                loading: false,
                                //disabled: false
                            });*!/


                        }, 1000)*/
                        }
                        }}>
                            发送验证码
                        </Button>
                    </View>


                    <Button
                        ref={ component => this._button_2 = component }
                        touchableType={Button.constants.touchableTypes.fadeContent}
                        style={[styles.button,{ marginLeft: constants.MarginLeftRight,
                    marginRight: constants.MarginLeftRight,
                    marginTop: 20,}]}
                        textStyle={{fontSize: 17, color: 'white'}}
                        loadingComponent={
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                {this._renderActivityIndicator()}
                                <Text style={{fontSize: 17, color: 'white', fontWeight: 'bold', fontFamily: '.HelveticaNeueInterface-MediumP4',}}>
                                {this.state.ButtonText}</Text>
                            </View>
                    }
                        onPress={ () => {
                    if(this.state.phone==''||this.state.code==''){
                     this._toast.show({
                            position: Toast.constants.gravity.center,
                            duration: 255,
                            children: '请填写验证码'
                        })
                    }else{
                        this._button_2.setState({
                            loading: true,
                            //disabled: true,
                        })

                            this._button_2.setState({
                                loading: false,
                                //disabled: false
                            })


                        this._fetchData_submit()
                    }
                    }}>
                        下一步
                    </Button>

                </View>

                <Toast
                    ref={ component => this._toast = component }
                    marginTop={64}>

                </Toast>
            </View>
        );
    }

    _renderActivityIndicator() {
        return ActivityIndicator ? (
            <ActivityIndicator
                style={{margin: 10,}}
                animating={true}
                color={'#fff'}
                size={'small'}/>
        ) : Platform.OS == 'android' ?
            (
                <ProgressBarAndroid
                    style={{margin: 10,}}
                    color={'#fff'}
                    styleAttr={'Small'}/>

            ) : (
            <ActivityIndicatorIOS
                style={{margin: 10,}}
                animating={true}
                color={'#fff'}
                size={'small'}/>
        )


    }

    async _fetchData_code() {
        try {
            let token= await getToken()
            let deviceID= await getDeviceID()
            let options = {
                method: 'post',
                url: constants.api.service,
                data: {
                    iType:nextPage=='forget'?constants.iType.forgetPwdCode: constants.iType.register_firstStep,
                    //memberId:this.props.memberId,
                    phone: this.state.phone,
                    deviceId: deviceID,
                    token: token,
                }
            }

            options.data = await this.gZip(options)


            let resultData = await this.fetch(options)

            let result = await this.gunZip(resultData)
            console.log('result:', result)
            result = JSON.parse(result)

            console.log('gunZip:', result)
            if (result.code && result.code == 10) {
                if(nextPage=='forget'){
                    console.log('forget')
                    AsyncStorage.setItem('ForMsgSerial',result.result)
                }else{
                    console.log('regist:',result.result)
                    AsyncStorage.setItem('RegMsgSerial',result.result)
                    console.log('AsyncStorage_segMsgSerial')
                }

                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '验证码已发送'
                })
            } else {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: result.msg
                })
                //发送错误,重置按钮
                this._button_3.setState({
                    loading: false,
                    //disabled: false
                })
                clearInterval(this.timer);
                secondNum=60
                this.setState({ButtonText:`${secondNum}秒`})
            }


        } catch (error) {
            console.log(error)


        } finally {
           /* this._button_3.setState({
                loading: false,
                //disabled: false
            })*/
            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }
    }

    async _fetchData_submit() {
        try {
            let token= await getToken()
            let deviceID= await getDeviceID()
            let send_no
            if(nextPage=='forget'){
                send_no=await getForMsgSerial()

            }else{
                send_no=await getRegMsgSerial()

            }

            console.log(`send_no`,send_no)
            let options = {
                method: 'post',
                url: constants.api.service,
                data: {
                    iType:nextPage=='forget'?constants.iType.checkForgetCode:constants.iType.checkMsgCode,
                    //memberId:this.props.memberId,
                    phone: this.state.phone,
                    code: this.state.code,
                    send_no:send_no,
                    deviceId: deviceID,
                    token: token,
                }
            }

            options.data = await this.gZip(options)

            console.log(`_fetch_sendCode options:`, options)

            let resultData = await this.fetch(options)

            let result = await this.gunZip(resultData)
            console.log('result:', result)
            result = JSON.parse(result)

            console.log('gunZip:', result)
            if (result.code && result.code == 10) {
                console.log('nextPage:',nextPage)
                if(nextPage=='forget'){
                    this.props.navigator.replace({
                        title: '忘记密码',
                        component: SetPassword,
                        passProps:{
                            phone:this.state.phone,
                        }
                    });
                }else {
                    //跳转注册
                    this.props.navigator.replace({
                        title: '注册',
                        component: RegisterPage,
                        passProps: {
                            phone: this.state.phone,
                        }
                    });
                }
            } else {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: result.msg
                })
            }


        } catch (error) {
            console.log(error)


        } finally {
            this._button_3.setState({
                loading: false,
                //disabled: false
            })

        }
    }


}
const styles = StyleSheet.create(
    {
        container: {
            marginTop: Platform.OS == 'ios' ? 64 + 10 : 56 + 10,
            flex: 1,
            flexDirection: 'column',
            alignItems: 'stretch',
            backgroundColor: constants.UIBackgroundColor,
        },
        textInput: {
        backgroundColor: 'white',
        height: 40,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIBackgroundColor,

    },
        button: {
        height: 40,
        backgroundColor: constants.UIActiveColor,
        borderRadius: 3, borderWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIActiveColor,
        justifyContent: 'center', borderRadius: 30
    }
    });
const navigationBarRouteMapper = {

    LeftButton: function (route, navigator, index, navState) {
        if (index === 0) {
            return null;
        }

        var previousRoute = navState.routeStack[index - 1];
        return (
            <TouchableOpacity
                onPress={() => navigator.pop()}
                style={navigatorStyle.navBarLeftButton}>
                <View style={navigatorStyle.navBarLeftButtonAndroid}>
                    <Icon
                        style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText,{fontSize: 20,}]}
                        name={'ios-arrow-back'}
                        size={constants.IconSize}
                        color={'white'}/>
                </View>
            </TouchableOpacity>

        );
    },

    RightButton: function (route, navigator, index, navState) {

    },

    Title: function (route, navigator, index, navState) {
        return (
            Platform.OS == 'ios' ?
                <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
                    {route.title}
                </Text> : <View style={navigatorStyle.navBarTitleAndroid}>
                <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
                    {route.title}
                </Text>
            </View>
        )
    },

}


export default AppEventListenerEnhance(XhrEnhance(ForgetPassword))