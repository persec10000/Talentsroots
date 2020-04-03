import { StyleSheet, Dimensions } from 'react-native';
const {width,height} = Dimensions.get('window');

export default StyleSheet.create({
    cardStyle : {
        backgroundColor: 'white', 
        borderRadius: 10, 
        width : width - width / 20,
        marginTop : 10,
        marginHorizontal :( width - (width - width / 20) ) / 2,
        borderWidth:1,
        borderColor:'#DDD'
    },
    doshline: { 
        height: 1, 
        width: '100%', 
        borderRadius: 1, 
        borderWidth: 1, 
        borderColor: '#e7e7e7', 
        borderStyle: 'dotted' 
    },
    ImageViewStyle : {
        display: 'flex', 
        flexDirection: 'row', 
        alignContent: 'center', 
        alignItems: 'center', 
        padding: 5,
    },
    ImageStyle : { 
        width : width - width / 10,
        height : height / 4,
        borderRadius: 5 ,
        resizeMode:'contain',
    }, 
    CardTitleStyle : {
        fontSize : 14,
        color : 'lightgray',
        fontWeight : 'bold',
        paddingLeft : 15,
    },
    PriceStyle : {
        fontSize : 20,
        color : 'lightgray',
        fontWeight : 'bold',
        textAlign:'right',
        paddingRight:15
    },
    profileViewStyle : {
        display : 'flex',
        flexDirection : 'row',
        justifyContent : 'center'
    },
    profileLeftViewStyle : {
        flex : 1 ,
        flexDirection : 'row',
        padding : 10 ,
        alignItems : 'center'
    },
    profileLeftViewImageStyle : {
        width: 50, 
        height: 50, 
        borderRadius: 120 / 2 
    },
    profileLeftViewNameStyle : {
        fontWeight: '500', 
        fontSize: 15 ,
        paddingLeft : 5,
        color : 'gray'
    },
    orderIdTextStyle : {
        fontWeight: '700', 
        fontSize: 14 ,
        paddingLeft : 5,
        paddingBottom:10,
        color : 'lightgray'
    },
    tableItem : { 
        display : 'flex' ,  
        flexDirection :'row' ,
        justifyContent : 'space-between',
        paddingVertical : 10,
        paddingHorizontal : 10
    },
    tableItemTitle   : {
        fontSize:14 , 
        flex : 1,
    },
    tableItemRightSide : { 
        flex : 1 ,
        flexDirection : 'row' ,
        alignContent : 'flex-end' , 
        justifyContent : 'flex-end'
    },
    tableItemRightText : { 
        fontSize : 15 , 
        paddingLeft : 10 ,
        color : 'black',
    },
    couponViewStyle : {
        display : 'flex',
        flexDirection : 'row',
        marginTop : 20,
    },
    couponTextInputStyle : { 
        height: 40, 
        borderColor: 'lightgray', 
        borderWidth: 1,
        flex : 3 ,
        borderRadius: 5, 
        marginHorizontal: 13, 
        paddingLeft : 10,
        alignSelf : 'center'
    },
    button : {
        flex : 2,
        borderRadius: 5, 
        marginRight: 13, 
        justifyContent: 'center'
    },
    buttonText: { 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: '#FFFFFF', 
        fontWeight: '700',
        fontSize : 13 
    },
    paymentsButton : {
        borderRadius: 5, 
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginHorizontal: 10
    },
    securityImageStyle : { 
        width : width - width / 3.5 , 
        alignSelf : 'center' ,  
        resizeMode: 'contain' 
    },
    cardView: {
        width: Dimensions.get('window').width / 1.2,
        borderColor: '#748F9E',
        borderWidth: 1,
        borderRadius: 15,
        marginVertical: 10,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    totalText:{
        fontSize : 17,
        color : 'lightgray',
        fontWeight : '700',
        textAlign:'right',
    }
});