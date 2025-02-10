import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { setLanguage } from '../../redux/slices/languageSlice';
import { translations } from '../../lib/translations';
import { useSelector } from 'react-redux';
import { getVerifiedData } from '../../helpers/UserHelper';

const SelectLanguage = () => {
    const navigation = useNavigation<NavigationProp>();
    const language = useSelector((state: any) => state.language.language);
    const dispatch = useDispatch();

    const handleSelectLanguage = (language: string) => {
        dispatch(setLanguage(language));
    };

    const handleContinueFunction = async () => {
        const data = await getVerifiedData();
        if(data){
            navigation.navigate('Services')
        }else{
            navigation.navigate('MobileVerification');
        }
    }

    return (
        <View>
            <View style={styles.center_logo}>
                <Image source={require("../../assets/images/png/sngcolor.png")} style={{ width: 130, height: 100, objectFit: "contain" }} />
            </View>
            <View style={styles.boxedContainer}>
                <Text style={styles.title}>{translations[language].choose_lang}</Text>
                <Text style={styles.description}>{translations[language].choose_lang_desc}</Text>
                <View style={styles.gridView}>
                    <TouchableOpacity style={styles.selectView} onPress={() => handleSelectLanguage('english')}>
                        <FontAwesome name='check-circle' color={language === 'english' ? '#8CC82F' : 'gray'} size={25} />
                        <Text style={{ ...styles.selectText, fontSize: 14 }}>English</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.selectView} onPress={() => handleSelectLanguage('hindi')}>
                        <FontAwesome name='check-circle' color={language === 'hindi' ? '#8CC82F' : 'gray'} size={25} />
                        <Text style={styles.selectText}>हिंदी</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.selectView} onPress={() => handleSelectLanguage('arabic')}>
                        <FontAwesome name='check-circle' color={language === 'arabic' ? '#8CC82F' : 'gray'} size={25} />
                        <Text style={{ ...styles.selectText, fontSize: 18 }}>عربي</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.selectView} onPress={() => handleSelectLanguage('malayalam')}>
                        <FontAwesome name='check-circle' color={language === 'malayalam' ? '#8CC82F' : 'gray'} size={25} />
                        <Text style={styles.selectText}>മലയാളം</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.selectView} onPress={() => handleSelectLanguage('tamil')}>
                        <FontAwesome name='check-circle' color={language === 'tamil' ? '#8CC82F' : 'gray'} size={25} />
                        <Text style={styles.selectText}>தமிழ்</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.selectView} onPress={() => handleSelectLanguage('urdu')}>
                        <FontAwesome name='check-circle' color={language === 'urdu' ? '#8CC82F' : 'gray'} size={25} />
                        <Text style={{ ...styles.selectText, fontSize: 18 }}>اردو</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.selectView} onPress={() => handleSelectLanguage('bengali')}>
                        <FontAwesome name='check-circle' color={language === 'bengali' ? '#8CC82F' : 'gray'} size={25} />
                        <Text style={styles.selectText}>বাংলা</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.selectView} onPress={() => handleSelectLanguage('telugu')}>
                        <FontAwesome name='check-circle' color={language === 'telugu' ? '#8CC82F' : 'gray'} size={25} />
                        <Text style={styles.selectText}>తెలుగు</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.viewSubmit} onPress={handleContinueFunction}>
                    <Text style={styles.textSubmit}>{translations[language].choose_lang_submit} </Text>
                    <FontAwesome name="arrow-right" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    center_logo: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 40,
        alignItems: "center"
    },
    boxedContainer: {
        borderColor: "white",
        borderWidth: 2,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 20,
        marginHorizontal: 20,
        marginTop: 40
    },
    title: {
        color: "white",
        fontSize: 21,
        fontFamily: "Montserrat-SemiBold",
        textAlign: "center"
    },
    description: {
        color: "white",
        fontSize: 13,
        fontWeight: "500",
        fontFamily: "Montserrat-Regular",
        textAlign: "center"
    },
    gridView: {
        display: "flex",
        flexWrap: 'wrap',
        flexDirection: "row",
        gap: 10,
        marginTop: 20,
        justifyContent: "center",
    },
    selectView: {
        backgroundColor: "white",
        borderRadius: 14,
        width: "48%",
        padding: 15,
        display: "flex",
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
        justifyContent: "flex-start"
    },
    selectText: {
        fontSize: 16,
        fontWeight: "600",
        fontFamily: "Montserrat-SemiBold",
        textAlign: "center"
    },
    viewSubmit: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#51E8BF",
        borderRadius: 10,
        marginTop: 18,
        display: "flex",
        flexDirection: "row",
        gap: 5,
    },
    textSubmit: {
        color: "white",
        fontSize: 18,
        fontFamily: "Montserrat-Bold"
    }
})

export default SelectLanguage;
