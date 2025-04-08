import JSEncrypt from "jsencrypt";

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey: string =
  "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwxVxvAnBPsjQ/fQ1t8BP6PelvLlRnR48YdT4Q/MmPs+NhkdfUbpMlfJj8Wou4km4OkgMb40p+lZQKD1rxweM\n" +
  "MvtT7Src1pEwdQK/UgWrS0aL6W6a6LRI8Py468fGBCGCV+3jyVctON9j7UZuLQCVJDbteQB0HJfOmqEgqGzdRNcW95Nn78Dw7OitsQ9ZRlFeJ98i0n8wLxeQObnQAgF/\n" +
  "v5wIMN1vFWZpgNsSM/NTymftpf7g69iA1+bNUTZSFpV7Z1z4AfaLL9oxGy3zgfD//zYqQGW1NAvLYYTYjzKbtbjAV0W4sLx/OHKnAUMctHyl00nW/IRUrOtZEZCulfR1\n" +
  "zQIDAQAB";

const privateKey: string =
  "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDDFXG8CcE+yND99DW3wE/o96W8uVGdHjxh1PhD8yY+z42GR19RukyV8mPxai7iSbg6SAxvjSn6VlAo\n" +
  "PWvHB4wy+1PtKtzWkTB1Ar9SBatLRovpbprotEjw/Ljrx8YEIYJX7ePJVy0432PtRm4tAJUkNu15AHQcl86aoSCobN1E1xb3k2fvwPDs6K2xD1lGUV4n3yLSfzAvF5A5\n" +
  "udACAX+/nAgw3W8VZmmA2xIz81PKZ+2l/uDr2IDX5s1RNlIWlXtnXPgB9osv2jEbLfOB8P//NipAZbU0C8thhNiPMpu1uMBXRbiwvH84cqcBQxy0fKXTSdb8hFSs61kR\n" +
  "kK6V9HXNAgMBAAECggEAIA/fMGteAkaY6pP/XCLUP1KsP5cpjawRena5EtnceEg+V0pVpSX8PkynFl9AM1qwV4vN12uY8ZbL98EYfI6GAT8DLSB1SSJ1l1WLQhzCaU2/\n" +
  "4u6VsRcoQcsXTVD4/2bOeEsVu9qDCSzVzIJdyzGkUV5hqxhi/OwKPamrp2K0/wIdQprI+y4CceHNZ3hp6NYfZ3KgfLhh2OZGj2WV68VCjwA9gVLykLdUUcx3ZEpPY+tl\n" +
  "UZJFf3PhIxicZ7yuo4GbfhR1jeeISCKARDPAaCDerendz/rVQds5b2hzWtKz+k81ZEipPvkhixrfklu+fi0VwOKPeaSK793GUGe5GW/NVQKBgQDiR6zUD3hj5i5NQbUg\n" +
  "T9OHuqCahaG90KAK5UJwxJTIH4wBCkYlBQSYyUBUOl4AGDoHEULz4G+J5ZGCV+hVlZBHIyvr6yCKWdLeKDMRPGrA0rkeGsPyeAmdBICY2dK0KZZ6vvDRmMe23J4T53uI\n" +
  "D4e4Cb88kaYSDkxBVg1U33PE7wKBgQDctNfgGXHL5Np61Y6e8X/mUEtwkm+IQJB9U/zLnIOlJtRJwfjnuNM1lWJif+B8yNvNUSAOkDbHAhLBclm+CdgX601c8AuYOCVn\n" +
  "d7KLebYYagJ2CPPxcenoVEXaVWBQMgzvi371aQrBXY40540jzE1Sa3A2ckiC1GoKD9bhnJ9JAwKBgQCrkKCvoJMtW2cb2IgWWbAOpygCQPPjUX0nBbCcg9Ay9AhY+Ys5\n" +
  "olZb6atGsYJ4G+ZTWXkkI7UuHst2wmQ8D8x2w2oX1Ay2GWjSXDRsCxz92kfVVYHgI7dWQAWo3u7s/uNDaeZ5ZJd4REnu2YJGJVBH78v5ho0d/409tJsjENFcLQKBgGWB\n" +
  "MquZaDHK7gSCRVaqYRVOpnN+lZcHgqxxPRlzwUPqaMYHVO9VnKXPL3F3uIoLYrO59NFd2COMu42GhumU43KUwH7W065NXD6K2W22K15tGvaoRXEs39P/NiUlEOexLSva\n" +
  "byh1CAJIgcepGst1Aba/PNt9kgXBpYc9I6mde9B7AoGAMDKgHqMwVj7Lnp4SDdbjEB+fM6MFMAN9K1ULtUa/m0jwOVHwD07uV175rxWa8CAVClbS9x18ms6qsIzwW87k\n" +
  "49NGw4FmVwCG25ZjxiNGI/QFPc0ZYU0ESEk2fLYvt85hqS2AFuSBSlqtg4SGlQkS9Hm1kBTDBIH88YOrQ1go7T8=";

/* 加密 */
export const encrypt = (txt: string) => {
  const encryptor: JSEncrypt = new JSEncrypt();

  encryptor.setPublicKey(publicKey); // 设置公钥

  return encryptor.encrypt(txt); // 对数据进行加密
};

/* 解密 */
export const decrypt = (txt: string) => {
  const encryptor: JSEncrypt = new JSEncrypt();

  encryptor.setPrivateKey(privateKey); // 设置私钥

  return encryptor.decrypt(txt); // 对数据进行解密
};
