const STORAGE_PREFIX = import.meta.env.VITE_STORAGE_PREFIX;
const DEFAULT_EXPIRE = 60 * 60 * 24 * 7; // 7天，单位秒

interface StorageData<T> {
  value: T;
  expire: number | null;
}

// #region localStorage
const createLocalStorage = <T extends Local>() => {
  // 默认缓存期限为7天

  const set = <K extends keyof T>(key: K, value: T[K], expire: number = DEFAULT_EXPIRE) => {
    const storageData: StorageData<T[K]> = {
      value,
      expire: new Date().getTime() + expire * 1000,
    };
    const json = JSON.stringify(storageData);

    window.localStorage.setItem(`${STORAGE_PREFIX}${String(key)}`, json);
  };

  const get = <K extends keyof T>(key: K) => {
    const json = window.localStorage.getItem(`${STORAGE_PREFIX}${String(key)}`);

    if (!json) return null;

    const storageData: StorageData<T[K]> | null = JSON.parse(json);

    if (storageData) {
      const { value, expire } = storageData;

      if (expire === null || expire >= Date.now()) return value;
    }
    remove(key);

    return null;
  };

  const remove = (key: keyof T) => {
    window.localStorage.removeItem(`${STORAGE_PREFIX}${String(key)}`);
  };

  const clear = () => {
    window.localStorage.clear();
  };

  return { set, get, remove, clear };
};

// #region sessionStorage
const createSessionStorage = <T extends Session>() => {
  const set = <K extends keyof T>(key: K, value: T[K]) => {
    const json = JSON.stringify(value);

    window.sessionStorage.setItem(`${STORAGE_PREFIX}${String(key)}`, json);
  };
  const get = <K extends keyof T>(key: K) => {
    const json = sessionStorage.getItem(`${STORAGE_PREFIX}${String(key)}`);

    if (!json) return null;

    const storageData: T[K] | null = JSON.parse(json);

    if (storageData) return storageData;

    return null;
  };
  const remove = (key: keyof T) => {
    window.sessionStorage.removeItem(`${STORAGE_PREFIX}${String(key)}`);
  };
  const clear = () => {
    window.sessionStorage.clear();
  };

  return { set, get, remove, clear };
};

// #region 导出
export const local = createLocalStorage();
export const session = createSessionStorage();
