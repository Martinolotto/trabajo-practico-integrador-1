//middleware que comprueba si las validaciones dejaron errores
// lee validationResult(req), si hay errores 400, si no next

import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  next();
};