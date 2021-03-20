import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

import {
    StyleSheet,
    View,
    Text,
    FlatList,
    ActivityIndicator,
} from "react-native";

import { Appbar } from "../../components/common/Appbar";
import HistoryCard from "./components/HistoryCard";

import { getHistoryFromDb, deleteChapterHistory } from "../../services/db";

import { useSelector } from "react-redux";
import EmptyView from "../../components/common/EmptyView";

const History = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);

    const theme = useSelector((state) => state.themeReducer.theme);

    const getHistory = async () => {
        await getHistoryFromDb().then((res) => setHistory(res));
        setLoading(false);
    };

    const deleteHistory = (novelId) => {
        deleteChapterHistory(novelId);
        getHistory();
    };

    useFocusEffect(
        useCallback(() => {
            getHistory();
        }, [])
    );

    const renderHistoryCard = ({ item }) => (
        <HistoryCard
            item={item}
            deleteHistory={deleteHistory}
            navigation={navigation}
        />
    );

    return (
        <>
            <Appbar title="History" />
            <View
                style={[
                    styles.container,
                    { backgroundColor: theme.colorPrimaryDark },
                ]}
            >
                <FlatList
                    data={history}
                    keyExtractor={(item) => item.historyId.toString()}
                    renderItem={renderHistoryCard}
                    ListFooterComponent={
                        loading && (
                            <ActivityIndicator
                                size="small"
                                color={theme.colorAccentDark}
                            />
                        )
                    }
                    ListEmptyComponent={
                        !loading && (
                            <EmptyView
                                icon="(˘･_･˘)"
                                description="Nothing read recently"
                            />
                        )
                    }
                />
            </View>
        </>
    );
};

export default History;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
});
