import React, { useMemo, useState, useEffect } from 'react';
import axios from "axios"; 

// --- MUI Components ---
import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    Grid, 
    CircularProgress, 
    Container, 
    Alert,
    IconButton,
    Divider,
    Button, // Added for action buttons
    Table, // Added for the list
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper // Used for table container background
} from '@mui/material';

// --- MUI Icons ---
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import ListAltIcon from '@mui/icons-material/ListAlt'; // For Total Items
import CheckIcon from '@mui/icons-material/Check'; // For Accepted Items
import CloseIcon from '@mui/icons-material/Close'; // For Rejected Items
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'; // For Pending Items


// --- Dashboard Card Component (MUI implementation) ---
const StatCard = ({ title, count, icon: Icon, color }) => (
    <Card 
        sx={{ 
            minWidth: 275, 
            borderRadius: 3, 
            boxShadow: 3,
            transition: 'transform 0.3s',
            '&:hover': {
                transform: 'scale(1.02)',
            }
        }}
    >
        <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography 
                        color="text.secondary" 
                        gutterBottom 
                        variant="overline" 
                        sx={{ fontSize: 12, fontWeight: 'bold' }}
                    >
                        {title}
                    </Typography>
                    <Typography 
                        variant="h3" 
                        component="div" 
                        sx={{ fontWeight: 'bold' }}
                        color={color}
                    >
                        {count}
                    </Typography>
                </Box>
                {/* MUI colors support an object form for main color: {color}.main or use .50 for background */}
                <Box sx={{ p: 2, borderRadius: '50%', bgcolor: `${color}.50`, color: color }}>
                    <Icon sx={{ fontSize: 40, color: color }} />
                </Box>
            </Box>
        </CardContent>
    </Card>
);

// --- Main App Component ---
export default function AdminDashboard() {
    // --- API Endpoints ---
    const USER_API_URL = 'http://localhost:4000/users/get-users/';
    const ITEMS_API_URL = 'http://localhost:4000/items/get-items'; 
    // Base URL for PATCH actions: e.g., /items/ITEM_ID/approved
    const APPROVE_ITEM_API_BASE = 'http://localhost:4000/items/'; 
    
    // --- State for User Data ---
    const [userData, setUserData] = useState({ users: [], totalUsers: 0 });
    const [userLoading, setUserLoading] = useState(true);
    const [userError, setUserError] = useState(null);

    // --- State for Item Data ---
    const [itemData, setItemData] = useState({ items: [], totalItems: 0 });
    const [itemLoading, setItemLoading] = useState(true);
    const [itemError, setItemError] = useState(null);

    const token = localStorage.getItem("token");

    // --- API Fetching Functions ---

    const fetchUsers = async () => {
        setUserLoading(true);
        setUserError(null);
        try {
            const response = await axios.get(USER_API_URL, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = response.data;
            setUserData({
                users: Array.isArray(data.users) ? data.users : [],
                totalUsers: data.totalUsers || (Array.isArray(data.users) ? data.users.length : 0),
            });
        } catch (err) {
            console.error("Error fetching user data:", err);
            const status = err.response ? err.response.status : 'Network';
            const message = err.response?.data?.msg || err.message;
            setUserError(
                `Failed to load user data. Status: ${status}. Details: ${message}`
            );
        } finally {
            setUserLoading(false);
        }
    };

    const fetchItems = async () => {
        setItemLoading(true);
        setItemError(null);
        try {
            const response = await axios.get(ITEMS_API_URL, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = response.data;
            setItemData({
                items: Array.isArray(data.items) ? data.items : [],
                totalItems: data.totalItems || (Array.isArray(data.items) ? data.items.length : 0),
            });
        } catch (err) {
            console.error("Error fetching item data:", err);
            const status = err.response ? err.response.status : 'Network';
            const message = err.response?.data?.msg || err.message;
            setItemError(
                `Failed to load item data. Status: ${status}. Details: ${message}`
            );
        } finally {
            setItemLoading(false);
        }
    };

    // Combined data fetcher for the refresh button
    const fetchData = () => {
        fetchUsers();
        fetchItems();
    };


    // Effect to fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []); 
    
    // --- Item Action Handler (NEW) ---
    const handleItemAction = async (itemId, actionType) => {
        if (!token) {
            // Using alert() is discouraged, but used here for simple, immediate feedback
            alert("Authentication token not found. Please log in."); 
            return;
        }

        // Construct the specific PATCH endpoint: e.g., /items/68da85bb.../approved
        const endpoint = `${APPROVE_ITEM_API_BASE}${itemId}/${actionType}`;
        
        // Start loading sequence to disable buttons and show spinner
        setItemLoading(true); 
        
        try {
            const response = await axios.patch(endpoint, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                console.log(`${actionType} successful for item ${itemId}`);
                // Refresh all data to update counts and the moderation table
                fetchData(); 
            } else {
                console.error(`Failed to ${actionType}:`, response.data);
                // Using alert() is discouraged, but used here for simple, immediate feedback
                alert(`Action failed: ${response.data.message || 'Unknown error'}`);
            }

        } catch (err) {
            console.error(`Error during ${actionType} action:`, err);
            // Using alert() is discouraged, but used here for simple, immediate feedback
            alert(`Network error during ${actionType}: ${err.message}`);
        } finally {
             // We rely on the successful fetchData() call to set loading to false.
             // If there was an error, we manually turn it off.
             setItemLoading(false);
        }
    };

    // --- User Data Calculations (useMemo) ---
    const { totalUsers, activatedUsers, notActivatedUsers } = useMemo(() => {
        const users = userData.users;
        const total = userData.totalUsers;
        
        const activated = users.filter(user => user.status === 'Activated').length;
        const notActivated = total - activated; 

        return {
            totalUsers: total,
            activatedUsers: activated,
            notActivatedUsers: notActivated
        };
    }, [userData]); 

    // --- Item Data Calculations (useMemo) ---
    const { totalItems, acceptedItems, rejectedItems, pendingItems } = useMemo(() => {
        const items = itemData.items;
        const total = itemData.totalItems;
        
        const accepted = items.filter(item => item.status === 'Approved').length;
const rejected = items.filter(item => item.status === 'Rejected').length;
const pending = total - accepted - rejected; 


        return {
            totalItems: total,
            acceptedItems: accepted,
            rejectedItems: rejected,
            pendingItems: pending
        };
    }, [itemData]);

    // --- Card Configuration Data ---
    const userCardData = [
        { title: "Total Users", count: totalUsers, icon: PeopleAltIcon, color: "primary" },
        { title: "Activated Accounts", count: activatedUsers, icon: CheckCircleOutlineIcon, color: "success" },
        { title: "Pending Activation", count: notActivatedUsers, icon: CancelOutlinedIcon, color: "error" },
    ];

    const itemCardData = [
        { title: "Total Items", count: totalItems, icon: ListAltIcon, color: "default" },
        { title: "Accepted Items", count: acceptedItems, icon: CheckIcon, color: "success" },
        { title: "Rejected Items", count: rejectedItems, icon: CloseIcon, color: "error" },
        { title: "Pending Items", count: pendingItems, icon: HourglassEmptyIcon, color: "warning" },
    ];

    const overallLoading = userLoading || itemLoading;

    // Filter pending items for the moderation table
    const pendingItemsList = itemData.items.filter(item => item.status === 'Pending');
    
    // --- Item Moderation Table Component ---
 // ... (rest of your imports and component logic) ...

// --- Item Moderation Table Component ---
const ModerationTable = () => {
    if (pendingItemsList.length === 0) {
        return (
            <Alert severity="info" sx={{ mt: 3, mb: 3 }} variant="outlined">
                No items currently require moderation.
            </Alert>
        );
    }

    return (
        <TableContainer component={Paper} elevation={2} sx={{ mt: 3, mb: 3 }}>
            <Table size="small">
                <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Image</TableCell> {/* New column */}
                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {pendingItemsList.map((item) => (
                        <TableRow 
                            key={item._id} 
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">{item.name}</TableCell>
                            <TableCell>{item.type}</TableCell>
                            <TableCell>{item.location}</TableCell>
                            <TableCell>{item.date}</TableCell>
                            {/* NEW: Image Cell */}
                            <TableCell>
                                {item.img && item.img.length > 0 ? (
                                    <img 
                                        src={item.img[0]} 
                                        alt={item.name} 
                                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        No Image
                                    </Typography>
                                )}
                            </TableCell>
                            <TableCell align="center">
                                <Button 
                                    variant="contained" 
                                    color="success" 
                                    size="small" 
                                    startIcon={<CheckIcon />}
                                    onClick={() => handleItemAction(item._id, 'approved')}
                                    disabled={overallLoading}
                                    sx={{ mr: 1, minWidth: 100 }}
                                >
                                    Approve
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    color="error" 
                                    size="small" 
                                    startIcon={<CloseIcon />}
                                    onClick={() => handleItemAction(item._id, 'rejected')}
                                    disabled={overallLoading}
                                    sx={{ minWidth: 100 }}
                                >
                                    Reject
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

    return (
        <Container maxWidth="lg" sx={{ pt: 4, pb: 4, minHeight: '100vh', bgcolor: '#f4f6f8' }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Admin Dashboard Overview
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Monitoring User & Item Statuses
                    </Typography>
                </Box>
                {/* Refresh button calls the combined fetch function */}
                <IconButton onClick={fetchData} disabled={overallLoading} color="primary" size="large">
                    <RefreshIcon sx={{ 
                        animation: overallLoading ? 'spin 1s linear infinite' : 'none',
                        '@keyframes spin': {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' },
                        }
                    }} />
                </IconButton>
            </Box>

            {/* --- USER MANAGEMENT SECTION --- */}
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 2, mt: 4 }}>
                User Management
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {userLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: 150, bgcolor: 'white', borderRadius: 3, boxShadow: 1, mb: 3 }}>
                    <CircularProgress size={30} sx={{ mr: 2 }} />
                    <Typography variant="h6" color="text.secondary">Loading user data...</Typography>
                </Box>
            ) : userError ? (
                <Alert severity="error" sx={{ mb: 3, boxShadow: 1 }}>
                    <Typography variant="h6">User API Error:</Typography>
                    <Typography variant="body2">{userError}</Typography>
                </Alert>
            ) : (
                <Grid container spacing={3} sx={{ mb: 6 }}>
                    {userCardData.map((data, index) => (
                        <Grid item xs={12} sm={6} md={4} key={`user-stat-${index}`}>
                            <StatCard {...data} />
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* --- ITEM MANAGEMENT SECTION (STATS) --- */}
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                Item Management Stats
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {itemLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: 150, bgcolor: 'white', borderRadius: 3, boxShadow: 1, mb: 3 }}>
                    <CircularProgress size={30} sx={{ mr: 2 }} />
                    <Typography variant="h6" color="text.secondary">Loading item data...</Typography>
                </Box>
            ) : itemError ? (
                <Alert severity="error" sx={{ mb: 3, boxShadow: 1 }}>
                    <Typography variant="h6">Item API Error:</Typography>
                    <Typography variant="body2">{itemError}</Typography>
                </Alert>
            ) : (
                <Grid container spacing={3}>
                    {itemCardData.map((data, index) => (
                        <Grid item xs={12} sm={6} md={3} key={`item-stat-${index}`}>
                            <StatCard {...data} />
                        </Grid>
                    ))}
                </Grid>
            )}

            
            {/* --- ITEM MANAGEMENT SECTION (MODERATION TABLE) --- */}
            {!itemLoading && !itemError && (
                <>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 2, mt: 6 }}>
                        Pending Item Moderation ({pendingItemsList.length} Items)
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    <ModerationTable />
                </>
            )}


            
        </Container>
    );
}
