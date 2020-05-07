const Message = require('../models/message')

exports.postMessage = async (req, res, next) => {

    const contentVariable = JSON.stringify(req.body)
    const belongsToVariable = res.locals.userVariable

    try {
        const messageVariable = await Message.findOneAndUpdate(
            { belongsTo: belongsToVariable },
            { $set: { content: contentVariable, belongsTo: belongsToVariable } },
            { new: true });
        if (!messageVariable) {
            await Message.create({ content: contentVariable, belongsTo: belongsToVariable });
            res.status(200).json({
                message: 'You have Posted Message'
            })
        } else {
            res.status(200).json({
                message: 'You have Updated Message'
            })
        }

    } catch (error) {
        await Message.create({ content: contentVariable, belongsTo: belongsToVariable });
        res.status(200).json({
            message: 'You have Posted Message'
        })
    }
}
