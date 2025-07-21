const { loginUser, signUpUser } = require('../services/authService');

const signUp = async (req, res) => {
    console.log("BODY:", req.body);
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ message: 'Email y password requeridos' });

    try {
        const result = await signUpUser(email, password);
        res.status(201).json({
            message: 'Usuario creado correctamente',
            userSub: result.userSub,
        });
    } catch (error) {
        console.error('Error en sign up:', error);
        res.status(400).json({ message: 'Error en el registro', error: error.message });
    }
};

const login = async (req, res) => {
    console.log("BODY:", req.body);
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ message: 'Email y password son requeridos' });

    try {
        const tokens = await loginUser(email, password);
        res.json({ message: 'Login exitoso', tokens });
    } catch (error) {
        console.error('Error al autenticar:', error);
        res.status(401).json({ message: 'Credenciales inválidas', error: error.message });
    }
};

module.exports = { login, signUp };
