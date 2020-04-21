import React, { Fragment } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TextInput,
    CheckBox,
    Image,
    Picker,
    Dimensions,
    TouchableOpacity,
    PermissionsAndroid,
    Alert,
    TouchableHighlight,
    ActivityIndicator
} from 'react-native';
import DrawerWrapper from '../../commons/rightDrawerWrapper'
import RNFetchBlob from 'rn-fetch-blob'
import Modal from "react-native-modal";
import {
    orderCancel,
    deliverOrderService,
    extendDeliverTimeService,
    addCustomExtraService,
    orderHistory,
    cancelExtendService,
    cancelCustomExtraService
} from '../../services/order';
import { Rating } from 'react-native-elements';
import { connect } from 'react-redux';
import FilePickerManager from 'react-native-file-picker';
import { widthPercentageToDP, heightPercentageToDP } from '../../commons/responsive_design';

class Details extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 'active',
            details: [],
            modalVisible: false,
            messageToSeller: '',
            history: [],
            orderId: this.props.navigation.state.params.orderDetails.o_id ? this.props.navigation.state.params.orderDetails.o_id : this.props.navigation.state.params.orderDetails.wlt_reference_id,
            sellerId: this.props.navigation.state.params.orderDetails.o_seller_id ? this.props.navigation.state.params.orderDetails.o_seller_id : '',
            buyerId: this.props.navigation.state.params.orderDetails.o_buyer_id ? this.props.navigation.state.params.orderDetails.o_buyer_id : '',
            orderCancelled: false,
            extendModalVisible: false,
            deliverModalVisible: false,
            customModalVisible: false,
            previeModelVisible: false,
            msgToBuyer: '',
            customPrice: '',
            customDays: '',
            deliverMsg: '',
            deliverDays: '',
            extendMsg: '',
            extendDays: '',
            customMsg: '',
            acceptOrderVisible: false,
            requestModificationVisible: false,
            isWaterMarkModalVisible: false,
            fileResponse: '',
            withWatermark: 0,
            loader: false,
            actionState: false,
            deliveryDescription: true,
            imagePath: '',
            orderDelivered: false,
            transactionData: [],
            t_r_title: '',
            t_r_root_image: '',
            t_name: '',
            t_sold_on: '',
            t_order_id: ''
        }
    }

    componentDidMount = async () => {
        this.setState({ loader: true })
        this.focusListener = this.props.navigation.addListener('didFocus', async() => {
            this.setState({ loader: true })
            console.log("this.props.navigation.state.params.orderDetails", this.props.navigation.state.params.orderDetails)
            // this.setState(prevState => ({
            //     details: [...prevState.details, this.props.navigation.state.params.orderDetails]
            // }));
            this.setState({
                details: this.props.navigation.state.params.orderDetails
            });
            let history = await orderHistory(this.props.token, this.state.orderId)
            console.log("============>>>>>>>>>>>>>>", history)
            if (history.status == 1) {
                console.log("in history .................", history.status)
                this.setState({ loader: false })
                // arr.push(history.data)
                history.data.r_title && this.setState({ t_r_title: history.data.r_title, t_r_root_image: history.data.rf_file_name, t_name: history.data.username, t_sold_on: history.data.o_created_at, t_order_id: history.data.order_id })
                this.setState({ history: history.data.history })

                console.log("this.state.history", this.state.history, this.state.history.length)
            }
            this.state.history.map((item) => {
                if (item.type == 0 || item.type == 7) {
                    this.setState({ orderCancel: true, false: true })
                } else if (item.type == 2) {
                    this.setState({ orderDelivered: true })
                }else if(item.type == 6 || item.type == 7){
                    this.setState({ deliveryDescription: false})
                }
            })
        })
    }
    componentWillUnmount() {
        this.focusListener.remove();
      }
    cancelOrder = async () => {
        let response = await orderCancel(
            this.props.token,
            this.props.navigation.state.params.orderDetails.o_seller_id,
            this.props.navigation.state.params.orderDetails.o_buyer_id,
            this.state.messageToSeller,
            this.props.navigation.state.params.orderDetails.o_id
        )
        if (response.status == 1) {
            this.setState({ modalVisible: false })
            let history = await orderHistory(this.props.token, this.state.orderId)
            console.log("============>>>>>>>>>>>>>>", history)
            if (history.status == 1) {
                console.log("in history .................", history.status)
                this.setState({ loader: false })
                // arr.push(history.data)
                this.setState({ history: history.data.history })

                console.log("this.state.history", this.state.history, this.state.history.length)
            }
            this.setState({ orderCancelled: true })
        } else {
            this.setState({ modalVisible: false })
            Alert.alert("Something went wrong, please try again later")
        }
    }

    sendCustomExtra = async () => {
        let response = await addCustomExtraService(
            this.props.token,
            this.state.customMsg,
            this.state.customDays,
            this.state.sellerId,
            this.state.buyerId,
            this.state.orderId,
            this.state.customPrice
        )
        if (response.status == 1) {
            this.setState({ customModalVisible: false })
            let history = await orderHistory(this.props.token, this.state.orderId)
            console.log("============>>>>>>>>>>>>>>", history)
            if (history.status == 1) {
                console.log("in history .................", history.status)
                this.setState({ loader: false })
                // arr.push(history.data)
                this.setState({ history: history.data.history })

                console.log("this.state.history", this.state.history, this.state.history.length)
            }
            Alert.alert("Custom extra added successfully")
        } else {
            this.setState({ customModalVisible: false })
            Alert.alert("Something went wrong, please try again later")
        }
    }

    selectFiles = async () => {
        FilePickerManager.showFilePicker(null, async (response) => {
            if (response.didCancel) {
            }
            else if (response.error) {
            }
            else {
                if (response.type == "image/jpeg" || "image/png") {
                    this.setState({ isWaterMarkModalVisible: true, fileResponse: response })
                }
                else {
                    this.setState({ fileResponse: response })
                }
            }
        });
    }

    deliverOrder = async () => {
        let response = await deliverOrderService(
            this.props.token,
            this.state.deliverMsg,
            this.state.orderId,
            this.state.sellerId,
            this.state.buyerId,
            this.state.withWatermark,
            this.state.fileResponse
        )
        if (response.status == 1) {
            this.setState({ deliverModalVisible: false })
            let history = await orderHistory(this.props.token, this.state.orderId)
            console.log("============>>>>>>>>>>>>>>", history)
            if (history.status == 1) {
                console.log("in history .................", history.status)
                this.setState({ loader: false })
                // arr.push(history.data)
                this.setState({ history: history.data.history })

                console.log("this.state.history", this.state.history, this.state.history.length)
            }
            Alert.alert("Order Delivered Successfully")
        } else {
            this.setState({ deliverModalVisible: false })
            Alert.alert("Something went wrong, please try again later")
        }
    }


    extendTime = async () => {
        console.log("++++++++++", this.props.token,
            this.state.extendDays,
            this.state.sellerId,
            this.state.buyerId,
            this.state.orderId)
        let response = await extendDeliverTimeService(
            this.props.token,
            this.state.extendMsg,
            this.state.extendDays,
            this.state.sellerId,
            this.state.buyerId,
            this.state.orderId
        )
        console.log(">>>>>>>>>>>>>>>>>", response)
        if (response.status == 1) {
            this.setState({ extendModalVisible: false })
            let history = await orderHistory(this.props.token, this.state.orderId)
            console.log("============>>>>>>>>>>>>>>", history)
            if (history.status == 1) {
                console.log("in history .................", history.status)
                this.setState({ loader: false })
                // arr.push(history.data)
                this.setState({ history: history.data.history })

                console.log("this.state.history", this.state.history, this.state.history.length)
            }
            Alert.alert("time successfully extended")

        } else {
            this.setState({ extendModalVisible: false })
            Alert.alert("Something went wrong, please try again later")
        }
    }

    cancelAction = () => {
        return Alert.alert(
            'Confirm',
            'Are You Sure ?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => this.confirmAction() },
            ],
            { cancelable: false },
        );
    }

    cancelCustom = () => {
        return Alert.alert(
            'Confirm',
            'Are You Sure ?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => this.confirmCancelCustom() },
            ],
            { cancelable: false },
        );
    }

    confirmAction = async () => {
        console.log("=>>>>>>>>>>>", this.state.orderId)
        let response = await cancelExtendService(this.props.token, this.state.orderId)
        if (response.status == 1) {
            let history = await orderHistory(this.props.token, this.state.orderId)
            console.log("============>>>>>>>>>>>>>>", history)
            if (history.status == 1) {
                this.setState({ loader: false })
                this.setState({ history: history.data.history })
                Alert.alert("Success")
                console.log("this.state.history", this.state.history, this.state.history.length)
            }
        } else {
            Alert.alert("Something went wrong, please try again later")
        }
    }

    confirmCancelCustom = async () => {
        console.log("++++++++++++++++++++++++")
        let response = await cancelCustomExtraService(this.props.token, this.state.orderId)
        if (response.status == 1) {
            let history = await orderHistory(this.props.token, this.state.orderId)
            console.log("============>>>>>>>>>>>>>>", history)
            if (history.status == 1) {
                this.setState({ loader: false })
                this.setState({ history: history.data.history })
                Alert.alert("Success")
                console.log("this.state.history", this.state.history, this.state.history.length)
            }
        } else {
            Alert.alert("Something went wrong, please try again later")
        }
    }

    downloadAttachment = async (filePath) => {

        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                const { dirs } = RNFetchBlob.fs;
                RNFetchBlob
                    .config({
                        fileCache: true,
                        addAndroidDownloads: {
                            useDownloadManager: true,
                            notification: true,
                            mediaScannable: true,
                            title: filePath,
                            mime: 'image/jpeg',
                            path: dirs.DownloadDir + filePath,
                        },
                    })
                    .fetch('GET', filePath, {
                        //some headers ..
                    })
                    .then((res) => {
                        Alert.alert('File Downloaded Successfully to', res.path());
                    })
            } else {
                Alert.alert('Permission Denied!', 'You need to give storage permission to download the file');
            }
        } catch (err) {
            console.warn(err);
        }
    }

    render() {
        console.log("orderDetails", this.props.navigation.state.params.orderDetails, this.props.navigation.state.params.from)
        let total = this.state.details.o_amount + this.state.details.o_processing_fees
        console.log("this.state.loader",this.state.loader)
        return (
            <DrawerWrapper {...this.props}>
                {/* {ismount?
                <ActivityIndicator size="large" color="#10A2EF" />
                : */}
                <ScrollView>
                    {
                        !this.state.loader
                            ?
                            <View style={{ padding: 10, alignItems: 'center' }}>
                                {
                                    this.props.type == 1 ?
                                        <View style={styles.cardView}>
                                            
                                        </View>
                                        :
                                        null
                                }
                                <View style={styles.container}>
                                    <View style={{ alignContent: 'center', alignItems: 'center' }}>
                                        <Image style={{ height: 150, width: 150 }} source={{ uri: this.state.details.r_root_image ? this.state.details.r_root_image : this.state.t_r_root_image }} />
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ fontSize: 20, width: 200, fontWeight: 'bold', color: '#748f9e' }}>{this.state.details.r_title ? this.state.details.r_title : this.state.t_r_title}</Text>
                                        <Text style={{ color: '#2ec09c', fontSize: 20 }}>${total}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image style={{ height: 50, width: 50, borderRadius: 50 }} source={{ uri: 'https://cdn.talentsroot.com/upload/profile/' + this.state.details.profile }} />
                                        <View style={{ marginTop: 10, flexDirection: 'row' }}>
                                            <Text style={{ color: '#748f9e', fontWeight: '900' }}>{this.props.navigation.state.params.from == "sales" ? "Buyer:" : "Seller:"} </Text>
                                            <Text style={{ color: '#748f9e', fontWeight: '900' }}>{this.state.details.name ? this.state.details.name : this.state.t_name}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                        <Text style={{ color: '#748f9e', fontWeight: '500' }}>Order #{this.state.details.o_order_id ? this.state.details.o_order_id : this.state.t_order_id}</Text>
                                        <Text style={{ color: '#748f9e', fontWeight: '500' }}>{this.state.details.sold_on ? this.state.details.sold_on : this.state.t_sold_on}</Text>
                                    </View>
                                </View>
                                {
                                    this.state.history.length == 0 ? null :
                                        this.state.history.map((item) => {
                                            console.log("history===========",item)
                                            if (item.type == 5) {
                                                return (
                                                    <>
                                                        <View>
                                                            <View style={[styles.container, { flexDirection: 'row', marginTop: 20, paddingHorizontal: 0, paddingVertical: 0 }]}>
                                                                <View style={{ justifyContent: 'center', backgroundColor: '#ffca30', borderTopLeftRadius: 10, borderBottomStartRadius: 10, width: 60, height: null }}>
                                                                    <Image source={{ uri: 'https://www.talentsroot.com/images/staricon1.png' }} style={{ height: 50, width: 50, padding: 5, marginLeft: 4 }} />
                                                                </View>
                                                                <View style={{ display: 'flex', marginLeft: 10, padding: 10 }}>
                                                                    <Text style={{ fontSize: 20, marginVertical: 10, width: 200 }}>{item.data.title}</Text>

                                                                    <Text>Feedback Message:</Text>
                                                                    <Text style={{ fontSize: 20, width: 200 }}>{item.data.messages}</Text>
                                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                        <Text style={{ fontSize: 15 }}>Communication Level: </Text>
                                                                        <Rating
                                                                            readonly
                                                                            imageSize={6}
                                                                            style={{ marginTop: 5 }}
                                                                            startingValue={item.data.communication_level}
                                                                        />
                                                                    </View>
                                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                        <Text style={{ fontSize: 15 }}>Quality of work: </Text>
                                                                        <Rating
                                                                            readonly
                                                                            imageSize={6}
                                                                            style={{ marginTop: 5 }}
                                                                            startingValue={item.data.quality_of_delivered_work}
                                                                        />
                                                                    </View>
                                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                        <Text style={{ fontSize: 15 }}>Recommended to others: </Text>
                                                                        <Rating
                                                                            readonly
                                                                            imageSize={6}
                                                                            style={{ marginTop: 5 }}
                                                                            startingValue={item.data.recommended_for_others}
                                                                        />
                                                                    </View>
                                                                    <Text style={{ alignSelf: 'flex-end', color: '#748f9e', marginTop: 8 }}>{item.data.created_at}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </>
                                                )
                                            }
                                            else if (item.type == 4) {
                                                return (
                                                    <View>
                                                        <View style={[styles.container, { flexDirection: 'row', marginTop: 20, paddingHorizontal: 0, paddingVertical: 0 }]}>
                                                            <View style={{ justifyContent: 'center', backgroundColor: '#2ec09c', borderTopLeftRadius: 10, borderBottomStartRadius: 10, width: 60, height: null }}>
                                                                <Image source={{ uri: 'https://www.talentsroot.com/images/accepted.png' }} style={{ height: 50, width: 50, padding: 5, marginLeft: 4 }} />
                                                            </View>
                                                            <View style={{ display: 'flex', marginLeft: 10, padding: 10 }}>
                                                                <Text style={{ fontSize: 20, marginVertical: 10, width: 200 }}>{item.data.title}</Text>
                                                                <Text style={{ alignSelf: 'flex-end', color: '#748f9e', marginTop: 8 }}>{item.data.created_at}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                )
                                            }
                                            else if (item.type == 3) {
                                                return (
                                                    <View>
                                                        <View style={[styles.container, { flexDirection: 'row', marginTop: 20, paddingHorizontal: 0, paddingVertical: 0 }]}>
                                                            <View style={{ justifyContent: 'center', backgroundColor: '#10a2ef', borderTopLeftRadius: 10, borderBottomStartRadius: 10, width: 60, height: null }}>
                                                                <Image source={{ uri: 'https://www.talentsroot.com/images/delivered.png' }} style={{ height: 50, width: 50, padding: 5, marginLeft: 4 }} />
                                                            </View>
                                                            <View style={{ display: 'flex', marginLeft: 10, padding: 10 }}>
                                                                <Text style={{ fontSize: 20, marginVertical: 10}}>{item.data.title}</Text>
                                                                <Text style={{ fontSize: 20, marginVertical: 10 }}>{item.data.message}</Text>
                                                                {item.data.file ? <Text style={{ fontSize: 20, marginVertical: 10 }}>Attachments</Text> : null}
                                                                {item.data.file ?
                                                                    item.data.file.map((data) => {
                                                                        console.log("********************", data)
                                                                        return (
                                                                            <View style={{ display: 'flex', flexDirection: 'row', width: 200 }}>
                                                                                <TouchableOpacity onPress={() => this.setState({ previeModelVisible: true, imagePath: data.file_name })}>
                                                                                    <Text>
                                                                                        {data.type == "image/jpeg" || data.type == "image/png" ? 'image' : 'file'}
                                                                                    </Text>
                                                                                </TouchableOpacity>
                                                                            </View>
                                                                        )
                                                                    })
                                                                    : null}
                                                                <Text style={{ alignSelf: 'flex-end', color: '#748f9e', marginTop: 8 }}>{item.data.created_at}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                )
                                            }else if(item.type == 6){
                                                return (
                                                    <View>
                                                        <View style={[styles.container, { flexDirection: 'row', marginTop: 20, paddingHorizontal: 0, paddingVertical: 0 }]}>
                                                            <View style={{ justifyContent: 'center', backgroundColor: '#2ec09c', borderTopLeftRadius: 10, borderBottomStartRadius: 10, width: 60, height: null }}>
                                                                <Image source={{ uri: 'https://www.talentsroot.com/images/accepted.png' }} style={{ height: 50, width: 50, padding: 5, marginLeft: 4 }} />
                                                            </View>
                                                            <View style={{ display: 'flex', marginLeft: 10, padding: 10 }}>
                                                                <Text style={{ fontSize: 20, marginVertical: 10}}>{item.data.title}</Text>
                                                                <Text style={{ alignSelf: 'flex-end', color: '#748f9e', marginTop: 8 }}>{item.data.created_at}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                )
                                            }else if(item.type == 7){
                                                
                                                return (
                                                    <View>
                                                        <View style={[styles.container, { flexDirection: 'row', marginTop: 20, paddingHorizontal: 0, paddingVertical: 0 }]}>
                                                            <View style={{ justifyContent: 'center', backgroundColor: '#2ec09c', borderTopLeftRadius: 10, borderBottomStartRadius: 10, width: 60, height: null }}>
                                                                <Image source={{ uri: 'https://www.talentsroot.com/images/accepted.png' }} style={{ height: 50, width: 50, padding: 5, marginLeft: 4 }} />
                                                            </View>
                                                            <View style={{ display: 'flex', marginLeft: 10, padding: 10 }}>
                                                                <Text style={{ fontSize: 20, marginVertical: 10}}>{item.data.title}</Text>
                                                                <Text style={{ alignSelf: 'flex-end', color: '#748f9e', marginTop: 8 }}>{item.data.created_at}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                )
                                            }
                                            else {
                                                return (
                                                    <View>
                                                        <View style={[styles.container, { flexDirection: 'row', marginTop: 20, paddingHorizontal: 0, paddingVertical: 0 }]}>

                                                            <View style={{ flex: 1, flexDirection: 'row'}}>
                                                                {item.type == 0 || item.type == 2 ?
                                                                    <>
                                                                        {item.type == 0 ?
                                                                            <>
                                                                                <View style={{ justifyContent: 'center', backgroundColor: '#ff6060', borderTopLeftRadius: 10, borderBottomStartRadius: 10, width: 60, height: null }}>
                                                                                    <Image source={{ uri: 'https://www.talentsroot.com/images/accepted.png' }} style={{ height: 50, width: 50, padding: 5, marginLeft: 4 }} />
                                                                                </View>
                                                                                <View style={{ flex:1 , marginLeft: 10, padding: 5 }}>
                                                                                    <Text style={{ fontSize: 20, marginVertical: 10}}>{item.data.title}</Text>
                                                                                    <Text style={{ alignSelf: 'flex-end', color: '#748f9e', marginTop: 8 }}>{item.data.created_at}</Text>
                                                                                </View>
                                                                            </> :
                                                                            <>
                                                                                <View style={{ justifyContent: 'center', backgroundColor: '#10a2ef', borderTopLeftRadius: 10, borderBottomStartRadius: 10, width: 60, height: null }}>
                                                                                    <Image source={{ uri: 'https://www.talentsroot.com/images/delivered.png' }} style={{ height: 50, width: 50, padding: 5, marginLeft: 4 }} />
                                                                                </View>
                                                                                <View style={{flex: 1, marginLeft: 10, padding: 10}}>
                                                                                    <Text style={{ fontSize: 20, marginVertical: 10, flexShrink: 1}}>{item.data.title}</Text>
                                                                                    <Text style={{ fontSize: 20, marginVertical: 10 , flexShrink: 1}}>{item.data.message}</Text>
                                                                                    <Text style={{ fontSize: 20, marginVertical: 10 }}>Attachments</Text>
                                                                                    {item.data.file ?
                                                                                        item.data.file.map((data) => {
                                                                                            console.log("********************", data)
                                                                                            return (
                                                                                                <View style={{ display: 'flex', flexDirection: 'row', width: 200 }}>
                                                                                                    <TouchableOpacity onPress={() => this.setState({ previeModelVisible: true, imagePath: data.file_name })}>
                                                                                                        <Text>
                                                                                                            {data.type == "image/jpeg" || data.type == "image/png" ? 'image' : 'file'}
                                                                                                        </Text>
                                                                                                    </TouchableOpacity>
                                                                                                </View>
                                                                                            )
                                                                                        })
                                                                                        : null}
                                                                                    <Text style={{ alignSelf: 'flex-end', color: '#748f9e', marginTop: 8 }}>{item.data.created_at}</Text>
                                                                                </View>
                                                                            </>
                                                                        }
                                                                    </> :
                                                                    <>
                                                                        <View style={{ justifyContent: 'center', backgroundColor: '#10a2ef', borderTopLeftRadius: 10, borderBottomStartRadius: 10, width: 60, height: null }}>
                                                                            {item.type == 1 || item.type == 2 ?
                                                                                <Image source={{ uri: 'https://www.talentsroot.com/images/sent.png' }} style={{ height: 50, width: 50, padding: 5, marginLeft: 4 }} />
                                                                                :
                                                                                <Image source={{ uri: 'https://www.talentsroot.com/images/accepted.png' }} style={{ height: 50, width: 50, padding: 5, marginLeft: 4 }} />
                                                                            }
                                                                        </View>
                                                                        <View style={{ flex:1, marginLeft: 10}}>
                                                                            <Text style={{ fontSize: 20, marginVertical: 10 }}>{item.data.title}</Text>
                                                                            <View style={{ marginLeft: 10, paddingRight: 5 }}>
                                                                                <View style={{ flexDirection: 'row'}}>
                                                                                    <View style={{width: 100}}>
                                                                                        <Text style={{ fontWeight: 'bold', fontSize: 16}}>Description : </Text>
                                                                                    </View>
                                                                                    <View style={{flex:1}}>
                                                                                        <Text style={{ fontWeight: 'bold', fontSize: 14, flexWrap:'wrap' }}>{item.data.message}</Text>
                                                                                    </View>
                                                                                </View>
                                                                                <View style={{ flexDirection: 'row'}}>
                                                                                    <View style={{width: 100}}>
                                                                                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Delivery :</Text>
                                                                                    </View>
                                                                                    <View style={{flex:1}}>
                                                                                        <Text style={{ fontSize: 14, flexWrap:'wrap'  }}>{item.data.day} day</Text>
                                                                                    </View>
                                                                                </View>
                                                                                {item.type == 8 ? <View>
                                                                                    <View style={{ flexDirection: 'row'}}>
                                                                                        <View style={{width: 100}}>
                                                                                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Price :</Text>
                                                                                        </View>
                                                                                        <View style={{flex:1}}>
                                                                                            <Text style={{ fontSize: 14, flexWrap:'wrap' }}>${item.data.price}</Text>
                                                                                        </View>
                                                                                    </View>
                                                                                </View> : null}
                                                                                <View style={{ flexDirection: 'row'}}>
                                                                                    <View style={{width: 100}}>
                                                                                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Status :</Text>
                                                                                    </View>
                                                                                    <View style={{flex:1}}>
                                                                                        <Text style={{ fontSize: 14 }}>{item.data.status}</Text>
                                                                                    </View>
                                                                                </View>
                                                                            </View>
                                                                            {item.data.status == "waiting" ? <TouchableOpacity style={[styles.confirm, { backgroundColor: '#ff6060', marginTop: 8 }]} onPress={() => { item.type == 1 ? this.cancelAction() : this.cancelCustom() }}>
                                                                                <Text style={{ color: 'white' }}>Cancel Request</Text>
                                                                            </TouchableOpacity> : null}
                                                                            <Text style={{ alignSelf: 'flex-end', color: '#748f9e', marginTop: 8, paddingRight: 5 }}>{item.data.created_at}</Text>
                                                                        </View>
                                                                    </>
                                                                }
                                                            </View>
                                                        </View>
                                                    </View>)
                                            }
                                        })
                                }
                                {this.state.orderCancel || this.state.orderDelivered ? null :
                                    <View>
                                        <TouchableOpacity style={styles.button} onPress={() => { this.setState({ modalVisible: true }) }}>
                                            <Text style={{ fontSize: 20, color: 'white', textAlign: 'center', padding: 10 }}>CANCEL THE ORDER</Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                                {
                                    this.props.type == 0 ?
                                        <>
                                            {!this.state.orderCancel && !this.state.orderDelivered ?
                                                <View>
                                                    <View>
                                                        <TouchableOpacity style={styles.button} onPress={() => { this.setState({ deliverModalVisible: true }) }}>
                                                            <Text style={{ fontSize: 20, color: 'white', textAlign: 'center', padding: 10 }}>DELIVER THE ORDER</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View>
                                                        <TouchableOpacity style={styles.button2} onPress={() => { this.setState({ extendModalVisible: true }) }}>
                                                            <Text style={{ fontSize: 20, color: '#748f9e', textAlign: 'center', padding: 10 }}>EXTEND DELIVERY TIME</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View>
                                                        <TouchableOpacity style={styles.button2} onPress={() => { this.setState({ customModalVisible: true }) }}>
                                                            <Text style={{ fontSize: 20, color: '#748f9e', textAlign: 'center', padding: 10 }}>ADD CUSTOM EXTRA</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                : null}
                                        </> : null
                                }
                                {
                                    this.props.type == 0 && !this.state.deliveryDescription ?
                                        <> 
                                            {this.state.orderDelivered ?
                                                <View style={{ display: 'flex', alignSelf: 'center' }}>
                                                    <Text style={{ width: 230 }}>This order will be marked as completed automatically after 3 days if no action is taken</Text>
                                                </View>
                                                : null}
                                        </> : null
                                }
                                {
                                    this.props.type == 1 ?
                                        <>
                                            <View>
                                                <TouchableOpacity style={styles.button} onPress={() => { this.setState({ deliverModalVisible: true }) }}>
                                                    <Text style={{ fontSize: 20, color: 'white', textAlign: 'center', padding: 10 }}>ACCEPT ORDER</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View>
                                                <TouchableOpacity style={styles.button} onPress={() => { this.setState({ extendModalVisible: true }) }}>
                                                    <Text style={{ fontSize: 20, color: 'white', textAlign: 'center', padding: 10 }}>REQUEST MODIFICATION</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </> :
                                        null
                                }

                                <View>
                                    <Modal
                                        isVisible={this.state.modalVisible}
                                        animationType={"fade"}
                                        transparent={true}
                                        onRequestClose={() => this.setState({ modalVisible: false })}
                                        deviceWidth={widthPercentageToDP(100)}
                                        deviceHeight={heightPercentageToDP(100)}
                                        backdropColor='black' >
                                        <View style={{ flexDirection: 'column', padding: 20, alignContent: 'center', alignSelf: 'center', backgroundColor: 'white' }}>
                                            <View style={{ borderBottomWidth: 1, borderBottomColor: '#7F7F7F' }}>
                                                <Text style={{ color: 'red', fontSize: 30 }}>Cancel the order</Text>
                                            </View>
                                            <View style={{ padding: 10 }}>
                                                <Text>You are about to request cancellation for this root. By using this option you are asking the seller to mutually cancel the order.</Text>
                                            </View>
                                            <View style={{ marginTop: 10, padding: 10 }}>
                                                <TextInput
                                                    multiline={true}
                                                    numberOfLines={5}
                                                    placeholder='Your Message to the seller'
                                                    style={{ borderWidth: 1, borderColor: '#7F7F7F' }}
                                                    onChangeText={(text) => this.setState({ messageToSeller: text })}
                                                />
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }} >
                                                <TouchableOpacity style={styles.confirm} onPress={() => this.cancelOrder()}>
                                                    <Text style={{ color: 'white' }}>Confirm</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[styles.cancel, { marginLeft: 10 }]} onPress={() => { this.setState({ modalVisible: false }) }}>
                                                    <Text style={{ color: 'white' }}>Cancel</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </Modal>
                                    <Modal
                                        isVisible={this.state.customModalVisible}
                                        animationType={"fade"}
                                        transparent={true}
                                        onRequestClose={() => this.setState({ customModalVisible: false })}
                                        deviceWidth={widthPercentageToDP(100)}
                                        deviceHeight={heightPercentageToDP(100)}
                                        backdropColor='black' >

                                        <View style={{ flexDirection: 'column', padding: 20, alignContent: 'center', alignSelf: 'center', backgroundColor: 'white' }}>
                                            <View style={{ borderBottomWidth: 1, borderBottomColor: '#7F7F7F' }}>
                                                <Text style={{ color: 'red', fontSize: 30 }}>Send Custom Extra</Text>
                                            </View>
                                            <View style={{ marginTop: 20, padding: 10 }}>
                                                <TextInput
                                                    multiline={true}
                                                    numberOfLines={5}
                                                    placeholder='Your Message to the Buyer'
                                                    style={{ borderWidth: 1, borderColor: '#7F7F7F' }}
                                                    onChangeText={(text) => this.setState({ customMsg: text })}
                                                />
                                            </View>
                                            <View style={{ marginTop: 10, padding: 10 }}>
                                                <TextInput
                                                    placeholder='price'
                                                    style={{ borderWidth: 1, borderColor: '#7F7F7F' }}
                                                    onChangeText={(text) => this.setState({ customPrice: text })}
                                                />
                                            </View>
                                            <View style={{ marginTop: 10, padding: 10 }}>
                                                <TextInput
                                                    placeholder='I will deliver in (days)'
                                                    style={{ borderWidth: 1, borderColor: '#7F7F7F' }}
                                                    onChangeText={(text) => this.setState({ customDays: text })}
                                                />
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }} >
                                                <TouchableOpacity style={styles.confirm} onPress={() => this.sendCustomExtra()}>
                                                    <Text style={{ color: 'white' }}>Confirm</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[styles.cancel, { marginLeft: 10 }]} onPress={() => { this.setState({ customModalVisible: false }) }}>
                                                    <Text style={{ color: 'white' }}>Cancel</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </Modal>
                                    <Modal
                                        isVisible={this.state.deliverModalVisible}
                                        animationType={"fade"}
                                        transparent={true}
                                        onRequestClose={() => this.setState({ deliverModalVisible: false })}
                                        deviceWidth={widthPercentageToDP(100)}
                                        deviceHeight={heightPercentageToDP(100)}
                                        backdropColor='black' >

                                        <View style={{ flexDirection: 'column', padding: 20, alignContent: 'center', alignSelf: 'center', backgroundColor: 'white' }}>
                                            <View style={{ borderBottomWidth: 1, borderBottomColor: '#7F7F7F' }}>
                                                <Text style={{ color: 'red', fontSize: 30 }}>Deliver The Order</Text>
                                            </View>
                                            <View style={{ marginTop: 20, padding: 10 }}>
                                                <Text>Attach file</Text>
                                                <TouchableOpacity onPress={() => this.selectFiles()} style={{}}>
                                                    <View style={styles.cardView}>
                                                        {this.state.fileResponse.uri ?
                                                            <Image resizeMode={'contain'} style={{ height: 70, width: 150 }} source={{ uri: this.state.fileResponse.uri }} />
                                                            : <Text>Click here to attach files</Text>}
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ marginTop: 10, padding: 10 }}>
                                                <TextInput
                                                    multiline={true}
                                                    numberOfLines={5}
                                                    placeholder='Your Message to the Buyer'
                                                    style={{ borderWidth: 1, borderColor: '#7F7F7F' }}
                                                    onChangeText={(text) => this.setState({ deliverMsg: text })}
                                                />
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }} >
                                                <TouchableOpacity style={styles.confirm} onPress={() => this.deliverOrder()}>
                                                    <Text style={{ color: 'white' }}>Confirm</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[styles.cancel, { marginLeft: 10 }]} onPress={() => { this.setState({ deliverModalVisible: false }) }}>
                                                    <Text style={{ color: 'white' }}>Cancel</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </Modal>
                                    <Modal
                                        isVisible={this.state.extendModalVisible}
                                        animationType={"fade"}
                                        transparent={true}
                                        onRequestClose={() => this.setState({ extendModalVisible: false })}
                                        deviceWidth={widthPercentageToDP(100)}
                                        deviceHeight={heightPercentageToDP(100)}
                                        backdropColor='black' >

                                        <View style={{ flexDirection: 'column', padding: 0, alignContent: 'center', alignSelf: 'center', backgroundColor: 'white' }}>
                                            <View style={{ borderBottomWidth: 1, borderBottomColor: '#7F7F7F' }}>
                                                <Text style={{ color: 'red', fontSize: 30 }}>Extend Delivery Time</Text>
                                            </View>
                                            <View style={{ marginTop: 20, padding: 10 }}>
                                                <TextInput
                                                    placeholder='I will deliver in (days)'
                                                    style={{ borderWidth: 1, borderColor: '#7F7F7F' }}
                                                    onChangeText={(text) => this.setState({ extendDays: text })}
                                                />
                                                <View style={{ marginTop: 10 }}>
                                                <TextInput
                                                    multiline={true}
                                                    numberOfLines={5}
                                                    placeholder='Your Message to the Buyer'
                                                    style={{ borderWidth: 1, borderColor: '#7F7F7F' }}
                                                    onChangeText={(text) => this.setState({ extendMsg: text })}
                                                />
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }} >
                                                <TouchableOpacity style={styles.confirm} onPress={() => this.extendTime()}>
                                                    <Text style={{ color: 'white' }}>Confirm</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[styles.cancel, { marginLeft: 10 }]} onPress={() => { this.setState({ extendModalVisible: false }) }}>
                                                    <Text style={{ color: 'white' }}>Cancel</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </Modal>
                                    <Modal
                                        isVisible={this.state.acceptOrderVisible}
                                        animationType={"fade"}
                                        transparent={true}
                                        onRequestClose={() => this.setState({ acceptOrderVisible: false })}
                                        deviceWidth={widthPercentageToDP(100)}
                                        deviceHeight={heightPercentageToDP(100)}
                                        backdropColor='black' >
                                        <View style={{ flexDirection: 'column', padding: 20, alignContent: 'center', alignSelf: 'center', backgroundColor: 'white' }}>
                                            <View style={{ borderBottomWidth: 1, borderBottomColor: '#7F7F7F' }}>
                                                <Text style={{ color: 'red', fontSize: 30 }}>Accept Order</Text>
                                            </View>
                                            <View style={{ marginTop: 20, padding: 10 }}>
                                                <TextInput
                                                    multiline={true}
                                                    numberOfLines={5}
                                                    placeholder='Your Message to the Buyer'
                                                    style={{ borderWidth: 1, borderColor: '#7F7F7F' }}
                                                    onChangeText={(text) => this.setState({ messageToSeller: text })}
                                                />
                                            </View>
                                            <View style={{ marginTop: 20, padding: 10 }}>
                                                <TextInput
                                                    placeholder='price'
                                                    style={{ borderWidth: 1, borderColor: '#7F7F7F' }}
                                                    onChangeText={(text) => this.setState({ customPrice: text })}
                                                />
                                            </View>
                                            <View style={{ marginTop: 20, padding: 10 }}>
                                                <TextInput
                                                    placeholder='I will deliver in (days)'
                                                    style={{ borderWidth: 1, borderColor: '#7F7F7F' }}
                                                    onChangeText={(text) => this.setState({ customDays: text })}
                                                />
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }} >
                                                <TouchableOpacity style={styles.confirm} onPress={() => this.sendCustomOffer()}>
                                                    <Text style={{ color: 'white' }}>Confirm</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[styles.cancel, { marginLeft: 10 }]} onPress={() => { this.setState({ customModalVisible: false }) }}>
                                                    <Text style={{ color: 'white' }}>Cancel</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </Modal>
                                    <Modal
                                        isVisible={this.state.requestModificationVisible}
                                        animationType={"fade"}
                                        transparent={true}
                                        onRequestClose={() => this.setState({ requestModificationVisible: false })}
                                        deviceWidth={widthPercentageToDP(100)}
                                        deviceHeight={heightPercentageToDP(100)}
                                        backdropColor='black' >

                                        <View style={{ flexDirection: 'column', padding: 20, alignContent: 'center', alignSelf: 'center', backgroundColor: 'white' }}>
                                            <View style={{ borderBottomWidth: 1, borderBottomColor: '#7F7F7F' }}>
                                                <Text style={{ color: 'red', fontSize: 30 }}>Request Modification</Text>
                                            </View>
                                            <View style={{ marginTop: 20, padding: 10 }}>
                                                <TextInput
                                                    multiline={true}
                                                    numberOfLines={5}
                                                    placeholder='Your Message to the Buyer'
                                                    style={{ borderWidth: 1, borderColor: '#7F7F7F' }}
                                                    onChangeText={(text) => this.setState({ messageToSeller: text })}
                                                />
                                            </View>
                                            <View style={{ marginTop: 20, padding: 10 }}>
                                                <TextInput
                                                    placeholder='price'
                                                    style={{ borderWidth: 1, borderColor: '#7F7F7F' }}
                                                    onChangeText={(text) => this.setState({ customPrice: text })}
                                                />
                                            </View>
                                            <View style={{ marginTop: 20, padding: 10 }}>
                                                <TextInput
                                                    placeholder='I will deliver in (days)'
                                                    style={{ borderWidth: 1, borderColor: '#7F7F7F' }}
                                                    onChangeText={(text) => this.setState({ customDays: text })}
                                                />
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }} >
                                                <TouchableOpacity style={styles.confirm} onPress={() => this.sendCustomOffer()}>
                                                    <Text style={{ color: 'white' }}>Confirm</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[styles.cancel, { marginLeft: 10 }]} onPress={() => { this.setState({ customModalVisible: false }) }}>
                                                    <Text style={{ color: 'white' }}>Cancel</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </Modal>
                                    <Modal
                                        animationType={"fade"}
                                        transparent={true}
                                        visible={this.state.previeModelVisible}
                                        onRequestClose={() => this.setState({ previeModelVisible: false })}
                                        deviceWidth={widthPercentageToDP(100)}
                                        deviceHeight={heightPercentageToDP(100)}
                                        backdropColor='black'
                                    >
                                        {/*All views of Modal*/}
                                        <View style={{ flexDirection: 'column', padding: 20, alignContent: 'center', alignSelf: 'center', backgroundColor: 'white' }}>
                                            <View>
                                                <Image style={{ height: 200, width: 200 }} resizeMode={'contain'} source={{ uri: this.state.imagePath }} />
                                                <TouchableOpacity style={styles.confirm} onPress={() => this.downloadAttachment(this.state.imagePath)}>
                                                    <Text style={{ color: 'white' }}>Download</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </Modal>
                                    <View>
                                        {/* watermark model */}
                                        <Modal
                                            animationType={"fade"}
                                            transparent={false}
                                            visible={this.state.isWaterMarkModalVisible}
                                            style={{ height: 400 }}
                                        >
                                            {/*All views of Modal*/}
                                            <View style={{ flexDirection: 'row', alignContent: 'center', alignSelf: 'center' }}>
                                                <View>
                                                    <Image style={{ height: 150, width: 150 }} source={{ uri: this.state.fileResponse.uri }} />
                                                </View>
                                                <View style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <TouchableHighlight style={styles.waterMarkModel} onPress={() => this.setState({ withWatermark: 1, isWaterMarkModalVisible: false })}>
                                                        <Text style={{ color: 'white', }}>With Watermark</Text>
                                                    </TouchableHighlight>
                                                    <TouchableHighlight style={[styles.waterMarkModel, { marginTop: 10 }]} onPress={() => this.setState({ withWatermark: 0, isWaterMarkModalVisible: false })}>
                                                        <Text style={{ color: 'white', }}>Without Watermark</Text>
                                                    </TouchableHighlight>
                                                </View>
                                            </View>
                                            <View style={{ marginTop: 10 }}>
                                                <Text>{this.state.fileResponse.file_name}</Text>
                                            </View>
                                        </Modal>
                                    </View>
                                </View>
                            </View> : <ActivityIndicator size="large" color="#10A2EF" />}
                </ScrollView>
            {/* } */}
            </DrawerWrapper>
        )
    }
}

const mapStateToProps = state => {
    return {
        token: state.LoginUser.userToken,
        profileData: state.userProfile.profiledata,
        type: state.LoginUser.type
    };
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        width: Dimensions.get('window').width / 1.1,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#748f9e',
    },
    button: {
        padding: 10,
        marginTop: 10,
        width: Dimensions.get('window').width / 1.1,
        backgroundColor: '#ff6060',
        alignContent: 'center',
        alignContent: 'center',
        borderRadius: 10
    },
    buttonInBox: {
        padding: 10,
        marginTop: 10,
        width: 50,
        backgroundColor: '#ff6060',
        alignContent: 'center',
        alignContent: 'center',
        borderRadius: 10
    },
    button2: {
        padding: 10,
        marginTop: 10,
        width: Dimensions.get('window').width / 1.1,
        alignContent: 'center',
        alignContent: 'center',
        borderRadius: 10,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#748f9e'
    },
    confirm: {
        height: 35,
        width: 120,
        backgroundColor: '#2ec09c',
        borderRadius: 5,
        alignItems: 'center',
        alignContent: 'center',
        padding: 10,
        color: 'white'
    },
    cancel: {
        height: 35,
        width: 120,
        backgroundColor: '#ff6060',
        borderRadius: 5,
        alignItems: 'center',
        alignContent: 'center',
        padding: 10,
        color: 'white'
    },
    text: {
        fontSize: 15,
        color: 'white',
        textAlign: 'center',
        marginTop: 7
    },
    cardView: {
        borderColor: '#748F9E',
        borderWidth: 1,
        borderRadius: 15,
        marginVertical: 10,
        height: 100,
        width: Dimensions.get('window').width / 1.2,
        padding: 10
    },
    waterMarkModel: {
        backgroundColor: 'green',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        width: 100,
        height: 50,
        marginLeft: 10
    },
})

export default connect(mapStateToProps)(Details)