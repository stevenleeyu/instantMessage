module.exports = function ( app ) {
    require('./user')(app);
    require('./chat')(app);
    require('./ding')(app);
    require('./file-upload')(app);
};