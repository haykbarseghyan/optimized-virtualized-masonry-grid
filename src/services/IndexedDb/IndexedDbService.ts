/**
 * A service for managing IndexedDB operations with a specific object store.
 * @template T - The type of the data to be stored in the database.
 */
export default class IndexedDbService<T> {
  private dbName: string;
  private storeName: string;

  /**
   * Constructs an instance of IndexedDbService.
   * @param {string} dbName - The name of the database.
   * @param {string} storeName - The name of the object store.
   */
  constructor(dbName: string, storeName: string) {
    this.dbName = dbName;
    this.storeName = storeName;
  }

  /**
   * Opens the database and creates the object store if it doesn't exist.
   * @returns {Promise<IDBDatabase>} - A promise that resolves with the opened database.
   * @private
   */
  private async getDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Adds or updates an item in the object store.
   * @param {string} id - The ID of the item.
   * @param {T} data - The data to store.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async addItem(id: string, data: T): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put({ id, data });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Retrieves an item from the object store by its ID.
   * @param {string} id - The ID of the item.
   * @returns {Promise<T | null>} - A promise that resolves with the item data, or null if not found.
   */
  async getItem(id: string): Promise<T | null> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result?.data ?? null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Deletes an item from the object store by its ID.
   * @param {string} id - The ID of the item to delete.
   * @returns {Promise<void>} - A promise that resolves when the item is deleted.
   */
  async deleteItem(id: string): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Deletes the entire object store.
   * Note: This operation requires a version upgrade of the database.
   * @returns {Promise<void>} - A promise that resolves when the object store is deleted.
   */
  async deleteStore(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (db.objectStoreNames.contains(this.storeName)) {
          db.deleteObjectStore(this.storeName);
        }
      };

      request.onsuccess = () => {
        request.result.close();
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }
}
