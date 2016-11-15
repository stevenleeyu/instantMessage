module.exports = {
    user: {
        username: String,
        nickname: String,
        password: String
    },
    session: {
        createrUid: String,
        sessName: String,
        totalNum: Number,
        type: Number
    },
    sessionMember: {
        sessId: String,
        uId: String,
        nickname: String,
        readNum: Number,
        lastTime: Number
    },
    chatLog: {
        sessId: String,
        senderUid: String,
        content: String,
        sendTime: Number
    }
};
