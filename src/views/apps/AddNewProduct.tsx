'use client';

import { useState, ChangeEvent } from 'react';

// NEXT
import { useRouter } from 'next/navigation';

// MATERIAL - UI
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';

// PROJECT IMPORTS
import MainCard from 'components/MainCard';



import TP from './timepic';

// CONSTANT
const prices = [
  {
    value: '1',
    label: '$ 100'
  },
  {
    value: '2',
    label: '$ 200'
  },
  {
    value: '3',
    label: '$ 300'
  },
  {
    value: '4',
    label: '$ 400'
  }
];





// ==============================|| ECOMMERCE - ADD PRODUCT ||============================== //

function AddNewProduct() {
  const router = useRouter();
  const [quantity, setQuantity] = useState('one');
  const [price, setPrice] = useState('1');
  const [status, setStatus] = useState('in stock');

  const handlePrice = (event: ChangeEvent<HTMLInputElement>) => {
    setPrice(event.target.value);
  };



  return (
    
    
    <MainCard>
     <TP />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <MainCard>
            <Grid container spacing={1} direction="column">
              <Grid item xs={12}>
                <InputLabel sx={{ mb: 1 }}>Product Name</InputLabel>
                <TextField placeholder="Enter product name" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <InputLabel sx={{ mb: 1 }}>Product Description</InputLabel>
                <TextField placeholder="Enter product description" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <InputLabel sx={{ mb: 1 }}>Category</InputLabel>
                <TextField placeholder="Enter your category" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <InputLabel sx={{ mb: 1 }}>Price</InputLabel>
                <TextField placeholder="Select Price" fullWidth select value={price} onChange={handlePrice}>
                  {prices.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        
      </Grid>
    </MainCard>
  );
}

export default AddNewProduct;
