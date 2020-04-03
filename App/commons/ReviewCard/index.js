import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import {AirbnbRating} from 'react-native-ratings';

const ReviewCard = (props) => {
  return (
    <View style={styles.reviewCard}>
        <View style={styles.reviewCardUpper}>
        <View style={styles.reviewCardAvatarContainer}>
            <Image style={styles.reviewCardAvatar} source={{uri: props.profile}} />
        </View>
        <View style={{marginLeft: 10}}>
            <Text style={{fontSize: 12}}>{props.name}</Text>
            <AirbnbRating
              selectedColor="#ffd700"
              count={5}
              showRating={false}
              size={16}
              defaultRating={(props.communication_level + props.quality_of_delivered_work + props.recommended_for_others )/3}
              isDisabled
            />
        </View>
        </View>
        <Text style={styles.reviewText}>{props.messages}</Text>
    </View>
  );
};

export default ReviewCard;

const styles = StyleSheet.create({
  reviewCard: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E8EEF1',
    borderRadius: 16,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  reviewCardUpper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  reviewCardAvatarContainer: {
    height: 56,
    width: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#2AABE4',
    overflow: 'hidden',
  },
  reviewCardAvatar: {
      height: null, 
      width: null, 
      flex: 1
    },
  reviewText: {
      color: '#748F9E', 
      fontSize: 12, 
      flexShrink: 1
    },
});
