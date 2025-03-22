from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from app.JWT.jwtSecurity import SECRET_KEY, ALGORITHM
from app.database import users_collection
from jose import JWTError, jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user(token : str = Depends(oauth2_scheme)):
    """ Validate JWT token and return user details """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await users_collection.find_one({"email": email})
        return user
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
        )
