const express = require('express')
const router = new express.Router()

router.get('/', (req, res) => {
  res.send({
    content: 'Every personal information that you submit through Museek\'s website, mobile app, or offline activities will be at your own risk. By submitting your personal information to us, you are demmed to have given your consent to the disclosure referred to this policy as required.'
  })
})

module.exports = router