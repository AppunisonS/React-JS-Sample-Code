import React, { Component } from 'react';
import { compose } from 'redux';
import injectSheet from 'react-jss';
// import { Link } from 'react-router-dom';
import { Form, FormGroup, InputGroup, Input, FormFeedback, Label } from 'reactstrap';
import { withFormik } from 'formik';
import * as yup from 'yup';
// import { routerActions } from 'connected-react-router';
import GradientButton from '../../common/components/GradientButton';
import { TERMS_OF_USE } from '../../constants';
const baseUrl = process.env.REACT_APP_BASE_API_URL;

const styles = (theme) => ({
  inputsGray: {
    background: '#cccccc !important'
  },
  errorEmail: {
    width: "100%",
    marginTop: '0.25rem',
    fontSize: '80%',
    color: '#ee2e2e'
  }
});

const GET_JSON = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

let checkEmail = false;
let passwordCheck = false;
let firstName = '';
let lastName = ''
yup.addMethod(yup.string, 'ValidatePassword', function (message) {

  return this
    .test({
      name: 'ValidatePassword',
      exclusive: false,
      message: message || '',  // expect an i18n message to be passed in
      test: async function (value) {
          var validate = /^(([^<>()[\].,;:\s@"]+(.[^<>()[\].,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+.)+[a-zA-Z]{2,}))$/;
          if (validate.test(this.parent.email) && checkEmail && value !== undefined && this.parent.email !== undefined) {
            let urlVerifyPassword = baseUrl + '/accounts/verifyPassword/' + this.parent.email + '/' + value;
            const response = await fetch(urlVerifyPassword, GET_JSON)
            const valid = await response.json();
            passwordCheck = !valid.passwordValidation;
            return true;
          } else {
            passwordCheck = false;
            return true;
          }
        }
    })
})


yup.addMethod(yup.string, 'ValidateEmail', function (message) {
  return this
    .test({
      name: 'ValidateEmail',
      exclusive: true,
      message: message || '',  // expect an i18n message to be passed in
      test: async function (value) {
        var validate = /^(([^<>()[\].,;:\s@"]+(.[^<>()[\].,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+.)+[a-zA-Z]{2,}))$/;
        if (validate.test(value) && value !== undefined) {
          let urlVerifyEmail = baseUrl + '/accounts/verify/isEmailAddressExist/' + value;
          const response = await fetch(urlVerifyEmail, GET_JSON)
          const valid = await response.json();
          checkEmail = valid.isEmailAddressExist;
          firstName = valid.firstName;
          lastName = (valid.lastName === undefined) ? '-' : valid.lastName;
          return true;
        } else {
          checkEmail = false;
          return true;
        }
      }
    })
})

class RegisterForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      type: 'password',
      score: 'null',
    };
    this.showHide = this.showHide.bind(this);
  }

  showHide(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      type: this.state.type === 'input' ? 'password' : 'input'
    })

  }

  componentWillReceiveProps(newProps) {
    if (this.props.isRegistering !== newProps.isRegistering) {
      newProps.setSubmitting(newProps.isRegistering);
    }
    
  }

  render() {
    const {
      handleSubmit,
      values,
      handleChange,
      handleBlur,
      touched,
      errors,
      classes,
    } = this.props;

    return (

      <div className="input-from">
        <div className="start-part">
          <div className="container">
            <div className="row">
              <div className="col-md-5 mt-4">
                <h3>Welcome</h3>
                <p className="text-muted">Let's setup your organization</p>
              </div>
              <div className="col-md-7">
                <ul className="progressbar">
                  <li className="active"><span>Info</span></li>
                  <li><span>Confirmation</span></li>
                  <li><span>Payment</span></li>
                  <li><span>Team</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Form onSubmit={handleSubmit}>
          <div className="col-md-6 float-left">
            <FormGroup >
              {/* <label >First Name</label> */}
              <InputGroup>
                <Input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  autoComplete="off"
                  className={`${checkEmail ? classes.inputsGray : ''}`}
                  readOnly={checkEmail}
                  tabIndex={(checkEmail) ? '12' : '1'}
                  value={(checkEmail) ? this.props.values.firstName = firstName : values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  valid={touched.firstName && !errors.firstName}
                  invalid={touched.firstName && !!errors.firstName}
                />
                {touched.firstName && <FormFeedback>{errors.firstName}</FormFeedback>}
              </InputGroup>
            </FormGroup>
            <FormGroup >
              {/* <label >Email</label> */}
              <InputGroup>
                <Input
                  bsSize="lg"
                  type="email"
                  name="email"
                  placeholder="Email"
                  autoComplete="off"
                  tabIndex="3"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  valid={touched.email && !errors.email}
                  invalid={touched.email && !!errors.email}
                />
                <Input
                  type="hidden"
                  name="checkEmail"
                  autoComplete="off"
                  tabIndex="12"
                  className="col-md-6 float-left"
                  value={this.props.values.checkEmail = checkEmail}
                  readOnly="readonly"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                {this.props.values.checkEmail > 0 && (
                  <div className={`${classes.errorEmail}`}> Email address is already registered. Enter your password to continue.</div>
                )}

                {touched.email && (
                  <FormFeedback>{errors.email}</FormFeedback>
                )}
              </InputGroup>
            </FormGroup>

            <FormGroup >
              {/* <label >Company Name</label> */}
              <InputGroup>
                <Input
                  type="text"
                  name="company"
                  placeholder="Company Name"
                  autoComplete="off"
                  tabIndex="4"
                  value={values.company}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  valid={touched.company && !errors.company}
                  invalid={touched.company && !!errors.company}
                />
                {touched.company && <FormFeedback>{errors.company}</FormFeedback>}
              </InputGroup>
            </FormGroup>

          </div>

          <div className="col-md-6 float-left">
            <FormGroup >
              {/* <label >Last Name</label> */}
              <InputGroup>
                <Input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className={`${checkEmail ? classes.inputsGray : ''}`}
                  readOnly={checkEmail}
                  autoComplete="off"
                  tabIndex={(checkEmail) ? '12' : '2'}
                  value={(checkEmail) ? this.props.values.lastName = lastName : values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  valid={touched.lastName && !errors.lastName}
                  invalid={touched.lastName && !!errors.lastName}
                />
                {touched.lastName && <FormFeedback>{errors.lastName}</FormFeedback>}
              </InputGroup>
            </FormGroup>
            <FormGroup >
              {/* <label >Password</label> */}
              <InputGroup>
                <Input
                  name="password"
                  type={this.state.type}
                  placeholder="Password"
                  tabIndex="5"
                  autoComplete="off"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  valid={touched.password && !errors.password}
                  invalid={touched.password && !!errors.password}
                />
                <span className="input-group-addon" onClick={this.showHide}><a id="showpass">{this.state.type === 'input' ? 'Hide Password' : 'Show Password'}</a></span>
                
                {/* {passwordCheck > 0 && (
                  <div className={`${classes.errorEmail}`}> Incorrect password please try again.</div>
                )} */}
                {touched.password && <FormFeedback>{errors.password}</FormFeedback>}
              </InputGroup>
            </FormGroup>

            <FormGroup >

              {/* <label>Confirm Password</label> */}
              <InputGroup>
                <Input
                  bsSize="lg"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  className={`${checkEmail ? classes.inputsGray : ''}`}
                  readOnly={checkEmail}
                  autoComplete="off"
                  tabIndex={(checkEmail) ? '12' : '6'}
                  value={(checkEmail) ? this.props.values.confirmPassword = this.props.values.password : values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  valid={touched.confirmPassword && !errors.confirmPassword}
                  invalid={touched.confirmPassword && !!errors.confirmPassword}
                />
                {touched.confirmPassword && (
                  <FormFeedback>{errors.confirmPassword}</FormFeedback>
                )}
              </InputGroup>
            </FormGroup>

          </div>
          <div className="clearfix"></div>
          <div className="col-md-12 text-center">
            <FormGroup >
              <Label check>
                <Input
                  type="checkbox"
                  name='termsAndAgree'
                  value={values.termsAndAgree}
                  tabIndex="7"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  valid={touched.termsAndAgree && !errors.termsAndAgree}
                  invalid={touched.termsAndAgree && !!errors.termsAndAgree} />{' '}
                I have read and agree to the&nbsp;
                <a target="_blank" href={TERMS_OF_USE} className="text-info">
                  &nbsp;<u>Terms of Use.</u>
                </a>
                {touched.termsAndAgree && (
                  <FormFeedback>{errors.termsAndAgree}</FormFeedback>
                )}
              </Label>
            </FormGroup>

          </div>
          <div className="clearfix"></div>
          <div className="text-center">
            <GradientButton
              color="primary"
              tabIndex="8"
              className="col-md-4"
              xs="12"
              sm={{ size: 12, offset: 4 }}
              md={{ size: 12, offset: 4 }}
              lg={{ size: 12, offset: 4 }}
              type="submit"
              // disabled={isSubmitting}
            >
              Create Account
          </GradientButton>
          </div>
        </Form>
      </div>
    );
  }
}
export default compose(
  withFormik({
    displayName: 'RegisterForm',
    mapPropsToValues: (props) => ({
      firstName: props.firstName || '',
      lastName: props.lastName || '',
      company: props.company || '',
      email: props.email || '',
      planType: props.planType || '',
      planId: props.planId || '',
      password: '',
      checkEmail: false,
      confirmPassword: '',
      termsAndAgree: false,
    }),
    validationSchema: yup.object().shape({
      firstName: yup.string().required("First Name is a required field"),
      termsAndAgree: yup.boolean().oneOf([true], 'Must accept Terms of Use'),
      lastName: yup.string().required("Last Name is a required field"),
      company: yup
        .string()
        .required("Company Name is a required field"),
      email: yup
        .string()
        .required("Email is a required field")
        .email('Please enter valid email address.')
        .ValidateEmail(''),
      password: yup
        .string()
        .required('Password is a required field')
        .min(6, 'Must be at least 6 characters long')
        .ValidatePassword('')
        .test('must-not-contain-first-name', 'Password does not meet complexity requirements', function () {
          if (this.parent.firstName !== undefined && this.parent.password !== undefined) {
            return !(new RegExp(this.parent.firstName.toLowerCase())).test(this.parent.password.toLowerCase());
          }
          return !(new RegExp(this.parent.firstName)).test(this.parent.password);
        })
        .test('must-not-contain-last-name', 'Password does not meet complexity requirements', function () {
          if (this.parent.lastName !== undefined && this.parent.password !== undefined) {
            return !(new RegExp(this.parent.lastName.toLowerCase())).test(this.parent.password.toLowerCase());
          }
          return !(new RegExp(this.parent.lastName)).test(this.parent.password);
        })
        .test('can-not-be-123456', 'Password Cannot be 123456', function () {
          return '123456' !== this.parent.password;
        })
        .test('can-not-be-abcdef', 'Password Cannot be abcdef', function () {
          if (this.parent.password !== undefined)
            return 'abcdef' !== this.parent.password.toLowerCase();
        })
        .test('can-not-be-password', 'Password Cannot be password', function () {
          if (this.parent.password !== undefined)
            return 'password' !== this.parent.password.toLowerCase();
        })
        .matches(/^[^\s]+$/, 'Password cannot include whitespaces'),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords do not match')
        .required('Confirm password is a required field'),
    }),
    handleSubmit: (values, { props }) => {
      if (passwordCheck) {
        props.handleWrongPasswordModal(values.email)
      }else{
        // console.log(values)
      props.onSubmit(values);
      }
    }
  }),
  injectSheet(styles)
)(RegisterForm);
