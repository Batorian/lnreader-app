import React, { useState } from 'react';
import { RefreshControl, View } from 'react-native';
import { xor } from 'lodash-es';

import { EmptyView } from '@components/index';
import NovelCover from '@components/NovelCover';
import NovelList, { NovelListRenderItem } from '@components/NovelList';

import { LibraryNovelInfo } from '@database/types';

import { getString } from '@strings/translations';
import { useTheme } from '@hooks/persisted';
import { updateLibrary } from '@services/updates';
import { LibraryScreenProps } from '@navigators/types';
import { importEpub } from '@services/epub/import';

interface Props {
  categoryId: number;
  novels: LibraryNovelInfo[];
  selectedNovelIds: number[];
  setSelectedNovelIds: React.Dispatch<React.SetStateAction<number[]>>;
  navigation: LibraryScreenProps['navigation'];
}

export const LibraryView: React.FC<Props> = ({
  categoryId,
  novels,
  selectedNovelIds,
  setSelectedNovelIds,
  navigation,
}) => {
  const theme = useTheme();
  const renderItem = ({ item }: { item: LibraryNovelInfo }) => (
    <NovelCover
      item={item}
      theme={theme}
      isSelected={selectedNovelIds.includes(item.id)}
      onLongPress={() => setSelectedNovelIds(xor(selectedNovelIds, [item.id]))}
      onPress={() => {
        if (selectedNovelIds.length) {
          setSelectedNovelIds(xor(selectedNovelIds, [item.id]));
        } else {
          navigation.navigate('Novel', {
            name: item.name,
            path: item.path,
            pluginId: item.pluginId,
          });
        }
      }}
      libraryStatus={false} // yes but actually no :D
      selectedNovelIds={selectedNovelIds}
    />
  );

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    // local category
    if (categoryId === 2) {
      return;
    }
    setRefreshing(true);
    updateLibrary(categoryId);
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <NovelList
        data={novels}
        renderItem={renderItem as NovelListRenderItem}
        ListEmptyComponent={
          <EmptyView
            theme={theme}
            icon="Σ(ಠ_ಠ)"
            description={getString('libraryScreen.empty')}
            actions={[
              categoryId !== 2
                ? {
                    iconName: 'compass-outline',
                    title: getString('browse'),
                    onPress: () => navigation.navigate('Browse'),
                  }
                : {
                    iconName: 'book-arrow-up-outline',
                    title: getString('advancedSettingsScreen.importEpub'),
                    onPress: importEpub,
                  },
            ]}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.onPrimary]}
            progressBackgroundColor={theme.primary}
          />
        }
      />
    </View>
  );
};
