import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  deleteBookmark,
  listBookmarks,
  logAuditEvent,
  saveBookmark,
} from '../services/firestore';
import type { Bookmark, ModuleSummary } from '../types';

export function moduleBookmarkId(userId: string, moduleId: string): string {
  return `${userId}_module_${moduleId}`;
}

export function useBookmarks(): {
  bookmarks: Bookmark[];
  loading: boolean;
  isModuleSaved: (moduleId: string) => boolean;
  toggleModuleBookmark: (module: ModuleSummary) => Promise<void>;
  refresh: () => Promise<void>;
} {
  const { user, learnerPreview } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user || learnerPreview) {
      setBookmarks([]);
      return;
    }
    setLoading(true);
    try {
      setBookmarks(await listBookmarks(user.uid));
    } finally {
      setLoading(false);
    }
  }, [user, learnerPreview]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const savedModuleIds = useMemo(() => {
    return new Set(
      bookmarks
        .filter((bookmark) => !bookmark.type || bookmark.type === 'module')
        .map((bookmark) => bookmark.moduleId),
    );
  }, [bookmarks]);

  const isModuleSaved = useCallback(
    (moduleId: string) => savedModuleIds.has(moduleId),
    [savedModuleIds],
  );

  const toggleModuleBookmark = useCallback(
    async (module: ModuleSummary) => {
      if (!user || learnerPreview) return;
      const bookmarkId = moduleBookmarkId(user.uid, module.id);
      const existing = bookmarks.find((bookmark) => bookmark.id === bookmarkId);
      if (existing) {
        setBookmarks((current) => current.filter((bookmark) => bookmark.id !== bookmarkId));
        await deleteBookmark({ userId: user.uid, bookmarkId });
        await logAuditEvent({
          userId: user.uid,
          type: 'bookmark_removed',
          moduleId: module.id,
          refId: bookmarkId,
          details: { bookmarkType: 'module' },
        });
        return;
      }

      const bookmark: Bookmark = {
        id: bookmarkId,
        userId: user.uid,
        type: 'module',
        moduleId: module.id,
        title: module.title,
        createdAt: Date.now(),
      };
      setBookmarks((current) => [...current, bookmark]);
      await saveBookmark(bookmark);
      await logAuditEvent({
        userId: user.uid,
        type: 'bookmark_added',
        moduleId: module.id,
        refId: bookmarkId,
        details: { bookmarkType: 'module' },
      });
    },
    [bookmarks, learnerPreview, user],
  );

  return { bookmarks, loading, isModuleSaved, toggleModuleBookmark, refresh };
}
