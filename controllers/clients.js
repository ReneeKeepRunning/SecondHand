const Client = require('../types/client')


module.exports.registerForm = (req, res) => {
    res.render('clients/register')
}

module.exports.registerFormPost= async (req, res, next) => {
    try {
        const { username, email, password } = req.body
        const user = new Client({ username, email })
        const newUser = await Client.register(user, password)
        req.login(newUser, err => {
            if (err) return next(err)
            req.flash('success', 'successful signed up.')
            res.redirect('/dogGrooming')
    })
        } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
        }
}

module.exports.loginForm= (req, res) => {
    req.session.returnUrl= req.originalUrl
    res.render('clients/login')
}

module.exports.loginFormPost= (req, res) => {
    req.flash('success', `welcome back, ${req.body.username}`)
    const redirectUrl= req.session.returnUrl || '/dogGrooming'
    delete req.session.returnUrl;
    res.redirect(redirectUrl)}

module.exports.logout= (req, res, next)=> {
    req.logout(err=>{
        if (err) return next(err)
        req.flash('success', 'bye~ Hope to see you again')
        res.redirect('/dogGrooming')
    })
    }
