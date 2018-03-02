module.exports = type => {

   let d = new Date()

   let fullYear = d.getFullYear()

   let month = (d.getMonth() + 1)
   month = (month >= 10) ? month : '0' + month

   let date = d.getDate()
   date = (date >= 10) ? date : '0' + date

   let hours = d.getHours()
   hours = (hours >= 10) ? hours : '0' + hours

   let minutes = d.getMinutes()
   minutes = (minutes >= 10) ? minutes : '0' + minutes

   let seconds = d.getSeconds()
   seconds = (seconds >= 10) ? seconds : '0' + seconds

   let milliseconds = d.getMilliseconds()
   if (milliseconds < 10) {
      milliseconds = '00' + milliseconds
   } else if (milliseconds < 100) {
      milliseconds = '0' + milliseconds
   }

   return `${fullYear}${month}${date}${hours}${minutes}${seconds}${milliseconds}${Math.ceil(Math.random() * 1000)}${type || ''}`

}