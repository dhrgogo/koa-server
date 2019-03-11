"use strict";

/**
 * 递归器
 * @param {*} data 
 * @param {*} key 
 * @param {*} parent 
 */
function recursion(data, key, parent) {

   // 空值类型
   if (data === undefined || data === "") {
      delete parent[key]
   }

   // 对象类型
   else if (Object.prototype.toString.call(data) === '[object Object]') {
      for (let key in data) {
         recursion(data[key], key, data)
      }
   }

   // 数组类型
   else if (data instanceof Array) {
      for (let i = data.length - 1; i >= 0; i--) {
         if (data[i] === undefined || data[i] === "") {
            data.splice(i, 1)
         } else {
            recursion(data[i], i, data)
         }
      }
   }

   // 函数类型
   else if (data instanceof Function) {
      parent[key] = data()
      recursion(parent[key], key, parent)
   }

   // 其它类型
   else {
      parent[key] = data
   }

}


/**
 * 空值过滤器
 * @param {Object,Array} data 数据源
 */
module.exports = data => {

   recursion(data, 0, {})

   return data

}