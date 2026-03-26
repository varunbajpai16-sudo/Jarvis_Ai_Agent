import { User } from '../models/user.models.js'
import ApiError from '../utils/ApiError.utils.js'
import ApiResponse from '../utils/ApiResponse.utils.js'


const RegisterUser = async (req, res) => {
  if (!req.auth?.sub) {
    throw new ApiError(401, 'Unauthorized')
  }

  const { sub } = req.auth
  const { email, name } = req.body

  const [provider, providerId] = sub.split('|')

  if (!providerId) {
    throw new ApiError(400, 'ProviderId Not Found!')
  }

  let user = await User.findOne({ providerId })

  if (user) {
    throw new ApiError(409, 'User already exists')
  }

  user = await User.create({
    email,
    name,
    provider,
    providerId,
  })

  return res
    .status(201)
    .json(new ApiResponse(201, 'User Created Successfully', user))
}

export { RegisterUser }
