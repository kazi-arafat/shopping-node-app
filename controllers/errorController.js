exports.error404 = (req, res, next ) => {
    // res.status(404).sendFile(path.join(rootDir, 'views','404-error.html'));
    res.status(404).render('404-error.pug',{pageTitle : 'Page not found'});
}