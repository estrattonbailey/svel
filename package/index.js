let time = 0
let prevtime = 0
let distance = 0
let prevscroll = null
let pool = []
let timeout = null

const flush = () => {
  time = 0
  prevtime = 0
  distance = 0
  prevscroll = 0
  pool = []
}

export default (y, event = { timeStamp: 0 }, config = {}) => {
  let total = 0

  if (!event.timeStamp || event.timeStamp === 0) return 0

  time = event.timeStamp - prevtime
  distance = Math.abs(y - prevscroll || 0)
  prevscroll = y
  prevtime = event.timeStamp

  pool.push(distance / (time * (1 / (config.interval || 100))))

  if (pool.length > (config.pool || 10)) pool.shift()

  timeout = setTimeout(flush, config.reset || 50)

  timeout && clearTimeout(timeout)

  for (let i = 0; i < pool.length; i++) {
    total = (pool[i] + total)

    return {
      velocity: total / (i + 1),
      flush,
    }
  }

  return {
    velocity: 0,
    flush,
  }
}
