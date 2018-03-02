function recursion(data, key = 0, parent = {}) {

  for(let key in data){
    if(key === 'undefined'){
      delete data[key]
    }
  }

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

module.exports = data => {

  recursion(data)

  return data

}