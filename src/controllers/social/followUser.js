const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const typeOfAction = request.body.type
    const userToFollow = request.body.userToFollow
    const userName = request.body.username

    Promise.all([
        userModel.findOne({ userName: userToFollow }),
        userModel.findOne({ userName: userName })
    ]).then(([userToFollowDoc, userDoc]) => {
        if (typeOfAction == "add") {
            userToFollowDoc.social.followers.unshift({ userName: userName });
            userDoc.social.following.unshift({ userName: userToFollow });
        } else if (typeOfAction == "remove") {
            userToFollowDoc.social.followers = userToFollowDoc.social.followers.filter(item => item.userName !== userName);
            userDoc.social.following = userDoc.social.following.filter(item => item.userName !== userToFollow);
        }

        return Promise.all([
            userToFollowDoc.save(),
            userDoc.save()
        ]);
    }).then(() => {
        response.status(200).send({ message: 'Operation successful' });
    }).catch(err => {
        console.error(err);
        response.status(500).send({ error: err.message });
    });

}
