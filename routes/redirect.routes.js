const { Router } = require('express');
const Link = require('../models/Link');
const router = Router();


router.get('/:code', async(req, res) => {
    try {

        const link = await Link.findOne({ code: req.params.code });
console.log('[link1] = ', link);
        if (link) {
            link.clicks++;
            await link.save();
            console.log('[link2] = ', link);
            return res.redirect(link.from);
        }

        res.status(404).json('link not found')
    } 
    catch (e) {
        res.status(500).json({message: 'something went wrong123...'})
    }    
})

module.exports = router;