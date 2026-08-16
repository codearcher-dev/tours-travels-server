import bcrypt from 'bcryptjs';

export const hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
}

export const verifyPassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
}