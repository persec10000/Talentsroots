import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableHighlight,
  Alert,
  Share,
  TouchableOpacity,
  Modal,
  TextInput
} from 'react-native';
import ReportModal from './components/ReportModal';
import SliderModal from './components/SliderModal';
import { Rating, CheckBox, Badge } from 'react-native-elements';
import { Button } from 'native-base';
import { SliderBox } from "react-native-image-slider-box";
import Dash from 'react-native-dash';
import { connect } from 'react-redux';
import Header from '../../commons/header';
import PackageTable from '../../commons/packageTable';
import DrawerWrapper from '../../commons/rightDrawerWrapper';
import { profilerequest } from './actions/actions';
import ProfileCard from '../../commons/ProfileCard/index';
import RootCard from '../../commons/OtherRootItem';
import ReviewCard from '../../commons/reviewCard';
import SnapCarousel from './components/CustomCarousel/snap_carousel';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../commons/responsive_design';
import {
  root_details,
  review_detail,
  profile_service
} from '../../services/profile';
import { my_reviews } from '../../services/myReviews';
import {
  add_to_favorite,
  check_favorite,
  remove_favorites
} from '../../services/myFavorites';
import {
  get_conversation
} from '../../services/getConversation';
import {
  other_roots
} from '../../services/otherRoots'
import {
  user_reviews
} from '../../services/userReviews';
import { getFinalPriceService } from '../../services/payments/payments'
import styles from './index.styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
const RootPage = (props) => {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [timePassed, setTimePassed] = useState(false);
  const [rootDetails, setRootDetails] = useState('');
  const [reviewDetails, setReviewDetails] = useState('');
  const [otherRootsDetails, setOtherRootsDetails] = useState([]);
  const [userProfile, setUserProfile] = useState('');
  const [extraRevision, setExtraRevision] = useState(false);
  const [fastDelivery, setFastDelivery] = useState(false);
  const [isExtra1, setIsExtra1] = useState(false);
  const [isExtra2, setIsExtra2] = useState(false);
  const [isExtra3, setIsExtr3] = useState(false);
  const [finalPrice, setFinalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [ratings, setRatings] = useState('');
  const [description, setDescription] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [isSliderVisible, setSliderVisible] = useState(false);

  useEffect(() => {
    setTimePassed(true);
    return () => {
      setTimePassed(false),
        setRootDetails('');
      setRatings('');
      setUserProfile('');
    }
  }, [])

  const getRootDetails = async (token, rootId) => {
    const response = await root_details(token, rootId);
    console.log("root_details", response)
    if (response.status === 1) {
      setRootDetails(response.data);
    }
  }

  const getOtherRootDetails = async (token, id) => {
    const response = await other_roots(token, id);
    if (response.status === 1) {
      setOtherRootsDetails(response.data);
    }
  }

  const getUserProfile = async (token, userId) => {
    const requestData = {
      token,
      user_id: userId
    }
    const response = await profile_service(requestData);
    if (response.status === 1) {
      setUserProfile(response.data);
    }
  }

  const getReviewDetails = async (token, id) => {
    const response = await my_reviews(token, id);
    if (response.status === 1) {
      setReviewDetails(response.data);
    }
  }

  const getRatings = async (token, id, type) => {
    let requestData = JSON.stringify({
      'user_id': id,
      'type': type
    })
    const users_review_response = await user_reviews(token, requestData)
    if (users_review_response.status === 1) {
      setRatings(users_review_response.data)
    }
  }
  
  const checkFavorite = async (token, rootId) => {
    const response = await check_favorite(token, rootId);
    if (response.status === 1) {
      setFavorite(true)
    }
  }

  const getData = async (token, rootId) => {
    await getRootDetails(token, rootId);
    await getOtherRootDetails(token, props.navigation.getParam('user_id', ''));
    await getReviewDetails(token, rootId);
    await checkFavorite(token, rootId);
    setTimePassed(false);
  }

  useEffect(() => {
    if (props.navigation.getParam('root_id', '')) {
      const rootId = props.navigation.getParam('root_id', '');
      getData(props.token, rootId)
    }
  }, [props.navigation.getParam('root_id', '')])

  useEffect(() => {
    if (props.navigation.getParam('user_id', '')) {
      const userId = props.navigation.getParam('user_id', '');
      console.log("getuserid=============",userId)
      getUserProfile(props.token, userId)
    }
  }, [props.navigation.getParam('user_id', '')])

  useEffect(() => {
    if (userProfile) {
      console.log('userProfile -----', userProfile)
      getRatings(props.token, props.navigation.getParam('user_id', ''), userProfile.type)
    }
  }, [userProfile])

  useEffect(() => {
    if (rootDetails) {
      setFinalPrice(rootDetails.r_fiixed_price.price)
    }
  }, [rootDetails])

  useEffect(() => {
    if (extraRevision) {
      setFinalPrice(parseInt(finalPrice) + parseInt(rootDetails.r_extra.revision.price))
      
    } else {
      if (rootDetails.r_extra && rootDetails.r_extra.revision && rootDetails.r_extra.revision.price) {
        setFinalPrice(parseInt(finalPrice) - parseInt(rootDetails.r_extra.revision.price))
      }
    }
  }, [extraRevision])

  useEffect(() => {
    if (fastDelivery) {
      setFinalPrice(parseInt(finalPrice) + parseInt(rootDetails.r_extra.fast_delivery.price))
    } else {
      if (rootDetails.r_extra && rootDetails.r_extra.fast_delivery && rootDetails.r_extra.fast_delivery.price) {
        setFinalPrice(parseInt(finalPrice) - parseInt(rootDetails.r_extra.fast_delivery.price))
      }
    }
  }, [fastDelivery])

  const handleAddToFavorite = (token, id) => {

    Alert.alert(
      '',
      'Are you sure?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK', onPress: async () => {
            setIsLoading(true);
            let RESPONSE;
            if (!favorite) {
              RESPONSE = await add_to_favorite(token, id);
            } else {
              RESPONSE = await remove_favorites(token, id);
            }
            if (RESPONSE.status === 1) {
              if (RESPONSE.message === 'Root deleted from favorites') {
                Alert.alert(RESPONSE.message)
                setIsLoading(false)
                setFavorite(false)
              } else {
                setFavorite(true)
                Alert.alert(RESPONSE.message)
                setIsLoading(false)
              }
            } else {
              if (RESPONSE.message === 'Already added!') {
                setFavorite(true)
              }
              setIsLoading(false)
            }
          }
        },
      ]
      );
      
      
    }
    
    console.log("::::::::::::::::::::::::::::::",rootDetails)

  const handleBuyNow = async () => {

    const getFinalPrice = await getFinalPriceService(props.token, finalPrice);
    console.log("////////////////", getFinalPrice)
    let REVISION_PRICE = 0;
    let DELIVERY_PRICE = 0;
    let REVISION_DAYS = 0;
    let DELIVERY_DAYS = 0;
    let DAYS = parseInt(rootDetails.r_fiixed_price.max_days);
    if (extraRevision) {
      REVISION_PRICE = rootDetails.r_extra.revision.price;
      REVISION_DAYS = parseInt(rootDetails.r_extra.revision.max_days);
      DAYS += REVISION_DAYS; 
    }
    if (fastDelivery) {
      DELIVERY_PRICE = rootDetails.r_extra.fast_delivery.price;
      DELIVERY_DAYS = parseInt(rootDetails.r_extra.fast_delivery.max_days);
      DAYS -= DELIVERY_DAYS
    }
    props.navigation.navigate('PaymentScreen', {
      rootDetails: {
        r_image: rootDetails.r_root_image,
        r_title: rootDetails.r_title,
        username: rootDetails.username,
        used_balance: getFinalPrice.data.usedBalance,
        total: getFinalPrice.data.finalprice,
        final_price: rootDetails.r_fiixed_price.price,//finalPrice
        processing_fees: getFinalPrice.data.processingPrice,
        r_user_id: rootDetails.r_user_id,
        r_id: rootDetails.r_id,
        days: DAYS,
        delivery_price: DELIVERY_PRICE,
        delivery_days: DELIVERY_DAYS,
        revision_days: REVISION_DAYS,
        revision_price: REVISION_PRICE,
        orderId: getFinalPrice.data.orderID,
        packagePrice: getFinalPrice.data.packagePrice
      }
    })
  }

  const handleContact = async (username) => {
    const response = await get_conversation(props.token, username);
    if (response.status === 1) {
      props.navigation.navigate('ChatScreen', { 'user': response.data.opponent, 'user_data': userProfile })
    } else {
      Alert.alert('Error while contact.')
    }
  }

  const handleShare = (link) => {
    console.log('link')
    Share.share(
      {
        message: link
      }).then(result => console.log(result)).catch(errorMsg => console.log(errorMsg));
  }

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  }

  const toggleSlider = () => {
    setSliderVisible(!isSliderVisible);
  }

  const showRootDetails = (data) => {
    return (
      <>
        {
          isLoading && (<ActivityIndicator size="large" color="#10A2EF" />)
        }
        {/*Title & Subtitle Section*/}
        <View style={{ flex: 1 }}>
          <Text
            style={styles.rootTitleTextStyle}>
            {data.r_title}
          </Text>
          <Text
            style={styles.rootSubcategoryTextStyle}>
            {data.subcategory}
          </Text>
        </View>
        {/*Like & Share Section*/}
        <View style={styles.likeAndShareViewStyle}>
          <View style={{ flex: 2, flexDirection: 'row' }}>
            <Text style={{ color: '#748f9e', fontWeight: '700', fontSize: 15 }}>
              {rootDetails.orders_in_queue} Orders in queue
            </Text>
            <TouchableWithoutFeedback
              onPress={() => handleAddToFavorite(props.token, data.r_id)}
            >
              <View style={styles.iconViewStyle}>
                <Icon name="heart" size={16} color={favorite ? 'red' : '#ccc'} />
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => handleShare(data.r_share_link)}
            >
              <View style={styles.iconViewStyle}>
                <Icon name="share-alt" size={16} color="#ccc" />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.ratingViewStyle}>
            {
              data.r_rating !== "0.0" ?
                <>
                  <Rating
                    readonly
                    style={{ paddingHorizontal: 10 }}
                    startingValue={1}
                    ratingCount={1}
                    imageSize={20}
                  />
                  <Text style={styles.ratingTextStyle}>{data.r_rating}</Text>
                  <Text style={{ fontSize: 15, paddingLeft: 5 }}>({data.r_rating_count})</Text>
                </> :
                null
            }
          </View>
        </View>
        {/*Slider Section*/}
        <View
          style={{
            flexDirection: 'row',
          }}>
          <TouchableHighlight
            style={{
              position: 'absolute',
              right: 20,
              top: 10,
              zIndex: 1000,
              backgroundColor: 'rgba(0,0,0,.5)',
              opacity: 0.8,
              borderRadius: 8,
              padding: 5,
            }}
            onPress={toggleSlider}
          >
            <Icon
              style={{
                zIndex: 10000
              }}
              name="arrows"
              size={18}
              color="white" />
          </TouchableHighlight>

          <SnapCarousel
            items={data.rootFiles}
            handleOnClick={() => console.log('item clicked')}
          />

          {/* <SliderBox
            images={[data.r_root_image]}
            onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
            currentImageEmitter={index => console.warn(`current pos is: ${index}`)}
          /> */}
        </View>
        {/*Report This Modal*/}
        <ReportModal
          isVisible={isModalVisible}
          toggle={toggleModal}
          data={data}
          description={description}
          setDescription={setDescription}
          token={props.token}
        />
        {/*Description Section*/}
        <View style={styles.card}>
          <View style={{ display: 'flex', flexDirection: 'row', padding: 10 }}>
            <Text style={styles.description}>Description</Text>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Icon name="clock-o" size={20} color="#10a2ef" />
              <Text style={{ fontSize: 15 }}> {data.r_fiixed_price.max_days} Days</Text>
            </View>
          </View>
          <View style={styles.doshline} />
          <Text style={{ color: '#748f9e', textAlign: 'justify', padding: 5, marginBottom: 15 }}>
            {data.r_desc}
          </Text>
          {data.r_tags.length > 0 ?
            <View style={styles.tagContainer}>
              {data.r_tags.map((item => {
                return (<TouchableHighlight style={styles.phpButton}>
                  <Text
                    style={styles.rTagsTestStyle} >
                    {item.toUpperCase()}
                  </Text>
                </TouchableHighlight>)
              }))}
            </View>
            : null
          }
          <Text
            onPress={toggleModal}
            style={styles.reportText}>
            Report this
            </Text>
        </View>
        {/*Additionals Section*/}
        {data.r_user_id != props.userId ? <>{
          data.r_extra.fast_delivery.price && data.r_extra.revision.price && (
            <View style={styles.card}>
              <View style={{ flexDirection: 'row', padding: 10 }}>
                <Text style={styles.description}>Additionals</Text>
              </View>
              <View style={styles.doshline} />
              {
                data.r_extra.fast_delivery.price && (
                  <CheckBox
                    title={`Extra Fast Delivary (${data.r_extra.fast_delivery.max_days} days)         $${data.r_extra.fast_delivery.price}`}
                    checked={fastDelivery}
                    onPress={() => setFastDelivery(!fastDelivery)}
                  />)
              }
              {
                data.r_extra.revision.price && (
                  <CheckBox
                    title={`Extra revision (${data.r_extra.revision.max_days} days)                  $${data.r_extra.revision.price}`}
                    checked={extraRevision}
                    onPress={() => setExtraRevision(!extraRevision)}
                  />)
              }
            </View>
          )
        }</> : null}

        {data.r_user_id == props.userId && <Button
          disabled={ true}
          onPress={handleBuyNow}
          style={[styles.buttons, { backgroundColor: '#555' }]}>
          <Text style={styles.buttonsText}>
            THIS IS YOUR OWN ROOT
          </Text>
        </Button>}
        {/*Buy Now Button*/}
        {data.r_user_id != props.userId && <Button
          onPress={handleBuyNow}
          style={[styles.buttons, { backgroundColor: '#2ec09c' }]}>
          <Text style={styles.buttonsText}>
            BUY NOW FOR ${finalPrice}
          </Text>
        </Button>}
        {/*Ask Custom Offer Button*/}
        {data.r_user_id != props.userId && <Button
          onPress={() => handleContact(data.name)}
          style={[styles.buttons, { backgroundColor: '#10A2EF' }]}>
          <Text style={styles.buttonsText}>
            ASK FOR CUSTOM OFFER
          </Text>
        </Button>}
        {/*User profile*/}
        <>
          {
            userProfile ?
              <>
                <ProfileCard
                  navigation={props.navigation}
                  data={userProfile}
                  lastPingTime={rootDetails.last_ping_time}
                  socket={props.screenProps}
                />
                <View style={{ height: 25 }} />
              </> : null
          }
        </>
        {/*Reviews*/}
        { reviewDetails && userProfile && ratings && ratings.reviews.length > 0 ?
          <>
            <ReviewCard
              navigation={props.navigation}
              rootId={props.navigation.getParam('root_id', '')}
              myReviews={reviewDetails}
              userProfile={userProfile}
              ratings={ratings}
            />
            <View style={{ height: 20 }} />
          </>
          :
          null
        }
        {data.r_user_id != props.userId && <>{
          otherRootsDetails.length > 0 && userProfile ?
            <>
              <RootCard
                navigation={props.navigation}
                myRoots={otherRootsDetails}
                data={userProfile}
                socket={props.screenProps}
              />
              <View style={{ height: 10 }} />
            </>
            :
            null
        }</>}
      </>
    )
  }

  console.log('favorite is', favorite)

  return (
    <DrawerWrapper {...props}>
      <View>
        <ScrollView style={styles.container}>
          {/* { props.profileData && props.profileData.first_name ? (
            <UserProfileCard {...props} profileData={props.profileData} />
          ) : (
              timePassed && (
                <ActivityIndicator size="small" color="#00ff00" />
              )
            )} */}
          {
            rootDetails != '' ?
              showRootDetails(rootDetails)
              :
              <ActivityIndicator size="small" color="#00ff00" />
          }
          <View style={{ height: 150 }} />
        </ScrollView>
        {
          rootDetails !== '' ?
            <>
              {/*Slider Modal*/}
              <SliderModal
                isVisible={isSliderVisible}
                toggle={toggleSlider}
                data={rootDetails.rootFiles}
              />
            </> : null
        }
      </View>
    </DrawerWrapper>
  );
}

const mapStateToProps = state => {
  return {
    token: state.LoginUser.userToken,
    profileData: state.userProfile.profiledata,
    userId: state.LoginUser.user_id,
  };
};

const RootScreen = connect(mapStateToProps)(RootPage);

export default RootScreen;

