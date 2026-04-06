import * as authService from "../services/auth.service.js";

export const registerController = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

export const loginController = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.query;

    const credentials = {
      email: email,
      password: password
    }

    const result = await authService.login(credentials);
    res.json(result);
  } catch (err) {
    if(err.message?.toLowerCase().includes('invalid login credentials')) {
          res.status(404).json({ message: 'Usuário ou senha inválidos' });
    }    
    res.status(400).json({ message: 'Falha ao fazer login' });
  }
};

export const getRecruiterLoggedInController = async (req, res) => {
  try {
    const user = req.user;
    const recruiter = await authService.getRecruiterLoggedIn(user.id);

    return res.json({
      user,
      recruiter,
    });
  } catch (err) {
    return res.status(500).json({ message: "Falha ao recuperar dados da conta" });
  }
}