import { User } from '../models/user.models.js'
import ApiError from '../utils/ApiError.utils.js'
import ApiResponse from '../utils/ApiResponse.utils.js'
const handleAuth = async (req, res) => {
  const { sub } = req.auth
  const { email, name } = req.body

  const provider = sub.split('|')[0]
  const providerId = sub.split('|')[1]

  if (!providerId) {
    throw new ApiError(400, 'ProviderId Not Found!')
  }

  let user = await User.findOne({ providerId })

  if (!user) {
    user = await User.create({
      email,
      name,
      provider,
      providerId,
    })
  }

  res.status(200).json(new ApiResponse(200, 'User Created Sucessfully', user))
}

export { handleAuth }
