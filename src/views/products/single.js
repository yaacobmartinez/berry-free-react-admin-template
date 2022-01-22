/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-underscore-dangle */
import { FormControl, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography, 
        Avatar, Button, Backdrop, CircularProgress, Snackbar, Dialog, DialogContent, DialogActions, DialogTitle, DialogContentText } from '@material-ui/core'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import MainCard from 'ui-component/cards/MainCard'
import axiosInstance from 'utils/axios'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Add, Close, History, Print, QrCode, Save } from '@material-ui/icons'
import QRCode from 'qrcode.react'

function Product() {
    const {id} = useParams()
    const [product, setProduct] = useState(null)
    const [categories, setCategories] = useState(null)
    
    const getProduct = useCallback( async() => {
        const {data} = await axiosInstance.get(`/products/${id}`)
        setProduct(data.product)
        setCategories(data.categories)
    }, [id])
    useEffect(() => {
        getProduct()
    }, [getProduct])
    
    return (
        <MainCard title="Product Details">
            {product && (
                <ProductForm initialValues={product} categories={categories} />
            )}
        </MainCard>
    )
}

const ProductForm = ({initialValues, categories}) => {
    const [generateQR, setGenerateQR] = useState(false)
    const [mainImage, setMainImage] = useState(initialValues.media[0])
    const [images, setImages] = useState(initialValues.media)
    const [openArchive, setOpenArchive] = useState(false) 
    const digitsOnly = (value) => /^\d*[.{1}\d*]\d*$/.test(value) || value.length === 0
    const {errors, handleChange, values, handleBlur, handleSubmit, isSubmitting, status, setStatus } = useFormik({
        initialValues, 
        validationSchema: Yup.object({
            name: Yup.string()
                .required('We need to know the product name.'),
            description: Yup.string(),
            initialPrice: Yup.number()
                .typeError('Price must be a number')
                .required('How much was the suppliers price?')
                .max(1000, 'Price must be below or equal to 1000').default(1),
            markupPrice: Yup.number()
                .typeError('Price must be a number')
                .required('How much do we charge for the product?')
                .max(1000, 'Price must be below or equal to 1000').default(1),
            stocks: Yup.number()
                    .integer()
                    .typeError('Stock must be a number')
                    .required('How much stock do we have?'),
        }), 
        onSubmit: async (values, {setSubmitting, setStatus}) => {
            console.log(values)
            delete values.media
            setSubmitting(true)
            await axiosInstance.put(`/products/${values._id}`, values)
            setSubmitting(false)
            setStatus('success')
        }
    })

    const onImageRemove = async (image) => {
        const imagePath = decodeURIComponent(image.split('?AWSAccessKeyId')[0]).split('.com/')[1]
        if (images.length > 1) {
            const filteredImages = images.filter(m => m !== image)
            setImages(filteredImages)
            setMainImage(images[0])
            await axiosInstance.delete(`/products/${initialValues._id}?media=${imagePath}`)
        }
    }
    const handleUpload = async (e) => {
        const form = new FormData()
        form.append('media', e.target.files[0])

        const {data} = await axiosInstance.post(`/products/${initialValues._id}`, form, {
            headers: {
             'Content-Type': `multipart/form-data`,
            }
        })
        setImages([...images, data.image])
    }
    const [symbolsArr] = useState(["e", "E", "+", "-", "."]);
    return (
        <Grid container spacing={2} sx={{mt: 1}} component="form" onSubmit={handleSubmit}>
            {status === 'success' && (
                <Snackbar 
                    open={status === 'success'} 
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    autoHideDuration={6000}
                    onClose={() => setStatus(null)}
                    message="Product Updated"
                />
            )}
            <Backdrop open={isSubmitting} style={{zIndex: 2999}}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Grid item xs={12} sm={6}>
                <div style={{position: 'relative'}}>
                    <img src={mainImage} alt="main_image" 
                        style={{
                            border: 'solid 1px #eee', 
                            borderRadius: 5,
                            height: 300, 
                            width: '100%', 
                            objectFit: 'cover' 
                        }}
                        />
                    <IconButton 
                        size="small" 
                        style={{position: 'absolute', top: 3, right: 3, background: '#eee'}} 
                        color="primary"
                        onClick={() => onImageRemove(mainImage)}
                    >
                        <Close style={{fontSize: 12}}/>
                    </IconButton>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>    
                        {images?.map((m, index) => (
                            <img src={m} alt="product_image" key={index}
                                onClick={() => setMainImage(m)}
                                style={{
                                    marginRight: 5,
                                    border: 'solid 1px #eee', 
                                    borderRadius: 5,
                                    height: 50, 
                                    width: 50, 
                                    objectFit: 'cover',
                                    cursor: 'pointer'
                                }}
                            />
                        ))}
                    </div>
                    <input accept="image/*" style={{display: 'none'}} id="icon-button-file" type="file" onChange={handleUpload} />
                    <label htmlFor="icon-button-file">
                        <Avatar variant="rounded"><Add /></Avatar>
                    </label>
                </div>
            </Grid>
            <Grid item xs={12} sm={6} container spacing={2}>
                <Grid item xs={12}>
                    <TextField 
                        fullWidth 
                        size="small" 
                        name="name" 
                        label="Product Name" 
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        multiline
                        rows={3}
                        fullWidth 
                        size="small" 
                        name="description" 
                        label="Description" 
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(errors.description)}
                        helperText={errors.description}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel shrink>Category</InputLabel>
                        <Select
                            size="small"
                            name="category._id"
                            label="Category"
                            value={values.category._id}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.category}
                            readOnly
                        >
                            {categories?.map((el, index) => (
                                <MenuItem key={index} value={el._id}>{el.name}</MenuItem>
                            ))}
                        </Select>
                        {errors.category && (
                            <FormHelperText error>{errors.category}</FormHelperText>
                        )}
                    </FormControl>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField 
                    fullWidth 
                    size="small" 
                    name="initialPrice" 
                    label="Starting Price" 
                    value={values.initialPrice}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.initialPrice)}
                    helperText={errors.initialPrice}
                    InputProps={{
                        endAdornment: `PHP`
                    }}
                    onKeyDown={e => e.key === "-" && e.preventDefault()}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField 
                    required
                    fullWidth 
                    size="small" 
                    name="markupPrice" 
                    label="Markup Price" 
                    value={values.markupPrice}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.markupPrice)}
                    helperText={errors.markupPrice}
                    InputProps={{
                        endAdornment: `PHP`
                    }}
                    onKeyDown={e => e.key === "-" && e.preventDefault()}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField 
                    fullWidth 
                    size="small" 
                    name="sellingPrice" 
                    label="Selling Price" 
                    value={parseFloat(values.markupPrice) + parseFloat(values.initialPrice)}
                    InputProps={{
                        readOnly: true, 
                        endAdornment: `PHP`
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField 
                    type='number'
                    fullWidth 
                    size="small" 
                    name="stocks" 
                    label="Stocks" 
                    value={values.stocks}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.stocks)}
                    helperText={errors.stocks}
                    onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()}
                />
            </Grid>
            <Grid item xs={12} textAlign="right">
                <Button variant="outlined" size="small" color="primary" startIcon={<History />} style={{marginRight: 20}} 
                    onClick={() => setOpenArchive(true)}
                >
                    {initialValues.status === "Active" ? `Archive` : `Restore`} Product
                </Button>
                <ArchiveModal product={initialValues} open={openArchive} onClose={() => setOpenArchive(false)} />
                <Button variant="outlined" size="small" color="primary" startIcon={<QrCode />} style={{marginRight: 20}} onClick={() =>setGenerateQR(true)}>
                    Generate QR Code
                </Button>
                {generateQR && (
                    <QRCodeModal id={initialValues._id} open={generateQR} onClose={() => setGenerateQR(false)} />
                )}
                <Button type="submit" variant="contained" size="small" color="primary" startIcon={<Save />}>
                    Save Changes
                </Button>
            </Grid>
        </Grid>
    )
}

const ArchiveModal = ({product, open, onClose}) => {
    console.log(product)
    const isActive = product.status === "Active"
    const handleConfirm = async () => {
        const {data} = await axiosInstance.post(`/products/archive/${product._id}`, {status : product.status})
        console.log(data)
        window.location.reload("")
    }
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm">
            <DialogTitle>{isActive ? `Archive` : `Restore`} Product?</DialogTitle>
            <DialogContent> 
                <DialogContentText>
                    Are you sure you want to {isActive ? `archive`: `restore`} this product?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="primary" size="small" onClick={onClose}>No</Button>
                <Button variant="contained" color="error" size="small" onClick={handleConfirm}>Confirm</Button>
            </DialogActions>
        </Dialog>
    )
}

const QRCodeModal = ({id, open, onClose}) => {
    console.log(id)
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm">
            <DialogContent>
                <QRCode value={id} size={256}/><br/>
                {/* <Button variant="outlined" fullWidth size="small" color="primary" startIcon={<Print />}>
                    Print
                </Button> */}
            </DialogContent>
        </Dialog>
    )
}

export default Product
