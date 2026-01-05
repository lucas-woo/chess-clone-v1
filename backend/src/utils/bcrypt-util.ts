import bcrypt from "bcrypt";

const SALT = Number(process.env.SALT);
export const passwordHash = async (password: string): Promise<string | null> => {
  try {
    const hashed = await bcrypt.hash(password, SALT)
    if(!hashed) throw new Error()
    return hashed
  } catch (e) {
    return null
  }
}

export const passwordCompare = async (password: string, hash: string): Promise<boolean | null> => {
  try{
    const valid = await bcrypt.compare(password, hash)
    if(!valid)throw new Error()
    return valid
  } catch (e) {
    return null
  }
}
