/**
 * Created by shiyunjie on 16/12/30.
 */
import React, {
    PropTypes,
    Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    PixelRatio,
    TouchableOpacity,
    Platform,
    Image,
    Dimensions,
} from 'react-native';
//import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import constants from  '../constants/constant';
import Swiper from 'react-native-swiper';
import image_default_banner from '../images/banner.png';    //需要换默认banner图
import Carousel from 'react-native-carousel';
const { width: deviceWidth } = Dimensions.get('window');

export default class IndexSwiper extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }


    static propTypes = {

        ...View.propTypes, // 包含默认的View的属性
        dataSource: PropTypes.array.isRequired,
        width: PropTypes.number.isRequired,
        autoplay: PropTypes.bool.isRequired,

    }

    /*
     <Swiper style={styles.swiperStyle}
     autoplay={this.props.autoplay}
     height={150}
     width={this.props.width}
     autoplayTimeout={3}
     loop={true}>
     <Image
     key={index}
     style={[{width: this.props.width, height: 150}]}
     //defaultSource={image_default_banner}
     source={{uri: `${item.big_url}`}}/>*/


    render() {
        return (
            <View style={{height: 150,width:deviceWidth}}>
                {()=> {
                    return Platform.OS == 'android' ?
                        <Carousel
                            width={deviceWidth}
                            delay={3000}
                            indicatorColor={'#FB687D'}
                            indicatorSize={25}
                            indicatorSpace={10}
                            indicatorOffset={0}
                            inactiveIndicatorColor={'#fff'}
                            inactiveIndicatorText='•'>
                            {
                                this.props.dataSource.map((item, index) => {
                                    return (
                                        <Image
                                            key={index}
                                            style={{width: this.props.width, height: 150}}
                                            //defaultSource={image_default_banner}
                                            source={{uri: `${item.big_url}`}}/>
                                    )
                                })
                            }
                        </Carousel> :
                        <Swiper style={styles.swiperStyle}
                                autoplay={this.props.autoplay}
                                height={150}
                                width={this.props.width}
                                autoplayTimeout={3}
                                loop={true}>
                            {
                                this.props.dataSource.map((item, index) => {
                                    return (
                                        <Image
                                            key={index}
                                            style={{width: this.props.width, height: 150}}
                                            //defaultSource={image_default_banner}
                                            source={{uri: `${item.big_url}`}}/>
                                    )
                                })
                            }
                        </Swiper>
                            }
                   }
            </View>

        )
    }

}

let styles = StyleSheet.create({
    swiperStyle: {
        //overflow: 'hidden',
        flex: 1,
        //backgroundColor: constants.UIActiveColor,
    },

});