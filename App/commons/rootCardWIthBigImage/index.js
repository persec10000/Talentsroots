import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AirbnbRating, Rating } from 'react-native-ratings';
import { connect } from 'react-redux';
import styles from './index.style';

RootCardWIthBigImage = props => {

  const {item} = props;
  const [online, setOnline] = useState(item.is_online == 1 ? true : false)

  useEffect(() => {
    const socket = global.socket
    socket.on('user_message', (data) => {
      const userMessage = JSON.parse(data)
      if (userMessage.type == "user_login") {
        if (props.r_user_id == userMessage.data.user_id) {
          setOnline(true)
        }
      } else if (userMessage.type == "user_logout") {
        if (props.r_user_id == userMessage.data.user_id) {
          setOnline(false)
        }
      }
    })
  }, [])

  return (
    <TouchableOpacity 
    onPress={() => props.navigation.navigate('RootPage', {
      isreview:true,
      token: props.token,
      root_id: item.r_id,
      user_id: item.r_user_id
    })}>
      <View style={styles.cardView}>
        <View style={styles.headerViewStyle}>
          <Image 
           style={styles.headerImageStyle} 
           source={{ uri: item.rf_file_name }} />
          <Text numberOfLines={3} style={styles.headerTitleStyle}>
            {item.r_title}
          </Text>
        </View>
        <View style={styles.doshline} />
          <View style={{ flexDirection: 'row', marginTop: 10, padding : 10  , justifyContent: 'space-between' }}>
            <View style={{flexDirection: 'row'}}>
              <View>
                <View style={online ? styles.isOnline : styles.isOffline}>
                </View>
                <Image style={{ height: 40, width: 40, borderRadius: 40 }} source={{ uri: item.profile }} />
              </View>
              <Text style={{fontSize: 15 , fontWeight: 'bold' , marginLeft: 5}}>{item.name}</Text>
           </View>
          <View style={{flexDirection: 'column' ,  padding : 5 }}>
            <View style={{flexDirection: 'row' , display: 'flex' , justifyContent: 'flex-end' , alignContent : 'center'}}> 
             {
               item.r_rating_count !== 0 ?
                <>
                  <Rating
                  imageSize={18}
                  readonly
                  startingValue={1}
                  ratingCount={1}
                  style={{marginLeft: 5}}
                  />
                  <Text
                    style={
                      styles.starRatingText
                    }>
                  {`${item.r_rating}`}
                  </Text>
                  <Text
                    style={{ fontSize : 13 , color : '#748f9e' }}>
                    ({item.r_rating_count})
                  </Text>
                </> :
                <Text
                style={{ fontSize : 13 , color : 'gray' }}>
                  New Root
                </Text>
             }
            </View>
            <Text
                style={{ fontSize : 12 , color : '#748f9e' }}>
              {`${(item.c_title).toUpperCase()}`}
            </Text>
          </View>
        </View>
        <View style={styles.doshline} />
         <View style={{flex: 1, alignItems: 'center', alignContent: 'center', margin: 10}}>
            <Text style={styles.startingPrice}>$ {item.r_minimum_price}</Text>
        </View>   
      </View>
    </TouchableOpacity>
  );
};

const mapStateToProps = state => {
  return {
    token: state.LoginUser.userToken,
  };
};

const roots = connect(
  mapStateToProps,
  null,
)(RootCardWIthBigImage);

export default roots;
