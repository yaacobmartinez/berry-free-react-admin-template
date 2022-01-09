/* eslint-disable no-plusplus */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
import React, { useCallback, useEffect, useState } from 'react';

// material-ui
import { Button, Chip, Dialog, DialogActions, Box, DialogContent, DialogTitle, FormControl, FormHelperText, IconButton, InputLabel, OutlinedInput, TextField, Typography, SwipeableDrawer, Grid, Select, MenuItem, Popover } from '@material-ui/core';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import axiosInstance from 'utils/axios';
import { Add, Close, CloudDownload, History, Save } from '@material-ui/icons';
import {DataGrid, GridToolbar} from '@mui/x-data-grid'
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import useScriptRef from 'hooks/useScriptRef';
import { makeStyles } from '@material-ui/styles';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { useDropzone } from 'react-dropzone';
import {useNavigate} from 'react-router'
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
    const navigate = useNavigate()
    const [categories, setCategories] = useState([])
    const [products, setProducts] = useState([])
    const [newCategory, setNewCategory] = useState(false)
    const [newProduct, setNewProduct] = useState(false)
    const [pageSize, setPageSize] = React.useState(10);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedPopUp, setSelectedPopUp] = useState(null)
    const [archivedOnly, setArchivedOnly] = useState(false)
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
            <NewProductDrawer open={newProduct} onClose={() => setNewProduct(false)} onChange={getProducts} categories={categories}/>
            // <NewProductDialog open={newProduct} onClose={() => setNewProduct(false)} onChange={getProducts} />
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
                <Chip size="small" label="Add Category" onClick={() => setNewCategory(true)} color="primary" icon={<Add />} style={{margin: 5}}/>
            </div>
        </div>
        <ProductPopover anchorEl={anchorEl} onClose={() => setAnchorEl(null)} product={selectedPopUp} />
        <Button color="primary" variant="contained" startIcon={<Add />} onClick={() => setNewProduct(true)} style={{marginRight: 20}}>Add New Product</Button>
        <Button color="primary" variant="outlined" startIcon={<History />} onClick={() => setArchivedOnly(!archivedOnly)}>
            Show {archivedOnly ? `All Products` : `Archived Products Only`}
        </Button>
        {
            products && (
                <DataGrid
                    style={{marginTop: 20}}
                    rows={products.filter(p => archivedOnly ? p.status !== "Active" : p.status === "Active")}
                    autoHeight 
                    rowHeight={35}
                    disableSelectionOnClick
                    onRowClick ={(e) => navigate(`/dashboard/product/${e.id}`)}
                    getRowId={(row) => row._id}
                    components={{
                        Toolbar: GridToolbar,
                    }}
                    columns={[
                        { 
                            field: 'name', 
                            headerName: 'Product',
                            minWidth: 250,
                            sortable: true,
                            renderCell:(row) => (
                            <div>
                                <Typography variant="body2" color="black"
                                    style={{cursor: 'pointer'}}
                                    component="h2"
                                    onMouseEnter={(e) => {setAnchorEl(e.currentTarget); setSelectedPopUp(row.row); }}
                                >
                                    {row.value}
                                </Typography>
                            </div>)
                                
                        },
                        { 
                            field: 'stocks', 
                            headerName: 'Stocks',
                            flex: 1,
                            minWidth: 100, 
                        },
                        { 
                            field: 'price', 
                            headerName: 'Price',
                            flex: 1,
                            minWidth: 80,
                            sortable: true,
                            renderCell:(row) => (
                            <div>
                                <Typography variant="body2">
                                    PHP {(parseFloat(row.row.initialPrice) +  parseFloat(row.row.markupPrice)).toFixed(2)}
                                </Typography>
                            </div>)
                                
                        },
                        { 
                            field: 'category', 
                            headerName: 'Category',
                            minWidth: 350, 
                        },
                    ]}
                    rowsPerPageOptions={[5, 10, 20]}
                    pagination
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                />
                )
            }
            
    </MainCard>
)};

const ProductPopover = ({anchorEl, onClose, product}) => {
    const [loading, setLoading] = useState(true)
    const [image, setImage] = useState(null)
    const productPrice = parseFloat(product?.initialPrice) + parseFloat(product?.markupPrice)
    useEffect(() => {
        setImage(null)
        setLoading(true)
        if (product?.media.length > 0) {
            const getImageLink = async () => {
                const {data} = await axiosInstance.get(`/products/image?path=${product.media[0]}`)
                console.log(data)
                setImage(data.link)
                setLoading(false)
            }
            getImageLink()
        }
    },[product?.media])
    return (
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'center',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            onClose={onClose}
            disableRestoreFocus
            >
                <div
                    style={{height: 250, width: 200, padding: 5,}}
                >

                    <img src={loading ? '/images/no-image.png' : image} alt="product_image" 
                        style={{
                            height: 190,
                            width: 190,
                            objectFit: 'cover', 
                            borderRadius: 5
                        }}/>
                    <Typography variant="caption" color="primary">{product?.name}</Typography><br/>
                    <Typography variant="caption" color="primary" style={{fontWeight: 'bold'}}>PHP{Number.isNaN(productPrice) ? `0.00`: productPrice.toFixed(2)}</Typography>
                    <IconButton onClick={onClose} size="small" color="primary" style={{background: '#f45b69', color: '#fff', position: 'absolute', top: 0, right: 0}}><Close fontSize="small"/></IconButton>
                </div>
        </Popover>
    )
}

const NewProductDrawer = ({open, onClose, onChange, categories}) => {
    const classes = useStyles()
    const [imageError, setImageError] = useState(false)
    const [files, setFiles] = useState([]);
    const {getRootProps, getInputProps} = useDropzone({
        accept: 'image/*',
        onDrop: acceptedFiles => {
        setFiles(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })));
        }
    });
    const {errors, handleChange, values, handleBlur, handleSubmit } = useFormik({
        initialValues: {
            name: '',
            description: '', 
            category: '',
            initialPrice: 0,
            markupPrice: 0,
            stocks: 0
        }, 
        validationSchema: Yup.object({
            name: Yup.string()
                .required('We need to know the product name.'),
            description: Yup.string(),
            category: Yup.string()
                .required('What is the category of the product.'),
            initialPrice: Yup.number()
                .typeError('Price must be a number')
                .required('How much was the suppliers price?')
                .max(1000, 'Price must be below or equal to 1000').default(1),
            markupPrice: Yup.number()
                .typeError('Price must be a number')
                .required('How much do we charge for the product?')
                .max(1000, 'Price must be below or equal to 1000').default(1),
            stocks: Yup.number()
                .typeError('Stock must be a number')
                .required('How much stock do we have?'),
        }), 
        onSubmit: async (values, {resetForm}) => {
            if (files.length < 1) {
                return setImageError(true)
            }
            setImageError(false)
            const form = new FormData()
            form.append("media", files[0]);
            form.append('name', values.name)
            form.append('description', values.description)
            form.append('category', values.category)
            form.append('initialPrice', values.initialPrice)
            form.append('markupPrice', values.markupPrice)
            form.append('stocks', values.stocks)

            const {data} = await axiosInstance.post(`/products`, form, {
                headers: {
                 'Content-Type': `multipart/form-data`,
                }
               })
            onChange()
            return onClose()
        }
    })
    
    
    const thumbsContainer = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16
      };
      
      const thumb = {
        display: 'inline-flex',
        borderRadius: 2,
        border: '1px solid #eaeaea',
        marginBottom: 8,
        marginRight: 8,
        width: 100,
        height: 100,
        padding: 4,
        boxSizing: 'border-box'
      };
      
      const thumbInner = {
        display: 'flex',
        minWidth: 0,
        overflow: 'hidden'
      };
      
      const img = {
        display: 'block',
        width: 'auto',
        height: '100%'
      };
    const thumbs = files.map((file) => (
        <div style={thumb} key={file.name}>
          <div style={thumbInner}>
            <img
              alt="thumb_image"
              src={file.preview}
              style={img}
            />
          </div>
            <Close 
                fontSize="small"
                onClick={() => {
                    console.log(files)
                    setFiles(files.filter(a => a.preview !== file.preview))
                }}
            />
        </div>
      ));

    useEffect(() => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);
    return (
        <SwipeableDrawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{minWidth: 320, width: 500, padding: 2, marginTop: 8}} component="form" onSubmit={handleSubmit}>
                <Typography variant="h4">Add New Product</Typography>
                <Grid container spacing={2} sx={{mt: 1}}>
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
                                value={values.category}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                name="category"
                                label="Category"
                                error={errors.category}
                            >
                                {categories.map((el, index) => (
                                    <MenuItem key={index} value={el._id}>{el.name}</MenuItem>
                                ))}
                            </Select>
                            {errors.category && (
                                <FormHelperText error>{errors.category}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel shrink>Product Images</InputLabel>
                        {imageError && (
                            <Typography variant="subtitle2">Please upload Product Images</Typography>
                        )}
                        <section style={{border: imageError ? `solid 1px red` : `solid 1px #eee`, padding: 10, textAlign: 'center'}}>
                            <div {...getRootProps({className: 'dropzone'})}>
                                <input {...getInputProps()} />
                                <p>Drag and drop some files here, or click to select files</p>
                                <CloudDownload style={{fontSize: 50}} />
                            </div>
                            <aside style={thumbsContainer}>
                                {thumbs}
                            </aside>
                        </section>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            fullWidth 
                            size="small" 
                            name="initialPrice" 
                            label="Initial Price" 
                            value={values.initialPrice}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={Boolean(errors.initialPrice)}
                            helperText={errors.initialPrice}
                            InputProps={{
                                endAdornment: `PHP`
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            required
                            fullWidth 
                            size="small" 
                            name="markupPrice" 
                            label="Mark Up Price" 
                            value={values.markupPrice}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={Boolean(errors.markupPrice)}
                            helperText={errors.markupPrice}
                            InputProps={{
                                endAdornment: `PHP`
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            fullWidth 
                            size="small" 
                            name="markupPrice" 
                            label="Final Price" 
                            value={parseFloat(values.markupPrice) + parseFloat(values.initialPrice)}
                            InputProps={{
                                readOnly: true, 
                                endAdornment: `PHP`
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            fullWidth 
                            size="small" 
                            name="stocks" 
                            label="Stocks" 
                            value={values.stocks}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={Boolean(errors.stocks)}
                            helperText={errors.stocks}
                        />
                    </Grid>
                </Grid>
                <Box sx={{position: 'fixed', top: 0, right: 0, width: 500, padding: 2, display: 'flex', justifyContent: 'space-between', background: '#fff', borderBottom: 'solid 1px #eee'}}>
                    <Button onClick={onClose} size="small">Cancel</Button>
                    <Button variant="contained" size="small" color='primary' type="submit" startIcon={<Save />}>Save Product</Button>
                </Box>
            </Box>
        </SwipeableDrawer>
    )
}

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