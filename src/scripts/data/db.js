import { openDB } from 'idb';

const DB_NAME = 'story-app-db';
const DB_VERSION = 1;
const OBJECT_STORE_NAME = 'stories';

// Initialize database with proper error handling
const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
      const objectStore = db.createObjectStore(OBJECT_STORE_NAME, {
        keyPath: 'id',
        autoIncrement: false, 
      });
    
      objectStore.createIndex('createdAt', 'createdAt', { unique: false });
      objectStore.createIndex('name', 'name', { unique: false });
      objectStore.createIndex('author', 'author', { unique: false });
    }
  },
  blocked() {
    console.warn('Database upgrade blocked. Please close other tabs with this site open.');
  },
  blocking() {
    console.warn('Database is blocking a future version. Please refresh the page.');
  }
});

const Database = {
  /**
   * Check if a story is already saved in IndexedDB
   * @param {string} id - Story ID
   * @returns {Promise<boolean>}
   */
  async isStorySaved(id) {
    try {
      const db = await dbPromise;
      const story = await db.get(OBJECT_STORE_NAME, id);
      return !!story;
    } catch (error) {
      console.error('Error checking if story is saved:', error);
      return false;
    }
  },

  /**
   * Get all saved stories from IndexedDB
   * @returns {Promise<Array>}
   */
  async getAllStories() {
    try {
      const db = await dbPromise;
      const stories = await db.getAll(OBJECT_STORE_NAME);
      return stories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error('Error getting all stories:', error);
      return [];
    }
  },

  /**
   * Get a specific story by ID
   * @param {string} id - Story ID
   * @returns {Promise<Object|null>}
   */
  async getStoryById(id) {
    try {
      const db = await dbPromise;
      const story = await db.get(OBJECT_STORE_NAME, id);
      return story || null;
    } catch (error) {
      console.error('Error getting story by ID:', error);
      return null;
    }
  },

  /**
   * Save a story to IndexedDB
   * @param {Object} story - Story object
   * @returns {Promise<boolean>}
   */
  async saveStory(story) {
    try {
      const db = await dbPromise;
      
      // Validate story data
      if (!story || !story.id) {
        console.error('Invalid story data: missing ID');
        return false;
      }

      // Check if story already exists
      const existingStory = await db.get(OBJECT_STORE_NAME, story.id);
      if (existingStory) {
        console.warn('Story already exists in database');
        return false;
      }

      // Add timestamp when saving
      const storyToSave = {
        ...story,
        savedAt: new Date().toISOString(),
        createdAt: story.createdAt || new Date().toISOString()
      };

      await db.add(OBJECT_STORE_NAME, storyToSave);
      console.log('Story saved successfully:', story.id);
      return true;
    } catch (error) {
      console.error('Error saving story:', error);
      return false;
    }
  },

  /**
   * Update an existing story in IndexedDB
   * @param {Object} story - Updated story object
   * @returns {Promise<boolean>}
   */
  async updateStory(story) {
    try {
      const db = await dbPromise;
      
      if (!story || !story.id) {
        console.error('Invalid story data: missing ID');
        return false;
      }

      // Check if story exists
      const existingStory = await db.get(OBJECT_STORE_NAME, story.id);
      if (!existingStory) {
        console.error('Story not found for update');
        return false;
      }

      // Update with timestamp
      const updatedStory = {
        ...existingStory,
        ...story,
        updatedAt: new Date().toISOString()
      };

      await db.put(OBJECT_STORE_NAME, updatedStory);
      console.log('Story updated successfully:', story.id);
      return true;
    } catch (error) {
      console.error('Error updating story:', error);
      return false;
    }
  },

  /**
   * Remove a story from IndexedDB
   * @param {string} id - Story ID
   * @returns {Promise<boolean>}
   */
  async removeStory(id) {
    try {
      const db = await dbPromise;
      
      if (!id) {
        console.error('Invalid story ID for removal');
        return false;
      }

      // Check if story exists before deletion
      const existingStory = await db.get(OBJECT_STORE_NAME, id);
      if (!existingStory) {
        console.warn('Story not found for deletion');
        return false;
      }

      await db.delete(OBJECT_STORE_NAME, id);
      console.log('Story removed successfully:', id);
      return true;
    } catch (error) {
      console.error('Error removing story:', error);
      return false;
    }
  },

  /**
   * Clear all stories from IndexedDB
   * @returns {Promise<boolean>}
   */
  async clearAllStories() {
    try {
      const db = await dbPromise;
      await db.clear(OBJECT_STORE_NAME);
      console.log('All stories cleared from database');
      return true;
    } catch (error) {
      console.error('Error clearing all stories:', error);
      return false;
    }
  },

  /**
   * Get stories count
   * @returns {Promise<number>}
   */
  async getStoriesCount() {
    try {
      const db = await dbPromise;
      const count = await db.count(OBJECT_STORE_NAME);
      return count;
    } catch (error) {
      console.error('Error getting stories count:', error);
      return 0;
    }
  },

  /**
   * Search stories by name
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>}
   */
  async searchStories(searchTerm) {
    try {
      const db = await dbPromise;
      const allStories = await db.getAll(OBJECT_STORE_NAME);
      
      if (!searchTerm) return allStories;
      
      const searchTermLower = searchTerm.toLowerCase();
      const filteredStories = allStories.filter(story => 
        story.name?.toLowerCase().includes(searchTermLower) ||
        story.description?.toLowerCase().includes(searchTermLower)
      );
      
      return filteredStories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error('Error searching stories:', error);
      return [];
    }
  },

  /**
   * Get database info
   * @returns {Promise<Object>}
   */
  async getDatabaseInfo() {
    try {
      const db = await dbPromise;
      const count = await db.count(OBJECT_STORE_NAME);
      return {
        name: DB_NAME,
        version: DB_VERSION,
        storeName: OBJECT_STORE_NAME,
        storiesCount: count
      };
    } catch (error) {
      console.error('Error getting database info:', error);
      return null;
    }
  }
};

export default Database;