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
  TouchableHighlight,
  TouchableOpacity,
  Picker,
  ActivityIndicator,
  Alert,
  PermissionsAndroid
} from 'react-native';
import { Button } from 'native-base';
import styles from './index.styles';
import { connect } from "react-redux";
import DrawerWrapper from '../../commons/rightDrawerWrapper'
import Icon from "react-native-vector-icons/FontAwesome";
import { buyers_requests, sendCustomOfferService } from '../../services/buyersRequests'
import {
  get_conversation
} from '../../services/getConversation';
import moment from 'moment';
import Modal from "react-native-modal";
import { getRoots } from '../../services/ChatList';
import { widthPercentageToDP, heightPercentageToDP } from '../../commons/responsive_design';
import RNFetchBlob from 'rn-fetch-blob'


class BuyersRequests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'active',
      BuyersRequests: [],
      isLoading: false,
      isVisible: false,
      customRoots: [],
      isSecondModalVisible: false,
      activeRootCount: 0,
      selectedOffer: {},
      offerDetails: '',
      price: '',
      days: ''
    }
  }

  componentDidMount = async () => {
    console.disableYellowBox = true;
    this.setState({ isLoading: true })
    this.fetchRequests();
    let rootsArray = [];

    let customOfferRoots = await getRoots(this.props.token);
    console.log(">>>>>>>>>", customOfferRoots)
    for (let i = 0; i < customOfferRoots.data.data.length; i++) {
      rootsArray.push(customOfferRoots.data.data[i])
    }
    console.log("rootsArray", rootsArray)
    this.setState({
      customRoots: rootsArray,
      activeRootCount: customOfferRoots.data.activeRootCount
    })

    console.log("custom roots ==========", this.state.customRoots.length)
  }

  fetchRequests = async () => {
    const response = await buyers_requests(this.props.token)
    console.log('buyers_requests', response.data)
    this.setState({ BuyersRequests: response.data, isLoading: false })
  }


  handleContact = async (username) => {
    const response = await get_conversation(this.props.token, username);
    if (response.status === 1) {
      this.props.navigation.navigate('ChatScreen', { 'user': response.data.opponent })
    } else {
      Alert.alert('Error while contact.')
    }
  }

  showCustomOfferRoots = () => {
    if (this.state.activeRootCount == 0) {
      return (
        <View style={{ backgroundColor: 'white' }}>
          <Text style={{ color: 'red' }}>You should have atleast one active root</Text>
        </View>
      )
    } else {
      return (
        <View style={{ flexDirection: 'column', padding: 10, alignContent: 'center', alignSelf: 'center', backgroundColor: 'white'}}>
          <View>
            <Text style={{ color: 'red', fontSize: 30 }}>Custom Offer</Text>
          </View>
          {
            this.state.customRoots.map((item, index) => {
              return (
                <>
                  <View key={index} style={{ flexDirection: 'row', padding: 5, borderBottomColor: '#7F7F7F', borderBottomWidth: 1  }}>
                    <Image style={{ height: 50, width: 70 }} resizeMode="contain" source={{ uri: item.r_root_image }} />
                    <View style={{ flexDirection: 'row', width: 150, flexWrap: 'wrap', marginLeft: 5 }}>
                      <TouchableOpacity onPress={() => { this.setState({ isSecondModalVisible: true, selectedOffer: item, isVisible: false }) }}>
                        <Text style={{ fontSize: 15, color: '#10A2EF', marginLeft: 5 }}>{item.r_title}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )
            })
          }
        </View>
      )
    }
  }

  downloadFiles = async (url) => {
    console.log("............", url)
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
              title: url,
              path: dirs.DownloadDir + url,
            },
          })
          .fetch('GET', url, {
            //some headers ..
          })
          .then((res) => {
            this.setState({ uploaded: false })
            Alert.alert('File Downloaded Successfully to', res.path());
          })

      } else {
        Alert.alert('Permission Denied!', 'You need to give storage permission to download the file');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  sendCustomOffer = async (req_id, token, offer_details, selectedDays, r_id, offerPrice) => {
    console.log("=====>>>><<<<=====", req_id, token, offer_details, selectedDays, r_id, offerPrice)
    if (!selectedDays) {
      Alert.alert("Please select deliever days")
    } else if (!offer_details) {
      Alert.alert("Please add offer details")
    } else if (!offerPrice) {
      Alert.alert("Please add offer price")
    } else if (offerPrice <= 5) {
      Alert.alert("Price must be more than $5")
    } else {
      let res = await sendCustomOfferService(req_id, token, offer_details, selectedDays, r_id, offerPrice);
      console.log("res", res)
      this.setState({ isSecondModalVisible: false })
      if (res.status == 1) {
        Alert.alert(res.message)
        this.setState({ offerSent: 1 })
      } else {
        Alert.alert(res.message)
      }
    }
  }


  render() {
    console.log('this.state.BuyersRequests', this.state.BuyersRequests)
    return (
      <DrawerWrapper {...this.props}>
        <View style={{ flex: 1 }}>
          <ScrollView style={styles.container}>
            <View style={{ marginBottom: 50 }}>
              {
                this.state.isLoading && (<ActivityIndicator size="large" color="#10A2EF" />)
              }
              {this.state.BuyersRequests.length > 0 ?
                this.state.BuyersRequests.map((item, index) => {

                  const now = moment(Date.now());
                  const expiration = moment(item.expire);
                  const diff = expiration.diff(now);
                  const diffDuration = moment.duration(diff);

                  days = diffDuration.days()
                  hours = diffDuration.hours()
                  minutes = diffDuration.minutes();
                  return (
                    <View style={styles.roots_wrapper}>
                      <View key={index} style={styles.roots_individual_wrapper}>
                        <View style={styles.profileViewStyle} >
                          <Image
                            style={styles.profileImageStyle}
                            source={{ uri: item.files }}
                          />
                          <Text style={styles.profileameStyle}>
                            {item.name}
                          </Text>
                        </View>
                        <View style={styles.roots_separator} />
                        <Text style={styles.titleStyle}>
                          {item.subcategory}
                        </Text>
                        <Text style={styles.descriptionStyle} >
                          {item.description}
                        </Text>
                        <TouchableHighlight style={styles.fileViewStyle}
                        // onPress={this.toggleModal()}
                        >
                          <>
                            <Icon
                              name="file"
                              color='gray'
                              size={20}
                            />
                            <TouchableOpacity onPress={() => this.downloadFiles(item.files)}>
                              <Text style={styles.fileNameStyle}>
                                {(item.files).split("/")[5]}
                              </Text>
                            </TouchableOpacity>
                          </>
                        </TouchableHighlight>
                        <View style={styles.tableItemView}>
                          <Text style={styles.tableItemTitel}>
                            Delivery :
                        </Text>
                          <Text style={styles.tableItemData}>
                            {item.delivery}
                          </Text>
                        </View>
                        <View style={styles.tableItemView}>
                          <Text style={styles.tableItemTitel}>
                            Expiry :
                        </Text>
                          <Text style={styles.tableItemData}>
                            {days + 'days' + hours + 'hours' + minutes + 'minutes'}
                          </Text>
                        </View>
                        <View style={styles.tableItemView}>
                          <Text style={styles.tableItemTitel}>
                            Budget :
                        </Text>
                          <Text style={styles.tableItemData}>
                            ${item.budget_from} - ${item.budget_to}
                          </Text>
                        </View>
                        {
                          item.offer_sent == 1 ? <View style={{ justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'row', marginLeft: 10, padding: 15 }}>
                              <Icon name='share' size={20} color='lightgrey' style={{ transform: [{ rotateX: '180deg' }] }} />
                              <Text>SENT</Text>
                            </View>
                            <TouchableOpacity style={[styles.cancel, { marginLeft: 10, marginTop: 3 }]} onPress={() => { this.handleContact(item.name) }}>
                              <Text style={{ color: 'white' }}>Contact</Text>
                            </TouchableOpacity>
                          </View> :
                            <View style={{ flexDirection: 'row' }}>
                              {<TouchableOpacity style={styles.confirm} onPress={() => this.setState({ isVisible: true })}>
                                <Text style={{ color: 'white' }}>Send Offer</Text>
                              </TouchableOpacity>}
                              <TouchableOpacity style={[styles.cancel, { marginLeft: 10 }]} onPress={() => { this.handleContact(item.name) }}>
                                <Text style={{ color: 'white' }}>Contact</Text>
                              </TouchableOpacity>
                            </View>
                        }
                      </View>
                      <Modal
                        visible={this.state.isVisible}
                        animationType={"fade"}
                        transparent={true}
                        onRequestClose={() => this.setState({ isVisible: false })}
                        deviceWidth={widthPercentageToDP(100)}
                        deviceHeight={heightPercentageToDP(100)}
                      >
                        {/*All views of Modal*/}
                        <View style={styles.modal}>
                          <ScrollView>
                            {this.showCustomOfferRoots()}
                          </ScrollView>
                        </View>
                      </Modal>

                      <Modal
                        isVisible={this.state.isSecondModalVisible}
                        animationType={"fade"}
                        transparent={true}
                        onRequestClose={() => this.setState({ isSecondModalVisible: false })}
                        deviceWidth={widthPercentageToDP(100)}
                        deviceHeight={heightPercentageToDP(100)}>
                        <ScrollView>
                          <View style={styles.secondModal}>
                            <View style={styles.paddingModal}>
                              <Text>{this.state.selectedOffer.r_title}</Text>
                            </View>
                            <View style={styles.paddingModal}>
                              <Image resizeMode="contain" style={{ height: 100, width: 100 }} source={{ uri: this.state.selectedOffer.r_root_image }} />
                            </View>
                            <View style={styles.paddingModal}>
                              <TextInput
                                multiline={true}
                                placeholder="Offer Details"
                                onChangeText={(text) => { this.setState({ offerDetails: text }) }}
                                style={styles.input}
                              />
                            </View>
                            <View style={styles.input}>
                              <Picker
                                selectedValue={this.state.days}
                                style={{ height: 70, width: 250 }}
                                onValueChange={(itemValue, itemIndex) =>
                                  this.setState({ days: itemValue })
                                }>
                                <Picker.Item label="I will deleiver in (days)" value="java" />
                                <Picker.Item label="1 day" value="1" />
                                <Picker.Item label="2 day" value="2" />
                                <Picker.Item label="3 day" value="3" />
                                <Picker.Item label="4 day" value="4" />
                                <Picker.Item label="5 day" value="5" />
                                <Picker.Item label="6 day" value="6" />
                                <Picker.Item label="7 day" value="7" />
                                <Picker.Item label="8 day" value="8" />
                                <Picker.Item label="9 day" value="9" />
                                <Picker.Item label="10 day" value="10" />
                                <Picker.Item label="11 day" value="11" />
                                <Picker.Item label="12 day" value="12" />
                                <Picker.Item label="13 day" value="13" />
                                <Picker.Item label="14 day" value="14" />
                                <Picker.Item label="15 day" value="15" />
                                <Picker.Item label="16 day" value="16" />
                                <Picker.Item label="17 day" value="17" />
                                <Picker.Item label="18 day" value="18" />
                                <Picker.Item label="19 day" value="19" />
                                <Picker.Item label="20 day" value="20" />
                                <Picker.Item label="21 day" value="21" />
                                <Picker.Item label="22 day" value="22" />
                                <Picker.Item label="23 day" value="23" />
                                <Picker.Item label="24 day" value="24" />
                                <Picker.Item label="25 day" value="25" />
                                <Picker.Item label="26 day" value="26" />
                                <Picker.Item label="27 day" value="27" />
                                <Picker.Item label="28 day" value="28" />
                                <Picker.Item label="29 day" value="29" />
                                <Picker.Item label="30 day" value="30" />

                              </Picker>
                            </View>
                            <View style={styles.paddingModal}>
                              <TextInput
                                placeholder="Price"
                                style={styles.input}
                                onChangeText={(text) => this.setState({ price: text })}
                              />
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }} >
                              <TouchableOpacity style={styles.confirm} onPress={() => this.sendCustomOffer(item.request_id, this.props.token, this.state.offerDetails, this.state.days, this.state.selectedOffer.r_id, this.state.price)}>
                                <Text style={{ color: 'white' }}>SEND</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={[styles.cancel, { marginLeft: 10 }]} onPress={() => this.setState({ isSecondModalVisible: false })}>
                                <Text style={{ color: 'white' }}>CANCEL</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </ScrollView>
                      </Modal>
                    </View>
                  );
                }) :
                !this.state.isLoading && (<Text style={{ textAlign: 'center' }}>Nothing yet to show!</Text>)
              }
            </View>
          </ScrollView>
        </View>
      </DrawerWrapper>
    );
  }
};

const mapStateToProps = state => {
  return {
    token: state.LoginUser.userToken,
  };
};


const Buyers_requests = connect(
  mapStateToProps,
  null,
)(BuyersRequests);

export default Buyers_requests;

