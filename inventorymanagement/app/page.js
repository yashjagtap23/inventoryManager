'use client'
import Image from "next/image";
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { Box, Modal, Stack, TextField, Typography, Button } from '@mui/material'
import { collection, deleteDoc, doc, query, getDocs, getDoc, setDoc, where } from 'firebase/firestore'

export default function Home() {

  // State variables to manage inventory data, modal open state, and item name input
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchTerm, setSearchTerm] = useState('') 

  // Function to update the inventory by fetching data from Firestore
  const updateInventory = async () => {
    // Create a query snapshot for the 'inventory' collection
    const snapshot = query(collection(firestore, 'inventory'))
    
    // Fetch the documents in the 'inventory' collection
    const docs = await getDocs(snapshot)
    const inventoryList = []
    // Loop through each document and add its data to the inventoryList array
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    // Update the state with the fetched inventory data
    setInventory(inventoryList)
  }

  // Function to add an item to the inventory
  const addItem = async (item) => {
    // Create a reference to the document for the given item in the 'inventory' collection
    const docRef = doc(collection(firestore, 'inventory'), item)
    // Fetch the document snapshot
    const docSnap = await getDoc(docRef)

    // If the document exists, increment the quantity
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      // If the document doesn't exist, create it with quantity 1
      await setDoc(docRef, { quantity: 1 })
    }

    // Update the inventory after adding the item
    await updateInventory()
  }

  // Function to remove an item from the inventory
  const removeItem = async (item) => {
    // Create a reference to the document for the given item in the 'inventory' collection
    const docRef = doc(collection(firestore, 'inventory'), item)
    // Fetch the document snapshot
    const docSnap = await getDoc(docRef)

    // If the document exists, decrement the quantity or delete the document if quantity is 1
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }

    // Update the inventory after removing the item
    await updateInventory()
  }

  // useEffect hook to update the inventory when the component mounts
  useEffect(() => {
    updateInventory()
  }, [])

  // Handlers to open and close the modal
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // Function to handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  } 

  // Filter inventory based on the search term
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )  

  return (
  <Box
    width="100vw"
    height="100vh"
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    gap={2}
  >
    {/* Modal to add new items to the inventory */}
    <Modal open={open} onClose={handleClose}>
      <Box
        position="absolute"
        top="50%"
        left="50%"
        width={400}
        bgcolor="white"
        border="2px solid #000000"
        boxShadow={24}
        p={4}
        display={"flex"}
        flexDirection="column"
        gap={3}
        sx={{ transform: 'translate(-50%,-50%)' }}
      >
        <Typography variant="h6">Add Item</Typography>
        <Stack width="100%" direction="row" spacing={2}>
          <TextField
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <Button
            variant="outlined"
            onClick={() => {
              addItem(itemName)
              setItemName('')
              handleClose()
            }}
          >
            ADD
          </Button>
        </Stack>
      </Box>
    </Modal>

    <Stack direction="row" spacing={2} >

      {/* Search bar */}
      <TextField
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search items"
        sx={{ marginBottom: '20px', width: '400px' }}
      />  

      {/* Button to open the modal */}
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
    </Stack>  

    {/* Display the inventory items */}
    <Box border="1px solid #333">
      <Box
        width="800px"
        height="100px"
        bgcolor="#ADD8E6"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h2" color="#333">Inventory Items</Typography>
      </Box>

      <Stack width="800px" height="300px" spacing={1} overflow="auto">
        {filteredInventory.map(({ name, quantity }) => (  
          <Box
            key={name}
            width="100%"
            minHeight="150px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"  // Ensures item name is aligned to the left and quantity/buttons to the right
            bgcolor="f0f0f0"
            padding={5}
          >
            {/* Item Name */}
            <Typography 
              variant="h2" 
              fontSize="60px" 
              color="#333" 
              textAlign="left"  // Aligns text to the left
              sx={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap' }}  // Ensures item name takes available space, with truncation if needed
            >
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>

            {/* Container for Quantity and Buttons */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between" // Ensures quantity and buttons are aligned properly
              sx={{ flex: 1 }}  // Ensures the container takes available space
            >
              {/* Quantity */}
              <Typography 
                variant="h2" 
                color="#333" 
                textAlign="center" 
                sx={{ flex: 1 }}  // Ensures quantity takes up space
              >
                {quantity}
              </Typography>

              {/* Buttons */}
              <Stack 
                direction="row" 
                spacing={2} 
                sx={{ flex: 1, justifyContent: 'flex-end' }}  // Aligns buttons to the right
              >
                <Button variant="contained" onClick={() => addItem(name)}>
                  Add
                </Button>
                <Button variant="contained" onClick={() => removeItem(name)}>
                  Remove
                </Button>
              </Stack>
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  </Box>
)
}