import { db } from '@database/db';
import { LibraryNovelInfo, NovelInfo } from '../types';

export const getLibraryNovelsFromDb = (
  sortOrder?: string,
  filter?: string,
  searchText?: string,
  downloadedOnlyMode?: boolean,
  excludeLocalNovels?: boolean,
) => {
  let query = 'SELECT * FROM Novel WHERE inLibrary = 1';

  if (excludeLocalNovels) {
    query += ' AND isLocal = 0';
  }

  if (filter) {
    query += ` AND ${filter}`;
  }

  if (downloadedOnlyMode) {
    query += ` AND (chaptersDownloaded = 1 OR isLocal = 1)`;
  }

  if (searchText) {
    query += ' AND name LIKE ?';
  }

  if (sortOrder) {
    query += ` ORDER BY ${sortOrder}`;
  }

  return db.getAllAsync<NovelInfo>(query, searchText ? `%${searchText}%` : '');
};

const getNovelOfCategoryQuery =
  'SELECT DISTINCT novelId FROM NovelCategory WHERE 1 = 1';
const getNovelsFromIDListQuery = 'SELECT * FROM Novel WHERE inLibrary = 1 ';

export const getLibraryWithCategory = async (
  categoryId?: number | null,
  onlyUpdateOngoingNovels?: boolean,
  excludeLocalNovels?: boolean,
): Promise<LibraryNovelInfo[]> => {
  let categoryQuery = getNovelOfCategoryQuery;

  if (categoryId) {
    categoryQuery += ` AND categoryId = ${categoryId}`;
  }

  const idRows = await db.getAllAsync<{ novelId: number }>(categoryQuery);

  if (!idRows || idRows.length === 0) return [];

  const novelIds = idRows.map(r => r.novelId).join(',');

  let novelQuery = getNovelsFromIDListQuery;

  novelQuery += ` AND id IN (${novelIds})`;

  if (excludeLocalNovels) {
    novelQuery += ' AND isLocal = 0';
  }

  if (onlyUpdateOngoingNovels) {
    novelQuery += " AND status = 'Ongoing'";
  }

  return db.getAllAsync<LibraryNovelInfo>(novelQuery);
};
