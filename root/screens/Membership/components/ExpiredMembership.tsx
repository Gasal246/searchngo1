import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MembershipViewDialogue from '../../../../components/shared/Dialogs/MembershipViewDialogue';

const ExpiredMembership = ({ data }: { data: any[] }) => {
    return (
        <View>
            <View style={[styles.plan_view, { opacity: 0.8 }]}>
                <LinearGradient
                    colors={["#8D9092", "#626365"]}
                    style={styles.plan_header}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Text style={styles.package_plan_name}>Expired Membership</Text>
                </LinearGradient>
                {data?.map((details: any) => (
                    <View style={styles.plan_row} key={details?.id}>
                        <View style={styles.plan_title_view}>
                            <Text style={styles.plan_title_view_text}>{details?.package_name}</Text>
                        </View>
                        <MembershipViewDialogue details={details}>
                            <View style={styles.plan_view_btn}>
                                <Text style={styles.plan_view_btn_text}>VIEW</Text>
                            </View>
                        </MembershipViewDialogue>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    plan_row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'gray',
    },
    plan_title_view: {
        paddingHorizontal: 20
    },
    plan_title_view_text: {
        fontWeight: '600'
    },
    plan_view_btn: {
        paddingHorizontal: 20,
        backgroundColor: '#005F78',
        paddingVertical: 10,
    },
    plan_view_btn_text: {
        color: 'white',
        fontWeight: '600'
    },
    plan_view: { width: '100%', backgroundColor: 'white', borderRadius: 20, overflow: "hidden", marginBottom: 10 },
    plan_header: { width: '100%', alignItems: 'center', borderBottomWidth: 2, borderColor: 'black', paddingTop: 10 },
    package_plan_name: { color: 'white', fontWeight: '700', fontSize: 18, marginBottom: 15 },
    package_plan_price: { color: 'white', fontWeight: '700', fontSize: 20 },
})

export default ExpiredMembership;
