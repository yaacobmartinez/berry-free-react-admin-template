import React, { useCallback, useEffect, useState } from 'react';

// material-ui
import { Button, Chip, Dialog, DialogActions, Box, DialogContent, DialogTitle, FormControl, FormHelperText, IconButton, InputLabel, OutlinedInput, TextField, Typography } from '@material-ui/core';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import axiosInstance from 'utils/axios';
import { Add } from '@material-ui/icons';
import {DataGrid, GridToolbar} from '@mui/x-data-grid'
import { Formik } from 'formik';
import * as Yup from 'yup';
import useScriptRef from 'hooks/useScriptRef';
import { makeStyles } from '@material-ui/styles';
import AnimateButton from 'ui-component/extended/AnimateButton';
/* eslint no-underscore-dangle: 0 */
/* eslint no-undef: "error" */
//= =============================|| SAMPLE PAGE ||==============================//
const useStyles = makeStyles((theme) => ({
    redButton: {
        fontSize: '1rem',
        fontWeight: 500,
        backgroundColor: theme.palette.grey[50],
        border: '1px solid',
        borderColor: theme.palette.grey[100],
        color: theme.palette.grey[700],
        textTransform: 'none',
        '&:hover': {
            backgroundColor: theme.palette.primary.light
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '0.875rem'
        }
    },
    signDivider: {
        flexGrow: 1
    },
    signText: {
        cursor: 'unset',
        margin: theme.spacing(2),
        padding: '5px 56px',
        borderColor: `${theme.palette.grey[100]} !important`,
        color: `${theme.palette.grey[900]}!important`,
        fontWeight: 500
    },
    loginIcon: {
        marginRight: '16px',
        [theme.breakpoints.down('sm')]: {
            marginRight: '8px'
        }
    },
    loginInput: {
        ...theme.typography.customInput
    }
}));

const Products = () => {
    const [categories, setCategories] = useState([])
    const [products, setProducts] = useState([])
    const [newCategory, setNewCategory] = useState(false)
    const [newProduct, setNewProduct] = useState(false)
    const getCategories = useCallback( async () => {
            const {data} = await axiosInstance.get(`/categories`)
            setCategories(data.categories)
        },
        [],
    )
    const getProducts = useCallback( async () => {
            const {data} = await axiosInstance.get(`/products`)
            setProducts(data.products)
        },
        [],
    )

    useEffect(() => {
        getCategories()
        getProducts()
    },[getCategories, getProducts])
    return (
    <MainCard title="Products">
        <Typography variant="caption" gutterBottom>
            Product Categories
        </Typography>
        <br/>
        {newCategory && (
            <NewCategoryDialog open={newCategory} onClose={() => setNewCategory(false)} onChange={getCategories} />
        )}
        {newProduct && (
            <NewProductDialog open={newProduct} onClose={() => setNewProduct(false)} onChange={getProducts} />
        )}
        <div 
            style={{
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: 10
            }}
        >
            <div>
                {categories?.map((category, index) => (
                    <Chip size="small" label={category.name} key={index} style={{margin: 5}} />
                ))}
            </div>
            <IconButton size="small" onClick={() => setNewCategory(true)}>
                <Add fontSize="9"/>
            </IconButton>
        </div>
        <Button color="primary" startIcon={<Add />} onClick={() => setNewProduct(true)}>Add New Product</Button>
        {
            products && (
                <DataGrid
                    rows={products}
                    autoHeight 
                    rowHeight={35}
                    getRowId={(row) => row._id}
                    components={{
                        Toolbar: GridToolbar,
                    }}
                    columns={[
                        { 
                            field: 'name', 
                            headerName: 'Product',
                            flex: 1,
                            minWidth: 250,
                            sortable: true,
                            renderCell:({id, value}) => <Typography variant="body2" color="black">{value}</Typography>
                                
                        },
                        { 
                            field: 'stocks', 
                            headerName: 'Stocks',
                            flex: 1,
                            minWidth: 350, 
                        },
                        { 
                            field: 'category', 
                            headerName: 'Category',
                            flex: 1,
                            minWidth: 350, 
                        },
                    ]}
                />
            )
        }
    </MainCard>
)};

const NewProductDialog = ({open, onClose, onChange}) => {
    const classes = useStyles();
    const scriptedRef = useScriptRef();
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={{
                        name: '',
                        description: '',
                        category: '',
                        price: 0,
                        stocks: 0
                    }}
                    validationSchema={Yup.object().shape({
                        name: Yup.string().required('Product Name is required'),
                        description: Yup.string(),
                        category: Yup.string(),
                        price: Yup.number().required('Price is required'),
                        stocks: Yup.number().required('Stocks is required'),
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        try {
                            if (scriptedRef.current) {
                                const {data} = await axiosInstance.post('/products', {...values, category: 'Test Category'})
                                if (!data.success) {
                                    setErrors('name', data.message)
                                }else{
                                    console.log(data)
                                    onClose()
                                    onChange()
                                    setStatus({ success: true });
                                    setSubmitting(false);
                                }
                            }
                        } catch (err) {
                            console.error(err);
                            if (scriptedRef.current) {
                                setStatus({ success: false });
                                setErrors({ submit: err.message });
                                setSubmitting(false);
                            }
                        }
                    }}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                        <form noValidate onSubmit={handleSubmit} >
                            <FormControl fullWidth error={Boolean(touched.name && errors.name)} className={classes.loginInput}>
                                <InputLabel htmlFor="outlined-adornment-email-login">Product</InputLabel>
                                <OutlinedInput
                                    value={values.name}
                                    name="name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    label="Product"
                                    inputProps={{
                                        classes: {
                                            notchedOutline: classes.notchedOutline
                                        }
                                    }}
                                />
                                {touched.name && errors.name && (
                                    <FormHelperText error >
                                        {' '}
                                        {errors.name}{' '}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <FormControl fullWidth error={Boolean(touched.description && errors.description)} className={classes.loginInput}>
                                <InputLabel htmlFor="outlined-adornment-email-login">Description</InputLabel>
                                <OutlinedInput
                                    value={values.description}
                                    name="description"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    label="Description"
                                    inputProps={{
                                        classes: {
                                            notchedOutline: classes.notchedOutline
                                        }
                                    }}
                                />
                                {touched.description && errors.description && (
                                    <FormHelperText error >
                                        {' '}
                                        {errors.description}{' '}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <FormControl fullWidth error={Boolean(touched.price && errors.price)} className={classes.loginInput}>
                                <InputLabel htmlFor="outlined-adornment-email-login">Price</InputLabel>
                                <OutlinedInput
                                    value={values.price}
                                    name="price"
                                    type="number"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    label="Price"
                                    inputProps={{
                                        classes: {
                                            notchedOutline: classes.notchedOutline
                                        }
                                    }}
                                />
                                {touched.price && errors.price && (
                                    <FormHelperText error >
                                        {' '}
                                        {errors.price}{' '}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <FormControl fullWidth error={Boolean(touched.stocks && errors.pristocksce)} className={classes.loginInput}>
                                <InputLabel htmlFor="outlined-adornment-email-login">Stocks</InputLabel>
                                <OutlinedInput
                                    value={values.stocks}
                                    name="stocks"
                                    type="number"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    label="Price"
                                    inputProps={{
                                        classes: {
                                            notchedOutline: classes.notchedOutline
                                        }
                                    }}
                                />
                                {touched.stocks && errors.stocks && (
                                    <FormHelperText error >
                                        {' '}
                                        {errors.stocks}{' '}
                                    </FormHelperText>
                                )}
                            </FormControl>

                            {errors.submit && (
                                <Box
                                    sx={{
                                        mt: 3
                                    }}
                                >
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Box>
                            )}

                            <Box
                                sx={{
                                    mt: 2
                                }}
                            >
                                <AnimateButton>
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                    >
                                        Add Product
                                    </Button>
                                </AnimateButton>
                            </Box>
                        </form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    )
}

const NewCategoryDialog = ({open, onClose, onChange}) => {
    
    const [categoryName, setCategoryName] = useState('')
    const [hasError, setHasError] = useState('')
    const [loading, setLoading] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!categoryName) return setHasError('Name cannot be empty.')
        setLoading(true)
        const res = await axiosInstance.post(`/categories`, 
        {
            name: categoryName, 
        })
        console.log(res.data)
        onChange()
        return onClose()
    }
    return (
        <Dialog maxWidth="sm" fullWidth open={open} onClose={onClose} component="form" onSubmit={handleSubmit}>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogContent style={{padding: 20}}>
                <TextField 
                    fullWidth
                    label="Category Name" 
                    value={categoryName} 
                    onChange={({target}) => setCategoryName(target.value)}
                    error={Boolean(hasError)}
                    helperText={hasError}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" size="small" disabled={loading} onClick={onClose}>Cancel</Button>
                <Button variant="contained" size="small" type="submit" disabled={loading} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    )
}

export default Products;