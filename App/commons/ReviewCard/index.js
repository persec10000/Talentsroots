import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import {connect} from 'react-redux';
import styles from './index.style'
import { Rating, CheckBox, Badge } from 'react-native-elements';
import {AirbnbRating} from 'react-native-ratings';
import {
  root_details,
  review_detail,
  profile_service
} from '../../services/profile';
import {
  user_reviews
} from '../../services/userReviews';
import { StackViewTransitionConfigs } from 'react-navigation-stack';
let total = 0;
const SubReviewList = props => {
  let subrating = Math.round((parseFloat(props.communication_level) + parseFloat(props.quality_of_delivered_work) + parseFloat(props.recommended_for_others))/3*10)/10
    return(
      <View>
        <View style={styles.doshline} />
        <View style={styles.reviewCardUpper}>
          <View style={styles.reviewCardAvatarContainer}>
              <Image style={styles.reviewCardAvatar} source={{uri: props.profile}} />
          </View>
          <View style={{flex:1}}>
            <View style={{marginLeft: 15, flexDirection: 'row'}}>
              <Text style={{fontSize: 12}}>{props.name}</Text>
              <AirbnbRating
                selectedColor="#ffd700"
                count={5}
                showRating={false}
                size={16}
                defaultRating={(parseFloat(props.communication_level) + parseFloat(props.quality_of_delivered_work) + parseFloat(props.recommended_for_others))/3}
                isDisabled
              />
              <Text>
                {JSON.stringify(subrating).length == 1?JSON.stringify(subrating)+'.0':JSON.stringify(subrating)}
              </Text>
            </View>
            <View style={{marginLeft: 15}}>
              <Text style={{textAlign:'left'}}>
                {props.messages}
              </Text>
              <Text style={{textAlign:'left'}}>
                {props.or_created_at}
              </Text>
            </View> 
          </View>
        </View>
      </View>
    )
}
const ReviewCard = (props) => {
  const {userProfile} = props
  const [data, setData] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState('');
  const [totalrating, setTotalRating] = useState(0);
  const [comRating, setComRating] = useState('');
  const [quaRating, setQuaRating] = useState('');
  const [recomRating, setRecomRating] = useState('');
  const getRatings = async (token, id, type) => {
    const users_review_response = await review_detail(token, props.rootId)
    if (users_review_response.status === 1) {
      setData(users_review_response.data)
      // setReview(users_review_response.data)
    }
  } 

  useEffect(() => {
    console.log("total========",data)
    let rating = 0;
    let totalcom = 0;
    let totalqua = 0;
    let totalrecom = 0;
    if (data){
      data.map((item) => {
        rating = Math.round(parseFloat((parseFloat(item.communication_level) + parseFloat(item.quality_of_delivered_work) + parseFloat(item.recommended_for_others))/3)*10)/10
        total =  total + rating 
        totalcom = totalcom + parseFloat(item.communication_level);
        totalqua = totalqua + parseFloat(item.quality_of_delivered_work);
        totalrecom = totalrecom + parseFloat(item.recommended_for_others);
      })
      console.log("total========",total)
      setTotalRating(total)
      // setRating(parseFloat(data.data.avarage/review.length))
      setComRating(totalcom)
      setQuaRating(totalqua)
      setRecomRating(totalrecom)
    }
  }, [data])

  useEffect(() => {
    if (userProfile) {
      getRatings(props.token, userProfile.id, userProfile.type)
    }
  }, [userProfile])
  return (
    <View style={styles.reviewCard}>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.description}>Reviews</Text>
        <Rating
          readonly
          startingValue={1}
          ratingCount={1}
          style={{ paddingHorizontal: 5, paddingVertical: 3 }}
          imageSize={20}
        />
        <Text style={styles.ratingTextStyle}>{JSON.stringify(Math.round((totalrating/data.length)*10)/10).length == 1? JSON.stringify(Math.round((totalrating/data.length)*10)/10)+'.0':Math.round((totalrating/data.length)*10)/10}</Text>
        <Text style={styles.ratingTextStyle}>({data.length})</Text>
      </View>
      <View style={styles.subreview}>
        <View style={styles.subreviewItem}>
          <Text style={styles.subreviewTextStyle}>
            COMMUNICATION LEVEL
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Rating
              readonly
              startingValue={1}
              ratingCount={1}
              imageSize={20}
            />
            <Text style={styles.ratingTextStyle}>{JSON.stringify(Math.round((comRating/data.length)*10)/10).length == 1? JSON.stringify(Math.round((comRating/data.length)*10)/10)+'.0':Math.round((comRating/data.length)*10)/10}</Text>
          </View>
        </View>
        <View style={styles.subreviewItem}>
          <Text style={styles.subreviewTextStyle}>
            QUALITY OF WORK
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Rating
              readonly
              startingValue={1}
              ratingCount={1}
              imageSize={20}
            />
            <Text style={styles.ratingTextStyle}>{JSON.stringify(Math.round((quaRating/data.length)*10)/10).length == 1? JSON.stringify(Math.round((quaRating/data.length)*10)/10)+'.0':Math.round((quaRating/data.length)*10)/10}</Text>
          </View>
        </View>
        <View style={styles.subreviewItem}>
          <Text style={styles.subreviewTextStyle}>
            RECOMMEND TO OTHERS
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Rating
              readonly
              startingValue={1}
              ratingCount={1}
              imageSize={20}
            />
            <Text style={styles.ratingTextStyle}>{JSON.stringify(Math.round((recomRating/data.length)*10)/10).length == 1? JSON.stringify(Math.round((recomRating/data.length)*10)/10)+'.0':Math.round((recomRating/data.length)*10)/10}</Text>
          </View>
        </View>
      </View>
      {data.length>0 &&
        <FlatList
          data={data}
          removeClippedSubviews={true}
          renderItem={({ item }) => (
            <SubReviewList {...item} navigation={props.navigation}/>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      }
      <View style={{alignItems:'center', marginTop: 20}}>
        <TouchableOpacity style={styles.loadMoreBT}>
          <Text style={styles.loadMoreText}>
            Load More
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const mapStateToProps = state => {
  return {
    token: state.LoginUser.userToken,
    profileData: state.userProfile.profiledata,
    userId: state.LoginUser.user_id,
  };
};
const ReviewCardScreen = connect(mapStateToProps)(ReviewCard);

export default ReviewCardScreen;
