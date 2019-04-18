import Axios from 'axios'

const login = ({identifier, password}) =>
  Axios.post('https://voxelise-api.mattbuckley.org/auth/local', {
    identifier,
    password,
  }).then(response => {
    const {
      data: {user, jwt},
    } = response

    return {
      user,
      jwt,
    }
  })

const register = ({username, email, password}) =>
  Axios.post('https://voxelise-api.mattbuckley.org/auth/local/register', {
    username,
    email,
    password,
  }).then(response => {
    const {
      data: {user, jwt},
    } = response

    return {
      user,
      jwt,
    }
  })

export {login, register}
