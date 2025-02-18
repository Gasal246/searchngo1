import React, { useEffect, useRef, useState } from "react";
import Entypo from '@expo/vector-icons/Entypo';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Button, Image, } from "react-native";
import { CameraView, CameraType, useCameraPermissions, CameraViewRef } from 'expo-camera';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { translations } from "../../lib/translations";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import * as ImageManipulator from 'expo-image-manipulator';

const CameraModal = ({ children, title, setImageUri }: { children: React.ReactNode, title?: string, setImageUri: React.Dispatch<React.SetStateAction<string>> }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [facing, setFacing] = useState<CameraType>('front');
    const language = useSelector((state: RootState) => state.language.language)

    const [permission, requestPermission] = useCameraPermissions();
    const [image, setImage] = useState<any>(null);
    const cameraRef = useRef<any>();
    const [cameraReady, setCameraReady] = useState<boolean>(false);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, [permission]);

    useEffect(() => {
        if (image) {
            setImageUri(image);
        }
    }, [image]);
    
    if (!permission) return null;

    function handleCloseModal() {
        setModalVisible(false);
        setImage(null);
        setLoading(false);
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    async function takePicture() {
        if (cameraRef.current && cameraReady) {
            try {
                const picture = await cameraRef.current.takePictureAsync({
                    skipProcessing: true,
                    quality: 0.5, // Reduces the quality (optional)
                });
    
                // Resize and compress the image
                const resizedImage = await ImageManipulator.manipulateAsync(
                    picture.uri,
                    [{ resize: { width: 800 } }], // Adjust width (height auto-scales)
                    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
                );
    
                setImage(resizedImage.uri as string);
            } catch (error) {
                console.error("Error capturing image:", error);
            } finally {
                setLoading(false);
            }
        }
    }

    const handleRetakeImage = () => {
        setImage(null);
    }

    const handleUseImage = () => {
        // setImageUri(image);
        setModalVisible(false);
        setImage(null);
    }

    const handleCameraReady = () => {
        setCameraReady(true);
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                {children}
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalTitle}>{'Face Camera'}</Text>
                                <Text style={styles.modalDescription}>{translations[language].show_your_face}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={handleCloseModal}
                            >
                                <Entypo name="cross" size={28} color="#c9ffeb" />
                            </TouchableOpacity>
                        </View>
                        {image ? (
                            <View style={styles.previewContainer}>
                                <Image source={{ uri: image }} style={styles.previewImage} />
                                <View style={styles.ImageButtonWrapper}>
                                    <TouchableOpacity style={styles.retakeButton} onPress={handleRetakeImage}>
                                        <MaterialIcons name="restart-alt" size={24} color="#ad7e7e" />
                                        <Text style={styles.retakeText}>{translations[language].retake}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.useItButton} onPress={handleUseImage}>
                                        <FontAwesome name="check" size={22} color="#4eb48b" />
                                        <Text style={styles.useItText}>{translations[language].useit}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : loading ? (
                            <View>
                                <Text style={{ color: 'white', fontSize: 16 }}>{translations[language].processing}</Text>
                            </View>
                        ) : (
                            <View style={styles.cameraContainer}>
                                <CameraView
                                    ref={cameraRef}
                                    style={styles.cameraView}
                                    facing={'front'}
                                    onCameraReady={handleCameraReady}
                                    autofocus="on"
                                    mode="picture"
                                    mirror={false}
                                >
                                    <Image source={require('../../assets/images/png/FaceMask.png')} style={{ width: '100%', height: '100%', aspectRatio: 3 / 4}} />
                                </CameraView>
                                <View style={styles.camButtons}>
                                    <TouchableOpacity style={styles.captureWrapper} onPress={takePicture}>
                                        <EvilIcons name="camera" size={40} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default CameraModal

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        alignItems: 'center',
        paddingTop: 15
    },
    modalContent: {
        width: "97%",
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 30,
        backgroundColor: "#003f43",
        borderRadius: 10,
        alignItems: "center",
    },
    closeButton: {
        borderRadius: 15,
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    modalHeader: {
        display: "flex",
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: "center",
        width: '100%',
    },
    modalTitle: {
        color: "#c9ffeb",
        fontSize: 18,
        fontWeight: "600",
    },
    modalDescription: {
        fontSize: 14,
        color: "#c9ffeb",
    },
    cameraContainer: {
        marginTop: 20,
    },
    cameraView: {
        width: "98%",
        height: 'auto',
        aspectRatio: 3 / 4
    },
    faceCircleOverlay: {
        position: 'absolute',
        width: 200, // Adjust based on desired size
        height: 200, // Adjust based on desired size
        borderRadius: 100, // Half of width/height for perfect circle
        borderWidth: 2, // Thickness of the circle outline
        borderColor: 'white', // Color of the outline
        alignSelf: 'center', // Center horizontally
        top: '30%', // Adjust to position vertically (percentage relative to camera view height)
        zIndex: 10, // Ensure it appears above the camera view
    },
    captureWrapper: {
        width: 100,
        height: 50,
        borderColor: 'gray',
        paddingBottom: 8,
        borderWidth: 1,
        borderRadius: 30,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    camButtons: {
        width: "100%",
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 20
    },
    ImageButtonWrapper: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20
    },
    retakeButton: {
        borderColor: '#ad7e7e',
        borderWidth: 1,
        borderRadius: 30,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        paddingLeft: 15,
        paddingRight: 20,
        paddingVertical: 7,
    },
    retakeText: {
        color: '#ad7e7e',
        fontSize: 16,
        fontWeight: '600',
    },
    useItButton: {
        borderColor: '#4eb48b',
        borderWidth: 1,
        borderRadius: 30,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        paddingLeft: 15,
        paddingRight: 22,
        paddingVertical: 8,
    },
    useItText: {
        color: '#4eb48b',
        fontSize: 16,
        fontWeight: '600',
    },
    previewContainer: {
        marginTop: 15
    },
    previewImage: {
        width: '98%',
        height: 'auto',
        aspectRatio: 3 / 4
    }
});