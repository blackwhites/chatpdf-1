import SparkMD5 from 'spark-md5';

export function debounceFunction(func, delay) {
  let timer;
  return function () {
    let self = this;
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(self, args);
    }, delay);
  };
}


export function isNumber(value) {
  return !isNaN(value);
}

export function isEmail(value) {
  // eslint-disable-next-line
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(value);
}

export function isUsername(value) {
  return /^[a-zA-Z0-9_-]{4,16}$/i.test(value);
}

export function isContainSpecial(value) {
  // eslint-disable-next-line
  return /[`~!@#$%^&*()+<>?:"{},.\/;'[\]]/im.test(value);
}

export function isChinese(value) {
  return /[\u4e00-\u9fa5]/i.test(value);
}

export  function computeFileMD5(file) {
  return new Promise((resolve, reject) => {
    let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
    let chunkSize = 2097152;  // 按照一片 2MB 分片
    let chunks = Math.ceil(file.size / chunkSize); // 片数
    let currentChunk = 0;
    let spark = new SparkMD5.ArrayBuffer();
    let fileReader = new FileReader();

    fileReader.onload = function (e) {

      spark.append(e.target.result);
      currentChunk++;

      if (currentChunk < chunks) {
        loadNext();
      } else {

        let md5 = spark.end(); //最终md5值
        spark.destroy(); //释放缓存
        resolve(md5);
      }
    };

    fileReader.onerror = function (e) {
      console.warn('oops, something went wrong.');
      reject(e);
    };

    function loadNext() {
      let start = currentChunk * chunkSize,
        end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    }

    loadNext();

  })
}
