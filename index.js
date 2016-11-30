const Jsupm_Grove = require('jsupm_grove')
const Request = require('request')

const GroveRotary = new Jsupm_Grove.GroveRotary(0)
const HUE_API = process.env.HUE_API || 'localhost'
const INTERVAL = 500

var lastHue

function requestHue(light, hue) {
  var options = {
    method: 'PUT',
    url: `http://${HUE_API}:8015/hue/lights/${light}/set`,
    body: { brightness: hue },
    json: true
  }

  Request(options, (err, res) => {
    if (err) return console.error('Error sending request', err)
  })
}

function lightOff (light) {
  var options = {
    method: 'GET',
    url: `http://${HUE_API}:8015/hue/lights/${light}/off`,
    json: true
  }

  Request(options, (err, res) => {
    if (err) console.error('Error sending request', err)
  })
}

function loop () {
  var absdeg = GroveRotary.abs_deg()
  var hue = Math.round(parseInt(absdeg))

  if (hue !== lastHue) {
    lastHue = hue

    if (hue === 0) {
      lightOff(1)
      lightOff(2)
    } else {
      requestHue(1, hue)
      requestHue(2, hue)
    }
  }

  setTimeout(loop, INTERVAL)
}

loop()
