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
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    if(err.message?.toLowerCase().includes('invalid login credentials')) {
          res.status(404).json({ message: 'Usuário ou senha inválidos' });
    }    
    res.status(400).json({ message: 'Falha ao fazer login' });
  }
};