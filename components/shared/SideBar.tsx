import React, { useEffect, useState } from 'react'
import { Animated, Image, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { Entypo, FontAwesome, FontAwesome5, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { loadChangeBaseCampModal, loadConnectionModal } from '../../redux/slices/remoteModalSlice';
import { loadLogoutApp } from '../../redux/slices/appAuthenticationSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from '../../lib/translations';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchLocationData } from '../../redux/slices/NetworkSlice';

const SideBar = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const orientation = useSelector((state: RootState) => state.language.orientation);
  const slideAnim = useState(new Animated.Value(-300))[0];
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const language = useSelector((state: RootState) => state.language.language);
  const { ssid: currentSSID } = useSelector((state: RootState) => state.networkData);

  useEffect(() => {
    if (modalVisible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: -300,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);

  const handleOpenConnectionModal = async () => {
    const ld = await dispatch(fetchLocationData(currentSSID));
    console.log("Location Data On Click :", ld.payload);
    dispatch(loadConnectionModal(true));
    setModalVisible(false)
  }

  const logoutFunction = async () => {
    dispatch(loadLogoutApp());
    await AsyncStorage.clear();
    navigation.navigate('Language');
  }

  const handleNavigation = (page: string) => {
    setModalVisible(false);
    navigation.navigate(page);
  }

  return (
    <View>
      <TouchableOpacity style={styles.trigger} onPress={() => setModalVisible(true)}>
        <FontAwesome5 name="bars" color="white" size={24} />
      </TouchableOpacity>

      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <BlurView intensity={60} tint='dark' style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <Animated.View style={[styles.modalContent, { transform: [{ translateX: slideAnim }] }, orientation === 'right' && styles.modalContainerRTL]}>
                <TouchableOpacity style={[orientation === 'left' ? styles.close_button : styles.close_buttonRTL]} onPress={() => setModalVisible(false)}>
                  <Entypo name="cross" size={28} color="white" />
                </TouchableOpacity>
                <Image source={require('../../assets/images/png/snglogoblack.png')} style={[styles.logo_image, orientation == 'right' && styles.logo_imageRTL, { margin: 20 }]} />
                <View style={styles.hr_line} ></View>

                {/* body */}
                <TouchableOpacity style={[styles.link_option, { marginBottom: 15, backgroundColor: '#555555', paddingVertical: 8, paddingHorizontal: 10 }, orientation === 'right' && styles.link_option_rtl]} onPress={() => handleNavigation('Services')}>
                  {orientation == 'left' && <MaterialIcons name="dashboard" size={24} color="white" />}
                  <Text style={{ ...styles.link_text, fontSize: 16, color: 'white', fontWeight: '500' }}>{translations[language].dashboard}</Text>
                  {orientation == 'right' && <MaterialIcons name="dashboard" size={24} color="white" />}
                </TouchableOpacity>

                <View style={[{ padding: 10, paddingHorizontal: 20, paddingRight: 30 }, orientation === 'right' && { paddingRight: 15, paddingLeft: 40 }]}>

                  <View style={styles.section}>
                    <Text style={styles.section_title}>{translations[language].membership}</Text>
                    <TouchableOpacity style={[styles.link_option, orientation == 'right' && styles.link_option_rtl]} onPress={() => handleOpenConnectionModal()}>
                      {orientation == 'left' && <MaterialCommunityIcons name="transit-connection-variant" size={20} color="black" />}
                      <Text style={styles.link_text}>{translations[language].connect_to_membership}</Text>
                      {orientation == 'right' && <MaterialCommunityIcons name="transit-connection-variant" size={20} color="black" />}
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.link_option, orientation == 'right' && styles.link_option_rtl]} onPress={() => handleNavigation('AvailableMembership')}>
                      {orientation == 'left' && <AntDesign name="contacts" size={22} color="black" />}
                      <Text style={styles.link_text}>{translations[language].available_membership}</Text>
                      {orientation === 'right' && <AntDesign name="contacts" size={22} color="black" />}
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.link_option, orientation == 'right' && styles.link_option_rtl]} onPress={() => handleNavigation('MembershipHistory')}>
                      {orientation == 'left' && <MaterialIcons name="history" size={22} color="black" />}
                      <Text style={styles.link_text}>{translations[language].membership_history}</Text>
                      {orientation == 'right' && <MaterialIcons name="history" size={22} color="black" />}
                    </TouchableOpacity>
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.section_title}>{translations[language].user}</Text>
                    <TouchableOpacity style={[styles.link_option, orientation == 'right' && styles.link_option_rtl]} onPress={() => handleNavigation('Profile')}>
                      {orientation == 'left' && <FontAwesome5 name="user" size={18} color="black" />}
                      <Text style={styles.link_text}>{translations[language].user_profile}</Text>
                      {orientation == 'right' && <FontAwesome5 name="user" size={18} color="black" />}
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.link_option, orientation == 'right' && styles.link_option_rtl]} onPress={() => handleNavigation('Language')}>
                      {orientation == 'left' && <Entypo name="language" size={20} color="black" />}
                      <Text style={styles.link_text}>{translations[language].lang_settings}</Text>
                      {orientation == 'right' && <Entypo name="language" size={20} color="black" />}
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.link_option, orientation == 'right' && styles.link_option_rtl]}>
                      {orientation == 'left' && <Entypo name="old-phone" size={20} color="black" />}
                      <Text style={styles.link_text}>{translations[language].change_mob_number}</Text>
                      {orientation == 'right' && <Entypo name="old-phone" size={20} color="black" />}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                      setModalVisible(false);
                      dispatch(loadChangeBaseCampModal(true));
                    }}
                      style={[styles.link_option, orientation == 'right' && styles.link_option_rtl]}
                    >
                      {orientation == 'left' && <Entypo name="location" size={18} color="black" />}
                      <Text style={styles.link_text}>{translations[language].change_service_location}</Text>
                      {orientation == 'right' && <Entypo name="location" size={18} color="black" />}
                    </TouchableOpacity>
                  </View>
                  <View style={styles.section}>
                    <Text style={styles.section_title}>{translations[language].application}</Text>
                    <TouchableOpacity style={[styles.link_option, orientation == 'right' && styles.link_option_rtl]}>
                      {orientation == 'left' && <SimpleLineIcons name="docs" size={18} color="black" />}
                      <Text style={styles.link_text}>{translations[language].logs}</Text>
                      {orientation == 'right' && <Entypo name="location" size={18} color="black" />}
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.link_option, orientation == 'right' && styles.link_option_rtl]}>
                      {orientation == 'left' && <MaterialIcons name="password" size={20} color="black" />}
                      <Text style={styles.link_text}>{translations[language].change_pin}</Text>
                      {orientation == 'right' && <MaterialIcons name="password" size={20} color="black" />}
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.link_option, orientation == 'right' && styles.link_option_rtl]} onPress={logoutFunction}>
                      {orientation == 'left' && <FontAwesome name="sign-out" size={20} color="black" />}
                      <Text style={styles.link_text}>{translations[language].sign_out}</Text>
                      {orientation == 'right' && <MaterialIcons name="password" size={20} color="black" />}
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </BlurView>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  trigger: {
    // backgroundColor: 'blue',
    padding: 10
  },
  hr_line: {
    borderWidth: 0.5,
    borderColor: 'gray',
    marginBottom: 15
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingTop: 15,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  logo_container: {
    display: 'flex',
    flexDirection: "row",
    justifyContent: 'space-between'
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
  },
  modalContainerRTL: {
    marginLeft: 'auto',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
  },
  logo_image: {
    width: 60,
    height: 'auto',
    objectFit: 'contain',
    aspectRatio: 1 / 1,
    opacity: 0.6,
    marginBottom: 5,
  },
  logo_imageRTL: {
    marginLeft: 'auto',
  },
  close_button: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 10,
    backgroundColor: 'black',
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 10
  },
  close_buttonRTL: {
    position: "absolute",
    left: 0,
    top: 0,
    padding: 10,
    backgroundColor: 'black',
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 10
  },
  section: {
    marginBottom: 10,
  },
  section_title: {
    fontSize: 18,
    fontWeight: "700",
    color: "gray",
    marginBottom: 6
  },
  link_option: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    marginBottom: 5
  },
  link_option_rtl: {
    justifyContent: 'flex-end'
  },
  link_text: {
    fontSize: 14,
    fontWeight: '700'
  }
})

export default SideBar

