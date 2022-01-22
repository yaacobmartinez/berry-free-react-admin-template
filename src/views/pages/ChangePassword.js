import { Box, Button, Grid, Link, Paper, TextField, Typography } from '@material-ui/core';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import * as Yup from 'yup'
import jwt from 'jsonwebtoken'
import axiosInstance from 'utils/axios';

function useQuery() {
    const { search } = useLocation();
  
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

function ChangePassword() {
    const navigate = useNavigate()
    const query = useQuery();
    const [success, setSuccess] = useState(false)
    const token = query.get('token')
    const decoded =  jwt.verify(token, 'JN*AeVwgQkC@P3');

    const {values, handleChange, handleBlur, errors, handleSubmit} = useFormik({
        initialValues: {
            password: '',
            confirm: '',
        }, 
        validationSchema: Yup.object({
            password: Yup.string()
                        .required('Please Enter your password')
                        .matches(
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
                            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
                        ),
            confirm: Yup
              .string()
              .required('Passwords must match')
              .oneOf([Yup.ref("password"), null], "Passwords must match")
        }), 
        onSubmit: async (values,{setErrors}) => {
            if (decoded) {
                if (!decoded.id){
                    setErrors({password: 'Your link is invalid, please request a new password reset.'})
                }
                const form = ({...values, id: decoded.id})
                const {data} = await axiosInstance.post(`/users/resetpassword`, form)
                console.log(data)
                return setSuccess(true);
            }
            return console.log('invalid Token');
        }
    })
  return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: 500}}>
            <Paper elevation={2} sx={{p: 2}} >
                <Grid container spacing={2}>
                    {decoded ? (
                        <Grid item xs={12}>
                            {!success ? (
                                <Box component="form" onSubmit={handleSubmit} noValidate sx = {{ mt: 1, padding: 2, width: 500 }}>
                                    <Typography variant="h6">Create a new Password</Typography>
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        required fullWidth
                                        label="New Password"
                                        name="password"
                                        type="password"
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(errors.password)}
                                        helperText={errors.password}
                                    />
                                    <TextField
                                        size="small"
                                        margin="normal"
                                        required fullWidth
                                        label="Confirm Password"
                                        name="confirm"
                                        type="password"
                                        value={values.confirm}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(errors.confirm)}
                                        helperText={errors.confirm}
                                    />
                                    <Button type="submit" fullWidth variant="contained" sx= {{mt: 3, mb: 2}}>
                                        Save Password
                                    </Button>
                                </Box>
                            ) : (
                                <Box sx = {{ mt: 1, padding: 2, width: 500 }}>
                                    <Typography variant="h6">Password Changed.</Typography>
                                    <Typography variant="subtitle2" color="GrayText">Please sign in with your newly created password.</Typography>
                                    <Button variant='contained' onClick={()=> navigate(`/`)}>Click here to sign in.</Button>
                                </Box>
                            )}
                        
                    </Grid>
                    ) : (
                        <Grid item xs={12}>
                            <Box  sx = {{ mt: 1, padding: 2, width: 500 }}>
                                <Typography variant="h6">Reset Link Expired</Typography>
                                <Typography variant="caption" color="GrayText">
                                    Your reset password link has expired, because you have not used it. Reset Password link expires in 30 minutes. If you need another link, click on Reset Password.
                                </Typography>
                                <Button fullWidth variant="contained" color="primary" sx={{mt: 5}} component={Link} to="/forgot-password">
                                    Reset Password
                                </Button>
                            </Box>
                        </Grid>
                    )}
                    
                </Grid>
            </Paper>
        </div>
    );
}

export default ChangePassword;
