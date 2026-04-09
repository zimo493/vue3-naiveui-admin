const STORAGE_PREFIX = import.meta.env.VITE_STORAGE_PREFIX ?? "storage-";

const DEFAULT_EXPIRE = 60 * 60 * 24 * 7; // 7天，单位秒

interface StorageData<T> {
  value: T;
  expire: number | null;
}

const safeJsonParse = <T>(json: string): T | null => {
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
};

const prefixedKey = (key: string): string => `${STORAGE_PREFIX}${key}`;

// #region LocalStorage
const createLocalStorage = <T extends Local>() => {
  const set = <K extends keyof T & string>(
    key: K,
    value: T[K],
    expire: number = DEFAULT_EXPIRE
  ) => {
    const data: StorageData<T[K]> = {
      value,
      expire: expire > 0 ? Date.now() + expire * 1000 : null,
    };

    window.localStorage.setItem(prefixedKey(key), JSON.stringify(data));
  };

  const get = <K extends keyof T & string>(key: K): T[K] | null => {
    const raw = window.localStorage.getItem(prefixedKey(key));

    if (raw === null) return null;

    const data = safeJsonParse<StorageData<T[K]>>(raw);

    if (data === null) {
      remove(key);

      return null;
    }

    if (data.expire !== null && data.expire < Date.now()) {
      remove(key);

      return null;
    }

    return data.value;
  };

  const remove = <K extends keyof T & string>(key: K) => {
    window.localStorage.removeItem(prefixedKey(key));
  };

  /** 只清理带当前前缀的条目，不影响其他数据 */
  const clear = () => {
    const keys = Object.keys(window.localStorage).filter((k) => k.startsWith(STORAGE_PREFIX));

    keys.forEach((k) => window.localStorage.removeItem(k));
  };

  return { set, get, remove, clear };
};

// #region SessionStorage
const createSessionStorage = <T extends Session>() => {
  const set = <K extends keyof T & string>(key: K, value: T[K]) => {
    window.sessionStorage.setItem(prefixedKey(key), JSON.stringify(value));
  };

  const get = <K extends keyof T & string>(key: K): T[K] | null => {
    const raw = window.sessionStorage.getItem(prefixedKey(key));

    if (raw === null) return null;

    return safeJsonParse<T[K]>(raw);
  };

  const remove = <K extends keyof T & string>(key: K) => {
    window.sessionStorage.removeItem(prefixedKey(key));
  };

  const clear = () => {
    const keys = Object.keys(window.sessionStorage).filter((k) => k.startsWith(STORAGE_PREFIX));

    keys.forEach((k) => window.sessionStorage.removeItem(k));
  };

  return { set, get, remove, clear };
};

// #region 导出
export const local = createLocalStorage();
export const session = createSessionStorage();
