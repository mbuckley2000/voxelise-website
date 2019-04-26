/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-use-before-define */

import React, { useState, useContext } from 'react';
import { navigate } from 'gatsby';
import {
  Header,
  Form,
  Input,
  Button,
  Segment,
  Message,
} from 'semantic-ui-react';
import { register } from '../../lib/strapiAuth';
import Layout from '../components/Layout';
import useForm from '../components/Hooks/useForm';

const Register = ({ location }) => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState([]);

  const formRegister = () => {
    setLoading(true);
    register({
      username: values.name,
      email: values.email,
      password: values.password,
    })
      .then(data => {
        const { user, jwt } = data;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('jwt', jwt);
        navigate('/myaccount/');
      })
      .catch(e => {
        setLoading(false);
        setApiError([
          {
            title: 'Sorry',
            detail: e.response.data.message,
            status: e.response.data.message,
          },
        ]);
      });
  };

  const {
    values, handleChange, handleSubmit, errors,
  } = useForm(
    formRegister,
    validate,
  );

  const handleErrors = apiErrors => {
    if (!Array.isArray(apiErrors) && !apiErrors.length > 0) {
      return (
        <Message error header="Sorry" content="Failed to register user." />
      );
    }
    return apiErrors.map(e => (
      <Message error header={e.title} content={e.detail} key={e.status} />
    ));
  };

  return (
    <Layout location={location}>
      <Header as="h1">Create an account</Header>
      <Form
        onSubmit={handleSubmit}
        loading={loading}
        error={apiError.length !== 0 || Object.entries(errors).length !== 0}>
        {apiError.length !== 0 ? handleErrors(apiError) : null}
        <Segment>
          <Form.Field>
            <label htmlFor="name">Username</label>
            <Input
              id="name"
              fluid
              name="name"
              autoFocus
              onChange={handleChange}
              value={values.name || ''}
            />
          </Form.Field>
          {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}

          <Form.Field>
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              fluid
              name="email"
              type="email"
              onChange={handleChange}
              value={values.email || ''}
            />
          </Form.Field>
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
          <Form.Field>
            <label htmlFor="password">Password</label>
            <Input
              id="password"
              fluid
              name="password"
              type="password"
              onChange={handleChange}
              value={values.password || ''}
            />
          </Form.Field>
          {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
          <Button type="submit" color="orange">
            Register
          </Button>
        </Segment>
      </Form>
    </Layout>
  );
};

export default Register;

const validate = values => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Email address is required';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email address is invalid';
  }
  if (!values.password) {
    errors.password = 'Password is required';
  }
  if (!values.name) {
    errors.name = 'A name is required';
  }
  return errors;
};
