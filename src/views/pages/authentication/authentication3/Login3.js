import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { useTheme } from '@material-ui/core/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery, Dialog, DialogTitle, DialogActions, DialogContent, TextField, Button } from '@material-ui/core';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import FirebaseLogin from '../firebase-forms/FirebaseLogin';
import Logo from 'ui-component/Logo';
import AuthFooter from 'ui-component/cards/AuthFooter';
import axiosInstance from '../../../../utils/axios'

// assets

//= ===============================|| AUTH3 - LOGIN ||================================//

const Login = () => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
    const [forgot, setForgot] = useState(false)
    
    return (
        <AuthWrapper1>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Grid item sx={{ mb: 1 }}>
                                        <RouterLink to="#">
                                            <img src="./images/logo.png" alt="logo" width="200px" height="auto" />
                                        </RouterLink>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FirebaseLogin login={3} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid item container direction="column" alignItems="center" xs={12}>
                                            <Typography
                                                onClick={() => setForgot(true)}
                                                variant="subtitle1"
                                                sx={{ textDecoration: 'none' }}
                                            >
                                                Forgot your password?
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
                    <AuthFooter />
                </Grid>
            </Grid>
            {forgot && (
                <ForgotPassword open={Boolean(forgot)} onClose={() => setForgot(false)} />
            )}
        </AuthWrapper1>
    );
};
const ForgotPassword = ({open, onClose}) => {
    const [email, setEmail] = useState('')
    const [sent, setSent] = useState(false)
    const handleSubmit = async () => {
        if (!email) return 
        const {data} = await axiosInstance.post(`/users/forgot`, {email})
        console.log(data)
        setSent(true)
    }
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Forgot your password?</DialogTitle>
            {sent ? (
                <DialogContent>
                    <Typography variant="body2" color="GrayText">We have sent reset password instructions to your email {email}</Typography>
                </DialogContent>
            ): (
                <DialogContent>
                    <Typography variant="body2" color="GrayText">Please enter in your email and we will send you password reset instructions</Typography>
                    <TextField value={email} onChange={({target}) => setEmail(target.value)} label="Email Address" fullWidth sx={{mt: 2}}/>
                </DialogContent>
            )}
            
            <DialogActions>
                {sent 
                    ? <Button size="small" variant='contained' color="primary" onClick={onClose}>Ok</Button>
                    : <Button size="small" variant='contained' color="primary" onClick={handleSubmit}>Reset Password</Button>
                }
                
            </DialogActions>
        </Dialog>
    )
}
export default Login;
