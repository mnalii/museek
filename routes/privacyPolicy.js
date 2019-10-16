const express = require('express')
const router = new express.Router()

router.get('/', (req, res) => {
  res.send({
    content: 'This is privacy policy'
  })
})

module.exports = router