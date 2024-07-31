import * as imageConversion from 'image-conversion';
/**
 * 压缩图片
 * inputFile :file
 * toSize : 想要压缩的大小
 * */
export async function compressAccurately(inputFile, toSize) {
  
  const resAvatarBlob = await imageConversion.compressAccurately(inputFile, toSize);
  const resAvatarFile = new window.File(
    [resAvatarBlob],
    inputFile.name, {
      type: inputFile.type
    },
  );
  resAvatarFile.uid = inputFile.uid
  return resAvatarFile;
}
/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}
/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @returns {Array}
 */
export function diffArary(arr1, arr2) {
  arr1 = uniqueArr(arr1)
  arr2 = uniqueArr(arr2)
  return arr1.concat(arr2).filter(arg => !(arr1.includes(arg) && arr2.includes(arg)))
}
// skus: [{"k_id":1,"k":"颜色","v_id":11,"v":"红色"},{"k_id":2,"k":"尺寸","v_id":22,"v":"小"}],
// output：1-11_2-22
export const creatIds = skus => skus.reduce((total, prev, index) => `${total}${prev.k_id}-${prev.v_id}${index === skus.length - 1 ? '' : '_'}`, '')

// 计算每个sku后面有多少项
export function getLevels(tree) {
  let level = []
  for (let i = tree.length - 1; i >= 0; i--) {
    if (tree[i + 1] && tree[i + 1].leaf) {
      level[i] = tree[i + 1].leaf.length * level[i + 1] || 1
    } else {
      level[i] = 1
    }
  }
  return level
}

/**
 * 笛卡尔积运算
 * @param  {[type]} tree   [description]
 * @param  {Array}  stocks [description]
 * @return {[type]}        [description]
 */
export function flatten(tree, stocks = [], options) {
  let {
    optionValue = 'id', optionText = 'value'
  } = options || {}
  let result = []
  let skuLen = 0
  let stockMap = {} // 记录已存在的stock的数据
  const level = getLevels(tree)
  if (tree.length === 0) return result
  tree.forEach(sku => {
    const {
      leaf
    } = sku
    if (!leaf || leaf.length === 0) return true
    skuLen = (skuLen || 1) * leaf.length
  })
  // 根据已有的stocks生成一个map
  stocks.forEach(stock => {
    let {
      skus,
      ...attr
    } = stock
    stockMap[skus.map(item => `${item.k_id}_${item.v_id}`).join('|')] = attr
  })
  for (let i = 0; i < skuLen; i++) {
    let skus = []
    let mapKey = []
    tree.forEach((sku, column) => {
      const {
        leaf
      } = sku
      let item = {}
      if (!leaf || leaf.length === 0) return true
      if (leaf.length > 1) {
        let row = parseInt(i / level[column], 10) % leaf.length
        item = tree[column].leaf[row]
      } else {
        item = tree[column].leaf[0]
      }
      if (!sku[optionValue] || !item[optionValue]) return
      mapKey.push(`${sku[optionValue]}_${item[optionValue]}`)
      skus.push({
        k_id: sku[optionValue],
        k: sku[optionText],
        v_id: item[optionValue],
        v: item[optionText],
      })
    })
    let {
      ...data
    } = stockMap[mapKey.join('|')] || {}
    // 从map中找出存在的sku并保留其值
    result.push({
      ...data,
      skus
    })
  }
  return result
}

/**
 * 判断两个sku是否相同
 * @param  {[type]}  prevSKU [description]
 * @param  {[type]}  nextSKU [description]
 * @return {Boolean}         [description]
 */
export function isEqual(prevSKU, nextSKU, options) {
  let {
    optionValue = 'id'
  } = options || {}
  return (
    nextSKU.length === prevSKU.length &&
    nextSKU.every(({
      leaf = []
    }, index) => {
      let prevLeaf = prevSKU[index].leaf || []
      return (
        prevSKU[index][optionValue] === nextSKU[index][optionValue] &&
        leaf.length === prevLeaf.length &&
        leaf.map(item => item[optionValue]).join(',') ===
        prevLeaf.map(item => item[optionValue]).join(',')
      )
    })
  )
}